'use client';

import { useEffect, useRef, useState } from 'react';

interface ScriptLine {
  text: string;
  isBeat: boolean;
}

const SCRIPT: ScriptLine[] = [
  { text: "Every day, people across Tanzania search for housing through WhatsApp groups, Instagram posts, and word of mouth —", isBeat: false },
  { text: "and because none of it is verified, you never really know who you can trust before handing over your money.", isBeat: false },
  { text: "— slow down, this is the emotional core —", isBeat: true },
  { text: "That's exactly what happened to my sister Loveness.", isBeat: false },
  { text: "When she moved to Dar es Salaam for university, she didn't know anyone in the city, so she found an agent through a WhatsApp group.", isBeat: false },
  { text: "He showed her one house — but on move-in day he handed her the keys to a different one, smaller, and in bad condition.", isBeat: false },
  { text: "And because he wasn't licensed, there was nothing she could do about it.", isBeat: false },
  { text: "— tone lifts here, this is the turn —", isBeat: true },
  { text: "So we built Ndotoni to close exactly that gap.", isBeat: false },
  { text: "I'm a Case Western grad working as a software engineer at Amazon, and my co-founder Dickson is an engineer at Netflix — with a small team on the ground in Tanzania handling marketing and landlord outreach.", isBeat: false },
  { text: "We wanted to bring that same care to something that actually mattered to my family, and to people like Loveness.", isBeat: false },
  { text: "— from here, say it like you're just telling a curious friend about Ndotoni —", isBeat: true },
  { text: "Every landlord gets verified before they're allowed to list. And every review is tied to an actual booking, so you know it's from someone who really stayed there.", isBeat: false },
  { text: "And you don't have to learn some new way of doing things — search and book on our website or app on iOS and Android, or just message our WhatsApp bot like you would any agent.", isBeat: false },
  { text: "Pay however you already do — M-Pesa, Tigo Pesa, or Airtel Money.", isBeat: false },
  { text: "— casual, almost like an aside —", isBeat: true },
  { text: "In just a few months, we've already onboarded 26 landlords, and we've got thousands of renters searching — in a market worth over $60 million a year in Dar es Salaam alone, with internet use growing more than 20% year over year.", isBeat: false },
  { text: "Now we're pushing toward our first paid booking by October 15th.", isBeat: false },
  { text: "From there, we just want Ndotoni to become the default platform in Tanzania for renting long-term or booking a short stay.", isBeat: false },
  { text: "This $3,000 grant gets us there faster — funding the marketing and host outreach we need to put more good listings in front of the renters already showing up.", isBeat: false },
  { text: "— pause before the close —", isBeat: true },
  { text: "So hopefully, the next person who moves to a new city doesn't have to gamble the way Loveness did.", isBeat: false },
];

type Theme = 'dark' | 'light';
const THEME_KEY = 'ndotoni-pitch-theme';

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
}

