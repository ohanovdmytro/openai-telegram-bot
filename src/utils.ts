import { unlink } from 'fs/promises'
export async function removeFile(path: string) {
  try {
    await unlink(path);
  } catch (e: any) {
    console.log("Error while removing file", e.message);
  }
}
