import axios from "axios";
import ffmpeg from "fluent-ffmpeg";
import installer from "@ffmpeg-installer/ffmpeg";
import { createWriteStream, unlink as unlinkCallback } from "fs";
import { dirname, resolve } from "path";
import { promisify } from "util";

const unlink = promisify(unlinkCallback);

class OggConverter {
  constructor() {
    ffmpeg.setFfmpegPath(installer.path);
  }

  toMp3(input: any, output: string): Promise<string> {
    try {
      const outputPath = resolve(dirname(input), `${output}.mp3`);
      return new Promise<string>((resolve, reject) => {
        ffmpeg(input)
          .inputOption("-t 30")
          .output(outputPath)
          .on("end", () => resolve(outputPath))
          .on("error", (err) => reject(err.message))
          .run();
      });
    } catch (e: any) {
      console.error(e.message);
      throw e;
    }
  }

  async create(url: string, filename: string): Promise<string> {
    try {
      const oggPath = resolve(__dirname, "../voices", `${filename}.ogg`);
      const response = await axios({
        method: "get",
        url,
        responseType: "stream",
      });
      return new Promise((resolve) => {
        const stream = createWriteStream(oggPath);
        response.data.pipe(stream);
        stream.on("finish", () => resolve(oggPath));
      });
    } catch (e: any) {
      console.error("Error while creating ogg", e.message);
      throw e;
    }
  }

  async deleteAudioFiles(oggPath: string, mp3Path: string) {
    try {
      await unlink(oggPath);
      await unlink(mp3Path);
      console.log(`Deleted file: ${oggPath}`);
      console.log(`Deleted file: ${mp3Path}`);
    } catch (e: any) {
      console.error(`Error deleting voice:`, e.message);
    }
  }
}

export const ogg = new OggConverter();
