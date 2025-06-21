"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ModernNavigation() {
  const [searchUsername, setSearchUsername] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUsername.trim()) {
      router.push(`/user/${encodeURIComponent(searchUsername.trim())}`);
      setSearchUsername("");
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { href: "/", label: "Stats" },
    { href: "/about", label: "About" },
    { href: "/leaderboards", label: "Leaderboards" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/short_bed.png" alt="BW Stats" height={32} width={32} className="rounded-md" />
            <span className="hidden font-bold sm:inline-block">Hypixel Bedwars Stats</span>
            <span className="font-bold sm:hidden">BW Stats</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium transition-colors hover:text-primary">
                {item.label}
              </Link>
            ))}
          </div>

          {/* Search Form - Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <Input type="search" placeholder="Search player..." value={searchUsername} onChange={(e) => setSearchUsername(e.target.value)} className="w-64" />
              <Button type="submit" size="sm" variant="outline">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </form>
          </div>

          {/* Mobile menu button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="border-t py-4 md:hidden">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="flex items-center space-x-2 pt-3">
                <Input type="search" placeholder="Search player..." value={searchUsername} onChange={(e) => setSearchUsername(e.target.value)} className="flex-1" />
                <Button type="submit" size="sm" variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
