import mongoose from "mongoose";
import app from "./app"


const port = process.env.PORT;

const DB: string | undefined = process.env.DATABASE;
const connectDb = async (): Promise<void> => {

  if (!DB) {
    throw new Error("Database connection string is not provided. -b");
  }
  
  try {
    const connect = await mongoose.connect(DB);
    console.log(
      "database connected: ",
      connect.connection.host,
      connect.connection.name
    );

  } catch (error) {
    console.error("failed to connect to the database");
    console.error(error)
  }

};
connectDb();


app.listen(port, () => {
  console.log(
    `[server]: hello, Server is running at http://localhost:${port}`
  );
});