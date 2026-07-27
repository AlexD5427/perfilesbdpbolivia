import type { SceneKind } from '@/components/visual/Scene';

/**
 * Modelo de convocatoria.
 *
 * Los campos originales se mantienen intactos para no romper las vistas que
 * ya los consumen. Los añadidos son opcionales por la misma razón: cuando
 * este archivo se sustituya por la base de datos real, los registros que
 * todavía no tengan competencias o banda salarial seguirán renderizando.
 */
export type Job = {
  id: string;
  reference: string;
  title: string;
  area: string;
  city: string;
  modality: string;
  contract: string;
  experience: string;
  publishedAt: string;
  closesAt: string;
  summary: string;
  mission: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];

  /* -- Añadidos en el rediseño ------------------------------------------- */
  /** Competencias normalizadas. Alimentan el cálculo de compatibilidad. */
  skills?: string[];
  /** Banda referencial mensual en bolivianos. */
  salary?: { min: number; max: number; currency: 'BOB' };
  vacancies?: number;
  /** Escena procedural asociada; da identidad visual a cada convocatoria. */
  scene?: SceneKind;
};

export const jobs: Job[] = [
  {
    id: 'oficial-creditos',
    reference: 'BDP-OC-2026-01',
    title: 'Oficial de Créditos',
    area: 'Negocios y crédito',
    city: 'La Paz',
    modality: 'Presencial',
    contract: 'Plazo fijo',
    experience: 'Intermedio',
    publishedAt: '2026-07-20',
    closesAt: '2026-08-15',
    summary:
      'Acompaña a emprendedores y unidades productivas con soluciones financieras responsables.',
    mission:
      'Gestionar una cartera de crédito con enfoque de desarrollo productivo, calidad de servicio y cumplimiento normativo.',
    responsibilities: [
      'Analizar solicitudes y capacidad de pago.',
      'Acompañar visitas y seguimiento de cartera.',
      'Explicar condiciones de forma clara y transparente.',
      'Coordinar con áreas internas para resolver solicitudes.',
    ],
    requirements: [
      'Formación en Economía, Administración, Contaduría o afines.',
      'Experiencia en análisis crediticio o atención financiera.',
      'Disponibilidad para trabajo de campo en La Paz.',
      'Manejo de herramientas ofimáticas.',
    ],
    benefits: [
      'Aprendizaje en banca de desarrollo.',
      'Ambiente colaborativo.',
      'Programa de bienestar y formación continua.',
    ],
    skills: ['Análisis crediticio', 'Atención al cliente', 'Excel', 'Trabajo de campo', 'Normativa financiera'],
    salary: { min: 6500, max: 9200, currency: 'BOB' },
    vacancies: 3,
    scene: 'altiplano',
  },
  {
    id: 'jefe-agencia',
    reference: 'BDP-JA-2026-02',
    title: 'Jefe de Agencia',
    area: 'Gestión comercial',
    city: 'El Alto',
    modality: 'Presencial',
    contract: 'Indefinido',
    experience: 'Avanzado',
    publishedAt: '2026-07-18',
    closesAt: '2026-08-10',
    summary:
      'Lidera una agencia orientada a la inclusión financiera y al desarrollo de nuestros clientes.',
    mission:
      'Asegurar una operación sólida, cercana y responsable, cuidando la experiencia del cliente y el cumplimiento de controles.',
    responsibilities: [
      'Liderar al equipo de la agencia.',
      'Supervisar la atención y la operación diaria.',
      'Impulsar relaciones con el sector productivo.',
      'Gestionar indicadores de servicio y riesgo.',
    ],
    requirements: [
      'Licenciatura en áreas económicas o administrativas.',
      'Experiencia liderando equipos en servicios financieros.',
      'Conocimiento de normativa y control operativo.',
      'Comunicación clara y liderazgo situacional.',
    ],
    benefits: ['Desarrollo profesional.', 'Formación especializada.', 'Beneficios de ley.'],
    skills: ['Liderazgo', 'Gestión comercial', 'Control operativo', 'Normativa financiera', 'Indicadores'],
    salary: { min: 11000, max: 15500, currency: 'BOB' },
    vacancies: 1,
    scene: 'ciudad',
  },
  {
    id: 'analista-riesgos',
    reference: 'BDP-AR-2026-03',
    title: 'Analista de Riesgos',
    area: 'Riesgos',
    city: 'La Paz',
    modality: 'Híbrida',
    contract: 'Indefinido',
    experience: 'Intermedio',
    publishedAt: '2026-07-16',
    closesAt: '2026-08-05',
    summary: 'Convierte información en decisiones de riesgo consistentes y comprensibles.',
    mission:
      'Apoyar la identificación, medición y seguimiento de riesgos con criterio técnico y visión de negocio.',
    responsibilities: [
      'Preparar análisis y reportes de riesgo.',
      'Revisar información y detectar desviaciones.',
      'Documentar criterios y recomendaciones.',
      'Coordinar con equipos de negocio y control.',
    ],
    requirements: [
      'Formación en Estadística, Economía, Ingeniería o afines.',
      'Experiencia con análisis de datos.',
      'Pensamiento crítico y atención al detalle.',
      'Excel avanzado; herramientas analíticas son un plus.',
    ],
    benefits: ['Trabajo híbrido según política.', 'Acceso a capacitación.', 'Cultura de mejora continua.'],
    skills: ['Análisis de datos', 'Excel', 'Estadística', 'Gestión de riesgos', 'Reportería'],
    salary: { min: 8000, max: 11500, currency: 'BOB' },
    vacancies: 2,
    scene: 'valle',
  },
  {
    id: 'cajero-bancario',
    reference: 'BDP-CB-2026-04',
    title: 'Cajero Bancario',
    area: 'Operaciones',
    city: 'La Paz',
    modality: 'Presencial',
    contract: 'Plazo fijo',
    experience: 'Inicial',
    publishedAt: '2026-07-14',
    closesAt: '2026-08-01',
    summary: 'Brinda una atención segura, ágil y humana en cada transacción.',
    mission: 'Realizar operaciones de caja con precisión, integridad y orientación a las personas.',
    responsibilities: [
      'Atender operaciones de caja.',
      'Verificar documentación y controles.',
      'Orientar sobre productos y canales.',
      'Mantener orden y confidencialidad.',
    ],
    requirements: [
      'Formación técnica o universitaria en áreas comerciales.',
      'Experiencia en atención al cliente.',
      'Disponibilidad para horarios de agencia.',
      'Responsabilidad y precisión numérica.',
    ],
    benefits: ['Formación inicial.', 'Acompañamiento del equipo.', 'Beneficios de ley.'],
    skills: ['Atención al cliente', 'Precisión numérica', 'Control documental', 'Confidencialidad'],
    salary: { min: 4200, max: 5600, currency: 'BOB' },
    vacancies: 4,
    scene: 'taller',
  },
  {
    id: 'asistente-operaciones',
    reference: 'BDP-AO-2026-05',
    title: 'Asistente de Operaciones',
    area: 'Operaciones',
    city: 'La Paz',
    modality: 'Híbrida',
    contract: 'Plazo fijo',
    experience: 'Inicial',
    publishedAt: '2026-07-12',
    closesAt: '2026-07-30',
    summary: 'Ayuda a que los procesos internos sean ordenados, trazables y oportunos.',
    mission: 'Apoyar la gestión documental y operativa con foco en calidad y continuidad.',
    responsibilities: [
      'Registrar y organizar documentación.',
      'Dar seguimiento a solicitudes internas.',
      'Preparar reportes operativos.',
      'Apoyar la mejora de procesos.',
    ],
    requirements: [
      'Formación en Administración o áreas afines.',
      'Organización y atención al detalle.',
      'Manejo de herramientas digitales.',
      'Buena comunicación escrita.',
    ],
    benefits: ['Mentoría y aprendizaje.', 'Ambiente de colaboración.', 'Plan de formación.'],
    skills: ['Gestión documental', 'Organización', 'Herramientas digitales', 'Comunicación escrita'],
    salary: { min: 4500, max: 6000, currency: 'BOB' },
    vacancies: 2,
    scene: 'textil',
  },
  {
    id: 'especialista-agropecuario',
    reference: 'BDP-EA-2026-06',
    title: 'Especialista Agropecuario',
    area: 'Desarrollo productivo',
    city: 'Santa Cruz',
    modality: 'Presencial',
    contract: 'Indefinido',
    experience: 'Avanzado',
    publishedAt: '2026-07-22',
    closesAt: '2026-08-20',
    summary:
      'Evalúa proyectos del sector agropecuario y acompaña a productores en el terreno.',
    mission:
      'Aportar criterio técnico agropecuario a las decisiones de financiamiento y acompañar la ejecución de los proyectos aprobados.',
    responsibilities: [
      'Evaluar la viabilidad técnica de proyectos agropecuarios.',
      'Visitar unidades productivas y verificar avances.',
      'Elaborar informes técnicos de respaldo.',
      'Articular con instituciones del sector.',
    ],
    requirements: [
      'Ingeniería Agronómica, Zootecnia o afines.',
      'Cinco años de experiencia en proyectos productivos.',
      'Disponibilidad para viajes frecuentes al interior.',
      'Licencia de conducir vigente.',
    ],
    benefits: [
      'Contacto directo con el sector productivo.',
      'Viáticos y movilidad cubiertos.',
      'Formación técnica especializada.',
    ],
    skills: ['Proyectos productivos', 'Evaluación técnica', 'Trabajo de campo', 'Informes técnicos', 'Sector agropecuario'],
    salary: { min: 10000, max: 14000, currency: 'BOB' },
    vacancies: 1,
    scene: 'amanecer',
  },
  {
    id: 'analista-tecnologia',
    reference: 'BDP-TI-2026-07',
    title: 'Analista de Tecnología',
    area: 'Tecnología',
    city: 'La Paz',
    modality: 'Híbrida',
    contract: 'Indefinido',
    experience: 'Intermedio',
    publishedAt: '2026-07-24',
    closesAt: '2026-08-18',
    summary: 'Sostiene y mejora los sistemas que hacen posible la operación diaria del banco.',
    mission:
      'Mantener la continuidad de los servicios tecnológicos y acompañar la modernización de las plataformas internas.',
    responsibilities: [
      'Atender incidencias de segundo nivel.',
      'Documentar procedimientos técnicos.',
      'Participar en proyectos de modernización.',
      'Velar por las políticas de seguridad de la información.',
    ],
    requirements: [
      'Ingeniería de Sistemas, Informática o afines.',
      'Experiencia con bases de datos relacionales.',
      'Conocimiento de buenas prácticas de seguridad.',
      'Capacidad de documentar con claridad.',
    ],
    benefits: [
      'Trabajo híbrido según política.',
      'Presupuesto anual de certificaciones.',
      'Participación en proyectos de alto impacto.',
    ],
    skills: ['Bases de datos', 'Seguridad de la información', 'Documentación técnica', 'Soporte', 'Gestión de proyectos'],
    salary: { min: 8500, max: 12500, currency: 'BOB' },
    vacancies: 2,
    scene: 'noche',
  },
];

