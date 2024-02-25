declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_API_KEY: string;
      OPENAI_API_KEY: string;
    }
  }
}

export {};
