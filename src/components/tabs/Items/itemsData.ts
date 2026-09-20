export type ItemCategoryId = 'WEAPONS' | 'APPAREL' | 'AID' | 'MISC'

export interface ItemStat {
  label: string
  value: number
}

export interface InventoryItem {
  id: string
  name: string
  epithet: string
  icon: string
  stats: readonly ItemStat[]
  description: readonly string[]
}

export interface ItemCategory {
  id: ItemCategoryId
  label: string
  path: string
  serialCode: string
  primary: string
  items: readonly InventoryItem[]
}

const WEAPON_ITEMS: readonly InventoryItem[] = [
  {
    id: 'wep-java',
    name: 'JAVA',
    epithet: 'ARMA PESADA DE LA VIEJA ESCUELA',
    icon: 'sword-clash',
    stats: [
      { label: 'DAÑO', value: 85 },
      { label: 'CADENCIA', value: 30 },
      { label: 'PESO', value: 12 },
    ],
    description: [
      'Sigue en servicio tras décadas de yermo digital.',
      'Golpea duro aunque su recarga es pausada. Sigue',
      'amateando con vida en los fortines heredados de',
      'gran escala.',
      '',
      'SIN MÁS DATOS - FIN DE REGISTRO',
    ],
  },
  {
    id: 'wep-python',
    name: 'PYTHON',
    epithet: 'PROYECTIL VELOZ DE BAJO CALIBRE',
    icon: 'power-lightning',
    stats: [
      { label: 'DAÑO', value: 60 },
      { label: 'CADENCIA', value: 90 },
      { label: 'PESO', value: 4 },
    ],
    description: [
      'Ligera y versátil: una sola bala hace el trabajo',
      'de un cargador entero. Común entre los exploradores',
      'que valoran la rapidez sobre el teclado.',
      '',
      'SIN MÁS DATOS - FIN DE REGISTRO',
    ],
  },
  {
    id: 'wep-kotlin',
    name: 'KOTLIN',
    epithet: 'RIFLE MODERNO DE ASEDIO MÓVIL',
    icon: 'fist',
    stats: [
      { label: 'DAÑO', value: 70 },
      { label: 'CADENCIA', value: 70 },
      { label: 'PESO', value: 5 },
    ],
    description: [
      'Diseñado para el frente Android: disparo seco,',
      'sintaxis limpia y cero fallos del tipo vacío.',
      'Fiable en las trincheras de compilación.',
      '',
      'SIN MÁS DATOS - FIN DE REGISTRO',
    ],
  },
  {
    id: 'wep-csharp',
    name: 'C#',
    epithet: 'FUSIL SÓLIDO DEL ARSENAL .NET',
    icon: 'rifle',
    stats: [
      { label: 'DAÑO', value: 75 },
      { label: 'CADENCIA', value: 55 },
      { label: 'PESO', value: 8 },
    ],
    description: [
      'Certero dentro del ecosistema de Microsoft; su',
      'blindaje de tipos resiste bien el fuego cruzado',
      'entre servicios y aplicaciones.',
      '',
      'SIN MÁS DATOS - FIN DE REGISTRO',
    ],
  },
  {
    id: 'wep-js-ts',
    name: 'JS + TS',
    epithet: 'PAREJA DE DAGAS: RÁPIDO Y PRECISO',
    icon: 'sparkles',
    stats: [
      { label: 'DAÑO', value: 65 },
      { label: 'CADENCIA', value: 95 },
      { label: 'PESO', value: 2 },
    ],
    description: [
      'JavaScript apuñala sin mirar: veloz pero',
      'arriesgado. TypeScript afina la hoja y hace',
      'que no falle ni un solo golpe.',
      '',
      'SIN MÁS DATOS - FIN DE REGISTRO',
    ],
  },
]

const APPAREL_ITEMS: readonly InventoryItem[] = [
  {
    id: 'app-react',
    name: 'REACT',
    epithet: 'ARMADURA DE COMPONENTES RETROALIMENTADA',
    icon: 'atom',
    stats: [
      { label: 'DEF', value: 60 },
      { label: 'PESO', value: 3 },
    ],
    description: [
      'Interfaz protegida por piezas que se regeneran',
      'solas: cada impacto recarga únicamente la zona',
      'dañada, sin reiniciar la sesión.',
      '',
      'SIN MÁS DATOS - FIN DE REGISTRO',
    ],
  },
  {
    id: 'app-git',
    name: 'GIT',
    epithet: 'ARNÉS DE RAMAS Y REPARACIÓN',
    icon: 'tree-branch',
    stats: [
      { label: 'DEF', value: 45 },
      { label: 'PESO', value: 5 },
    ],
    description: [
      'Guarda cada estado de la misión. Permite',
      'bifurcar el plan sin miedo a perder el avance',
      'del grupo.',
      '',
      'SIN MÁS DATOS - FIN DE REGISTRO',
    ],
  },
  {
    id: 'app-sql',
    name: 'SQL',
    epithet: 'BLINDAJE DE ALMACÉN ESTRUCTURADO',
    icon: 'database',
    stats: [
      { label: 'DEF', value: 80 },
      { label: 'PESO', value: 8 },
    ],
    description: [
      'Coraza de datos: organiza y protege la información',
      'en celdas ordenadas. Resistente incluso en las',
      'consultas más pesadas.',
      '',
      'SIN MÁS DATOS - FIN DE REGISTRO',
    ],
  },
]

