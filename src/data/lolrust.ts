/**
 * Canonical metadata for the LolRust docs section.
 *
 * This file is the single source of truth for:
 *   - the lolrust version the docs target
 *   - the list of docs pages and their status
 *
 * When you add a new docs page, add it to DOC_PAGES below.
 * When lolrust ships a new version, bump LOLRUST_VERSION here.
 *
 * Pages that auto-interpolate LOLRUST_VERSION (no manual sync needed):
 *   - src/pages/lolrust/docs/index.astro       (header line)
 *   - src/pages/lolrust/docs/keywords.mdx      ("current as of lolrust X.Y.Z" + intro line)
 *
 * Pages that reference specific historical versions (manual updates per release):
 *   - src/pages/lolrust/docs/history.md        (timeline entries: 0.1.0, 0.1.x, 0.2.0, ...)
 *     This file is a versioned changelog, not a "latest version" page. When a
 *     new release ships, add a new entry rather than swapping the existing one.
 */

export const LOLRUST_VERSION = '0.2.0';

export type DocStatus = 'available' | 'coming-soon';

export interface DocPage {
    slug: string;
    title: string;
    summary: string;
    status: DocStatus;
}

/**
 * Pages live at /lolrust/docs/<slug>. Order in this array is the display
 * order in the docs index (and any future sidebar). Move a page from
 * 'coming-soon' to 'available' by changing the status field, no other edits.
 */
export const DOC_PAGES: DocPage[] = [
    {
        slug: 'getting-starty-starty',
        title: 'Getting Starty Starty',
        summary: 'install lolrust, write your first program, get judged by a cat.',
        status: 'available',
    },
    {
        slug: 'keywords',
        title: 'The Keyword Reference',
        summary: 'all keywords, three columns: beginner alias, classic, Rust.',
        status: 'available',
    },
    {
        slug: 'no-touchie-rules',
        title: 'No Touchie Rules',
        summary: 'the borrow checker, explained by the cat that runs it.',
        status: 'available',
    },
    {
        slug: 'cargo-wat',
        title: 'Cargo Wat?',
        summary: 'kibble and cargo working together, badly.',
        status: 'available',
    },
    {
        slug: 'for-rust-hoomans',
        title: 'For Hoomans Coming from Rust',
        summary: 'the migration guide nobody asked for.',
        status: 'available',
    },
    {
        slug: 'history',
        title: 'The History of LolRust',
        summary: 'entirely true. Citation provided where convenient.',
        status: 'available',
    },
    {
        slug: 'meow-book',
        title: 'The Meow Book',
        summary: 'language reference, modeled on The Rust Book but considerably more cat.',
        status: 'available',
    },
    {
        slug: 'purr-macros',
        title: 'Purr Macros',
        summary: 'the macro system. Reluctantly explained.',
        status: 'available',
    },
    {
        slug: 'standard-cat-library',
        title: 'The Standard Cat Library',
        summary: 'stdlib coverage. Mostly imported from Rust. Mostly.',
        status: 'available',
    },
    {
        slug: 'for-py-js-hoomans',
        title: 'For Hoomans Coming from Python or JS',
        summary: 'the gentler migration guide.',
        status: 'available',
    },
];

export function availableDocs(): DocPage[] {
    return DOC_PAGES.filter((p) => p.status === 'available');
}

export function comingSoonDocs(): DocPage[] {
    return DOC_PAGES.filter((p) => p.status === 'coming-soon');
}

export function docHref(page: DocPage): string {
    return `/lolrust/docs/${page.slug}`;
}
