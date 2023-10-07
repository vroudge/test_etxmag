import { Field, ObjectType } from '@nestjs/graphql'
import { NodeInterface, NodeType } from 'nestjs-relay'

@NodeType()
export class ProgramGraphql extends NodeInterface {
  constructor(props: Partial<ProgramGraphql>) {
    super()
    Object.assign(this, props)
  }

  @Field(() => String, { description: 'The name of the media' })
  public name: string

  @Field(() => String, { description: 'The location of the media file' })
  public coverImageLocation: string

  @Field(() => String, { description: 'The description of the media' })
  public description: string
}
