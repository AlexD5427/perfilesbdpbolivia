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
};

export const jobs: Job[] = [
  { id: 'oficial-creditos', reference: 'BDP-OC-2026-01', title: 'Oficial de Créditos', area: 'Negocios y crédito', city: 'La Paz', modality: 'Presencial', contract: 'Plazo fijo', experience: 'Intermedio', publishedAt: '2026-07-20', closesAt: '2026-08-15', summary: 'Acompaña a emprendedores y unidades productivas con soluciones financieras responsables.', mission: 'Gestionar una cartera de crédito con enfoque de desarrollo productivo, calidad de servicio y cumplimiento normativo.', responsibilities: ['Analizar solicitudes y capacidad de pago.', 'Acompañar visitas y seguimiento de cartera.', 'Explicar condiciones de forma clara y transparente.', 'Coordinar con áreas internas para resolver solicitudes.'], requirements: ['Formación en Economía, Administración, Contaduría o afines.', 'Experiencia en análisis crediticio o atención financiera.', 'Disponibilidad para trabajo de campo en La Paz.', 'Manejo de herramientas ofimáticas.'], benefits: ['Aprendizaje en banca de desarrollo.', 'Ambiente colaborativo.', 'Programa de bienestar y formación continua.'] },
  { id: 'jefe-agencia', reference: 'BDP-JA-2026-02', title: 'Jefe de Agencia', area: 'Gestión comercial', city: 'El Alto', modality: 'Presencial', contract: 'Indefinido', experience: 'Avanzado', publishedAt: '2026-07-18', closesAt: '2026-08-10', summary: 'Lidera una agencia orientada a la inclusión financiera y al desarrollo de nuestros clientes.', mission: 'Asegurar una operación sólida, cercana y responsable, cuidando la experiencia del cliente y el cumplimiento de controles.', responsibilities: ['Liderar al equipo de la agencia.', 'Supervisar la atención y la operación diaria.', 'Impulsar relaciones con el sector productivo.', 'Gestionar indicadores de servicio y riesgo.'], requirements: ['Licenciatura en áreas económicas o administrativas.', 'Experiencia liderando equipos en servicios financieros.', 'Conocimiento de normativa y control operativo.', 'Comunicación clara y liderazgo situacional.'], benefits: ['Desarrollo profesional.', 'Formación especializada.', 'Beneficios de ley.'] },
  { id: 'analista-riesgos', reference: 'BDP-AR-2026-03', title: 'Analista de Riesgos', area: 'Riesgos', city: 'La Paz', modality: 'Híbrida', contract: 'Indefinido', experience: 'Intermedio', publishedAt: '2026-07-16', closesAt: '2026-08-05', summary: 'Convierte información en decisiones de riesgo consistentes y comprensibles.', mission: 'Apoyar la identificación, medición y seguimiento de riesgos con criterio técnico y visión de negocio.', responsibilities: ['Preparar análisis y reportes de riesgo.', 'Revisar información y detectar desviaciones.', 'Documentar criterios y recomendaciones.', 'Coordinar con equipos de negocio y control.'], requirements: ['Formación en Estadística, Economía, Ingeniería o afines.', 'Experiencia con análisis de datos.', 'Pensamiento crítico y atención al detalle.', 'Excel avanzado; herramientas analíticas son un plus.'], benefits: ['Trabajo híbrido según política.', 'Acceso a capacitación.', 'Cultura de mejora continua.'] },
  { id: 'cajero-bancario', reference: 'BDP-CB-2026-04', title: 'Cajero Bancario', area: 'Operaciones', city: 'La Paz', modality: 'Presencial', contract: 'Plazo fijo', experience: 'Inicial', publishedAt: '2026-07-14', closesAt: '2026-08-01', summary: 'Brinda una atención segura, ágil y humana en cada transacción.', mission: 'Realizar operaciones de caja con precisión, integridad y orientación a las personas.', responsibilities: ['Atender operaciones de caja.', 'Verificar documentación y controles.', 'Orientar sobre productos y canales.', 'Mantener orden y confidencialidad.'], requirements: ['Formación técnica o universitaria en áreas comerciales.', 'Experiencia en atención al cliente.', 'Disponibilidad para horarios de agencia.', 'Responsabilidad y precisión numérica.'], benefits: ['Formación inicial.', 'Acompañamiento del equipo.', 'Beneficios de ley.'] },
  { id: 'asistente-operaciones', reference: 'BDP-AO-2026-05', title: 'Asistente de Operaciones', area: 'Operaciones', city: 'La Paz', modality: 'Híbrida', contract: 'Plazo fijo', experience: 'Inicial', publishedAt: '2026-07-12', closesAt: '2026-07-30', summary: 'Ayuda a que los procesos internos sean ordenados, trazables y oportunos.', mission: 'Apoyar la gestión documental y operativa con foco en calidad y continuidad.', responsibilities: ['Registrar y organizar documentación.', 'Dar seguimiento a solicitudes internas.', 'Preparar reportes operativos.', 'Apoyar la mejora de procesos.'], requirements: ['Formación en Administración o áreas afines.', 'Organización y atención al detalle.', 'Manejo de herramientas digitales.', 'Buena comunicación escrita.'], benefits: ['Mentoría y aprendizaje.', 'Ambiente de colaboración.', 'Plan de formación.'] }
];

export const getJob = (id: string) => jobs.find((job) => job.id === id);
