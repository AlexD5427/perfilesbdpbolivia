/**
 * Red de agencias.
 *
 * Las coordenadas son porcentajes sobre el mapa esquemático de Bolivia que
 * dibuja `BranchMap`, no latitud y longitud. Se eligió un mapa vectorial
 * propio en lugar de un proveedor de mapas por dos motivos: la Política de
 * Seguridad de Contenido bloquea orígenes externos, y un mapa interactivo
 * de terceros añadiría cientos de kilobytes para mostrar nueve puntos.
 */
export type Branch = {
  id: string;
  city: string;
  department: string;
  address: string;
  /** Posición en el mapa esquemático, en porcentaje. */
  x: number;
  y: number;
  /** Verdadero si concentra funciones de casa matriz. */
  hq?: boolean;
};

export const branches: Branch[] = [
  { id: 'lpz', city: 'La Paz', department: 'La Paz', address: 'Av. Arce esq. Campos', x: 26, y: 34, hq: true },
  { id: 'elalto', city: 'El Alto', department: 'La Paz', address: 'Av. 6 de Marzo', x: 23, y: 30 },
  { id: 'cbba', city: 'Cochabamba', department: 'Cochabamba', address: 'Av. Ballivián', x: 42, y: 47 },
  { id: 'scz', city: 'Santa Cruz', department: 'Santa Cruz', address: 'Av. San Martín', x: 66, y: 52 },
  { id: 'suc', city: 'Sucre', department: 'Chuquisaca', address: 'Calle España', x: 49, y: 62 },
  { id: 'pot', city: 'Potosí', department: 'Potosí', address: 'Av. Camacho', x: 38, y: 68 },
  { id: 'orr', city: 'Oruro', department: 'Oruro', address: 'Calle Bolívar', x: 31, y: 52 },
  { id: 'tja', city: 'Tarija', department: 'Tarija', address: 'Av. La Paz', x: 51, y: 82 },
  { id: 'tdd', city: 'Trinidad', department: 'Beni', address: 'Av. 6 de Agosto', x: 58, y: 30 },
  { id: 'cob', city: 'Cobija', department: 'Pando', address: 'Av. Internacional', x: 34, y: 10 },
];
