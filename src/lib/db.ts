import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer | null = null;

const isDev = () => {
  return process.env.NODE_ENV === "development" || process.env.FUNCTIONS_EMULATOR;
};

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  if (!isDev()) {
    await mongoose.connect(`mongodb+srv://bwstats-user:${process.env.MONGODB_PWD}@shivam-test1.lwr9z.mongodb.net/bwstats?retryWrites=true&w=majority`, { maxPoolSize: 2 });
    console.log("Connected to MongoDB");
  } else {
    if (!mongoServer) {
      mongoServer = await MongoMemoryServer.create();
    }
    await mongoose.connect(mongoServer.getUri(), { maxPoolSize: 2 });
    console.log("Connected to MOCK MongoDB - NOT REAL DB! JUST FOR TESTING");
  }
};

// Export the connection function instead of auto-connecting
export { connectDB };

export default mongoose;
