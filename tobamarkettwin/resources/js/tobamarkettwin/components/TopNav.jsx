import React from 'react';

export default function TopNav({ screens, active, onSelect }) {
    return (
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-1 overflow-x-auto">
                {screens.map((s, i) => {
                    const isActive = s.id === active;
                    const isDone = s.id < active;
                    return (
                        <React.Fragment key={s.id}>
                            <button
                                onClick={() => onSelect(s.id)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition
                                    ${isActive ? 'bg-forest text-white' : isDone ? 'bg-forest/10 text-forest' : 'bg-gray-100 text-[#666666] hover:bg-gray-200'}`}
                            >
                                <span>{s.id}.</span>
                                <span>{s.label}</span>
                            </button>
                            {i < screens.length - 1 && <span className="text-gray-300 px-1">&rarr;</span>}
                        </React.Fragment>
                    );
                })}
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-[#666666]">
                <span className="h-2 w-2 rounded-full bg-lake animate-pulse" />
                Kopi Arabika Toba (250g) &mdash; Case Study
            </div>
        </header>
    );
}
