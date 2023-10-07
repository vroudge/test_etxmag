import Fastify from 'fastify'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

// to not touch too much the existing boilerplate, we will use the same Fastify instance
const fastify = Fastify({
  logger: true,
})

const start = async () => {
  try {
    // wrap it into the NestJS fastify adapter
    const adapter = new FastifyAdapter(fastify)

    // create the NestJS application
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      adapter,
    )
    // start listening
    await app.listen(process.env?.HTTP_LISTEN ?? 8080)
  } catch (error) {
    console.error(error)
  }
}

start()
