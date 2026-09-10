import { StoreState } from './types';

const STORAGE_KEY = 'tobamarkettwin.v2';

export function loadPersistedState(): StoreState | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as StoreState;
    } catch {
        return null;
    }
}

export function persistState(state: StoreState) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
