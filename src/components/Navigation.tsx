"use client";

import Link from "next/link";
import Image from "next/image";
import { Navbar, Nav, Container, Form, Button } from "react-bootstrap";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navigation() {
  const [searchUsername, setSearchUsername] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUsername.trim()) {
      router.push(`/user/${encodeURIComponent(searchUsername.trim())}`);
      setSearchUsername("");
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Link href="/" passHref legacyBehavior>
          <Navbar.Brand>
            <Image src="/short_bed.png" alt="BW Stats" height="32" width="32" className="d-inline-block align-top me-2" />
            Hypixel Bedwars Stats
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link href="/" passHref legacyBehavior>
              <Nav.Link>Stats</Nav.Link>
            </Link>
            <Link href="/about" passHref legacyBehavior>
              <Nav.Link>About</Nav.Link>
            </Link>
            <Link href="/leaderboards" passHref legacyBehavior>
              <Nav.Link>Leaderboards</Nav.Link>
            </Link>
          </Nav>
          <Form className="d-flex" onSubmit={handleSearch}>
            <Form.Control type="search" placeholder="Search player..." className="me-2" value={searchUsername} onChange={(e) => setSearchUsername(e.target.value)} size="sm" />
            <Button variant="outline-light" type="submit" size="sm">
              Search
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
