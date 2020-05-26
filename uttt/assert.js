export default function assert(cond, message) {
    if (!cond) {
        console.assert(cond, message || 'assert failed');
        throw message || 'assert failed';
    }
}
