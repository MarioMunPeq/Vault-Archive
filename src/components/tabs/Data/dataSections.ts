export type DataSectionId =
  | 'ABOUT'
  | 'EDUCATION'
  | 'EXPERIENCE'
  | 'SKILLS'
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

const SKILL_ENTRIES: readonly DataEntry[] = [
  {
    id: 'sk-java',
    name: 'SK_JAVA.MOD',
    level: 78,
    lines: [
      'MÓDULO ............: JAVA',
      'NIVEL .............: AVANZADO - 78%',
    ],
  },
  {
    id: 'sk-python',
    name: 'SK_PYTHON.MOD',
    level: 70,
    lines: [
      'MÓDULO ............: PYTHON',
      'NIVEL .............: AVANZADO - 70%',
    ],
  },
  {
    id: 'sk-kotlin',
    name: 'SK_KOTLIN.MOD',
    level: 55,
    lines: [
      'MÓDULO ............: KOTLIN',
      'NIVEL .............: COMPETENTE - 55%',
    ],
  },
  {
    id: 'sk-csharp',
    name: 'SK_CSHARP.MOD',
    level: 50,
    lines: [
      'MÓDULO ............: C#',
      'NIVEL .............: COMPETENTE - 50%',
    ],
  },
  {
    id: 'sk-javascript',
    name: 'SK_JS.MOD',
    level: 72,
    lines: [
      'MÓDULO ............: JAVASCRIPT',
      'NIVEL .............: AVANZADO - 72%',
    ],
  },
  {
    id: 'sk-typescript',
    name: 'SK_TS.MOD',
    level: 64,
    lines: [
      'MÓDULO ............: TYPESCRIPT',
      'NIVEL .............: AVANZADO - 64%',
    ],
  },
  {
    id: 'sk-react',
    name: 'SK_REACT.MOD',
    level: 66,
    lines: [
      'MÓDULO ............: REACT',
      'NIVEL .............: AVANZADO - 66%',
    ],
  },
  {
    id: 'sk-sql',
    name: 'SK_SQL.MOD',
    level: 68,
    lines: [
      'MÓDULO ............: SQL',
      'NIVEL .............: AVANZADO - 68%',
    ],
  },
  {
    id: 'sk-git',
    name: 'SK_GIT.MOD',
    level: 74,
    lines: [
      'MÓDULO ............: GIT',
      'NIVEL .............: AVANZADO - 74%',
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
    id: 'SKILLS',
    label: 'SKILLS',
    path: 'SYS:\\VAULT\\REGISTROS\\SKILLS\\',
    entries: SKILL_ENTRIES,
  },
  {
    id: 'CONTACT',
    label: 'CONTACT',
    path: 'SYS:\\VAULT\\REGISTROS\\CONTACT\\',
    entries: CONTACT_ENTRIES,
  },
]