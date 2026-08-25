import type {
  CelestialObject,
  Observation,
  Visibility,
  TelescopeGuidance,
  ChatMessage,
} from '@/types';

// ─── Celestial Objects ──────────────────────────────────────────────────────────

export const celestialObjects: CelestialObject[] = [
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'planet',
    visualKey: 'jupiter',
    description:
      'Jupiter is the largest planet in our solar system. Through a telescope, you can see its distinct cloud bands and the Great Red Spot — a storm larger than Earth that has been raging for hundreds of years. You may also spot up to four of its largest moons, known as the Galilean moons.',
    quickFacts: [
      { label: 'Distance from Earth', value: '588 million km' },
      { label: 'Diameter', value: '139,820 km' },
      { label: 'Moons', value: '95 known' },
      { label: 'Orbit Period', value: '11.86 years' },
      { label: 'Type', value: 'Gas Giant' },
    ],
    bestTime: 'Best viewed from August to December when it is at opposition.',
    funFact:
      'Jupiter is so massive that it could fit all the other planets in our solar system inside it — with room to spare!',
    difficulty: 'Easy',
    color: '#c4a35a',
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'planet',
    visualKey: 'saturn',
    description:
      'Saturn is famous for its stunning ring system, made of billions of ice and rock particles. Through a telescope, even a small one, you can see the rings extending out from the planet. Saturn also has beautiful cloud bands and over 140 known moons.',
    quickFacts: [
      { label: 'Distance from Earth', value: '1.2 billion km' },
      { label: 'Diameter', value: '116,460 km' },
      { label: 'Moons', value: '146 known' },
      { label: 'Ring Span', value: '282,000 km' },
      { label: 'Type', value: 'Gas Giant' },
    ],
    bestTime:
      'Best observed during opposition, typically between June and November.',
    funFact:
      'Saturn is the least dense planet in the solar system. If you could find a bathtub big enough, it would float!',
    difficulty: 'Easy',
    color: '#e8d5a3',
  },
  {
    id: 'moon',
    name: 'Moon',
    type: 'moon',
    visualKey: 'moon',
    description:
      'Our Moon is the easiest celestial object to observe through a telescope. You can see craters, mountains, and vast flat plains called "maria." The best time to observe details is during a crescent or half moon, when shadows highlight the surface features along the terminator line.',
    quickFacts: [
      { label: 'Distance from Earth', value: '384,400 km' },
      { label: 'Diameter', value: '3,474 km' },
      { label: 'Orbit Period', value: '27.3 days' },
      { label: 'Surface Temp', value: '-173°C to 127°C' },
      { label: 'Type', value: 'Natural Satellite' },
    ],
    bestTime:
      'Best features visible during first quarter and last quarter phases.',
    funFact:
      "The Moon is slowly moving away from Earth at a rate of about 3.8 cm per year. In the distant future, total solar eclipses won't be possible!",
    difficulty: 'Easy',
    color: '#d4d4d4',
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'planet',
    visualKey: 'mars',
    description:
      'Mars, the Red Planet, appears as a bright reddish-orange dot in the night sky. Through a telescope, you might see its polar ice caps and darker surface markings. Mars is one of the most studied planets and a prime candidate for future human exploration.',
    quickFacts: [
      { label: 'Distance from Earth', value: '225 million km' },
      { label: 'Diameter', value: '6,779 km' },
      { label: 'Moons', value: '2 (Phobos & Deimos)' },
      { label: 'Day Length', value: '24h 37m' },
      { label: 'Type', value: 'Terrestrial' },
    ],
    bestTime: 'Best viewed during opposition, approximately every 26 months.',
    funFact:
      'Olympus Mons on Mars is the tallest volcano in the solar system at about 21.9 km high — nearly three times the height of Mount Everest!',
    difficulty: 'Easy',
    color: '#c1440e',
  },
  {
    id: 'sirius',
    name: 'Sirius',
    type: 'star',
    visualKey: 'sirius',
    description:
      "Sirius, also known as the Dog Star, is the brightest star in the night sky. It's actually a binary star system — Sirius A, a brilliant white main-sequence star, and Sirius B, a faint white dwarf companion. Its twinkling is caused by Earth's atmosphere bending its light.",
    quickFacts: [
      { label: 'Distance', value: '8.6 light-years' },
      { label: 'Brightness', value: 'Magnitude −1.46' },
      { label: 'Constellation', value: 'Canis Major' },
      { label: 'Star Type', value: 'A1V (Main Sequence)' },
      { label: 'Companion', value: 'Sirius B (White Dwarf)' },
    ],
    bestTime: 'Best visible from November to April in the Northern Hemisphere.',
    funFact:
      'Ancient Egyptians called Sirius the "Nile Star" because its appearance in the dawn sky coincided with the annual flooding of the Nile.',
    difficulty: 'Easy',
    color: '#a8c8ff',
  },
  {
    id: 'andromeda',
    name: 'Andromeda Galaxy',
    type: 'galaxy',
    visualKey: 'andromeda',
    description:
      'The Andromeda Galaxy (M31) is the nearest large galaxy to the Milky Way and the most distant object visible to the naked eye. Through a telescope, you can see its bright core and, under dark skies, hints of its spiral arms. It contains approximately one trillion stars.',
    quickFacts: [
      { label: 'Distance', value: '2.537 million light-years' },
      { label: 'Diameter', value: '220,000 light-years' },
      { label: 'Stars', value: '~1 trillion' },
      { label: 'Constellation', value: 'Andromeda' },
      { label: 'Type', value: 'Spiral Galaxy' },
    ],
    bestTime:
      'Best viewed from September to February in the Northern Hemisphere.',
    funFact:
      'The Andromeda Galaxy is on a collision course with our Milky Way. They will merge in about 4.5 billion years to form a new galaxy sometimes nicknamed "Milkdromeda!"',
    difficulty: 'Moderate',
    color: '#9b8ec4',
  },
];

