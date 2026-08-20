import { db, resetDatabase } from './db.js'

const img = {
  dune: 'https://images.unsplash.com/photo-1550291652-6ea9114a47b1?auto=format&fit=crop&w=700&q=85',
  warm: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=700&q=85',
  vintage: 'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?auto=format&fit=crop&w=700&q=85',
  grand: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?auto=format&fit=crop&w=700&q=85',
  piano: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=700&q=85',
  hollow: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&w=700&q=85',
  electric: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=700&q=85',
  stageMic: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=700&q=85',
  desk: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=700&q=85',
  keys: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=700&q=85',
  mic: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=700&q=85',
  drums: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=700&q=85',
  musician: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=700&q=85',
  amp: 'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?auto=format&fit=crop&w=700&q=85',
  ukulele: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=700&q=85'
}

const cats = [
  { slug: 'guitars', name: 'Guitars', parent: null, image: img.warm, sort: 1 },
  { slug: 'acoustic-guitars', name: 'Acoustic Guitars', parent: 'guitars', image: img.vintage, sort: 1 },
  { slug: 'classical-guitars', name: 'Classical Guitars', parent: 'guitars', image: img.piano, sort: 2 },
  { slug: 'electric-guitars', name: 'Electric Guitars', parent: 'guitars', image: img.electric, sort: 3 },
  { slug: 'bass-guitars', name: 'Bass Guitars', parent: 'guitars', image: img.electric, sort: 4 },
  { slug: 'strings', name: 'Strings', parent: 'guitars', image: img.vintage, sort: 5 },
  { slug: 'guitar-accessories', name: 'Guitar Accessories', parent: 'guitars', image: img.desk, sort: 6 },
  { slug: 'ukulele', name: 'Ukulele', parent: null, image: img.ukulele, sort: 2 },
  { slug: 'amplifiers', name: 'Amplifiers', parent: null, image: img.amp, sort: 3 },
  { slug: 'violins', name: 'Violins', parent: null, image: img.musician, sort: 4 },
  { slug: 'wind-and-percussion', name: 'Wind & Percussion', parent: null, image: img.drums, sort: 5 },
  { slug: 'acoustic-drumkits', name: 'Acoustic Drumkits', parent: 'wind-and-percussion', image: img.drums, sort: 1 },
  { slug: 'electronic-drum-kits', name: 'Electronic Drum Kits', parent: 'wind-and-percussion', image: img.drums, sort: 2 },
  { slug: 'saxophone', name: 'Saxophone', parent: 'wind-and-percussion', image: img.mic, sort: 3 },
  { slug: 'harmonica', name: 'Harmonica', parent: 'wind-and-percussion', image: img.musician, sort: 4 },
  { slug: 'flutes', name: 'Flutes', parent: 'wind-and-percussion', image: img.musician, sort: 5 },
  { slug: 'keyboards', name: 'Keyboards', parent: null, image: img.keys, sort: 6 },
  { slug: 'headphones', name: 'Headphones', parent: null, image: img.desk, sort: 7 },
  { slug: 'pickups', name: 'Pickups', parent: null, image: img.grand, sort: 8 }
]

const p = (slug, name, brand, category, price, tag, image, description, specs, featured = 0, rating = 4.5, inStock = 1) => ({ slug, name, brand, category, price, tag, image, description, specs: JSON.stringify(specs), featured, rating, inStock })

