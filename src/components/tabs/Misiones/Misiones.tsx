import { useEffect, useState, useRef, useCallback } from 'react'
import './Misiones.css'

export interface Project {
  id: string
  name: string
  status: 'active' | 'completed' | 'paused'
  description: string
  objectives: { text: string; completed: boolean }[]
  repoUrl: string
  demoUrl: string
}

const PROJECTS: readonly Project[] = [
  {
    id: 'vault-archive',
    name: 'VAULT ARCHIVE',
    status: 'active',
    description:
      'Recreación funcional de la interfaz Pip-Boy 3000 como portfolio técnico interactivo. Incluye navegación por tabs estilo Fallout, mapa con marcadores, terminal de hackeo, radio con visualizador y sistema CRT con scanlines.',
    objectives: [
      { text: 'Secuencia de arranque y boot', completed: true },
      { text: 'Módulo STAT (SPECIAL, Perks)', completed: true },
      { text: 'Módulo DATA (registros, skills, contacto)', completed: true },
      { text: 'Módulo MAPA (Mapbox GL, POIs, off-screen)', completed: true },
      { text: 'Módulo RADIO (visualizador, ecualizador)', completed: true },
      { text: 'Módulo HACK (terminal, diccionario dinámico)', completed: true },
      { text: 'MÓDULO MISIONES (esta pantalla)', completed: true },
      { text: 'Pulido visual y efectos CRT', completed: false },
      { text: 'Easter eggs y contenido oculto', completed: false },
    ],
    repoUrl: 'https://github.com/mariomunozp/vault-archive',
    demoUrl: 'https://mariomunozp.github.io/vault-archive/',
  },
  {
    id: 'cosmere-archive',
    name: 'COSMERE ARCHIVE',
    status: 'completed',
    description:
      'Web de referencia sobre el universo Cosmere de Brandon Sanderson. Base de datos navegable de libros, personajes, mundos y sistemas de magia con búsqueda en tiempo real.',
    objectives: [
      { text: 'Diseño de interfaz y arquitectura de datos', completed: true },
      { text: 'Base de datos completa de libros y personajes', completed: true },
      { text: 'Búsqueda en tiempo real y filtros', completed: true },
      { text: 'Publicado en producción (GitHub Pages)', completed: true },
      { text: 'Documentación en README', completed: true },
    ],
    repoUrl: 'https://github.com/MarioMunPeq/Cosmere-Archive',
    demoUrl: 'https://mariomunpeq.github.io/Cosmere-Archive/',
  },
  {
    id: 'euromario',
    name: 'EUROMARIO',
    status: 'completed',
    description:
      'Agregador de noticias de videojuegos con IA que categoriza, resume y presenta contenido de múltiples fuentes. Desplegado en GitHub Pages con actualización automatizada.',
    objectives: [
      { text: 'Pipeline de scraping y clasificación IA', completed: true },
      { text: 'Interfaz de lectura tipo feed responsiva', completed: true },
      { text: 'Despliegue automático en GitHub Pages', completed: true },
      { text: 'Documentación en README', completed: true },
    ],
    repoUrl: 'https://github.com/mariomunozp/euromario',
    demoUrl: 'https://mariomunpeq.github.io/Euromario/',
  },
  {
    id: 'dnd-companion',
    name: 'DUNGEON ARCHIVE',
    status: 'completed',
    description:
      'Web companion para campañas de D&D: seguimiento de iniciativa, generación de encuentros, calculadora de XP/tesoro y referencia rápida de reglas SRD 5.1.',
    objectives: [
      { text: 'Diseño de interfaz y arquitectura', completed: true },
      { text: 'Generador de encuentros balanceados', completed: true },
      { text: 'Seguimiento de iniciativa y condiciones', completed: true },
      { text: 'Publicado en producción', completed: true },
      { text: 'Documentación en README', completed: true },
    ],
    repoUrl: 'https://github.com/MarioMunPeq/Dungeon-Archive',
    demoUrl: 'https://mariomunpeq.github.io/Dungeon-Archive/',
  },
  {
    id: 'portfolio-mmp',
    name: 'PERSONA 5 PORTFOLIO',
    status: 'completed',
    description:
      'Portfolio personal con menú estilo Persona 5, animaciones fluidas y secciones de proyectos, experiencia y contacto. Diseño responsivo y accesible.',
    objectives: [
      { text: 'Diseño de interfaz estilo Persona 5', completed: true },
      { text: 'Animaciones y transiciones fluidas', completed: true },
      { text: 'Secciones: proyectos, experiencia, contacto', completed: true },
      { text: 'Publicado en producción', completed: true },
      { text: 'Documentación en README', completed: true },
    ],
    repoUrl: 'https://github.com/MarioMunPeq/portfolio-persona5',
    demoUrl: 'https://mariomunpeq.github.io/portfolio-persona5/',
  },
]

