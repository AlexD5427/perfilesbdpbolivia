/**
 * Banco de práctica.
 *
 * Preguntas de entrenamiento, NO las de la evaluación real. Sirven para que
 * la persona reconozca el formato y llegue con menos ansiedad. La distinción
 * se hace explícita en la interfaz: prometer que esto "es" la evaluación
 * sería deshonesto y contraproducente.
 */
export type PracticeQuestion = {
  id: string;
  category: 'razonamiento' | 'financiero' | 'situacional' | 'normativa';
  prompt: string;
  options: string[];
  /** Índice de la opción correcta. */
  answer: number;
  explanation: string;
};

export const practiceBank: PracticeQuestion[] = [
  {
    id: 'p1',
    category: 'financiero',
    prompt:
      'Una unidad productiva declara ingresos mensuales de Bs 18.000 y gastos operativos de Bs 12.500. ¿Cuál es su capacidad de pago mensual aproximada si la política interna permite comprometer hasta el 40% del excedente?',
    options: ['Bs 1.100', 'Bs 2.200', 'Bs 5.500', 'Bs 7.200'],
    answer: 1,
    explanation:
      'El excedente es 18.000 − 12.500 = Bs 5.500. El 40% de ese excedente son Bs 2.200.',
  },
  {
    id: 'p2',
    category: 'razonamiento',
    prompt:
      'En una serie, cada término se obtiene sumando al anterior el doble de la posición que ocupa. Si el primer término es 3, ¿cuál es el cuarto?',
    options: ['11', '15', '17', '21'],
    answer: 2,
    explanation: 'La serie avanza 3 → 3+4=7 → 7+6=13 → 13+... revisando: 3, 7, 13, 17 con incrementos 4, 6, 8. El cuarto término es 17.',
  },
  {
    id: 'p3',
    category: 'situacional',
    prompt:
      'Un cliente insiste en que le expliques por tercera vez las condiciones del crédito y el resto de la fila empieza a impacientarse. ¿Qué haces?',
    options: [
      'Le pides que lea el contrato en casa y atiendes al siguiente.',
      'Repites la explicación de forma resumida y le ofreces una cita para revisarla con calma.',
      'Le entregas un folleto y das por cerrada la consulta.',
      'Llamas a tu supervisor para que se haga cargo.',
    ],
    answer: 1,
    explanation:
      'Se atiende la necesidad real de comprensión sin desatender a las demás personas. Derivar sin resolver o cortar la consulta contradicen el principio de transparencia.',
  },
  {
    id: 'p4',
    category: 'normativa',
    prompt: '¿Cuál es el propósito principal de un banco de desarrollo productivo?',
    options: [
      'Maximizar la utilidad para sus accionistas.',
      'Financiar sectores productivos con condiciones que la banca comercial no ofrece.',
      'Captar el mayor volumen posible de depósitos del público.',
      'Operar exclusivamente en el mercado de valores.',
    ],
    answer: 1,
    explanation:
      'La banca de desarrollo existe justamente para cubrir las fallas de mercado que deja la banca comercial en sectores estratégicos.',
  },
  {
    id: 'p5',
    category: 'financiero',
    prompt:
      'Si una cartera de Bs 2.400.000 registra Bs 96.000 en mora, ¿cuál es el índice de morosidad?',
    options: ['2,0%', '3,2%', '4,0%', '4,8%'],
    answer: 2,
    explanation: '96.000 dividido entre 2.400.000 es 0,04, es decir 4,0%.',
  },
  {
    id: 'p6',
    category: 'situacional',
    prompt:
      'Detectas una inconsistencia menor en la documentación de un colega que ya fue aprobada. ¿Cuál es la conducta esperada?',
    options: [
      'Ignorarla porque ya pasó el control.',
      'Corregirla tú sin avisar para no exponer a nadie.',
      'Informarla por el canal interno correspondiente y dejar registro.',
      'Comentarlo informalmente con el equipo.',
    ],
    answer: 2,
    explanation:
      'La trazabilidad es un principio de control interno: toda observación se canaliza formalmente y queda documentada.',
  },
  {
    id: 'p7',
    category: 'razonamiento',
    prompt:
      'Todos los proyectos aprobados pasaron por evaluación técnica. Algunos proyectos evaluados técnicamente fueron rechazados. ¿Qué se concluye necesariamente?',
    options: [
      'Todos los proyectos evaluados fueron aprobados.',
      'Ningún proyecto rechazado pasó por evaluación técnica.',
      'Pasar la evaluación técnica no garantiza la aprobación.',
      'Los proyectos rechazados no fueron evaluados.',
    ],
    answer: 2,
    explanation:
      'La evaluación técnica es condición necesaria pero no suficiente: hay evaluados que igualmente se rechazaron.',
  },
  {
    id: 'p8',
    category: 'normativa',
    prompt:
      '¿Qué principio exige informar al cliente el costo total del crédito antes de su firma?',
    options: ['Confidencialidad', 'Transparencia', 'Reciprocidad', 'Subsidiariedad'],
    answer: 1,
    explanation:
      'La transparencia obliga a que la persona conozca de forma clara y completa las condiciones antes de comprometerse.',
  },
];

/** Baraja estable: mismo orden dentro de una sesión, distinto entre sesiones. */
export function pickQuestions(count: number, seed = Date.now()): PracticeQuestion[] {
  const pool = [...practiceBank];
  let state = seed;
  // Generador congruencial lineal: determinista y suficiente para barajar.
  const rand = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}
