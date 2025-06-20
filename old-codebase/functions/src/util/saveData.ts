import { getStorage } from "firebase-admin/storage";
import { join } from "path/posix";
import { writeFile } from "fs/promises";
import * as stream from "stream";

export const saveData = (data: any, ...filePath: string[]) =>
  new Promise<void>((resolve, reject) => {
    let fileName = filePath.pop();
    // let path = join(process.cwd(), "tmp", `${fileName}-${Date.now()}.json`);
    let path = join(...filePath, `${fileName}-${Date.now()}.json`);

    let bucket = getStorage().bucket("shivam-raw-hypixel-responses-data1");

    const file = bucket.file(path, {});

    const passthroughStream = new stream.PassThrough();
    passthroughStream.write(JSON.stringify(data));
    passthroughStream.end();

    passthroughStream
      .pipe(file.createWriteStream({ contentType: "application/json" }))
      .on("finish", () => resolve())
      .on("error", (err) => reject(err));

    // await writeFile(path, new Uint8Array(Buffer.from(JSON.stringify(data))), { encoding: "utf8" });
  });
