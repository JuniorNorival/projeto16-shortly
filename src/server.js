import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import authRouter from "./routers/authRouter.js";
import urlRouter from "./routers/urlRouter.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(authRouter);
app.use(urlRouter);

app.listen(process.env.PORT, () => {
  console.log("=================================");
  console.log(`Servidor Rodando na porta ${process.env.PORT}`);
  console.log("=================================");
});
