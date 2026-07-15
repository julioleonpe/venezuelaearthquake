/**
 * Relief-needs taxonomy + presentation translation — a pure, framework-free layer
 * over the free-text `necesidades` field the acopios feed carries.
 *
 * Two jobs, both pure and trivially testable (no React / network / i18n imports):
 *
 *  1. categorizeNeeds() — maps a center's messy, community-authored Spanish needs
 *     text ("alimentos no perecederos, agua, pañales…") into a small, STABLE set of
 *     category keys (food/water/medical/…). Those keys drive the map+feed category
 *     filter and get their human labels from the i18n catalog, so the taxonomy is
 *     bilingual without ever machine-translating crisis text.
 *
 *  2. translateNeedsToEnglish() — a CURATED, hand-built phrase dictionary (not
 *     machine translation) that renders the common needs phrases in English for the
 *     EN toggle. Unknown phrases pass through verbatim in the original Spanish, so
 *     nothing is silently mistranslated. This is a presentation aid over live
 *     third-party data — deliberately outside the curated-content no-MT rule, which
 *     governs authored records, not this external layer.
 *
 * The source is community-authored and full of typos ("pañalaes", "palaes",
 * "coluciones"), so matching is accent-insensitive substring matching and the
 * dictionary carries the common misspellings explicitly.
 */

/** Stable need categories. Order is the display order of the filter chips. */
export type NeedCategory =
  | "food"
  | "water"
  | "medical"
  | "hygiene"
  | "clothing"
  | "bedding"
  | "power"
  | "pets"
  | "tools";

/** Display/scan order for chips and tags (most-common first). */
export const NEED_CATEGORIES: readonly NeedCategory[] = [
  "food",
  "water",
  "medical",
  "hygiene",
  "clothing",
  "bedding",
  "power",
  "pets",
  "tools",
];

/**
 * Accent-insensitive lowercase, so "médicos"/"medicos" and "pañales"/"panales"
 * match one keyword. Shared by categorization and dictionary lookup.
 */
