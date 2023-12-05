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
let dataSession = "";

// Configurar o middleware body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurar o middleware multer para processar uploads de arquivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const filePathSession = path.join(__dirname, 'session.txt');

// Endpoint para obter o conteúdo do arquivo "session.txt"
app.get('/getSessionData', (req, res) => {
  fs.readFile(filePathSession, 'utf-8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo "session.txt":', err);
    } else {
      dataSession = JSON.parse(JSON.stringify(data));
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
      console.log("Letra original convertida com sucesso!");
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

function parseTranscriptionToOriginalLyricsArray(arrayOriginalMusic, arrayTranscriptionParagraphs) {
  let arrayOriginalMusicCompleted = JSON.parse(JSON.stringify(arrayOriginalMusic));

  arrayTranscriptionParagraphs.forEach(paragraph => {
    paragraph.sentences.forEach(sentence => {
      arrayOriginalMusicCompleted.forEach(originalParagraph => {
        if (originalParagraph.inicio <= sentence.start && originalParagraph.fim >= sentence.end) {
          // Adiciona uma cópia da frase transcrita
          originalParagraph.frasesTranscritas.push(sentence.text.replace(/[.,;]/g, ''));
        }
      });
    });
  });

  return arrayOriginalMusicCompleted;
}

function givePontuation(updatedArrayOriginalMusic) {
  let arrayPoints = [];

  const arrayCopiado = JSON.parse(JSON.stringify(updatedArrayOriginalMusic));

  arrayCopiado.forEach(paragraph => {
    let frasesTranscritas = paragraph.frasesTranscritas; // Acessa o array interno
    let semelhanca = stringSimilarity.compareTwoStrings(paragraph.conteudo, frasesTranscritas.join(" "));
    arrayPoints.push(semelhanca);
  });

  return arrayPoints;
}

function saveNewSessionFile(dataSession, arrayPontos) {
  const conteudoParaSalvar = `${dataSession}\n${arrayPontos}`;
  fs.writeFile(filePathSession, conteudoParaSalvar, (err) => {
    if (err) {
      console.error('Erro ao salvar o arquivo session.txt:', err);
    } else {
      console.log('Conteúdo salvo com sucesso em session.txt');
    }
  });
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

    // Envia para a Deepgram
    sendToDeepgram(audioBuffer)
      .then((result) => {
        // Salva a transcrição que o Deepgram retornar em uma String
        let transcriptionResult = result.transcription.results.channels[0].alternatives[0];
        // console.log(transcriptionResult.transcript);
        
        let updatedArrayOriginalMusic = parseTranscriptionToOriginalLyricsArray(
          arrayOriginalMusic,
          transcriptionResult.paragraphs.paragraphs
        );

        console.log("Array original convertido!");
        let arrayPontos = givePontuation(updatedArrayOriginalMusic);
        console.log("Pontuação gerada!");

        saveNewSessionFile(dataSession, arrayPontos);
        
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