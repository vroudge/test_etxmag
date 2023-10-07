import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Media } from './media.entity'
import { FindManyOptions, In, Repository } from 'typeorm'
import { generateGlobalId } from '../../lib/utils'

export interface FindMedias {
  ids?: string[]
}

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media) protected mediaRepository: Repository<Media>,
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
  async findMedias(filters?: FindMedias): Promise<Media[]> {
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
  async upsertMedia(media: Partial<Media>) {
    if (media.id) {
      await this.mediaRepository.findOneOrFail({ where: { id: media.id } })
      return this.mediaRepository.save(media)
    } else {
      // const id = generateGlobalId('Media')
      return this.mediaRepository.save({
        ...media,
      })
    }
  }
}
