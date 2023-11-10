const express = require('express');
const { Deepgram } = require('@deepgram/sdk');
const fs = require('fs');
const multer = require('multer');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

function sendToDeepgram(pathToFile) {
    const deepgramApiKey = 'afeb102a44298094422c26b52c00632cef4b2724';
    const mimetype = 'audio/wav';
  
    return new Promise((resolve, reject) => {
      // Inicializa o SDK da Deepgram
      const deepgram = new Deepgram(deepgramApiKey);
  
      console.log('Solicitando transcrição...');
  
      deepgram.transcription.preRecorded(
        { buffer: fs.readFileSync(pathToFile), mimetype },
        { smart_format: true, model: 'nova', language: 'en-US' },
      )
        .then((transcription) => {
          resolve({ transcription });
        })
        .catch((err) => {
          console.error('Erro ao solicitar transcrição:', err);
          reject({ error: 'Erro ao solicitar transcrição' });
        });
    });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Obtém o caminho do diretório atual do script
      const currentDirectory = path.dirname(__filename);
  
      // Define o caminho para a pasta "uploads" no mesmo diretório
      const uploadsPath = path.join(currentDirectory, 'uploads');
  
      cb(null, uploadsPath);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + ext);
    }
  });
  

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/musicRecording.html');
});

app.post('/upload', upload.single('audio'), async (req, res) => {
  try {
    // Caminho do arquivo de áudio enviado
    const filePath = req.file.path;

    sendToDeepgram(filePath)
    .then((result) => {
      console.log('Transcrição:', result.transcription);
      res.json(result.transcription);
    })
    .catch((error) => {
      res.status(500).json({ error: error.error });
    });

    // Retornando o resultado como JSON
  } catch (error) {
    console.error('Erro ao processar a transcrição:', error);
    res.status(500).json({ error: 'Erro ao processar a transcrição' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});