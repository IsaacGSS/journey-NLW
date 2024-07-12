import { FastifyInstance } from "fastify";
import prisma from "../lib/prisma";
import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export async function getTrip(app: FastifyInstance) {
  app
  .get('/', async (_, reply) => {
    const destination = await prisma.trip.findMany()

    if(destination.length <= 0 || null || undefined) {
     return reply.status(400).send({ messageError: 'not`s destination' })
    }

    return reply.status(200).send({ destination })
  })

  app
  .withTypeProvider<ZodTypeProvider>()
  .get('/:destination', {
    schema: {
      params: z.object({
        destinationId: z.string().min(1).uuid()
      })
    }
  } , async (request, reply) => {

    const { destinationId } = request.params

    const destination = await prisma.trip.findUnique({
      where: {
        id: destinationId
      }
    })

    if(destination == null || undefined){
      return reply.status(400).send({ messageError: 'not`s destination' })
    }

    return reply.status(200).send({ destination })
  })
}