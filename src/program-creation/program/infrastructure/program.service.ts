import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindManyOptions, In, Repository } from 'typeorm'
import { Program } from './program.entity'
import { MediaService } from '../../media/infrastructure/media.service'
import { LimitOffset } from '../../../lib/util'

export interface FindProgramsQueryFilters {
  ids?: string[]
}

@Injectable()
/**
 * Service for interacting with programs
 */
export class ProgramService {
  constructor(
    @InjectRepository(Program)
    protected readonly programRepository: Repository<Program>,
    @Inject(forwardRef(() => MediaService)) // Circular references are messy, thanks nest
    protected readonly mediaService: MediaService,
  ) {}

  /**
   * Given a program id, finds the relevant program
   * @param id
   */
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
   * @param pagination
   */
  async findPrograms(
    filters: FindProgramsQueryFilters = {},
    pagination: LimitOffset,
  ): Promise<Program[]> {
    const query: FindManyOptions<Program> = {}

    if (filters?.ids?.length) {
      query.where = { ...query.where, id: In(filters.ids) }
    }

    query.take = pagination.limit
    query.skip = pagination.offset

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

  /**
   * Given a program id, sets the medias in the program
   * @param programId
   * @param mediaIds
   */
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

    // to manage the ordering of medias in a given, they self-reference between themselves
    // which is an efficient tidbit to manage their positions between themselves
    let previousMediaId: string | undefined = undefined
    // first we reverse the array so we can persist the last media in the chain first
    for (const media of foundMedias.reverse()) {
      await this.mediaService.upsertMedia({
        id: media.id,
        programId,
        beforeMediaId: previousMediaId,
      })
      previousMediaId = media.id
    }

    //id 1 before 2
    //id 2 before 3
    //id 3 before null

    return this.programRepository.findOneOrFail({ where: { id: programId } })
  }

  /**
   * Given a program id, deletes the relevant program
   * @param id
   */
  public async deleteProgram(id: string) {
    return this.programRepository.delete({ id })
  }
}
