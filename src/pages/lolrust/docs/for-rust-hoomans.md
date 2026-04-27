---
layout: ../../../layouts/DocsShell.astro
title: For Hoomans Coming from Rust
description: You already know Rust. Here is the cat translation, curated for speed.
---

# For Hoomans Coming from Rust

You already know Rust. The cat respects this. This page exists to let you start writing lolrust without re-reading anything you have already memorized.

The headline: lolrust is a transpiler. Your `.meow` file becomes a `.rs` file before `rustc` ever sees it. The borrow checker, the type system, the macros, the lifetimes ~ all of it is unchanged. You are still writing Rust. You are just writing it in cat.

## The Vocabulary You Will Need First

The keywords you will use in your first ten minutes of lolrust. The full reference, with edge cases, lives at [The Keyword Reference](/lolrust/docs/keywords).

| Rust | LolRust (Classic) | LolRust (Beginner) |
|---|---|---|
| `fn` | `iz` | ~ |
| `let` | `i can haz` | `make` |
| `let mut` | `i can haz wiggly` | `make wiggly` |
| `mut` | `wiggly` | ~ |
| `if` / `else` | `if ceiling cat sez` / `or basement cat sez` | `when` / `otherwise` |
| `match` | `sniff` or `skritch dat` | ~ |
| `loop` | `zoomzoom` | `do this` |
| `for ... in` | `chase ... around` or `furrever ... around` | ~ |
| `while` | `prowl` | `repeat while` |
| `return` | `cough up` or `yeet` | ~ |
| `println!` | `meow!` | `say` or `bigsay` |
| `eprintln!` | `hisss!` | `yell` |
| `panic!` | `ohno!` | ~ |
| `struct` | `loaf` | ~ |
| `impl` | `teech` or `pounce` | ~ |
| `enum` | `flavurz` | ~ |
| `trait` | `skillz` | ~ |
| `String` | `Yarn` | ~ |
| `Vec` | `Pile` | ~ |
| `Option` | `MaybeCheezburgr` | ~ |
| `Result` | `Tryz` | ~ |
| `Some` / `None` | `Has` / `EmptyBowl` | ~ |
| `Ok` / `Err` | `Purrfect` / `Hairball` | ~ |
| `true` / `false` | `yus` / `nope` | ~ |
| `self` / `Self` | `dis` / `Dis` | ~ |
| `super` | `chonk` | ~ |
| `crate` | `bigchonk` | ~ |
| `use` | `gimme` | ~ |
| `mod` | `box` | ~ |
| `unsafe` | `yolo` | ~ |
| `async` / `await` | `lazee` / `waitforit` | ~ |
| `move` | `yoink` | ~ |
| `as` | `pretend iz` | ~ |
| `where` | `but only if` | ~ |
| `#[derive(...)` | `purrive(...)` | ~ |
| `.clone()` | `.copycat()` | ~ |

## A Side-by-Side

The same trivial program in both languages.

Rust:

```rust
fn main() {
    let mut counter = 0;
    for i in 1..=10 {
        if i % 2 == 0 {
            counter += 1;
            println!("even: {}", i);
        }
    }
    println!("found {} evens", counter);
}
```

LolRust (classic):

```rust
iz main() {
    i can haz wiggly counter = 0;
    chase i around 1..=10 {
        if ceiling cat sez i % 2 == 0 {
            counter += 1;
            meow!("even: {}", i);
        }
    }
    meow!("found {} evens", counter);
}
```

Same behavior. Same emitted code. The `.rs` file produced by `lolrust counter.meow --emit-rs` is byte-equivalent to the Rust above, modulo whitespace.

## What Does Not Change

- **The borrow checker.** Same checker, same lifetimes, same errors. We call it the No Touchie Checker, and the errors come with random cat reactions if you pass `--explain`. See [No Touchie Rules](/lolrust/docs/no-touchie-rules).
- **The type system.** Generics work. Traits work. Trait bounds work. `where` clauses work, but you spell them `but only if`.
- **The macro system.** `meow!` is a transpiler-level renaming of `println!`, not a new macro. You can write your own `macro_rules!` exactly as you would in Rust. Lolrust does not have its own macro system. The cat declined to build one.
- **Cargo.** You can still use `cargo` directly. Lolrust ships its own package manager, `kibble`, but `kibble` is shallow ~ it is cargo with cat varnish, not a replacement.
- **Crate ecosystem.** Any crate on crates.io works in lolrust because by the time `rustc` sees the code, it is just Rust. `gimme rand;` becomes `use rand;`. Done.

## What Does Change

- **Operator characters do not get cat-renamed.** You still write `&`, `&mut` (or `&wiggly`), `*`, `?`, `=>`, etc. There is no plan to rename operator characters. The cat has standards.
- **Lifetimes do not get cat-renamed.** You still write `'a` and `'static`. According to canonical lore, the cat tried writing `'mittens` and the parser refused, so they reverted.
- **Some names look different but are the same thing.** `Yarn` is genuinely just a rename of `String`. `Pile<T>` is genuinely just `Vec<T>`. No wrapper, no newtype, no overhead. The transpiler does the swap as text.

## Build Your First LolRust Crate

In Rust you would `cargo new` and edit `src/main.rs`. In lolrust:

```bash
lolrust kibble init my_kitteh
cd my_kitteh
lolrust kibble run
```

`kibble` is lolrust's `cargo`. Build artifacts go in `litter_box/` instead of `target/`. The manifest is `Kibble.toml` with a `[kitteh]` section instead of `[package]`. The mapping is one-to-one and shallow on purpose. For interop with full `cargo` (workspaces, real dependencies, `cargo build` directly), see [Cargo Wat?](/lolrust/docs/cargo-wat).

## When You Hit a Wall

The most common stumbling block for Rust devs writing lolrust is reflexive habit. You will type `fn` and get a "WHERE IZ IT?? not found" because lolrust does not know `fn`. The fix is to either rewrite to the cat keyword (`iz`), or pass [the `--explain` flag](https://github.com/AdaInTheLab/lolrust/blob/main/src/explain.rs) so rustc's error messages come back through the cat translator.

The second most common stumbling block is autocomplete. Your editor does not know lolrust. The [VS Code extension](https://github.com/AdaInTheLab/lolrust/tree/main/lolrust-vscode) handles syntax highlighting and snippets. Other editors are on you.

## Final Note

Lolrust is a real language only insofar as it transpiles to real Rust. Anything Rust can do, lolrust can do, just spelled differently. Anything Rust cannot do, lolrust also cannot do.

The cat is in charge of spelling. Be patient with the cat.
