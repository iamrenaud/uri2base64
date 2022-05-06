// Require Node Dependencies
import * as fs from "fs/promises";
import * as path from "path";

// Require External Dependencies
import fetch from "node-fetch";

// Vars
const mediaRegex = new RegExp("\.(gif|jpe?g|tiff?|png|webp|bmp|ico|wav|mp3|mp4)$", "i");

export interface Media {
  path?: string,
  uri?: string,
}

export interface ResponsePayload {
  base64?: string
}

export async function toBase64(media: Media): Promise<ResponsePayload> {
  let base64: string = "";

  if (media.uri) {
    const uri = new URL(media.uri!);

    const mediaBuffer = await (await fetch(uri)).buffer();

    base64 = mediaBuffer.toString('base64');
  }
  else if (media.path && mediaRegex.test(media.path)) {
    let isFile: boolean;

    isFile = (await fs.stat(media.path)).isFile();
    if (isFile!) {
      const mediaBuffer = await fs.readFile(path.resolve(media.path));

      base64 = mediaBuffer.toString('base64');
    }
  }
  else {
    throw new Error("Didn\'t get a media or a good uri for the appropriate param");
  }

  return { base64 };
}
