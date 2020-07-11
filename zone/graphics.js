import { dir_to_angle } from "./mechanics.js";
import assert from "./assert.js";
const SIZE = 50;
export let bg_canvas = document.getElementById('bg');
let bg_ctx = bg_canvas.getContext('2d');
export let fg_canvas = document.getElementById('fg');
let fg_ctx = fg_canvas.getContext('2d');
bg_canvas.width = fg_canvas.width = 600;
bg_canvas.height = fg_canvas.height = 500;
function translate(ctx, pt) {
    ctx.translate(SIZE * (pt.x + 0.5), SIZE * (pt.y + 0.5));
}
function draw_wall() {
    bg_ctx.fillStyle = 'grey';
    bg_ctx.fillRect(-SIZE / 2, -SIZE / 2, SIZE, SIZE);
}
function draw_goal(color) {
    bg_ctx.strokeStyle = {
        'red': 'rgb(150, 0, 0)',
        'green': 'rgb(0, 150, 0)',
        'blue': 'rgb(0, 0, 150)',
    }[color];
    bg_ctx.lineWidth = 0.1 * SIZE;
    bg_ctx.beginPath();
    const s = 0.45 * SIZE;
    bg_ctx.moveTo(-s, -s);
    bg_ctx.lineTo(s, s);
    bg_ctx.moveTo(-s, s);
    bg_ctx.lineTo(s, -s);
    bg_ctx.stroke();
}
function draw_walker(color) {
    fg_ctx.fillStyle = {
        'red': 'rgb(255, 0, 0)',
        'green': 'rgb(0, 255, 0)',
        'blue': 'rgb(0, 0, 255)',
    }[color];
    fg_ctx.beginPath();
    fg_ctx.ellipse(0, 0, SIZE * 0.4, SIZE * 0.4, 0, 0, 2 * Math.PI);
    fg_ctx.fill();
    fg_ctx.fillStyle = 'black';
    fg_ctx.beginPath();
    for (let sign of [-1, 1]) {
        fg_ctx.ellipse(SIZE * 0.3, sign * SIZE * 0.2, SIZE * 0.1, SIZE * 0.2, 0, 0, 2 * Math.PI);
    }
    fg_ctx.fill();
}
function draw_roller(color) {
    fg_ctx.fillStyle = {
        'red': 'rgb(200, 0, 0)',
        'green': 'rgb(0, 200, 0)',
        'blue': 'rgb(0, 0, 200)',
    }[color];
    fg_ctx.fillRect(-0.3 * SIZE, -0.4 * SIZE, 0.2 * SIZE, 0.8 * SIZE);
    fg_ctx.fillRect(0.1 * SIZE, -0.4 * SIZE, 0.2 * SIZE, 0.8 * SIZE);
    fg_ctx.fillStyle = {
        'red': 'rgb(255, 0, 0)',
        'green': 'rgb(0, 255, 0)',
        'blue': 'rgb(0, 0, 255)',
    }[color];
    fg_ctx.fillRect(-0.4 * SIZE, -0.3 * SIZE, 0.8 * SIZE, 0.6 * SIZE);
    fg_ctx.fillStyle = 'black';
    for (let sign of [-1, 1]) {
        fg_ctx.fillRect(SIZE * 0.25, sign * SIZE * 0.15 - SIZE * 0.05, SIZE * 0.1, SIZE * 0.1);
    }
}
function draw_zone() {
    fg_ctx.strokeStyle = 'white';
    fg_ctx.lineWidth = SIZE * 0.05;
    fg_ctx.setLineDash([SIZE * 0.1, SIZE * 0.1]);
    fg_ctx.strokeRect(-1.5 * SIZE, -1.5 * SIZE, 3 * SIZE, 3 * SIZE);
}
export function draw_env(env) {
    bg_ctx.save();
    bg_ctx.translate((bg_canvas.width - env.width * SIZE) * 0.5, (bg_canvas.height - env.height * SIZE) * 0.5);
    for (let wall of env.walls.values()) {
        bg_ctx.save();
        translate(bg_ctx, wall);
        draw_wall();
        bg_ctx.restore();
    }
    for (let goal of env.goals) {
        bg_ctx.save();
        translate(bg_ctx, goal);
        draw_goal(goal.color);
        bg_ctx.restore();
    }
    bg_ctx.restore();
}
export function draw_state(env, state) {
    fg_ctx.save();
    fg_ctx.translate((fg_canvas.width - env.width * SIZE) * 0.5, (fg_canvas.height - env.height * SIZE) * 0.5);
    for (let e of state.entities) {
        fg_ctx.save();
        translate(fg_ctx, e);
        fg_ctx.rotate(-dir_to_angle(e.dir) * Math.PI / 2);
        switch (e.type) {
            case 'walker':
                draw_walker(e.color);
                break;
            case 'roller':
                draw_roller(e.color);
                break;
            default:
                let _ = e.type;
                assert(false);
        }
        fg_ctx.restore();
    }
    translate(fg_ctx, state.zone);
    draw_zone();
    fg_ctx.restore();
}
export function draw_state_animated(env, state, animations, t) {
    fg_ctx.save();
    fg_ctx.translate((fg_canvas.width - env.width * SIZE) * 0.5, (fg_canvas.height - env.height * SIZE) * 0.5);
    state.entities.forEach((e, i) => {
        fg_ctx.save();
        let a = animations.entity_animations[i];
        translate(fg_ctx, e);
        if (a === null) {
            fg_ctx.rotate(-dir_to_angle(e.dir) * Math.PI / 2);
        }
        else {
            switch (a.kind) {
                case 'turn':
                    fg_ctx.rotate(-(dir_to_angle(e.dir) + a.angle * t) * Math.PI / 2);
                    break;
                case 'move':
                case 'blocked':
                    let offset = a.kind === 'move' ? t : Math.max(0, 0.33 - Math.abs(t - 0.33));
                    fg_ctx.translate(SIZE * offset * a.dx, SIZE * offset * a.dy);
                    fg_ctx.rotate(-dir_to_angle(a.dir) * Math.PI / 2);
                    break;
                default:
                    let _ = a;
                    assert(false);
            }
        }
        switch (e.type) {
            case 'walker':
                draw_walker(e.color);
                break;
            case 'roller':
                draw_roller(e.color);
                break;
            default:
                let _ = e.type;
                assert(false);
        }
        fg_ctx.restore();
    });
    translate(fg_ctx, state.zone);
    fg_ctx.translate(SIZE * t * animations.zone_dx, SIZE * t * animations.zone_dy);
    draw_zone();
    fg_ctx.restore();
}
export function draw_fade(opacity) {
    fg_ctx.fillStyle = 'rgb(0, 0, 0, ' + opacity + ')';
    fg_ctx.fillRect(0, 0, fg_canvas.width, fg_canvas.height);
}
