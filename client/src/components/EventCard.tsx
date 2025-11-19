import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  attendeeCount: string;
  imageUrl?: string;
}

export function EventCard({
  title,
  date,
  time,
  location,
  attendeeCount,
  imageUrl,
}: EventCardProps) {
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString("default", { month: "short" });

  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-200 border-2">
      {imageUrl && (
        <div className="aspect-video overflow-hidden border-b-2">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex gap-4 mb-4">
          <div className="flex flex-col items-center justify-center rounded-md bg-primary/10 border-2 border-primary/20 px-4 py-2 min-w-[60px]">
            <span className="text-2xl font-bold text-primary" data-testid="text-event-day">{day}</span>
            <span className="text-xs font-semibold text-muted-foreground uppercase" data-testid="text-event-month">
              {month}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-xl mb-2 line-clamp-2" data-testid="text-event-title">
              {title}
            </h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span data-testid="text-event-time">{time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span data-testid="text-event-location">{location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span data-testid="text-event-attendees">{attendeeCount} attending</span>
          </div>
          <Button size="sm" data-testid="button-register-event">Register</Button>
        </div>
      </div>
    </Card>
  );
}
