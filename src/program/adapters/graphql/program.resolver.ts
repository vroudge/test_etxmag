import { Field, Resolver } from '@nestjs/graphql'
import { ProgramGraphql } from './program.object'
import { GlobalIdFieldResolver } from 'nestjs-relay'

@Resolver(() => ProgramGraphql)
export class ProgramResolver extends GlobalIdFieldResolver(ProgramGraphql) {
  @Field(() => [ProgramGraphql])
  async programs(): Promise<ProgramGraphql[]> {
    return []
  }
}
