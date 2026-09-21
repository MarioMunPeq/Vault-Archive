export type DataSectionId =
  | 'ABOUT'
  | 'EDUCATION'
  | 'EXPERIENCE'
  | 'PROJECTS'
  | 'CONTACT'

export interface DataEntry {
  id: string
  name: string
  lines: readonly string[]
  level?: number
  url?: string
  urlText?: string
}

export interface DataSectionInfo {
  id: DataSectionId
  label: string
  path: string
  entries: readonly DataEntry[]
}

const ABOUT_ENTRIES: readonly DataEntry[] = [
  {
    id: 'registro-personal',
    name: 'REGISTRO_PERSONAL.TXT',
    lines: [
      'REGISTRO PERSONAL - ENTRADA #001',
      '',
      'USUARIO ..........: MARIO MUÑOZ PEQUEÑO',
      'ORIGEN ..........: VALLADOLID, ESPAÑA',
      'FUNCION .........: DESARROLLADOR DE SOFTWARE',
      'EMPLEADOR .......: DIPUTACIÓN DE VALLADOLID',
      '',
      'NOTA DEL SISTEMA',
      'El operador de este dispositivo reside en Valladolid y',
      'desarrolla software para la Diputación de Valladolid.',
      'Fuera del horario de servicio, los registros muestran',
      'actividad en: videojuegos, rol de mesa (D&D), inteligencia',
      'artificial y un interés constante por el diseño y la',
      'tecnología en general.',
      '',
      'SIN MÁS DATOS - FIN DE REGISTRO',
    ],
  },
]

const EDUCATION_ENTRIES: readonly DataEntry[] = [
  {
    id: 'edu-eso',
    name: 'EDU_001.SYS',
    lines: [
      '[FECHA]',
      '',
      'TITULO ..........: ESO',
      'NOMBRE ..........: EDUCACIÓN SECUNDARIA OBLIGATORIA',
      'NIVEL ...........: OBLIGATORIA',
      'ESTADO ..........: COMPLETADO',
      '',
      'BASE DE FORMACIÓN GENERAL.',
    ],
  },
  {
    id: 'edu-telco',
    name: 'EDU_002.SYS',
    lines: [
      '[FECHA]',
      '',
      'TITULO ..........: GRADO MEDIO',
      'ESPECIALIDAD ....: TELECOMUNICACIONES',
      'ESTADO ..........: COMPLETADO',
      '',
      'RAMA TÉCNICA: REDES Y SISTEMAS DE COMUNICACIÓN.',
    ],
  },
  {
    id: 'edu-robotica',
    name: 'EDU_003.SYS',
    lines: [
      '[FECHA]',
      '',
      'TITULO ..........: GRADO EN ROBÓTICA',
      'RAMA ............: DERIVADA DEL GRADO MEDIO',
      'ESTADO ..........: COMPLETADO',
      '',
      'ESPECIALIZACIÓN EN AUTOMATIZACIÓN Y ROBÓTICA.',
    ],
  },
  {
    id: 'edu-dam',
    name: 'EDU_004.SYS',
    lines: [
      '[FECHA]',
      '',
      'TITULO ..........: GRADO SUPERIOR',
      'ESPECIALIDAD ....: DESARROLLO DE APLICACIONES',
      '                 MULTIPLATAFORMA (DAM)',
      'ESTADO ..........: COMPLETADO',
      '',
      'FORMACIÓN EN INGENIERÍA DE SOFTWARE.',
    ],
  },
  {
    id: 'edu-ia',
    name: 'EDU_005.SYS',
    lines: [
      '[FECHA]',
      '',
      'PROGRAMA ........: BOOTCAMP DE INTELIGENCIA ARTIFICIAL',
      'ORIGEN ..........: SURGIDO A PARTIR DE DAM',
      'ESTADO ..........: COMPLETADO',
      '',
      'ESPECIALIZACIÓN EN IA Y APRENDIZAJE AUTOMÁTICO.',
    ],
  },
]

const EXPERIENCE_ENTRIES: readonly DataEntry[] = [
  {
    id: 'exp-michelin',
    name: 'EXP_001.LOG',
    lines: [
      'PERIODO .......: [FECHA INICIO] - [FECHA FIN]',
      '',
      'EMPRESA .......: MICHELIN',
      'ROL ...........: [DETALLE DEL ROL]',
      '',
      'REGISTRO DE SERVICIO - SIN MÁS DATOS',
    ],
  },
  {
    id: 'exp-cognizant',
    name: 'EXP_002.LOG',
    lines: [
      'PERIODO .......: [FECHA INICIO] - [FECHA FIN]',
      '',
      'EMPRESA .......: COGNIZANT',
      'ROL ...........: [DETALLE DEL ROL]',
      '',
      'REGISTRO DE SERVICIO - SIN MÁS DATOS',
    ],
  },
  {
    id: 'exp-diputacion',
    name: 'EXP_003.LOG',
    lines: [
      'PERIODO .......: [FECHA INICIO] - PRESENTE',
      '',
      'EMPRESA .......: DIPUTACIÓN DE VALLADOLID',
      'ROL ...........: DESARROLLADOR DE SOFTWARE',
      'ESTADO ........: SERVICIO ACTIVO',
      '',
      'REGISTRO DE SERVICIO - SIN MÁS DATOS',
    ],
  },
]

