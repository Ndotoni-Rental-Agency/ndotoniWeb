import { BusyBlock, BusyStore } from './types';

// ─── Mock data using precise time ranges ──────────────────────────────────────
export function makeMockBlocks(dayOffsets: { d: number; startH: number; startM: number; endH: number; endM: number }[]): BusyBlock[] {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  monday.setHours(0,0,0,0);
  return dayOffsets.map(({ d, startH, startM, endH, endM }, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + d);
    return {
      id: `mock_${i}`,
      startUtc: new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate(), startH, startM)).toISOString(),
      endUtc:   new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate(), endH, endM)).toISOString(),
    };
  });
}

export const MOCK_BUSY: BusyStore = {
  'amina@ndotoni.com': {
    name: 'Amina Hassan', role: 'Co-founder',
    blocks: makeMockBlocks([
      { d:0, startH:5, startM:0,  endH:6,  endM:30 },
      { d:1, startH:4, startM:15, endH:5,  endM:45 },
      { d:2, startH:5, startM:30, endH:7,  endM:0  },
      { d:3, startH:7, startM:0,  endH:8,  endM:15 },
      { d:4, startH:4, startM:0,  endH:5,  endM:30 },
    ]),
    updatedAt: new Date().toISOString(),
  },
  'david@ndotoni.com': {
    name: 'David Mwanga', role: 'Tech Lead',
    blocks: makeMockBlocks([
      { d:0, startH:6, startM:0,  endH:7,  endM:30 },
      { d:1, startH:6, startM:30, endH:8,  endM:0  },
      { d:2, startH:4, startM:45, endH:5,  endM:15 },
      { d:3, startH:4, startM:0,  endH:5,  endM:30 },
      { d:4, startH:6, startM:0,  endH:7,  endM:0  },
    ]),
    updatedAt: new Date().toISOString(),
  },
  'zara@ndotoni.com': {
    name: 'Zara Kimani', role: 'Marketing',
    blocks: makeMockBlocks([
      { d:0, startH:4, startM:0,  endH:5,  endM:30 },
      { d:2, startH:4, startM:30, endH:6,  endM:0  },
      { d:3, startH:6, startM:15, endH:7,  endM:45 },
      { d:4, startH:4, startM:0,  endH:6,  endM:12 },
      { d:6, startH:5, startM:0,  endH:6,  endM:0  },
    ]),
    updatedAt: new Date().toISOString(),
  },
};
