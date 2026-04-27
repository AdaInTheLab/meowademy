// Per-browser progress for the LolRust course.
// localStorage only ~ no accounts, no backend, no sync.
//
// Per-lesson shape:
//   {
//     completed: bool,
//     completedAt: timestamp,
//     hintsUsed: number,         // count of hints revealed (any time)
//     solutionRevealed: bool,    // did the learner click "show me the solution"
//     medal: 'gold'|'silver'|'bronze'|null,  // FROZEN at first completion
//   }
//
// Anyone (sidebar, editor, lesson shell) can:
//   - read with getProgress() / isUnlocked() / isCompleted() / getMedal()
//   - write with markCompleted() / markHintUsed() / markSolutionRevealed() / reset()
//   - listen for changes via the 'meowademy:progress' window event

const STORAGE_KEY = 'meowademy:lolrust:v1';
const EVENT = 'meowademy:progress';
export const TOTAL_LESSONS = 16;
export const COURSE = 'lolrust';

function safeParse(raw) {
    if (!raw) return {};
    try { return JSON.parse(raw); }
    catch { return {}; }
}

function emit(progress, justCompleted = null, extra = {}) {
    window.dispatchEvent(new CustomEvent(EVENT, {
        detail: { progress, justCompleted, ...extra },
    }));
}

function ensureLesson(p, n) {
    if (!p[n]) p[n] = { hintsUsed: 0, solutionRevealed: false };
    if (typeof p[n].hintsUsed !== 'number') p[n].hintsUsed = 0;
    if (typeof p[n].solutionRevealed !== 'boolean') p[n].solutionRevealed = false;
    return p[n];
}

function computeMedal(lesson) {
    if (lesson.solutionRevealed) return 'bronze';
    if (lesson.hintsUsed > 0) return 'silver';
    return 'gold';
}

export function getProgress() {
    if (typeof localStorage === 'undefined') return {};
    return safeParse(localStorage.getItem(STORAGE_KEY));
}

export function getLesson(n) {
    const p = getProgress();
    return p[n] || null;
}

export function isCompleted(n) {
    const l = getLesson(n);
    return !!(l && l.completed);
}

export function isUnlocked(n) {
    if (n <= 1) return true;
    return isCompleted(n - 1);
}

export function getCompletedCount() {
    return Object.values(getProgress()).filter(l => l && l.completed).length;
}

export function getHighestUnlocked() {
    for (let n = TOTAL_LESSONS; n >= 1; n--) {
        if (isUnlocked(n)) return n;
    }
    return 1;
}

export function getMedal(n) {
    const l = getLesson(n);
    return l && l.medal ? l.medal : null;
}

function persist(p) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function markCompleted(n) {
    if (typeof localStorage === 'undefined') return null;
    const p = getProgress();
    const lesson = ensureLesson(p, n);
    const wasCompleted = !!lesson.completed;
    lesson.completed = true;
    lesson.completedAt = lesson.completedAt || Date.now();
    if (!wasCompleted) {
        // Freeze medal at first completion. Future hint/solution reveals don't downgrade.
        lesson.medal = computeMedal(lesson);
    }
    persist(p);
    if (!wasCompleted) emit(p, n, { medal: lesson.medal });
    return lesson.medal;
}

export function markHintUsed(n) {
    if (typeof localStorage === 'undefined') return 0;
    const p = getProgress();
    const lesson = ensureLesson(p, n);
    lesson.hintsUsed += 1;
    persist(p);
    emit(p);
    return lesson.hintsUsed;
}

export function markSolutionRevealed(n) {
    if (typeof localStorage === 'undefined') return;
    const p = getProgress();
    const lesson = ensureLesson(p, n);
    lesson.solutionRevealed = true;
    persist(p);
    emit(p);
}

export function reset() {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
    emit({}, null, { reset: true });
}

export function subscribe(handler) {
    const fn = (e) => handler(e.detail);
    window.addEventListener(EVENT, fn);
    const storageFn = (e) => {
        if (e.key === STORAGE_KEY) handler({ progress: getProgress(), justCompleted: null });
    };
    window.addEventListener('storage', storageFn);
    return () => {
        window.removeEventListener(EVENT, fn);
        window.removeEventListener('storage', storageFn);
    };
}
