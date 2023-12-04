const express = require('express');
const { Deepgram } = require('@deepgram/sdk');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const stringSimilarity = require("string-similarity");

const app = express();
const port = 3000;

// Variáveis importantes para o funcionamento geral do SingSpeak
let arrayOriginalMusic = [];

// Configurar o middleware body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurar o middleware multer para processar uploads de arquivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint para obter o conteúdo do arquivo "session.txt"
app.get('/getSessionData', (req, res) => {
  const filePathSession = path.join(__dirname, 'session.txt');
  
  fs.readFile(filePathSession, 'utf-8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo "session.txt":', err);
    } else {
      res.send(data);
    }
  });
});

// Leitura do arquivo que contém a letra original
function lerArquivo(nomeArquivo) {
  const filePath = path.join(__dirname, '../musicCodes/musicLyrics', nomeArquivo.toString());
  const conteudoArquivo = fs.readFileSync(filePath, 'utf-8');
  const linhas = conteudoArquivo.split(/\r?\n/);
  return linhas;
}

// Rota para chamar a função de leitura do arquivo "session.txt"
app.post('/generateOriginalLyricsArray', (req, res) => {
  const { nomeArquivo } = req.body;
  
  try {
      arrayOriginalMusic = extrairInformacoes(lerArquivo(nomeArquivo));
      console.log(arrayOriginalMusic);
  } catch (err) {
      console.error('Erro ao ler a letra original:', err);
      res.status(500).send('Erro ao ler a letra original: ' + err.message);
  }
});

// Extrair Informações para o array de parágrafos
function extrairInformacoes(linhas) {
  const trechos = [];
  let trechoAtual = null;

  for (const linha of linhas) {
      if (linha.startsWith("&&")) {
          // Adiciona o trecho anterior à lista
          if (trechoAtual !== null) {
              trechos.push(trechoAtual);
          }

          // Novo trecho
          trechoAtual = {
              inicio: parseFloat(linha.substring(2)),
              fim: null,
              conteudo: "",
              frasesTranscritas: []
          };
      } else if (linha.startsWith("@@")) {
          // Fim do trecho
          if (trechoAtual !== null) {
              trechoAtual.fim = parseFloat(linha.substring(2));
          }
      } else {
          // Linha no trecho
          if (trechoAtual !== null) {
              trechoAtual.conteudo += linha + " ";
          }
      }
  }

  // Último trecho
  if (trechoAtual !== null) {
      trechos.push(trechoAtual);
  }

  return trechos;
}


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
        console.log(result);
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
