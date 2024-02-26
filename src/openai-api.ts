import OpenAI from "openai";
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
      const response = await this.openai.audio.transcriptions.create({
        file: createReadStream(`./voices/528941926.mp3`),
        model: "whisper-1",
      });

      return response.text;
    } catch (e: any) {
      console.error("Error making transcription: ", e);
    }
  }
}

export const openai = new OpenAIApi(process.env.OPENAI_API_KEY);
