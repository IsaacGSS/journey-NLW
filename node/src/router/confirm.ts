import { FastifyInstance } from "fastify";
import prisma from "../lib/prisma";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export const confirm = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get('/:tripId/confirm', {
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
  (request, reply) => {
    return 'confirm'
  })
}