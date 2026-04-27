---
layout: ../../../layouts/DocsShell.astro
title: No Touchie Rules
description: The borrow checker, explained by the cat that runs it.
---

# No Touchie Rules

The cat is the borrow checker. The borrow checker is the cat. They are the same entity. This page is the cat explaining itself.

In other languages, you have a garbage collector. The garbage collector wanders around at runtime, finds memory nobody is using, and quietly takes it away. This works fine. It also costs a small amount of CPU and memory, forever, until the heat death of the universe.

In Rust, there is no garbage collector. Instead there is the cat. The cat reads your code at compile time and proves to itself that nobody is doing anything dangerous with memory. If the cat is satisfied, your code compiles. If the cat is not satisfied, your code does not compile, and the cat tells you why. Loudly.

This is called "ownership and borrowing" in real Rust documentation. We call it "no touchie" because that is what the cat says when you violate it.

## The Three Laws

Every value the cat lets you make obeys three rules.

1. **Every toy has exactly one owner.** Two cats cannot own the same toy. A toy without an owner does not exist.
2. **Many cats may look at a toy. Only one cat may modify it. Never both.** This is the petting rule.
3. **A toy cannot outlive the cat that owns it.** If the owner leaves, the toy is gone, and any cat still trying to look at the toy is looking at a ghost.

That is the whole borrow checker. Everything else is a special case of these three.

## Ownership

When you create a value, the cat assigns one variable to own it. When that variable goes out of scope, the value is dropped.

```rust
iz main() {
    i can haz toy = Yarn::from("mouse");
    // toy belongs to main
    // when main returns, toy is dropped
}
```

You did not write a `free(toy)` call. You did not register a finalizer. The cat handled it. The cat is good at this.

## Yoinking

When you assign or pass a value to somewhere else, ownership transfers. This is called *moving* in Rust. We call it *yoinking* because that is what is actually happening.

```rust
iz main() {
    i can haz toy = Yarn::from("mouse");
    i can haz new_owner = toy;     // toy gets yoinked

    meow!("{}", new_owner);         // works
    // meow!("{}", toy);            // OH NOES: borrow of moved value
}
```

After the yoink, `toy` no longer exists from `main`'s perspective. The cat refuses to let you reach for it. If you uncomment that last line, the cat will say:

```
OH NOES: borrow of moved value `toy`
u tried to pet something that already got yoinked
```

The cat is correct. You did try to pet something that already got yoinked.

## Petting

If you do not want to lose ownership, you can let other code *pet* the value temporarily. This is called *borrowing* in Rust. There are two kinds: shared petting and exclusive petting.

### Shared Petting (`&`)

Many cats may pet a toy at the same time. None of them may modify it. The toy is read-only while shared pets exist.

```rust
iz main() {
    i can haz toy = Yarn::from("mouse");
    i can haz pet1 = &toy;
    i can haz pet2 = &toy;

    meow!("{} and {} are both petting {}", pet1, pet2, toy);
    // all three coexist peacefully
}
```

In Rust this is `&value`. In lolrust it is the same: `&toy`. Reference syntax is one of the few things lolrust did not bother to rename, because the cat decided `&` already looked sufficiently feline.

### Exclusive Petting (`&wiggly`)

If you want to *modify* a borrowed value, you need an exclusive pet. While the exclusive pet exists, nobody else may even look at the toy. Not other exclusive pets. Not shared pets. Not the original owner. Nobody.

```rust
iz main() {
    i can haz wiggly toy = Yarn::from("mouse");
    i can haz petter = &wiggly toy;
    petter.push_str(" v2");

    meow!("{}", petter);    // works
    // meow!("{}", toy);    // OH NOES: someone else is petting this
}
```

The `wiggly` keyword is doing two jobs in this snippet:

- `i can haz wiggly toy` says the binding itself is mutable.
- `&wiggly toy` says you are taking an exclusive (mutable) reference.

Both translate to `mut` in Rust ~ one as `let mut`, the other as `&mut`. Same word, two different positions, two compatible meanings.

## Why Both Rules At Once

The petting rules might feel arbitrary. They are not. Here is what they prevent.

