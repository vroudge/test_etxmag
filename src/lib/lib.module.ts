import { Module } from '@nestjs/common'
import { GlobalIdScalar } from 'nestjs-relay'
import { NodeResolver } from './node.resolver'
import { ProgramCreationModule } from '../program-creation/program.module'
import { ProgramService } from '../program-creation/program/infrastructure/program.service'
import { MediaService } from '../program-creation/media/infrastructure/media.service'

@Module({
  imports: [ProgramCreationModule],
  exports: [],
  controllers: [],
  providers: [GlobalIdScalar, NodeResolver],
})
export class LibModule {}
