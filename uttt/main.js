import init, { Board, best_move_by_rollout } from './pkg/wuttt.js';
import assert from './assert.js';
const SIZE = 30;
const GAP = 2;
function cell_to_coords(i, j) {
    let x = i % 3 * 3 + j % 3;
    let y = Math.floor(i / 3) * 3 + Math.floor(j / 3);
    x = x * SIZE + i % 3 * GAP;
    y = y * SIZE + Math.floor(i / 3) * GAP;
    return { x, y };
}
function coords_to_cell(x, y) {
    x = Math.floor(x / (SIZE + GAP / 3));
    if (x > 8)
        x = 8;
    y = Math.floor(y / (SIZE + GAP / 3));
    if (y > 8)
        y = 8;
    let i = Math.floor(x / 3) + 3 * Math.floor(y / 3);
    let j = x % 3 + y % 3 * 3;
    return { i, j };
}
function render_piece(ctx, x, y, size, c) {
    switch (c) {
        case 'X':
            ctx.beginPath();
            let t = size / 8;
            ctx.moveTo(x + t, y + t);
            ctx.lineTo(x + size - t, y + size - t);
            ctx.moveTo(x + size - t, y + t);
            ctx.lineTo(x + t, y + size - t);
            ctx.stroke();
            break;
        case 'O':
            ctx.beginPath();
            ctx.arc(x + 0.5 * size, y + 0.5 * size, size * 0.4, 0, 2 * Math.PI);
            ctx.stroke();
            break;
    }
}
function render_board(board, hover) {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let last_move = board.last_move();
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let { x, y } = cell_to_coords(i, j);
            ctx.fillStyle = '#ccc';
            ctx.fillRect(x + 1, y + 1, SIZE - 2, SIZE - 2);
            if (last_move && last_move[0] === i && last_move[1] === j) {
                ctx.strokeStyle = '#c00';
            }
            else {
                ctx.strokeStyle = '#000';
            }
            ctx.lineWidth = 3;
            let c = board.micro_board(i, j);
            switch (c) {
                case 'X':
                case 'O':
                    render_piece(ctx, x, y, SIZE, c);
                    break;
                case undefined:
                    break;
                default:
                    let _ = c;
                    assert(false);
            }
        }
        let c = board.macro_board(i);
        let { x, y } = cell_to_coords(i, 0);
        ctx.fillStyle = 'rgb(255, 255, 255, 0.5)';
        ctx.lineWidth = 7;
        ctx.strokeStyle = 'rgb(0, 0, 0, 0.5)';
        switch (c) {
            case 'XWon':
            case 'OWon':
                ctx.fillRect(x, y, SIZE * 3, SIZE * 3);
                render_piece(ctx, x, y, SIZE * 3, c.charAt(0));
                break;
            case 'Draw':
                ctx.fillRect(x, y, SIZE * 3, SIZE * 3);
                break;
            case undefined:
                break;
            default:
                let _ = c;
                assert(false);
        }
    }
    if (board.outcome() === undefined) {
        for (let [i, j] of board.possible_moves()) {
            let h = hover && hover.i == i && hover.j == j;
            if (h) {
                ctx.fillStyle = '#8f8';
            }
            else {
                ctx.fillStyle = '#aea';
            }
            let { x, y } = cell_to_coords(i, j);
            ctx.fillRect(x + 1, y + 1, SIZE - 2, SIZE - 2);
            if (h) {
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.lineWidth = 3;
                render_piece(ctx, x, y, SIZE, board.side_to_move());
            }
        }
    }
}
async function run() {
    let canvas = document.getElementById('canvas');
    canvas.width = 9 * SIZE + 2 * GAP;
    canvas.height = 9 * SIZE + 2 * GAP;
    let undo_button = document.getElementById('undo');
    await init();
    let control = new Map();
    let ai_thought = null;
    let history = [];
    undo_button.disabled = true;
    let board = new Board();
    render_board(board, null);
    function update_board_and_history() {
        render_board(board, null);
        undo_button.disabled = !(control.get('X') === 'user' && history.length > 0 ||
            control.get('O') === 'user' && history.length > 1);
        let outcome_elem = document.getElementById('outcome');
        let outcome = board.outcome();
        switch (outcome) {
            case 'XWon':
                outcome_elem.innerText = 'X won';
                break;
            case 'OWon':
                outcome_elem.innerText = 'O won';
                break;
            case 'Draw':
                outcome_elem.innerText = 'draw';
                break;
            case undefined:
                switch (control.get(board.side_to_move())) {
                    case 'user':
                        outcome_elem.innerText = 'your turn';
                        break;
                    case 'ai':
                        outcome_elem.innerText = 'thinking...';
                        break;
                }
                break;
            default:
                let _ = outcome;
                assert(false);
        }
    }
    function update_ai_thought() {
        if (board.outcome() === undefined &&
            control.get(board.side_to_move()) === 'ai') {
            if (ai_thought === null) {
                ai_thought = setTimeout(() => {
                    let best_move = best_move_by_rollout(board, 5000);
                    ai_thought = setTimeout(() => {
                        let [i, j] = best_move;
                        board.make_move(i, j);
                        history.push([i, j]);
                        ai_thought = null;
                        update_board_and_history();
                        update_ai_thought();
                    }, 17);
                }, 17);
            }
        }
        else {
            if (ai_thought !== null) {
                clearTimeout(ai_thought);
                ai_thought = null;
            }
        }
    }
    function update_control() {
        for (let r of document.getElementsByClassName('control')) {
            let radio = r;
            if (radio.checked) {
                let name = radio.name;
                assert(name === 'X' || name === 'O');
                let value = radio.value;
                assert(value === 'user' || value === 'ai');
                control.set(name, value);
            }
        }
        update_ai_thought();
        update_board_and_history();
    }
    update_control();
    for (let r of document.getElementsByClassName('control')) {
        r.onclick = update_control;
    }
    canvas.onmousemove = e => {
        let rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        let { i, j } = coords_to_cell(x, y);
        canvas.title = `${i + 1}${j + 1}`;
        if (control.get(board.side_to_move()) === 'user') {
            render_board(board, { i, j });
        }
    };
    canvas.onmouseleave = e => {
        canvas.title = '';
        render_board(board, null);
    };
    canvas.onclick = e => {
        if (control.get(board.side_to_move()) !== 'user') {
            return;
        }
        let rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        let { i, j } = coords_to_cell(x, y);
        if (Array.from(board.possible_moves()).some(([ii, jj]) => i == ii && j == jj)) {
            board.make_move(i, j);
            history.push([i, j]);
            update_board_and_history();
            update_ai_thought();
        }
    };
    undo_button.onclick = e => {
        while (true) {
            history.pop();
            if (history.length % 2 === 0 && control.get('X') === 'user') {
                break;
            }
            if (history.length % 2 === 1 && control.get('O') === 'user') {
                break;
            }
        }
        board = new Board();
        for (let [i, j] of history) {
            board.make_move(i, j);
        }
        update_board_and_history();
        update_ai_thought();
    };
}
run();
