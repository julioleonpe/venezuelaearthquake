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

  // Primary navigation (exactly three items + Other menu)
  "nav.latest": "Latest",
  "nav.donate": "Donate",
  "nav.other": "Other",
  "nav.other.aria": "Other relief tools",
  "nav.resources": "Resource Directory",
  "nav.peopleFinder": "People Finder",
  "nav.damageMap": "Mapa de Daño",
  "nav.damageMap.sub": "Community map of reported earthquake damage",
  "nav.home": "Hub home",

  // Command bar
  "cmd.status": "Live · monitoring",

  // Command center (bento home)
  "cc.headline": "2026 Venezuela Earthquake — Information Hub",
  "cc.blurb":
    "Two earthquakes struck western Venezuela, the stronger at magnitude 7.5. This console brings together live seismic monitoring, verified news, vetted donation channels, and tools to find people and resources.",
  "cc.stat.magnitude": "Peak magnitude",
  "cc.stat.quakes": "Earthquakes",
  "cc.stat.hours": "Hours since main shock",
  "cc.stat.states": "States under emergency",
  "cc.tile.news": "News & relevant info",
  "cc.tile.donate": "Donate",
  "cc.viewAll": "View all",
  "cc.people.sub": "Report or search for missing & displaced people",
  "cc.resources.sub": "Search vetted relief organizations & services",

  // Seismic console
  "seismic.title": "Live seismic updates",
  "seismic.source": "USGS feed",
  "seismic.unavailable": "Live seismic data is temporarily unavailable.",
  "seismic.empty": "No recent earthquakes recorded in the region.",
  "seismic.mapHint": "Epicenters · last 30 days",

  // Donate panel (Caritas link-out card)
  "donate.verified": "Verified channel",
  "donate.recipient": "Caritas Australia — Emergency Response Appeal",
  "donate.affiliation": "International aid agency of the Catholic Church",
  "donate.description":
    "Funds food, clean water, shelter, and medical aid for communities affected by the earthquake, through Caritas's emergency response.",
  "donate.amountsLabel": "Suggested donation amounts",
  "donate.whyTitle": "Why Australia?",
  "donate.whyAria": "Why donate through Caritas Australia?",
  "donate.why":
    "Regulatory and banking restrictions make it hard to send funds directly into Venezuela. Caritas Australia is a trusted Caritas member that can receive international donations and route them straight to relief partners working on the ground.",
  "donate.cta": "Donate via Caritas",
  "donate.openOfficial": "Open official site",
  "donate.frameTitle": "Caritas Australia donation form",
  "donate.fallback":
    "The donation form could not be embedded here. Use the button below to donate on Caritas's official site.",
  "donate.note": "You'll complete your gift securely on Caritas's own site. The Hub never handles your payment.",

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

  "nav.latest": "Novedades",
  "nav.donate": "Donar",
  "nav.other": "Más",
  "nav.other.aria": "Otras herramientas de ayuda",
  "nav.resources": "Directorio de recursos",
  "nav.peopleFinder": "Buscador de Personas",
  "nav.damageMap": "Mapa de Daño",
  "nav.damageMap.sub": "Mapa comunitario de daños reportados por el terremoto",
  "nav.home": "Inicio del Centro",

  "cmd.status": "En vivo · monitoreando",

  "cc.headline": "Terremoto de Venezuela 2026 — Centro de Información",
  "cc.blurb":
    "Dos terremotos sacudieron el occidente de Venezuela; el más fuerte de magnitud 7.5. Esta consola reúne monitoreo sísmico en vivo, noticias verificadas, canales de donación validados y herramientas para encontrar personas y recursos.",
  "cc.stat.magnitude": "Magnitud máxima",
  "cc.stat.quakes": "Terremotos",
  "cc.stat.hours": "Horas desde el sismo principal",
  "cc.stat.states": "Estados en emergencia",
  "cc.tile.news": "Noticias e información relevante",
  "cc.tile.donate": "Donar",
  "cc.viewAll": "Ver todo",
  "cc.people.sub": "Reporta o busca personas desaparecidas y desplazadas",
  "cc.resources.sub": "Busca organizaciones y servicios de ayuda validados",

  "seismic.title": "Actualizaciones sísmicas en vivo",
  "seismic.source": "Datos de USGS",
  "seismic.unavailable": "Los datos sísmicos en vivo no están disponibles temporalmente.",
  "seismic.empty": "No se registraron sismos recientes en la región.",
  "seismic.mapHint": "Epicentros · últimos 30 días",

  "donate.verified": "Canal verificado",
  "donate.recipient": "Caritas Australia — Llamado de Respuesta a Emergencias",
  "donate.affiliation": "Agencia internacional de ayuda de la Iglesia Católica",
  "donate.description":
    "Financia alimentos, agua potable, refugio y atención médica para las comunidades afectadas por el terremoto, mediante la respuesta de emergencia de Caritas.",
  "donate.amountsLabel": "Montos de donación sugeridos",
  "donate.whyTitle": "¿Por qué Australia?",
  "donate.whyAria": "¿Por qué donar a través de Caritas Australia?",
  "donate.why":
    "Las restricciones regulatorias y bancarias dificultan enviar fondos directamente a Venezuela. Caritas Australia es un miembro de confianza de Caritas que puede recibir donaciones internacionales y dirigirlas directamente a los socios de ayuda que trabajan sobre el terreno.",
  "donate.cta": "Donar con Caritas",
  "donate.openOfficial": "Abrir sitio oficial",
  "donate.frameTitle": "Formulario de donación de Caritas Australia",
  "donate.fallback":
    "No se pudo incrustar el formulario de donación aquí. Usa el botón de abajo para donar en el sitio oficial de Caritas.",
  "donate.note": "Completarás tu donación de forma segura en el sitio oficial de Caritas. El Centro nunca gestiona tu pago.",

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
