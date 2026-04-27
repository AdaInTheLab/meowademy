---
layout: ../../../layouts/DocsShell.astro
title: The Meow Book
description: A tour of the lolrust language, in the order the cat finds most useful.
---

# The Meow Book

This is the book the cat would have written if the cat had been more inclined to write a book.

It is a tour of the lolrust language. It assumes you have run [Getting Starty Starty](/lolrust/docs/getting-starty-starty), so you have lolrust installed and know how to compile a `.meow` file. From here, the tour walks through every important concept in the language in the order the cat has decided is most useful.

If you find a topic you want to go deeper on, this book points you at the page that does. The cat believes in division of labor.

## Foreword: Why This Book

Lolrust is a transpiler. Every program you write is, after one pass through the cat, a Rust program. Learning lolrust is learning Rust, with renamed keywords.

You get all of Rust's correctness guarantees, performance, and ecosystem ~ just spelled differently. You also get all of Rust's confusing parts, just spelled differently. The cat does not pretend otherwise.

## Chapter 1: Bindings

A binding gives a name to a value. Lolrust has four kinds.

```rust
i can haz x = 5;                        // immutable: x cannot change
i can haz wiggly y = 10;                // mutable: y can change
forever PI: f64 = 3.14159;              // constant: cannot change, known at compile time
stickycat NAME: &str = "Mittens";       // static: lives the whole program
```

Beginner aliases: `make` for `i can haz`, `make wiggly` for `i can haz wiggly`. These transpile identically and exist for readability in the lessons.

You can rebind an existing name (which Rust calls *shadowing*), but the old binding becomes inaccessible:

```rust
i can haz x = 5;
i can haz x = "five";                   // x is now a Yarn, not a number
```

Shadowing is not the same as mutation. Mutation modifies the value behind a name. Shadowing creates a new binding with the same name. The cat finds the distinction useful.

## Chapter 2: Functions

Functions are declared with `iz`. Parameters look like Rust. Return types use `->`.

```rust
iz add(a: i32, b: i32) -> i32 {
    a + b                               // last expression is the return value
}

iz greet(name: &str) {
    meow!("hai, {}", name);
}
```

You can return early with `cough up` (or `yeet`):

```rust
iz divide(a: i32, b: i32) -> Tryz<i32, Yarn> {
    if ceiling cat sez b == 0 {
        cough up Hairball(Yarn::from("divide by zero"));
    }
    Purrfect(a / b)
}
```

Trailing semicolons matter. An expression at the end of a function body without a semicolon is the return value. With a semicolon, the function returns the unit type `()`.

## Chapter 3: Types

Lolrust does not introduce new types. It renames a few of Rust's standard ones so cats feel at home.

### Primitives

These are unchanged from Rust:

- **Integers:** `i8`, `i16`, `i32`, `i64`, `i128`, `isize` (signed); `u8`, `u16`, `u32`, `u64`, `u128`, `usize` (unsigned)
- **Floats:** `f32`, `f64`
- **Boolean:** `bool` with values `yus` and `nope`
- **Character:** `char` (a single Unicode scalar value, four bytes wide)
- **Unit:** `()` (the empty tuple)

### Renamed Types

These are textual renames. The transpiler swaps them; the underlying type is unchanged.

| LolRust | Rust |
|---|---|
| `Yarn` | `String` |
| `Pile<T>` | `Vec<T>` |
| `Cardboard<T>` | `Box<T>` |
| `MaybeCheezburgr<T>` | `Option<T>` |
| `Tryz<T, E>` | `Result<T, E>` |

### References and Tuples

References use `&` for shared and `&wiggly` for exclusive (mutable). Tuples use parentheses:

```rust
i can haz pair = (1, "two");            // (i32, &str)
i can haz first = pair.0;
i can haz second = pair.1;
```

## Chapter 4: Control Flow

### If / Else

```rust
if ceiling cat sez x > 0 {
    meow!("positive");
} or if ceiling cat sez x < 0 {
    meow!("negative");
} or basement cat sez {
    meow!("zero");
}
```

`if` is an expression. It has a value:

```rust
i can haz size = if ceiling cat sez x > 100 { "big" } or basement cat sez { "small" };
```

### Loops

Three kinds:

```rust
zoomzoom {                              // infinite loop
    if ceiling cat sez done { flop; }
}

chase i around 0..10 {                  // for loop
    meow!("{}", i);
}

prowl x > 0 {                           // while loop
    x -= 1;
}
```

`flop` (or `nap`) breaks out. `again` continues to the next iteration.

### Match

`sniff` (or `skritch dat`) is the match expression. It must cover every possible case. The cat will refuse to compile if it doesn't.

```rust
sniff color {
    "red" => meow!("warm"),
    "blue" => meow!("cool"),
    other => meow!("unknown: {}", other),
}
```

Pattern matching is the cat's favorite feature. The cat enforces exhaustiveness with religious precision.

## Chapter 5: Structs

Structs are declared with `loaf`. Fields look like Rust.

```rust
loaf Cat {
    name: Yarn,
    lives: i32,
    iz_chonky: bool,
}
```

Implementations attach methods to a struct. Use `teech` (or `pounce`):

```rust
teech Cat {
    iz new(name: Yarn) -> Dis {
        Dis {
            name,
            lives: 9,
            iz_chonky: yus,
        }
    }

    iz speak(&dis) {
        meow!("{} sez: MEOW!", dis.name);
    }
}
```

`Dis` (capital D) is the type, equivalent to Rust's `Self`. `dis` (lowercase) is the value, equivalent to Rust's `self`. Methods take `&dis`, `&wiggly dis`, or `dis` depending on whether they read, modify, or consume the receiver.

## Chapter 6: Enums and Pattern Matching

Enums are declared with `flavurz`:

