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

// ─── Chat Responses ─────────────────────────────────────────────────────────────

export const mockChatResponses: Record<string, string> = {
  'Why does Saturn have rings?':
    "Saturn's rings are made of billions of pieces of ice, rock, and dust ranging from tiny grains to house-sized chunks. Scientists believe they formed from the remains of comets, asteroids, or moons that were torn apart by Saturn's powerful gravity before they could reach the planet. The rings are incredibly thin compared to their width — if the rings were a sheet of paper, they'd be about the size of a football field!",
  'How far away is Saturn?':
    "Saturn is about 1.2 billion kilometers (746 million miles) from Earth on average, though this distance changes as both planets orbit the Sun. Light from Saturn takes about 80 minutes to reach us. When you look at Saturn through your telescope tonight, you're seeing it as it looked about an hour and 20 minutes ago!",
  'How many moons does Saturn have?':
    "As of 2024, Saturn has 146 known moons — more than any other planet in our solar system! The largest is Titan, which is bigger than the planet Mercury and has a thick atmosphere. You might be able to spot Titan through your telescope as a small bright dot near Saturn. Other notable moons include Enceladus, which has geysers of water ice, and Mimas, which looks remarkably like the Death Star from Star Wars!",
  'Can I see Saturn\'s moons?':
    "Yes! With a decent telescope, you can definitely see Titan, Saturn's largest moon. It appears as a bright orange-ish dot near Saturn. With a larger telescope (6 inches or more), you might also spot Rhea, Tethys, Dione, and Enceladus. They'll appear as tiny points of light near the planet. Try looking on a night with steady air (good 'seeing') for the best results.",
  'What should I observe next?':
    "Great question! Based on what's visible tonight, I'd suggest trying the Andromeda Galaxy (M31). It's the most distant object you can see with the naked eye and looks stunning through a telescope. Look for it in the constellation Andromeda — it appears as a fuzzy oval patch of light. Under dark skies, you might even catch hints of its spiral structure. It's about 2.5 million light-years away, so the light you'll see tonight started its journey before humans existed!",
};

export const defaultChatResponse =
  "That's a great question! As an AI telescope assistant, I can help you understand what you're observing in the night sky. I can identify celestial objects, provide visibility information, give telescope guidance, and share fascinating facts about the cosmos. Try asking me about specific objects like Saturn's rings, the distance to stars, or what to observe next!";

// ─── Suggested Search Targets ───────────────────────────────────────────────────

export const suggestedTargets = [
  { id: 'moon', name: 'Moon', type: 'Moon' },
  { id: 'mars', name: 'Mars', type: 'Planet' },
  { id: 'jupiter', name: 'Jupiter', type: 'Planet' },
  { id: 'saturn', name: 'Saturn', type: 'Planet' },
  { id: 'sirius', name: 'Sirius', type: 'Star' },
  { id: 'andromeda', name: 'Andromeda Galaxy', type: 'Galaxy' },
];

// ─── History Stats ──────────────────────────────────────────────────────────────

export const historyStats = {
  objectsDiscovered: 12,
  observationSessions: 4,
};
