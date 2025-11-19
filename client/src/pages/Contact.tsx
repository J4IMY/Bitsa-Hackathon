import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import presidentImage from "@assets/generated_images/BITSA_President_professional_portrait_b7a70d56.png";
import vpImage from "@assets/generated_images/BITSA_Vice_President_portrait_fa1bcf0d.png";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen border-4">
      <div className="bg-card border-b-4 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-contact-title">
            Contact Us
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            Have questions or want to get involved? Reach out to us and we'll get back to you as soon as possible.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center" data-testid="text-leadership-title">
            Meet Our Leadership
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 border-2">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 mb-4 border-4 border-primary/20">
                  <AvatarImage src={presidentImage} alt="BITSA President" />
                  <AvatarFallback>PR</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold mb-1" data-testid="text-president-name">
                  John Kamau
                </h3>
                <p className="text-sm text-primary font-semibold mb-4" data-testid="text-president-title">
                  President
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4" data-testid="text-president-bio">
                  A passionate tech leader with 3 years of experience in software development. John is dedicated to fostering innovation and collaboration within the BITSA community. He specializes in full-stack development and has led multiple successful hackathon projects.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span data-testid="text-president-phone">+254 712 345 678</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <a 
                      href="mailto:president@bitsa.com" 
                      className="hover:text-primary transition-colors"
                      data-testid="link-president-email"
                    >
                      president@bitsa.com
                    </a>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 mb-4 border-4 border-primary/20">
                  <AvatarImage src={vpImage} alt="BITSA Vice President" />
                  <AvatarFallback>VP</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold mb-1" data-testid="text-vp-name">
                  Grace Wanjiru
                </h3>
                <p className="text-sm text-primary font-semibold mb-4" data-testid="text-vp-title">
                  Vice President
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4" data-testid="text-vp-bio">
                  An experienced organizer and tech enthusiast focused on creating inclusive learning environments. Grace coordinates BITSA events and workshops, ensuring every member has opportunities to grow. She has expertise in UI/UX design and community building.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span data-testid="text-vp-phone">+254 723 456 789</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <a 
                      href="mailto:vp@bitsa.com" 
                      className="hover:text-primary transition-colors"
                      data-testid="link-vp-email"
                    >
                      vp@bitsa.com
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6" data-testid="text-get-in-touch">
              Get In Touch
            </h2>

            <div className="space-y-6">
              <Card className="p-6 border-2">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 border-2 border-primary/20 flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <a
                      href="mailto:bitsaofficial@gmail.com"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      data-testid="link-contact-email"
                    >
                      bitsaofficial@gmail.com
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-2">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 border-2 border-primary/20 flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Phone</h3>
                    <p className="text-muted-foreground mb-1" data-testid="text-contact-president">
                      President: +254 XXX XXX XXX
                    </p>
                    <p className="text-muted-foreground" data-testid="text-contact-vp">
                      Vice President: +254 XXX XXX XXX
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-2">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 border-2 border-primary/20 flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Location</h3>
                    <p className="text-muted-foreground" data-testid="text-contact-location">
                      BITSA Lab<br />
                      Computer Science Department<br />
                      University Campus
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div>
            <Card className="p-8 border-2">
              <h2 className="text-2xl font-bold mb-6" data-testid="text-send-message">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="border-2"
                    data-testid="input-contact-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="border-2"
                    data-testid="input-contact-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="What is this about?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="border-2"
                    data-testid="input-contact-subject"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Your message..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="border-2"
                    data-testid="input-contact-message"
                  />
                </div>

                <Button type="submit" className="w-full" data-testid="button-send-message">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
