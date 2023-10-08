import { Module } from '@nestjs/common'
import { ProgramResolver } from './program/graphql/program.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Program } from './program/infrastructure/program.entity'
import { ProgramService } from './program/infrastructure/program.service'
import { Media } from './media/infrastructure/media.entity'
import { MediaService } from './media/infrastructure/media.service'
import { MediaResolver } from './media/graphql/media.resolver'

@Module({
  imports: [TypeOrmModule.forFeature([Program, Media])],
  exports: [TypeOrmModule, MediaService, ProgramService],
  controllers: [],
  providers: [ProgramResolver, MediaResolver, MediaService, ProgramService],
})
export class ProgramCreationModule {}
