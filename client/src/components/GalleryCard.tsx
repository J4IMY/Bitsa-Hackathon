import { Card } from "@/components/ui/card";
import { useState } from "react";

interface GalleryCardProps {
  imageUrl: string;
  title: string;
  caption?: string;
  uploadedAt: string;
}

export function GalleryCard({
  imageUrl,
  title,
  caption,
  uploadedAt,
}: GalleryCardProps) {
  const [showOverlay, setShowOverlay] = useState(false);

  const dateObj = new Date(uploadedAt);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card
      className="overflow-hidden cursor-pointer hover-elevate transition-all duration-200 border-2 relative"
      onMouseEnter={() => setShowOverlay(true)}
      onMouseLeave={() => setShowOverlay(false)}
      data-testid="card-gallery"
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      {showOverlay && (
        <div className="absolute inset-0 bg-black/70 flex flex-col justify-end p-4 transition-opacity">
          <h3 className="font-semibold text-lg text-white mb-1" data-testid="text-gallery-title">
            {title}
          </h3>
          {caption && (
            <p className="text-sm text-white/80 mb-2" data-testid="text-gallery-caption">
              {caption}
            </p>
          )}
          <p className="text-xs text-white/60" data-testid="text-gallery-date">{formattedDate}</p>
        </div>
      )}
    </Card>
  );
}
