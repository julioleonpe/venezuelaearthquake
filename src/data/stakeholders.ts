/**
 * Stakeholder map dataset — a reference index of organizations engaged in the
 * 2026 Venezuela earthquake response, grouped by function.
 *
 * This is an INFORMATIONAL reference, not a curated trust-gated record type. It
 * deliberately lives outside the `Curated` model and the visibility gate: it
 * names third-party responders the Hub does not own, each tagged with a `status`
 * the UI surfaces honestly (`hub` = already cited on this Hub, `cand` = verified-
 * looking but not yet curated, `verify` = named in coverage, confirm first). The
 * page that renders it carries a prominent "listing is not verification" notice.
 *
 * Org names and links are reference data kept in their canonical form. Role blurbs
 * are provided in both languages (EN/ES) so the page chrome can stay bilingual
 * without machine-translating at runtime; group titles are likewise bilingual.
 *
 * Compiled from public sources (June 2026): AP, Reuters, IFRC, PAHO/WHO, IRC,
 * World Central Kitchen, Direct Relief, and donation guides (El País, Billboard,
 * others). Casualty/magnitude figures vary by source — none are canonical here.
 * Mirrors docs/stakeholder-map.md; keep the two in sync when editing.
 */

export type StakeholderStatus = "hub" | "cand" | "verify";

export interface Stakeholder {
  name: string;
  /** Canonical destination (opens in a new tab via ExternalLink). */
  url: string | null;
  status: StakeholderStatus;
  roleEn: string;
  roleEs: string;
  /** Phone contacts (e.g. emergency lines) shown as tap-to-call `tel:` links.
   *  Used for responders that publish a number rather than a website; rendered
   *  always-visible (not in the tooltip) since the number is the actionable bit. */
  phones?: string[];
  /** WhatsApp contact numbers, shown always-visible as tap-to-chat `wa.me` links
   *  (opens the WhatsApp conversation, NOT the phone dialer). Used for support
   *  lines reachable by message rather than call — esp. international numbers a
   *  caller would message, not phone. */
  whatsapp?: string[];
  /** Physical address (e.g. a donation drop-off center). Shown always-visible as
   *  a tap-to-navigate link (Google Maps search) since the address is the
   *  actionable bit. Language-neutral; any descriptor (incl. hours) goes in the
   *  bilingual role text to keep the localization-is-presentation invariant. */
  address?: string;
  /** ISO-8601 timestamp of when this org was added — drives the transient
   *  "newly added" badge, which auto-expires (see NEW_TOOL_WINDOW_DAYS). */
  addedAt?: string;
}

export interface StakeholderGroup {
  /** Stable key for React lists + anchors. */
  key: string;
  titleEn: string;
  titleEs: string;
  orgs: Stakeholder[];
}