// ─── Observations ───────────────────────────────────────────────────────────────

export const observations: Observation[] = [
  {
    id: 'obs-1',
    objectId: 'jupiter',
    objectName: 'Jupiter',
    objectType: 'Planet',
    visualKey: 'jupiter',
    confidence: 94,
    timestamp: '2026-08-22T20:14:00',
    date: '22 Aug',
    time: '8:14 PM',
  },
  {
    id: 'obs-2',
    objectId: 'moon',
    objectName: 'Moon',
    objectType: 'Moon',
    visualKey: 'moon',
    confidence: 98,
    timestamp: '2026-08-22T19:42:00',
    date: '22 Aug',
    time: '7:42 PM',
  },
  {
    id: 'obs-3',
    objectId: 'saturn',
    objectName: 'Saturn',
    objectType: 'Planet',
    visualKey: 'saturn',
    confidence: 91,
    timestamp: '2026-08-22T21:03:00',
    date: '22 Aug',
    time: '9:03 PM',
  },
  {
    id: 'obs-4',
    objectId: 'mars',
    objectName: 'Mars',
    objectType: 'Planet',
    visualKey: 'mars',
    confidence: 87,
    timestamp: '2026-08-21T22:15:00',
    date: '21 Aug',
    time: '10:15 PM',
  },
  {
    id: 'obs-5',
    objectId: 'sirius',
    objectName: 'Sirius',
    objectType: 'Star',
    visualKey: 'sirius',
    confidence: 96,
    timestamp: '2026-08-20T23:30:00',
    date: '20 Aug',
    time: '11:30 PM',
  },
];

// ─── Visibility ─────────────────────────────────────────────────────────────────

