"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar, Nav, Container, Form, Button, InputGroup } from "react-bootstrap";

export default function Home() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/user/${encodeURIComponent(username.trim())}`);
    } else {
      alert("Enter your username to see your stats.");
    }
  };

  return (
    <>
      <div className="hero-image">
        <div className="hero-text">
          <h1>Bedwars Stats</h1>
          <label htmlFor="input-mcusername" className="h5 mb-3">
            Enter your username to see your stats.
          </label>
          <Form onSubmit={handleSubmit}>
            <InputGroup className="mb-3">
              <Form.Control
                name="user"
                type="text"
                placeholder="Minecraft Username"
                id="input-mcusername"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                size="lg"
              />
              <Button variant="primary" type="submit" size="lg">
                View Stats
              </Button>
            </InputGroup>
          </Form>
        </div>
      </div>

      <Container className="mt-3">
        <h2 className="text-center">Hypixel Bedwars Stats</h2>
        <p>
          Welcome to bwstats.shivam.pro! You can find statistics for Bedwars players on Hypixel on this website. Tip: You should check your stats and share the link with your friends to show how
          amazing you are.
        </p>
        <hr />
        <h3>How to Use</h3>
        <p>This website, bwstats.shivam.pro, is very easy to use. Type in the username of the player you want to see data for. Then, press the blue &quot;View Stats&quot; button to see the stats.</p>
        <h3>Additional Information</h3>
        <p>
          You can see player and game data and Hypixel stats for Bedwars on this website. This is a tracker for a player&apos;s stats in Bedwars (BW) and is also a stat checker. You could add your
          stats link to your Hypixel forum signature and share it with your friends. We are currently developing a leaderboard for bedwars and more cool things. See your total bedwars stats in hypixel
          and this is how you check stats. We appreciate you visiting!
        </p>
        <h3>API Information</h3>
        <p>
          <strong>Note: The API is being reworked because of API access restrictions.</strong> The API returns nicely-formatted JSON of a player&apos;s stats.
          <br />
          <code>GET</code>
          https://bwstats.shivam.pro/api-v1/user/<code>{`{user}`}</code>?key=<code>{`{apikey}`}</code>
        </p>
        <ul>
          <li>
            <code>{`{user}`}</code> - Player (username or uuid)
          </li>
          <li>
            <code>{`{apikey}`}</code> - Your Hypixel API key (This is necessary to use the API.)
          </li>
        </ul>
      </Container>
    </>
  );
}
