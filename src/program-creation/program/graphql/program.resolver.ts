import {
  Args,
  ArgsType,
  Field,
  InputType,
  Mutation,
  Parent,
  Query,
  Resolver,
} from '@nestjs/graphql'
import { Program } from './program.object'
import {
  Connection,
  GlobalIdFieldResolver,
  ResolveConnectionField,
  ResolvedGlobalId,
} from 'nestjs-relay'
import { Media } from '../../media/graphql/media.object'
import { ProgramService } from '../infrastructure/program.service'
import { MediaService } from '../../media/infrastructure/media.service'
import { PaginationArgs } from '../../../lib/node.resolver'
import { connectionFromArray } from 'graphql-relay/connection/arrayConnection'

@InputType()
class SetMediasInProgramInput {
  @Field(() => ResolvedGlobalId, { description: 'The id of the program' })
  public programId: ResolvedGlobalId

  @Field(() => [ResolvedGlobalId], {
    description: 'The id of the medias in the program',
  })
  public mediaIds: ResolvedGlobalId[]
}

@InputType()
class UpsertProgramInput {
  @Field(() => ResolvedGlobalId, {
    nullable: true,
    description: 'The name of the media',
  })
  id: ResolvedGlobalId

  @Field(() => String, {
    nullable: true,
    description: 'The name of the program',
  })
  name: string

  @Field(() => String, {
    description: 'The location of the program cover image',
  })
  coverImageLocation: string

  @Field(() => String, { description: 'The description of the program' })
  description: string
}

@InputType()
class FindProgramsFilters {
  @Field(() => [ResolvedGlobalId], { nullable: true })
  public ids?: ResolvedGlobalId[]
}

@Resolver(Program)
export class ProgramResolver extends GlobalIdFieldResolver(Program) {
  constructor(
    protected readonly programService: ProgramService,
    protected readonly mediaService: MediaService,
  ) {
    super()
  }
  @Query(() => [Program], { nullable: true, description: 'Find all programs' })
  async programs(
    @Args('input', { nullable: true }) input: FindProgramsFilters = {},
    @Args('pagination', { nullable: true }) pagination: PaginationArgs = {},
  ): Promise<Program[]> {
    const programs = await this.programService.findPrograms(
      {
        ids: input.ids?.map((e) => e.id),
      },
      pagination,
    )

    return programs.map(
      (program) => new Program(program as any as Program),
    ) as Program[]
  }

  @Mutation(() => Program, { description: 'Upsert a program' })
  async upsertProgram(@Args('input') input: UpsertProgramInput) {
    return this.programService.upsertProgram({
      ...input,
      id: input?.id?.id?.toString(),
    })
  }

  @Mutation(() => Program, { description: 'Set medias in a program' })
  public async setMediasInProgram(
    @Args('input') input: SetMediasInProgramInput,
  ): Promise<Program> {
    const program = await this.programService.setMediasInProgram({
      programId: input.programId.id,
      mediaIds: input.mediaIds.map((e) => e.id),
    })
    return new Program(program as unknown as Program)
  }

  @Mutation(() => Boolean, { description: 'Delete a program' })
  async deleteProgram(@Args('id') id: ResolvedGlobalId) {
    await this.programService.deleteProgram(id.id.toString())

    return true
  }

  @ResolveConnectionField(() => Media, {
    description: 'The medias in the program',
  })
  public async medias(
    @Parent() root: Program,
    @Args('pagination', { nullable: true }) pagination: PaginationArgs = {},
  ): Promise<Connection<Media>> {
    const medias = await this.mediaService.findMediasByProgram(
      root.id.toString(),
      pagination,
    )

    return connectionFromArray(medias as any as Media[], {})
  }
}
