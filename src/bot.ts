
import {
  Bot,
  Context,
  session,
  SessionFlavor,
  GrammyError,
  HttpError,
} from "grammy";
import { ogg } from "./ogg.js";
import { openai } from "./openai-api.js";
import { hydrate, HydrateFlavor } from "@grammyjs/hydrate";
import config from "../config/default.json"


interface SessionData {
  role: string;
  content: string;
  messages: { role: string; content: string | undefined | null }[];
}

type MyContext = HydrateFlavor<Context & SessionFlavor<SessionData>>;
const bot = new Bot<MyContext>(config.BOT_API_KEY);

function initial(): SessionData {
  return { role: "", content: "", messages: [] };
}

bot.use(hydrate());
bot.use(session({ initial }));

bot.api.setMyCommands([
  { command: "start", description: "Start bot" },
  { command: "new", description: "Create a new prompt thread" },
]);

bot.command("start", async (ctx) => {
  await ctx.reply("Send a voice message or text prompt to work with ChatGPT.");
});

bot.command("new", async (ctx) => {
  ctx.session.messages = [];
  await ctx.reply("Waiting for your prompt!");
});

bot.on(":voice", async (ctx) => {
  try {
    const statusMessage = await ctx.reply("Transcripting message...");

    const voiceFile = await ctx.getFile();
    const filePath = voiceFile.file_path;
    const fullPath = `https://api.telegram.org/file/bot${config.BOT_API_KEY}/${filePath}`;
    const userId = String(ctx.message?.from.id);

    const oggPath = await ogg.create(fullPath, userId);
    const mp3Path = await ogg.toMp3(oggPath, userId);

    console.log(`Working with ${userId} voice message!`);

    const text = await openai.transcription(mp3Path);
    await ctx.reply(`Your prompt: ${text}`, {
      reply_parameters: { message_id: ctx.msg.message_id },
    });

    await statusMessage.editText("Generating response...");

    ctx.session.messages.push({ role: openai.roles.USER, content: text });

    const gptResponse = await openai.chat(ctx.session.messages);

    ctx.session.messages.push({
      role: openai.roles.ASSISTANT,
      content: gptResponse,
    });

    await statusMessage.delete();
    await bot.api.sendMessage(userId, `${gptResponse}`);
  } catch (e: any) {
    console.error("Error handling voice prompt: ", e.message);
  }
});

bot.on(":text", async (ctx) => {
  try {
    const statusMessage = await ctx.reply("Generating response...");

    ctx.session.messages.push({
      role: openai.roles.USER,
      content: ctx.message?.text,
    });
    const gptResponse = await openai.chat(ctx.session.messages);
    ctx.session.messages.push({
      role: openai.roles.ASSISTANT,
      content: gptResponse,
    });

    await statusMessage.delete();
    await ctx.reply(`${gptResponse}`);
  } catch (e: any) {
    console.error("Error handling voice message: ", e.message);
  }
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

bot.start();
