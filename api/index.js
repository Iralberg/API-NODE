import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import dns from "dns";
import cors from "cors";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;

const usuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  idade: { type: Number, required: true }
}, { timestamps: true });

const Usuario = mongoose.models.Usuario || mongoose.model("Usuario", usuarioSchema);

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(MONGO_URI);
  isConnected = true;
}

app.post("/usuarios", async (req, res) => {
  await connectDB();

  const usuariocriado = await Usuario.create(req.body);
  res.status(201).json(usuariocriado);
});

app.get("/usuarios", async (req, res) => {
  await connectDB();

  const usuarios = await Usuario.find();
  res.status(200).json(usuarios);
});

export default app;