export const getJob = (id: string) => jobs.find((job) => job.id === id);

/* ==========================================================================
   FACETAS
   Se derivan de los datos en lugar de mantenerse a mano: al añadir una
   convocatoria con un área nueva, el filtro aparece solo.
   ========================================================================== */

function unique(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, 'es'));
}

export const facets = {
  areas: unique(jobs.map((j) => j.area)),
  cities: unique(jobs.map((j) => j.city)),
  modalities: unique(jobs.map((j) => j.modality)),
  contracts: unique(jobs.map((j) => j.contract)),
  experiences: ['Inicial', 'Intermedio', 'Avanzado'],
  skills: unique(jobs.flatMap((j) => j.skills ?? [])),
};

/* ==========================================================================
   FECHAS DE CIERRE
   ========================================================================== */

export type Urgency = 'normal' | 'soon' | 'critical' | 'closed';

/** Días restantes hasta el cierre. Negativo si ya cerró. */
export function daysUntilClose(job: Job, now = new Date()): number {
  const close = new Date(`${job.closesAt}T23:59:59`);
  // Comparamos en días completos para que "cierra hoy" sea siempre exacto,
  // sin depender de la hora a la que se cargue la página.
  const ms = close.getTime() - now.getTime();
  return Math.ceil(ms / 86_400_000);
}

