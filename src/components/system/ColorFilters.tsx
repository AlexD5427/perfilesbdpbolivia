/**
 * Matrices de simulación de dicromacia.
 *
 * Los coeficientes provienen del modelo de Machado, Oliveira y Fernandes
 * (2009), que es el estándar de facto para simular deficiencias de visión
 * cromática en pantalla. Se renderizan una sola vez, ocultas, y el CSS las
 * referencia por id cuando el usuario elige un modo en el panel de
 * accesibilidad.
 *
 * Importante: sirven para que una persona con visión tricromática compruebe
 * cómo se ve la interfaz. Para quien tiene la deficiencia, la opción útil es
 * "Realzar colores", que separa los tonos en conflicto en lugar de simularlos.
 */
export function ColorFilters() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <defs>
        <filter id="cb-protanopia" colorInterpolationFilters="linearRGB">
          <feColorMatrix
            type="matrix"
            values="0.152286 1.052583 -0.204868 0 0
                    0.114503 0.786281 0.099216 0 0
                    -0.003882 -0.048116 1.051998 0 0
                    0 0 0 1 0"
          />
        </filter>

        <filter id="cb-deuteranopia" colorInterpolationFilters="linearRGB">
          <feColorMatrix
            type="matrix"
            values="0.367322 0.860646 -0.227968 0 0
                    0.280085 0.672501 0.047413 0 0
                    -0.011820 0.042940 0.968881 0 0
                    0 0 0 1 0"
          />
        </filter>

        <filter id="cb-tritanopia" colorInterpolationFilters="linearRGB">
          <feColorMatrix
            type="matrix"
            values="1.255528 -0.076749 -0.178779 0 0
                    -0.078411 0.930809 0.147602 0 0
                    0.004733 0.691367 0.303900 0 0
                    0 0 0 1 0"
          />
        </filter>
      </defs>
    </svg>
  );
}

export default ColorFilters;
