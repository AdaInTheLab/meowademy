// Custom CodeMirror 6 syntax mode for LolRust.
// Uses StreamLanguage (the simple line-based tokenizer) since we don't need
// full Lezer grammar precision ~ this is a teaching editor, not an IDE.

import { StreamLanguage } from '@codemirror/language';

const KEYWORDS = new Set([
    // beginner aliases
    'make', 'wiggly', 'when', 'otherwise', 'repeat', 'while', 'do', 'this',
    // classic lolrust
    'iz', 'i', 'can', 'haz', 'or', 'if', 'else',
    'ceiling', 'cat', 'sez', 'basement',
    'loaf', 'pounce', 'flavurz', 'skillz',
    'skritch', 'dat', 'zoomzoom', 'zoomies', 'chase', 'around',
    'cough', 'up', 'yeet', 'flop', 'nap', 'again',
    'yolo', 'lazee', 'waitforit', 'yoink', 'copycat',
    'gimme', 'bigchonk', 'pretend', 'as', 'but', 'only', 'where',
    'dis', 'forever', 'kinda', 'type', 'static', 'pub', 'everycat',
    'furrever', 'prowl', 'purrive',
    // boolean literals
    'yus', 'nope',
    // also the real-Rust keywords passed through unchanged
    'fn', 'let', 'mut', 'struct', 'enum', 'impl', 'trait', 'match',
    'for', 'in', 'loop', 'break', 'continue', 'return', 'use', 'mod',
    'pub', 'self', 'Self', 'super', 'crate', 'as', 'where', 'unsafe',
    'async', 'await', 'move', 'true', 'false',
]);

const TYPES = new Set([
    // lolrust types
    'Yarn', 'Pile', 'Cardboard', 'MaybeCheezburgr', 'Has', 'EmptyBowl',
    'Tryz', 'Purrfect', 'Hairball', 'Dis',
    'Mood', 'Cat', 'Dog', 'Toy',
    // real Rust types (passed through)
    'String', 'Vec', 'Box', 'Option', 'Some', 'None', 'Result', 'Ok', 'Err',
    'i8', 'i16', 'i32', 'i64', 'i128', 'isize',
    'u8', 'u16', 'u32', 'u64', 'u128', 'usize',
    'f32', 'f64', 'bool', 'char', 'str',
]);

// Words that take a `!` to become a macro. Highlighted differently when followed by `!`.
const MACRO_NAMES = new Set([
    'meow', 'hisss', 'ohno', 'say', 'bigsay', 'yell',
    'println', 'eprintln', 'panic', 'print', 'eprint', 'format',
    'vec', 'assert', 'assert_eq', 'dbg', 'todo', 'unimplemented',
]);

export const lolrustLanguage = StreamLanguage.define({
    name: 'lolrust',

    startState() {
        return { inBlockComment: false };
    },

    token(stream, state) {
        // block comment continuation
        if (state.inBlockComment) {
            while (!stream.eol()) {
                if (stream.match('*/')) {
                    state.inBlockComment = false;
                    return 'comment';
                }
                stream.next();
            }
            return 'comment';
        }

        if (stream.eatSpace()) return null;

        // line comment
        if (stream.match('//')) {
            stream.skipToEnd();
            return 'comment';
        }
        // block comment start
        if (stream.match('/*')) {
            state.inBlockComment = true;
            return 'comment';
        }

        // string literal (handles \" escapes)
        if (stream.match(/^"(?:[^"\\]|\\.)*"/)) return 'string';
        // unterminated string (still color it ~ user is mid-typing)
        if (stream.match(/^"[^"\\]*$/)) return 'string';

        // char literal: 'x' or '\n' (but NOT a lifetime 'a)
        if (stream.match(/^'(?:[^'\\]|\\.)'/)) return 'character';

        // lifetime: 'a (single quote followed by an identifier, no closing quote)
        if (stream.match(/^'[a-z_][a-zA-Z0-9_]*/)) return 'meta';

        // numbers
        if (stream.match(/^\d+(\.\d+)?/)) return 'number';

        // identifier
        const m = stream.match(/^[A-Za-z_][A-Za-z0-9_]*/);
        if (m) {
            const word = m[0];
            // macro: word immediately followed by !
            if (stream.peek() === '!' && MACRO_NAMES.has(word)) {
                stream.next(); // consume !
                return 'macroName';
            }
            if (KEYWORDS.has(word)) return 'keyword';
            if (TYPES.has(word)) return 'typeName';
            // function call: identifier followed by (
            if (stream.peek() === '(') return 'function';
            return null;
        }

        // operators / punctuation ~ leave un-highlighted
        stream.next();
        return null;
    },
});