const AID_ITEMS: readonly InventoryItem[] = [
  {
    id: 'aid-team',
    name: 'TRABAJO EN EQUIPO',
    epithet: 'SUERO DE SINERGIA',
    icon: 'shaking-hands',
    stats: [
      { label: 'CURA', value: 40 },
      { label: 'PESO', value: 1 },
    ],
    description: [
      'Aumenta la moral general del destacamento; un',
      'grupo coordinado cubre mejor las espaldas de',
      'cada miembro en el proyecto.',
      '',
      'SIN MÁS DATOS - FIN DE REGISTRO',
    ],
  },
  {
    id: 'aid-problems',
    name: 'RESOLUCIÓN DE PROBLEMAS',
    epithet: 'KIT DE REPARACIÓN UNIVERSAL',
    icon: 'puzzle',
    stats: [
      { label: 'CURA', value: 60 },
      { label: 'PESO', value: 1 },
    ],
    description: [
      'Desbloquea atascos técnicos: descomponer,',
      'analizar y probar hasta que el sistema vuelve',
      'a responder.',
      '',
      'SIN MÁS DATOS - FIN DE REGISTRO',
    ],
  },
  {
    id: 'aid-communication',
    name: 'COMUNICACIÓN',
    epithet: 'ESTIMULANTE DE TRANSMISIÓN',
    icon: 'megaphone',
    stats: [
      { label: 'CURA', value: 50 },
      { label: 'PESO', value: 1 },
    ],
    description: [
      'Mejora la señal entre aliados: las ideas llegan',
      'claras y sin interferencias a cualquier hora del',
      'día.',
      '',
      'SIN MÁS DATOS - FIN DE REGISTRO',
    ],
  },
]

const MISC_ITEMS: readonly InventoryItem[] = [
  {
    id: 'msc-cert-01',
    name: '[TÍTULO CERTIFICADO]',
    epithet: 'ACREDITACIÓN SIN SELLAR',
    icon: 'medal',
    stats: [
      { label: 'VALOR', value: 100 },
      { label: 'PESO', value: 0 },
    ],
    description: [
      'Certificado del yermo pendiente de registro.',
      'Logro reservado: sus datos aún no se han',
      'completado.',
      '',
      'SIN MÁS DATOS - FIN DE REGISTRO',
    ],
  },
  {
    id: 'msc-cert-02',
    name: '[TÍTULO CERTIFICADO 2]',
    epithet: 'ACREDITACIÓN SIN SELLAR',
    icon: 'ribbon-medal',
    stats: [
      { label: 'VALOR', value: 150 },
      { label: 'PESO', value: 0 },
    ],
    description: [
      'Segundo hueco reservado para una acreditación',
      'oficial. Pendiente de rellenar por el operador.',
      '',
      'SIN MÁS DATOS - FIN DE REGISTRO',
    ],
  },
]

export const INVENTORY_CATEGORIES: readonly ItemCategory[] = [
  {
    id: 'WEAPONS',
    label: 'WEAPONS',
    path: 'SYS:\\VAULT\\INVENTARIO\\WEAPONS\\',
    serialCode: 'W',
    primary: 'DAÑO',
    items: WEAPON_ITEMS,
  },
  {
    id: 'APPAREL',
    label: 'APPAREL',
    path: 'SYS:\\VAULT\\INVENTARIO\\APPAREL\\',
    serialCode: 'AP',
    primary: 'DEF',
    items: APPAREL_ITEMS,
  },
  {
    id: 'AID',
    label: 'AID',
    path: 'SYS:\\VAULT\\INVENTARIO\\AID\\',
    serialCode: 'MD',
    primary: 'CURA',
    items: AID_ITEMS,
  },
  {
    id: 'MISC',
    label: 'MISC',
    path: 'SYS:\\VAULT\\INVENTARIO\\MISC\\',
    serialCode: 'MS',
    primary: 'VALOR',
    items: MISC_ITEMS,
  },
]