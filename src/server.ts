import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db";

dotenv.config();

const port = process.env.PORT ? Number(process.env.PORT) : 5000;

const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(port, () => {
    console.log(`Server running on port ${port}.\nhttp://localhost:${port}`);
  });
};

void startServer();
