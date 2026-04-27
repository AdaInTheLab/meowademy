# Meowademy 🐱

> *Real compiled languages. Maximum cat energy.*

[![Deploy](https://github.com/AdaInTheLab/meowademy/actions/workflows/deploy.yml/badge.svg)](https://github.com/AdaInTheLab/meowademy/actions/workflows/deploy.yml)
[![Live](https://img.shields.io/badge/live-meowademy.com-ff00ff?logo=safari&logoColor=white)](https://meowademy.com)
[![License](https://img.shields.io/github/license/AdaInTheLab/meowademy?style=flat)](LICENSE)

```
        /\_/\
       ( o.o )    Welcome to the litter box, hooman.
        > ^ <
```

Meowademy is the school for cat-flavored programming. The languages are jokes. The binaries are not. Currently teaches **[LolRust](https://github.com/AdaInTheLab/lolrust)** ~ real Rust under the hood, lolcat speak on top, the borrow checker rebranded as the **No Touchie Checker**.

Open [meowademy.com](https://meowademy.com) and start typing `meow!`.

## What u get

- ✍️ **A real code editor** ~ CodeMirror 6 with custom lolrust syntax highlighting (keywords magenta, types yellow, strings green, lifetimes peach), line numbers, tab indent, undo, the lot.
- 🐾 **The No Touchie Checker is real** ~ not a fake "✅ great job!" overlay. Your `.meow` runs through the actual lolrust transpiler in your browser via WebAssembly, and the verdict checks structural properties of the generated Rust. U cannot cheat the cat.
- 🦀 **Real `rustc` execution** ~ once your code transpiles, it gets POSTed to [play.rust-lang.org](https://play.rust-lang.org) and the actual stdout shows up in the OUTPUT pane. Errors get lolcatted (`WHERE IZ IT?? \`name\` iz not declared anywhere`).
- 🥇 **Medals** ~ Gold for solo solves, Silver if you used a hint, Bronze if you peeked at the solution. Frozen at first completion. The cat remembers.
- 🔒 **Lessons gate** ~ can't jump to lesson 8 without finishing lessons 1-7. Sliding sidebar tracks progress.
- 💾 **Per-browser progress** ~ stored in localStorage. No accounts. No backend. No tracking. Reset button if u wanna start fresh.

## The 16 lessons

| # | Lesson | What u learn |
|---|--------|-------------|
| 1 | Your First Meow | `iz main()`, `meow!(...)`, the basic shape |
| 2 | Making Variables | `make`, `make wiggly`, placeholders |
| 3 | Wiggly Variables | mutation, math |
| 4 | When / Otherwise | `when` / `otherwise` (if/else) |
| 5 | Repeat While | `repeat while`, conditionals inside loops |
| 6 | Iz Functions | `iz name(args)`, calling functions |
| 7 | The Loaf (Structs) | `loaf`, fields, `Yarn`, `.field` access |
| 8 | Flavurz (Enums) | `flavurz`, `skritch dat`, exhaustive match |
| 9 | Skritch Dat Mastery | exact / range (`1..=5`) / wildcard (`_`) |
| 10 | Pounce! (Methods) | `pounce`, `&dis`, `&wiggly dis`, methods that mutate |
| 11 | Tryz, Purrfect & Hairball | error handling without `panic!` |
| 12 | The No Touchie Rules | borrowing (`&toy`) vs yoinking (move) |
| 13 | Skillz (Traits) | `skillz`, `pounce X for Y`, generic `<T: Skillz>` |
| 14 | Lifetimes | `'a`, returning borrowed refs |
| 15 | Generics | `<T: Debug>`, magic boxes |
| 16 | 🏆 **Final Project** | FizzBuzz capstone ~ earn the **Golden Loaf** |

## How it actually works

```
    .meow code
        ↓
  [ lolrust WASM transpiler in your browser ]
        ↓
    .rs (Rust code)
        ↓
  [ structural No Touchie Checker ] ─→ medal verdict
        ↓
  [ POST to play.rust-lang.org/execute ]
        ↓
    real stdout (or lolcatted compile errors)
```

Three layers, all honest:

1. **Transpile** ~ the [`lolrust`](https://github.com/AdaInTheLab/lolrust) crate compiled to WASM (~42 KB), bundled in `public/pkg/`. Runs entirely in the browser. No server.
2. **Check** ~ regex against the transpiled Rust to verify each lesson's expected structure (e.g., "has `fn main`", "no leftover `loaf`"). Per-lesson rules live in the lesson's `.astro` frontmatter.
3. **Execute** ~ POST to `play.rust-lang.org/execute`. Real rustc, real stdout. Failures get cat-flavor translation in the OUTPUT pane.

## Run it locally

```bash
git clone https://github.com/AdaInTheLab/meowademy.git
cd meowademy
npm install
npm run dev
# → http://127.0.0.1:4321
```

`npm test` runs the transpile-and-check suite (`node:test`, no browser, ~150 ms). Gates the deploy.

## Tech stack

- **[Astro](https://astro.build) 5** ~ static site, MPA, mostly zero JS until you hit a lesson
- **[CodeMirror 6](https://codemirror.net)** ~ the editor, with a custom `StreamLanguage` mode for lolrust
- **[lolrust](https://github.com/AdaInTheLab/lolrust)** ~ the transpiler, compiled to WebAssembly via `wasm-bindgen`
- **[play.rust-lang.org](https://play.rust-lang.org)** ~ where the transpiled Rust actually runs
- **vanilla JS** for the editor scripts ~ no React, no Vue, no framework. The interactive bits are tiny enough not to need one.

## Deployment

Push to `main` → GitHub Actions ([deploy.yml](.github/workflows/deploy.yml)) → builds → `npm test` gates → rsyncs `dist/` to the VPS (Dreamhost, Apache).

Server config lives in [`public/.htaccess`](public/.htaccess) ~ HTTPS redirect, HSTS, CSP, WASM MIME type, PHP disabled, service workers blocked. Headers verified by the workflow's smoke test after deploy.

Required GitHub secrets: `VPS_SSH_KEY`, `VPS_HOST`, `VPS_USER`, `VPS_PATH`, `SITE_DOMAIN`. Optional: `VPS_PORT` (defaults 22).

## Authoring a new lesson

Each lesson is a single `.astro` file under `src/pages/lolrust/`:

```astro
---
import LessonShell from '../../layouts/LessonShell.astro';
---
<LessonShell
    course="LolRust"
    number={17}
    name="Your Brilliant New Topic"
    objective="One sentence on what they'll do."
    keywords={[
        { code: 'thingy', note: 'what it does in normal cat' },
    ]}
    initial={`iz main() {
    // TODO: the blank
}`}
    checks={[
        { label: 'has fn main', pattern: '\\bfn\\s+main\\s*\\(' },
        // ... structural checks ...
    ]}
    prev={{ href: '/lolrust/lesson-16', label: 'lesson 16' }}
    hints={[ 'first nudge', 'closer nudge', 'almost the answer' ]}
    solution={`iz main() { /* full working code */ }`}
/>
```

Then add a corresponding test case to [`tests/lessons.test.mjs`](tests/lessons.test.mjs) so the CI verifies your `solution` actually passes the `checks`.

## Lore

For the devout, [*The Book of Loaf*](https://skulk.ai/lore/book-of-loaf/) is the canonical LolRust scripture. Mock-theological commentary on the No Touchie Checker, the zoomies, and other feline mysteries.

## FAQ

**Q: Is this a real programming language u can use?**
A: Yes. It transpiles to Rust and compiles to native binaries via `cargo install lolrust`. Resume material.

**Q: Can my cat learn programming here?**
A: All evidence suggests yes.

**Q: Why?**
A: For the shits and the giggles.

## License

MIT ~ see [LICENSE](LICENSE). Ceiling Cat is watching though.

---

*Made with `yolo` energy and zero regrets.*
