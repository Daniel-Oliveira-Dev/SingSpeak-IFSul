const { Deepgram } = require('@deepgram/sdk');

// The API key we created in step 3
const deepgramApiKey = 'afeb102a44298094422c26b52c00632cef4b2724';

// Hosted sample file
const audioUrl = "audio.wav";

// Initializes the Deepgram SDK
const deepgram = new Deepgram(deepgramApiKey);

console.log('Requesting transcript...')

deepgram.transcription.preRecorded(
  { url: audioUrl },
  {smart_format: true, model: 'nova', language: 'en-US' },
)
.then((transcription) => {
  console.dir(transcription, {depth: null});
})
.catch((err) => {
  console.log(err);
});