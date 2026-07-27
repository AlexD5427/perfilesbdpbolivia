/**
 * Glosario del proceso de selección.
 *
 * Nace de una observación concreta: la mayor parte de las consultas al
 * equipo de talento no son sobre los cargos, sino sobre el vocabulario del
 * proceso. Publicarlo reduce ansiedad y descarga a la oficina de talento.
 */
export type GlossaryEntry = {
  term: string;
  definition: string;
  tag: 'proceso' | 'documento' | 'banca' | 'evaluacion';
};

export const glossary: GlossaryEntry[] = [
  {
    term: 'Convocatoria',
    definition:
      'Publicación oficial de un cargo vacante con sus requisitos, plazos y condiciones. Cada una tiene un código de referencia propio.',
    tag: 'proceso',
  },
  {
    term: 'Código de referencia',
    definition:
      'Identificador único de la convocatoria, con el formato BDP-XX-AAAA-NN. Consérvalo: es lo que se cita en cualquier comunicación.',
    tag: 'proceso',
  },
  {
    term: 'Banca de desarrollo',
    definition:
      'Entidad financiera pública cuyo objetivo no es maximizar utilidad sino financiar sectores productivos que la banca comercial no atiende en condiciones adecuadas.',
    tag: 'banca',
  },
  {
    term: 'Unidad productiva',
    definition:
      'Cualquier emprendimiento que transforma insumos en bienes o servicios: desde un taller familiar hasta una cooperativa agroindustrial.',
    tag: 'banca',
  },
  {
    term: 'Cartera',
    definition:
      'Conjunto de créditos que gestiona una persona o una agencia. Su calidad se mide por el cumplimiento de pagos.',
    tag: 'banca',
  },
  {
    term: 'Hoja de vida documentada',
    definition:
      'CV acompañado de los respaldos que acreditan lo declarado: títulos, certificados de trabajo y cursos.',
    tag: 'documento',
  },
  {
    term: 'Carta de presentación',
    definition:
      'Texto breve donde explicas por qué te interesa el cargo y qué aportas. No repite el CV: lo interpreta.',
    tag: 'documento',
  },
  {
    term: 'Evaluación técnica',
    definition:
      'Prueba de conocimientos específicos del cargo. Se rinde en línea o presencialmente según la convocatoria.',
    tag: 'evaluacion',
  },
  {
    term: 'Evaluación psicométrica',
    definition:
      'Instrumento estandarizado que explora estilos de trabajo y de relación. No tiene respuestas correctas ni incorrectas.',
    tag: 'evaluacion',
  },
  {
    term: 'Entrevista por competencias',
    definition:
      'Conversación estructurada donde se piden ejemplos concretos de situaciones vividas. Prepara casos reales con resultado medible.',
    tag: 'evaluacion',
  },
  {
    term: 'Modalidad híbrida',
    definition:
      'Combinación de trabajo presencial y remoto según la política vigente del banco y la naturaleza del cargo.',
    tag: 'proceso',
  },
  {
    term: 'Contrato a plazo fijo',
    definition:
      'Vínculo laboral con fecha de finalización determinada, renovable según desempeño y necesidad institucional.',
    tag: 'proceso',
  },
];
