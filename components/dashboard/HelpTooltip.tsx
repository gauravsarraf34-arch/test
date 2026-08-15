"use client";

import { useState } from "react";

export function HelpTooltip({ tooltip }: { tooltip: string }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block align-middle">
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        aria-label="Help information"
        className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-indigo-50 text-[10px] font-bold text-indigo-600 transition hover:bg-indigo-100 hover:text-indigo-700"
      >
        ?
      </button>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 z-50 mb-2 w-52 -translate-x-1/2 rounded-xl bg-slate-900/95 p-2.5 text-xs font-normal text-white shadow-xl backdrop-blur-sm animate-in fade-in zoom-in-95 duration-150">
          <p className="leading-relaxed">{tooltip}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900/95" />
        </div>
      )}
    </div>
  );
}
