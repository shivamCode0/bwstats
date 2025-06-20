'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Container, Row, Col, Table, Card, Alert, Spinner, Badge, Button } from 'react-bootstrap';
import { BWStatsData } from '@/types';
import { FRIENDLY_MODE_NAMES, FRIENDLY_EXTRA_MODE_NAMES, FRIENDLY_STAT_NAMES, CHALLENGES } from '@/lib/constants';
import { generateSummary } from '@/lib/utils';
import Navigation from '@/components/Navigation';

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

  const fetchUserData = async (username: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/user/${encodeURIComponent(username)}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch user data');
      }
      
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" variant="primary" className="mb-3" />
        <p>Loading player data...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => fetchUserData(username)}>
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container className="py-5">
        <Alert variant="warning">No data available</Alert>
      </Container>
    );
  }
  const backgroundImageIndex = Math.floor(Math.random() * 14) + 1;
  const allModesExceptOverall = { ...FRIENDLY_MODE_NAMES, ...FRIENDLY_EXTRA_MODE_NAMES };
  
  const mostPlayedMode = Object.entries(data.stats.modes)
    .filter(([mode]) => mode !== 'total')
    .sort((a, b) => b[1].gamesPlayed - a[1].gamesPlayed)[0]?.[0];
  
  const mostPlayedModeName = mostPlayedMode 
    ? (allModesExceptOverall as Record<string, string>)[mostPlayedMode] || mostPlayedMode 
    : 'Unknown';
  return (
    <>
      <Navigation />
      <div 
        className="background-image"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), url(/bgimg/${backgroundImageIndex}.jpeg)`
        }}
      >
      <Container fluid className="py-4">
        <div className="main-content">
          {/* Left sidebar */}
          <div className="leftbar me-3">
            <Card className="stats-container">
              <Card.Body className="text-center">
                <div className="player-img-box">
                  <img 
                    src={`https://crafatar.com/renders/body/${data.uuid}?size=200&overlay=true`}
                    alt={`${data.username}'s skin`}
                    className="img-fluid"
                  />
                </div>
                <h4 className="mb-2">{data.username}</h4>
                <Badge bg="primary" className="mb-2 fs-6">
                  {data.stats.levelFormatted}
                </Badge>
                <p className="text-muted small mb-2">
                  Most played: {mostPlayedModeName}
                </p>
                <p className="text-muted small">
                  {generateSummary(data)}
                </p>
                {data.cached && (
                  <Badge bg="secondary" className="mt-2">
                    Cached Data
                  </Badge>
                )}
              </Card.Body>
            </Card>
          </div>

          {/* Main content */}
          <div className="flex-grow-1">
            <Card className="stats-container">
              <Card.Header>
                <h3 className="mb-0">Bedwars Statistics</h3>
                <small className="text-muted">
                  Data from {new Date(data.time).toLocaleString()}
                </small>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="stats-table-container">
                  {/* Overall Stats */}
                  <div className="p-3 border-bottom">
                    <h5 className="mb-3">Overall Statistics</h5>
                    <Row className="g-3">
                      <Col md={6}>
                        <p><strong>Level:</strong> {data.stats.levelFormatted}</p>
                        <p><strong>Coins:</strong> {data.stats.coinsFormatted}</p>
                      </Col>
                      <Col md={6}>
                        <p><strong>Games Played:</strong> {data.stats.modes.total?.gamesPlayed.toLocaleString() || 0}</p>
                        <p><strong>Wins:</strong> {data.stats.modes.total?.wins.toLocaleString() || 0}</p>
                      </Col>
                    </Row>
                  </div>

                  {/* Mode Statistics */}
                  {Object.entries(allModesExceptOverall).map(([modeKey, modeName]) => {
                    const modeStats = data.stats.modes[modeKey];
                    if (!modeStats || modeStats.gamesPlayed === 0) return null;

                    return (
                      <div key={modeKey} className="p-3 border-bottom">
                        <h6 className="mb-3">{modeName}</h6>
                        <Table responsive size="sm" className="stats-table">
                          <tbody>
                            {FRIENDLY_STAT_NAMES.map((statGroup, groupIndex) => (
                              <tr key={groupIndex}>
                                {Object.entries(statGroup).map(([statKey, statName]) => (
                                  <td key={statKey} className="text-center">
                                    <strong>{statName}</strong><br />
                                    {typeof modeStats[statKey as keyof typeof modeStats] === 'number' 
                                      ? (modeStats[statKey as keyof typeof modeStats] as number).toLocaleString()
                                      : modeStats[statKey as keyof typeof modeStats]
                                    }
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    );
                  })}

                  {/* Challenges */}
                  {data.stats.challenges.length > 0 && (
                    <div className="p-3">
                      <h6 className="mb-3">Completed Challenges</h6>
                      <Row className="g-2">
                        {data.stats.challenges.map((challengeKey) => {
                          const challenge = CHALLENGES[challengeKey as keyof typeof CHALLENGES];
                          if (!challenge) return null;
                          
                          return (
                            <Col key={challengeKey} md={6} lg={4}>
                              <Card className="h-100">
                                <Card.Body className="p-2">
                                  <h6 className="card-title mb-1">{challenge.name}</h6>
                                  <p className="card-text small text-muted mb-1">
                                    Reward: {challenge.reward}
                                  </p>
                                  <ul className="small mb-0">
                                    {challenge.rules.map((rule, index) => (
                                      <li key={index}>{rule}</li>
                                    ))}
                                  </ul>
                                </Card.Body>
                              </Card>
                            </Col>
                          );
                        })}
                      </Row>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </div>        </div>
      </Container>
      </div>
    </>
  );
}
