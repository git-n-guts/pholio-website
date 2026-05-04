export interface SeasonalCity {
  slug: string;
  inSeason: boolean;
}

export interface SeasonConfig {
  label: { en: string; vi: string };
  cities: SeasonalCity[]; // in-season entries first — array order = render order
}

// --- UPDATE THIS BLOCK WHEN THE SEASON CHANGES ---
// Workflow: edit label + inSeason flags → commit → push → Cloudflare auto-deploys.
// Keep in-season entries at the top of the array.
export const currentSeason: SeasonConfig = {
  label: {
    en: 'May — August',
    vi: 'Tháng 5 — 8',
  },
  cities: [
    // In-season (Feb–Aug covers May–Aug; Feb–May covers May)
    { slug: 'nha-trang',     inSeason: true  }, // bestSeason: Feb–Aug
    { slug: 'hoi-an',        inSeason: true  }, // bestSeason: Feb–May (May included)
    // Not peak season May–Aug
    { slug: 'hanoi',         inSeason: false }, // bestSeason: Oct–Apr
    { slug: 'saigon',        inSeason: false }, // bestSeason: Dec–Apr
    { slug: 'buon-me-thuot', inSeason: false }, // bestSeason: Nov–Apr (highlands dry season)
  ],
};
