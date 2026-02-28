import { Sequelize } from "sequelize";
import "dotenv/config";

const DB_URI = process.env.DB_URI;

const sequelize = new Sequelize(DB_URI, {
  dialect: "postgres",
  logging: false,
});

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
}

async function syncModels() {
  try {
    await sequelize.sync({ alter: true });
    console.log("All models were synchronized (altered) successfully.");
  } catch (error) {
    console.error("Model sync error:", error.message);
    process.exit(1);
  }
}

export { sequelize, connectDB, syncModels };
