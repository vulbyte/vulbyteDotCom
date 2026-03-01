/**
 * A utility class to handle Text-to-Speech (TTS) using the Web Speech API.
 */
export default class TTSManager {
  constructor() {
    /** @type {SpeechSynthesisVoice[]} */
    this.voices = [];
    this._initVoices();
  }

  /**
   * Initializes and retrieves available browser voices.
   * @private
   */
  _initVoices() {
    const loadVoices = () => {
      this.voices = window.speechSynthesis.getVoices();
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  /**
   * Returns the full list of available TTS voices.
   * @returns {SpeechSynthesisVoice[]}
   */
  getAllVoices() {
    return this.voices;
  }

  /**
   * Executes a Text-to-Speech command.
   * * @param {string} message - The text content to be spoken.
   * @param {Object} [options={}] - Configuration for the speech synthesis.
   * @param {string} [options.voiceName] - The exact name of the voice to use (e.g., 'Google US English').
   * @param {number} [options.pitch=1] - Pitch value ranging from 0 to 2.
   * @param {number} [options.rate=1] - Speed of speech ranging from 0.1 to 10.
   * @param {number} [options.volume=1] - Volume level ranging from 0 to 1.
   * @param {string} [options.lang='en-US'] - Language code if voiceName is not provided.
   */
  Call(message, options = {}) {
    if (!message) {
      console.error("TTSManager: Message is required.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(message);

    // Destructure options with defaults
    const { 
      voiceName, 
      pitch = 1, 
      rate = 1, 
      volume = 1, 
      lang = 'en-US' 
    } = options;

    // Set basic properties
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.volume = volume;
    utterance.lang = lang;

    // Find specific voice if requested
    if (voiceName) {
      const selectedVoice = this.voices.find(v => v.name === voiceName);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    window.speechSynthesis.speak(utterance);
  }
}


