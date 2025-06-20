import axios from "axios";
import { PlayerUser } from "@/types";

export async function getUser(username: string): Promise<PlayerUser> {
  const playerDBTimeStart = Date.now();

  try {
    const response = await axios.get(`https://playerdb.co/api/player/minecraft/${username}`);
    console.log(`Got PlayerDB Data after ${(Date.now() - playerDBTimeStart) / 1000}s`);

    const json = response.data;
    if (json.success === false) {
      throw new Error("Player Not Found");
    }

    return {
      uuid: json.data.player.id,
      username: json.data.player.username,
    };
  } catch (error) {
    console.error("Error fetching player:", error);
    throw new Error("Player Not Found");
  }
}
