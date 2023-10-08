import { Resolver } from '@nestjs/graphql'
import {
  NodeFieldResolver,
  NodeInterface,
  ResolvedGlobalId,
} from 'nestjs-relay'
import { MediaService } from '../program-creation/media/infrastructure/media.service'
import { ResolvedNode } from 'nestjs-relay/dist/cjs/global-object-identification/node'
import { Media } from '../program-creation/media/graphql/media.object'
import { ProgramService } from '../program-creation/program/infrastructure/program.service'
import { Program } from '../program-creation/program/graphql/program.object'

@Resolver(NodeInterface)
export class NodeResolver extends NodeFieldResolver {
  constructor(
    protected mediaService: MediaService, // protected program: ProgramService,
    protected programService: ProgramService, // protected program: ProgramService,
  ) {
    super()
  }

  /**
   * When fetching a single node by global id, this method is called to resolve the node.
   * It does a little bit of "any" quirk here because 1. time 2. I have separate
   * types for my entities and my graphql objects.
   * @param resolvedGlobalId
   */
  // @ts-ignore
  async resolveNode(resolvedGlobalId: ResolvedGlobalId): ResolvedNode {
    console.log('resolvedGlobalId', resolvedGlobalId)
    switch (resolvedGlobalId.type) {
      case 'Media':
        const media = await this.mediaService.findMedia(
          resolvedGlobalId.toString(),
        )
        return media ? new Media(media as any as Media) : null
      case 'Program':
        const program = await this.programService.findProgram(
          resolvedGlobalId.toString(),
        )
        return program ? new Program(program as any as Program) : null
      default:
        return null
    }
  }
}
