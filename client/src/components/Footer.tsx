import { Link } from "wouter";
import { Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="border p-4">
            <h3 className="font-bold text-lg mb-4">About BITSA</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bachelor of Information Technology Students Association - fostering community,
              innovation, and excellence in IT education.
            </p>
          </div>

          <div className="border p-4">
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/events"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-events"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-blog"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-gallery"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-contact"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="border p-4">
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href="mailto:bitsaofficial@gmail.com" className="hover:text-foreground transition-colors" data-testid="link-email">
                  bitsaofficial@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span data-testid="text-phone">President: +254 XXX XXX XXX</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span data-testid="text-phone-vp">VP: +254 XXX XXX XXX</span>
              </li>
            </ul>
          </div>

          <div className="border p-4">
            <h3 className="font-bold text-lg mb-4">Follow Us</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-md border hover-elevate active-elevate-2"
                data-testid="link-facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-md border hover-elevate active-elevate-2"
                data-testid="link-twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-md border hover-elevate active-elevate-2"
                data-testid="link-instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-md border hover-elevate active-elevate-2"
                data-testid="link-linkedin"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} BITSA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
