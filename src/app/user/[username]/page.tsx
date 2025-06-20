"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Table, Alert, Accordion } from "react-bootstrap";
import { BWStatsData } from "@/types";
import { FRIENDLY_MODE_NAMES, FRIENDLY_EXTRA_MODE_NAMES, FRIENDLY_STAT_NAMES, CHALLENGES } from "@/lib/constants";
import { generateSummary } from "@/lib/utils";

export default function UserPage() {
  const params = useParams();
  const username = params.username as string;
  const [data, setData] = useState<BWStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username) {
      fetchUserData(username);
    }
  }, [username]);

  useEffect(() => {
    // Set random background image on client side

    const randomBgIndex = Math.floor(Math.random() * 14) + 1;
    document.body.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), url("/bgimg/${randomBgIndex}.jpeg")`;
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
    document.body.style.backdropFilter = "blur(3px)";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundColor = "rgb(230, 230, 230)";

    // Initialize tooltips
    import("bootstrap/dist/js/bootstrap.bundle.min.js").then((bootstrap) => {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });
    });

    return () => {
      // Clean up background styles when component unmounts
      document.body.style.backgroundImage = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.backgroundSize = "";
      document.body.style.backdropFilter = "";
      document.body.style.backgroundAttachment = "";
      document.body.style.backgroundColor = "";
    };
  }, []);

  const fetchUserData = async (username: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/user/${encodeURIComponent(username)}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch user data");
      }

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const allModesExceptOverall = { ...FRIENDLY_MODE_NAMES, ...FRIENDLY_EXTRA_MODE_NAMES };

  const mostPlayedMode =
    data && data.success
      ? Object.entries(data.stats.modes)
          .filter(([mode]) => mode !== "total")
          .sort((a, b) => b[1].gamesPlayed - a[1].gamesPlayed)[0]?.[0]
      : undefined;

  const mostPlayedModeName = mostPlayedMode ? (allModesExceptOverall as Record<string, string>)[mostPlayedMode] || mostPlayedMode : "Unknown";

  const summary = data && data.success ? generateSummary(data) : "";

  const formatTitle = (challenge: { n: number; name: string; rules: string[]; reward: string }) => {
    return `<b>Challenge ${challenge.n + 1} - ${challenge.name}</b><br />${challenge.rules.map((r, i) => `${i + 1}. ${r}`).join("<br />")}<br /><span>Reward: ${challenge.reward}</span>`;
  };

  const timeFormatted = data?.time ? new Date(data.time).toLocaleTimeString() : "";
  return (
    <>
      <style jsx global>{`
        body {
          // background-image: linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)),
          //   url("https://cdn.shivam.pro/app-static-data/images/bw-bg-compressed/<%- Math.floor(Math.random() * 14) + 1 %>.jpeg");
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          backdrop-filter: blur(3px);
          background-attachment: fixed;
        }

        .stats-container {
          backdrop-filter: blur(8px);
          background-color: rgba(255, 255, 255, 0.7);
        }

        .stats-table {
          border-color: #2125296f;
        }

        .challenge {
          margin-bottom: 0.25rem;
          width: max-content;
        }

        .challenge::after {
          content: "ⓘ";
          color: #3d8fb8;
          margin-left: 0.25rem;
        }

        .challenges-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
        }
      `}</style>
      <div className={`stats-container mt-lg-4 mb-lg-5 container-lg pt-1 mb-0 ${data?.success ? "pb-5" : "pb-2"}`}>
        {data?.success ? (
          <main className="main px-4">
            <h1 className="text-center my-3">
              <img src={`https://crafatar.com/avatars/${data.uuid}?overlay=true&size=16`} alt="Player Icon" style={{ height: "3rem", imageRendering: "pixelated" }} height="48" width="48" />{" "}
              {data.username}&apos;s Bedwars Stats
            </h1>
            <div className="main-content">
              <div className="leftbar pe-2" style={{ flex: 2 }}>
                <div className="player-img-box me-4 w-100">
                  <img
                    src={`https://crafatar.com/renders/body/${data.uuid}?overlay&scale=10`}
                    alt="Player Skin"
                    className="player-img"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const src1 = `https://mc-heads.net/body/${data.uuid}/right`;
                      if (target.src !== src1) {
                        target.src = src1;
                      }
                    }}
                  />
                </div>
                <Alert variant="info" className="no-mobile">
                  Tip! Share your <Alert.Link href={`https://bwstats.shivam.pro/user/${data.username}`}>stats link</Alert.Link> with your friends and show them how amazing you are.
                </Alert>
              </div>
              <div style={{ width: "100%", flex: 6 }}>
                <p>Level: {data.stats.levelFormatted}</p>
                <p>Coins: {data.stats.coinsFormatted}</p>
                <p>Final Kills/Deaths Ratio (FKDR): {data.stats.modes.total.fkdr}</p>
                <p>Beds Broken/Lost Ratio (BBLR): {data.stats.modes.total.bblr}</p>
                <div className="stats-table-container">
                  <Table className="stats-table">
                    <thead>
                      <tr>
                        <th></th>
                        {Object.entries(FRIENDLY_MODE_NAMES).map(([key, name]) => (
                          <th key={key}>{name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="mb-2">
                      {FRIENDLY_STAT_NAMES.map((statGroup, groupIndex) => (
                        <React.Fragment key={groupIndex}>
                          {Object.entries(statGroup).map(([statKey, statName]) => (
                            <tr key={statKey}>
                              <td>{statName}</td>
                              {Object.keys(FRIENDLY_MODE_NAMES).map((modeKey) => (
                                <td key={modeKey}>{(data.stats.modes[modeKey] as any)?.[statKey]?.toLocaleString() || "0"}</td>
                              ))}
                            </tr>
                          ))}
                          <tr>
                            <td colSpan={Object.keys(FRIENDLY_MODE_NAMES).length + 1} className="divider"></td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
            <div>
              <Accordion>
                {/* Other Modes */}
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Other Modes</Accordion.Header>
                  <Accordion.Body>
                    <div className="stats-table-container">
                      <Table className="stats-table mb-0">
                        <thead>
                          <tr>
                            <th></th>
                            {Object.entries(FRIENDLY_EXTRA_MODE_NAMES).map(([key, name]) => (
                              <th key={key}>{name}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="mb-2">
                          {FRIENDLY_STAT_NAMES.map((statGroup, groupIndex) => (
                            <React.Fragment key={groupIndex}>
                              {Object.entries(statGroup).map(([statKey, statName]) => (
                                <tr key={statKey}>
                                  <td>{statName}</td>
                                  {Object.keys(FRIENDLY_EXTRA_MODE_NAMES).map((modeKey) => (
                                    <td key={modeKey}>{(data.stats.modes[modeKey] as any)?.[statKey]?.toLocaleString() || "Error"}</td>
                                  ))}
                                </tr>
                              ))}
                              <tr>
                                <td colSpan={Object.keys(FRIENDLY_EXTRA_MODE_NAMES).length + 1} className="divider"></td>
                              </tr>
                            </React.Fragment>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
                {/* Summary */}
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Summary</Accordion.Header>
                  <Accordion.Body>
                    <p>{summary}</p>
                  </Accordion.Body>
                </Accordion.Item>
                {/* Challenges */}
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Challenges</Accordion.Header>
                  <Accordion.Body>
                    <div className="challenges-list">
                      {data.stats.challenges && data.stats.challenges.length > 0 && (
                        <div>
                          <h3>Completed</h3>
                          {data.stats.challenges
                            .sort((a: string, b: string) => (CHALLENGES as any)[a]?.n - (CHALLENGES as any)[b]?.n)
                            .map((challengeKey: string) => {
                              const challenge = (CHALLENGES as any)[challengeKey];
                              return challenge ? (
                                <p
                                  key={challengeKey}
                                  className="challenge"
                                  data-bs-toggle="tooltip"
                                  data-bs-html="true"
                                  data-bs-placement="right"
                                  title={formatTitle(challenge)}
                                  dangerouslySetInnerHTML={{ __html: `${challenge.n + 1}. ${challenge.name}` }}
                                ></p>
                              ) : null;
                            })}
                        </div>
                      )}
                      {(!data.stats.challenges || data.stats.challenges.length < Object.keys(CHALLENGES).length) && (
                        <div>
                          <h3>Not Completed</h3>
                          {Object.entries(CHALLENGES)
                            .filter(([key]) => !data.stats.challenges?.includes(key))
                            .sort(([, a], [, b]) => a.n - b.n)
                            .map(([key, challenge]) => (
                              <p
                                key={key}
                                className="challenge"
                                data-bs-toggle="tooltip"
                                data-bs-html="true"
                                data-bs-placement="right"
                                title={formatTitle(challenge)}
                                dangerouslySetInnerHTML={{ __html: `${challenge.n + 1}. ${challenge.name}` }}
                              ></p>
                            ))}
                        </div>
                      )}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
            <div className="mt-3">
              <p className="text-center">
                {data.cached ? "Cached result" : "Result"} from{" "}
                <time className="change-time" dateTime={data.time ? new Date(data.time).toISOString() : ""}>
                  {timeFormatted}
                </time>
              </p>
            </div>
          </main>
        ) : (
          <>
            {loading ? (
              <>
                <h1 className="text-center my-4">Loading...</h1>
                <p className="text-center">Please wait while we fetch the player data.</p>
              </>
            ) : error ? (
              error.length > 50 ? (
                <>
                  <h1 className="text-center my-4">Error</h1>
                  <p className="text-center">Please try again in 1 minute.</p>
                  <p className="text-left my-4">
                    {error.split("\n").map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </p>
                </>
              ) : (
                <h1 className="text-center my-4">{error}</h1>
              )
            ) : (
              <h1 className="text-center my-4">Unknown Error</h1>
            )}
          </>
        )}
      </div>
    </>
  );
}
