import { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
import lighthouse from "@lighthouse-web3/sdk";
import { uploadAsJson } from "@/lib/storage-client";
import Image from "next/image";

interface ImageUploaderProps {
  image: string | null;
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ image, setImage }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLoading(true);
      const file = e.target.files[0];

      try {
        const filesArray = [file];
        const { data } = await lighthouse.upload(
          filesArray,
          process.env.NEXT_PUBLIC_LIGHTHOUSE_KEY as string,
        );
        const uploadedImageUrl = `${data.Hash}`;
        setImage(uploadedImageUrl);
      } catch (error) {
        console.error("Error uploading file:", error);
        toast({ title: "Error", description: "Error uploading file" });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center h-72 w-full max-w-sm relative ">
      <div
        onClick={() => document.getElementById("imageUploadInput")?.click()}
        className={`absolute inset-0 z-50 w-full flex justify-center items-center
          border-2 border-dashed rounded-xl cursor-pointer
          ${image ? "border-transparent" : "border-gray-400 hover:border-gray-500"}`}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 animate-spin text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <span>Uploading...</span>
          </div>
        ) : (
          !image && (
            <div className="h-full rounded-xl w-full bg-green-200 flex items-center relative justify-center">
              <span className="text-gray-600 flex items-center gap-3 absolute">
                <FiUploadCloud size={20} /> Click to upload
              </span>
              <FaUser size={200} className="text-green-500" />
            </div>
          )
        )}
      </div>
      <input
        type="file"
        id="imageUploadInput"
        accept="image/.jpg , image.webp, image.png"
        className="hidden"
        onChange={handleImageUpload}
      />
      {image && (
        <div className="relative w-full h-full">
          <Image
            src={`${process.env.NEXT_PUBLIC_LIGHTHOUSE_GATE_WAY}${image}`}
            alt="Uploaded"
            priority={true}
            fill
            className="object-cover rounded-md"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
