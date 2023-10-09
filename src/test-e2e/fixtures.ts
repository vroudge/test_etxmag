import { Program } from '../program-creation/program/infrastructure/program.entity'
import { Media } from '../program-creation/media/infrastructure/media.entity'

const programs: Partial<Program>[] = [
  {
    id: '1',
    name: 'Program 1',
    coverImageLocation: 'coverImageLocation',
    description: 'description 1',
  },
  {
    id: '2',
    name: 'Program 2',
    coverImageLocation: 'coverImageLocation',
    description: 'description 2',
  },
  {
    id: '3',
    name: 'Program 3',
    coverImageLocation: 'coverImageLocation',
    description: 'description 3',
  },
]

const medias: Partial<Media>[] = [
  {
    id: '1',
    name: 'Media 1',
    duration: 5,
    fileLocation: 'http//some location',
    description: 'description 1',
  },
  {
    id: '2',
    name: 'Media 2',
    duration: 10,
    program: { id: programs[1].id } as Program,
    fileLocation: 'http//whatever',
    description: 'description 2',
  },
  {
    id: '3',
    name: 'Media 3',
    duration: 15,
    program: { id: programs[2].id } as Program,
    fileLocation: 'http//whatever.some.location',
    description: 'description 3',
  },
]

export { programs, medias }
