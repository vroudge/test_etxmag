import { Resolver } from '@nestjs/graphql'
import {
  NodeFieldResolver,
  NodeInterface,
  ResolvedGlobalId,
} from 'nestjs-relay'
import { MediaService } from '../media/infrastructure/media.repo'
import { ResolvedNode } from 'nestjs-relay/dist/cjs/global-object-identification/node'
import { Media } from '../media/graphql/media.object'

@Resolver(NodeInterface)
export class NodeResolver extends NodeFieldResolver {
  constructor(
    protected mediaService: MediaService, // protected program: ProgramService,
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
        return media ? new Media(media as unknown as any) : null
      default:
        return null
    }
  }
}
