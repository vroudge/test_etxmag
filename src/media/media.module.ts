import { Module } from '@nestjs/common'
import { MediaResolver } from './graphql/media.resolver'
import { Media } from './infrastructure/media.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MediaService } from './infrastructure/media.repo'

@Module({
  imports: [TypeOrmModule.forFeature([Media])],
  exports: [TypeOrmModule],
  controllers: [],
  providers: [MediaResolver, MediaService],
})
export class MediaModule {}