export const tonightVisibility: Visibility[] = [
  {
    objectId: 'moon',
    objectName: 'Moon',
    objectType: 'Moon',
    visualKey: 'moon',
    isVisible: true,
    bestViewingStart: '7:00 PM',
    bestViewingEnd: '2:00 AM',
    quality: 'Excellent',
    azimuth: 95,
    altitude: 62,
  },
  {
    objectId: 'jupiter',
    objectName: 'Jupiter',
    objectType: 'Planet',
    visualKey: 'jupiter',
    isVisible: true,
    bestViewingStart: '8:00 PM',
    bestViewingEnd: '11:00 PM',
    quality: 'Excellent',
    azimuth: 120,
    altitude: 40,
  },
  {
    objectId: 'saturn',
    objectName: 'Saturn',
    objectType: 'Planet',
    visualKey: 'saturn',
    isVisible: true,
    bestViewingStart: '9:00 PM',
    bestViewingEnd: '11:30 PM',
    quality: 'Good',
    azimuth: 138,
    altitude: 44,
  },
  {
    objectId: 'sirius',
    objectName: 'Sirius',
    objectType: 'Star',
    visualKey: 'sirius',
    isVisible: true,
    bestViewingStart: '10:00 PM',
    bestViewingEnd: '3:00 AM',
    quality: 'Good',
    azimuth: 162,
    altitude: 28,
  },
  {
    objectId: 'andromeda',
    objectName: 'Andromeda Galaxy',
    objectType: 'Galaxy',
    visualKey: 'andromeda',
    isVisible: true,
    bestViewingStart: '9:30 PM',
    bestViewingEnd: '1:00 AM',
    quality: 'Fair',
    azimuth: 45,
    altitude: 55,
  },
];

// ─── Telescope Guidance ─────────────────────────────────────────────────────────

export const mockGuidance: TelescopeGuidance = {
  currentObject: 'Jupiter',
  targetObject: 'Saturn',
  current: { azimuth: 120, altitude: 40 },
  target: { azimuth: 138, altitude: 44 },
  deltaAzimuth: 18,
  deltaAltitude: 4,
  horizontalDirection: 'RIGHT',
  verticalDirection: 'UP',
};

// ─── Object-Specific Suggested Questions ───────────────────────────────────────

export const objectSuggestedPrompts: Record<string, string[]> = {
  jupiter: [
    'Why does Jupiter have bands?',
    'How far away is Jupiter?',
    'How many moons does Jupiter have?',
    'What is the Great Red Spot?',
    'What should I observe next?',
  ],
  saturn: [
    'Why does Saturn have rings?',
    'How far away is Saturn?',
    'How many moons does Saturn have?',
    "Can I see Saturn's moons?",
    'What should I observe next?',
  ],
  moon: [
    'Why does the Moon have craters?',
    'Why does the Moon have phases?',
    'How far away is the Moon?',
    "Can I see the Moon's surface?",
    'What should I observe next?',
  ],
  mars: [
    'Why is Mars red?',
    'Does Mars have moons?',
    'How far away is Mars?',
    'Can I see Mars tonight?',
    'What should I observe next?',
  ],
  sirius: [
    'Why is Sirius so bright?',
    'How far away is Sirius?',
    'Is Sirius a binary star?',
    'What type of star is Sirius?',
    'What should I observe next?',
  ],
  andromeda: [
    'How far away is Andromeda?',
    'Can I see Andromeda with a telescope?',
    'How large is Andromeda?',
    'Will Andromeda collide with the Milky Way?',
    'What should I observe next?',
  ],
  default: [
    'What celestial objects can I observe tonight?',
    'How do I align my telescope?',
    'What is the best time for stargazing?',
    'What should I observe next?',
  ],
};

// ─── Chat Responses ─────────────────────────────────────────────────────────────

