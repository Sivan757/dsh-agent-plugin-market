import type { SuiteState } from './types.js';
export declare const EMPTY_STATE: SuiteState;
/** Parse persisted state; unreadable or wrong-version files yield a contained empty state. */
export declare function loadState(statePath: string): Promise<SuiteState>;
/** Persist state atomically through a sibling-temp rename. */
export declare function saveState(statePath: string, state: SuiteState): Promise<void>;
