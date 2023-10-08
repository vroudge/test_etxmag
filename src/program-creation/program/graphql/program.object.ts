import { Field, ObjectType } from '@nestjs/graphql'
import { NodeInterface, NodeType } from 'nestjs-relay'
import { Media } from '../../media/graphql/media.object'

@NodeType()
export class Program extends NodeInterface {
  constructor(props: Partial<Program>) {
    super()
    // TODO - Create parent base class for this and Media
    Object.assign(this, props)
  }

  @Field(() => String, { description: 'The name of the media' })
  public name: string

  @Field(() => String, { description: 'The location of the media file' })
  public coverImageLocation: string

  @Field(() => String, { description: 'The description of the media' })
  public description: string
}
