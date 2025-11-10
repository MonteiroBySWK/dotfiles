import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// registrar as rotas aqui

app.listen(3000, () => {
  console.log("listen")
})