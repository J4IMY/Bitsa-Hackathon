import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/BITSA_students_collaborating_together_b50f10ca.png";

export function Hero() {
  return (
    <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden border-4">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <h1 className="text-5xl md:text-7xl font-bold mb-6" data-testid="text-hero-title">
          Bachelor of IT Students Association
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed" data-testid="text-hero-subtitle">
          Join a vibrant community of tech enthusiasts, innovators, and future IT leaders
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-primary/90 backdrop-blur-md border border-primary-border hover:bg-primary"
            data-testid="button-register-now"
          >
            Register Now
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-background/20 backdrop-blur-md border-white/30 text-white hover:bg-background/30"
            data-testid="button-view-events"
          >
            View Events
          </Button>
        </div>
      </div>
    </section>
  );
}
