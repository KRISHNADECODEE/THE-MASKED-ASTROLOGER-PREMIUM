# Image Asset Prompts — The Masked Astrologer

Prompts optimised for **Nano Banana Pro** (Google's photoreal image model) to generate
**authentically Vedic / Indian** mystical assets — NOT Western/Greco-Roman or generic web stock.

## Art-direction rules (read first)

**DO — authentic Vedic/Indian visual language**
- Indian temple **stone/clay reliefs**, **Tanjore (gold-leaf)**, **Pichwai**, **Madhubani**, **Pattachitra** styles.
- Motifs: **Om (ॐ)**, **lotus (kamal)**, **mandala / yantra geometry**, **Sri Yantra**, **conch (shankha)**, **diya (oil lamp)**, **rudraksha mala**, **kalash**, **peacock**, **paisley**, **Devanagari script**, **navagraha (9 grahas)**, **27 nakshatras**, banyan/peepal tree.
- People (if any): **Indian features**, traditional attire — **dhoti, angavastram, saree, tilak/bindi, mang tika, jhumka, gold temple jewellery**, sacred thread (janeu).
- Palette: **deep cosmic indigo & midnight blue, subtle nebula purple, antique gold** accents, warm diya glow.
- Lighting: candle/diya warmth, golden-hour temple light, starfield/nakshatra glow.

**DON'T — remove all Western elements**
- ❌ Greek/Roman togas, marble Greco-Roman gods, Corinthian columns, European cathedrals.
- ❌ Western zodiac glyphs (♈♉…), tarot, crystal balls, neon "psychic" signage.
- ❌ Generic stock-photo "businessperson", flat vector clip-art, watermarks, text artefacts.

**Tech specs to append to every prompt**
`photorealistic, ultra-detailed, 8k, 4k textures, sharp focus, cinematic volumetric lighting, intricate hand-carved detail, no text artefacts, no watermark`

**Negative prompt (use on all):**
`greek, roman, toga, marble statue european, gothic cathedral, western zodiac symbols, tarot cards, crystal ball, neon, cartoon, vector, lowres, blurry, extra fingers, watermark, signature, English lettering errors`

---

## 1. Homepage hero background  (aspect 16:9, also export 9:16 for mobile-first)
> A grand Vedic cosmic scene: a vast night sky filled with the 27 nakshatras and a glowing golden Sri Yantra mandala at the centre, deep indigo and nebula-purple cosmos, faint constellations forming an Indian zodiac wheel in Devanagari, a softly lit brass diya floating in the foreground, lotus petals drifting, antique gold particles. Sacred, premium, serene. photorealistic, ultra-detailed, 8k, cinematic volumetric lighting.

## 2. Janm Kundli / birth-chart hero  (16:9)
> A hand-drawn North-Indian style **janm kundli** (diamond birth-chart diagram) carved into aged temple stone, glowing golden planetary symbols of the **navagraha** in each house, Devanagari numerals, surrounded by a lit oil-lamp border and marigold garlands, deep midnight-blue background with star glow. photorealistic, intricate carved detail, 8k.

## 3. Daily Rashifal / horoscope background  (16:9 + 1:1 tiles)
> A celestial Vedic almanac (Panchang) scene: a crescent **Chandra (Moon)** over a starfield, twelve Rashi emblems rendered as small Indian clay reliefs arranged in a circular mandala, golden nakshatra constellation lines, incense smoke, deep blue-purple cosmic palette, warm gold accents. photorealistic, 8k.

## 4. Gun Milan / matchmaking hero  (16:9)
> Two ornate Indian wedding **kalash** pots with coconut and mango leaves on either side of a glowing golden Ashtakoot mandala (8 segments) carved in stone, red and gold marigold garlands, henna/mehndi patterns, sacred fire (havan) glow, deep indigo backdrop with stars. Auspicious, romantic, traditional. photorealistic, 8k.

## 5. Live consultation hero  (16:9)
> A serene Indian **Jyotishi (astrologer)** setting: an antique wooden desk with palm-leaf manuscripts, a brass astrolabe, rudraksha mala, conch shell and a lit diya, a glowing kundli chart hovering as golden light, warm candlelit temple interior, deep blue dusk through a jharokha window. photorealistic, 8k, cinematic.

## 6. Store / gemstones hero  (16:9)
> Certified Vedic **gemstones (Neelam, Pukhraj, Manik)** and energised **yantras** displayed on a carved brass thali with rose petals and a diya, against deep indigo velvet with gold bokeh, soft jewellery lighting. Luxe, trustworthy, Indian. photorealistic macro, 8k.

## 7. The 12 Rashi reliefs  (1:1 square — one per Rashi, to replace the Greco-Roman set)
Base template — replace `<RASHI>` and `<EMBLEM>`:
> A square **Indian temple clay-and-gold relief** of the Vedic Rashi **<RASHI>**, depicting <EMBLEM> in classical Indian sculptural style (like Khajuraho / Tanjore), ornate carved border of lotuses and paisley, the Rashi's Devanagari name on a carved banner at the bottom, the ruling **Graha** symbol in a top medallion, deep blue and antique-gold palette, starfield behind. photorealistic, intricate, 8k.

| Rashi (Sanskrit) | `<EMBLEM>` |
|---|---|
| Mesha (मेष) | a powerful ram |
| Vrishabha (वृषभ) | a regal Nandi bull garlanded |
| Mithuna (मिथुन) | a divine couple / twins |
| Karka (कर्क) | a crab in temple waters |
| Simha (सिंह) | a majestic lion |
| Kanya (कन्या) | a graceful maiden holding grain |
| Tula (तुला) | golden scales of justice |
| Vrishchika (वृश्चिक) | a coiled scorpion |
| Dhanu (धनु) | a centaur-archer (Indian style) |
| **Makara (मकर)** | **a makara — Indian mythological sea-goat/crocodile** |
| Kumbha (कुम्भ) | a sage pouring a sacred kalash |
| Meena (मीन) | two fishes in lotus pond |

> **Priority asset:** **Makara (Capricorn)** — this is the one missing file. Generate it square (1:1), save as `public/zodiacs/capricorn.jpeg`.

## 8. AI Astrologer (coming soon) background  (16:9)
> A futuristic-yet-sacred fusion: a glowing holographic janm kundli and navagraha orbits made of golden light, merging with a traditional carved stone yantra, deep cosmic blue-purple, subtle circuitry rendered as mandala geometry. Premium, mystical-tech. photorealistic, 8k.

## 9. Donation (street dogs) background  (16:9)
> Warm compassionate scene: a calm Indian street dog beside a lit diya and a bowl of food on a temple step, marigold petals, soft golden dawn light, deep blue early sky. Gentle, hopeful, authentic India. photorealistic, 8k.

---

### How to use
1. Generate each at the largest size; export **16:9 (desktop)** and **9:16 / 1:1 (mobile-first)** crops.
2. Save under `public/` (heroes in `public/heroes/`, Rashi tiles in `public/zodiacs/<id>.jpeg`).
3. Tell me the filenames and I'll wire them into the relevant hero/section backgrounds.
