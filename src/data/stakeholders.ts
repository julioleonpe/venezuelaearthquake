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
