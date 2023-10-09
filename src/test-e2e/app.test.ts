import { AppModule } from '../app.module'
import { Test } from '@nestjs/testing'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import request from 'supertest'
import { Program } from '../program-creation/program/infrastructure/program.entity'
import { Repository } from 'typeorm'
import { medias, programs } from './fixtures'
import { Media } from '../program-creation/media/infrastructure/media.entity'
import { afterEach, beforeEach, expect } from '@jest/globals'
import { before } from 'node:test'
import exp from 'constants'

const toGlobalId = (type: string, id: string) => {
  return Buffer.from(`${type}:${id}`).toString('base64')
}
describe('App', () => {
  let app: NestFastifyApplication
  let programRepository: Repository<Program>
  let mediaRepository: Repository<Media>

  beforeAll(async () => {
    // creates testing module with the database

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    )
    programRepository = moduleFixture.get('ProgramRepository')
    mediaRepository = moduleFixture.get('MediaRepository')

    await app.init()
    await app.getHttpAdapter().getInstance().ready()
  })
  beforeEach(async () => {
    // TODO never do this it's soooo slow
    // instead mock at the repository level
    await programRepository.save(programs)
    await mediaRepository.save(medias)
  })
  afterEach(async () => {
    await mediaRepository.delete({})
    await programRepository.delete({})
  })
  afterAll(async () => {
    await app.close()
  })
  describe('Programs', () => {
    it('Create a program', async () => {
      const mutation = `
        mutation {
          upsertProgram(
            input: {
              name: "test"
              coverImageLocation: "test.com"
              description: "some program"
            }
          ) {
            id
            name
            coverImageLocation
            description
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation })

      expect(response.body).toMatchObject({
        data: {
          upsertProgram: {
            id: expect.any(String),
            name: 'test',
            coverImageLocation: 'test.com',
            description: 'some program',
          },
        },
      })
    })

    it('Edit a program', async () => {
      const program = await programRepository.save({
        id: 'test-1',
        name: 'Program 1',
        coverImageLocation: 'coverImageLocation',
        description: 'description',
      })

      const mutation = `
        mutation {
          upsertProgram(
            input: {
              id: "${toGlobalId('Program', program.id)}"
              name: "test-update"
              coverImageLocation: "hello-world.com"
              description: "some program that was updated"
            }
          ) {
            id
            name
            coverImageLocation
            description
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation })

      expect(response.body).toMatchObject({
        data: {
          upsertProgram: {
            id: expect.any(String),
            name: 'test-update',
            coverImageLocation: 'hello-world.com',
            description: 'some program that was updated',
          },
        },
      })
    })

    it('Delete a program', async () => {
      const program = await programRepository.save({
        id: 'test-2',
        name: 'Program 1',
        coverImageLocation: 'coverImageLocation',
        description: 'description',
      })

      const mutation = `
        mutation {
          deleteProgram(
            id: "${toGlobalId('Program', program.id)}"
          )
        }
      `

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation })

      expect(response.body).toMatchObject({
        data: {
          deleteProgram: true,
        },
      })
      await expect(
        programRepository.findOneOrFail({ where: { id: 'test-2' } }),
      ).rejects.toThrow()
    })

    it('See all the programs on a page (with pagination)', async () => {
      const query = `
      query {
        programs (pagination: { limit: 2, offset: 1 }) {
          id
          name
          coverImageLocation
          description
        }
      }
    `
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query })

      expect(response.status).toBe(200)
      expect(response.body.data.programs).toHaveLength(2)
      expect(response.body).toMatchObject({
        data: {
          programs: [
            {
              id: expect.any(String),
              name: expect.any(String),
              coverImageLocation: expect.any(String),
              description: expect.any(String),
            },
            {
              id: expect.any(String),
              name: expect.any(String),
              coverImageLocation: expect.any(String),
              description: expect.any(String),
            },
          ],
        },
      })
    })
  })
  describe('Medias', () => {
    it('Create a media', async () => {
      const mutation = `
        mutation {
          upsertMedia(
            input: {
              name: "test"
              fileLocation: "test.com"
              duration: 10
              description: "some media"
            }
          ) {
            id
            name
            fileLocation
            duration
            description
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation })

      expect(response.body).toMatchObject({
        data: {
          upsertMedia: {
            id: expect.any(String),
            description: 'some media',
            duration: 10,
            fileLocation: 'test.com',
          },
        },
      })
    })

    it('Adds medias to a program', async () => {
      const media1 = await mediaRepository.save({
        id: 'test-1',
        name: 'Media 1',
        duration: 10,
        fileLocation: 'fileLocation1',
        description: 'description1',
      })
      const media2 = await mediaRepository.save({
        id: 'test-2',
        name: 'Media 2',
        duration: 20,
        fileLocation: 'fileLocation2',
        description: 'description2',
      })
      const program = await programRepository.save({
        id: 'test-1',
        name: 'Program 1',
        coverImageLocation: 'coverImageLocation',
        description: 'description',
      })

      const mutation = `
        mutation {
          setMediasInProgram(
            input: {
              programId: "${toGlobalId('Program', program.id)}"
              mediaIds: ["${toGlobalId('Media', media1.id)}", "${toGlobalId(
                'Media',
                media2.id,
              )}"]
            }
          ) {
            id
            name
            medias {
              edges {
                node {
                  id
                  name
                  fileLocation
                  duration
                  description
                }
              }
            }
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation })

      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        data: {
          setMediasInProgram: {
            id: expect.any(String),
            name: expect.any(String),
            medias: {
              edges: [
                {
                  node: {
                    id: expect.any(String),
                    name: expect.any(String),
                    fileLocation: expect.any(String),
                    duration: expect.any(Number),
                    description: expect.any(String),
                  },
                },
                {
                  node: {
                    id: expect.any(String),
                    name: expect.any(String),
                    fileLocation: expect.any(String),
                    duration: expect.any(Number),
                    description: expect.any(String),
                  },
                },
              ],
            },
          },
        },
      })
    })

    it('Removes medias from a program', async () => {
      const media1 = await mediaRepository.save({
        id: 'test-1',
        name: 'Media 1',
        duration: 10,
        fileLocation: 'fileLocation1',
        description: 'description1',
      })
      const media2 = await mediaRepository.save({
        id: 'test-2',
        name: 'Media 2',
        duration: 20,
        fileLocation: 'fileLocation2',
        description: 'description2',
      })
      const program = await programRepository.save({
        id: 'test-1',
        name: 'Program 1',
        coverImageLocation: 'coverImageLocation',
        description: 'description',
      })

      const mutation = `
        mutation {
          setMediasInProgram(
            input: {
              programId: "${toGlobalId('Program', program.id)}"
              mediaIds: ["${toGlobalId('Media', media1.id)}", "${toGlobalId(
                'Media',
                media2.id,
              )}"]
            }
          ) {
            id
            name
            medias {
              edges {
                node {
                  id
                  name
                  fileLocation
                  duration
                  description
                }
              }
            }
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation })

      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        data: {
          setMediasInProgram: {
            id: expect.any(String),
            name: expect.any(String),
            medias: {
              edges: [
                {
                  node: {
                    id: expect.any(String),
                    name: expect.any(String),
                    fileLocation: expect.any(String),
                    duration: expect.any(Number),
                    description: expect.any(String),
                  },
                },
                {
                  node: {
                    id: expect.any(String),
                    name: expect.any(String),
                    fileLocation: expect.any(String),
                    duration: expect.any(Number),
                    description: expect.any(String),
                  },
                },
              ],
            },
          },
        },
      })
    })

    it('Edit a media', async () => {
      const media = await mediaRepository.save({
        id: 'test-1',
        name: 'Media 1',
        duration: 20,
        fileLocation: 'fileLocation',
        description: 'description',
      })

      const mutation = `
        mutation {
          upsertMedia(
            input: {
              id: "${toGlobalId('Media', media.id)}"
              name: "test"
              fileLocation: "test.com"
              duration: 10
              description: "some media"
            }
          ) {
            id
            name
            fileLocation
            duration
            description
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation })

      expect(response.body).toMatchObject({
        data: {
          upsertMedia: {
            id: expect.any(String),
            description: 'some media',
            duration: 10,
            fileLocation: 'test.com',
          },
        },
      })
    })

    it('Delete a media', async () => {
      const media = await mediaRepository.save({
        id: 'test-2',
        name: 'Media 1',
        duration: 20,
        fileLocation: 'fileLocation',
        description: 'description',
      })

      const mutation = `
        mutation {
          deleteMedia(
            id: "${toGlobalId('Media', media.id)}"
          )
        }
      `

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation })

      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        data: {
          deleteMedia: true,
        },
      })

      await expect(
        mediaRepository.findOneOrFail({ where: { id: 'test-2' } }),
      ).rejects.toThrow()
    })

    it('See all the medias on a page (with pagination)', async () => {
      const query = `
      query {
        medias (pagination: { limit: 2, offset: 1 }) {
          id
          name
          fileLocation
          duration
          description
        }
      }
    `
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query })

      expect(response.status).toBe(200)
      expect(response.body.data.medias).toHaveLength(2)
      expect(response.body).toMatchObject({
        data: {
          medias: [
            {
              id: expect.any(String),
              name: expect.any(String),
              fileLocation: expect.any(String),
              duration: expect.any(Number),
              description: expect.any(String),
            },
            {
              id: expect.any(String),
              name: expect.any(String),
              fileLocation: expect.any(String),
              duration: expect.any(Number),
              description: expect.any(String),
            },
          ],
        },
      })
    })
  })
})
