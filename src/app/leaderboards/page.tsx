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
  }, []);

  const handleListModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setListMode(isChecked);
    localStorage.setItem("bwstats_lblistMode", isChecked ? "yes" : "no");
  };

  const renderLeaderboard = () => {
    if (!data || !data[activeTab]) {
      return <Alert variant="info">No data for this leaderboard.</Alert>;
    }

    const players = data[activeTab];
    const playerChunks = chunk(players, 4);

    return (
      <div id="lb-container" className={listMode ? "lb-list-mode" : ""}>
        {listMode ? (
          <div className="d-flex justify-content-around flex-wrap">
            {players.map((p) => (
              <Card key={p.uuid} className="lb-player-card m-1">
                <Card.Body>
                  <div className="lb-player-icon-box2">
                    <div className="lb-player-icon-box">
                      <Image src={`https://crafatar.com/avatars/${p.uuid}?overlay=true`} alt={p.username} width={32} height={32} />
                    </div>
                  </div>
                  <Card.Title className="mb-0">
                    <Link href={`/user/${p.username}`} className="text-decoration-none">
                      {p.rank}. {p.username}
                    </Link>
                  </Card.Title>
                  <Card.Text>
                    {p[activeTab as keyof typeof p].toLocaleString()} {FRIENDLY_LB_NAMES[activeTab as keyof typeof FRIENDLY_LB_NAMES]}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
          playerChunks.map((playerChunk, chunkIndex) => (
            <div key={chunkIndex} className="d-flex justify-content-around flex-wrap">
              {playerChunk.map((p) => (
                <Card key={p.uuid} className="lb-player-card m-2">
                  <Card.Body>
                    <div className="lb-player-icon-box2">
                      <div className="lb-player-icon-box">
                        <Image src={`https://crafatar.com/avatars/${p.uuid}?overlay=true`} alt={p.username} width={64} height={64} />
                      </div>
                    </div>
                    <div>
                      <Card.Title>
                        <Link href={`/user/${p.username}`} className="text-decoration-none">
                          {p.rank}. {p.username}
                        </Link>
                      </Card.Title>
                      <Card.Text>
                        {p[activeTab as keyof typeof p].toLocaleString()} {FRIENDLY_LB_NAMES[activeTab as keyof typeof FRIENDLY_LB_NAMES]}
                      </Card.Text>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          ))
        )}
      </div>
    );
  };

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

  const backgroundImageIndex = Math.floor(Math.random() * 14) + 1;

  return (
    <>
      <style jsx global>{`
        .lb-player-icon-box {
          position: relative;
          width: 100%;
          padding-top: 100%; /* 1:1 Aspect Ratio */
          width: 4em;
          height: 4em;
        }
        .lb-player-icon-box2 img {
          text-align: center;
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          width: 100%;
          height: 100%;
          image-rendering: pixelated;
        }
        .lb-player-icon-box2 {
          padding: 1em;
        }
        .lb-player-card {
          min-width: min(90vw, 20em);
          max-width: 20em;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }
        .lb-player-card h5 {
          font-size: 1.25em;
          margin-bottom: 0.25em;
        }
        .lb-list-mode .lb-player-card {
          margin-bottom: 0.25em !important;
          width: 100%;
          min-width: unset;
          max-width: unset;
        }
        .lb-list-mode .lb-player-card .card-body {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          padding: 0.3em;
          align-items: center;
        }
        .lb-list-mode .lb-player-card .card-title {
          flex: 2;
          min-width: 8em;
        }
        .lb-list-mode .lb-player-card .card-text {
          flex: 3;
          min-width: 12em;
        }
        .lb-list-mode .lb-player-card .lb-player-icon-box {
          width: 1.75em;
          height: 1.75em;
        }
        .lb-list-mode .lb-player-card .lb-player-icon-box2 {
          padding: 0.3em 1em;
        }
        .stats-container {
          backdrop-filter: blur(8px);
          background-color: rgba(255, 255, 255, 0.7);
        }
        .background-image {
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          backdrop-filter: blur(3px);
          background-attachment: fixed;
          padding-top: 1rem;
          padding-bottom: 1rem;
          min-height: calc(100vh - 56px);
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
