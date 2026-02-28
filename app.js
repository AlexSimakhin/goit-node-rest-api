import express from "express";
import morgan from "morgan";
import cors from "cors";

import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";
import { connectDB, syncModels } from "./db/sequelize.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/api/auth", authRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const start = async () => {
  try {
    await connectDB();
    await syncModels();

    app.listen(PORT, () => {
      console.log(`Server is running. Use our API on port: ${PORT}`);
    });

  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

start();
