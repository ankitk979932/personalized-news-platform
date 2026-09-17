import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import News from "../models/News.js";
import User from "../models/User.js";
import { demoUser, newsData } from "./newsData.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    await Promise.all([User.deleteMany({}), News.deleteMany({})]);

    const hashedPassword = await bcrypt.hash(demoUser.password, 12);

    await User.create({
      ...demoUser,
      password: hashedPassword
    });

    await News.insertMany(newsData);

    console.log("Database seeded successfully");
    console.log(`Demo login: ${demoUser.email} / ${demoUser.password}`);
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();
