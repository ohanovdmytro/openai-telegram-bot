import { Bot } from "grammy";
import dotenv from "dotenv";
import { ogg } from "./ogg.js";
import { openai } from "./openai-api.js";
dotenv.config();

const bot = new Bot(process.env.BOT_API_KEY);

bot.on(":voice", async (ctx) => {
  try {
    const voiceFile = await ctx.getFile();
    const filePath = voiceFile.file_path;
    const fullPath = `https://api.telegram.org/file/bot${process.env.BOT_API_KEY}/${filePath}`;
    const userId = String(ctx.message?.from.id);

    const oggPath = await ogg.create(fullPath, userId);
    const mp3Path = await ogg.toMp3(oggPath, userId);

    const text = await openai.transcription(mp3Path);
    const response = await openai.chat(text);

    await ctx.reply(
      `Download your own file again: https://api.telegram.org/file/bot${process.env.BOT_API_KEY}/${filePath}`
    );

    await ctx.reply(
      `${text}`
    );
  } catch (e: any) {
    console.error(e.message);
  }
});

bot.start();
