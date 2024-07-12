import { FastifyInstance } from "fastify";
import prisma from "../lib/prisma";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import getMailClient from "../lib/mail";

export async function confirm(app: FastifyInstance) {
  app
  .withTypeProvider<ZodTypeProvider>()
  .get('/:tripId/confirm', 
  {
    schema: 
      {
        params: 
          z.object(
            {
              tripId: z.string().ulid()
            }
          )
      }
  },
  async (request, reply) => {

    const { tripId:id } = request.params

    const trip = await prisma.trip.findUnique({
      where: 
      {
        id
      },
      select: 
      {
        is_confirmed: true,
        destination: true,
        created_at: true,
        ends_at: true,
        participant: 
          {
            select: 
              {
                email: true
              }
          }
      }
    })
 
    if(!trip  || trip.is_confirmed){
      return reply.redirect('http://localhost:3000')
    }

    await prisma.trip.update({
      data:
      {
        is_confirmed: true
      },
      where:
      {
        id
      }
    })

    return reply.status(200).send(`foi confirmado o convite para a viagem a: ${trip.destination}`)
  })
}