export const mockChatResponses: Record<string, string> = {
  // ── Saturn Responses ──
  'Why does Saturn have rings?':
    "Saturn's rings are made of billions of pieces of ice, rock, and dust ranging from tiny grains to house-sized chunks. Scientists believe they formed from the remains of comets, asteroids, or moons that were torn apart by Saturn's powerful gravity before they could reach the planet. The rings are incredibly thin compared to their width — if the rings were a sheet of paper, they'd be about the size of a football field!",
  'How far away is Saturn?':
    "Saturn is about 1.2 billion kilometers (746 million miles) from Earth on average, though this distance changes as both planets orbit the Sun. Light from Saturn takes about 80 minutes to reach us. When you look at Saturn through your telescope tonight, you're seeing it as it looked about an hour and 20 minutes ago!",
  'How many moons does Saturn have?':
    "As of 2024, Saturn has 146 known moons — more than any other planet in our solar system! The largest is Titan, which is bigger than the planet Mercury and has a thick atmosphere. You might be able to spot Titan through your telescope as a small bright dot near Saturn. Other notable moons include Enceladus, which has geysers of water ice, and Mimas, which looks remarkably like the Death Star from Star Wars!",
  'Can I see Saturn\'s moons?':
    "Yes! With a decent telescope, you can definitely see Titan, Saturn's largest moon. It appears as a bright orange-ish dot near Saturn. With a larger telescope (6 inches or more), you might also spot Rhea, Tethys, Dione, and Enceladus. They'll appear as tiny points of light near the planet. Try looking on a night with steady air (good 'seeing') for the best results.",

  // ── Jupiter Responses ──
  'Why does Jupiter have bands?':
    "Jupiter's colorful bands are created by strong atmospheric jet streams flowing in alternating east-west directions at speeds exceeding 400 km/h. The lighter zones are regions of rising gas with ammonia ice clouds, while the darker belts are regions of sinking gas where warmer, deeper atmospheric layers are exposed.",
  'How far away is Jupiter?':
    "Jupiter is about 588 to 968 million kilometers (365 to 601 million miles) from Earth depending on our orbital alignment. Sunlight reflecting off Jupiter takes approximately 33 to 53 minutes to travel across space and reach your telescope eyepiece!",
  'How many moons does Jupiter have?':
    "As of 2024, Jupiter has 95 officially recognized moons! The four largest — Io, Europa, Ganymede, and Callisto — are the famous Galilean moons. You can easily spot them through almost any small telescope as four bright dots arranged in a line beside the planet.",
  'What is the Great Red Spot?':
    "The Great Red Spot is a colossal anticyclonic storm in Jupiter's southern hemisphere that has been churning for over 300 years. It is larger than Earth and produces ferocious winds exceeding 430 km/h. Through your telescope, look for a distinct reddish-salmon oval in the southern equatorial belt.",

  // ── Moon Responses ──
  'Why does the Moon have craters?':
    "The Moon has no thick atmosphere, weather, or active plate tectonics to erode its surface. Impact craters gouged out by asteroids and comets billions of years ago remain pristine and preserved, creating the dramatic shadowed terrain you see through your telescope.",
  'Why does the Moon have phases?':
    "The Moon doesn't produce its own light; it reflects sunlight. As the Moon orbits Earth every 27.3 days, we see varying fractions of its daylit hemisphere. The boundary between day and night on the Moon is called the terminator, and it offers the sharpest, most dramatic view of craters and peaks!",
  'How far away is the Moon?':
    "The Moon is on average 384,400 kilometers (238,855 miles) away from Earth. Moonlight takes only about 1.3 seconds to reach your eyes, making it our closest cosmic neighbor.",
  'Can I see the Moon\'s surface?':
    "Yes, in incredible detail! Even with modest magnification, you can explore rugged mountain ranges like the Lunar Apennines, prominent impact craters like Tycho and Copernicus with their radiating splash rays, and vast basaltic volcanic plains called 'maria'.",

  // ── Mars Responses ──
  'Why is Mars red?':
    "Mars gets its iconic reddish-orange color from iron oxide (rust) covering its rocks and regolith. Fine dust particles are continuously suspended in its thin carbon dioxide atmosphere, casting a warm rusty glow across the planet.",
  'Does Mars have moons?':
    "Yes! Mars has two tiny, potato-shaped moons named Phobos ('Fear') and Deimos ('Dread'), discovered in 1877. Both are likely captured asteroids from the nearby asteroid belt.",
  'How far away is Mars?':
    "Mars is on average 225 million kilometers (140 million miles) from Earth, but this distance varies drastically between 54.6 million km during close opposition to over 400 million km when on the opposite side of the Sun.",
  'Can I see Mars tonight?':
    "Yes! Through a telescope, Mars appears as a bright reddish-orange disk. With steady atmospheric seeing and decent magnification, you can distinguish its bright white polar ice caps and dark volcanic surface markings like Syrtis Major.",

  // ── Sirius Responses ──
  'Why is Sirius so bright?':
    "Sirius is the brightest star in the night sky (magnitude −1.46) for two reasons: it is intrinsically twice as luminous as our Sun and relatively very close to us — only 8.6 light-years away in the constellation Canis Major.",
  'How far away is Sirius?':
    "Sirius is located approximately 8.6 light-years (about 81.4 trillion km) from Earth. When you look at Sirius tonight, you are seeing light that left the star nearly 9 years ago.",
  'Is Sirius a binary star?':
    "Yes! Sirius is a binary star system consisting of Sirius A (a brilliant blue-white main-sequence star) and Sirius B (nicknamed 'the Pup'), an ultra-dense Earth-sized white dwarf companion with the mass of our Sun.",
  'What type of star is Sirius?':
    "Sirius A is an A1V main-sequence star with a blazing surface temperature of roughly 9,940 K, emitting a dazzling bluish-white glow that twinkles vigorously due to Earth's atmospheric turbulence.",

  // ── Andromeda Galaxy Responses ──
  'How far away is Andromeda?':
    "The Andromeda Galaxy (M31) is approximately 2.537 million light-years from Earth. It is the most distant celestial object visible to the naked eye under dark skies — the light you see tonight started its journey when early hominids first walked Earth!",
  'Can I see Andromeda with a telescope?':
    "Yes! Through a telescope or binoculars, Andromeda appears as a bright, elongated oval glow with a luminous galactic nucleus. Under dark skies, you can spot its dark dust lanes and companion dwarf galaxies M32 and M110.",
  'How large is Andromeda?':
    "Andromeda has an estimated diameter of 220,000 light-years — more than double the size of our Milky Way — and contains roughly one trillion stars!",
  'Will Andromeda collide with the Milky Way?':
    "Yes! Andromeda and our Milky Way are hurtling toward each other at approximately 110 km/s. In about 4.5 billion years, they will merge in a grand cosmic collision to form a giant elliptical galaxy nicknamed 'Milkdromeda'.",

  // ── General Navigation / Next Observation ──
  'What should I observe next?':
    "Based on what's visible tonight, I suggest exploring the Andromeda Galaxy (M31) or Saturn's rings. Check the Night Sky page or Guide mode to see exact coordinates and directional instructions from your current position!",
  'What celestial objects can I observe tonight?':
    "Tonight offers great visibility for the Moon, Jupiter, Saturn, Sirius, and the Andromeda Galaxy! Head to the Night Sky page to see optimal viewing time windows from your location.",
  'How do I align my telescope?':
    "Start by centering a bright landmark or celestial beacon in your finder scope. Once centered, check the eyepiece and adjust your altitude and azimuth slow-motion controls. You can also use AstroLens Guide mode for real-time directional deltas!",
  'What is the best time for stargazing?':
    "The best stargazing occurs on clear, moonless nights or during crescent moon phases when lunar glare is minimal. Allow 20 to 30 minutes for your eyes to fully adapt to the dark for the best deep-sky contrast.",
};

export const defaultChatResponse =
  "That's a great astronomy question! As your AI telescope assistant, I can help you understand what you're observing, provide ephemeris coordinates, explain celestial physics, and suggest exciting targets. Try asking about your current observation, planetary atmospheres, or what to view next!";

// ─── Suggested Search Targets ───────────────────────────────────────────────────

export const suggestedTargets = [
  { id: 'moon', name: 'Moon', type: 'Moon', visualKey: 'moon' as const },
  { id: 'mars', name: 'Mars', type: 'Planet', visualKey: 'mars' as const },
  { id: 'jupiter', name: 'Jupiter', type: 'Planet', visualKey: 'jupiter' as const },
  { id: 'saturn', name: 'Saturn', type: 'Planet', visualKey: 'saturn' as const },
  { id: 'sirius', name: 'Sirius', type: 'Star', visualKey: 'sirius' as const },
  { id: 'andromeda', name: 'Andromeda Galaxy', type: 'Galaxy', visualKey: 'andromeda' as const },
];

// ─── History Stats ──────────────────────────────────────────────────────────────

export const historyStats = {
  objectsDiscovered: 12,
  observationSessions: 4,
};
