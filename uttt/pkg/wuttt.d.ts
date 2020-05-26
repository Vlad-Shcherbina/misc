/* tslint:disable */
/* eslint-disable */
/**
* @param {Board} board 
* @param {number} num_trials 
* @returns {[number, number]} 
*/
export function best_move_by_rollout(board: Board, num_trials: number): [number, number];
/**
*/
export function start(): void;
/**
*/
export class Board {
  free(): void;
/**
*/
  constructor();
/**
* @returns {'XWon' | 'OWon' | 'Draw' | undefined} 
*/
  outcome(): 'XWon' | 'OWon' | 'Draw' | undefined;
/**
* @returns {'X' | 'O'} 
*/
  side_to_move(): 'X' | 'O';
/**
* @param {number} i 
* @param {number} j 
* @returns {'X' | 'O' | undefined} 
*/
  micro_board(i: number, j: number): 'X' | 'O' | undefined;
/**
* @param {number} i 
* @returns {'XWon' | 'OWon' | 'Draw' | undefined} 
*/
  macro_board(i: number): 'XWon' | 'OWon' | 'Draw' | undefined;
/**
* @returns {Uint32Array | undefined} 
*/
  last_move(): Uint32Array | undefined;
/**
* @param {number} i 
* @param {number} j 
*/
  make_move(i: number, j: number): void;
/**
* @returns {[[number, number]]} 
*/
  possible_moves(): [[number, number]];
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_board_free: (a: number) => void;
  readonly board_new: () => number;
  readonly board_outcome: (a: number) => number;
  readonly board_side_to_move: (a: number) => number;
  readonly board_micro_board: (a: number, b: number, c: number) => number;
  readonly board_macro_board: (a: number, b: number) => number;
  readonly board_last_move: (a: number, b: number) => void;
  readonly board_make_move: (a: number, b: number, c: number) => void;
  readonly board_possible_moves: (a: number) => number;
  readonly best_move_by_rollout: (a: number, b: number) => number;
  readonly start: () => void;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __wbindgen_start: () => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
        