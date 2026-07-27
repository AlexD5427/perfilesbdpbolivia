/**
 * Escenas procedurales.
 *
 * La referencia se apoya en renders arquitectonicos a toda pagina. Aqui no
 * se usan fotografias por tres razones concretas:
 *
 *   1. No hay banco de imagenes propio del BDP en el repositorio, y traer
 *      fotos de terceros a un portal institucional es un problema legal
 *      antes que estetico.
 *   2. La Politica de Seguridad de Contenido restringe los origenes; los
 *      marcadores de posicion externos se bloquearian en produccion.
 *   3. Un degradado compuesto pesa unos cientos de bytes frente a los
 *      cientos de kilobytes de un render, y nunca aparece roto.
 *
 * Cada escena es una composicion de capas: cielo, atmosfera, relieve y
 * grano. Al sustituirlas por fotografia real basta con reemplazar el cuerpo
 * de este componente; ninguna seccion conoce su implementacion.
 */

export type SceneKind =
  | 'altiplano'
  | 'ciudad'
  | 'taller'
  | 'valle'
  | 'textil'
  | 'amanecer'
  | 'noche';

type Props = {
  kind: SceneKind;
  className?: string;
  /** Descripcion para lectores de pantalla. Omitir solo si es decorativa. */
  alt?: string;
};

const PALETTES: Record<SceneKind, { sky: string[]; land: string; haze: string }> = {
  altiplano: {
    sky: ['#0b3f70', '#1d6ea3', '#68b6d4', '#cfe4ee'],
    land: '#123246',
    haze: 'rgba(207, 228, 238, 0.34)',
  },
  ciudad: {
    sky: ['#04121f', '#0a2a44', '#134b6e', '#2c7fa6'],
    land: '#061a2b',
    haze: 'rgba(0, 176, 216, 0.2)',
  },
  taller: {
    sky: ['#2b1408', '#5c3216', '#a8672c', '#e0a458'],
    land: '#1d0f06',
    haze: 'rgba(224, 164, 88, 0.26)',
  },
  valle: {
    sky: ['#0d3b2e', '#1a6b4d', '#4aa578', '#b8ddc4'],
    land: '#0a2a20',
    haze: 'rgba(184, 221, 196, 0.3)',
  },
  textil: {
    sky: ['#2b0d28', '#5c1a3f', '#a03259', '#e08aa0'],
    land: '#1b0d28',
    haze: 'rgba(224, 138, 160, 0.24)',
  },
  amanecer: {
    sky: ['#1b1030', '#5c2a4a', '#c86a5c', '#f0b78a'],
    land: '#160c22',
    haze: 'rgba(240, 183, 138, 0.3)',
  },
  noche: {
    sky: ['#010509', '#04121f', '#072a45', '#0d4a6b'],
    land: '#02080e',
    haze: 'rgba(13, 74, 107, 0.4)',
  },
};

/**
 * Perfiles de relieve.
 *
 * Cada cadena es la parte variable de un path sobre un lienzo de 1200x400.
 * Estan dibujados a mano para que las siluetas se lean como cordillera,
 * altiplano o skyline y no como ruido aleatorio.
 */
const RIDGES: Record<SceneKind, string> = {
  altiplano:
    'M0,260 L90,215 L170,248 L260,180 L340,232 L430,168 L520,222 L610,150 L700,210 L790,175 L880,235 L970,190 L1060,240 L1140,205 L1200,238',
  ciudad:
    'M0,300 L60,300 L60,240 L110,240 L110,285 L170,285 L170,205 L215,205 L215,270 L280,270 L280,180 L330,180 L330,255 L400,255 L400,225 L460,225 L460,290 L530,290 L530,195 L585,195 L585,262 L650,262 L650,230 L720,230 L720,285 L790,285 L790,210 L845,210 L845,268 L910,268 L910,240 L980,240 L980,292 L1050,292 L1050,222 L1110,222 L1110,275 L1200,275',
  taller:
    'M0,285 L120,285 L160,235 L200,285 L320,285 L360,235 L400,285 L520,285 L560,235 L600,285 L720,285 L760,235 L800,285 L920,285 L960,235 L1000,285 L1120,285 L1160,235 L1200,285',
  valle: 'M0,290 Q150,225 300,272 T600,250 T900,278 T1200,244',
  textil:
    'M0,270 L75,225 L150,270 L225,225 L300,270 L375,225 L450,270 L525,225 L600,270 L675,225 L750,270 L825,225 L900,270 L975,225 L1050,270 L1125,225 L1200,270',
  amanecer:
    'M0,275 L110,205 L200,255 L300,175 L400,240 L500,190 L610,250 L710,200 L820,258 L920,215 L1030,262 L1120,222 L1200,250',
  noche:
    'M0,265 L100,222 L190,252 L290,186 L380,238 L480,174 L580,228 L680,160 L780,215 L880,182 L980,240 L1080,198 L1200,242',
};

const NOISE_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function Scene({ kind, className, alt }: Props) {
  const p = PALETTES[kind];
  const ridge = RIDGES[kind];

  return (
    <div
      className={['scene', className].filter(Boolean).join(' ')}
      role={alt ? 'img' : 'presentation'}
      aria-label={alt}
      aria-hidden={alt ? undefined : true}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: `linear-gradient(176deg, ${p.sky[0]} 0%, ${p.sky[1]} 34%, ${p.sky[2]} 66%, ${p.sky[3]} 100%)`,
      }}
    >
      {/* Halo atmosferico: separa el cielo del relieve y evita el aspecto plano */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 70% 44% at 62% 74%, ${p.haze}, transparent 72%)`,
        }}
      />

      {/* Relieve en dos planos, el trasero mas claro: profundidad aerea */}
      <svg
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        aria-hidden="true"
      >
        <path
          d={`${ridge} L1200,400 L0,400 Z`}
          fill={p.land}
          opacity="0.34"
          transform="translate(0,-34)"
        />
        <path d={`${ridge} L1200,400 L0,400 Z`} fill={p.land} opacity="0.9" />
      </svg>

      {/* Velo inferior para que el texto sobreimpreso siempre tenga contraste */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(0deg, rgba(2,8,15,0.62) 0%, transparent 52%)',
        }}
      />

      {/* Grano fino: rompe el bandeado de los degradados en pantallas grandes */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          mixBlendMode: 'overlay',
          backgroundImage: NOISE_URL,
        }}
      />
    </div>
  );
}

export default Scene;
