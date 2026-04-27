// node:test suite that verifies each lesson's seed code transpiles cleanly
// AND that the transpiled Rust satisfies the lesson's structural checks.
// Run: npm test
//
// Catches: lesson seed drift, keyword mapping changes, check regex bugs.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { transpile_meow } = require('./wasm/lolrust.js');

/**
 * The single source of truth for what each lesson expects.
 * Keep in sync with src/pages/lolrust/lesson-N.astro until they get refactored
 * to import from a shared module.
 */
const lessons = [
    {
        n: 1,
        name: 'Your First Meow',
        capstone: true, // fill-in lesson: template has TODO, solution completes it
        initial: `iz main() {
    // TODO: make the cat say something
    // hint: meow!("...your message...");

}`,
        solution: `iz main() {
    meow!("hai hooman! i am learning lolrust!");
}`,
        checks: [
            { label: 'has fn main', re: /\bfn\s+main\s*\(/ },
            { label: 'has println!', re: /\bprintln!\s*\(/ },
            { label: 'no leftover meow keywords', re: /\b(iz|meow!)\b/, negate: true },
        ],
    },
    {
        n: 2,
        name: 'Making Variables',
        capstone: true,
        initial: `iz main() {
    // TODO 1: make a variable named \`name\` set to "Ada"
    // TODO 2: make a variable named \`age\` set to 25
    // TODO 3: make a WIGGLY variable named \`zoomies\` set to 9000

    meow!("hai fren! i am {} and i have {} zoomies!", name, zoomies);
}`,
        solution: `iz main() {
    make name = "Ada";
    make age = 25;
    make wiggly zoomies = 9000;

    meow!("hai fren! i am {} and i have {} zoomies!", name, zoomies);
}`,
        checks: [
            { label: 'has let binding', re: /\blet\s+\w+\s*=/ },
            { label: 'has let mut for wiggly', re: /\blet\s+mut\s+\w+/ },
            { label: 'transpiled meow!', re: /\bprintln!/ },
            { label: 'no leftover make keywords', re: /\bmake\b/, negate: true },
        ],
    },
    {
        n: 3,
        name: 'Wiggly Variables',
        capstone: true,
        initial: `iz main() {
    make wiggly zoomies = 100;

    meow!("Starting zoomies: {}", zoomies);

    // TODO 1: increment zoomies by 500
    // TODO 2: then double zoomies

    meow!("After zoomies training: {}", zoomies);
    meow!("I AM UNSTOPPABLE!!!");
}`,
        solution: `iz main() {
    make wiggly zoomies = 100;

    meow!("Starting zoomies: {}", zoomies);

    zoomies = zoomies + 500;
    zoomies = zoomies * 2;

    meow!("After zoomies training: {}", zoomies);
    meow!("I AM UNSTOPPABLE!!!");
}`,
        checks: [
            { label: 'has let mut', re: /\blet\s+mut\s+\w+/ },
            { label: 'has reassignment', re: /\bzoomies\s*=\s*zoomies/ },
            { label: 'transpiled meow!', re: /\bprintln!/ },
            { label: 'no leftover make wiggly', re: /\bmake\s+wiggly\b/, negate: true },
        ],
    },
    {
        n: 4,
        name: 'When / Otherwise',
        capstone: true,
        initial: `iz main() {
    make wiggly hunger = 80;

    meow!("Current hunger level: {}%", hunger);

    // TODO: if hunger > 70, meow!("I AM STARVING!!! FEED ME NOW HOOMAN!!");
    //                       and meow!("meow meow meow meow meow");
    //       otherwise, meow!("I am still full... maybe later.");

    meow!("End of cat status report.");
}`,
        solution: `iz main() {
    make wiggly hunger = 80;

    meow!("Current hunger level: {}%", hunger);

    when hunger > 70 {
        meow!("I AM STARVING!!! FEED ME NOW HOOMAN!!");
        meow!("meow meow meow meow meow");
    } otherwise {
        meow!("I am still full... maybe later.");
    }

    meow!("End of cat status report.");
}`,
        checks: [
            { label: 'has if', re: /\bif\b/ },
            { label: 'has else', re: /\belse\b/ },
            { label: 'no leftover when', re: /\bwhen\b/, negate: true },
            { label: 'no leftover otherwise', re: /\botherwise\b/, negate: true },
        ],
    },
    {
        n: 5,
        name: 'Repeat While',
        capstone: true,
        initial: `iz main() {
    make wiggly treats_eaten = 0;
    make full = 8;

    // TODO: repeat while treats_eaten < full {
    //         increment treats_eaten by 1
    //         meow! the count
    //         when treats_eaten == 4, meow! a halfway message
    //       }

    meow!("I AM FULL! {} treats eaten. Time for a nap.", treats_eaten);
}`,
        solution: `iz main() {
    make wiggly treats_eaten = 0;
    make full = 8;

    repeat while treats_eaten < full {
        treats_eaten = treats_eaten + 1;
        meow!("Nom nom... ate treat #{}", treats_eaten);

        when treats_eaten == 4 {
            meow!("Getting full... but I can keep going!");
        }
    }

    meow!("I AM FULL! {} treats eaten. Time for a nap.", treats_eaten);
}`,
        checks: [
            { label: 'has while', re: /\bwhile\b/ },
            { label: 'has if (from when)', re: /\bif\b/ },
            { label: 'no leftover repeat while', re: /\brepeat\s+while\b/, negate: true },
            { label: 'transpiled meow!', re: /\bprintln!/ },
        ],
    },
    {
        n: 6,
        name: 'Iz Functions',
        capstone: true,
        initial: `// TODO: define a function \`give_treat(name: &str)\` that meow!s
//       "Giving a treat to {}! 🐟" with the name.

iz main() {
    meow!("Time to feed the squad!");

    // TODO: call give_treat("Ada"), give_treat("Luna"), give_treat("Shadow")

    meow!("All kittehs fed. Good job hooman!");
}`,
        solution: `iz give_treat(name: &str) {
    meow!("Giving a treat to {}! 🐟", name);
}

iz main() {
    meow!("Time to feed the squad!");

    give_treat("Ada");
    give_treat("Luna");
    give_treat("Shadow");

    meow!("All kittehs fed. Good job hooman!");
}`,
        checks: [
            { label: 'has fn give_treat', re: /\bfn\s+give_treat\s*\(/ },
            { label: 'has fn main', re: /\bfn\s+main\s*\(/ },
            { label: 'no leftover iz keyword', re: /\biz\b/, negate: true },
            { label: 'transpiled meow!', re: /\bprintln!/ },
        ],
    },
    {
        n: 7,
        name: 'The Loaf (Structs)',
        capstone: true,
        initial: `loaf Cat {
    name: Yarn,
    age: i32,
    zoomies: i32,
}

iz main() {
    // TODO 1: make a wiggly Cat instance \`my_cat\` with name "Ada", age 25, zoomies 9000

    meow!("My cat's name is {}", my_cat.name);
    meow!("Age: {} years old", my_cat.age);
    meow!("Zoomies level: {}", my_cat.zoomies);

    // TODO 2: increase my_cat.zoomies by 5000

    meow!("After coffee... zoomies are now {}", my_cat.zoomies);
}`,
        solution: `loaf Cat {
    name: Yarn,
    age: i32,
    zoomies: i32,
}

iz main() {
    make wiggly my_cat = Cat {
        name: "Ada".to_string(),
        age: 25,
        zoomies: 9000,
    };

    meow!("My cat's name is {}", my_cat.name);
    meow!("Age: {} years old", my_cat.age);
    meow!("Zoomies level: {}", my_cat.zoomies);

    my_cat.zoomies = my_cat.zoomies + 5000;
    meow!("After coffee... zoomies are now {}", my_cat.zoomies);
}`,
        checks: [
            { label: 'has struct Cat', re: /\bstruct\s+Cat\b/ },
            { label: 'has String type', re: /\bString\b/ },
            { label: 'has let mut my_cat', re: /\blet\s+mut\s+my_cat\b/ },
            { label: 'no leftover loaf', re: /\bloaf\b/, negate: true },
            { label: 'no leftover Yarn', re: /\bYarn\b/, negate: true },
        ],
    },
    {
        n: 8,
        name: 'Flavurz (Enums)',
        capstone: true,
        initial: `flavurz Mood {
    Happy,
    Sleepy,
    Zooming,
    Hangry,
    Plotting,
}

iz main() {
    make wiggly current_mood = Mood::Zooming;

    meow!("Current mood: Zooming");

    // TODO: skritch dat current_mood and meow! a different message for each Mood:
    //   Happy => "Purr purr purr~"
    //   Sleepy => "z z z z..."
    //   Zooming => "MUST GO FAST!!!"
    //   Hangry => "FEED ME OR ELSE!!!"
    //   Plotting => "I am watching you hooman..."
}`,
        solution: `flavurz Mood {
    Happy,
    Sleepy,
    Zooming,
    Hangry,
    Plotting,
}

iz main() {
    make wiggly current_mood = Mood::Zooming;

    meow!("Current mood: Zooming");

    skritch dat current_mood {
        Mood::Happy => meow!("Purr purr purr~"),
        Mood::Sleepy => meow!("z z z z..."),
        Mood::Zooming => meow!("MUST GO FAST!!!"),
        Mood::Hangry => meow!("FEED ME OR ELSE!!!"),
        Mood::Plotting => meow!("I am watching you hooman..."),
    }
}`,
        checks: [
            { label: 'has enum Mood', re: /\benum\s+Mood\b/ },
            { label: 'has match', re: /\bmatch\b/ },
            { label: 'no leftover flavurz', re: /\bflavurz\b/, negate: true },
            { label: 'no leftover skritch dat', re: /\bskritch\s+dat\b/, negate: true },
        ],
    },
    {
        n: 9,
        name: 'Skritch Dat Mastery',
        capstone: true,
        initial: `iz judge_zoomies(level: i32) {
    skritch dat level {
        0 => meow!("Absolute loaf behavior..."),
        // TODO: add arms for ranges 1..=3, 4..=7, 8..=9, 10, and _
    }
}

iz main() {
    judge_zoomies(6);
    judge_zoomies(9);
    judge_zoomies(10);
    judge_zoomies(-1);
}`,
        solution: `iz judge_zoomies(level: i32) {
    skritch dat level {
        0 => meow!("Absolute loaf behavior..."),
        1..=3 => meow!("Casual zoomies. Cute."),
        4..=7 => meow!("Respectable zoomies!"),
        8..=9 => meow!("EXCELLENT ZOOMIES!!!"),
        10 => meow!("THIS CAT IS UNSTOPPABLE!!!"),
        _ => meow!("Wait... how many zoomies is that???"),
    }
}

iz main() {
    judge_zoomies(6);
    judge_zoomies(9);
    judge_zoomies(10);
    judge_zoomies(-1);
}`,
        checks: [
            { label: 'has fn judge_zoomies', re: /\bfn\s+judge_zoomies\b/ },
            { label: 'has match', re: /\bmatch\b/ },
            { label: 'has range pattern', re: /\d+\.\.=\d+/ },
            { label: 'has wildcard arm', re: /_\s*=>/ },
            { label: 'no leftover skritch dat', re: /\bskritch\s+dat\b/, negate: true },
        ],
    },
    {
        n: 10,
        name: 'Pounce! (Methods)',
        capstone: true,
        initial: `loaf Cat {
    name: Yarn,
    zoomies: i32,
}

pounce Cat {
    iz new(name: &str) -> Cat {
        Cat {
            name: name.to_string(),
            zoomies: 5000,
        }
    }

    // TODO 1: define do_zoomies(&wiggly dis, amount: i32) that adds amount and meow!s
    // TODO 2: define status(&dis) that meow!s the current state
}

iz main() {
    make wiggly ada = Cat::new("Ada");
    ada.status();

    ada.do_zoomies(8000);
    ada.do_zoomies(3000);
    ada.status();
}`,
        solution: `loaf Cat {
    name: Yarn,
    zoomies: i32,
}

pounce Cat {
    iz new(name: &str) -> Cat {
        Cat {
            name: name.to_string(),
            zoomies: 5000,
        }
    }

    iz do_zoomies(&wiggly dis, amount: i32) {
        dis.zoomies = dis.zoomies + amount;
        meow!("{} did {} zoomies!", dis.name, amount);
    }

    iz status(&dis) {
        meow!("{} currently has {} zoomies", dis.name, dis.zoomies);
    }
}

iz main() {
    make wiggly ada = Cat::new("Ada");
    ada.status();

    ada.do_zoomies(8000);
    ada.do_zoomies(3000);
    ada.status();
}`,
        checks: [
            { label: 'has impl Cat', re: /\bimpl\s+Cat\b/ },
            { label: 'has fn new', re: /\bfn\s+new\b/ },
            { label: 'has &self', re: /&self\b/ },
            { label: 'has self.field access', re: /\bself\./ },
            { label: 'no leftover pounce', re: /\bpounce\b/, negate: true },
            { label: 'no leftover dis', re: /\bdis\b/, negate: true },
        ],
    },
    {
        n: 11,
        name: 'Tryz, Purrfect & Hairball',
        capstone: true,
        initial: `// TODO: define open_box(box_name: &str) -> Tryz<Yarn, Yarn>
//       when box_name == "treats", return Purrfect("Found 5 treats!".to_string())
//       otherwise, return Hairball("Box is empty... :(".to_string())

iz main() {
    skritch dat open_box("treats") {
        Purrfect(treats) => meow!("Success! {}", treats),
        Hairball(msg) => meow!("OH NOES: {}", msg),
    }

    skritch dat open_box("socks") {
        Purrfect(treats) => meow!("Success! {}", treats),
        Hairball(msg) => meow!("OH NOES: {}", msg),
    }
}`,
        solution: `iz open_box(box_name: &str) -> Tryz<Yarn, Yarn> {
    when box_name == "treats" {
        Purrfect("Found 5 treats!".to_string())
    } otherwise {
        Hairball("Box is empty... :(".to_string())
    }
}

iz main() {
    skritch dat open_box("treats") {
        Purrfect(treats) => meow!("Success! {}", treats),
        Hairball(msg) => meow!("OH NOES: {}", msg),
    }

    skritch dat open_box("socks") {
        Purrfect(treats) => meow!("Success! {}", treats),
        Hairball(msg) => meow!("OH NOES: {}", msg),
    }
}`,
        checks: [
            { label: 'returns Result<String, String>', re: /Result\s*<\s*String\s*,\s*String\s*>/ },
            { label: 'has Ok(', re: /\bOk\s*\(/ },
            { label: 'has Err(', re: /\bErr\s*\(/ },
            { label: 'no leftover Tryz/Purrfect/Hairball', re: /\b(Tryz|Purrfect|Hairball)\b/, negate: true },
        ],
    },
    {
        n: 12,
        name: 'The No Touchie Rules',
        capstone: true,
        initial: `loaf Toy {
    name: Yarn,
}

iz play_with(toy: &Toy) {
    meow!("Playing with {}", toy.name);
}

iz main() {
    make favorite_toy = Toy { name: "Red Dot".to_string() };

    // TODO: call play_with on favorite_toy TWICE.
    //       hint: you have to BORROW the toy with \`&\`, not move it.

    meow!("Still own the toy: {}", favorite_toy.name);
}`,
        solution: `loaf Toy {
    name: Yarn,
}

iz play_with(toy: &Toy) {
    meow!("Playing with {}", toy.name);
}

iz main() {
    make favorite_toy = Toy { name: "Red Dot".to_string() };

    play_with(&favorite_toy);
    play_with(&favorite_toy);

    meow!("Still own the toy: {}", favorite_toy.name);
}`,
        checks: [
            { label: 'has fn play_with', re: /\bfn\s+play_with\b/ },
            { label: 'borrows the toy (&favorite_toy)', re: /&favorite_toy\b/ },
            { label: 'transpiled meow!', re: /\bprintln!/ },
            { label: 'no leftover loaf', re: /\bloaf\b/, negate: true },
        ],
    },
    {
        n: 13,
        name: 'Skillz (Traits)',
        capstone: true,
        initial: `skillz Zoomable {
    iz do_zoom(&dis);
    iz get_speed(&dis) -> i32;
}

loaf Cat {
    name: Yarn,
    speed: i32,
}

pounce Zoomable for Cat {
    iz do_zoom(&dis) {
        meow!("{} is zooming at {} zoomies per second!", dis.name, dis.speed);
    }
    iz get_speed(&dis) -> i32 {
        dis.speed
    }
}

loaf Dog {
    name: Yarn,
    speed: i32,
}

// TODO 1: implement Zoomable for Dog (BORK BORK style)
// TODO 2: define iz make_fast<T: Zoomable>(animal: &T) that calls animal.do_zoom()

iz main() {
    make ada = Cat { name: "Ada".to_string(), speed: 9000 };
    make max = Dog { name: "Max".to_string(), speed: 12000 };

    make_fast(&ada);
    make_fast(&max);
}`,
        solution: `skillz Zoomable {
    iz do_zoom(&dis);
    iz get_speed(&dis) -> i32;
}

loaf Cat {
    name: Yarn,
    speed: i32,
}

pounce Zoomable for Cat {
    iz do_zoom(&dis) {
        meow!("{} is zooming at {} zoomies per second!", dis.name, dis.speed);
    }
    iz get_speed(&dis) -> i32 {
        dis.speed
    }
}

loaf Dog {
    name: Yarn,
    speed: i32,
}

pounce Zoomable for Dog {
    iz do_zoom(&dis) {
        meow!("BORK BORK {} is running at {}!!", dis.name, dis.speed);
    }
    iz get_speed(&dis) -> i32 {
        dis.speed
    }
}

iz make_fast<T: Zoomable>(animal: &T) {
    animal.do_zoom();
}

iz main() {
    make ada = Cat { name: "Ada".to_string(), speed: 9000 };
    make max = Dog { name: "Max".to_string(), speed: 12000 };

    make_fast(&ada);
    make_fast(&max);
}`,
        checks: [
            { label: 'has trait Zoomable', re: /\btrait\s+Zoomable\b/ },
            { label: 'has impl Zoomable for Cat', re: /\bimpl\s+Zoomable\s+for\s+Cat\b/ },
            { label: 'has impl Zoomable for Dog', re: /\bimpl\s+Zoomable\s+for\s+Dog\b/ },
            { label: 'has generic with trait bound', re: /<T:\s*Zoomable>/ },
            { label: 'no leftover skillz/pounce/dis', re: /\b(skillz|pounce|dis)\b/, negate: true },
        ],
    },
    {
        n: 14,
        name: 'Lifetimes',
        capstone: true,
        initial: `loaf Toy {
    name: Yarn,
}

// TODO: define longest_lived<'a>(toy1: &'a Toy, toy2: &'a Toy) -> &'a Toy
//       when toy1.name.len() > toy2.name.len() return toy1, otherwise toy2

iz main() {
    make red_dot = Toy { name: "Red Dot".to_string() };
    make laser = Toy { name: "Laser Pointer".to_string() };

    make best_toy = longest_lived(&red_dot, &laser);

    meow!("The longest lived toy is: {}", best_toy.name);
}`,
        solution: `loaf Toy {
    name: Yarn,
}

iz longest_lived<'a>(toy1: &'a Toy, toy2: &'a Toy) -> &'a Toy {
    when toy1.name.len() > toy2.name.len() {
        toy1
    } otherwise {
        toy2
    }
}

iz main() {
    make red_dot = Toy { name: "Red Dot".to_string() };
    make laser = Toy { name: "Laser Pointer".to_string() };

    make best_toy = longest_lived(&red_dot, &laser);

    meow!("The longest lived toy is: {}", best_toy.name);
}`,
        checks: [
            { label: "has fn longest_lived<'a>", re: /\bfn\s+longest_lived\s*<'a>/ },
            { label: "returns &'a Toy", re: /->\s*&'a\s+Toy/ },
            { label: 'borrows in main', re: /&red_dot|&laser/ },
            { label: 'transpiled meow!', re: /\bprintln!/ },
        ],
    },
    {
        n: 15,
        name: 'Generics',
        capstone: true,
        initial: `// TODO: define magic_box<T: std::fmt::Debug>(item: T) -> T
//       it should meow!("Putting {:?} into the magic box!", item)
//       then return item

iz main() {
    make number = magic_box(999);
    make treat = magic_box("Tuna");
    make cat = magic_box("Ada the Legend");

    meow!("Box gave back: {}", number);
    meow!("Box gave back: {}", treat);
    meow!("Box gave back: {}", cat);
}`,
        solution: `iz magic_box<T: std::fmt::Debug>(item: T) -> T {
    meow!("Putting {:?} into the magic box!", item);
    item
}

iz main() {
    make number = magic_box(999);
    make treat = magic_box("Tuna");
    make cat = magic_box("Ada the Legend");

    meow!("Box gave back: {}", number);
    meow!("Box gave back: {}", treat);
    meow!("Box gave back: {}", cat);
}`,
        checks: [
            { label: 'has fn magic_box with generic', re: /\bfn\s+magic_box\s*<T/ },
            { label: 'returns T', re: /->\s*T\b/ },
            { label: 'transpiled meow!', re: /\bprintln!/ },
            { label: 'no leftover lolrust keywords', re: /\b(iz|make|meow!)\b/, negate: true },
        ],
    },
    {
        // Capstone: the `initial` is a template with TODOs and is EXPECTED to fail
        // its own checks. We verify two things instead:
        //   1. the completed `solution` passes all checks (`solutionPasses`)
        //   2. the template `initial` fails at least one check (`templateIncomplete`)
        n: 16,
        name: 'Final Project ~ FizzBuzz',
        capstone: true,
        initial: `iz main() {
    chase n around 1..=100 {
        if ceiling cat sez n % 15 == 0 {
            meow!("FizzBuzz");
        }
        or if ceiling cat sez n % 3 == 0 {
            meow!("Fizz");
        }
        // TODO 1: add a Buzz case for multiples of 5
        // TODO 2: add an else case that prints just the number
    }
}`,
        solution: `iz main() {
    chase n around 1..=100 {
        if ceiling cat sez n % 15 == 0 {
            meow!("FizzBuzz");
        }
        or if ceiling cat sez n % 3 == 0 {
            meow!("Fizz");
        }
        or if ceiling cat sez n % 5 == 0 {
            meow!("Buzz");
        }
        or basement cat sez {
            meow!("{}", n);
        }
    }
}`,
        checks: [
            { label: 'has for n in 1..=100', re: /\bfor\s+n\s+in\s+1\.\.=100\b/ },
            { label: 'prints FizzBuzz', re: /"FizzBuzz"/ },
            { label: 'prints Fizz', re: /"Fizz"/ },
            { label: 'prints Buzz (you added this)', re: /"Buzz"/ },
            { label: 'checks % 5 (Buzz case)', re: /%\s*5\s*==/ },
            { label: 'has else case', re: /\belse\b/ },
            { label: 'prints the number itself', re: /println!\s*\(\s*"\{\}",\s*n/ },
            { label: 'no leftover lolrust keywords', re: /\b(iz|chase|around|ceiling cat sez|basement cat sez|meow!)\b/, negate: true },
        ],
    },
];

// ─── invariants ────────────────────────────────────────────────────────────

test('transpile_meow exists and is callable', () => {
    assert.equal(typeof transpile_meow, 'function');
    assert.equal(transpile_meow('iz main() {}'), 'fn main() {}');
});

test('transpiler is idempotent on already-Rust code', () => {
    const rust = 'fn main() { let x = 1; }';
    assert.equal(transpile_meow(rust), rust);
});

test('keyword inside string literal is not replaced', () => {
    assert.equal(
        transpile_meow('meow!("iz a cat says wiggly things");'),
        'println!("iz a cat says wiggly things");'
    );
});

test('keyword inside line comment is not replaced', () => {
    assert.equal(
        transpile_meow('// iz a comment\niz main() {}'),
        '// fn a comment\nfn main() {}'.replace('// fn', '// iz') // comments are preserved verbatim
    );
});

// ─── per-lesson tests ──────────────────────────────────────────────────────

function evaluate(rust, checks) {
    const failures = [];
    for (const c of checks) {
        const matched = c.re.test(rust);
        const pass = c.negate ? !matched : matched;
        if (!pass) failures.push(`${c.label} (regex: ${c.re}, negate: ${!!c.negate})`);
    }
    return failures;
}

for (const lesson of lessons) {
    test(`lesson ${lesson.n} (${lesson.name}) ~ transpile is non-empty`, () => {
        const rust = transpile_meow(lesson.initial);
        assert.ok(rust.length > 0, 'transpile output is empty');
        assert.notEqual(rust, lesson.initial, 'transpile did nothing');
    });

    if (lesson.capstone) {
        test(`lesson ${lesson.n} (${lesson.name}) ~ template is intentionally incomplete`, () => {
            const rust = transpile_meow(lesson.initial);
            const failures = evaluate(rust, lesson.checks);
            assert.ok(failures.length > 0, 'capstone template should fail at least one check (it has TODOs)');
        });

        test(`lesson ${lesson.n} (${lesson.name}) ~ solution passes all checks`, () => {
            const rust = transpile_meow(lesson.solution);
            const failures = evaluate(rust, lesson.checks);
            assert.deepEqual(failures, [], `\nFailing checks for lesson ${lesson.n} solution:\n  ${failures.join('\n  ')}\n\nTranspiled output:\n${rust}`);
        });
    } else {
        test(`lesson ${lesson.n} (${lesson.name}) ~ all No Touchie checks pass`, () => {
            const rust = transpile_meow(lesson.initial);
            const failures = evaluate(rust, lesson.checks);
            assert.deepEqual(failures, [], `\nFailing checks for lesson ${lesson.n}:\n  ${failures.join('\n  ')}\n\nTranspiled output:\n${rust}`);
        });
    }
}
