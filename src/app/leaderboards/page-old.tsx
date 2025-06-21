"use client";

import { useState, useEffect } from "react";
import { Container, Row, Col, Table, Card, Alert, Spinner, Badge, Nav } from "react-bootstrap";
import { BWLeaderboardsData } from "@/types";
import { FRIENDLY_LB_NAMES, LB_ORDER } from "@/lib/constants";
import { chunk } from "@/lib/utils";
import Navigation from "@/components/Navigation";

export default function LeaderboardsPage() {
  const [data, setData] = useState<BWLeaderboardsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("level");

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/leaderboards");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch leaderboard data");
      }

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  const [backgroundImageIndex] = useState(() => Math.floor(Math.random() * 14) + 1);
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" variant="primary" className="mb-3" />
        <p>Loading leaderboards...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container className="py-5">
        <Alert variant="warning">No leaderboard data available</Alert>
      </Container>
    );
  }

  return (
    <>
      <div className="background-image" style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), url(/bgimg/${backgroundImageIndex}.jpeg)` }}>
        <Container className="py-4">
          <Card className="stats-container">
            <Card.Header>
              <Row className="align-items-center">
                <Col>
                  <h2 className="mb-0">Bedwars Leaderboards</h2>
                  <small className="text-muted">
                    Updated {new Date(data.time).toLocaleString()}
                    {data.cached && (
                      <Badge bg="secondary" className="ms-2">
                        Cached
                      </Badge>
                    )}
                  </small>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="p-0">
              <Nav variant="tabs" className="border-bottom">
                {LB_ORDER.map((lbKey) => (
                  <Nav.Item key={lbKey}>
                    <Nav.Link active={activeTab === lbKey} onClick={() => setActiveTab(lbKey)} style={{ cursor: "pointer" }}>
                      {FRIENDLY_LB_NAMES[lbKey as keyof typeof FRIENDLY_LB_NAMES]}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>

              <div className="p-3">
                {data.stats[activeTab] && (
                  <Row className="g-4">
                    {chunk(data.stats[activeTab], 10).map((playerChunk, chunkIndex) => (
                      <Col key={chunkIndex} lg={6}>
                        <Table striped hover responsive>
                          <thead>
                            <tr>
                              <th style={{ width: "60px" }}>#</th>
                              <th>Player</th>
                              <th>Level</th>
                              <th>Wins</th>
                              <th>Final Kills</th>
                            </tr>
                          </thead>
                          <tbody>
                            {playerChunk.map((player, index) => {
                              const rank = chunkIndex * 10 + index + 1;
                              return (
                                <tr key={player.uuid}>
                                  <td>
                                    <Badge bg={rank === 1 ? "warning" : rank === 2 ? "secondary" : rank === 3 ? "success" : "light"} text={rank <= 3 ? "dark" : "dark"}>
                                      {rank}
                                    </Badge>
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <img
                                        src={`https://crafatar.com/avatars/${player.uuid}?size=32&overlay=true`}
                                        alt={`${player.username}'s avatar`}
                                        className="me-2 rounded"
                                        width="32"
                                        height="32"
                                      />
                                      <a href={`/user/${player.username}`} className="text-decoration-none fw-bold">
                                        {player.username}
                                      </a>
                                    </div>
                                  </td>
                                  <td>{player.levelFormatted}</td>
                                  <td>{player.totalWins.toLocaleString()}</td>
                                  <td>{player.totalFinalsFormatted}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </Col>
                    ))}
                  </Row>
                )}

                {!data.stats[activeTab] && <Alert variant="info">No data available for this leaderboard.</Alert>}
              </div>
            </Card.Body>
          </Card>

          <div className="text-center mt-4">
            <p className="text-muted">Leaderboards are updated every 4 hours</p>
          </div>
        </Container>

        <footer className="footer bg-dark text-light py-3 mt-5">
          <Container>
            <Row>
              <Col className="text-center">
                <p className="mb-0">&copy; 2025 Hypixel Bedwars Stats. Not affiliated with Hypixel or Mojang.</p>
              </Col>
            </Row>{" "}
          </Container>
        </footer>
      </div>
    </>
  );
}
