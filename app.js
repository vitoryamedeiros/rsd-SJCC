const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

// Conexão com banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'comentariosdb'
});

// Lista de palavras proibidas
const palavrasProibidas = ['ruim', 'idiota', 'burro', 'besta', 'lixo', 'horrível'];

function verificarComentario(texto) {
  const textoLower = texto.toLowerCase();
  return palavrasProibidas.some(palavra => textoLower.includes(palavra));
}

// POST para receber e analisar comentários
app.post('/comentarios', (req, res) => {
  let { texto } = req.body;
  let status = 'aprovado';

  if (verificarComentario(texto)) {
    texto = 'Comentário excluído';
    status = 'reprovado';
  }

  const criado_em = new Date();

  connection.query(
    'INSERT INTO comentarios (texto, status, criado_em) VALUES (?, ?, ?)',
    [texto, status, criado_em],
    (error, results) => {
      if (error) {
        console.error('Erro ao salvar comentário:', error);
        return res.status(500).json({ erro: 'Erro ao salvar comentário' });
      }

      res.status(201).json({ id: results.insertId, texto, status, criado_em });
    }
  );
});

// GET para listar comentários
app.get('/comentarios', (req, res) => {
  connection.query('SELECT * FROM comentarios', (error, results) => {
    if (error) {
      console.error('Erro ao buscar comentários:', error);
      return res.status(500).json({ erro: 'Erro ao buscar comentários' });
    }

    res.json(results);
  });
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
