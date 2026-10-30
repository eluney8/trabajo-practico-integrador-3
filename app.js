import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { startDB } from "./src/config/database.js";
import { authRouter } from "./src/routes/auth.routes.js";
import { userRouter } from "./src/routes/user.routes.js";
import { eventRouter } from "./src/routes/event.routes.js";
import { categoryRouter } from "./src/routes/category.routes.js";

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

app.use("/api", authRouter, userRouter, eventRouter, categoryRouter);

app.listen(PORT, async () => {
  await startDB();
  console.log(`servidor listo en el puerto ${PORT}`);
});
