require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Conexão com o banco
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log('✅ Conectado ao banco de dados!');
});

// Função para validar com Gemini
async function validarComentario(texto) {
const prompt = `Avalie o comentário: "${comentario}". Responda apenas com 'aprovado' ou 'reprovado'.`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    const resposta = response.data.candidates[0].content.parts[0].text.toLowerCase();
    return resposta.includes('sim');
  } catch (error) {
    console.error('Erro com Gemini:', error.message);
    return false; // Se der erro, aprova por segurança
  }
}

let status = 'aprovado'; // valor padrão

try {
  const prompt = `Avalie o comentário: "${comentario}". Responda apenas com 'aprovado' ou 'reprovado'.`;

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    }
  );

  const respostaIA = response.data.candidates[0].content.parts[0].text.trim().toLowerCase();

  if (respostaIA.includes('reprovado')) {
    status = 'reprovado';
  }

} catch (err) {
  console.error("Erro com Gemini:", err.message);
  return res.status(500).json({ erro: "Erro ao se comunicar com a IA" });
}

// salva no banco
await connection.query(
  'INSERT INTO comentarios (texto, status, criado_em) VALUES (?, ?, NOW())',
  [comentario, status]
);


// Rota POST - adicionar comentário
app.post('/comentario', async (req, res) => {
  const textoOriginal = req.body.texto;
  const isRuim = await validarComentario(textoOriginal);
  const textoFinal = isRuim ? 'Comentário excluído' : textoOriginal;
  const status = isRuim ? 'recusado' : 'aprovado';

  const sql = 'INSERT INTO comentarios (texto, status) VALUES (?, ?)';
  db.query(sql, [textoFinal, status], (err, result) => {
    if (err) return res.status(500).send('Erro ao salvar comentário');
    res.send({ id: result.insertId, texto: textoFinal, status });
  });
});

// Rota GET - ver todos os comentários
app.get('/comentarios', (req, res) => {
  db.query('SELECT * FROM comentarios', (err, results) => {
    if (err) return res.status(500).send('Erro ao buscar comentários');
    res.send(results);
  });
});

// Inicia servidor
app.listen(process.env.PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${process.env.PORT}`);
});
