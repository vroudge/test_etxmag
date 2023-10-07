import { Module } from "@nestjs/common"
import { ProgramResolver } from "./adapters/graphql/program.resolver"

@Module({
  imports: [],
  exports: [],
  controllers: [],
  providers: [ProgramResolver],
})
export class ProgramModule {}
