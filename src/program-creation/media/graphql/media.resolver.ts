import {
  Query,
  Mutation,
  Resolver,
  ResolveField,
  InputType,
  Args,
  Field,
} from '@nestjs/graphql'
import { Media } from './media.object'
import { MediaService } from '../infrastructure/media.service'
import { Program } from '../../program/graphql/program.object'
import { GlobalIdFieldResolver, ResolvedGlobalId } from 'nestjs-relay'
import { connectionFromArray } from 'graphql-relay/connection/arrayConnection'
import { PaginationArgs } from '../../../lib/node.resolver'
import { describe } from 'node:test'

@InputType()
class UpsertMediaInput {
  @Field(() => String, { nullable: true, description: 'The name of the media' })
  public id: string

  @Field(() => String, { description: 'The name of the media' })
  public name: string

  @Field(() => String, { description: 'The location of the media file' })
  public fileLocation: string

  @Field(() => Number, { description: 'The duration of the media in seconds' })
  public duration: number

  @Field(() => String, { description: 'The description of the media' })
  public description: string
}

@InputType()
class FindMediasFilters {
  @Field(() => [String], {
    nullable: true,
    description: "The id's of the medias",
  })
  public ids?: string[]
}

@Resolver(() => Media)
export class MediaResolver extends GlobalIdFieldResolver(Media) {
  constructor(protected mediaService: MediaService) {
    super()
  }
  @Query(() => [Media], { description: 'Find all medias' })
  async medias(
    @Args('filters', { nullable: true }) filters: FindMediasFilters,
    @Args('pagination', { nullable: true }) pagination: PaginationArgs,
  ): Promise<Media[]> {
    const medias = await this.mediaService.findMedias(filters, pagination)

    return medias as unknown as Media[]
  }

  @Mutation(() => Media, { description: 'Upsert a media' })
  async upsertMedia(@Args('input') input: UpsertMediaInput) {
    return this.mediaService.upsertMedia(input)
  }

  @Mutation(() => Boolean, { description: 'Delete a media' })
  async deleteMedia(@Args('id') id: ResolvedGlobalId) {
    await this.mediaService.deleteMedia(id.toString())

    return true
  }

  @ResolveField(() => Program, { nullable: true })
  async program(root: Media) {
    return this.mediaService.getMediaProgram(root.id.toString())
  }
}
