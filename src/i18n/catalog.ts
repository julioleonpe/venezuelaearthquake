/**
 * Interface-chrome string catalog (EN/ES).
 *
 * Per `design.md`, localization is presentation-only: this catalog translates
 * navigation, labels, notices, empty states, and error messages (Req 1.4, 10).
 * It does NOT translate curated record content — that stays in its authored
 * language with a LanguageIndicator (Req 10.5). English is the default (Req 10.3).
 *
 * Every message id used by the UI must exist in BOTH locales (catalog-completeness
 * is asserted by the type: `Record<MessageId, string>` for each locale).
 *
 * Spanish copy is held to the same practical, factual tone (Req 1.8) — translated,
 * not transcreated. Strings are written to absorb ~15–30% expansion without
 * breaking the calm grid.
 */

export type Locale = "en" | "es";

const en = {
  // Brand / shell
  "brand.name": "Venezuela Earthquake Hub",
  "brand.tagline": "Relief coordination · 2026",
  "lang.toggle.aria": "Change language",
  "lang.en": "EN",
  "lang.es": "ES",
  "lang.en.full": "English",
  "lang.es.full": "Español",
  "skip.toContent": "Skip to main content",

  // Primary navigation
  "nav.commandCenter": "Command Center",
  "nav.latest": "Latest",
  "nav.donate": "Donate",
  "nav.other": "Other",
  "nav.other.aria": "Other relief tools",
  "nav.resources": "Resource Directory",
  "nav.peopleFinder": "People Finder",
  "nav.peopleFinder2": "Missing Persons Registry",
  "nav.damageMap": "Mapa de Daño",
  "nav.damageMap.sub": "Community map of reported earthquake damage",
  "nav.home": "Hub home",

  // Command bar
  "cmd.status": "Live · monitoring",

  // Command center (bento home)
  "cc.headline": "2026 Venezuela Earthquake — Information Hub",
  "cc.blurb":
    "Two earthquakes struck northern Venezuela, the stronger at magnitude 7.5. This console brings together a live map of relief points, verified news, vetted donation channels, and tools to find people and resources.",
  "cc.stat.magnitude": "Peak magnitude",
  "cc.stat.quakes": "Earthquakes",
  "cc.stat.deaths": "Reported deaths",
  "cc.stat.injuries": "Reported injuries",
  "cc.stat.missing": "Reported missing",
  // Worded values for figures still undetermined / not a single count.
  "cc.stat.undetermined": "—",
  "cc.stat.missing.value": "+50,000",
  "cc.tile.news": "News & relevant info",
  "cc.tile.donate": "Donate Now",
  "cc.viewAll": "View all",
  "cc.people.sub": "Report or search for missing & displaced people",
  "cc.people2.sub": "Community registry of people reported missing",
  "cc.resources.sub": "Vetted relief organizations & services",
  "cc.links.label": "Quick links",
  "cc.donate.more": "More verified channels",

  // Situation overview (modal opened from the status strip)
  "cc.overview.open": "Situation overview",
  "cc.overview.title": "Situation Overview",
  "cc.overview.p1":
    "On Wednesday, June 24, 2026, two massive back-to-back earthquakes (M7.2 and M7.5) struck northern Venezuela in the Veroes area of Yaracuy State, just 39 seconds apart — the most powerful to strike the country since 1900 (USGS). The casualty toll has climbed steadily: as of Tuesday, July 14, the government reports at least 4,734 killed and more than 16,740 injured, with over 16,300 left homeless and another 28,300 in homes deemed uninhabitable. Tens of thousands remain missing — unofficial tracking sites list figures ranging from roughly 18,000 to nearly 30,000, and the UN cited more than 50,000 in the immediate aftermath. USGS PAGER modeling warns the true death toll could ultimately exceed 10,000. Numbers conflict across sources and remain provisional. More than 1,100 aftershocks have been recorded, the largest a M4.8 on June 27 (Funvisis / USGS).",
  "cc.overview.p2":
    "The state of La Guaira — the hardest-hit region, where officials report roughly 80% of buildings collapsed — was militarized, with access restricted to authorized personnel after convoys of civilian volunteers clogged its single highway and delayed ambulances and rescue crews. By early July most search-and-rescue operations had wound down and efforts shifted to recovering the dead; overwhelmed morgues sent bodies to a makeshift mortuary at the La Guaira port. The UN Office for Disaster Risk Reduction estimates about US$37 billion in direct damage, with satellite analysis suggesting roughly 590,000 buildings damaged nationwide. Rescuers and medical teams from more than 30 countries deployed; the United States earmarked $150 million in aid and sent FEMA search-and-rescue teams. Aid workers now warn of disease risk from poor sanitation and scarce clean water across Caracas, La Guaira, Miranda, Aragua, Carabobo, and Falcón.",
  "cc.overview.sources": "Sources",
  "cc.overview.close": "Close",

  // Relief Tools & Apps launcher (grouped outbound tools)
  "tools.title": "Relief Tools & Apps",
  "tools.group.people": "Find a person",
  "tools.group.damage": "Report & view damage",
  "tools.group.services": "Transport & services",
  "tools.group.coordination": "Coordination & directories",
  "tools.group.pets": "Pets & animals",
  "tools.group.organizations": "Relief organizations map",
  "tools.peopleCount": "{n} registries",
  "tools.itemCount": "{n} apps",
  "tools.newBadge": "Newly added",
  "tools.vtb.label": "Venezuela Te Busca",
  "tools.vtb.sub": "National missing & displaced persons registry",
  "tools.dtv.label": "Desaparecidos Terremoto",
  "tools.dtv.sub": "Earthquake-specific missing persons registry",
  "tools.ubicados.label": "Ubicados Venezuela",
  "tools.ubicados.sub": "Report people, shelters & affected buildings",
  "tools.encuentralos.label": "Encuéntralos",
  "tools.encuentralos.sub": "Community search: people, shelters & aid",
  "tools.pacientes.label": "Hospitalized patients list",
  "tools.pacientes.sub": "Doctor-maintained consolidated list · updated regularly",
  "tools.buscapaciente.label": "Busca Tu Paciente",
  "tools.buscapaciente.sub": "Find a hospitalized person · live clinical patient registry",
  "tools.reencuentro.label": "Reencuentro Seguro",
  "tools.reencuentro.sub": "Safely reunite unaccompanied children · identity protected",
  "tools.yummysos.label": "Yummy SOS",
  "tools.yummysos.sub": "Report structural damage · reports map · shelters",
  "tools.damagemap.label": "Mapa de Daño",
  "tools.damagemap.sub": "Community map of reported earthquake damage",
  "tools.sismovzla.label": "SismoVenezuela",
  "tools.sismovzla.sub": "Community damage map · report buildings by level + photo",
  "tools.sismoayuda.label": "SismoAyuda VE",
  "tools.sismoayuda.sub": "Submit photos · volunteer engineers email a structural report",
  "tools.yummyheroes.label": "Yummy Heroes",
  "tools.yummydona.label": "Yummy — Donations",
  "tools.yummyheroes.sub": "Free rides for emergency responders",
  "tools.yummydona.sub": "Donation portal (Pago Móvil, card, ACH)",
  "tools.interpaid.label": "Interpreter Aid",
  "tools.interpaid.sub": "Volunteer interpreters: register to bridge teams & victims",
  "tools.vzlayuda.label": "VZLA Ayuda",
  "tools.vzlayuda.sub": "Match needs with helpers — request or offer aid, no account",
  "tools.escuchactiva.label": "Escucha Activa",
  "tools.escuchactiva.sub": "Free emotional support from volunteer psychologists",
  "tools.medicosvzla.label": "Médicos por Venezuela",
  "tools.medicosvzla.sub": "Free medical teleconsultations from Venezuelan doctors",
  "tools.acopios.label": "Acopios y Refugios",
  "tools.acopios.sub": "Community map of drop-off centers & shelters · by state",
  "tools.directorio.label": "Directorio Sismo",
  "tools.directorio.sub": "Verified directory of relief tools across all categories",
  "tools.cvc.label": "CVC Emergencia",
  "tools.cvc.sub": "Heavy machinery registry: offer equipment, volunteer or request help",
  "tools.fisio.label": "Fisioterapeutas Voluntarios",
  "tools.fisio.sub": "National directory of volunteer physiotherapists",
  "tools.aje.label": "AJE Ayuda Venezuela",
  "tools.aje.sub": "Official AJE platform · verified drop-offs, orgs & donation channels",
  "tools.airbnb.label": "Airbnb.org",
  "tools.airbnb.sub": "Free emergency housing for people impacted, via nonprofit partners",
  "tools.acopioven.label": "Centros de Acopio VEN",
  "tools.acopioven.sub": "Drop-off map · match supplies, needs & surplus between centers",
  "tools.huellas.label": "Huellas a Salvo",
  "tools.huellas.sub": "Report lost pets, find vet help & animal drop-off centers",
  "tools.patitas.label": "Patitas a Salvo",
  "tools.patitas.sub": "Lost & found pet alerts · animal shelters, supplies & donations",
  "tools.stakeholders.label": "Relief organizations map",
  "tools.stakeholders.sub": "",

  // Resource Directory — in progress (no verified entries published yet)
  "resources.soon.kicker": "In the works",
  "resources.soon.title": "Resource Directory is being built",
  "resources.soon.body":
    "We're curating and verifying relief organizations and services before publishing them here. Every entry is checked before it goes live, so this directory will open once the first listings are verified. In the meantime, use the live news feed and the links below.",
  "resources.soon.backHome": "Back to the command center",

  // Stakeholder map (/stakeholders) — relief-organization reference index
  "stake.kicker": "Response reference",
  "stake.title": "Who's responding",
  "stake.lede":
    "A reference map of {n} organizations engaged in the 2026 Venezuela earthquake response, grouped by function — coordination, medical, food & shelter, children, search & rescue, and more.",
  "stake.disclaimer":
    "Informational only. This is a research reference, not an endorsement. Listing is not verification — confirm each organization independently before relying on it or donating. Status, links, and figures change as the response evolves.",
  "stake.disclaimer.short":
    "Informational reference — listing is not verification. Confirm each organization before relying on it or donating.",
  "stake.legend.title": "Status legend",
  "stake.legend.hub": "Cited on this Hub",
  "stake.legend.cand": "Verified-looking, not yet curated",
  "stake.legend.verify": "Named in coverage; confirm first",
  "stake.status.hub": "In Hub",
  "stake.status.cand": "Candidate",
  "stake.status.verify": "Verify",
  "stake.count.one": "{n} organization",
  "stake.count.many": "{n} organizations",
  "stake.open": "Open site",
  "stake.sources":
    "Compiled from public sources (June 2026), including AP, Reuters, IFRC, PAHO/WHO, IRC, World Central Kitchen, Direct Relief, and donation guides. Casualty and magnitude figures vary by source and date.",
  "stake.back": "Back to the command center",

  // Relief map — collection centers & shelters (live, community-reported)
  "relief.title": "Collection Centers & Shelters",
  "relief.source": "acopios-refugios.vercel.app",
  "relief.attribution": "Community-reported · via acopios-refugios.vercel.app — report a point",
  "relief.unavailable": "Live relief-point data is temporarily unavailable.",
  "relief.empty": "No relief points are currently available.",
  "relief.mapHint": "Collection centers & shelters · community-sourced",
  "relief.filter.all": "All",
  "relief.filter.acopio": "Acopios",
  "relief.filter.refugio": "Refugios",
  "relief.filter.aria": "Filter relief points by type",
  "relief.type.acopio": "Collection center",
  "relief.type.refugio": "Shelter",
  "relief.unverified": "Unverified",
  "subsystem.relief": "Collection centers & shelters",

  // Donate panel (Caritas link-out card)
  "donate.verified": "Verified channel",
  "donate.recipient": "GiveDirectly — Venezuela Earthquakes",
  "donate.affiliation": "U.S. cash-transfer nonprofit · 501(c)(3) · tax-deductible",
  "donate.description":
    "Sends cash relief directly to earthquake survivors — about $340 per person, roughly three months of basic needs for a family of four — with recipients deciding how to spend it. The highest-need communities are identified using damage and poverty data. Every $1 in cash multiplies into about $2.60 in local economic activity (Egger et al., Econometrica 2022).",
  "donate.amountsLabel": "Suggested donation amounts",
  "donate.cta": "Donate via GiveDirectly",
  "donate.openOfficial": "Open official site",
  "donate.frameTitle": "GiveDirectly donation form",
  "donate.fallback":
    "The donation form could not be embedded here. Use the button below to donate on GiveDirectly's official site.",
  "donate.note": "You'll complete your gift securely on GiveDirectly's own site. The Hub never handles your payment. U.S. donations are tax-deductible.",
  "donate.clicks.label": "donation links clicked",

  // Footer
  "footer.managedBy": "Independently managed —",
  "footer.contact": "Contact site curator",

  // Landing
  "landing.kicker": "Official relief coordination",
  "landing.title": "Verified help for the 2026 Venezuela earthquake",
  "landing.lede":
    "A coordination point for verified news, vetted donation channels, and relief resources. Every item below is reviewed before it is published.",
  "landing.lastUpdated": "Content last updated",
  "landing.cards.heading": "Where do you want to go?",
  "landing.status.available": "Available",
  "landing.status.unavailable": "Temporarily unavailable",
  "landing.peopleFinder.title": "Looking for someone?",
  "landing.peopleFinder.body":
    "The People Finder is a separate, established system for reporting and searching for missing or displaced people. It opens in a new tab.",

  // Cards
  "card.latest.title": "Latest news",
  "card.latest.body": "Verified updates on the situation and the relief response, newest first.",
  "card.donate.title": "Donate",
  "card.donate.body":
    "Give through verified channels. We link you to each organization's own official donation page.",
  "card.resources.title": "Resource directory",
  "card.resources.body": "Vetted relief organizations and services you can search and filter.",
  "card.cta": "Open",

  // News page
  "news.title": "Latest news",
  "news.intro": "Verified updates, most recent first.",
  "news.empty": "No verified news is currently available.",
  "news.unavailable": "News is temporarily unavailable. Please try again shortly.",
  "news.source": "Source",
  "news.openSource": "Open source",
  "news.sourceUnavailable": "Source unavailable — this item has no working source link.",
  "news.published": "Published",

  // Donations page
  "donations.title": "Donate to verified relief funds",
  "donations.intro":
    "Each channel below links to the recipient organization's own official donation page. The Hub never collects, processes, or holds your donation.",
  "donations.notice":
    "Before donating, confirm the details on the recipient organization's official site. The Hub links out to that site and does not process payments.",
  "donations.empty": "No verified donation channels are currently available.",
  "donations.unavailable": "Donation information is temporarily unavailable. Please try again shortly.",
  "donations.give": "Donate on official site",
  "donations.affiliation": "Affiliation",

  // Resources page
  "resources.title": "Resource directory",
  "resources.intro": "Vetted relief organizations and services. Search or filter by category.",
  "resources.search.label": "Search resources",
  "resources.search.placeholder": "Search by name or description",
  "resources.search.submit": "Search",
  "resources.search.clear": "Clear",
  "resources.filter.label": "Category",
  "resources.filter.all": "All categories",
  "resources.empty": "No resources match your search. Try a different keyword or category.",
  "resources.unavailable": "The resource directory is temporarily unavailable. Please try again shortly.",
  "resources.category": "Category",
  "resources.keyword.empty": "Enter a keyword to search (1–100 characters).",
  "resources.keyword.tooLong": "Keyword is too long. Use 100 characters or fewer.",
  "resources.resultCount": "resources",

  // External link / trust
  "ext.opensNewTab": "opens in a new tab",
  "ext.unverifiedSource": "Unverified source",
  "ext.leavingHub": "Leaves the Hub",
  "trust.statement":
    "Content on this Hub is reviewed by the Hub's editorial team before publication. Verification checks the source, the recipient organization's legitimacy, and that links point to official sites. Only items marked verified appear here.",
  "trust.verified": "Verified",
  "lang.indicator.en": "In English",
  "lang.indicator.es": "En español",

  // Loading / errors / degradation
  "loading.label": "Loading…",
  "loading.slow": "This is taking longer than usual. Still loading…",
  "error.navTitle": "This page could not be opened",
  "error.navBody": "The subsystem is unavailable right now. You are still on the previous page.",
  "degraded.notice.one": "The following service is temporarily unavailable:",
  "degraded.notice.many": "The following services are temporarily unavailable:",
  "subsystem.news": "Latest news",
  "subsystem.donations": "Donations",
  "subsystem.resources": "Resource directory",

  // Footer
  "footer.note":
    "This Hub links out to relief organizations and the People Finder; it does not collect donations or store People Finder records.",
  "footer.notAffiliated": "An independent relief-coordination Hub.",
} as const;

