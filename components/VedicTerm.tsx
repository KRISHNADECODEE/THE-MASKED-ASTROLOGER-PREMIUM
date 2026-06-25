"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Comprehensive Vedic vocabulary definitions used throughout the site.
const VEDIC_GLOSSARY: Record<string, string> = {
  // Grahas
  Surya: "The Sun — the Atma (soul), authority, father, and vital life-force. Rules Leo (Simha).",
  Chandra: "The Moon — the Manas (mind), emotions, mother, and instincts. Rules Cancer (Karka).",
  Mangal: "Mars — the planet of courage, energy, siblings, and action. Rules Aries & Scorpio.",
  Budha: "Mercury — the planet of intellect, speech, trade, and education. Rules Gemini & Virgo.",
  Guru: "Jupiter (Brihaspati) — wisdom, dharma, children, and expansion. Rules Sagittarius & Pisces.",
  Shukra: "Venus — beauty, relationships, comforts, and artistic talent. Rules Taurus & Libra.",
  Shani: "Saturn — karma, discipline, hard work, delays, and longevity. Rules Capricorn & Aquarius.",
  Rahu: "The North Lunar Node — a shadow planet (Chhaya Graha). Amplifies desires; associated with foreign lands, technology, and obsession.",
  Ketu: "The South Lunar Node — the shadow planet of detachment, spirituality, and past-life karma.",
  // Chart types
  Kundli: "The Vedic birth chart (Janma Kundli) — a map of the sky at the exact moment and location of birth.",
  Lagna: "The Ascendant — the rising sign on the eastern horizon at birth. Sets the 1st house and shapes your outer personality.",
  Rashi: "Zodiac sign (one of 12). In Vedic astrology, Rashi refers to the sidereal (star-based) sign, not the tropical (Western) sign.",
  Nakshatra: "Lunar mansion — the sky is divided into 27 Nakshatras of 13°20' each. The Moon's Nakshatra at birth is crucial for dashas and compatibility.",
  Pada: "Each Nakshatra is divided into 4 Padas (quarters) of 3°20'. The Pada determines the Navamsa sign.",
  Graha: "Planet — from Sanskrit 'to seize'. Vedic astrology uses 9 Grahas: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu & Ketu.",
  // Divisional charts
  Navamsa: "The D-9 divisional chart — used to assess dharma, marriage, and the deeper purpose of the chart. Each sign is divided into 9 equal Navamsa divisions.",
  Varga: "A divisional chart (Varga/Amsha) used for specific areas of life — D-1 (Lagna), D-9 (Navamsa), D-10 (Dashamsha/career), etc.",
  // Dasha
  Mahadasha: "Major planetary period — the Vimshottari Dasha system divides life into 9 planetary periods totalling 120 years.",
  Antardasha: "Sub-period within a Mahadasha — each major period is subdivided by all 9 planets proportionally.",
  Vimshottari: "The most-used Dasha system. Starts from the Moon's Nakshatra at birth; total cycle = 120 years.",
  // Panchang
  Panchang: "The Vedic almanac — five limbs of time: Tithi (lunar day), Vara (weekday), Nakshatra, Yoga, and Karana.",
  Tithi: "Lunar day — the angular distance between Sun and Moon in multiples of 12°. There are 30 Tithis per lunar month.",
  Paksha: "Fortnight — Shukla Paksha is the waxing (bright) half; Krishna Paksha is the waning (dark) half of the lunar month.",
  PanchangYoga: "Panchang Yoga — computed from the sum of Sun and Moon longitudes, divided into 27 periods of ~13°20'. Each has auspicious or inauspicious qualities.",
  Karana: "Half a Tithi (~6 hours). There are 11 Karanas — 4 fixed and 7 repeating — used for muhurta (auspicious timing).",
  // Compatibility
  Ashtakoot: "Eight-point Gun Milan system — 8 Kootas (qualities) totalling 36 points used to assess marriage compatibility.",
  Koota: "A category in the Ashtakoot system — each Koota tests a specific dimension of compatibility (e.g. Nadi tests health & progeny).",
  Nadi: "The most important Koota (8 points) — tests physiological compatibility. Same Nadi (Aadi/Madhya/Antya) creates Nadi Dosha.",
  Bhakoot: "The 7-point Koota testing emotional compatibility and long-term prosperity through the Rashi positions of both partners.",
  Gana: "Nature grouping (Deva / Manushya / Rakshasa) based on Nakshatra. Deva-Deva or Manushya-Manushya scores 6; Rakshasa-others scores low.",
  Yoni: "Animal symbol of each Nakshatra used to test physical and intimate compatibility between partners.",
  // Yogas
  Yoga: "A planetary combination (Yoga) in the birth chart that bestows specific results — e.g. Gajakesari, Raj Yoga, Kemadruma.",
  Dosha: "A planetary affliction or defect — e.g. Mangal Dosha (Mars in 1st/4th/7th/8th/12th house) or Kaal Sarp Dosha.",
  "Kaal Sarp": "A Dosha formed when all 7 planets are hemmed between Rahu and Ketu. Considered challenging but transformative.",
  "Sade Sati": "Saturn's 7.5-year transit through the 12th, 1st, and 2nd houses from the natal Moon. A period of karmic testing and growth.",
  // Other
  Avakhada: "A set of Vedic astrological details derived from the Moon — Varna, Vashya, Yoni, Gana, Nadi, Tatva, Charan, Paya, Yunja.",
  Varna: "Spiritual caste based on the Moon's Rashi — Brahmin (water signs), Kshatriya (fire), Vaishya (earth), Shudra (air).",
  Tatva: "Element — Agni (fire), Prithvi (earth), Vayu (air), Jala (water). Each Rashi belongs to one Tatva.",
  Gochara: "Transit — the current movement of a planet through the zodiac signs, read from the natal Moon sign (Chandra Lagna).",
  Muhurta: "An auspicious time window for starting an important event — selected using Panchang elements.",
  Jyotish: "Vedic astrology — from Sanskrit Jyoti (light) + Isha (lord). Literally 'the Lord of Light'; the science of light and celestial influence.",
  Janma: "Birth — as in Janma Kundli (birth chart), Janma Nakshatra (birth star), Janma Rashi (birth Moon sign).",
  Dharma: "One's righteous path and duty. The 1st, 5th, and 9th houses are the Dharma Trikona in the birth chart.",
};

