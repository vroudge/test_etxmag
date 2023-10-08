import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindManyOptions, In, Repository } from 'typeorm'
import { Program } from './program.entity'
import { MediaService } from '../../media/infrastructure/media.service'

export interface FindProgramsQueryFilters {
  ids?: string[]
}

@Injectable()
export class ProgramService {
  constructor(
    @InjectRepository(Program)
    protected readonly programRepository: Repository<Program>,
    @Inject(forwardRef(() => MediaService))
    protected readonly mediaService: MediaService,
  ) {}
  async findProgram(id: string): Promise<Program> {
    return this.programRepository.findOneOrFail({ where: { id } })
  }

  /**
   * Given a program id, finds the relevant program
   */
  async findMedia(id: string): Promise<Program> {
    return this.programRepository.findOneOrFail({ where: { id } })
  }

  /**
   * Given a set of filters, finds the relevant programs
   * @param filters
   */
  async findPrograms(filters?: FindProgramsQueryFilters): Promise<Program[]> {
    const query: FindManyOptions<Program> = {}

    if (filters?.ids?.length) {
      query.where = { ...query.where, id: In(filters.ids) }
    }

    return this.programRepository.find(query)
  }

  /**
   * Provided a program id, updates a program
   * otherwise inserts a new program
   * @param media
   */
  async upsertProgram(program: Partial<Program>) {
    if (program.id) {
      await this.programRepository.findOneOrFail({ where: { id: program.id } })
      return this.programRepository.save(program)
    } else {
      return this.programRepository.save({
        ...program,
      })
    }
  }

  async setMediasInProgram({
    programId,
    mediaIds,
  }: {
    programId: string
    mediaIds: string[]
  }): Promise<Program> {
    // quick check that all medias exist
    const foundMedias = await Promise.all(
      mediaIds.map(async (mediaId) => this.mediaService.findMedia(mediaId)),
    )

    if (foundMedias.length !== mediaIds.length) {
      throw new Error('Not all medias were found') // TODO be more specific + build domain error layer
    }

    await Promise.all(
      foundMedias.map(
        async (media) =>
          await this.mediaService.upsertMedia({
            id: media.id,
            programId,
          }),
      ),
    )

    return this.programRepository.findOneOrFail({ where: { id: programId } })
  }
}
