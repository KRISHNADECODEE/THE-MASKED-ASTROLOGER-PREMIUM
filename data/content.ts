export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
  service: string;
  date: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Priya Sharma",
    location: "Mumbai, Maharashtra",
    avatar: "PS",
    rating: 5,
    text: "The kundli analysis was incredibly accurate. The astrologer identified my Saturn transit challenges and gave me practical remedies that actually worked. My career situation improved within 3 months. Highly recommend the consultation service.",
    service: "1:1 Consultation",
    date: "March 2025",
  },
  {
    id: "t2",
    name: "Arjun Mehta",
    location: "Delhi, India",
    avatar: "AM",
    rating: 5,
    text: "I was skeptical at first, but the kundli PDF report was extremely detailed and spot-on. It described my personality, challenges, and upcoming dasha periods with stunning accuracy. Worth every rupee for the premium report.",
    service: "Kundli PDF Report",
    date: "January 2025",
  },
  {
    id: "t3",
    name: "Kavitha Nair",
    location: "Bangalore, Karnataka",
    avatar: "KN",
    rating: 5,
    text: "I enrolled in the Vedic Astrology Foundations course and completed it in 3 weeks. The video lessons are clear, concise, and the PDF notes are excellent for revision. I can now read basic charts on my own!",
    service: "Astrology Course",
    date: "February 2025",
  },
  {
    id: "t4",
    name: "Rohan Gupta",
    location: "Pune, Maharashtra",
    avatar: "RG",
    rating: 4,
    text: "The Blue Sapphire (Neelam) I purchased came with a proper GII certificate and looked exactly as described. The quality is premium and the packaging was very professional. Will definitely shop here again.",
    service: "Gemstone Purchase",
    date: "April 2025",
  },
  {
    id: "t5",
    name: "Sunita Reddy",
    location: "Hyderabad, Telangana",
    avatar: "SR",
    rating: 5,
    text: "The donation transparency log is something I've never seen on any astrology website. I donated dog food and received photo proof within 48 hours. This platform has a genuine soul beyond just commerce.",
    service: "Street Dog Donation",
    date: "May 2025",
  },
  {
    id: "t6",
    name: "Vikram Singh",
    location: "Jaipur, Rajasthan",
    avatar: "VS",
    rating: 5,
    text: "The Mahalaxmi Yantra I ordered was beautifully crafted and came energized. I placed it in my office cash box as instructed and within a month noticed a clear improvement in revenue. Superb product quality.",
    service: "Yantra Purchase",
    date: "June 2025",
  },
];

export const CONSULTATION_SERVICES = [
  {
    id: "cs-1",
    title: "Voice Note Reading",
    subtitle: "48-hour delivery",
    price: 1500,
    duration: "Detailed audio analysis",
    description:
      "Send your birth details and specific questions. Receive a 20–30 minute detailed voice note analysis from our senior astrologer covering your chart, dashas, and personalised remedies.",
    features: [
      "Full kundli analysis",
      "Current dasha interpretation",
      "Specific question answered",
      "3 personalised remedies",
      "48-hour turnaround",
    ],
    icon: "🎙️",
    popular: false,
  },
  {
    id: "cs-2",
    title: "3 Q&A Written Report",
    subtitle: "24-hour delivery",
    price: 999,
    duration: "Written + chart snapshot",
    description:
      "Ask up to 3 specific questions about your life — career, relationships, health, finance. Receive a detailed written report with chart snapshot and remedies.",
    features: [
      "3 specific questions answered",
      "Chart screenshot included",
      "Personalised remedies",
      "Written in Hindi or English",
      "24-hour delivery",
    ],
    icon: "✍️",
    popular: true,
  },
  {
    id: "cs-3",
    title: "Live 1:1 Session",
    subtitle: "60 minutes on Zoom/Meet",
    price: 3500,
    duration: "60-minute live session",
    description:
      "A full one-hour live video consultation with detailed kundli analysis, dasha predictions, remedies, and open Q&A. You can ask anything and get real-time answers.",
    features: [
      "60-minute Zoom/Meet session",
      "Complete chart walkthrough",
      "Dasha & transit analysis",
      "Unlimited questions",
      "Recording shared after",
      "Follow-up WhatsApp for 7 days",
    ],
    icon: "📹",
    popular: false,
  },
];

export const COURSES = [
  {
    id: "c-1",
    title: "Vedic Astrology Foundations",
    slug: "vedic-astrology-foundations",
    tagline: "From zero to reading your first kundli",
    price: 4999,
    originalPrice: 7999,
    duration: "8 weeks",
    lessons: 42,
    students: 1240,
    rating: 4.8,
    thumbnail: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600",
    level: "Beginner",
    topics: [
      "The 12 Zodiac Signs",
      "9 Planets & their significations",
      "12 Houses & their meanings",
      "Lagna & chart reading basics",
      "Nakshatras",
      "Vimshottari Dasha system",
      "Basic predictions",
    ],
  },
  {
    id: "c-2",
    title: "Predictive Jyotish — Advanced",
    slug: "predictive-jyotish-advanced",
    tagline: "Master timing events with dashas & transits",
    price: 8999,
    originalPrice: 14999,
    duration: "12 weeks",
    lessons: 68,
    students: 543,
    rating: 4.9,
    thumbnail: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600",
    level: "Advanced",
    topics: [
      "Antardasha & Pratyantar dasha",
      "Transit analysis (Gochar)",
      "Annual chart (Varshaphal)",
      "Divisional charts (Shodashavargas)",
      "Special lagnas",
      "Medical astrology",
      "Timing marriage & career events",
    ],
  },
  {
    id: "c-3",
    title: "Astrology Remedies Masterclass",
    slug: "astrology-remedies-masterclass",
    tagline: "Practical Vedic remedies for every dosh",
    price: 3499,
    originalPrice: 5999,
    duration: "4 weeks",
    lessons: 28,
    students: 892,
    rating: 4.7,
    thumbnail: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=600",
    level: "Intermediate",
    topics: [
      "Gemstone therapy",
      "Yantra installation",
      "Mantra remedies",
      "Lal Kitab remedies",
      "Dosh nivaran rituals",
      "Colour therapy in astrology",
    ],
  },
];

