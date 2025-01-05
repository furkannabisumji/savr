import Image from "next/image";
import { useEffect, useState } from "react";
import { Source } from "graphql";
import * as blockies from "ethereum-blockies"; // Correct import
const ProfileImage = ({ src, alt }: { src: string; alt: string }) => {
  const [identiconUrl, setIdenticonUrl] = useState("");

  useEffect(() => {
    if (Source) {
      // Generate the blockie
      const options = {
        seed: src.toLowerCase(), // Seed string
        size: 8, // Dimensions of the blockie (8x8 grid)
        scale: 10, // Scale of the image
      };
      const canvas = blockies.create(options); // Correct function call
      setIdenticonUrl(canvas.toDataURL()); // Convert to data URL
    }
  }, [src]);

  return (
    <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-200 shadow-md">
      <Image
        src={identiconUrl}
        alt={alt}
        layout="fill"
        objectFit="cover"
        priority={true}
      />
    </div>
  );
};

export default ProfileImage;
