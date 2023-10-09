import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  FindManyOptions,
  FindOptionsOrderValue,
  In,
  IsNull,
  Repository,
} from 'typeorm'
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
  beforeMediaId?: string
}

@Injectable()
/**
 * Service for interacting with media
 */
export class MediaService {
  // TODO this really needs a DTO class-validator system
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
    if (media.id) {
      await this.mediaRepository.findOneOrFail({ where: { id: media.id } })
    }
    console.log(media)
    return this.mediaRepository.save({
      ...media,
      ...(media?.programId && { program: { id: media.programId } }),
      ...(media?.beforeMediaId && { beforeMedia: { id: media.beforeMediaId } }),
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
    return this.mediaRepository.delete({ id })
  }

  public async findMediasByProgram(id: string, { limit, offset }: LimitOffset) {
    // Since we've used self reference to manage ordering of medias in a program
    // we'll make this the default sort order
    // find the "first media" in the program, which is before no other (null on afterMediaId)
    const firstMedia = (await this.mediaRepository.findOne({
      where: { program: { id }, beforeMedia: IsNull() },
    })) as Media
    const medias = [firstMedia]
    // a little recursive logic: keep find the next media until we've found them all
    const findNextMedia = async (media: Media) => {
      const nextMedia: Media | null = await this.mediaRepository.findOne({
        where: { program: { id }, beforeMedia: { id: media.id } },
      })
      if (nextMedia) {
        medias.push(nextMedia)
        await findNextMedia(nextMedia)
      } else {
        return
      }
    }

    await findNextMedia(firstMedia)

    // reverse again to ensure we have the original order, splice to guarantee a correct limit/offset
    return medias.reverse().splice(offset || 0, limit)

    //TODO can this be done straight via the DB or the ORM?
  }
}
