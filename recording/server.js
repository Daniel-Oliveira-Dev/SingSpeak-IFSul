const express = require('express');
const { Deepgram } = require('@deepgram/sdk');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const diff = require('diff');

const app = express();
const port = 3000;

// Configurar o middleware body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurar o middleware multer para processar uploads de arquivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Método para enviar um arquivo de áudio para o Deepgram
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

// Lê os arquivos e limpa o conteúdo deles
const readAndCleanFile = (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return fileContent.toLowerCase().replace(/[^\w\s]|_/g, '').trim();
};

// Acessa e limpa o arquivo da letra original
const filePath1 = path.join(__dirname, '../musicCodes/musicLyrics', 'letraHeyJude.txt');
const audioOriginalTranscrito = readAndCleanFile(filePath1);

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

    // Cria o caminho para salvar o arquivo de áudio gravado
    const filePath = path.join(__dirname, 'uploads', 'recording.wav');
    // Salva o arquivo de áudio usando o caminho informado
    fs.writeFileSync(filePath, audioBuffer);

    // Cria o caminho para salvar o arquivo .txt
    const filePathTXT = path.join(__dirname, 'uploads', 'result.txt');

    // Envia para a Deepgram
    sendToDeepgram(audioBuffer)
      .then((result) => {
        // Salva a transcrição que o Deepgram retornar em uma String
        let transcriptionResult = result.transcription.results.channels[0].alternatives[0].transcript;
        // Salva a String em um arquivo .txt na mesma pasta que o áudio
        fs.writeFile(filePathTXT, transcriptionResult, (err) => {
          if (err) throw err;
        });
        
        // Deleta o arquivo de áudio
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
