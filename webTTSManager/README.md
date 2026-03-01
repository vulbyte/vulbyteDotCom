# webTTSManager
a class used to init, get, and call tts. seperated out to set up a chestertons fense

how to use:
```js
import TTSManager from './TTSManager.mjs'; // import location will vary based on how and where file is

const tts = new TTSManager(); // init so it can be called and is readly to be used

// Example: Listing voices to the console
console.log(tts.getAllVoices());

// Example: Calling with custom settings
tts.Call(
    "Hello! This is a test of the speech system.", // first param is always the message to be read
    { // second is a dictionary to adjust the params of the tts message
      rate: 1.2,
      pitch: 0.9,
      voice: 69. 
      volume: 1
    }
);

```