export function urgencyOf(job: Job, now = new Date()): Urgency {
  const days = daysUntilClose(job, now);
  if (days < 0) return 'closed';
  if (days <= 3) return 'critical';
  if (days <= 10) return 'soon';
  return 'normal';
}

export function isOpen(job: Job, now = new Date()): boolean {
  return daysUntilClose(job, now) >= 0;
}

/* ==========================================================================
   COMPATIBILIDAD PERFIL / CONVOCATORIA

   Cálculo local y transparente. No es un modelo entrenado ni pretende serlo:
   es una suma ponderada de señales que la persona puede entender y corregir.
   Se ejecuta en el navegador y nunca sale de él.
   ========================================================================== */

export type MatchInput = {
  skills: string[];
  areas: string[];
  city: string;
  modality: string[];
  years: number;
};

export type MatchResult = {
  score: number;
  reasons: string[];
  gaps: string[];
};

const EXPERIENCE_YEARS: Record<string, [number, number]> = {
  Inicial: [0, 2],
  Intermedio: [2, 6],
  Avanzado: [5, 40],
};

function normalise(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function matchScore(job: Job, input: MatchInput): MatchResult {
  const reasons: string[] = [];
  const gaps: string[] = [];
  let score = 0;

  // Competencias: la señal de mayor peso (50 puntos).
  const jobSkills = (job.skills ?? []).map(normalise);
  const mine = input.skills.map(normalise);
  if (jobSkills.length) {
    const hits = jobSkills.filter((s) => mine.some((m) => m.includes(s) || s.includes(m)));
    score += (hits.length / jobSkills.length) * 50;
    if (hits.length) reasons.push(`${hits.length} de ${jobSkills.length} competencias coinciden`);
    const missing = (job.skills ?? []).filter(
      (s) => !mine.some((m) => normalise(s).includes(m) || m.includes(normalise(s))),
    );
    gaps.push(...missing.slice(0, 3));
  } else {
    // Sin competencias declaradas en la convocatoria no penalizamos: se
    // reparte el peso al resto de señales.
    score += 25;
  }

  // Área de interés (20 puntos).
  if (input.areas.some((a) => normalise(a) === normalise(job.area))) {
    score += 20;
    reasons.push('El área coincide con tus intereses');
  }

  // Ciudad (15 puntos).
  if (input.city && normalise(input.city) === normalise(job.city)) {
    score += 15;
    reasons.push('Está en tu ciudad');
  } else if (input.city) {
    gaps.push(`Ubicada en ${job.city}`);
  }

  // Modalidad (5 puntos).
  if (input.modality.some((m) => normalise(m) === normalise(job.modality))) {
    score += 5;
    reasons.push('La modalidad encaja con tu preferencia');
  }

  // Años de experiencia (10 puntos).
  const band = EXPERIENCE_YEARS[job.experience];
  if (band) {
    const [min, max] = band;
    if (input.years >= min && input.years <= max) {
      score += 10;
      reasons.push('Tu experiencia está en el rango buscado');
    } else if (input.years > max) {
      // Estar por encima no es un defecto, pero tampoco suma del todo.
      score += 6;
    } else {
      gaps.push(`Se piden al menos ${min} años de experiencia`);
    }
  }

  return { score: Math.max(0, Math.min(100, Math.round(score))), reasons, gaps };
}

/** Convocatorias parecidas: misma área primero, luego misma ciudad. */
export function similarJobs(job: Job, limit = 3): Job[] {
  return jobs
    .filter((candidate) => candidate.id !== job.id)
    .map((candidate) => ({
      job: candidate,
      weight:
        (candidate.area === job.area ? 3 : 0) +
        (candidate.city === job.city ? 2 : 0) +
        (candidate.experience === job.experience ? 1 : 0),
    }))
    .filter((entry) => entry.weight > 0)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit)
    .map((entry) => entry.job);
}
