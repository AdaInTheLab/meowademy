---
layout: ../../../layouts/DocsShell.astro
title: Purr Macros
description: The macro system. Reluctantly explained.
---

# Purr Macros

The cat does not like macros. The cat must explain them anyway.

A macro in Rust is a function that runs at compile time and emits code. It can take pretty much anything as input and return pretty much anything as output. This is powerful. This is also what the cat dislikes about it. The cat prefers things that can be reasoned about by reading them.

But macros exist. They are useful. The cat has accepted this.

## The Lolrust Macros You Already Know

Three macros are renamed at the transpiler level. Their bodies are unchanged ~ they expand to the exact same code as the Rust originals. We just type different letters.

| LolRust | Rust | What it does |
|---|---|---|
| `meow!(...)` | `println!(...)` | print to stdout |
| `hisss!(...)` | `eprintln!(...)` | print to stderr |
| `ohno!(...)` | `panic!(...)` | crash on purpose |

These are the *only* macros lolrust touches. The transpiler does a text-level swap before `rustc` ever sees the code. There is no special lolrust-side macro logic. The cat would refuse to write any.

The Beginner aliases (`say`, `bigsay`, `yell`) are also text-level replacements, but they replace the entire macro call form. You write `say "hello";` and the transpiler emits `println!("hello");`. The Beginner aliases do not have the `!` because at the lolrust level they are just keywords, not macros.

## All The Other Macros

Every other Rust macro keeps its Rust name. This includes:

- `format!` ~ build a `Yarn` (`String`) from a template
- `vec!` ~ build a `Pile` (`Vec`)
- `assert!`, `assert_eq!`, `assert_ne!` ~ panic-if-false
- `dbg!` ~ print a value and return it (the cat tolerates this one)
- `todo!`, `unimplemented!` ~ stand-ins that panic
- `write!`, `writeln!` ~ formatted writing into anything that takes a write handle
- `include_str!`, `include_bytes!` ~ embed file contents at compile time
- `concat!`, `stringify!` ~ compile-time string operations
- everything else from `std::macros` and your dependencies

The cat does not rename these because every cat-name added is a name the cat has to remember, and most of these are recognizable Rust idioms that translate as-is. The cat has standards.

## Writing Your Own Macros

If you write a `macro_rules!` block in your `.meow` file, lolrust passes it through to `rustc` unchanged. There is no cat-flavored macro syntax. There is no `purr_rules!`. The cat refused.

```rust
// in your .meow file:
macro_rules! treat_count {
    ($n:expr) => {
        meow!("{} treats", $n);
    };
}

iz main() {
    treat_count!(7);
}
```

This works exactly as you would expect. `macro_rules!` is the only macro definition mechanism we touch. The cat tolerates it because it is at least pattern-matchy, and the cat respects pattern matching.

## Procedural Macros

Procedural macros (`#[derive]`, attribute macros, function-like macros backed by a `proc-macro` crate) work normally. The lolrust transpiler does not rewrite procedural macro syntax, with one exception: the `#[derive(...)` attribute is renamed to `purrive(...)` at the cat level.

```rust
purrive(Debug, Clone)]
loaf Cat {
    name: Yarn,
    lives: i32,
}
```

This transpiles to:

```rust
#[derive(Debug, Clone)]
struct Cat {
    name: String,
    lives: i32,
}
```

The cat enjoys the alliteration. This is the only macro-related concession the cat made. Do not push your luck.

## What Lolrust Does Not Do

Lolrust does not have:

- A custom macro language. `macro_rules!` is what you have.
- A way to define your own cat-named macros. If you want to call a macro `kibble!`, define it as `kibble!` in plain Rust syntax, and the transpiler will pass it through.
- Hygiene rules different from Rust. The hygiene model is whatever Rust's hygiene model is in your `rustc` version.

## Why The Cat Is This Way About Macros

Most of lolrust's decisions are shallow renames. The cat looks at a Rust keyword, picks a cat word that has roughly the same vibe, and trusts the transpiler to do the substitution. The cat understands every word it has renamed. The cat can predict the output.

Macros are different. A macro can produce arbitrary code. A macro you wrote yesterday can change what your code means today. A macro can hide bugs that look like type errors but are actually input pattern errors. The cat does not like things it cannot predict by reading.

This is why lolrust has no cat-flavored macro layer. The cat would rather you use Rust's macro system and accept its complexity than add a thin lolrust shell on top that pretends macros are simple. Macros are not simple. The cat respects them by leaving them alone.

If you want to learn Rust macros properly, the cat recommends [*The Little Book of Rust Macros*](https://veykril.github.io/tlborm/). The cat has read it. The cat learned things. The cat is still suspicious.
