---
layout: ../../../layouts/DocsShell.astro
title: The Standard Cat Library
description: Which stdlib items the cat renamed, and which the cat left alone.
---

# The Standard Cat Library

The cat manages the lolrust standard library. This is mostly a catalog of which Rust stdlib items the cat renamed and which the cat left alone. The cat is meticulous about this.

If a name does not appear in the renamed set below, it is passthrough ~ you write the Rust name in your `.meow` file, and the transpiler hands it to `rustc` unchanged.

## The Renamed Set

These are the only stdlib types and variants the cat has cat-renamed.

### Types

| LolRust | Rust | Module |
|---|---|---|
| `Yarn` | `String` | `std::string::String` |
| `Pile<T>` | `Vec<T>` | `std::vec::Vec` |
| `Cardboard<T>` | `Box<T>` | `std::boxed::Box` |
| `MaybeCheezburgr<T>` | `Option<T>` | `std::option::Option` |
| `Tryz<T, E>` | `Result<T, E>` | `std::result::Result` |

### Variants

| LolRust | Rust | Belongs to |
|---|---|---|
| `Has(value)` | `Some(value)` | `MaybeCheezburgr` |
| `EmptyBowl` | `None` | `MaybeCheezburgr` |
| `Purrfect(value)` | `Ok(value)` | `Tryz` |
| `Hairball(error)` | `Err(error)` | `Tryz` |

### Macros

| LolRust | Rust |
|---|---|
| `meow!` | `println!` |
| `hisss!` | `eprintln!` |
| `ohno!` | `panic!` |

That is the whole renamed set. Five types, four variants, three macros.

## The Passthrough Set

Everything else in the Rust standard library is reachable in lolrust by its Rust name. If you would write `std::fs::File` in Rust, you write `std::fs::File` in lolrust. The transpiler passes the path through.

Some pieces you will use frequently:

### Collections (`std::collections`)

- `HashMap<K, V>` ~ key-value lookup. The cat could not name it.
- `BTreeMap<K, V>` ~ ordered key-value lookup.
- `HashSet<T>`, `BTreeSet<T>` ~ unique-value collections.
- `VecDeque<T>` ~ a `Pile` open at both ends. The cat declined to rename it.
- `LinkedList<T>` ~ a list. Rarely the right answer. The cat has opinions.

### I/O (`std::io`)

- `Read`, `Write`, `BufRead`, `Seek` ~ the I/O traits.
- `stdin()`, `stdout()`, `stderr()` ~ the standard streams.
- `BufReader`, `BufWriter` ~ wrap a thing in a buffer.

### File System (`std::fs`)

- `File`, `OpenOptions` ~ open and configure files.
- `read_to_string()`, `write()` ~ one-shot file operations.
- `metadata()`, `read_dir()` ~ inspect the filesystem.

### Time (`std::time`)

- `Duration`, `Instant`, `SystemTime` ~ time types. None of these were renamed because the cat respects time.

### Threading and Concurrency (`std::thread`, `std::sync`)

- `thread::spawn`, `JoinHandle` ~ spawn threads.
- `Mutex<T>`, `RwLock<T>` ~ exclusive and shared locks.
- `Arc<T>`, `Rc<T>` ~ atomic and non-atomic reference-counted pointers.

The reference-counted pointers were not renamed despite being conceptually similar to `Cardboard<T>`. The cat felt that `PurrCard<T>` (proposed during a 2020 RFC) was too cute, and that `BigCardboard<T>` (also proposed) implied `Cardboard<T>` was small. The names remain.

### Networking (`std::net`)

- `TcpStream`, `TcpListener` ~ TCP.
- `UdpSocket` ~ UDP.
- `IpAddr`, `Ipv4Addr`, `Ipv6Addr`, `SocketAddr` ~ addresses.

### Environment and Process (`std::env`, `std::process`)

- `env::args()`, `env::var()` ~ command-line and environment.
- `process::exit()` ~ exit with a code.
- `process::Command` ~ run an external program.

### Error Handling (`std::error`)

- `Error` ~ the trait. Most error types implement it.
- `?` ~ the operator, which the cat declined to rename.

### Iteration (`std::iter`)

- `Iterator` ~ the trait you will lean on for everything.
- `iter()`, `iter_mut()`, `into_iter()` ~ the three ways to walk a collection.
- `map`, `filter`, `collect`, `fold`, `zip`, `chain` ~ standard combinators.

The cat could have renamed iterators (`PadPad` was proposed for `iter`), but iteration is too common in lolrust code. Renaming would have produced unreadable lesson programs. The cat exercised restraint.

## Names The Cat Considered And Rejected

For posterity, the names the cat has formally rejected:

- `PurrCard<T>` for `Rc<T>`. Too cute.
- `BigCardboard<T>` for `Arc<T>`. Implies `Cardboard` is small.
- `Lockbox<T>` for `Mutex<T>`. Confused with `Cardboard` (`Box`).
- `Catnap<T>` for `Cell<T>`. The cat would not stop laughing.
- `Stringz` for `String`. Lost the 2014 vote 47 to 12. See [The History of LolRust](/lolrust/docs/history).
- `Hashballs` for `HashMap`. Reportedly proposed by an intern.
- `PadPad` for `iter()`. The cat is still fond of it but has accepted that it does not work.

## Why So Few Renames

The cat's renaming philosophy: rename a stdlib item only if the cat-name is at least as memorable as the Rust name AND the cat can explain why. `Yarn` for `String` works because cats love yarn. `Pile` for `Vec` works because a pile is what you call several things stacked. `MaybeCheezburgr` for `Option` works because of [the meme](https://en.wikipedia.org/wiki/I_Can_Has_Cheezburger%3F).

Most stdlib items do not pass that bar. The cat is restrained.

## Crate Ecosystem

For anything not in `std`, the entire Rust crate ecosystem is available because lolrust transpiles to Rust before `rustc` ever sees the code. `gimme rand;` becomes `use rand;` and pulls in the `rand` crate as you would expect.

For dependency management, see [Cargo Wat?](/lolrust/docs/cargo-wat). The `kibble` package manager does not yet support pulling crates directly; for non-trivial dependency work, drop down to `cargo`.