const CONTACT_ENTRIES: readonly DataEntry[] = [
  {
    id: 'ct-email',
    name: 'CONTACTO_EMAIL.CFG',
    url: 'mailto:tu@email.com',
    urlText: 'ENVIAR CORREO',
    lines: [
      'CANAL .....: CORREO ELECTRÓNICO',
      'VALOR .....: tu@email.com',
      '',
      'ACCIÓN DISPONIBLE: ENVÍO DE CORREO',
    ],
  },
  {
    id: 'ct-github',
    name: 'CONTACTO_GITHUB.CFG',
    url: 'https://github.com/tu-usuario',
    urlText: 'ABRIR REPOSITORIO',
    lines: [
      'CANAL .....: GITHUB',
      'VALOR .....: github.com/tu-usuario',
      '',
      'ACCIÓN DISPONIBLE: ACCESO A REPOSITORIO',
    ],
  },
  {
    id: 'ct-linkedin',
    name: 'CONTACTO_LINKEDIN.CFG',
    url: 'https://www.linkedin.com/in/tu-usuario',
    urlText: 'ABRIR PERFIL',
    lines: [
      'CANAL .....: LINKEDIN',
      'VALOR .....: linkedin.com/in/tu-usuario',
      '',
      'ACCIÓN DISPONIBLE: ACCESO A PERFIL PROFESIONAL',
    ],
  },
]

const PROJECT_ENTRIES: readonly DataEntry[] = [
  {
    id: 'proj-vault',
    name: 'PROJ_VAULT.MOD',
    lines: [
      'NOMBRE ..........: VAULT ARCHIVE',
      'TIPO ............: INTERFAZ PIP-BOY / PORTFOLIO',
      'ESTADO ..........: EN DESARROLLO ACTIVO',
      '',
      'Recreación funcional de la interfaz Pip-Boy 3000',
      'como portfolio técnico interactivo. Incluye:',
      '- Navegación por tabs/subtabs estilo Fallout',
      '- Mapa con marcadores y indicadores off-screen',
      '- Terminal de hackeo con diccionario dinámico',
      '- Radio con visualizador de onda y ecualizador',
      '- Sistema CRT con scanlines y efectos de boot',
      '',
      'STACK: React 19, TypeScript, Vite, Mapbox GL',
      'CSS custom properties, animaciones steps()',
    ],
  },
  {
    id: 'proj-dnd',
    name: 'PROJ_DND_TOOLS.MOD',
    lines: [
      'NOMBRE ..........: D&D SESSION TOOLS',
      'TIPO ............: HERRAMIENTAS DE MESA',
      'ESTADO ..........: PROTOTIPO',
      '',
      'Conjunto de utilidades para Director de Juego:',
      '- Generador de encuentros balanceados',
      '- Calculadora de experiencia y tesoro',
      '- Seguimiento de iniciativa y condiciones',
      '- Integración con SRD 5.1',
      '',
      'STACK: TypeScript, Node.js, CLI',
    ],
  },
  {
    id: 'proj-ai',
    name: 'PROJ_IA_EXPERIMENTS.MOD',
    lines: [
      'NOMBRE ..........: IA EXPERIMENTS',
      'TIPO ............: INVESTIGACIÓN / PROTOTIPOS',
      'ESTADO ..........: EXPERIMENTAL',
      '',
      'Experimentos locales con modelos LLM:',
      '- RAG sobre documentación técnica privada',
      '- Agentes para refactorización asistida',
      '- Generación de tests a partir de código',
      '- Evaluación de modelos cuantizados (GGUF)',
      '',
      'STACK: Python, Ollama, LangChain, llama.cpp',
    ],
  },
]

export const DATA_SECTIONS: readonly DataSectionInfo[] = [
  {
    id: 'ABOUT',
    label: 'ABOUT',
    path: 'SYS:\\VAULT\\REGISTROS\\ABOUT\\',
    entries: ABOUT_ENTRIES,
  },
  {
    id: 'EDUCATION',
    label: 'EDUCATION',
    path: 'SYS:\\VAULT\\REGISTROS\\EDUCATION\\',
    entries: EDUCATION_ENTRIES,
  },
  {
    id: 'EXPERIENCE',
    label: 'EXPERIENCE',
    path: 'SYS:\\VAULT\\REGISTROS\\EXPERIENCE\\',
    entries: EXPERIENCE_ENTRIES,
  },
  {
    id: 'PROJECTS',
    label: 'PROJECTS',
    path: 'SYS:\\VAULT\\REGISTROS\\PROJECTS\\',
    entries: PROJECT_ENTRIES,
  },
  {
    id: 'CONTACT',
    label: 'CONTACT',
    path: 'SYS:\\VAULT\\REGISTROS\\CONTACT\\',
    entries: CONTACT_ENTRIES,
  },
]