import React from 'react';

const ICONS = {
    1: '01',
    2: '02',
    3: '03',
    4: '04',
};

export default function Sidebar({ screens, active, onSelect }) {
    return (
        <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-[#122840] text-white">
            <div className="px-6 py-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-lg bg-lake flex items-center justify-center font-bold text-white">T</div>
                    <div>
                        <p className="font-bold text-sm leading-tight">TobaMarketTwin</p>
                        <p className="text-[11px] text-white/50 leading-tight">AI Customer Twin</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
                {screens.map((s) => {
                    const isActive = s.id === active;
                    return (
                        <button
                            key={s.id}
                            onClick={() => onSelect(s.id)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left text-sm transition
                                ${isActive ? 'bg-lake/20 text-white border border-lake/40' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                        >
                            <span className={`text-[11px] font-mono ${isActive ? 'text-lake' : 'text-white/30'}`}>{ICONS[s.id]}</span>
                            <span className="font-medium">{s.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="px-6 py-4 border-t border-white/10 text-[11px] text-white/40">
                Danau Toba SME Innovation Lab
            </div>
        </aside>
    );
}
