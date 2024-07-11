import { FastifyInstance } from "fastify";
import prisma from "../lib/prisma";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { getMailClient } from '../lib/mail';
import nodemailer from 'nodemailer';
import { FormatDate } from "../lib/formatDate";

export const trip = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post('/', 
  {
    schema: 
    {
      body: 
      z.object(
        {
          destination: z.string().min(4),
          ends_at: z.coerce.date(),
          starts_at: z.coerce.date(),
          name: z.string().min(1),
          email: z.string().email(),
          emails_to_invite: z.array(z.string().email())
        }
      )
    }
  } 
  , async (request, reply) => {

    const { destination, ends_at, starts_at, name, email, emails_to_invite } = request.body

    if(starts_at <= new Date()) {
      throw new Error('not starts at valid')
    }

    if(ends_at <= starts_at) {
      throw new Error('not ends at valid')
    }

    const trip = await prisma.trip.create(
      {
        data: 
        {
          destination,
          ends_at,
          starts_at,
          is_confirmed: true,
          Participant: 
          {
            createMany:
            {
              data: 
              [
                {
                  name,
                  email,
                  is_confirmed: true,
                  is_owner: true
                },
                ...emails_to_invite.map(email => {
                  return { email }
                })
              ]
            }
          }
        }
      }
    )

    const confirm = `http://localhost:3333/${trip.id}/confirm`

    const mail = await getMailClient()

    const message = await mail.sendMail({
      from: 
      {
        name: 'Equipe',
        address: 'hello@gmail.com',
      },
      to:
      {
        name: name,
        address: email,
      },
      subject: `Confirme sua viagem para ${destination} em ${FormatDate(starts_at,'d "de" MMMM')}.`,
      html: 
      `
        <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
          <p>Voce solicitou a criacao de uma viagem para <strong>${destination}</strong> nas datas de <strong>${FormatDate(starts_at)}</strong> ate <strong>${FormatDate(ends_at)}</strong></p>
          <p></p>
          <p>Para confirmar sua viagem, clicque no link abaixo:</p>
          <p></p>
          <p>
            <a href="${confirm}">Confirmar viagem</a>
          </p>
          <p></p>
          <p>Caso voce nao saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
        </div>
      `
    })

    console.log(nodemailer.getTestMessageUrl(message));
    

    return reply.status(201).send( trip.id )
  })
}