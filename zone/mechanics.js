import assert from './assert.js';
export function parse(zone_shape, text) {
    let wall_list = [];
    let zone = null;
    let goals = [];
    let entities = [];
    let lines = text.split('\n');
    lines.forEach((line, y) => {
        let [layout, ...ess] = line.split(';');
        console.log(y, layout);
        for (let xx = 0; xx < layout.length; xx++) {
            let c = layout.charAt(xx);
            if (xx % 2 === 1) {
                assert(c === ' ');
            }
            let x = Math.floor(xx / 2);
            switch (c) {
                case ' ':
                    break;
                case '#':
                    wall_list.push({ x, y });
                    break;
                case '!':
                    let es = ess.shift();
                    assert(es !== undefined);
                    for (let e of es.trim().split(' ')) {
                        if (e === 'zone') {
                            zone = { x, y };
                        }
                        else {
                            let [color, type, ...rest] = e.split('_');
                            assert(color === 'red' || color === 'green' || color === 'blue');
                            if (type === 'goal') {
                                goals.push({ x, y, color });
                            }
                            else if (type === 'walker' || type === 'roller') {
                                let dir = rest[0];
                                assert(dir === 'right' || dir === 'up' || dir === 'left' || dir === 'down');
                                entities.push({ x, y, type, dir, color });
                            }
                            else {
                                assert(false);
                            }
                        }
                    }
                    break;
                default: assert(false, c);
            }
        }
    });
    assert(zone !== null);
    let walls = new Map(wall_list.map((pt) => [pt.x + '_' + pt.y, pt]));
    let width = Math.max(...wall_list.map(({ x }) => x)) + 1;
    let height = Math.max(...wall_list.map(({ y }) => y)) + 1;
    return {
        env: { walls, width, height, goals, zone_shape },
        state: { zone, entities },
    };
}
export function dir_to_angle(dir) {
    switch (dir) {
        case 'right': return 0;
        case 'up': return 1;
        case 'left': return 2;
        case 'down': return 3;
    }
}
function dir_to_pt(dir) {
    switch (dir) {
        case 'right': return { x: 1, y: 0 };
        case 'up': return { x: 0, y: -1 };
        case 'left': return { x: -1, y: 0 };
        case 'down': return { x: 0, y: 1 };
    }
}
function turn_left(dir) {
    switch (dir) {
        case 'right': return 'up';
        case 'up': return 'left';
        case 'left': return 'down';
        case 'down': return 'right';
    }
}
function adj(pt, dir) {
    let { x, y } = dir_to_pt(dir);
    return { x: pt.x + x, y: pt.y + y };
}
export function next_state(env, state, control) {
    let controlled = new Set(env.zone_shape.map(({ x, y }) => (state.zone.x + x) + '_' + (state.zone.y + y)));
    let old_pos = state.entities.map(({ x, y }) => ({ x, y }));
    let new_pos = old_pos.slice(0);
    let new_dir = state.entities.map(({ dir }) => dir);
    let entity_animations = state.entities.map(() => null);
    state.entities.forEach(({ x, y, dir, type }, i) => {
        if (!controlled.has(x + '_' + y)) {
            return;
        }
        switch (type) {
            case 'walker':
                new_pos[i] = adj({ x, y }, control);
                new_dir[i] = control;
                entity_animations[i] = {
                    kind: 'move',
                    dx: new_pos[i].x - x,
                    dy: new_pos[i].y - y,
                    dir: control,
                };
                break;
            case 'roller':
                switch (control) {
                    case 'left':
                        new_dir[i] = turn_left(dir);
                        entity_animations[i] = { kind: 'turn', angle: 1 };
                        break;
                    case 'up':
                        new_pos[i] = adj({ x, y }, dir);
                        entity_animations[i] = {
                            kind: 'move',
                            dx: new_pos[i].x - x,
                            dy: new_pos[i].y - y,
                            dir,
                        };
                        break;
                    case 'right':
                        new_dir[i] = turn_left(turn_left(turn_left(dir)));
                        entity_animations[i] = { kind: 'turn', angle: -1 };
                        break;
                    case 'down':
                        new_pos[i] = adj({ x, y }, turn_left(turn_left(dir)));
                        entity_animations[i] = {
                            kind: 'move',
                            dx: new_pos[i].x - x,
                            dy: new_pos[i].y - y,
                            dir,
                        };
                        break;
                }
                break;
        }
    });
    while (true) {
        let moved = new_pos.map(() => false);
        new_pos.forEach((np, i) => {
            if (np.x === old_pos[i].x && np.y === old_pos[i].y) {
                return;
            }
            console.log(i, 'yo');
            if (env.walls.has(np.x + '_' + np.y)) {
                return;
            }
            console.log(i, 'yoyo');
            let collides = false;
            for (let j = 0; j < new_pos.length; j++) {
                if (i === j) {
                    continue;
                }
                if (np.x === new_pos[j].x && np.y === new_pos[j].y ||
                    np.x === old_pos[j].x && np.y === old_pos[j].y) {
                    collides = true;
                    break;
                }
            }
            console.log(i, collides);
            if (!collides) {
                console.log('moved', i);
                moved[i] = true;
            }
        });
        if (!moved.some(x => x)) {
            break;
        }
        moved.forEach((m, i) => {
            if (m) {
                old_pos[i] = new_pos[i];
            }
        });
    }
    old_pos.forEach((op, i) => {
        let a = entity_animations[i];
        if (a !== null && a.kind === 'move') {
            if (op.x === state.entities[i].x && op.y === state.entities[i].y) {
                a.kind = 'blocked';
            }
        }
    });
    console.log(entity_animations);
    let new_zone = adj(state.zone, control);
    let zone_dx = new_zone.x - state.zone.x;
    let zone_dy = new_zone.y - state.zone.y;
    state = {
        zone: new_zone,
        entities: state.entities.map((e, i) => Object.assign({}, { ...e, dir: new_dir[i], ...old_pos[i] })),
    };
    return { state, animations: { zone_dx, zone_dy, entity_animations } };
}
export function is_level_completed(env, state) {
    for (let e of state.entities) {
        let reached_goal = false;
        for (let g of env.goals) {
            if (e.x === g.x && e.y === g.y && e.color === g.color) {
                reached_goal = true;
                break;
            }
        }
        if (!reached_goal) {
            return false;
        }
    }
    return true;
}
