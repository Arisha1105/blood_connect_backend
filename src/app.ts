import express, { ErrorRequestHandler, Request, Response } from "express";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(express.json({ limit: "10kb" }));

app.use("/auth", authRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
};

app.use(errorHandler);

export default app;