export function normalizeNeeds(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Category → normalized keyword fragments matched as substrings against the whole
 * needs string. Fragments are chosen to survive plurals and the common typos
 * ("panal" covers pañales/panales/pañalaes; "colchon" covers colchones). First
 * match per category wins — a center can land in several categories.
 */
const CATEGORY_KEYWORDS: Record<NeedCategory, readonly string[]> = {
  food: [
    "aliment", "comida", "pereceder", "enlatad", "viver", "arroz", "harina",
    "granos", "cereal", "atun", "frutos secos", "lacteo", "leche", "formula",
    "pasta", "azucar", "cafe",
  ],
  water: ["agua"],
  medical: [
    "medic", "insumo", "primeros auxilios", "gasa", "jeringa", "alcohol",
    "antisep", "analgesic", "curacion", "algodon", "oxigenada", "venda",
    "farmac", "suero", "antibiotic", "material de cura", "solucion",
  ],
  hygiene: [
    "higiene", "panal", "pañal", "toallas sanitarias", "jabon", "limpieza",
    "desinfec", "cepillo", "papel higienico", "toallas humedas", "shampoo",
    "champu", "pasta dental",
  ],
  clothing: ["ropa", "abrigo", "calzado", "zapato", "chaqueta", "prenda", "vestimenta"],
  bedding: ["lenceria", "manta", "cobija", "sabana", "colchon", "almohada", "frazada", "cama"],
  power: ["linterna", "powerbank", "power bank", "bateria", "pila", "cargador", "vela"],
  pets: ["mascota", "animal", "perro", "gato"],
  tools: ["herramienta", "casco", "pico", "pala", "guante", "proteccion", "caja", "bolsas negras"],
};

/**
 * Categorizes a center's needs text into zero or more stable category keys.
 * Pure: same input → same output; empty/blank text → [].
 */
export function categorizeNeeds(text: string | null | undefined): NeedCategory[] {
  const norm = normalizeNeeds(text ?? "");
  if (!norm) return [];
  const out: NeedCategory[] = [];
  for (const cat of NEED_CATEGORIES) {
    if (CATEGORY_KEYWORDS[cat].some((kw) => norm.includes(kw))) out.push(cat);
  }
  return out;
}

/**
 * Curated ES→EN dictionary of the phrases that actually occur in the feed (keyed by
 * normalized form so accents/typos collapse). Values are deliberately plain and
 * factual. This is NOT exhaustive — anything absent falls through untranslated.
 */
const PHRASE_EN: Record<string, string> = {
  // food
  "alimentos no perecederos": "non-perishable food",
  "comida no perecedera": "non-perishable food",
  "alimentos": "food",
  "comida": "food",
  "enlatados": "canned goods",
  "viveres": "provisions",
  "frutos secos": "dried fruit & nuts",
  "formulas infantiles": "infant formula",
  "leche": "milk",
  "comida perecedera": "perishable food",
  // water
  "agua": "water",
  "agua potable": "drinking water",
  "agua potable envasada": "bottled drinking water",
  // medical
  "insumos medicos": "medical supplies",
  "insumos medicos basicos": "basic medical supplies",
  "insumos": "supplies",
  "medicamentos": "medicine",
  "medicinas": "medicine",
  "medicamentos basicos": "basic medicine",
  "medicamentos esenciales": "essential medicine",
  "medicamentos e insumos": "medicine & supplies",
  "primeros auxilios": "first aid",
  "insumos de primeros auxilios": "first-aid supplies",
  "elementos de primeros auxilios": "first-aid supplies",
  "material para curaciones": "wound-care supplies",
  "alcohol": "rubbing alcohol",
  "agua oxigenada": "hydrogen peroxide",
  "gasas": "gauze",
  "algodon": "cotton",
  "jeringas": "syringes",
  "analgesicos": "pain relievers",
  "antisepticos": "antiseptics",
  // hygiene
  "higiene": "hygiene items",
  "productos de higiene personal": "personal hygiene products",
  "articulos de higiene personal": "personal hygiene items",
  "articulos de higiene": "hygiene items",
  "productos de higiene": "hygiene products",
  "panales": "diapers",
  "toallas sanitarias": "sanitary pads",
  "productos de limpieza": "cleaning products",
  // clothing
  "ropa": "clothing",
  "ropa en buen estado": "clothing in good condition",
  "ropa limpia": "clean clothing",
  "abrigos": "coats",
  "calzado": "footwear",
  "calzado en buen estado": "footwear in good condition",
  // bedding
  "lenceria": "bed linens",
  "mantas": "blankets",
  "cobijas": "blankets",
  "sabanas": "sheets",
  // power / light
  "linternas": "flashlights",
  "powerbanks": "power banks",
  "baterias": "batteries",
  // pets
  "comida para animales": "pet food",
  "comida de animales": "pet food",
  "alimentos para mascotas": "pet food",
  // tools / misc
  "herramientas": "tools",
  "cascos": "helmets",
  "elementos de proteccion": "protective gear",
  "cajas": "boxes",
  "bolsas negras": "garbage bags",
  // noise the feed sometimes puts in this field
  "centro de acopio": "collection center",
};

/** Common misspellings → their canonical normalized key. */
const TYPO_CANON: Record<string, string> = {
  "panalaes": "panales",
  "palaes": "panales",
  "panal": "panales",
  "coluciones de desinfeccion": "productos de limpieza",
  "insumos medicos basicos": "insumos medicos basicos",
};

/**
 * Renders needs text in English using the curated dictionary, phrase by phrase.
 * Splits on the delimiters the source uses (comma / semicolon / slash / newline /
 * " y "), translates each known phrase, and passes unknown phrases through in the
 * original Spanish. Order and count are preserved. Pure.
 */
export function translateNeedsToEnglish(text: string | null | undefined): string {
  const raw = (text ?? "").trim();
  if (!raw) return "";
  return raw
    .split(/\s*(?:,|;|\/|\n|:|\s+y\s+|\s+e\s+)\s*/)
    .map((part) => {
      const key = normalizeNeeds(part).replace(/[.\s]+$/, "");
      if (!key) return null;
      const canon = TYPO_CANON[key] ?? key;
      return PHRASE_EN[canon] ?? part.trim();
    })
    .filter((p): p is string => Boolean(p))
    .join(", ");
}