const products = [
  p('dune-41-acoustic', 'The Dune 41 Acoustic', 'Heritage Original', 'acoustic-guitars', 12490, 'HERITAGE ORIGINAL', img.dune,
    'A full-bodied dreadnought with a warm, room-filling voice. The guitar that started it all, set up by hand before it ships.',
    { body: 'Dreadnought · Spruce top', neck: 'Mahogany', bridge: 'Rosewood', finish: 'Natural gloss', includes: 'Padded gig bag + Heritage setup' }, 1, 4.8),
  p('harbour-solid-top', 'Harbour Solid Top Dreadnought', 'Harbour', 'acoustic-guitars', 18900, 'EDITOR’S PICK', img.warm,
    'A solid spruce top over layered back and sides gives this workhorse a clear, projecting tone that only gets better with age.',
    { body: 'Dreadnought · Solid spruce top', neck: 'Khaya mahogany', fingerboard: 'Rosewood', finish: 'Satin natural', includes: 'Hardcase' }, 1, 4.7),
  p('monsoon-folk-cutaway', 'Monsoon Folk Cutaway', 'Monsoon', 'acoustic-guitars', 9450, 'NEW ARRIVAL', img.vintage,
    'A compact folk cutaway that stays comfortable on the couch or the stage. Big sound, easy reach, honest price.',
    { body: 'Folk cutaway', top: 'Spruce', backSides: 'Sapele', electronics: 'Fishman preamp', includes: 'Padded bag' }, 0, 4.4),
  p('vespera-all-solid-000', 'Vespera All-Solid 000', 'Vespera', 'acoustic-guitars', 31200, 'LIMITED RUN', img.grand,
    'An all-solid 000 body with the sort of detail that disappears in your hands and leaves only the music behind.',
    { body: '000 · All solid', top: 'Solid cedar', backSides: 'Solid mahogany', fingerboard: 'Ebony', includes: 'Hardcase' }, 1, 4.9),
  p('namma-nylon-classical', 'Namma Nylon Classical', 'Namma', 'classical-guitars', 6800, 'BESTSELLER', img.piano,
    'A nylon-string classical built for practice rooms and first recitals. Soft on the fingers, serious on tone.',
    { body: 'Classical', top: 'Cedar', neck: 'Cedrela', strings: 'Nylon (Savarez)', includes: 'Padded bag' }, 0, 4.5),
  p('mellowtone-semi-hollow', 'Mellowtone Semi-Hollow', 'Mellowtone', 'electric-guitars', 26800, 'EDITOR’S PICK', img.hollow,
    'A semi-hollow that sings at the edge of feedback. Warm clean tones, snappy mids, and a neck that plays like butter.',
    { body: 'Semi-hollow maple', pickups: 'Dual humbuckers', neck: 'Maple · 24.75" scale', bridge: 'Tune-o-matic', includes: 'Padded bag' }, 1, 4.7),
  p('mosswood-st30', 'Mosswood ST30 Electric', 'Mosswood', 'electric-guitars', 22400, 'NEW ARRIVAL', img.electric,
    'A sleek S-style with a roasted maple neck and coil-split humbuckers. Clean, modern, and stage ready out of the box.',
    { body: 'Alder · S-style', pickups: 'HSS coil-split', neck: 'Roasted maple', finish: 'Moss green', includes: 'Padded bag' }, 0, 4.6),
  p('stratway-satin-black', 'Stratway Satin Black', 'Stratway', 'electric-guitars', 15750, 'BESTSELLER', img.stageMic,
    'The beginner electric everyone recommends. Comfortable C neck, three classic singles, satin black everything.',
    { body: 'Poplar · S-style', pickups: 'SSS single coils', neck: 'Maple C', includes: 'Strap + cable + bag' }, 0, 4.5),
  p('grooveline-pj-bass', 'Grooveline PJ Bass', 'Grooveline', 'bass-guitars', 19200, 'HERITAGE ORIGINAL', img.electric,
    'A PJ bass that covers vintage thump and modern growl. Solid, reliable, and right at home in any mix.',
    { body: 'Solid alder', pickups: 'P + J passive', neck: '34" scale maple', includes: 'Padded bag' }, 0, 4.5),
  p('raga-nylon-strings', 'Raga Nylon Strings', 'Raga', 'strings', 890, 'BESTSELLER', img.vintage,
    'Warm, mellow nylon strings tuned for Indian classical and fingerstyle. Gentle on the fingers, rich on the sustain.',
    { gauge: 'Normal', material: 'Nylon', sets: '3 sets', type: 'Classical' }, 0, 4.6),
  p('phosphor-bronze-1253', 'Phosphor Bronze 12-53', 'Heritage', 'strings', 1250, 'EVERYDAY', img.vintage,
    'Bright, balanced phosphor bronze strings that hold their tone through long practice sessions.',
    { gauge: '12-53', material: 'Phosphor bronze', sets: '2 sets', type: 'Steel string' }, 0, 4.4),
  p('roadcase-strap', 'The Roadcase Strap', 'Heritage', 'guitar-accessories', 1450, 'EVERYDAY CARRY', img.desk,
    'A wide leather strap that stays put through hour-long sets. Broken in at the factory, ready at first gig.',
    { width: '2.5"', material: 'Leather', length: 'Adjustable 40-58"', hardware: 'Chrome' }, 0, 4.7),
  p('weatherproof-air-hardcase', 'Weatherproof Air Hardcase', 'Heritage', 'guitar-accessories', 4200, 'TRAVEL FRIENDLY', img.desk,
    'A featherlight air hardcase that shrugs off rain, bumps, and checked luggage. For 40" and 41" guitars.',
    { fits: '40" & 41" guitars', material: 'Aerospace ABS', weight: '2.2 kg', features: 'Weather resistant' }, 0, 4.6),
  p('cedar-concert-ukulele', 'Cedar Concert Ukulele', 'Cedarline', 'ukulele', 4950, 'BESTSELLER', img.ukulele,
    'A concert uke with a mellow cedar top and a tone that punches above its size. Instant smiles, guaranteed.',
    { size: 'Concert', top: 'Cedar', body: 'Mahogany', strings: 'Aquila', includes: 'Padded bag' }, 1, 4.7),
  p('pocket-tone-amp', 'Pocket Tone Amp', 'Tonebox', 'amplifiers', 4999, 'TRAVEL FRIENDLY', img.amp,
    'A palm-sized practice amp with three voices, an aux in, and a battery that outlasts your session.',
    { power: '3W', speaker: '2" full range', channels: '3 voicings', power: 'Rechargeable', includes: 'USB cable' }, 0, 4.5),
  p('token-15-celestion', 'Token 15 Celestion Combo', 'Token', 'amplifiers', 15500, 'EDITOR’S PICK', img.amp,
    'A 15W all-tube-style combo built around a Celestion speaker. The under-₹15k benchmark for bedroom and studio.',
    { power: '15W', speaker: '10" Celestion', inputs: '2', reverb: 'Spring reverb', includes: 'Footswitch' }, 0, 4.6),
  p('rosewood-student-violin', 'Rosewood Student Violin', 'Ravel', 'violins', 8750, 'HERITAGE ORIGINAL', img.musician,
    'A hand-carved student violin that responds beautifully in young hands. Set up with quality strings and bridge.',
    { size: '4/4 & 3/4', top: 'Solid spruce', back: 'Solid maple', fittings: 'Rosewood', includes: 'Bow + case + rosin' }, 0, 4.5),
  p('backline-5-piece-shell', 'Backline 5-Piece Shell Pack', 'Backline', 'acoustic-drumkits', 34500, 'LIMITED RUN', img.drums,
    'A birch shell pack with the depth to fill a live room. Hardware not included, muscle required.',
    { shells: '5-piece birch', sizes: '22/10/12/14/16', finish: 'Satin black', heads: 'Coated ambassadors', includes: 'Shell pack only' }, 1, 4.8),
  p('studio-lite-8-pad-kit', 'Studio Lite 8-Pad Kit', 'Studio Lite', 'electronic-drum-kits', 21900, 'NEW ARRIVAL', img.drums,
    'A quiet, foldable 8-pad electronic kit with 400+ sounds and Bluetooth. Make noise without making enemies.',
    { pads: '8 mesh', sounds: '400+', module: 'Dual-zone snare', extras: 'Bluetooth, USB', includes: 'Stands + sticks' }, 0, 4.5),
  p('brass-room-alto-sax', 'Brass Room Alto Sax', 'Brass Room', 'saxophone', 7250, 'STUDIO ESSENTIAL', img.mic,
    'A student alto sax that is comfortable, consistent, and confident from the first note.',
    { key: 'Eb alto', finish: 'Lacquer', pads: 'Leather', includes: 'Case + mouthpiece' }, 0, 4.4),
  p('pocket-harp-c-blues', 'Pocket Harp C Blues', 'Heritage', 'harmonica', 1150, 'EVERYDAY', img.musician,
    'A smooth-reeded C blues harp that slides into a pocket and out of trouble. Ships in every key on request.',
    { key: 'C (all keys available)', reeds: 'Brass', body: 'ABS comb', covers: 'Stainless' }, 0, 4.5),
  p('bamboo-concert-flute', 'Bamboo Concert Flute', 'Heritage', 'flutes', 1850, 'HERITAGE ORIGINAL', img.musician,
    'A hand-tuned bamboo flute with a clear, breathy voice. Light, durable, and lovely to hold.',
    { key: 'C & G available', material: 'Bamboo', length: '17"', includes: 'Cotton pouch' }, 0, 4.6),
  p('field-notes-61-keyboard', 'Field Notes 61 Keyboard', 'Field Notes', 'keyboards', 18990, 'NEW ARRIVAL', img.keys,
    'A 61-key workstation with weighted-style action, 600 sounds, and a song sequencer for late night makers.',
    { keys: '61 full size', voices: '600+', polyphony: '128', features: 'Sequencer, split/layer', includes: 'Stand + sustain pedal' }, 1, 4.6),
  p('vintage-88-stage-piano', 'Vintage 88 Weighted Stage Piano', 'Heritage', 'keyboards', 42000, 'EDITOR’S PICK', img.keys,
    'An 88-key weighted stage piano with grand-piano samples that will make you forget it is not the real thing.',
    { keys: '88 weighted', voices: 'Grand piano + 30', polyphony: '192', outputs: 'L/R + headphone', includes: 'Sustain pedal' }, 1, 4.9),
  p('monitor-one-studio-headphones', 'Monitor One Studio Headphones', 'Monitor One', 'headphones', 6200, 'BESTSELLER', img.desk,
    'Closed-back studio headphones with a flat response for honest mixing. Comfortable for the long haul.',
    { type: 'Closed-back', driver: '50mm', impedance: '32Ω', cable: 'Coiled, detachable' }, 0, 4.6),
  p('woody-acoustic-pickup', 'Woody Pickup for Acoustic', 'Woody', 'pickups', 3600, 'BESTSELLER', img.grand,
    'A quick-mount soundhole pickup that makes any acoustic stage-ready in seconds. No luthier required.',
    { type: 'Soundhole humbucker', output: 'Passive', install: 'Tool-free', includes: 'Cable' }, 0, 4.5)
]

export function seed() {
  resetDatabase()
  const insertCat = db.prepare('INSERT INTO categories (slug, name, parent_id, image, sort) VALUES (?,?,?,?,?)')
  const parentId = {}
  for (const c of cats) {
    const info = insertCat.run(c.slug, c.name, c.parent ? parentId[c.parent] : null, c.image, c.sort)
    parentId[c.slug] = info.lastInsertRowid
  }
  const insertProd = db.prepare('INSERT INTO products (slug, name, brand, category_id, price, tag, image, description, specs, featured, rating, in_stock) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)')
  const catBySlug = {}
  for (const row of db.prepare('SELECT id, slug FROM categories').all()) catBySlug[row.slug] = row.id
  for (const p of products) {
    insertProd.run(p.slug, p.name, p.brand, catBySlug[p.category], p.price, p.tag, p.image, p.description, p.specs, p.featured, p.rating, p.inStock)
  }
  console.log(`Seeded ${cats.length} categories, ${products.length} products`)
}

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seed()
}