export type MessageId = keyof typeof en;

const es: Record<MessageId, string> = {
  "brand.name": "Centro del Terremoto de Venezuela",
  "brand.tagline": "Coordinación de ayuda · 2026",
  "lang.toggle.aria": "Cambiar idioma",
  "lang.en": "EN",
  "lang.es": "ES",
  "lang.en.full": "English",
  "lang.es.full": "Español",
  "skip.toContent": "Saltar al contenido principal",

  "nav.commandCenter": "Centro de Mando",
  "nav.latest": "Novedades",
  "nav.donate": "Donar",
  "nav.other": "Más",
  "nav.other.aria": "Otras herramientas de ayuda",
  "nav.resources": "Directorio de recursos",
  "nav.peopleFinder": "Buscador de Personas",
  "nav.peopleFinder2": "Registro de Desaparecidos",
  "nav.damageMap": "Mapa de Daño",
  "nav.damageMap.sub": "Mapa comunitario de daños reportados por el terremoto",
  "nav.home": "Inicio del Centro",

  "cmd.status": "En vivo · monitoreando",

  "cc.headline": "Terremoto de Venezuela 2026 — Centro de Información",
  "cc.blurb":
    "Dos terremotos sacudieron el norte de Venezuela; el más fuerte de magnitud 7.5. Esta consola reúne un mapa en vivo de puntos de ayuda, noticias verificadas, canales de donación validados y herramientas para encontrar personas y recursos.",
  "cc.stat.magnitude": "Magnitud máxima",
  "cc.stat.quakes": "Terremotos",
  "cc.stat.deaths": "Fallecidos reportados",
  "cc.stat.injuries": "Heridos reportados",
  "cc.stat.missing": "Desaparecidos reportados",
  // Valores en texto para cifras aún indeterminadas / que no son un solo conteo.
  "cc.stat.undetermined": "—",
  "cc.stat.missing.value": "+50,000",
  "cc.tile.news": "Noticias e información relevante",
  "cc.tile.donate": "Donar Ahora",
  "cc.viewAll": "Ver todo",
  "cc.people.sub": "Reporta o busca personas desaparecidas y desplazadas",
  "cc.people2.sub": "Registro comunitario de personas reportadas como desaparecidas",
  "cc.resources.sub": "Organizaciones y servicios de ayuda validados",
  "cc.links.label": "Enlaces rápidos",
  "cc.donate.more": "Más canales verificados",

  "cc.overview.open": "Resumen de la situación",
  "cc.overview.title": "Resumen de la situación",
  "cc.overview.p1":
    "El miércoles 24 de junio de 2026, dos potentes terremotos consecutivos (M7.2 y M7.5) sacudieron el norte de Venezuela en la zona de Veroes, estado Yaracuy, con apenas 39 segundos de diferencia — los más fuertes que han azotado al país desde 1900 (USGS). El número de víctimas ha aumentado de forma sostenida: hasta el martes 14 de julio, el gobierno reporta al menos 4.734 fallecidos y más de 16.740 heridos, con más de 16.300 personas sin hogar y otras 28.300 en viviendas declaradas inhabitables. Decenas de miles siguen desaparecidas — los sitios de rastreo no oficiales manejan cifras que van de unas 18.000 a casi 30.000, y la ONU citó más de 50.000 en los primeros días. El sistema PAGER del USGS advierte que la cifra real de fallecidos podría superar los 10.000. Las cifras varían según la fuente y son provisionales. Se han registrado más de 1.100 réplicas, la mayor de M4.8 el 27 de junio (Funvisis / USGS).",
  "cc.overview.p2":
    "El estado de La Guaira — la región más afectada, donde las autoridades reportan que alrededor del 80% de los edificios colapsó — fue militarizado, con el acceso restringido al personal autorizado luego de que caravanas de voluntarios civiles congestionaran su única autopista y retrasaran ambulancias y equipos de rescate. Para principios de julio, la mayoría de las labores de búsqueda y rescate habían concluido y los esfuerzos se enfocaron en recuperar a los fallecidos; las morgues desbordadas trasladaron cuerpos a una morgue improvisada en el puerto de La Guaira. La Oficina de la ONU para la Reducción del Riesgo de Desastres estima unos 37.000 millones de dólares en daños directos, y el análisis satelital sugiere que unos 590.000 edificios resultaron dañados en todo el país. Desplegaron rescatistas y equipos médicos de más de 30 países; Estados Unidos destinó 150 millones de dólares en ayuda y envió equipos de búsqueda y rescate de FEMA. Los trabajadores humanitarios ahora advierten del riesgo de enfermedades por la falta de saneamiento y agua potable en Caracas, La Guaira, Miranda, Aragua, Carabobo y Falcón.",
  "cc.overview.sources": "Fuentes",
  "cc.overview.close": "Cerrar",

  // Lanzador de Herramientas y Apps de Ayuda (enlaces externos agrupados)
  "tools.title": "Herramientas y Apps de Ayuda",
  "tools.group.people": "Buscar a una persona",
  "tools.group.damage": "Reportar y ver daños",
  "tools.group.services": "Transporte y servicios",
  "tools.group.coordination": "Coordinación y directorios",
  "tools.group.pets": "Mascotas y animales",
  "tools.group.organizations": "Mapa de organizaciones de ayuda",
  "tools.peopleCount": "{n} registros",
  "tools.itemCount": "{n} apps",
  "tools.newBadge": "Recién agregado",
  "tools.vtb.label": "Venezuela Te Busca",
  "tools.vtb.sub": "Registro nacional de personas desaparecidas y desplazadas",
  "tools.dtv.label": "Desaparecidos Terremoto",
  "tools.dtv.sub": "Registro de desaparecidos específico del terremoto",
  "tools.ubicados.label": "Ubicados Venezuela",
  "tools.ubicados.sub": "Reporta personas, refugios y edificaciones afectadas",
  "tools.encuentralos.label": "Encuéntralos",
  "tools.encuentralos.sub": "Búsqueda comunitaria: personas, refugios y ayuda",
  "tools.pacientes.label": "Lista de pacientes hospitalizados",
  "tools.pacientes.sub": "Lista consolidada mantenida por médicos · se actualiza con frecuencia",
  "tools.buscapaciente.label": "Busca Tu Paciente",
  "tools.buscapaciente.sub": "Localiza a una persona hospitalizada · registro clínico en vivo",
  "tools.reencuentro.label": "Reencuentro Seguro",
  "tools.reencuentro.sub": "Reunifica niños no acompañados de forma segura · identidad protegida",
  "tools.yummysos.label": "Yummy SOS",
  "tools.yummysos.sub": "Reportar daños estructurales · mapa de reportes · refugios",
  "tools.damagemap.label": "Mapa de Daño",
  "tools.damagemap.sub": "Mapa comunitario de daños reportados por el terremoto",
  "tools.sismovzla.label": "SismoVenezuela",
  "tools.sismovzla.sub": "Mapa comunitario de daños · reporta edificios por nivel + foto",
  "tools.sismoayuda.label": "SismoAyuda VE",
  "tools.sismoayuda.sub": "Envía fotos · ingenieros voluntarios te envían un informe estructural",
  "tools.yummyheroes.label": "Yummy Heroes",
  "tools.yummydona.label": "Yummy — Donaciones",
  "tools.yummyheroes.sub": "Viajes gratis para personal de emergencias",
  "tools.yummydona.sub": "Portal de donaciones (Pago Móvil, tarjeta, ACH)",
  "tools.interpaid.label": "Interpreter Aid",
  "tools.interpaid.sub": "Intérpretes voluntarios: regístrate para conectar equipos y víctimas",
  "tools.vzlayuda.label": "VZLA Ayuda",
  "tools.vzlayuda.sub": "Conecta necesidades con quien ayuda — pide u ofrece, sin cuenta",
  "tools.escuchactiva.label": "Escucha Activa",
  "tools.escuchactiva.sub": "Apoyo emocional gratuito de psicólogos voluntarios",
  "tools.medicosvzla.label": "Médicos por Venezuela",
  "tools.medicosvzla.sub": "Teleconsultas médicas gratuitas con médicos venezolanos",
  "tools.acopios.label": "Acopios y Refugios",
  "tools.acopios.sub": "Mapa comunitario de centros de acopio y refugios · por estado",
  "tools.directorio.label": "Directorio Sismo",
  "tools.directorio.sub": "Directorio verificado de herramientas de ayuda · todas las categorías",
  "tools.cvc.label": "CVC Emergencia",
  "tools.cvc.sub": "Registro de maquinaria: ofrece equipos, voluntariado o pide ayuda",
  "tools.fisio.label": "Fisioterapeutas Voluntarios",
  "tools.fisio.sub": "Directorio nacional de fisioterapeutas voluntarios",
  "tools.aje.label": "AJE Ayuda Venezuela",
  "tools.aje.sub": "Plataforma oficial de AJE · acopios, organizaciones y canales verificados",
  "tools.airbnb.label": "Airbnb.org",
  "tools.airbnb.sub": "Alojamiento de emergencia gratuito para afectados, vía socios sin fines de lucro",
  "tools.acopioven.label": "Centros de Acopio VEN",
  "tools.acopioven.sub": "Mapa de acopio · conecta suministros, necesidades y excedentes entre centros",
  "tools.huellas.label": "Huellas a Salvo",
  "tools.huellas.sub": "Reporta mascotas perdidas, ubica ayuda veterinaria y centros de acopio",
  "tools.patitas.label": "Patitas a Salvo",
  "tools.patitas.sub": "Alertas de mascotas perdidas y encontradas · refugios, insumos y donaciones",
  "tools.stakeholders.label": "Mapa de organizaciones de ayuda",
  "tools.stakeholders.sub": "",

  // Directorio de Recursos — en construcción (aún sin entradas verificadas)
  "resources.soon.kicker": "En construcción",
  "resources.soon.title": "El Directorio de Recursos está en construcción",
  "resources.soon.body":
    "Estamos seleccionando y verificando organizaciones y servicios de ayuda antes de publicarlos aquí. Cada entrada se revisa antes de hacerse pública, así que el directorio se abrirá una vez verificadas las primeras entradas. Mientras tanto, usa el feed de noticias en vivo y los enlaces de abajo.",
  "resources.soon.backHome": "Volver al centro de comando",

  // Mapa de actores (/stakeholders) — índice de organizaciones de ayuda
  "stake.kicker": "Referencia de respuesta",
  "stake.title": "Quién está respondiendo",
  "stake.lede":
    "Un mapa de referencia de {n} organizaciones que participan en la respuesta al terremoto de Venezuela de 2026, agrupadas por función: coordinación, salud, alimentos y refugio, niñez, búsqueda y rescate, y más.",
  "stake.disclaimer":
    "Solo informativo. Esta es una referencia de investigación, no un respaldo. Aparecer aquí no equivale a verificación: confirma cada organización de forma independiente antes de confiar en ella o donar. El estado, los enlaces y las cifras cambian a medida que evoluciona la respuesta.",
  "stake.disclaimer.short":
    "Referencia informativa: aparecer aquí no equivale a verificación. Confirma cada organización antes de confiar en ella o donar.",
  "stake.legend.title": "Leyenda de estado",
  "stake.legend.hub": "Citada en este Hub",
  "stake.legend.cand": "Parece verificada, aún sin curar",
  "stake.legend.verify": "Mencionada en prensa; confirmar primero",
  "stake.status.hub": "En el Hub",
  "stake.status.cand": "Candidata",
  "stake.status.verify": "Verificar",
  "stake.count.one": "{n} organización",
  "stake.count.many": "{n} organizaciones",
  "stake.open": "Abrir sitio",
  "stake.sources":
    "Compilado de fuentes públicas (junio de 2026), incluyendo AP, Reuters, IFRC, OPS/OMS, IRC, World Central Kitchen, Direct Relief y guías de donación. Las cifras de víctimas y magnitud varían según la fuente y la fecha.",
  "stake.back": "Volver al centro de comando",

  "relief.title": "Acopios y Refugios",
  "relief.source": "acopios-refugios.vercel.app",
  "relief.attribution": "Reportado por la comunidad · vía acopios-refugios.vercel.app — reporta un punto",
  "relief.unavailable": "Los datos de puntos de ayuda en vivo no están disponibles temporalmente.",
  "relief.empty": "No hay puntos de ayuda disponibles en este momento.",
  "relief.mapHint": "Acopios y refugios · fuente comunitaria",
  "relief.filter.all": "Todos",
  "relief.filter.acopio": "Acopios",
  "relief.filter.refugio": "Refugios",
  "relief.filter.aria": "Filtrar puntos de ayuda por tipo",
  "relief.type.acopio": "Centro de acopio",
  "relief.type.refugio": "Refugio",
  "relief.unverified": "Sin verificar",
  "subsystem.relief": "Acopios y refugios",

  "donate.verified": "Canal verificado",
  "donate.recipient": "GiveDirectly — Terremotos de Venezuela",
  "donate.affiliation": "ONG estadounidense de transferencias de efectivo · 501(c)(3) · deducible de impuestos",
  "donate.description":
    "Envía ayuda en efectivo directamente a los sobrevivientes del terremoto — unos $340 por persona, cerca de tres meses de necesidades básicas para una familia de cuatro — y cada quien decide cómo usarlo. Las comunidades de mayor necesidad se identifican con datos de daños y pobreza. Cada $1 en efectivo se multiplica a unos $2.60 de actividad económica local (Egger et al., Econometrica 2022).",
  "donate.amountsLabel": "Montos de donación sugeridos",
  "donate.cta": "Donar con GiveDirectly",
  "donate.openOfficial": "Abrir sitio oficial",
  "donate.frameTitle": "Formulario de donación de GiveDirectly",
  "donate.fallback":
    "No se pudo incrustar el formulario de donación aquí. Usa el botón de abajo para donar en el sitio oficial de GiveDirectly.",
  "donate.note": "Completarás tu donación de forma segura en el sitio oficial de GiveDirectly. El Centro nunca gestiona tu pago. Las donaciones en EE. UU. son deducibles de impuestos.",
  "donate.clicks.label": "enlaces de donación pulsados",

  "footer.managedBy": "Gestionado de forma independiente —",
  "footer.contact": "contactar al curador del sitio",

  "landing.kicker": "Coordinación oficial de ayuda",
  "landing.title": "Ayuda verificada para el terremoto de Venezuela 2026",
  "landing.lede":
    "Un punto de coordinación con noticias verificadas, canales de donación validados y recursos de ayuda. Cada elemento se revisa antes de publicarse.",
  "landing.lastUpdated": "Contenido actualizado por última vez",
  "landing.cards.heading": "¿A dónde quieres ir?",
  "landing.status.available": "Disponible",
  "landing.status.unavailable": "No disponible temporalmente",
  "landing.peopleFinder.title": "¿Buscas a alguien?",
  "landing.peopleFinder.body":
    "El Buscador de Personas es un sistema independiente y establecido para reportar y buscar personas desaparecidas o desplazadas. Se abre en una pestaña nueva.",

  "card.latest.title": "Últimas noticias",
  "card.latest.body": "Actualizaciones verificadas sobre la situación y la respuesta, las más recientes primero.",
  "card.donate.title": "Donar",
  "card.donate.body":
    "Dona a través de canales verificados. Te enlazamos a la página de donación oficial de cada organización.",
  "card.resources.title": "Directorio de recursos",
  "card.resources.body": "Organizaciones y servicios de ayuda validados que puedes buscar y filtrar.",
  "card.cta": "Abrir",

  "news.title": "Últimas noticias",
  "news.intro": "Actualizaciones verificadas, las más recientes primero.",
  "news.empty": "No hay noticias verificadas disponibles en este momento.",
  "news.unavailable": "Las noticias no están disponibles temporalmente. Inténtalo de nuevo en breve.",
  "news.source": "Fuente",
  "news.openSource": "Abrir fuente",
  "news.sourceUnavailable": "Fuente no disponible: este elemento no tiene un enlace de fuente válido.",
  "news.published": "Publicado",

  "donations.title": "Dona a fondos de ayuda verificados",
  "donations.intro":
    "Cada canal enlaza a la página de donación oficial de la organización receptora. El Centro nunca recauda, procesa ni retiene tu donación.",
  "donations.notice":
    "Antes de donar, confirma los datos en el sitio oficial de la organización receptora. El Centro enlaza a ese sitio y no procesa pagos.",
  "donations.empty": "No hay canales de donación verificados disponibles en este momento.",
  "donations.unavailable":
    "La información de donaciones no está disponible temporalmente. Inténtalo de nuevo en breve.",
  "donations.give": "Donar en el sitio oficial",
  "donations.affiliation": "Afiliación",

  "resources.title": "Directorio de recursos",
  "resources.intro": "Organizaciones y servicios de ayuda validados. Busca o filtra por categoría.",
  "resources.search.label": "Buscar recursos",
  "resources.search.placeholder": "Busca por nombre o descripción",
  "resources.search.submit": "Buscar",
  "resources.search.clear": "Limpiar",
  "resources.filter.label": "Categoría",
  "resources.filter.all": "Todas las categorías",
  "resources.empty": "Ningún recurso coincide con tu búsqueda. Prueba otra palabra clave o categoría.",
  "resources.unavailable":
    "El directorio de recursos no está disponible temporalmente. Inténtalo de nuevo en breve.",
  "resources.category": "Categoría",
  "resources.keyword.empty": "Escribe una palabra clave para buscar (1–100 caracteres).",
  "resources.keyword.tooLong": "La palabra clave es demasiado larga. Usa 100 caracteres o menos.",
  "resources.resultCount": "recursos",

  "ext.opensNewTab": "se abre en una pestaña nueva",
  "ext.unverifiedSource": "Fuente no verificada",
  "ext.leavingHub": "Sale del Centro",
  "trust.statement":
    "El contenido de este Centro lo revisa el equipo editorial del Centro antes de publicarse. La verificación comprueba la fuente, la legitimidad de la organización receptora y que los enlaces lleven a sitios oficiales. Solo aparecen aquí los elementos verificados.",
  "trust.verified": "Verificado",
  "lang.indicator.en": "En inglés",
  "lang.indicator.es": "En español",

  "loading.label": "Cargando…",
  "loading.slow": "Esto está tardando más de lo habitual. Aún cargando…",
  "error.navTitle": "No se pudo abrir esta página",
  "error.navBody": "El subsistema no está disponible ahora. Sigues en la página anterior.",
  "degraded.notice.one": "El siguiente servicio no está disponible temporalmente:",
  "degraded.notice.many": "Los siguientes servicios no están disponibles temporalmente:",
  "subsystem.news": "Últimas noticias",
  "subsystem.donations": "Donaciones",
  "subsystem.resources": "Directorio de recursos",

  "footer.note":
    "Este Centro enlaza a organizaciones de ayuda y al Buscador de Personas; no recauda donaciones ni almacena registros del Buscador de Personas.",
  "footer.notAffiliated": "Un Centro independiente de coordinación de ayuda.",
};

export const catalog: Record<Locale, Record<MessageId, string>> = { en, es };
