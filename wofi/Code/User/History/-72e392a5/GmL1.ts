import express, { type Response } from "express";
import helmet from "helmet";
import cors from "cors";

const app = express();
const PORT = 3001;

//app.use(helmet());
//app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send({"body": "Hello World"})
})

app.listen(PORT, () => {
  console.log("Escutando na porta: ", PORT);
})
