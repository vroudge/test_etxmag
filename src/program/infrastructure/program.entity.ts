import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Media } from '../../media/infrastructure/media.entity'

@Entity()
export class Program {
  @PrimaryColumn()
  public id!: string

  @Column()
  public name!: string

  @Column()
  public coverImageLocation!: string

  @Column()
  public description!: string

  @OneToMany(() => Media, (media) => media.program)
  public medias!: Media[]

  @CreateDateColumn()
  public createdAt!: Date

  @UpdateDateColumn()
  public updatedAt!: Date
}