interface Props {
  term: string;       // Sanskrit/Vedic word to highlight
  children?: React.ReactNode; // display text (defaults to `term`)
  inline?: boolean;   // set true when inside flowing body text
}

export function VedicTerm({ term, children, inline }: Props) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const definition = VEDIC_GLOSSARY[term];
  if (!definition) return <>{children ?? term}</>;

  const show = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(true);
  };
  const hide = () => {
    timerRef.current = setTimeout(() => setVisible(false), 120);
  };

  return (
    <span className="relative" style={{ display: inline ? "inline" : "inline-block" }}>
      <span
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        tabIndex={0}
        style={{
          borderBottom: "1px dashed var(--color-gold)",
          cursor: "help",
          color: "inherit",
          outline: "none",
        }}
      >
        {children ?? term}
      </span>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            onMouseEnter={show}
            onMouseLeave={hide}
            style={{
              position: "absolute",
              bottom: "calc(100% + 8px)",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 50,
              minWidth: 220,
              maxWidth: 300,
              background: "var(--color-cosmic)",
              border: "1px solid rgba(209,168,110,0.3)",
              borderRadius: 10,
              padding: "10px 14px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
              pointerEvents: "auto",
            }}
          >
            <p className="text-xs font-bold mb-1" style={{ color: "var(--color-gold)", fontFamily: "var(--font-body)" }}>{term}</p>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(250,245,237,0.8)", fontFamily: "var(--font-body)" }}>{definition}</p>
            {/* Arrow */}
            <div style={{ position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%)", width: 10, height: 10, background: "var(--color-cosmic)", borderRight: "1px solid rgba(209,168,110,0.3)", borderBottom: "1px solid rgba(209,168,110,0.3)", rotate: "45deg" }} />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
