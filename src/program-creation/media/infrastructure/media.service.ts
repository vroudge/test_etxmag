import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindManyOptions, In, Repository } from 'typeorm'
import { ProgramService } from '../../program/infrastructure/program.service'
import { Media } from './media.entity'
import { Program } from '../../program/infrastructure/program.entity'

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
   */
  async findMedias(filters?: FindMediasFilters): Promise<Media[]> {
    const query: FindManyOptions<Media> = {}

    if (filters?.ids?.length) {
      query.where = { ...query.where, id: In(filters.ids) }
    }

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
      return this.mediaRepository.save(media)
    } else {
      return this.mediaRepository.save({
        ...media,
      })
    }
  }

  public async getMediaProgram(id: string) {
    return Promise.resolve(undefined)
  }
}
