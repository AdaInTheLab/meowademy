---
layout: ../../../layouts/DocsShell.astro
title: Getting Starty Starty
description: Install lolrust, write your first program, get judged by a cat.
---

# Getting Starty Starty

So you wish to make a kitteh program. Excellent. Sit. Listen carefully. Or don't. The cat does not care.

## What U Need

A computer. It is presumed you have already acquired one.

`rustc` on the PATH. Lolrust is a transpiler ~ it converts your `.meow` file to actual Rust, then hands the Rust to `rustc` for the boring part. If `rustc` is not installed, install it. The cat will wait. The cat is patient. The cat is also judging you for not having installed Rust already.

Optional: a brain. Some of the keywords are silly. You will need to forgive them.

## Installing

```bash
cargo install lolrust
```

That is the whole thing.

## First Program

Make a file called `hello.meow`. The extension matters. The cat is firm on this.

```rust
iz main() {
    meow!("oh hai world! :3");
}
```

Then run it:

```bash
lolrust hello.meow --run
```

The cat will print `oh hai world! :3` to your terminal. If it does not, the cat is broken. Or you. One of you.

## What Just Happened

Three things, in order.

First, lolrust read `hello.meow` and replaced cat words with Rust words. `iz` became `fn`. `meow!` became `println!`. Same program, less personality, more compilable.

Then, lolrust handed the resulting `.rs` file to `rustc`. `rustc` performed its usual ritual: type-checked the program, complained about nothing in particular, and produced an executable.

Finally, lolrust ran the executable. You saw the message. The cat is satisfied.

You can see the intermediate Rust file by passing `--emit-rs` instead of `--run`:

```bash
lolrust hello.meow --emit-rs
```

This produces `hello.rs`. Look at it. It is just Rust. It will not bite. (It might, actually. Rust bites sometimes. The borrow checker is mostly water but occasionally lava. We have a section on this.)

## Next

If you want to learn lolrust by writing it, the [lessons](/lolrust/lesson-1) are interactive. You write code in the browser and watch the Rust come out the other side.

If you want to know what every keyword does, the [Keyword Reference](/lolrust/docs/keywords) lists all three columns: beginner alias, classic, Rust.

If you want lolrust scripture and you do not know what that means, [The Book of Loaf](https://skulk.ai/lore/book-of-loaf/) is canonical and Ada bears no responsibility for it. Also, you are not ready.