export function Misiones() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const day = String(now.getDate()).padStart(2, '0')
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const year = String(now.getFullYear()).slice(-2)
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      setCurrentTime(`${day}.${month}.${year}, ${hours}:${minutes}`)
    }
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  const scrollToSelected = useCallback(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.querySelector('.mission-row--selected')
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [])

  useEffect(() => {
    scrollToSelected()
  }, [selectedIndex, scrollToSelected])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : PROJECTS.length - 1))
        break
      case 'ArrowDown':
        event.preventDefault()
        setSelectedIndex((prev) => (prev < PROJECTS.length - 1 ? prev + 1 : 0))
        break
      case 'Home':
        event.preventDefault()
        setSelectedIndex(0)
        break
      case 'End':
        event.preventDefault()
        setSelectedIndex(PROJECTS.length - 1)
        break
    }
  }

  const selectedProject = PROJECTS[selectedIndex]

  return (
    <div className="misiones" onKeyDown={handleKeyDown} tabIndex={0}>
      <header className="misiones__header">
        <span className="misiones__location">VALLADOLID</span>
        <time className="misiones__datetime" dateTime={new Date().toISOString()}>
          {currentTime}
        </time>
      </header>

      <div className="misiones__layout">
        <aside className="misiones__list" ref={listRef} role="listbox" aria-label="Lista de misiones">
          <div className="misiones__list-inner">
            {PROJECTS.map((project, index) => (
              <button
                key={project.id}
                type="button"
                role="option"
                aria-selected={index === selectedIndex}
                className={[
                  'mission-row',
                  project.status === 'completed' ? 'mission-row--completed' : '',
                  project.status === 'active' ? 'mission-row--active' : '',
                  project.status === 'paused' ? 'mission-row--paused' : '',
                  index === selectedIndex ? 'mission-row--selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setSelectedIndex(index)}
              >
                <span className="mission-row__status" aria-hidden="true">
                  {project.status === 'completed' ? '✔' : project.status === 'active' ? '▸' : ''}
                </span>
                <span className="mission-row__name">{project.name}</span>
              </button>
            ))}
          </div>
          <div className="misiones__scroll-indicators" aria-hidden="true">
            <span className="scroll-indicator scroll-indicator--up">▲</span>
            <span className="scroll-indicator scroll-indicator--down">▼</span>
          </div>
        </aside>

        <section className="misiones__detail" aria-live="polite">
          <div className="misiones__detail-inner">
            <div className="misiones__detail-header">
              <span className="misiones__detail-title">{selectedProject.name}</span>
              <span className={`misiones__detail-status misiones__detail-status--${selectedProject.status}`}>
                {selectedProject.status === 'active' ? 'EN DESARROLLO' : selectedProject.status === 'completed' ? 'COMPLETADA' : 'PAUSADA'}
              </span>
            </div>

            <div className="misiones__description">
              {selectedProject.description}
            </div>

            <div className="misiones__objectives">
              <h3 className="misiones__objectives-title">OBJETIVOS</h3>
              <ul className="misiones__objectives-list" role="list">
                {selectedProject.objectives.map((objective, idx) => (
                  <li key={idx} className="misiones__objective">
                    <span className="misiones__checkbox" aria-hidden="true">
                      {objective.completed ? '☑' : '☐'}
                    </span>
                    <span className={objective.completed ? 'misiones__objective--done' : ''}>
                      {objective.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="misiones__actions">
              <a
                href={selectedProject.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="misiones__action"
              >
                [ VER REPOSITORIO ▸ ]
              </a>
              <a
                href={selectedProject.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="misiones__action"
              >
                [ VER DEMO EN VIVO ▸ ]
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}