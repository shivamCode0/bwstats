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
      window.location.href = `/user/${encodeURIComponent(searchUsername.trim())}`;
      setSearchUsername("");
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { href: "/", label: "Stats" },
    { href: "/leaderboards", label: "Leaderboards" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bosrder-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/55 shadow-neutral-950/20 shadow-xl">
      <div className="lg:container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Image src="/short_bed.png" alt="BW Stats" height={36} width={36} className="rounded-lg" />
            <div className="flex flex-col">
              <span className="hidden font-bold text-lg leading-tight sm:inline-block">Hypixel Bedwars Stats</span>
              <span className="font-bold text-lg sm:hidden">BW Stats</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-base font-medium text-gray-800 hover:text-gray-950 transition-colors duration-200 hover:underline underline-offset-4">
                {item.label}
              </Link>
            ))}
          </div>

          {/* Search Form - Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <Input type="search" placeholder="Search player..." className="w-40 lg:w-56 h-9 text-sm p-2 lg:p-3" value={searchUsername} onChange={(e) => setSearchUsername(e.target.value)} />
              <Button type="submit" size="sm" variant="default" className="h-9 px-3">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </form>
          </div>

          {/* Mobile menu button */}
          <Button variant="ghost" size="sm" className="md:hidden h-10 w-10 p-0" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="border-t bg-white/95 backdrop-blur-sm md:hidden">
            <div className="flex flex-col space-y-1 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-2 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile Search */}
              <div className="px-2 pt-4 border-t mt-4">
                <form onSubmit={handleSearch} className="flex items-center space-x-2">
                  <Input type="search" placeholder="Search player..." value={searchUsername} onChange={(e) => setSearchUsername(e.target.value)} className="flex-1 h-10 text-base" />
                  <Button type="submit" size="sm" variant="default" className="h-10 px-4">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
