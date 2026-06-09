import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";



const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cookieParser());

import userRouter from "./routes/user.route.js";
import messageRouter from "./routes/message.route.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/messages", messageRouter);

export { app };
