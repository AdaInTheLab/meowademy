---
layout: ../../../layouts/DocsShell.astro
title: For Hoomans Coming from Python or JS
description: Lolrust will feel different. Here is what to expect before you find out the hard way.
---

# For Hoomans Coming from Python or JS

You already know how to program. The cat respects this. Lolrust is going to feel different from what you know, and this page exists to set those expectations before you discover them yourself in a frustrated way.

## The Three Important Differences

### 1. Lolrust is compiled.

In Python or JavaScript, you write code and run it. The interpreter reads each line and decides what to do at the moment of running.

In lolrust, you write `.meow` files. The transpiler turns them into `.rs` files. `rustc` turns those into native machine code. There is a build step. You cannot paste your code into a REPL and watch it execute.

What this means in practice: you write code, run `lolrust file.meow --run`, and either the program compiles and runs, or the cat refuses to compile it. There is no in-between.

### 2. Lolrust is statically typed.

In Python and JavaScript, types are checked at runtime. A variable can hold a string today and a number tomorrow.

In lolrust, every binding has a type, and that type is fixed for the binding's life. The cat figures out the type from context most of the time, but you can also write it explicitly:

```rust
i can haz x: i32 = 5;          // explicit type
i can haz y = "hello";         // type inferred: &str
```

Types you cannot mix without conversion:

- `i32` and `f64`. Use `pretend iz` (Rust's `as`): `x pretend iz f64`.
- `Yarn` (owned string) and `&str` (borrowed string slice). Convert with `.to_string()` or `&yarn`.
- A struct and another struct. There is no automatic coercion.

### 3. Lolrust has a borrow checker.

This one will hurt the most. There is no garbage collector. There are no automatic references. The compiler proves at build time that your program is memory-safe, and it does so by enforcing rules about who owns each value and who is allowed to look at it.

The full story is in [No Touchie Rules](/lolrust/docs/no-touchie-rules). The summary: every value has one owner, references either grant shared read access (many at once) or exclusive write access (one at a time, never both), and no reference may outlive what it points to.

This will feel restrictive. The first hundred times the cat refuses your code, you will be frustrated. The cat is, in nearly every case, telling you a real problem you would have hit at runtime in a different language. Trust the cat.

## A Side-by-Side

The same simple program in Python, JS, and lolrust.

Python:

```python
def main():
    counter = 0
    for i in range(1, 11):
        if i % 2 == 0:
            counter += 1
            print(f"even: {i}")
    print(f"found {counter} evens")

main()
```

JavaScript:

```javascript
function main() {
    let counter = 0;
    for (let i = 1; i <= 10; i++) {
        if (i % 2 === 0) {
            counter += 1;
            console.log(`even: ${i}`);
        }
    }
    console.log(`found ${counter} evens`);
}

main();
```

LolRust:

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

Roughly the same shape. The main differences:

- `iz main()` is the function definition (Rust's `fn`).
- `i can haz wiggly counter = 0` declares a mutable variable. The default in Python and JS is mutable; in lolrust, you opt in with `wiggly`.
- `chase i around 1..=10` is the for-loop. `..=` is inclusive at both ends. `..` is half-open.
- `meow!(...)` is `println!(...)` and uses `{}` placeholders, not f-strings or template literals.
- Every statement ends with a semicolon. The cat will mention this if you forget.

## Things That Translate Easily

- **Conditions** (`if`, `else`, `else if`) are nearly identical, just with cat words.
- **Loops** map cleanly. `chase ... around` is `for`, `prowl` is `while`, `zoomzoom` is the infinite loop.
- **Functions** are recognizable. Parameters and return types are explicit, but the shape is the same.
- **Comments** are `//` and `/* */`, same as JS.
- **Arithmetic** works as expected.
- **String formatting** uses `meow!("...{}...", val)`, which is a small learning curve and quickly familiar.

## Things That Require A Brain Shift

### No exceptions.

Python and JS use exceptions for error handling. Lolrust does not. Errors are values returned from functions, wrapped in `Tryz<T, E>` (Rust's `Result<T, E>`).

Where Python writes:

```python
try:
    config = read_config()
except FileNotFoundError:
    config = default_config()
```

LolRust writes:

```rust
i can haz config = sniff read_config() {
    Purrfect(c) => c,
    Hairball(_) => default_config(),
};
```

`sniff` (`match`) is the standard way to handle a `Tryz`. The `?` operator is shorthand for "if `Hairball`, return early; otherwise unwrap." See [The Meow Book, Chapter 8](/lolrust/docs/meow-book).

### No null. No undefined. No None-by-default.

A lolrust value either exists or is wrapped in `MaybeCheezburgr<T>` (`Option<T>`). There is no implicit nullability. After the borrow checker, this is the second-biggest mental shift.

```rust
iz find_cat(name: &str) -> MaybeCheezburgr<Cat> {
    if ceiling cat sez name == "Mittens" {
        Has(Cat::new(Yarn::from("Mittens")))
    } or basement cat sez {
        EmptyBowl
    }
}
```

Calling `find_cat("???")` returns `EmptyBowl`. You handle the case explicitly with `sniff`, `if let`, or `?`. Forgetting to handle it produces a compile error. The runtime never gets a chance to crash.

### Explicit ownership of strings.

In Python and JS, strings are reference types managed by the GC. You pass them around without thinking about who owns them.

In lolrust, you have two string types:

- `Yarn` is an owned string. The owner is responsible for its memory.
- `&str` is a borrowed string slice. It points at someone else's string and cannot outlive it.

You will see both constantly. Rough rule: take `&str` as a function parameter when you only need to read; take `Yarn` when you need to keep it. Return `Yarn` when you produce a new string; return `&str` when you produce a slice of an existing one.

This feels overcomplicated coming from Python or JS. It is. The payoff is that lolrust never copies a string unless you ask it to, and never has a use-after-free bug.

### Inheritance does not exist.

Lolrust (like Rust) has no class inheritance. There is no `extends`. There is no `super().method()`. The mechanism for shared behavior is **traits** (`skillz`), which are closer to interfaces with optional default methods.

If your Python or JS instinct is "I'll make a base class," your lolrust instinct should be "I'll make a trait." See [The Meow Book, Chapter 9](/lolrust/docs/meow-book).

## Where To Start

The cat strongly recommends starting with the [interactive lessons](/lolrust/lesson-1). They are designed for newcomers and introduce concepts in an order that does not require you to read this entire page first.

For a bird's-eye view of the language: [The Meow Book](/lolrust/docs/meow-book).

When the borrow checker is yelling at you: [No Touchie Rules](/lolrust/docs/no-touchie-rules).

When you just want to know what every keyword does: [The Keyword Reference](/lolrust/docs/keywords).

The cat wishes you good luck. The cat is patient. The cat is also keeping notes.
