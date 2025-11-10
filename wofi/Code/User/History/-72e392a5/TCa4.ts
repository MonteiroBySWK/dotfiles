import express from "express";
import helmet from "helmet";
import cors from "cors";

const app = express();
const PORT = 3001;

//app.use(helmet());
//app.use(cors());

app.get("/", (req, res) => {
  console.log(req);
  return "Hello, World";
})

app.listen(PORT, () => {
  console.log("Escutando na porta: ", PORT);
})
