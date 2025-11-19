import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/blog", label: "Blog" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ];

  if (isAuthenticated && user?.isAdmin) {
    navItems.push({ href: "/admin", label: "Admin" });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2" data-testid="link-home">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-lg">
              B
            </div>
            <span className="hidden font-bold text-xl sm:inline-block">BITSA</span>
          </Link>

          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${location === item.href
                  ? "text-foreground"
                  : "text-muted-foreground"
                  }`}
                data-testid={`link-nav-${item.label.toLowerCase()}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {!isLoading && !isAuthenticated && (
            <>
              <Link href="/auth">
                <Button
                  variant="ghost"
                  size="sm"
                  data-testid="button-login"
                  className="hidden sm:flex"
                >
                  Login
                </Button>
              </Link>
              <Link href="/auth">
                <Button
                  size="sm"
                  data-testid="button-register"
                  className="hidden sm:flex"
                >
                  Register
                </Button>
              </Link>
            </>
          )}

          {isAuthenticated && user && (
            <div className="hidden sm:flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2" data-testid="button-user-menu">
                    <Avatar className="h-8 w-8 border">
                      <AvatarImage src={user.profileImageUrl || undefined} />
                      <AvatarFallback>
                        {user.firstName?.charAt(0) || user.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium" data-testid="text-user-name">
                      {user.firstName || user.email}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center cursor-pointer">
                      <UserIcon className="h-4 w-4 mr-2" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => window.location.href = "/api/logout"}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t md:hidden">
          <nav className="container mx-auto flex flex-col gap-2 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent ${location === item.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
                  }`}
                onClick={() => setMobileMenuOpen(false)}
                data-testid={`link-mobile-${item.label.toLowerCase()}`}
              >
                {item.label}
              </Link>
            ))}
            {!isLoading && !isAuthenticated && (
              <div className="flex gap-2 pt-2 border-t">
                <Link href="/auth" className="flex-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    data-testid="button-mobile-login"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth" className="flex-1">
                  <Button
                    size="sm"
                    className="w-full"
                    data-testid="button-mobile-register"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {isAuthenticated && user && (
              <div className="flex flex-col gap-2 pt-2 border-t">
                <div className="flex items-center gap-2 px-3 py-2">
                  <Avatar className="h-8 w-8 border">
                    <AvatarImage src={user.profileImageUrl || undefined} />
                    <AvatarFallback>
                      {user.firstName?.charAt(0) || user.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium flex-1" data-testid="text-mobile-user-name">
                    {user.firstName || user.email}
                  </span>
                </div>
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    data-testid="button-mobile-profile"
                  >
                    <UserIcon className="h-4 w-4 mr-2" />
                    Profile Settings
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  data-testid="button-mobile-logout"
                  onClick={() => window.location.href = "/api/logout"}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
