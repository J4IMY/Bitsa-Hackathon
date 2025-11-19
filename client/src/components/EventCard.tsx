import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendeeCount: string;
  imageUrl?: string;
}

export function EventCard({
  id,
  title,
  date,
  time,
  location,
  attendeeCount,
  imageUrl,
}: EventCardProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [currentAttendeeCount, setCurrentAttendeeCount] = useState(parseInt(attendeeCount) || 0);

  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString("default", { month: "short" });

  // Fetch registration status if authenticated
  const { data: registrationStatus } = useQuery({
    queryKey: [`/api/events/${id}/registration-status`],
    enabled: isAuthenticated,
    retry: false,
  });

  const isRegistered = registrationStatus?.isRegistered || false;

  // Update count when registrationStatus changes
  useEffect(() => {
    if (registrationStatus?.attendeeCount !== undefined) {
      setCurrentAttendeeCount(registrationStatus.attendeeCount);
    }
  }, [registrationStatus]);

  const registerMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/events/${id}/register`, {});
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: data.message || "You're registered for this event",
      });
      setCurrentAttendeeCount(data.attendeeCount);
      queryClient.invalidateQueries({ queryKey: [`/api/events/${id}/registration-status`] });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to register for event",
        variant: "destructive",
      });
    },
  });

  const unregisterMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `/api/events/${id}/register`, {});
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Unregistered",
        description: data.message || "You've been unregistered from this event",
      });
      setCurrentAttendeeCount(data.attendeeCount);
      queryClient.invalidateQueries({ queryKey: [`/api/events/${id}/registration-status`] });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to unregister from event",
        variant: "destructive",
      });
    },
  });

  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to register for events",
        variant: "destructive",
      });
      window.location.href = "/auth";
      return;
    }

    if (isRegistered) {
      unregisterMutation.mutate();
    } else {
      registerMutation.mutate();
    }
  };

  const isLoading = registerMutation.isPending || unregisterMutation.isPending;

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
                <span data-testid="text-event-time">
                  {(() => {
                    // Try to parse as 24h time (HH:mm)
                    const [hours, minutes] = time.split(':');
                    if (hours && minutes && !isNaN(Number(hours))) {
                      const date = new Date();
                      date.setHours(parseInt(hours));
                      date.setMinutes(parseInt(minutes));
                      return date.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      });
                    }
                    return time; // Return original if not in HH:mm format
                  })()}
                </span>
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
            <span data-testid="text-event-attendees">{currentAttendeeCount} attending</span>
          </div>
          <Button
            size="sm"
            variant={isRegistered ? "outline" : "default"}
            onClick={handleRegisterClick}
            disabled={isLoading}
            data-testid="button-register-event"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isRegistered ? "Unregistering..." : "Registering..."}
              </>
            ) : (
              isRegistered ? "Unregister" : "Register"
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
