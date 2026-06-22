export type ProductCategory =
  | "gemstones"
  | "pooja"
  | "remedies"
  | "books"
  | "yantras";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  description: string;
  shortDesc: string;
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  tags: string[];
  benefit: string;
  isFeatured?: boolean;
}

export const CATEGORIES: { value: ProductCategory | "all"; label: string; emoji: string }[] = [
  { value: "all",       label: "All Products",  emoji: "✨" },
  { value: "gemstones", label: "Gemstones",      emoji: "💎" },
  { value: "pooja",     label: "Pooja Items",    emoji: "🪔" },
  { value: "remedies",  label: "Remedies",       emoji: "🌿" },
  { value: "books",     label: "Books",          emoji: "📚" },
  { value: "yantras",   label: "Yantras",        emoji: "🔯" },
];

export const PRODUCTS: Product[] = [
  /* ── GEMSTONES ── */
  {
    id: "gem-001",
    name: "Natural Blue Sapphire (Neelam)",
    slug: "natural-blue-sapphire-neelam",
    category: "gemstones",
    price: 12500,
    originalPrice: 18000,
    description:
      "A certified natural Blue Sapphire from Ceylon, ideal for strengthening Saturn in your horoscope. Associated with discipline, career growth, and mental clarity. Comes with a GII lab certificate.",
    shortDesc: "Certified Ceylon Blue Sapphire for Saturn, career & clarity.",
    images: ["/products/blue-sapphire-neelam.jpg"],
    rating: 4.8,
    reviewCount: 142,
    inStock: true,
    tags: ["saturn", "career", "neelam", "certified"],
    benefit: "Career growth & mental clarity",
    isFeatured: true,
  },
  {
    id: "gem-002",
    name: "Hessonite Garnet (Gomed)",
    slug: "hessonite-garnet-gomed",
    category: "gemstones",
    price: 3200,
    originalPrice: 4500,
    description:
      "Natural Hessonite Garnet (Gomed) for Rahu remediation. Helps with confusion, delays, and hidden obstacles in life. Best worn on Saturday in silver.",
    shortDesc: "Natural Gomed for Rahu pacification and removing obstacles.",
    images: ["/products/hessonite-garnet-gomed.jpg"],
    rating: 4.5,
    reviewCount: 89,
    inStock: true,
    tags: ["rahu", "gomed", "obstacles"],
    benefit: "Remove obstacles & confusion",
    isFeatured: true,
  },
  {
    id: "gem-003",
    name: "Natural Ruby (Manik)",
    slug: "natural-ruby-manik",
    category: "gemstones",
    price: 8900,
    originalPrice: 12000,
    description:
      "Burmese natural Ruby for strengthening the Sun. Ideal for leadership, confidence, and government-related success. Certified by IGI.",
    shortDesc: "Burmese Ruby for Sun, confidence & leadership.",
    images: [
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600",
    ],
    rating: 4.9,
    reviewCount: 67,
    inStock: true,
    tags: ["sun", "ruby", "leadership", "confidence"],
    benefit: "Leadership & government success",
  },
  {
    id: "gem-004",
    name: "Yellow Sapphire (Pukhraj)",
    slug: "yellow-sapphire-pukhraj",
    category: "gemstones",
    price: 9500,
    originalPrice: 13500,
    description:
      "Natural Sri Lankan Yellow Sapphire for Jupiter. Enhances wisdom, marriage prospects, wealth, and spiritual growth.",
    shortDesc: "Ceylon Yellow Sapphire for Jupiter, wisdom & prosperity.",
    images: ["/products/yellow-sapphire-pukhraj.jpg"],
    rating: 4.7,
    reviewCount: 113,
    inStock: true,
    tags: ["jupiter", "wisdom", "marriage", "wealth"],
    benefit: "Wisdom, marriage & prosperity",
    isFeatured: true,
  },

  /* ── POOJA ITEMS ── */
  {
    id: "pooja-001",
    name: "Panchmukhi Rudraksha Mala",
    slug: "panchmukhi-rudraksha-mala",
    category: "pooja",
    price: 1850,
    description:
      "108+1 bead Panchmukhi (5-faced) Rudraksha mala from Nepal. Perfect for daily meditation, mantra chanting, and Shiva worship. Each bead is energized and authenticated.",
    shortDesc: "108-bead 5-faced Rudraksha mala, energized from Nepal.",
    images: ["/products/panchmukhi-rudraksha-mala.jpg"],
    rating: 4.9,
    reviewCount: 234,
    inStock: true,
    tags: ["rudraksha", "shiva", "meditation", "mantra"],
    benefit: "Daily meditation & spiritual protection",
    isFeatured: true,
  },
  {
    id: "pooja-002",
    name: "Brass Shiva Linga with Tray",
    slug: "brass-shiva-linga-tray",
    category: "pooja",
    price: 2200,
    description:
      "Solid brass Shiva Linga (4 inch) with a nandi-engraved yoni base tray. Hand-crafted by skilled artisans from Varanasi. Ideal for home temple and Monday pooja.",
    shortDesc: "Solid brass Shiva Linga 4\" with Nandi yoni tray, Varanasi craft.",
    images: [
      "https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=600",
    ],
    rating: 4.7,
    reviewCount: 88,
    inStock: true,
    tags: ["shiva", "brass", "pooja", "linga"],
    benefit: "Home temple & daily Shiva worship",
  },
  {
    id: "pooja-003",
    name: "Navagraha Pooja Kit",
    slug: "navagraha-pooja-kit",
    category: "pooja",
    price: 1400,
    description:
      "Complete Navagraha pooja kit with 9 idols (miniature), colour threads, grains, flowers, and instruction booklet in Hindi/English. Perform all planetary remedies at home.",
    shortDesc: "Complete kit for all 9 planetary remedies at home.",
    images: [
      "https://images.unsplash.com/photo-1604426633861-11b2faead9c2?w=600",
    ],
    rating: 4.6,
    reviewCount: 156,
    inStock: true,
    tags: ["navagraha", "planets", "remedy", "kit"],
    benefit: "Pacify all 9 planets at home",
  },
  {
    id: "pooja-004",
    name: "Pure Ghee Deepam Set",
    slug: "pure-ghee-deepam-set",
    category: "pooja",
    price: 850,
    description:
      "Set of 5 traditional brass diyas with 500ml pure cow ghee (Gir A2). For Lakshmi pooja, daily arti, and Thursday ritual lighting. Auspicious and highly fragrant.",
    shortDesc: "5 brass diyas + 500ml pure A2 cow ghee for daily arti.",
    images: [
      "https://images.unsplash.com/photo-1604426633861-11b2faead9c2?w=600",
    ],
    rating: 4.8,
    reviewCount: 203,
    inStock: true,
    tags: ["diya", "ghee", "lakshmi", "arti"],
    benefit: "Invite Lakshmi & prosperity",
  },

  /* ── REMEDIES ── */
  {
    id: "rem-001",
    name: "Black Horseshoe Ring (Shani Yog)",
    slug: "black-horseshoe-ring-shani-yog",
    category: "remedies",
    price: 799,
    description:
      "Authentic iron ring made from a genuine black horse's shoe, energized with Saturn mantras. Wear on the middle finger of the right hand on Saturday for Saturn remedy.",
    shortDesc: "Genuine iron horseshoe ring, energized with Saturn mantras.",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600",
    ],
    rating: 4.4,
    reviewCount: 312,
    inStock: true,
    tags: ["saturn", "shani", "ring", "remedy"],
    benefit: "Saturn pacification & protection",
    isFeatured: true,
  },
  {
    id: "rem-002",
    name: "Kali Haldi (Black Turmeric) Remedy Pack",
    slug: "kali-haldi-black-turmeric-pack",
    category: "remedies",
    price: 549,
    description:
      "Rare black turmeric (Kali Haldi) root pieces for Rahu-Ketu and planetary dosh remedies. Also used for Bagalamukhi pooja and protection rituals.",
    shortDesc: "Rare black turmeric for Rahu-Ketu dosh & protection rituals.",
    images: [
      "https://images.unsplash.com/photo-1564890369478-c89ca3d9cde9?w=600",
    ],
    rating: 4.5,
    reviewCount: 178,
    inStock: true,
    tags: ["rahu", "ketu", "remedy", "haldi"],
    benefit: "Rahu-Ketu dosh remedy",
  },
  {
    id: "rem-003",
    name: "Lal Kitab Remedy Bundle",
    slug: "lal-kitab-remedy-bundle",
    category: "remedies",
    price: 1200,
    description:
      "10 Lal Kitab remedies curated for common dosh patterns: Pitra dosh, Mangal dosh, Kaal Sarp dosh. Includes copper coin, mustard seeds, red thread, and usage guide.",
    shortDesc: "10 Lal Kitab items for Pitra, Mangal & Kaal Sarp dosh.",
    images: [
      "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=600",
    ],
    rating: 4.3,
    reviewCount: 94,
    inStock: true,
    tags: ["lal kitab", "dosh", "mangal", "pitra"],
    benefit: "Multi-dosh remedy bundle",
  },
  {
    id: "rem-004",
    name: "Shree Yantra Pendant (Gold-Plated)",
    slug: "shree-yantra-pendant-gold-plated",
    category: "remedies",
    price: 950,
    description:
      "Gold-plated Shree Yantra pendant in 92.5 silver base. Energized during Navratri. The most powerful yantra for wealth, abundance, and Venus activation. Comes with a silk thread.",
    shortDesc: "Energized Shree Yantra pendant for Venus, wealth & abundance.",
    images: [
      "https://images.unsplash.com/photo-1618374695226-a6ee61a25e35?w=600",
    ],
    rating: 4.8,
    reviewCount: 267,
    inStock: true,
    tags: ["yantra", "venus", "wealth", "pendant"],
    benefit: "Venus activation & abundance",
  },

  /* ── BOOKS ── */
  {
    id: "book-001",
    name: "Brihat Parashara Hora Shastra (English)",
    slug: "brihat-parashara-hora-shastra-english",
    category: "books",
    price: 1100,
    description:
      "The foundational text of Vedic astrology by Maharshi Parashara, translated into English with Sanskrit shlokas. Essential reading for every serious student of Jyotish. 2 volumes, hardcover.",
    shortDesc: "Essential Vedic astrology classic — English with Sanskrit shlokas.",
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600",
    ],
    rating: 4.9,
    reviewCount: 189,
    inStock: true,
    tags: ["parashara", "classical", "jyotish", "textbook"],
    benefit: "Foundation of Vedic astrology",
    isFeatured: true,
  },
  {
    id: "book-002",
    name: "Astrology for Beginners — Jyotish Made Simple",
    slug: "astrology-beginners-jyotish-made-simple",
    category: "books",
    price: 599,
    description:
      "A modern, illustrated guide to Vedic astrology written in plain English. Covers signs, houses, planets, dashas, and basic chart reading. Perfect for absolute beginners.",
    shortDesc: "Illustrated beginner's guide to Vedic astrology in plain English.",
    images: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600",
    ],
    rating: 4.6,
    reviewCount: 321,
    inStock: true,
    tags: ["beginner", "guide", "illustrated", "modern"],
    benefit: "Learn Vedic astrology from scratch",
  },
  {
    id: "book-003",
    name: "Lal Kitab Ke Farman (Hindi)",
    slug: "lal-kitab-ke-farman-hindi",
    category: "books",
    price: 450,
    description:
      "The original Lal Kitab collection in Hindi — all five volumes in one book. Contains unique remedies, planetary interpretations, and karmic debt resolution methods.",
    shortDesc: "Complete Lal Kitab in Hindi — all 5 volumes combined.",
    images: [
      "https://images.unsplash.com/photo-1526243741027-444d633d7365?w=600",
    ],
    rating: 4.7,
    reviewCount: 445,
    inStock: true,
    tags: ["lal kitab", "hindi", "remedies", "karmic"],
    benefit: "Lal Kitab remedies & insights",
  },
  {
    id: "book-004",
    name: "Nadi Astrology Decoded",
    slug: "nadi-astrology-decoded",
    category: "books",
    price: 749,
    description:
      "Rare insights into the ancient Nadi astrology system — planetary sub-lords, cusps, and predictive timing. Includes 50 sample charts with detailed analysis.",
    shortDesc: "Advanced Nadi astrology with 50 sample chart analyses.",
    images: [
      "https://images.unsplash.com/photo-1568667256549-094345857637?w=600",
    ],
    rating: 4.5,
    reviewCount: 132,
    inStock: true,
    tags: ["nadi", "advanced", "predictive", "KP system"],
    benefit: "Master Nadi & KP astrology",
  },

  /* ── YANTRAS ── */
  {
    id: "yan-001",
    name: "Mahalaxmi Yantra (Copper, Energized)",
    slug: "mahalaxmi-yantra-copper-energized",
    category: "yantras",
    price: 1650,
    description:
      "Copper Mahalaxmi Yantra, 6×6 inches, energized with 108-round Lakshmi mantra pooja. Place in the east-facing wall of your home or office for continuous wealth flow.",
    shortDesc: "Copper Mahalaxmi Yantra — 108 mantra energized for wealth.",
    images: [
      "https://images.unsplash.com/photo-1618374695226-a6ee61a25e35?w=600",
    ],
    rating: 4.8,
    reviewCount: 178,
    inStock: true,
    tags: ["lakshmi", "wealth", "copper", "yantra"],
    benefit: "Continuous wealth & prosperity flow",
    isFeatured: true,
  },
  {
    id: "yan-002",
    name: "Kuber Yantra (Gold-Plated Brass)",
    slug: "kuber-yantra-gold-plated-brass",
    category: "yantras",
    price: 2100,
    description:
      "24K gold-plated Kuber Yantra on brass (6×6 inches). The deity of material wealth. Place in your cash locker or safe for protecting and multiplying your wealth.",
    shortDesc: "Gold-plated Kuber Yantra for wealth protection & growth.",
    images: [
      "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?w=600",
    ],
    rating: 4.6,
    reviewCount: 92,
    inStock: true,
    tags: ["kuber", "wealth", "gold", "yantra"],
    benefit: "Wealth protection & multiplication",
  },
  {
    id: "yan-003",
    name: "Shani (Saturn) Yantra for Career",
    slug: "shani-saturn-yantra-career",
    category: "yantras",
    price: 1350,
    description:
      "Black stone (obsidian) Shani Yantra, 4×4 inches. For sade sati, dhaiyya, and Saturn mahadasha relief. Reduces delays, legal issues, and chronic health problems.",
    shortDesc: "Obsidian Saturn yantra — Sade Sati & career obstacle relief.",
    images: [
      "https://images.unsplash.com/photo-1618374695226-a6ee61a25e35?w=600",
    ],
    rating: 4.4,
    reviewCount: 214,
    inStock: true,
    tags: ["saturn", "sade sati", "career", "yantra"],
    benefit: "Sade Sati & career obstacle removal",
  },
  {
    id: "yan-004",
    name: "Vastu Dosh Nivaran Yantra",
    slug: "vastu-dosh-nivaran-yantra",
    category: "yantras",
    price: 1800,
    description:
      "A comprehensive Vastu Dosh Nivaran Yantra that corrects directional imbalances in your home without physical renovation. Copper plated, 9×9 inches, with placement guide.",
    shortDesc: "Correct Vastu doshas without renovation — copper 9×9 yantra.",
    images: [
      "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?w=600",
    ],
    rating: 4.5,
    reviewCount: 167,
    inStock: true,
    tags: ["vastu", "dosh", "home", "yantra"],
    benefit: "Vastu dosh correction at home",
  },
];