If two cats could exclusive-pet a toy at the same time, two pieces of code could mutate the same memory at the same time. That is a data race. The cat does not allow data races.

If a cat could shared-pet a toy while another cat was exclusive-petting, the shared pet might see the value change midway through reading it. That is also a data race. The cat does not allow that either.

If you could exclusive-pet a toy and then drop the owner, the exclusive pet would be modifying memory the cat had already given back. That is a use-after-free. The cat *especially* does not allow that.

The petting rules are exactly the minimum constraints needed to prove at compile time that your program has no data races, no use-after-free, no double-free, and no dangling pointers. Every Rust feature is a consequence of these rules. The cat is meticulous.

## Common Things The Cat Yells At You About

When the cat refuses your code, the error message is the cat being specific. Lolrust translates the most common ones into cat speak. The original Rust error is still there, just retranslated.

### `cannot borrow` ... `as mutable, as it is also borrowed as immutable`

```
NO TOUCHIE! cannot borrow as wiggly because it is already being petted
```

You tried to take an exclusive pet on a value that already had shared pets out. Either drop the shared pets first, or rearrange so they don't overlap.

### `value used here after move`

```
u tried to use it AFTER it was yoinked!!
```

You yoinked the value somewhere else and then tried to use it from the original spot. Either don't yoink (take a reference instead), or clone with `.copycat()` so both sides get their own copy.

### `borrow of moved value`

```
u cant pet something that already got yoinked
```

You tried to take a reference to a value after it had already been yoinked. Same fix as above.

### `cannot move out of` ... `which is behind a shared reference`

```
HEY! U CANT YOINK DAT FROM THERE
```

You have a shared reference to something, and you tried to yoink the value out of it. You cannot. A shared reference does not give you the right to remove its contents. Use `.copycat()` to take a copy, or restructure so you have ownership.

### `does not live long enough`

```
dis kitteh ran out of lives too soon :(
```

You took a reference, but the value the reference points to was dropped before you were done. The reference is now pointing at a ghost. Keep the original alive longer, or take a value instead of a reference.

## Escape Hatches

The cat is strict. Sometimes the cat is too strict, or your code legitimately needs to do something the cat cannot prove is safe. There are escape hatches.

`.copycat()` (clone) makes a deep copy of the value. Now both sides own their own toy. This is often the right answer for small types like `Yarn` and is fine for nearly everything if performance is not your main concern.

`yolo { ... }` (`unsafe { ... }`) is the override. Inside this block, you are telling the cat: *I have read the manual, I know what I am doing, leave me alone.* The cat will leave you alone, but it will remember. Use `yolo` blocks rarely. Keep them small. Document why.

Refactoring is usually the best escape hatch. If the cat refuses a piece of code, the code is sometimes genuinely fine and you need to clone, and sometimes a hint that the design is awkward. The cat is usually trying to teach you something.

## When The Cat Is Wrong

The cat is never wrong about whether code is safe. The cat is, however, sometimes too cautious about whether code is safe *enough to compile*. There are real programs that are safe but cannot be expressed in a way the cat accepts.

In those cases, you have three options:

1. Restructure the code to be expressible (this works most of the time).
2. Use `yolo` and verify the safety yourself (this works always but moves the burden to you).
3. Reach for a smart pointer like `Cardboard` (`Box`), `Rc`, `Arc`, or `RefCell` (this works for many specific patterns).

The cat respects all three options. The cat will judge you for the second one.

## Further Reading

When you are ready to graduate from this page, the canonical Rust documentation on ownership and borrowing is:

- *The Rust Programming Language*, [chapter 4: Understanding Ownership](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html). The cat has read this. The cat approves.
- *The Rust Reference*, [section on borrowing](https://doc.rust-lang.org/reference/expressions/operator-expr.html#borrow-operators). Drier. More precise. The cat respects it.

If you want to see exactly what cat-speak the lolrust transpiler emits for a given Rust error, the source is in [`src/explain.rs`](https://github.com/AdaInTheLab/lolrust/blob/main/src/explain.rs). The cat is the author. The cat is also the reviewer. The cat approved its own code.
