/**
 * Conjunto de iconos.
 *
 * Trazo de 1,6 sobre una reticula de 24, esquinas redondeadas y sin
 * rellenos: la misma tension de linea que el resto del sistema. Se dibujan
 * a mano en lugar de traer una libreria porque son treinta glifos y
 * cualquier paquete pesaria mas que el archivo entero.
 */

export type IconName =
  | 'search'
  | 'close'
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up'
  | 'chevron-down'
  | 'bookmark'
  | 'bookmark-filled'
  | 'compare'
  | 'bell'
  | 'share'
  | 'copy'
  | 'check'
  | 'accessibility'
  | 'speaker'
  | 'play'
  | 'pause'
  | 'stop'
  | 'globe'
  | 'user'
  | 'file'
  | 'clipboard'
  | 'calendar'
  | 'sparkles'
  | 'settings'
  | 'layers'
  | 'book'
  | 'info'
  | 'alert'
  | 'command'
  | 'focus'
  | 'download'
  | 'pin';

const PATHS: Record<IconName, string> = {
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-4-4',
  close: 'M6 6l12 12M18 6L6 18',
  'arrow-right': 'M4 12h16M14 6l6 6-6 6',
  'arrow-left': 'M20 12H4M10 18l-6-6 6-6',
  'arrow-up': 'M12 20V4M6 10l6-6 6 6',
  'chevron-down': 'M6 9l6 6 6-6',
  bookmark: 'M6 4h12v16l-6-4.5L6 20V4Z',
  'bookmark-filled': 'M6 4h12v16l-6-4.5L6 20V4Z',
  compare: 'M9 4v16M15 4v16M4 8h5M15 8h5M4 16h5M15 16h5',
  bell: 'M18 15v-4a6 6 0 0 0-12 0v4l-2 3h16l-2-3ZM10 21h4',
  share: 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  copy: 'M9 9h10v10a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1V9ZM5 15V5a1 1 0 0 1 1-1h9',
  check: 'M5 13l4 4L19 7',
  accessibility: 'M12 4.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM4 9h16M12 9v6M12 15l-3 5M12 15l3 5',
  speaker: 'M4 9h4l5-4v14l-5-4H4V9ZM17 9a4 4 0 0 1 0 6M19.5 6.5a8 8 0 0 1 0 11',
  play: 'M7 4l12 8-12 8V4Z',
  pause: 'M9 5v14M15 5v14',
  stop: 'M6 6h12v12H6z',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z',
  user: 'M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM4 21a8 8 0 0 1 16 0',
  file: 'M7 3h7l5 5v13H7V3ZM14 3v5h5',
  clipboard: 'M9 4h6v3H9V4ZM7 5H5v16h14V5h-2M9 12h6M9 16h4',
  calendar: 'M5 6h14v14H5V6ZM8 3v4M16 3v4M5 11h14',
  sparkles: 'M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6L12 4ZM18.5 16l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z',
  settings: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM4 12h2M18 12h2M12 4v2M12 18v2M6.5 6.5l1.5 1.5M16 16l1.5 1.5M17.5 6.5L16 8M8 16l-1.5 1.5',
  layers: 'M12 3l9 5-9 5-9-5 9-5ZM3 13l9 5 9-5M3 17l9 5 9-5',
  book: 'M4 5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-2V5ZM19 17H6a2 2 0 0 0-2 2',
  info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 11v5M12 8h.01',
  alert: 'M12 3l9 17H3l9-17ZM12 10v4M12 17h.01',
  command: 'M8 5a2 2 0 1 0 0 4h8a2 2 0 1 0 0-4v14a2 2 0 1 0 0-4H8a2 2 0 1 0 0 4V5Z',
  focus: 'M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M9 12h6',
  download: 'M12 4v11M7 11l5 5 5-5M4 20h16',
  pin: 'M12 3a6 6 0 0 1 6 6c0 4.2-6 12-6 12S6 13.2 6 9a6 6 0 0 1 6-6ZM12 7.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z',
};

/** Iconos que se leen mejor macizos que en trazo. */
const FILLED: IconName[] = ['bookmark-filled', 'play', 'stop'];

export function Icon({
  name,
  className,
  size = 20,
}: {
  name: IconName;
  className?: string;
  size?: number;
}) {
  const filled = FILLED.includes(name);
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

export default Icon;
