import React, { useState, useEffect } from 'react';
import { getDaysInMonth, isValidDate, isValidTime } from './dateUtils';

export interface BirthDateTimeValue {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
  isValid: boolean;
}

export interface BirthDateTimeInputProps {
  initialDate?: string;
  initialTime?: string;
  onChange?: (val: BirthDateTimeValue) => void;
  className?: string;
}

export const BirthDateTimeInput: React.FC<BirthDateTimeInputProps> = ({
  initialDate,
  initialTime = '12:00',
  onChange,
  className = '',
}) => {
  const parseInitial = () => {
    const today = new Date();
    if (initialDate) {
      const parts = initialDate.split('-').map((p) => parseInt(p, 10));
      if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
        return { y: parts[0], m: parts[1], d: parts[2] };
      }
    }
    return { y: today.getFullYear() - 25, m: 1, d: 1 };
  };

  const initialParsed = parseInitial();
  const [year, setYear] = useState<number>(initialParsed.y);
  const [month, setMonth] = useState<number>(initialParsed.m);
  const [day, setDay] = useState<number>(initialParsed.d);

  const initialTimeParts = initialTime.split(':').map((p) => parseInt(p, 10));
  const [hours, setHours] = useState<number>(!isNaN(initialTimeParts[0]) ? initialTimeParts[0] : 12);
  const [minutes, setMinutes] = useState<number>(!isNaN(initialTimeParts[1]) ? initialTimeParts[1] : 0);

  // Dynamic Day Clamping based on Month and Leap Year
  useEffect(() => {
    const maxDays = getDaysInMonth(year, month);
    if (day > maxDays) {
      setDay(maxDays);
    }
  }, [year, month, day]);

  // Emit updated values whenever state changes
  useEffect(() => {
    const valid = isValidDate(year, month, day) && isValidTime(hours, minutes);
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const hh = String(hours).padStart(2, '0');
    const min = String(minutes).padStart(2, '0');

    if (onChange) {
      onChange({
        date: `${year}-${mm}-${dd}`,
        time: `${hh}:${min}`,
        year,
        month,
        day,
        hours,
        minutes,
        isValid: valid,
      });
    }
  }, [year, month, day, hours, minutes, onChange]);

  const maxDays = getDaysInMonth(year, month);

  return (
    <div
      data-testid="birth-datetime-input"
      className={`flex flex-col gap-6 p-6 rounded-2xl bg-zinc-950/60 border border-white/[0.08] backdrop-blur-xl ${className}`}
    >
      <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
        <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
          Chronological Anchoring
        </span>
        <span className="text-[11px] font-mono text-emerald-400/80 uppercase">
          Dynamic Calendar Limits Active
        </span>
      </div>

      {/* Date Selectors */}
      <div className="grid grid-cols-3 gap-3">
        {/* Month */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase">
            Month
          </label>
          <select
            data-testid="birth-month-select"
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value, 10))}
            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-200 text-sm font-mono focus:outline-none focus:border-white/[0.25]"
          >
            {[
              'January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December'
            ].map((name, i) => (
              <option key={i + 1} value={i + 1} className="bg-zinc-900 text-white">
                {String(i + 1).padStart(2, '0')} - {name}
              </option>
            ))}
          </select>
        </div>

        {/* Day */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase">
            Day (1–{maxDays})
          </label>
          <select
            data-testid="birth-day-select"
            value={day}
            onChange={(e) => setDay(parseInt(e.target.value, 10))}
            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-200 text-sm font-mono focus:outline-none focus:border-white/[0.25]"
          >
            {Array.from({ length: maxDays }).map((_, i) => (
              <option key={i + 1} value={i + 1} className="bg-zinc-900 text-white">
                {String(i + 1).padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase">
            Year
          </label>
          <input
            type="number"
            data-testid="birth-year-input"
            value={year}
            min={1850}
            max={2100}
            onChange={(e) => setYear(parseInt(e.target.value, 10) || 2000)}
            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-200 text-sm font-mono focus:outline-none focus:border-white/[0.25]"
          />
        </div>
      </div>

      {/* Time Selectors */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase">
            Hour (00–23)
          </label>
          <input
            type="number"
            data-testid="birth-hour-input"
            value={hours}
            min={0}
            max={23}
            onChange={(e) => {
              const h = Math.max(0, Math.min(23, parseInt(e.target.value, 10) || 0));
              setHours(h);
            }}
            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-200 text-sm font-mono focus:outline-none focus:border-white/[0.25]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase">
            Minute (00–59)
          </label>
          <input
            type="number"
            data-testid="birth-minute-input"
            value={minutes}
            min={0}
            max={59}
            onChange={(e) => {
              const m = Math.max(0, Math.min(59, parseInt(e.target.value, 10) || 0));
              setMinutes(m);
            }}
            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-200 text-sm font-mono focus:outline-none focus:border-white/[0.25]"
          />
        </div>
      </div>
    </div>
  );
};

export default BirthDateTimeInput;
