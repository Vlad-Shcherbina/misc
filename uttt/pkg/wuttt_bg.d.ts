/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export function __wbg_board_free(a: number): void;
export function board_new(): number;
export function board_outcome(a: number): number;
export function board_side_to_move(a: number): number;
export function board_micro_board(a: number, b: number, c: number): number;
export function board_macro_board(a: number, b: number): number;
export function board_last_move(a: number, b: number): void;
export function board_make_move(a: number, b: number, c: number): void;
export function board_possible_moves(a: number): number;
export function best_move_by_rollout(a: number, b: number): number;
export function start(): void;
export function __wbindgen_free(a: number, b: number): void;
export function __wbindgen_malloc(a: number): number;
export function __wbindgen_realloc(a: number, b: number, c: number): number;
export function __wbindgen_exn_store(a: number): void;
export function __wbindgen_start(): void;
