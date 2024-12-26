import Image from "next/image";

const ProfileImage = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-200 shadow-md">
      <Image
        src={src}
        alt={alt}
        layout="fill"
        objectFit="cover"
        priority={true}
      />
    </div>
  );
};

export default ProfileImage;