export const STAKEHOLDER_GROUPS: StakeholderGroup[] = [
  {
    key: "coordination",
    titleEn: "Coordination & UN system",
    titleEs: "Coordinación y sistema ONU",
    orgs: [
      {
        name: "UN-OCHA",
        url: "https://www.unocha.org/venezuela",
        status: "verify",
        roleEn: "Overall humanitarian coordination; runs the Venezuela Humanitarian Fund.",
        roleEs: "Coordinación humanitaria general; gestiona el Fondo Humanitario para Venezuela.",
      },
      {
        name: "PAHO / WHO",
        url: "https://www.paho.org/en/venezuela-earthquake-response",
        status: "hub",
        roleEn: "Health-sector lead: emergency medical teams, hospital safety, supplies.",
        roleEs: "Líder del sector salud: equipos médicos de emergencia, seguridad hospitalaria, insumos.",
      },
      {
        name: "IOM",
        url: "https://www.iom.int/countries/venezuela-bolivarian-republic",
        status: "verify",
        roleEn: "Engaged via the Protection Cluster.",
        roleEs: "Participa a través del Clúster de Protección.",
      },
      {
        name: "ReliefWeb (OCHA)",
        url: "https://reliefweb.int/country/ven",
        status: "verify",
        roleEn: "Canonical situation-report aggregator for the disaster.",
        roleEs: "Agregador canónico de informes de situación del desastre.",
      },
    ],
  },
  {
    key: "redcross",
    titleEn: "Red Cross / Red Crescent",
    titleEs: "Cruz Roja / Media Luna Roja",
    orgs: [
      {
        name: "IFRC",
        url: "https://www.ifrc.org/emergencies",
        status: "hub",
        roleEn: "Emergency appeal; shelter, medical, and psychosocial support via the national society.",
        roleEs: "Llamado de emergencia; refugio, atención médica y apoyo psicosocial vía la sociedad nacional.",
      },
      {
        name: "Cruz Roja Venezolana",
        url: "https://www.cruzrojavenezolana.org",
        status: "hub",
        roleEn: "Search, rescue, first aid, water & sanitation on the ground.",
        roleEs: "Búsqueda, rescate, primeros auxilios, agua y saneamiento en terreno.",
      },
    ],
  },
  {
    key: "medical",
    titleEn: "Medical & health",
    titleEs: "Salud y atención médica",
    orgs: [
      {
        name: "Direct Relief",
        url: "https://www.directrelief.org/2026/06/venezuela-earthquake-caracas-damage/",
        status: "hub",
        roleEn: "Emergency medical aid to providers near the epicenter; 100% to this response.",
        roleEs: "Ayuda médica de emergencia a proveedores cerca del epicentro; 100% a esta respuesta.",
      },
      {
        name: "International Medical Corps",
        url: "https://internationalmedicalcorps.org",
        status: "verify",
        roleEn: "Assistance teams deployed; medical aid (confirm event-specific page).",
        roleEs: "Equipos de asistencia desplegados; ayuda médica (confirmar página del evento).",
      },
      {
        name: "Healing Venezuela",
        url: "https://www.globalgiving.org/projects/emergency-appeal-earthquake-in-venezuela/",
        status: "hub",
        roleEn: "UK medical relief charity; trauma kits, treatment, potable water (via GlobalGiving).",
        roleEs: "Organización médica del Reino Unido; kits de trauma, tratamiento, agua potable (vía GlobalGiving).",
      },
      {
        name: "PsicoLínea (UCAB)",
        url: null,
        status: "hub",
        roleEn: "Free, confidential psychological help line (UCAB Psychology / PsicoData): psychological first aid & crisis intervention. Thursdays 8am–5pm.",
        roleEs: "Línea de ayuda psicológica gratuita y confidencial (Psicología UCAB / PsicoData): primeros auxilios psicológicos e intervención en crisis. Jueves de 8am a 5pm.",
        phones: ["0414-1217882", "0424-1723981"],
        addedAt: "2026-06-27T12:00:00-04:00",
      },
      {
        name: "Psicólogos por Venezuela",
        url: null,
        status: "verify",
        roleEn: "Network of 600+ psychologists, psychiatrists & mental-health professionals offering free, immediate psychological support to Venezuelans in and outside the country. Reach by WhatsApp.",
        roleEs: "Red de más de 600 psicólogos, psiquiatras y profesionales de salud mental que ofrecen acompañamiento psicológico gratuito e inmediato a venezolanos dentro y fuera del país. Atención por WhatsApp.",
        whatsapp: ["+52 55 3320 0457"],
        addedAt: "2026-06-27T12:00:00-04:00",
      },
    ],
  },
  {
    key: "sar",
    titleEn: "Search & rescue",
    titleEs: "Búsqueda y rescate",
    orgs: [
      {
        name: "Bomberos Unidos Sin Fronteras",
        url: "https://www.busf.org",
        status: "verify",
        roleEn: "Spanish search-and-rescue team deployed.",
        roleEs: "Equipo español de búsqueda y rescate desplegado.",
      },
      {
        name: "CORE",
        url: "https://www.coreresponse.org",
        status: "cand",
        roleEn: "Relief org (founded post-2010 Haiti) responding.",
        roleEs: "Organización de ayuda (fundada tras Haití 2010) respondiendo.",
      },
    ],
  },
  {
    key: "firefighters",
    titleEn: "Firefighters (affected areas)",
    titleEs: "Bomberos (áreas afectadas)",
    orgs: [
      {
        name: "Bomberos de Chacao",
        url: null,
        status: "verify",
        roleEn: "Fire & rescue service — Chacao, Caracas.",
        roleEs: "Servicio de bomberos y rescate — Chacao, Caracas.",
        phones: ["0212-2653261"],
        addedAt: "2026-06-27T12:00:00-04:00",
      },
      {
        name: "Bomberos de La Guaira",
        url: null,
        status: "verify",
        roleEn: "Fire & rescue service — La Guaira state.",
        roleEs: "Servicio de bomberos y rescate — estado La Guaira.",
        phones: ["0212-3327620", "0212-3310445"],
        addedAt: "2026-06-27T12:00:00-04:00",
      },
      {
        name: "Bomberos Metropolitanos",
        url: null,
        status: "verify",
        roleEn: "Metropolitan fire department — Caracas.",
        roleEs: "Cuerpo de bomberos metropolitano — Caracas.",
        phones: ["0212-5454545"],
        addedAt: "2026-06-27T12:00:00-04:00",
      },
      {
        name: "Bomberos del estado Miranda",
        url: null,
        status: "verify",
        roleEn: "Fire & rescue service — Miranda state.",
        roleEs: "Servicio de bomberos y rescate — estado Miranda.",
        phones: ["0212-2356967"],
        addedAt: "2026-06-27T12:00:00-04:00",
      },
      {
        name: "Bomberos de Plaza Venezuela",
        url: null,
        status: "verify",
        roleEn: "Fire & rescue service — Plaza Venezuela, Caracas.",
        roleEs: "Servicio de bomberos y rescate — Plaza Venezuela, Caracas.",
        phones: ["0212-7936457"],
        addedAt: "2026-06-27T12:00:00-04:00",
      },
    ],
  },
  {
    key: "engineers",
    titleEn: "Engineers & structural safety",
    titleEs: "Ingenieros y seguridad estructural",
    orgs: [
      {
        name: "Ingenieros UCV (Madrid)",
        url: null,
        status: "verify",
        roleEn: "Venezuelan engineers in Madrid (UCV alumni) running free remote (telematic) inspections and reports to confirm whether a home is safe and habitable. Reach by WhatsApp.",
        roleEs: "Ingenieros venezolanos en Madrid (egresados UCV) que realizan inspecciones telemáticas e informes gratuitos para confirmar si una vivienda es segura y habitable. Atención por WhatsApp.",
        whatsapp: ["+34 672 917 856"],
        addedAt: "2026-06-27T12:00:00-04:00",
      },
    ],
  },
  {
    key: "food",
    titleEn: "Food, water & shelter",
    titleEs: "Alimentos, agua y refugio",
    orgs: [
      {
        name: "World Central Kitchen",
        url: "https://donate.wck.org/campaign/815521/donate",
        status: "hub",
        roleEn: "Fresh meals for families and first responders.",
        roleEs: "Comidas frescas para familias y personal de emergencias.",
      },
      {
        name: "World Food Programme",
        url: "https://www.wfp.org/emergencies",
        status: "verify",
        roleEn: "Emergency food support; coordination with local partners.",
        roleEs: "Apoyo alimentario de emergencia; coordinación con socios locales.",
      },
      {
        name: "Convoy of Hope",
        url: "https://convoyofhope.org",
        status: "cand",
        roleEn: "Hygiene kits, hot meals, drinking water from mobile kitchens.",
        roleEs: "Kits de higiene, comidas calientes, agua potable desde cocinas móviles.",
      },
    ],
  },
  {
    key: "children",
    titleEn: "Children & protection",
    titleEs: "Niñez y protección",
    orgs: [
      {
        name: "UNICEF",
        url: "https://www.unicef.org/emergencies",
        status: "hub",
        roleEn: "Nutrition, safe water, child protection, psychosocial support.",
        roleEs: "Nutrición, agua segura, protección infantil, apoyo psicosocial.",
      },
      {
        name: "Save the Children",
        url: "https://www.savethechildren.org",
        status: "cand",
        roleEn: "Child protection in the crisis; recovery support.",
        roleEs: "Protección infantil en la crisis; apoyo a la recuperación.",
      },
      {
        name: "RET International",
        url: "https://theret.org",
        status: "cand",
        roleEn: "With Fe y Alegría: damage assessment, protection risks, family support.",
        roleEs: "Con Fe y Alegría: evaluación de daños, riesgos de protección, apoyo a familias.",
      },
    ],
  },
  {
    key: "faith",
    titleEn: "Faith-based & diaspora",
    titleEs: "Confesionales y diáspora",
    orgs: [
      {
        name: "Caritas",
        url: "https://donate.caritas.org/venezuela/",
        status: "hub",
        roleEn: "Catholic Church aid agency; food, water, shelter, medical appeal.",
        roleEs: "Agencia de ayuda de la Iglesia católica; llamado de alimentos, agua, refugio, salud.",
      },
      {
        name: "International Rescue Committee",
        url: "https://www.rescue.org/press-release/venezuela-irc-launches-emergency-response-twin-earthquakes",
        status: "hub",
        roleEn: "Relief items & medical supplies to frontline workers.",
        roleEs: "Artículos de ayuda e insumos médicos al personal de primera línea.",
      },
      {
        name: "Global Empowerment Mission",
        url: "https://www.globalempowermentmission.org",
        status: "cand",
        roleEn: "Response team; supplies to Caracas; FL collection center.",
        roleEs: "Equipo de respuesta; insumos a Caracas; centro de acopio en Florida.",
      },
      {
        name: "We Love Foundation",
        url: "https://welove.foundation",
        status: "cand",
        roleEn: "GEM's local partner; food, water, medical, hygiene, shelter.",
        roleEs: "Socio local de GEM; alimentos, agua, salud, higiene, refugio.",
      },
    ],
  },
  {
    key: "local",
    titleEn: "Local services & logistics",
    titleEs: "Servicios locales y logística",
    orgs: [
      {
        name: "Yummy — Donaciones",
        url: "https://dona.yummyrides.com/",
        status: "hub",
        roleEn: "Venezuelan super-app donation portal (Pago Móvil, card, ACH).",
        roleEs: "Portal de donaciones de la super-app venezolana (Pago Móvil, tarjeta, ACH).",
      },
      {
        name: "Yummy Heroes",
        url: "https://heroes.yummyrides.com/",
        status: "hub",
        roleEn: "Free/subsidized rides for emergency responders.",
        roleEs: "Viajes gratis/subsidiados para personal de emergencias.",
      },
    ],
  },
  {
    key: "info",
    titleEn: "Information & people-finding",
    titleEs: "Información y búsqueda de personas",
    orgs: [
      {
        name: "Venezuela Te Busca",
        url: "https://venezuelatebusca.com/",
        status: "hub",
        roleEn: "National missing & displaced persons registry.",
        roleEs: "Registro nacional de personas desaparecidas y desplazadas.",
      },
      {
        name: "Desaparecidos Terremoto Venezuela",
        url: "https://desaparecidosterremotovenezuela.com/",
        status: "hub",
        roleEn: "Earthquake-specific missing persons registry.",
        roleEs: "Registro de desaparecidos específico del terremoto.",
      },
      {
        name: "Mapa de Daño",
        url: "https://terremotovenezuela.com/",
        status: "hub",
        roleEn: "Community map of reported earthquake damage.",
        roleEs: "Mapa comunitario de daños reportados por el terremoto.",
      },
      {
        name: "Redes Ayuda",
        url: "https://redesayuda.org",
        status: "verify",
        roleEn: "Citizen platform: locate family, coordinate shelters & aid.",
        roleEs: "Plataforma ciudadana: localizar familia, coordinar refugios y ayuda.",
      },
    ],
  },
  {
    key: "platforms",
    titleEn: "Donation platforms",
    titleEs: "Plataformas de donación",
    orgs: [
      {
        name: "GlobalGiving — Venezuela Earthquake",
        url: "https://www.globalgiving.org/projects/emergency-appeal-earthquake-in-venezuela/",
        status: "cand",
        roleEn: "Channels donations to vetted local organizations.",
        roleEs: "Canaliza donaciones a organizaciones locales verificadas.",
      },
    ],
  },
  {
    key: "acopio-caracas",
    titleEn: "Drop-off centers — Caracas",
    titleEs: "Centros de acopio — Caracas",
    orgs: [
      {
        name: "G3 Logística — Caracas",
        url: null,
        status: "verify",
        roleEn: "Donation drop-off center. Mon–Fri 9:00 AM–12:00 PM & 2:00–3:30 PM.",
        roleEs: "Centro de acopio de donaciones. Lun–Vie 9:00 AM–12:00 PM y 2:00–3:30 PM.",
        address:
          "Av. Principal de Los Cortijos de Lourdes, Edificio Maploca, Los Cortijos de Lourdes, Caracas",
        addedAt: "2026-06-27T12:00:00-04:00",
      },
      {
        name: "Cáritas Venezuela — Sede Montalbán",
        url: null,
        status: "hub",
        roleEn: "Donation drop-off — Venezuelan Bishops' Conference HQ, ~200m from UCAB, facing Urb. Juan Pablo II.",
        roleEs: "Centro de acopio — sede de la Conferencia Episcopal Venezolana, a ~200m de la UCAB, frente a la Urb. Juan Pablo II.",
        address: "Av. Teherán, Montalbán, Caracas",
        addedAt: "2026-06-27T12:00:00-04:00",
      },
    ],
  },
  {
    key: "acopio-valencia",
    titleEn: "Drop-off centers — Valencia",
    titleEs: "Centros de acopio — Valencia",
    orgs: [
      {
        name: "G3 Logística — Valencia",
        url: null,
        status: "verify",
        roleEn: "Donation drop-off center. Mon–Fri 9:00 AM–12:00 PM & 2:00–3:30 PM.",
        roleEs: "Centro de acopio de donaciones. Lun–Vie 9:00 AM–12:00 PM y 2:00–3:30 PM.",
        address:
          "Calle La Pedrera, Fundo Los Marines, Lote S/N, Zona Industrial San Diego, Edo. Carabobo",
        addedAt: "2026-06-27T12:00:00-04:00",
      },
    ],
  },
  {
    key: "acopio-barquisimeto",
    titleEn: "Drop-off centers — Barquisimeto",
    titleEs: "Centros de acopio — Barquisimeto",
    orgs: [
      {
        name: "G3 Logística — Barquisimeto",
        url: null,
        status: "verify",
        roleEn: "Donation drop-off center. Mon–Fri 9:00 AM–12:00 PM & 2:00–3:30 PM.",
        roleEs: "Centro de acopio de donaciones. Lun–Vie 9:00 AM–12:00 PM y 2:00–3:30 PM.",
        address:
          "Zona Industrial II, Av. Principal con Calle 6, Locales 110-111-112, Municipio Iribarren, Barquisimeto, Edo. Lara",
        addedAt: "2026-06-27T12:00:00-04:00",
      },
    ],
  },
  {
    key: "government",
    titleEn: "Government & official",
    titleEs: "Gobierno y oficial",
    orgs: [
      {
        name: "U.S. Department of State",
        url: "https://www.state.gov/responding-to-venezuela-earthquakes/",
        status: "verify",
        roleEn: "Coordinating the U.S. government response.",
        roleEs: "Coordina la respuesta del gobierno de EE. UU.",
      },
    ],
  },
];

/** Total org count across all groups (for the page subheading). */
export const STAKEHOLDER_COUNT = STAKEHOLDER_GROUPS.reduce(
  (n, g) => n + g.orgs.length,
  0,
);
