export type MapCategory = 'estudio' | 'trabajo'

export interface MapLocation {
  id: string
  nombre: string
  categoria: MapCategory
  /** West-East coordinate (required by Mapbox). */
  lng: number
  /** North-South coordinate. */
  lat: number
  descripcion: string
}

/**
 * Localizaciones de ejemplo (placeholder) dentro de Valladolid.
 * Las coordenadas son aproximadas; se afinaran con las ubicaciones reales.
 */
/** Centro inicial del mapa: [lng, lat] (Valladolid, España). */
export const MAP_CENTER: [number, number] = [-4.7245, 41.6523]

export const MAP_LOCATIONS: readonly MapLocation[] = [
  {
    id: 'uva-etsii-informatica',
    nombre: 'ETSI INFORMÁTICA — UVA',
    categoria: 'estudio',
    lng: -4.7088,
    lat: 41.6577,
    descripcion:
      'Escuela Técnica Superior de Ingenierías Informática de la Universidad de Valladolid.',
  },
  {
    id: 'uva-sede-historica',
    nombre: 'UNIVERSIDAD DE VALLADOLID',
    categoria: 'estudio',
    lng: -4.746,
    lat: 41.6533,
    descripcion:
      'Sede histórica de la Universidad de Valladolid, en pleno centro de la ciudad.',
  },
  {
    id: 'parque-tecnologico-boecillo',
    nombre: 'PARQUE TECNOLÓGICO DE BOECILLO',
    categoria: 'trabajo',
    lng: -4.6977,
    lat: 41.5978,
    descripcion:
      'Parque tecnológico al sur de Valladolid, polo de actividad tecnológica de la región.',
  },
]