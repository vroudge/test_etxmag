import { Args, Field, InputType, Mutation, Resolver } from '@nestjs/graphql'
import { Program } from './program.object'
import { GlobalIdFieldResolver, ResolveConnectionField } from 'nestjs-relay'
import { Media } from '../../media/graphql/media.object'
import { ProgramService } from '../infrastructure/program.service'
import { Arg } from 'type-graphql'
import { Inject } from '@nestjs/common'
import { MediaService } from '../../media/infrastructure/media.service'

@InputType()
class SetMediasInProgramInput {
  @Field(() => String, { description: 'The id of the program' })
  public programId: string

  @Field(() => String, { description: 'The id of the medias in the program' })
  public mediaIds: string[]
}

@InputType()
class UpsertProgramInput {
  @Field(() => String, { nullable: true, description: 'The name of the media' })
  name: string

  @Field(() => String, { description: 'The location of the media file' })
  coverImageLocation: string

  @Field(() => String, { description: 'The description of the media' })
  description: string
}

@Resolver(() => Program)
export class ProgramResolver extends GlobalIdFieldResolver(Program) {
  constructor(
    @Inject(ProgramService) protected readonly programService: ProgramService,
  ) {
    super()
  }
  @Field(() => [Program])
  async programs(): Promise<Program[]> {
    return []
  }

  @Mutation(() => Media)
  async upsertMedia(@Args('input') input: UpsertProgramInput) {
    return this.programService.upsertProgram(input)
  }

  @Mutation(() => Program)
  public async setMediasInProgram(
    @Arg('input') input: SetMediasInProgramInput,
  ): Promise<Program> {
    const program = await this.programService.setMediasInProgram(input)

    return new Program(program as unknown as Program)
  }

  @ResolveConnectionField(() => Media, {
    description: 'The medias in the program',
  })
  async medias() {}
}
