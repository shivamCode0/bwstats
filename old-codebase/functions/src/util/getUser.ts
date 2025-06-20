import axios from "axios";

export async function getUser(username: string): Promise<PlayerUser> {
  let playerDBTimeStart = Date.now();
  let v = await axios.get(`https://playerdb.co/api/player/minecraft/${username}`).catch(() => Promise.reject(new Error("Player Not Found")));
  console.log(`Got PlayerDB Data after ${(Date.now() - playerDBTimeStart) / 1000}s`);

  let json: any = v.data;
  if (json.success === false) throw new Error("Player Not Found");

  return { uuid: json.data.player.id, username: json.data.player.username };
}
