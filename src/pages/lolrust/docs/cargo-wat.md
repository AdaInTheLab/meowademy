---
layout: ../../../layouts/DocsShell.astro
title: Cargo Wat?
description: How kibble and cargo coexist, badly, on purpose.
---

# Cargo Wat?

`cargo` is Rust's package manager. `kibble` is lolrust's package manager. They coexist, badly, on purpose.

This page explains the relationship and tells you when to reach for which.

## What `kibble` Is

`kibble` is a thin wrapper that:

1. Transpiles your `.meow` files to `.rs` files in a directory called `litter_box/`.
2. Invokes `rustc` directly on the result.
3. Optionally runs the produced binary.

That is it. `kibble` does not invoke `cargo`. `kibble` does not know about Cargo workspaces. `kibble` does not pull dependencies. `kibble` is the simplest possible thing that lets you go from `.meow` to a running executable.

If you have a single-file or single-binary project, `kibble` is plenty. If you need anything beyond that ~ external crates, multiple binaries, integration tests, library-and-binary projects ~ drop down to `cargo` directly. The cat is fine with this.

## The Subcommands

```bash
lolrust kibble init <name>     # create a new kitteh project
lolrust kibble build           # transpile + compile to litter_box/
lolrust kibble run             # build (if needed) + run
lolrust kibble clean           # nuke litter_box/ and Kibble.lock
lolrust kibble info            # print project metadata
```

### `init`

Creates a new project directory with this layout:

```
<name>/
├── Kibble.toml      # project manifest
├── .gitignore       # ignores litter_box/ and *.exe
└── src/
    └── main.meow    # entry point
```

The generated `main.meow` is the standard `iz main() { meow!("Oh hai! Welcome to mai project! :3"); }` template.

### `build`

Transpiles every `.meow` file under `src/` into Rust files in `litter_box/`, then compiles `litter_box/main.rs` with `rustc`. The compiled binary is placed at `litter_box/<name>` (or `<name>.exe` on Windows).

Pass `--explain` to translate any `rustc` errors into cat speak:

```bash
lolrust kibble build --explain
```

### `run`

If the binary does not exist, `run` builds first. Then it runs the binary. Exits with the binary's exit code.

```bash
lolrust kibble run
```

Also accepts `--explain`.

### `clean`

Deletes `litter_box/` and `Kibble.lock`. Does not delete source files. Does not touch git. Leaves no trace.

### `info`

Prints metadata from `Kibble.toml`, lists every `.meow` file under `src/`, and reports whether the project has been built.

## `Kibble.toml`

The manifest. Recognizable to anyone who has read a `Cargo.toml` and knows what cats look like.

```toml
[kitteh]
name = "my_kitteh_project"
version = "0.1.0"
description = "a very important kitteh project"
author = "Anonymous Kitteh"

[dependencies]
# add ur dependencies here!

[treats]
# extra compiler flags
```

### `[kitteh]`

The only section `kibble` currently reads. Fields:

| Field | Required? | Notes |
|---|---|---|
| `name` | yes | Used as the binary name. |
| `version` | no | Informational. Printed by `kibble info`. |
| `description` | no | Informational. |
| `author` | no | Informational. |

### `[dependencies]` (coming soon)

Declared in the template. Not yet wired up in the builder. Multi-crate projects are not currently supported through `kibble`. If you need crate dependencies right now, fall back to `cargo` (see below).

### `[treats]` (coming soon)

Intended for extra `rustc` flags (e.g. optimization level). Not yet wired up. `kibble build` invokes `rustc` with default args only.

## Project Layout

A built kibble project looks like this:

```
my_kitteh/
├── Kibble.toml
├── Kibble.lock      # generated, gitignored
├── .gitignore
├── src/
│   └── main.meow    # required entry point
└── litter_box/      # generated, gitignored
    ├── main.rs      # transpiled output
    └── my_kitteh    # compiled binary (or .exe on Windows)
```

`src/main.meow` is mandatory. `kibble` transpiles every `.meow` it finds, but only invokes `rustc` on `litter_box/main.rs`. If there is no `src/main.meow`, the build fails with `no src/main.meow found! i need a main.meow to build kitteh`. The cat is firm on this.

## When to Drop Down to `cargo`

`kibble` is fine for:

- Single-binary projects
- Self-contained learning programs
- Examples and demos
- Anything in the lessons or docs

`kibble` is NOT fine for:

- Crate dependencies
- Library + binary mixed projects
- Integration test directories (`tests/`)
- Examples directories (`examples/`)
- Workspaces
- Custom build scripts
- Anything you would publish to crates.io

For those cases, two paths:

1. **Write Rust, use `cargo`, skip lolrust.** Sometimes the right answer.
2. **Keep `.meow` source, generate `.rs` manually with `lolrust file.meow --emit-rs`, then run `cargo` against the generated Rust.** This is the supported escape hatch.

The lolrust transpiler itself is built with `cargo`, not `kibble`. Even the cat does not eat its own kibble for non-trivial projects.

## What `kibble` Will Probably Become

The current minimalism is intentional. The goal of `kibble` is to be the thing a learner runs in lesson 5 to compile the program they wrote, not to compete with `cargo`. Wiring up `[dependencies]` and `[treats]` would multiply the surface area without serving the current audience.

If lolrust ever wants to be more than a teaching language, `kibble` will need to grow. Until then, the cat is happy with shallow.
