export interface RadioTrack {
  url: string
  name: string
}

export interface RadioStation {
  id: string
  name: string
  tagline: string
  frequency: string
  tracks: readonly RadioTrack[]
}

const STATION_1_MODULES = import.meta.glob<string>(
  '../../../assets/audio/radio/estacion-1/*.{mp3,MP3,ogg,OGG,wav,WAV,m4a,M4A}',
  { eager: true, query: '?url', import: 'default' },
)

const STATION_2_MODULES = import.meta.glob<string>(
  '../../../assets/audio/radio/estacion-2/*.{mp3,MP3,ogg,OGG,wav,WAV,m4a,M4A}',
  { eager: true, query: '?url', import: 'default' },
)

function listTracks(modules: Record<string, string>): readonly RadioTrack[] {
  return Object.entries(modules)
    .map(([path, url]) => {
      const file = path.split('/').pop() ?? path
      const name = file.replace(/\.[^.]+$/, '').replaceAll('_', ' ').trim()
      return { url, name }
    })
    .sort((a, b) =>
      a.name.localeCompare(b.name, 'es', { numeric: true, sensitivity: 'base' }),
    )
}

export const RADIO_STATIONS: readonly RadioStation[] = [
  {
    id: 'yer-mo',
    name: 'RADIO YERMO',
    tagline: 'LA SEÑAL DEL DESIERTO',
    frequency: '96.2',
    tracks: listTracks(STATION_1_MODULES),
  },
  {
    id: 're-fu',
    name: 'ONDA REFUGIO',
    tagline: 'LA VOZ DE LOS QUE QUEDAN',
    frequency: '104.0',
    tracks: listTracks(STATION_2_MODULES),
  },
]

export const radioSession = {
  stationIndex: 0,
  volume: 75,
}