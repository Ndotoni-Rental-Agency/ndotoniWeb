'use client';

import { useState } from 'react';
import { GraphQLClient } from '@/lib/graphql-client';
import { initiateWhatsAppAssociation, confirmWhatsAppAssociation } from '@/graphql/mutations';

interface Props {
  existingWhatsappNumber?: string;
}

type Step = 'input' | 'code' | 'success';

/** Normalize a phone number to international format (Tanzania default for local numbers) */
function normalizePhone(input: string): string {
  let digits = input.replace(/\D/g, '');
  // Only apply TZ normalization if it looks like a local TZ number
  // (starts with 0 and is 10 digits, or is exactly 9 digits starting with 6/7)
  if (digits.startsWith('0') && digits.length === 10) {
    digits = '255' + digits.slice(1);
  } else if (digits.length === 9 && /^[67]/.test(digits)) {
    digits = '255' + digits;
  }
  return digits;
}

export default function WhatsAppAssociation({ existingWhatsappNumber }: Props) {
  const [step, setStep] = useState<Step>('input');
  const [phone, setPhone] = useState(existingWhatsappNumber || '');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleInitiate = async () => {
    if (!phone.trim()) return;
    setLoading(true);
    setError(null);

    const normalized = normalizePhone(phone);

    if (normalized.length < 10 || normalized.length > 15) {
      setError('Please enter a valid phone number with country code (e.g. 255789123456)');
      setLoading(false);
      return;
    }

    try {
      const result = await GraphQLClient.executeAuthenticated<{
        initiateWhatsAppAssociation: { success: boolean; message: string };
      }>(initiateWhatsAppAssociation, { whatsappNumber: normalized });

      setPhone(normalized); // Show the normalized version
      setMessage(result.initiateWhatsAppAssociation.message);
      setStep('code');
    } catch (e: any) {
      const raw = e?.errors?.[0]?.message || e?.message || '';
      // Show user-friendly message instead of raw GraphQL errors
      const msg = raw.includes('non-nullable') || raw.includes('Cannot return null')
        ? 'This feature is not available yet. Please try again later.'
        : raw || 'Failed to send code';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!code.trim() || code.length !== 5) return;
    setLoading(true);
    setError(null);

    try {
      const result = await GraphQLClient.executeAuthenticated<{
        confirmWhatsAppAssociation: { success: boolean; message: string };
      }>(confirmWhatsAppAssociation, { whatsappNumber: phone.trim(), code: code.trim() });

      setMessage(result.confirmWhatsAppAssociation.message);
      setStep('success');
    } catch (e: any) {
      const raw = e?.errors?.[0]?.message || e?.message || '';
      const msg = raw.includes('non-nullable') || raw.includes('Cannot return null')
        ? 'This feature is not available yet. Please try again later.'
        : raw || 'Invalid or expired code. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
        <div className="text-center">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Account Linked</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">🔗</span>
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Link WhatsApp</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Connect your WhatsApp to transfer listings you created via WhatsApp
          </p>
        </div>
      </div>

      {step === 'input' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              WhatsApp Number
            </label>
            <input
              className="input"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 255712345678"
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Include country code without + sign
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <button
            onClick={handleInitiate}
            disabled={loading || !phone.trim()}
            className="w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-700 disabled:bg-green-300 dark:disabled:bg-green-800 text-white text-sm font-semibold transition-colors"
          >
            {loading ? 'Sending…' : 'Send Code'}
          </button>

          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            We&apos;ll try to send a code to your WhatsApp. If it doesn&apos;t arrive, send &quot;associate&quot; to our WhatsApp number.
          </p>

          <button
            onClick={() => setStep('code')}
            className="w-full py-2 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
          >
            I already have a code
          </button>
        </div>
      )}

      {step === 'code' && (
        <div className="space-y-3">
          {message && (
            <p className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-xl px-4 py-2">{message}</p>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              5-Digit Code
            </label>
            <input
              className="input text-center text-2xl tracking-widest font-mono"
              type="text"
              maxLength={5}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="00000"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <button
            onClick={handleConfirm}
            disabled={loading || code.length !== 5}
            className="w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-700 disabled:bg-green-300 dark:disabled:bg-green-800 text-white text-sm font-semibold transition-colors"
          >
            {loading ? 'Verifying…' : 'Link Account'}
          </button>

          <button
            onClick={() => { setStep('input'); setError(null); setCode(''); }}
            className="w-full py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ← Change number
          </button>
        </div>
      )}
    </div>
  );
}
