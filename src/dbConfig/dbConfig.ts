import mongoose from "mongoose";

export const connect = async () => {
  try {

    await mongoose.connect(process.env.MONGO_URL!)
    const connection = mongoose.connection
    connection.on('connection', () => {
      console.log("Connected successfully to database ");
    })
    connection.on('error', (err) => {
      console.log("Error while connecting to database ", + err);
      process.exit()
    })


  } catch (error) {
    console.log("something went wrong  while connecting to database ", error);

  }
}