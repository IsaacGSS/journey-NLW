import app from './App'
import Dev from './router/Dev'
import cors from '@fastify/cors'
import { trip } from './router/trips'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'

// plugin of fastify and zod
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);


//* Router from Developer*//
app.register(Dev, {
  prefix: '/dev'
})

// cors
app.register(cors, {
  /* URL from Backend and FrontEnd Developer*/
  origin: [
    'http://localhost:3000/'
  ]
})

/* Routes */

app.register(trip, {
  prefix: '/trip'
})

export { app }