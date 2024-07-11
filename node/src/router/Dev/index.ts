import { FastifyInstance } from "fastify";

export default async function Dev(app: FastifyInstance) {
  app.get('/', (_, reply) => {
    
    console
      .log(
        'Redirect GitHub developer of this API - IsaacGSS'
      )    

    return reply.redirect('https://github.com/IsaacGSS', 302)
  })

  app.get('/hello', (_, reply) => {
    
    console
      .log(
        'Hello World!'
      )

      const dev = { Hello: 'World!', year: 2024, dev_backend: true , view_router: new Date() }

      return  reply.status(200).send( { dev } )
  })
}