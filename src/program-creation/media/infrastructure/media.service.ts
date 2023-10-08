import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindManyOptions, FindOptionsOrderValue, In, Repository } from 'typeorm'
import { ProgramService } from '../../program/infrastructure/program.service'
import { Media } from './media.entity'
import { Program } from '../../program/infrastructure/program.entity'
import { LimitOffset, TypeOrmLimitOffset } from '../../../lib/util'

export interface FindMediasFilters {
  ids?: string[]
}

export interface MediaUpsertDTO {
  id?: string
  name?: string
  fileLocation?: string
  duration?: number
  description?: string
  programId?: string
}

@Injectable()
/**
 * Service for interacting with media
 */
export class MediaService {
  constructor(
    @InjectRepository(Media)
    protected readonly mediaRepository: Repository<Media>,
    @Inject(ProgramService)
    protected readonly programService: ProgramService,
  ) {}

  /**
   * Given a media id, finds the relevant media
   */
  async findMedia(id: string): Promise<Media> {
    return this.mediaRepository.findOneOrFail({ where: { id } })
  }

  /**
   * Given a set of filters, finds the relevant media
   * @param filters
   * @param pagination
   */
  async findMedias(
    filters: FindMediasFilters = {},
    pagination: LimitOffset = {},
  ): Promise<Media[]> {
    const query: FindManyOptions<Media> = {}

    if (filters?.ids?.length) {
      query.where = { ...query.where, id: In(filters.ids) }
    }

    query.take = pagination.limit
    query.skip = pagination.offset

    return this.mediaRepository.find(query)
  }

  /**
   * Provided a media id, updates a media
   * otherwise inserts a new media
   * @param media
   */
  async upsertMedia(media: MediaUpsertDTO): Promise<Media> {
    // TODO this really needs a DTO class
    if (media.id) {
      await this.mediaRepository.findOneOrFail({ where: { id: media.id } })
    }
    return this.mediaRepository.save({
      ...media,
      ...(media?.programId && { program: { id: media.programId } }),
    })
  }

  /**
   * Get the parent program of a given media
   * @param id
   */
  public async getMediaProgram(id: string): Promise<Program | null> {
    const media: Media = await this.findMedia(id)
    return media?.programId
      ? await this.programService.findProgram(media?.programId)
      : null
  }

  /**
   * Given a media id, deletes the relevant media
   * @param id
   */
  async deleteMedia(id: string) {
    console.log(id)
    return this.mediaRepository.delete({ id })
  }

  public async findMediasByProgram(id: string, { limit, offset }: LimitOffset) {
    const query = {
      order: { createdAt: 'DESC' as FindOptionsOrderValue },
      where: { program: { id } },
      take: limit,
      skip: offset,
    }

    return this.mediaRepository.find(query)
  }
}
