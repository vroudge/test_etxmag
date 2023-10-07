import { Module } from '@nestjs/common'
import { GlobalIdScalar } from 'nestjs-relay'
import { NodeResolver } from './node.resolver'
import { ProgramModule } from '../program/program.module'
import { MediaModule } from '../media/media.module'
import { MediaService } from '../media/infrastructure/media.repo'

@Module({
  imports: [MediaModule],
  exports: [],
  controllers: [],
  providers: [GlobalIdScalar, MediaService, NodeResolver],
})
export class LibModule {}
