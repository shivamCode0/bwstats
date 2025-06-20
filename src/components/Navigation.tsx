'use client';

import Link from 'next/link';
import { Navbar, Nav, Container, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const [searchUsername, setSearchUsername] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUsername.trim()) {
      router.push(`/user/${encodeURIComponent(searchUsername.trim())}`);
      setSearchUsername('');
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} href="/">
          <img
            src="/short_bed_5.png"
            width="30"
            height="30"
            className="d-inline-block align-top me-2"
            alt="BWStats logo"
          />
          BWStats
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/">Home</Nav.Link>
            <Nav.Link as={Link} href="/leaderboards">Leaderboards</Nav.Link>
          </Nav>
          <Form className="d-flex" onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder="Search player..."
              className="me-2"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              size="sm"
            />
            <Button variant="outline-light" type="submit" size="sm">
              Search
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