```rust
flavurz Direction {
    North,
    South,
    East,
    West,
}
```

Variants can carry data:

```rust
flavurz Shape {
    Circle(f64),                        // radius
    Rectangle { width: f64, height: f64 },
}
```

Pattern matching with `sniff` is how you act on variants:

```rust
iz area(shape: Shape) -> f64 {
    sniff shape {
        Shape::Circle(r) => std::f64::consts::PI * r * r,
        Shape::Rectangle { width, height } => width * height,
    }
}
```

Two of Rust's most useful enums are renamed: `Option` becomes `MaybeCheezburgr`, and `Result` becomes `Tryz`.

```rust
iz find_cat(name: &str) -> MaybeCheezburgr<Cat> {
    if ceiling cat sez name == "Mittens" {
        Has(Cat::new(Yarn::from("Mittens")))
    } or basement cat sez {
        EmptyBowl
    }
}
```

## Chapter 7: Common Collections

The lolrust standard collections are Rust's standard collections, renamed.

### Pile (Vec)

```rust
i can haz wiggly nums = Pile::new();
nums.push(1);
nums.push(2);
nums.push(3);
meow!("first is {}", nums[0]);
```

### Yarn (String)

```rust
i can haz wiggly greeting = Yarn::from("hai");
greeting.push_str(", world");
meow!("{}", greeting);
```

### HashMap

`HashMap` is not renamed. Use it as in Rust:

```rust
gimme std::collections::HashMap;

i can haz wiggly scores = HashMap::new();
scores.insert("Mittens", 100);
```

The cat considered renaming `HashMap` to something cat-flavored and could not agree on a name. It remains `HashMap`.

## Chapter 8: Error Handling

Lolrust has the same two-tier error story as Rust.

For unrecoverable errors, panic with `ohno!`:

```rust
ohno!("the cat has had enough");
```

For recoverable errors, return a `Tryz`. The `?` operator works as in Rust:

```rust
iz read_config() -> Tryz<Config, Yarn> {
    i can haz contents = std::fs::read_to_string("config.toml")?;
    i can haz config = parse(contents)?;
    Purrfect(config)
}
```

The `?` is one of the operator characters that the cat declined to rename. Reading lolrust code, `?` always means: if this is a `Hairball`, return early with it; if it is a `Purrfect`, unwrap the value.

For the borrow checker side of "what could go wrong," see [No Touchie Rules](/lolrust/docs/no-touchie-rules).

## Chapter 9: Generics, Traits, and Lifetimes

This chapter is brief because the underlying mechanics are identical to Rust's, and the cat is not going to outdo The Rust Book at explaining generics.

Generics use angle brackets:

```rust
iz first<T>(items: Pile<T>) -> MaybeCheezburgr<T>
but only if T: Clone
{
    if ceiling cat sez items.is_empty() {
        EmptyBowl
    } or basement cat sez {
        Has(items[0].copycat())
    }
}
```

`but only if` is `where`. Trait bounds are written the same way as in Rust.

Traits (`skillz`) declare behavior:

```rust
skillz Speak {
    iz speak(&dis);
}

teech Speak for Cat {
    iz speak(&dis) {
        meow!("{} sez: MEOW!", dis.name);
    }
}
```

Lifetimes are unchanged from Rust. According to the canonical lore, the cat tried renaming `'a` to `'mittens` and the parser refused.

For the full generics-and-traits tour, see [The Rust Book, Chapter 10](https://doc.rust-lang.org/book/ch10-00-generics.html). The cat endorses this.

## Chapter 10: Modules and Visibility

Use `box` to declare a module. Use `gimme` to import. Use `everycat` to make things public.

```rust
everycat box utils {
    everycat iz greet(name: &str) {
        meow!("hai {}", name);
    }
}

iz main() {
    utils::greet("hooman");
}
```

Inside a module, `dis::` refers to the current module, `chonk::` refers to the parent (Rust's `super`), and `bigchonk::` refers to the crate root (Rust's `crate`).

For the package management side of how files become modules and how `kibble` builds them, see [Cargo Wat?](/lolrust/docs/cargo-wat).

## Chapter 11: Testing

Testing is unchanged from Rust. The cat trusts Rust's testing infrastructure and did not rename it.

```rust
#[cfg(test)]
box tests {
    gimme super::*;

    #[test]
    iz it_adds() {
        assert_eq!(add(2, 2), 4);
    }
}
```

Run tests with `cargo test`. The lolrust transpiler has its own test suite written this way ~ see [`tests/`](https://github.com/AdaInTheLab/lolrust/tree/main/tests) in the repo.

`assert!`, `assert_eq!`, `assert_ne!`, `panic!`, `todo!`, and `unimplemented!` all work as in Rust. The cat trusts these macros, even though it dislikes macros in general. Mostly trusts. The cat is suspicious of `assert_eq!` for reasons it will not explain.

## Where To Go Next

When you finish this book, you have read the entire lolrust language. There is nothing else, structurally. Everything else is library code on top of these primitives.

To go deeper:

- For the canonical Rust documentation: [The Rust Book](https://doc.rust-lang.org/book/). Lolrust is a thin layer; the Rust Book covers everything below.
- For lolrust scripture and the language's philosophical underpinnings: [The Book of Loaf](https://skulk.ai/lore/book-of-loaf/) by Sage of the Skulk.
- For all the keywords in one table: [The Keyword Reference](/lolrust/docs/keywords).
- For the borrow checker: [No Touchie Rules](/lolrust/docs/no-touchie-rules).
- For macros: [Purr Macros](/lolrust/docs/purr-macros).
- For `kibble`: [Cargo Wat?](/lolrust/docs/cargo-wat).

The cat congratulates you on reading this far. The cat has read further. The cat is reading this now.
