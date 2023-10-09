import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Program } from '../../program/infrastructure/program.entity'

@Entity()
export class Media {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column()
  public name!: string

  @Column()
  public fileLocation!: string

  @Column()
  public duration!: number

  @Column()
  public description!: string

  @ManyToOne(() => Program, (program) => program.medias)
  public program!: Program

  @OneToOne(() => Media, (media) => media.beforeMedia, {
    nullable: true,
    onDelete: 'CASCADE', // Cascade is very dangerous! specifically set here to make fixture management easier because of self-referencing in the entity
  })
  @JoinColumn()
  public beforeMedia?: Media

  // utils field because we do not have clean DTOs
  public programId?: string

  @CreateDateColumn()
  public createdAt!: Date

  @UpdateDateColumn()
  public updatedAt!: Date
}
