import { Card } from "@/components/ui/card";
import { Code, Users, Award, Briefcase, BookOpen, Rocket } from "lucide-react";

const benefits = [
  {
    icon: Code,
    title: "Workshops & Hackathons",
    description: "Participate in hands-on coding sessions and competitive hackathons",
  },
  {
    icon: Users,
    title: "Networking",
    description: "Connect with fellow IT students and industry professionals",
  },
  {
    icon: Award,
    title: "Recognition",
    description: "Earn certificates and recognition for your achievements",
  },
  {
    icon: Briefcase,
    title: "Career Opportunities",
    description: "Access internship and job opportunities from our partners",
  },
  {
    icon: BookOpen,
    title: "Learning Resources",
    description: "Get access to exclusive learning materials and tutorials",
  },
  {
    icon: Rocket,
    title: "Innovation Projects",
    description: "Work on real-world projects and build your portfolio",
  },
];

export function MembershipBenefits() {
  return (
    <section className="py-12 md:py-20 border-4">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-benefits-title">
            Membership Benefits
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Join BITSA and unlock exclusive opportunities to grow your skills and network
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="p-6 hover-elevate transition-all duration-200 border-2" data-testid={`card-benefit-${index}`}>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 border-2 border-primary/20 flex-shrink-0">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2" data-testid={`text-benefit-title-${index}`}>
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed" data-testid={`text-benefit-description-${index}`}>
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
