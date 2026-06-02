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
const PORT = process.env.PORT || 3000;



const usuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  idade: { type: Number, required: true }
}, { timestamps: true })

const Usuario = mongoose.model("Usuario", usuarioSchema);


//criar usuarios
app.post("/usuarios", async (req, res) => {
  const usuariocriado = await Usuario.create(req.body);
  res.status(201).json(usuariocriado);
});

//Listar usuarios
app.get("/usuarios", async (req, res) => {
  const usuarios = await Usuario.find();
  res.status(200).json(usuarios);
});



async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado ao MongoDB Atlas");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Erro ao conectar:", error);
  }
}

startServer();