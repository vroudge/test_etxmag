import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
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

  public programId?: string

  @CreateDateColumn()
  public createdAt!: Date

  @UpdateDateColumn()
  public updatedAt!: Date
}
