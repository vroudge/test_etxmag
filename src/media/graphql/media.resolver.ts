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
import { MediaService } from '../infrastructure/media.repo'
import { ProgramGraphql } from '../../program/adapters/graphql/program.object'
import { GlobalIdFieldResolver, ResolveConnectionField } from 'nestjs-relay'

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

@Resolver(() => Media)
export class MediaResolver extends GlobalIdFieldResolver(Media) {
  constructor(protected mediaService: MediaService) {
    super()
  }
  @Query(() => [Media])
  async medias(): Promise<Media[]> {
    const medias = await this.mediaService.findMedias()

    return medias as unknown as Media[]
  }

  @Mutation(() => Media)
  async upsertMedia(@Args('input') input: UpsertMediaInput) {
    return this.mediaService.upsertMedia(input)
  }

  @Mutation(() => Boolean)
  async deleteMedia() {}

  @ResolveConnectionField(() => ProgramGraphql)
  async program() {}
}
