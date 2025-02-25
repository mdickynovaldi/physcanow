"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 px-4",
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="wrapper py-6 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold px-2">
          I-Kan Store
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="hover:text-primary transition-colors px-2 py-1"
          >
            Beranda
          </Link>
          <Link
            href="/products"
            className="hover:text-primary transition-colors px-2 py-1"
          >
            Produk
          </Link>
          <Link
            href="/about"
            className="hover:text-primary transition-colors px-2 py-1"
          >
            Tentang Kami
          </Link>
          <Link
            href="/contact"
            className="hover:text-primary transition-colors px-2 py-1"
          >
            Kontak
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {status === "authenticated" && session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline-block">
                    {session.user.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {session.user.role === "STUDENT" ? (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard-siswa">Dashboard</Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link
                  href="/login"
                  className="hover:text-primary transition-colors"
                >
                  Masuk
                </Link>
              </Button>
              <Button
                variant="default"
                asChild
                className="dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
              >
                <Link href="/register">Daftar</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
