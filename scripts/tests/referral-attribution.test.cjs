const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync(require('node:path').join(__dirname, '../../src/lib/referral/attribution.ts'), 'utf8');
function fixture({ blockedCookies = false } = {}) {
  let cookie = '';
  const storage = new Map();
  const document = { get cookie() { return cookie; }, set cookie(value) { if (!blockedCookies) cookie = value.includes('Max-Age=0;') ? '' : value.split(';')[0]; } };
  const exports = {};
  const context = { exports, document, location: { protocol: 'https:' }, localStorage: { getItem: k => storage.get(k) || null, setItem: (k, v) => storage.set(k, v), removeItem: k => storage.delete(k) }, Date, Promise };
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, context);
  return { api: exports, storage, document };
}
const codeA = '1234567890abcdef';
const codeB = 'abcdef1234567890';
test('invalid referrals are never saved', () => { const { api } = fixture(); assert.equal(api.rememberReferral('anything'), undefined); assert.equal(api.pendingReferral(), undefined); });
test('first valid referral wins across page visits', () => { const { api } = fixture(); api.rememberReferral(codeA); api.rememberReferral(codeB); assert.equal(api.pendingReferral(), codeA); });
test('local storage preserves referral when cookies are blocked, and expires it', () => {
  const { api, storage } = fixture({ blockedCookies: true }); api.rememberReferral(codeA); assert.equal(api.pendingReferral(), codeA);
  storage.set('ndotoni:referral', JSON.stringify({ code: codeA, expiresAt: Date.now() - 1 })); assert.equal(api.pendingReferral(), undefined);
});
test('failed account attachment keeps the referral for a retry', async () => { const { api } = fixture(); api.rememberReferral(codeA); await assert.rejects(api.syncReferral(async () => { throw new Error('offline'); })); assert.equal(api.pendingReferral(), codeA); });
test('simultaneous requests attach once and clear the pending referral on success', async () => {
  const { api } = fixture(); api.rememberReferral(codeA); let calls = 0;
  await Promise.all([api.syncReferral(async () => { calls++; }), api.syncReferral(async () => { calls++; })]);
  assert.equal(calls, 1); assert.equal(api.pendingReferral(), undefined);
});
