import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { startDB } from "./src/config/database.js";

const app = express();
const PORT = process.env.PORT || 3003;

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// app.use("/api",);

app.listen(PORT, async () => {
  await startDB();
  console.log(`servidor listo en el puerto ${PORT}`);
});