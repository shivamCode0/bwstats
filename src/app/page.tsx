'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import Navigation from '@/components/Navigation';

export default function Home() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/user/${encodeURIComponent(username.trim())}`);
    }
  };

  const backgroundImageIndex = Math.floor(Math.random() * 14) + 1;

  return (
    <>
      <Navigation />
      <div 
        className="background-image"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), url(/bgimg/${backgroundImageIndex}.jpeg)`
        }}
      >
      <div className="hero-image">
        <div className="hero-text">
          <h1 className="display-4 fw-bold mb-4">Hypixel Bedwars Stats</h1>
          <p className="lead mb-4">Track your Bedwars statistics and view leaderboards</p>
          
          <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Enter your Minecraft username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                size="lg"
                className="text-center"
                style={{ fontSize: '1.1rem' }}
              />
            </Form.Group>
            <Button 
              variant="primary" 
              type="submit" 
              size="lg"
              disabled={!username.trim()}
              className="fw-bold"
            >
              View Stats
            </Button>
          </Form>
        </div>
      </div>

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={10}>
            <Row className="g-4">
              <Col md={4}>
                <Card className="h-100 text-center">
                  <Card.Body>
                    <Card.Title>Player Stats</Card.Title>
                    <Card.Text>
                      View detailed Bedwars statistics including kills, deaths, wins, losses, and more across all game modes.
                    </Card.Text>
                    <Button variant="outline-primary" href="/user/dream">
                      View Example
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="h-100 text-center">
                  <Card.Body>
                    <Card.Title>Leaderboards</Card.Title>
                    <Card.Text>
                      Check out the top players in Bedwars by level, wins, and final kills.
                    </Card.Text>
                    <Button variant="outline-primary" href="/leaderboards">
                      View Leaderboards
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="h-100 text-center">
                  <Card.Body>
                    <Card.Title>Fast & Cached</Card.Title>
                    <Card.Text>
                      Data is cached for 5 minutes to ensure fast loading times and reduce API calls.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      <footer className="footer bg-dark text-light py-3">
        <Container>
          <Row>
            <Col className="text-center">
              <p className="mb-0">
                &copy; 2025 Hypixel Bedwars Stats. Not affiliated with Hypixel or Mojang.
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
      </div>
    </>
  );
}
