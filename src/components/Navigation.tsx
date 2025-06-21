"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu } from "lucide-react";

export default function Navigation() {
  const [searchUsername, setSearchUsername] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUsername.trim()) {
      router.push(`/user/${encodeURIComponent(searchUsername.trim())}`);
      setSearchUsername("");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-800 border-b border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors">
            <Image src="/short_bed.png" alt="BW Stats" height="32" width="32" className="inline-block" />
            <span className="font-semibold text-lg">Hypixel Bedwars Stats</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Stats
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/leaderboards" className="text-gray-300 hover:text-white transition-colors">
              Leaderboards
            </Link>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <Input
                type="search"
                placeholder="Search player..."
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                className="w-40 bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
              />
              <Button type="submit" size="sm" variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
                <Search className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Stats
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/leaderboards" className="text-gray-300 hover:text-white transition-colors">
                Leaderboards
              </Link>

              {/* Mobile Search Form */}
              <form onSubmit={handleSearch} className="flex items-center space-x-2">
                <Input
                  type="search"
                  placeholder="Search player..."
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                  className="flex-1 bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                />
                <Button type="submit" size="sm" variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
                  <Search className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        )}{" "}
      </div>
    </nav>
  );
}
