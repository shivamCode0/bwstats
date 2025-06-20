"use client";

import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Alert, Spinner, Badge, Nav, Form } from "react-bootstrap";
import { BWLeaderboardsData } from "@/types";
import { FRIENDLY_LB_NAMES, LB_ORDER } from "@/lib/constants";
import { chunk } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function LeaderboardsPage() {
  const [data, setData] = useState<BWLeaderboardsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(LB_ORDER[0]);
  const [listMode, setListMode] = useState(false);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/leaderboards");
        const result = await response.json();
        console.log(result);
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
    fetchLeaderboardData();
  }, []);

  useEffect(() => {
    const listModeFromStorage = localStorage.getItem("bwstats_lblistMode") === "yes";
    setListMode(listModeFromStorage);
  }, [data]);

  const handleListModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setListMode(isChecked);
    localStorage.setItem("bwstats_lblistMode", isChecked ? "yes" : "no");
  };
  const renderLeaderboard = () => {
    console.log(data);
    if (!data || !data.stats[activeTab]) {
      return <Alert variant="info">No data for this leaderboard.</Alert>;
    }

    const players = data.stats[activeTab];
    const playerChunks = chunk(players, 4);

    const getStatValue = (player: { level: number; totalWins: number; totalFinals: number }, statType: string) => {
      switch (statType) {
        case 'level':
          return player.level;
        case 'wins':
          return player.totalWins;
        case 'finalKills':
          return player.totalFinals;
        default:
          return 0;
      }
    };

    return (
      <div id="lb-container" className={listMode ? "lb-list-mode" : ""}>
        {listMode ? (
          <div className="list-container">
            {players.map((p, i) => (
              <Card key={p.uuid} className="lb-player-card-list mb-2">
                <Card.Body className="d-flex align-items-center">
                  <div className="rank-number me-3">
                    <strong>#{i + 1}</strong>
                  </div>                  <div className="player-avatar me-3">
                    <Image
                      src={`https://crafatar.com/avatars/${p.uuid}?overlay=true`}
                      alt={p.username}
                      width={40}
                      height={40}
                      style={{ imageRendering: "pixelated" }}
                      unoptimized
                    />
                  </div>
                  <div className="player-info flex-grow-1">
                    <Card.Title className="mb-1">
                      <Link href={`/user/${p.username}`} className="text-decoration-none">
                        {p.username}
                      </Link>
                    </Card.Title>
                    <Card.Text className="mb-0 text-muted">
                      {getStatValue(p, activeTab).toLocaleString()} {FRIENDLY_LB_NAMES[activeTab as keyof typeof FRIENDLY_LB_NAMES]}
                    </Card.Text>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid-container">
            {playerChunks.map((playerChunk, chunkIndex) => (
              <div key={chunkIndex} className="row mb-3">
                {playerChunk.map((p, playerIndex) => {
                  const globalIndex = chunkIndex * 4 + playerIndex;
                  return (
                    <div key={p.uuid} className="col-md-3 mb-3">
                      <Card className="lb-player-card h-100">
                        <Card.Body className="text-center">
                          <div className="rank-badge mb-2">
                            <Badge bg="primary" className="fs-6">#{globalIndex + 1}</Badge>
                          </div>                          <div className="player-avatar mb-3">
                            <Image
                              src={`https://crafatar.com/avatars/${p.uuid}?overlay=true`}
                              alt={p.username}
                              width={64}
                              height={64}
                              style={{ imageRendering: "pixelated" }}
                              unoptimized
                            />
                          </div>
                          <Card.Title className="h6">
                            <Link href={`/user/${p.username}`} className="text-decoration-none">
                              {p.username}
                            </Link>
                          </Card.Title>
                          <Card.Text className="text-muted small">
                            <strong>{getStatValue(p, activeTab).toLocaleString()}</strong><br />
                            {FRIENDLY_LB_NAMES[activeTab as keyof typeof FRIENDLY_LB_NAMES]}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    );
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
    <>      <style jsx global>{`
        .player-avatar img {
          border-radius: 8px;
          border: 2px solid #dee2e6;
          object-fit: cover;
        }
        
        .lb-player-card {
          border: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .lb-player-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .lb-player-card-list {
          border: none;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.2s ease;
        }
        
        .lb-player-card-list:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        
        .rank-number {
          font-size: 1.1rem;
          color: #6c757d;
          min-width: 40px;
        }
        
        .rank-badge {
          margin-bottom: 0.5rem;
        }
        
        .list-container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .grid-container .row {
          margin: 0 -8px;
        }
        
        .grid-container .col-md-3 {
          padding: 0 8px;
        }
        
        .player-info {
          min-width: 0;
        }
        
        .player-info .card-title {
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }
        
        .player-info .card-text {
          font-size: 0.9rem;
        }
        
        .stats-container {
          backdrop-filter: blur(8px);
          background-color: rgba(255, 255, 255, 0.9);
          border: none;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .background-image {
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          background-attachment: fixed;
          padding-top: 1rem;
          padding-bottom: 1rem;
          min-height: calc(100vh - 56px);
        }
        
        @media (max-width: 768px) {
          .grid-container .col-md-3 {
            margin-bottom: 1rem;
          }
          
          .rank-number {
            min-width: 30px;
            font-size: 1rem;
          }
          
          .player-avatar img {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
      <div
        className="background-image"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), url(/bgimg/${backgroundImageIndex}.jpeg)`,
        }}
      >
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
                <Col xs="auto">
                  <Form.Check type="switch" id="list-mode-check" label="List Mode" checked={listMode} onChange={handleListModeChange} />
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="p-0">
              <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k || LB_ORDER[0])} className="border-bottom">
                {LB_ORDER.map((lbKey) => (
                  <Nav.Item key={lbKey}>
                    <Nav.Link eventKey={lbKey} style={{ cursor: "pointer" }}>
                      {FRIENDLY_LB_NAMES[lbKey as keyof typeof FRIENDLY_LB_NAMES]}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
              <div className="p-3">{renderLeaderboard()}</div>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
}
