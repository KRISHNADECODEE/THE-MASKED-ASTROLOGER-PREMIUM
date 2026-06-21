export interface KundliInput {
  name: string;
  gender: "male" | "female" | "other";
  dob: string;
  tob: string;
  pob: string;
  lat: number;
  lng: number;
}

export interface PlanetData {
  name: string;
  symbol: string;
  house: number;
  sign: string;
  signSymbol: string;
  degree: number;
  isRetrograde: boolean;
  nakshatra: string;
  nakshatraPada: number;
}

export interface DashaPeriod {
  planet: string;
  startDate: string;
  endDate: string;
  years: number;
  isCurrent: boolean;
}

export interface KundliResult {
  name: string;
  dob: string;
  tob: string;
  pob: string;
  ascendant: string;
  ascendantDegree: number;
  ascendantSymbol: string;
  moonSign: string;
  sunSign: string;
  planets: PlanetData[];
  dashas: DashaPeriod[];
  yogas: { name: string; description: string; isPositive: boolean }[];
  basicPrediction: string;
}

export const ZODIAC_SIGNS = [
  { name: "Aries",       symbol: "♈", ruling: "Mars"   },
  { name: "Taurus",      symbol: "♉", ruling: "Venus"  },
  { name: "Gemini",      symbol: "♊", ruling: "Mercury"},
  { name: "Cancer",      symbol: "♋", ruling: "Moon"   },
  { name: "Leo",         symbol: "♌", ruling: "Sun"    },
  { name: "Virgo",       symbol: "♍", ruling: "Mercury"},
  { name: "Libra",       symbol: "♎", ruling: "Venus"  },
  { name: "Scorpio",     symbol: "♏", ruling: "Mars"   },
  { name: "Sagittarius", symbol: "♐", ruling: "Jupiter"},
  { name: "Capricorn",   symbol: "♑", ruling: "Saturn" },
  { name: "Aquarius",    symbol: "♒", ruling: "Saturn" },
  { name: "Pisces",      symbol: "♓", ruling: "Jupiter"},
];

export const PLANETS = [
  { name: "Sun",     symbol: "☉", color: "#E87722" },
  { name: "Moon",    symbol: "☽", color: "#C9A227" },
  { name: "Mars",    symbol: "♂", color: "#D44E4E" },
  { name: "Mercury", symbol: "☿", color: "#4CAF50" },
  { name: "Jupiter", symbol: "♃", color: "#C9A227" },
  { name: "Venus",   symbol: "♀", color: "#E91E8C" },
  { name: "Saturn",  symbol: "♄", color: "#6B6B9E" },
  { name: "Rahu",    symbol: "☊", color: "#888" },
  { name: "Ketu",    symbol: "☋", color: "#888" },
];

// Sample kundli for demonstration (April 14, 1993, 06:30 AM, New Delhi)
export const MOCK_KUNDLI: KundliResult = {
  name: "Sample Chart",
  dob: "April 14, 1993",
  tob: "06:30 AM",
  pob: "New Delhi, India",
  ascendant: "Aries",
  ascendantDegree: 14.52,
  ascendantSymbol: "♈",
  moonSign: "Scorpio",
  sunSign: "Aries",
  planets: [
    { name: "Sun",     symbol: "☉", house: 1,  sign: "Aries",       signSymbol: "♈", degree: 0.22,  isRetrograde: false, nakshatra: "Ashwini",     nakshatraPada: 1 },
    { name: "Moon",    symbol: "☽", house: 8,  sign: "Scorpio",     signSymbol: "♏", degree: 22.14, isRetrograde: false, nakshatra: "Jyeshtha",    nakshatraPada: 3 },
    { name: "Mars",    symbol: "♂", house: 4,  sign: "Cancer",      signSymbol: "♋", degree: 10.08, isRetrograde: false, nakshatra: "Pushya",      nakshatraPada: 2 },
    { name: "Mercury", symbol: "☿", house: 12, sign: "Pisces",      signSymbol: "♓", degree: 25.33, isRetrograde: false, nakshatra: "Revati",      nakshatraPada: 1 },
    { name: "Jupiter", symbol: "♃", house: 7,  sign: "Libra",       signSymbol: "♎", degree: 8.45,  isRetrograde: false, nakshatra: "Swati",       nakshatraPada: 4 },
    { name: "Venus",   symbol: "♀", house: 12, sign: "Pisces",      signSymbol: "♓", degree: 18.56, isRetrograde: false, nakshatra: "Uttarabhadra",nakshatraPada: 2 },
    { name: "Saturn",  symbol: "♄", house: 11, sign: "Aquarius",    signSymbol: "♒", degree: 3.21,  isRetrograde: false, nakshatra: "Dhanishtha",  nakshatraPada: 3 },
    { name: "Rahu",    symbol: "☊", house: 9,  sign: "Sagittarius", signSymbol: "♐", degree: 19.40, isRetrograde: true,  nakshatra: "Purvashadha", nakshatraPada: 1 },
    { name: "Ketu",    symbol: "☋", house: 3,  sign: "Gemini",      signSymbol: "♊", degree: 19.40, isRetrograde: true,  nakshatra: "Ardra",       nakshatraPada: 2 },
  ],
  dashas: [
    { planet: "Saturn",  startDate: "1990-03-14", endDate: "2009-03-14", years: 19, isCurrent: false },
    { planet: "Mercury", startDate: "2009-03-14", endDate: "2026-03-14", years: 17, isCurrent: true  },
    { planet: "Ketu",    startDate: "2026-03-14", endDate: "2033-03-14", years: 7,  isCurrent: false },
    { planet: "Venus",   startDate: "2033-03-14", endDate: "2053-03-14", years: 20, isCurrent: false },
    { planet: "Sun",     startDate: "2053-03-14", endDate: "2059-03-14", years: 6,  isCurrent: false },
    { planet: "Moon",    startDate: "2059-03-14", endDate: "2069-03-14", years: 10, isCurrent: false },
  ],
  yogas: [
    { name: "Dhana Yoga",    description: "Jupiter in 7th and Venus in 12th creates financial growth through partnerships and foreign connections.", isPositive: true  },
    { name: "Ruchaka Yoga",  description: "Mars in its own sign (Aries ascendant) indicates great physical energy, leadership, and courage.",         isPositive: true  },
    { name: "Neecha Bhanga", description: "Mars in Cancer is debilitated but cancellation occurs due to Jupiter's aspect, reducing negative effects.", isPositive: true  },
  ],
  basicPrediction:
    "With Aries ascendant and Mercury mahadasha running until 2026, this is an excellent period for communication-related careers, writing, business, and education. The Moon in Jyeshtha nakshatra in the 8th house gives intuitive and research-oriented qualities. Venus in Pisces (exalted) in the 12th house points to spiritual inclinations and hidden talents. Focus on Mercury-related activities — writing, speaking, trading — for best results in the current dasha.",
};
