import mongoose from "mongoose";

export const startDB = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/tp-integrador-3";
    await mongoose.connect(mongoUri);
    console.log("conectado a la bd correctamente");
  } catch (error) {
    console.log("no se pudo conectar a la bd", error);
  }
};