export const BLOG_POSTS = [
  {
    id: "b-1",
    title: "Saturn in Aquarius 2025: What Every Sign Must Know",
    slug: "saturn-aquarius-2025-every-sign",
    category: "Planetary Transits",
    excerpt:
      "Saturn's journey through Aquarius brings collective responsibility themes to every zodiac sign. Here is what the transit means for your career, relationships, and spiritual growth.",
    readTime: "8 min read",
    publishedAt: "June 15, 2025",
    author: "The Masked Astrologer",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800",
    tags: ["saturn", "aquarius", "transit", "2025"],
  },
  {
    id: "b-2",
    title: "How to Read Your Navamsa Chart (D9) Like a Pro",
    slug: "how-to-read-navamsa-chart-d9",
    category: "Chart Reading",
    excerpt:
      "The Navamsa (D9) chart is the most important divisional chart in Vedic astrology. Learn how to interpret it for marriage, dharma, and the second half of life.",
    readTime: "12 min read",
    publishedAt: "May 28, 2025",
    author: "The Masked Astrologer",
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800",
    tags: ["navamsa", "d9", "marriage", "chart reading"],
  },
  {
    id: "b-3",
    title: "Kaal Sarp Dosh: Truth vs Myth — A Balanced Look",
    slug: "kaal-sarp-dosh-truth-vs-myth",
    category: "Doshas",
    excerpt:
      "Is Kaal Sarp Dosh always negative? Or is it a misunderstood yogic combination? We analyze 200+ charts to give you a balanced, evidence-based answer.",
    readTime: "10 min read",
    publishedAt: "April 10, 2025",
    author: "The Masked Astrologer",
    image: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=800",
    tags: ["kaal sarp", "dosh", "rahu", "ketu"],
  },
  {
    id: "b-4",
    title: "The 5 Most Powerful Yogas for Wealth in Vedic Astrology",
    slug: "5-powerful-yogas-wealth-vedic-astrology",
    category: "Yogas",
    excerpt:
      "From Dhana Yoga to Lakshmi Yoga — we break down the five most powerful wealth combinations and how to spot them in your birth chart.",
    readTime: "9 min read",
    publishedAt: "March 5, 2025",
    author: "The Masked Astrologer",
    image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800",
    tags: ["yoga", "wealth", "dhana yoga", "lakshmi yoga"],
  },
  {
    id: "b-5",
    title: "Sade Sati 2025-26: Complete Guide for All 12 Signs",
    slug: "sade-sati-2025-26-complete-guide",
    category: "Planetary Transits",
    excerpt:
      "Saturn's 7.5-year Sade Sati phase affects three signs at a time. Find out if your sign is entering, going through, or exiting Sade Sati — and what to do about it.",
    readTime: "15 min read",
    publishedAt: "January 20, 2025",
    author: "The Masked Astrologer",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800",
    tags: ["sade sati", "saturn", "2025", "transit"],
  },
];

export type DonationCategory = "Street Dogs" | "People in Need" | "Education";

export const DONATION_ITEMS: {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  description: string;
  category: DonationCategory;
}[] = [
  // ── Street Dogs ──
  { id: "d-1",  name: "Food for a Street Dog",   emoji: "🐕", cost: 350, description: "5 kg premium kibble to feed adult street dogs",        category: "Street Dogs" },
  { id: "d-2",  name: "Dog Vaccination Kit",     emoji: "💉", cost: 800, description: "Core vaccines: Distemper, Parvovirus, Rabies",          category: "Street Dogs" },
  { id: "d-3",  name: "Anti-Tick Collar",        emoji: "🔴", cost: 150, description: "3-month anti-tick & flea protection collar",            category: "Street Dogs" },
  { id: "d-4",  name: "Dog First-Aid Kit",       emoji: "🏥", cost: 500, description: "Wound care & antiseptic kit for injured strays",        category: "Street Dogs" },

  // ── People in Need ──
  { id: "d-5",  name: "Meal for the Hungry",     emoji: "🍱", cost: 60,  description: "A hot, nutritious meal for one person in need",         category: "People in Need" },
  { id: "d-6",  name: "Ration Kit for a Family", emoji: "🛒", cost: 700, description: "Rice, dal, flour & oil to feed a family for a week",    category: "People in Need" },
  { id: "d-7",  name: "Warm Blanket",            emoji: "🛏️", cost: 250, description: "A warm blanket for someone sleeping rough this winter", category: "People in Need" },
  { id: "d-8",  name: "Clean Water for a Day",   emoji: "💧", cost: 100, description: "Safe drinking water for a person for one full day",     category: "People in Need" },

  // ── Education ──
  { id: "d-9",  name: "Donate a Book",           emoji: "📚", cost: 250, description: "A storybook or textbook for an underprivileged child",  category: "Education" },
  { id: "d-10", name: "School Supplies Kit",     emoji: "✏️", cost: 300, description: "Notebooks, pencils & a bag for one student",            category: "Education" },
];
