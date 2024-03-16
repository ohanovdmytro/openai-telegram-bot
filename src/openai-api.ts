import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat";
import { createReadStream } from "fs";
import dotenv from "dotenv";
dotenv.config();

class OpenAIApi {
  private openai: OpenAI;

  roles = {
    ASSISTANT: "assistant",
    USER: "user",
    SYSTEM: "system",
  };

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async chat(messages: any) {
    try {
      const response = await this.openai.chat.completions.create({
        messages: messages as ChatCompletionMessageParam[],
        model: "gpt-4",
      });

      return response.choices[0].message.content;
    } catch (e: any) {
      console.error(e.message);
    }
  }

  async transcription(mp3Path: any) {
    if (mp3Path === undefined) {
      throw new Error("mp3Path is undefined.");
    }
    try {
      const response = await this.openai.audio.transcriptions.create({
        file: createReadStream(mp3Path),
        model: "whisper-1",
      });

      return response.text;
    } catch (e: any) {
      console.error("Error making transcription: ", e);
    }
  }
}

export const openai = new OpenAIApi(process.env.OPENAI_API_KEY);
