import { GalleryCard } from "../GalleryCard";
import hackathonImage from "@assets/generated_images/Students_at_BITSA_hackathon_372741c9.png";

export default function GalleryCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <GalleryCard
        imageUrl={hackathonImage}
        title="Annual Hackathon 2024"
        caption="Students collaborating on innovative projects"
        uploadedAt="2024-10-20"
      />
    </div>
  );
}
