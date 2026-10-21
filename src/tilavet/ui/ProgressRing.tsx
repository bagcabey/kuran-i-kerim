import React from 'react';

const RADIUS = 35;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ProgressRing({ value, label, children }: {
  value: number;
  label: string;
  children: React.ReactNode;
}) {
  const progress = Math.min(100, Math.max(0, value));

  return (
    <div className="tl-ring" role="img" aria-label={label}>
      <svg className="tl-ring__graphic" viewBox="0 0 84 84" aria-hidden="true" focusable="false">
        <circle className="tl-ring__track" cx="42" cy="42" r={RADIUS} />
        <circle
          className="tl-ring__progress"
          cx="42"
          cy="42"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress / 100)}
        />
      </svg>
      <span className="tl-ring__label">{children}</span>
    </div>
  );
}
