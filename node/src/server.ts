import { app } from "./register";

app.listen(
  {
    host: '0.0.0.0',
    port: 3333
  }
)
  .then(() => {
    console.log(
      'Runner server HTTP 🍃'
    );    
  })