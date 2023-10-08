import { Module } from '@nestjs/common'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Media } from './program-creation/media/infrastructure/media.entity'
import { LibModule } from './lib/lib.module'
import { ProgramCreationModule } from './program-creation/program.module'
import { Program } from './program-creation/program/infrastructure/program.entity'

@Module({
  imports: [
    // deals with setting up the graphql server, the playground, etc.
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/public/schema.gql'),
      playground: true,
      sortSchema: false,
    }),
    // Deals with setting up the database connection.
    // For the sake of simplicity, the variables are here
    // and set to synchronize=true to not lose time with migrations.
    // In a real world application, one should use migrations
    // and environment variables should be injected to the application ctx
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'server',
      password: 'staging',
      database: 'app',
      entities: [Media, Program],
      synchronize: true,
    }),
    LibModule,
    ProgramCreationModule,
  ],
  exports: [],
  controllers: [],
  providers: [],
})
/**
 * Our main app module
 */
export class AppModule {}
