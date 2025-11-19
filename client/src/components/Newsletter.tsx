import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <section className="py-12 md:py-20 bg-card border-y-4">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto p-8 md:p-12 text-center border-2">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-newsletter-title">
            Stay Updated
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Subscribe to our newsletter and never miss important updates, events, and opportunities
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 border-2"
              data-testid="input-newsletter-email"
            />
            <Button type="submit" size="default" data-testid="button-newsletter-submit">
              Subscribe
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
