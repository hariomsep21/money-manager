import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

/**
 * MonthYearSelector
 * A reusable, controlled component for selecting month & year with prev/next.
 *
 * Props:
 * - value: Date (required) — The current selected date (month/year).
 * - onChange: (Date) => void (required) — Called with a new Date on change.
 * - minYear?: number — Lower bound for year dropdown (default: 2020).
 * - maxYear?: number — Upper bound for year dropdown (default: current year + 5).
 * - className?: string — Optional wrapper class.
 * - showDropdownOnLabelClick?: boolean — Toggle dropdown by clicking label (default: true).
 */
const MonthYearSelector = ({
  value,
  onChange,
  minYear = 2020,
  maxYear = new Date().getFullYear() + 5,
  className,
  showDropdownOnLabelClick = true,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const prevMonth = () => {
    const d = new Date(value.getTime());
    d.setMonth(d.getMonth() - 1);
    onChange(d);
  };

  const nextMonth = () => {
    const d = new Date(value.getTime());
    d.setMonth(d.getMonth() + 1);
    onChange(d);
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    const d = new Date(value.getTime());
    d.setFullYear(newYear);
    onChange(d);
    setShowDatePicker(false);
  };

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value);
    const d = new Date(value.getTime());
    d.setMonth(newMonth);
    onChange(d);
    setShowDatePicker(false);
  };

  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  const months = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className={className} style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="icon-btn" aria-label="Previous month" onClick={prevMonth}>
          <ChevronLeft size={24} />
        </button>
        <div
          onClick={showDropdownOnLabelClick ? () => setShowDatePicker((v) => !v) : undefined}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: showDropdownOnLabelClick ? 'pointer' : 'default' }}
          aria-label={`Selected ${value.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
        >
          <h2 style={{ fontSize: '1.2rem' }}>
            {value.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </h2>
          <ChevronDown size={16} style={{ opacity: 0.7 }} />
        </div>
        <button className="icon-btn" aria-label="Next month" onClick={nextMonth}>
          <ChevronRight size={24} />
        </button>
      </div>

      {showDatePicker && (
        <div className="glass-panel" style={{ marginTop: '1rem', padding: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <select
            className="input-field"
            value={value.getFullYear()}
            onChange={handleYearChange}
            style={{ width: 'auto' }}
            aria-label="Select year"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            className="input-field"
            value={value.getMonth()}
            onChange={handleMonthChange}
            style={{ width: 'auto' }}
            aria-label="Select month"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {new Date(0, month).toLocaleString('en-US', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default MonthYearSelector;