/**
 * Resolve the image to display for a product.
 * Prefers a locally-hosted image (path starting with "/"), otherwise falls back
 * to a stable, category-matched local illustration so cards never show a broken
 * or mismatched remote image. Pass index>0 for gallery thumbs.
 */
export function productImageSrc(product: Product, index = 0): string {
  const local = product.images?.[index];
  if (local && local.startsWith("/")) return local;
  const byCategory: Record<ProductCategory, string> = {
    gemstones: "/products/gemstones.svg",
    pooja: "/products/pooja.svg",
    remedies: "/products/remedies.svg",
    books: "/products/books.svg",
    yantras: "/products/yantras.svg",
  };
  return byCategory[product.category] ?? "/products/placeholder.svg";
}

/**
 * True when a product has a real, self-contained promo image (a local raster
 * file) — these already include the name, price and badge, so the card shows
 * the image full-bleed without duplicating that text as chrome.
 */
export function hasPromoImage(product: Product): boolean {
  const first = product.images?.[0] ?? "";
  return first.startsWith("/") && !first.endsWith(".svg");
}

export const FEATURED_PRODUCTS = PRODUCTS.filter((p) => p.isFeatured);

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: ProductCategory | "all"): Product[] {
  if (category === "all") return PRODUCTS;
  return PRODUCTS.filter((p) => p.category === category);
}
