const express = require('express');
const { Deepgram } = require('@deepgram/sdk');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Configurar o middleware body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurar o middleware multer para processar uploads de arquivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

function sendToDeepgram(buffer) {
  const deepgramApiKey = 'afeb102a44298094422c26b52c00632cef4b2724';
  const mimetype = 'audio/wav';

  return new Promise((resolve, reject) => {
    // Inicializa o SDK da Deepgram
    const deepgram = new Deepgram(deepgramApiKey);

    console.log('Solicitando transcrição...');

    deepgram.transcription.preRecorded(
      { buffer, mimetype },
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

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/musicRecording.html');
});

app.post('/upload', upload.single('audio'), async (req, res) => {
  try {
    // Verifica se o corpo da solicitação contém o arquivo de áudio
    const audioBuffer = req.file.buffer;

    if (!audioBuffer) {
      return res.status(400).json({ error: 'Arquivo de áudio ausente no corpo da solicitação' });
    }

    // Salva o arquivo no servidor (opcional)
    const filePath = path.join(__dirname, 'uploads', 'recording.wav');
    fs.writeFileSync(filePath, audioBuffer);

    // Envia para a Deepgram
    sendToDeepgram(audioBuffer)
      .then((result) => {
        console.log('Transcrição:', result.transcription);
        res.json(result.transcription);
        fs.unlinkSync(filePath);
      })
      .catch((error) => {
        res.status(500).json({ error: error.error });
      });
  } catch (error) {
    console.error('Erro ao processar a transcrição:', error);
    res.status(500).json({ error: 'Erro ao processar a transcrição' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
