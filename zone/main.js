import { parse, next_state, is_level_completed } from './mechanics.js';
import assert from './assert.js';
import { draw_env, draw_state, fg_canvas, bg_canvas, draw_state_animated, draw_fade } from './graphics.js';
import { levels } from './levels.js';
let zone_shape = [];
for (let x of [-1, 0, 1]) {
    for (let y of [-1, 0, 1]) {
        zone_shape.push({ x, y });
    }
}
let level_number = 0;
let level_completed = false;
let env;
let state;
let command_queue = [];
let anim = null;
let level_start_time;
const FADE_IN_TIME = 0.5;
function load_level() {
    level_completed = false;
    ({ env, state } = parse(zone_shape, levels[level_number]));
    bg_canvas.width = bg_canvas.width;
    draw_env(env);
    fg_canvas.width = fg_canvas.width;
    draw_state(env, state);
    command_queue = [];
    level_start_time = +new Date();
    requestAnimationFrame(fade_in_animation);
}
function fade_in_animation() {
    let t = (+new Date() - level_start_time) * 1e-3 / FADE_IN_TIME;
    fg_canvas.width = fg_canvas.width;
    draw_state(env, state);
    if (t < 1.0) {
        draw_fade(1.0 - t);
        requestAnimationFrame(fade_in_animation);
    }
}
load_level();
function start_animation() {
    assert(!anim);
    let control = command_queue.shift();
    assert(!!control);
    console.log('state before', JSON.stringify(state));
    let { state: new_state, animations } = next_state(env, state, control);
    console.log('animations', JSON.stringify(animations));
    console.log('state after', JSON.stringify(state));
    anim = {
        start_time: +new Date(),
        animations,
        new_state,
    };
    requestAnimationFrame(animate);
}
const ANIMATION_SPEED = 8;
function animate() {
    assert(anim !== null);
    let t = (+new Date() - anim.start_time) * 1e-3 * ANIMATION_SPEED;
    if (t < 1.0) {
        console.log('state animated', JSON.stringify(state));
        fg_canvas.width = fg_canvas.width;
        draw_state_animated(env, state, anim.animations, t);
        requestAnimationFrame(animate);
    }
    else {
        state = anim.new_state;
        anim = null;
        level_completed = is_level_completed(env, state);
        if (level_completed) {
            level_number++;
            if (level_number < levels.length) {
                setTimeout(() => {
                    load_level();
                }, 500);
            }
        }
        else {
            fg_canvas.width = fg_canvas.width;
            draw_state(env, state);
            if (command_queue.length > 0) {
                start_animation();
            }
        }
    }
}
document.onkeydown = e => {
    let control = null;
    switch (e.key) {
        case 'ArrowRight':
        case 'd':
            control = 'right';
            break;
        case 'ArrowUp':
        case 'w':
            control = 'up';
            break;
        case 'ArrowLeft':
        case 'a':
            control = 'left';
            break;
        case 'ArrowDown':
        case 's':
            control = 'down';
            break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '0':
            // TODO: this interacts poorly with animations
            level_number = (parseInt(e.key) + 9) % 10;
            load_level();
            break;
    }
    ;
    if (control !== null) {
        e.preventDefault();
        if (!level_completed) {
            command_queue.push(control);
            if (anim === null) {
                start_animation();
            }
        }
    }
};