export function PitchTeleprompter() {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(55);
  const [size, setSize] = useState(44);
  const [mirror, setMirror] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');
  const [elapsedLabel, setElapsedLabel] = useState('0:00 / 2:00');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  const positionRef = useRef(0);
  const elapsedRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const playingRef = useRef(false);

  const updateActiveLine = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const center = rect.top + stage.clientHeight / 2;
    let closest: number | null = null;
    let closestDist = Infinity;
    lineRefs.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const mid = (r.top + r.bottom) / 2;
      const dist = Math.abs(mid - center);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    setActiveIndex(closest);
  };

  const tick = (ts: number) => {
    if (startTimeRef.current === null) startTimeRef.current = ts;
    const dt = (ts - startTimeRef.current) / 1000;
    startTimeRef.current = ts;
    positionRef.current += speed * dt;
    if (scrollerRef.current) {
      scrollerRef.current.style.transform = `translateY(-${positionRef.current}px)`;
    }
    elapsedRef.current += dt;
    setElapsedLabel(`${formatTime(elapsedRef.current)} / 2:00`);
    updateActiveLine();
    if (playingRef.current) {
      rafRef.current = requestAnimationFrame(tick);
    }
  };

  const handlePlayPause = () => {
    const next = !playingRef.current;
    playingRef.current = next;
    setPlaying(next);
    if (next) {
      startTimeRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
    } else if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }
  };

  const handleReset = () => {
    playingRef.current = false;
    setPlaying(false);
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    positionRef.current = 0;
    elapsedRef.current = 0;
    startTimeRef.current = null;
    if (scrollerRef.current) {
      scrollerRef.current.style.transform = 'translateY(0px)';
    }
    setElapsedLabel('0:00 / 2:00');
    updateActiveLine();
  };

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        window.localStorage.setItem(THEME_KEY, next);
      } catch {
        // ignore write failures (private mode, disabled storage, etc.)
      }
      return next;
    });
  };

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(THEME_KEY);
      if (stored === 'dark' || stored === 'light') {
        setTheme(stored);
      } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        setTheme('light');
      }
    } catch {
      // ignore read failures
    }
  }, []);

  useEffect(() => {
    updateActiveLine();
    const onKeydown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      }
    };
    document.addEventListener('keydown', onKeydown);
    return () => {
      document.removeEventListener('keydown', onKeydown);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`teleprompter-root theme-${theme}`}>
      <div className="controls">
        <button className="play-btn" onClick={handlePlayPause}>
          {playing ? '⏸ Pause' : '▶ Play'}
        </button>
        <button className="secondary" onClick={handleReset}>
          ⟲ Reset
        </button>
        <label>
          Speed
          <input
            type="range"
            min={20}
            max={120}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </label>
        <label>
          Text size
          <input
            type="range"
            min={28}
            max={64}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />
        </label>
        <label className="switch">
          <input
            type="checkbox"
            checked={mirror}
            onChange={(e) => setMirror(e.target.checked)}
          />
          <span className="switch-track">
            <span className="switch-thumb" />
          </span>
          Mirror
        </label>
        <div className="controls-right">
          <div className="timer">{elapsedLabel}</div>
          <button
            type="button"
            className="theme-toggle"
            onClick={handleToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      <div className={`stage${mirror ? ' mirror' : ''}`} ref={stageRef}>
        <div className="center-marker" />
        <div className="scroller" ref={scrollerRef}>
          {SCRIPT.map((line, i) => (
            <div
              key={i}
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              className={`line${line.isBeat ? ' beat' : ''}${activeIndex === i ? ' active' : ''}`}
              style={line.isBeat ? undefined : { fontSize: `${size}px` }}
            >
              {line.text}
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        html,
        body {
          margin: 0;
          height: 100%;
          overflow: hidden;
        }
      `}</style>

      <style jsx>{`
        .teleprompter-root {
          --green: #00ce54;
          position: fixed;
          inset: 0;
          font-family: -apple-system, 'DM Sans', 'Segoe UI', Arial, sans-serif;
          overflow: hidden;
          transition: background-color 0.2s ease;
        }
        .teleprompter-root.theme-dark {
          --bg: #000000;
          --bg-controls: rgba(10, 10, 10, 0.92);
          --line: #2a2e2b;
          --text-dim: #3a3f3c;
          --text-beat: #24282a;
          --text-active: #ffffff;
          --control-text: #e7eae8;
          --control-text-dim: #9aa09b;
          --track-bg: #2a2e2b;
          --thumb-border: #06210f;
        }
        .teleprompter-root.theme-light {
          --bg: #f6f7f6;
          --bg-controls: rgba(255, 255, 255, 0.92);
          --line: #dfe3e0;
          --text-dim: #d3d7d3;
          --text-beat: #c3c8c4;
          --text-active: #14171a;
          --control-text: #14171a;
          --control-text-dim: #6b7280;
          --track-bg: #dfe3e0;
          --thumb-border: #ffffff;
        }
        .teleprompter-root {
          background: var(--bg);
        }
        .controls {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px 18px;
          background: var(--bg-controls);
          border-bottom: 1px solid var(--line);
          z-index: 10;
          flex-wrap: wrap;
          backdrop-filter: blur(6px);
        }
        .controls button {
          background: var(--green);
          color: #06210f;
          border: none;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: transform 0.1s ease, opacity 0.15s ease;
        }
        .controls button:hover {
          opacity: 0.9;
        }
        .controls button:active {
          transform: scale(0.96);
        }
        .controls button.secondary {
          background: transparent;
          color: var(--control-text);
          border: 1px solid var(--line);
        }
        .controls label {
          color: var(--control-text-dim);
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Custom range sliders */
        .controls input[type='range'] {
          -webkit-appearance: none;
          appearance: none;
          width: 100px;
          height: 4px;
          border-radius: 2px;
          background: var(--track-bg);
          outline: none;
          cursor: pointer;
        }
        .controls input[type='range']::-webkit-slider-runnable-track {
          height: 4px;
          border-radius: 2px;
          background: var(--track-bg);
        }
        .controls input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 15px;
          height: 15px;
          margin-top: -5.5px;
          border-radius: 50%;
          background: var(--green);
          border: 2px solid var(--thumb-border);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
          cursor: pointer;
          transition: transform 0.1s ease;
        }
        .controls input[type='range']::-webkit-slider-thumb:hover {
          transform: scale(1.12);
        }
        .controls input[type='range']::-moz-range-track {
          height: 4px;
          border-radius: 2px;
          background: var(--track-bg);
        }
        .controls input[type='range']::-moz-range-thumb {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: var(--green);
          border: 2px solid var(--thumb-border);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
          cursor: pointer;
        }
        .controls input[type='range']:focus-visible {
          box-shadow: 0 0 0 3px rgba(0, 206, 84, 0.35);
          border-radius: 2px;
        }

        /* Custom mirror toggle switch */
        .switch {
          cursor: pointer;
          user-select: none;
        }
        .switch input {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          opacity: 0;
        }
        .switch-track {
          position: relative;
          width: 34px;
          height: 20px;
          border-radius: 10px;
          background: var(--track-bg);
          transition: background 0.15s ease;
          flex-shrink: 0;
        }
        .switch-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
          transition: transform 0.15s ease;
        }
        .switch input:checked + .switch-track {
          background: var(--green);
        }
        .switch input:checked + .switch-track .switch-thumb {
          transform: translateX(14px);
        }
        .switch input:focus-visible + .switch-track {
          box-shadow: 0 0 0 3px rgba(0, 206, 84, 0.35);
        }

        .controls-right {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .timer {
          color: var(--green);
          font-variant-numeric: tabular-nums;
          font-size: 16px;
          font-weight: 700;
        }
        .theme-toggle {
          background: transparent;
          border: 1px solid var(--line);
          color: var(--control-text);
          width: 34px;
          height: 34px;
          padding: 0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          line-height: 1;
        }

        .stage {
          position: absolute;
          top: 56px;
          bottom: 0;
          left: 0;
          right: 0;
          overflow: hidden;
        }
        .stage.mirror {
          transform: scaleX(-1);
        }
        .scroller {
          padding: 45vh 8vw 70vh 8vw;
        }
        .line {
          color: var(--text-dim);
          line-height: 1.5;
          font-weight: 600;
          margin: 0 0 34px 0;
          transition: color 0.25s ease;
        }
        .line.beat {
          color: var(--text-beat);
          font-size: 30px;
          font-weight: 500;
          font-style: italic;
          margin: 0 0 34px 0;
        }
        .line.active {
          color: var(--text-active);
        }
        .center-marker {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          border-top: 2px solid var(--green);
          opacity: 0.35;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
