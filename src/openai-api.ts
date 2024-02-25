import { OpenAI } from "openai";
import { createReadStream } from "fs";
import dotenv from "dotenv";
dotenv.config();

class OpenAIApi {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async chat(text: any) {
    try {
    } catch (e: any) {
      console.error(e.message);
    }
  }

  async transcription(mp3Path: any) {
    try {
      await this.openai.audio.transcriptions.create({
        file: createReadStream(`${mp3Path}`),
        model: "whisper-1",
      });
    } catch (e: any) {
      console.error(e.message);
    }
  }
}

export const openai = new OpenAIApi(process.env.OPENAI_API_KEY);
