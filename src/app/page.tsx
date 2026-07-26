import Link from 'next/link';
import { jobs } from '@/lib/jobs';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="eyebrow">Talento que transforma</div>
          <h1 data-animate="chars">
            Tu pr\u00f3xima oportunidad puede <span>mover Bolivia.</span>
          </h1>
          <p data-animate="fade-up" data-delay="0.4">
            Encuentra un lugar donde tu experiencia, tus ideas y tu compromiso
            contribuyan al desarrollo productivo de nuestro pa\u00eds.
          </p>
          <div className="actions" data-animate="fade-up" data-delay="0.6">
            <Link className="button primary" href="/procesos">
              Explorar oportunidades
            </Link>
            <Link className="button secondary" href="/crear-cuenta">
              Crear cuenta
            </Link>
          </div>
          <p className="muted" data-animate="fade-up" data-delay="0.8">
            Portal oficial de candidaturas \u00b7 La Paz, Bolivia
          </p>
        </div>
        <div className="orbital" data-animate="scale-in" data-delay="0.3">
          <div className="orbital-card">
            <span className="tag">BDP \u00b7 Personas y prop\u00f3sito</span>
            <strong>Crecer contigo</strong>
            <span>Un proceso claro, accesible y respetuoso.</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section">
        <div className="stats-row">
          <div className="card stat-card" data-animate="fade-up" data-delay="0">
            <div className="stat-number" data-count="150">0</div>
            <div className="stat-label">Posiciones cubiertas</div>
          </div>
          <div className="card stat-card" data-animate="fade-up" data-delay="0.1">
            <div className="stat-number" data-count="2400">0</div>
            <div className="stat-label">Candidatos activos</div>
          </div>
          <div className="card stat-card" data-animate="fade-up" data-delay="0.2">
            <div className="stat-number" data-count="98">0</div>
            <div className="stat-label">% Satisfacci\u00f3n</div>
          </div>
          <div className="card stat-card" data-animate="fade-up" data-delay="0.3">
            <div className="stat-number" data-count="9">0</div>
            <div className="stat-label">Departamentos</div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Jobs Section */}
      <section className="section">
        <div className="section-head">
          <div>
            <div className="eyebrow" data-animate="fade-up">Oportunidades abiertas</div>
            <h2 data-animate="chars">Encuentra tu pr\u00f3ximo reto</h2>
          </div>
          <Link href="/procesos" data-animate="fade-up">Ver todos \u2192</Link>
        </div>
        <div className="grid">
          {jobs.slice(0, 3).map((job, i) => (
            <article
              className="card job-card"
              key={job.id}
              data-animate="fade-up"
              data-delay={String(i * 0.15)}
            >
              <div className="job-meta">
                <span className="tag">{job.area}</span>
                <span>{job.city}</span>
              </div>
              <h3>{job.title}</h3>
              <p className="muted">{job.summary}</p>
              <Link className="button secondary" href={`/procesos/${job.id}`}>
                Ver cargo
              </Link>
            </article>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* Features Section */}
      <section className="section">
        <div className="section-head">
          <div>
            <div className="eyebrow" data-animate="fade-up">C\u00f3mo funciona</div>
            <h2 data-animate="chars">Simple, transparente y humano</h2>
          </div>
        </div>
        <div className="feature-strip">
          <div className="card" data-animate="fade-up" data-delay="0">
            <div className="eyebrow">01</div>
            <h3>Post\u00falate con claridad</h3>
            <p className="muted">
              Revisa la informaci\u00f3n del cargo y completa tu postulaci\u00f3n paso a paso.
            </p>
          </div>
          <div className="card" data-animate="fade-up" data-delay="0.15">
            <div className="eyebrow">02</div>
            <h3>Tu informaci\u00f3n, bajo tu control</h3>
            <p className="muted">
              Gestiona tu perfil, CV y cartas desde un solo lugar.
            </p>
          </div>
          <div className="card" data-animate="fade-up" data-delay="0.3">
            <div className="eyebrow">03</div>
            <h3>Accesibilidad desde el inicio</h3>
            <p className="muted">
              Ajusta lectura, contraste y movimiento seg\u00fan tus necesidades.
            </p>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* CTA Section */}
      <section className="section cta-section" data-animate="fade-up">
        <h2 data-animate="chars">\u00bfListo para dar el siguiente paso?</h2>
        <p data-animate="fade-up" data-delay="0.2">
          \u00danete a cientos de profesionales que ya est\u00e1n construyendo el futuro productivo de Bolivia.
        </p>
        <div className="actions" style={{ justifyContent: 'center' }} data-animate="fade-up" data-delay="0.4">
          <Link className="button primary" href="/crear-cuenta">
            Comenzar ahora
          </Link>
          <Link className="button secondary" href="/procesos">
            Ver oportunidades
          </Link>
        </div>
      </section>
    </>
  );
}
