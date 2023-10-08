import { Field, ID, ObjectType } from '@nestjs/graphql'
import { NodeInterface, NodeType } from 'nestjs-relay'

@NodeType()
export class Media extends NodeInterface {
  constructor(props: Partial<Media>) {
    super()
    Object.assign(this, props)
  }

  @Field(() => String, { description: 'The name of the media' })
  public name: string

  @Field(() => String, { description: 'The location of the media file' })
  public fileLocation: string

  @Field(() => Number, { description: 'The duration of the media in seconds' })
  public duration: number

  @Field(() => String, { description: 'The description of the media' })
  public description: string
}
