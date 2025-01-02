import { useCreateProfile } from "@lens-protocol/react-web";
import toast from "react-hot-toast";
import { HandleInfo, Profile } from "@lens-protocol/react-web";
import { FaUser } from "react-icons/fa";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

function formatHandle(handle: HandleInfo): string {
  return `@${handle.fullHandle}`;
}

export function formatProfileIdentifier(profile: Profile): string {
  return (
    profile?.metadata?.displayName ??
    (profile.handle ? formatHandle(profile.handle) : profile.id)
  );
}

export function CreateProfileForm({ address }: { address: string }) {
  const { execute, loading } = useCreateProfile();

  const createProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const localName = formData.get("localName") as string;

    const result = await execute({ localName, to: address });

    if (result.isFailure()) {
      toast.error(result.error.message);
      return;
    }

    const profile = result.value;

    toast.success(
      `Congratulations! You now own: ${formatProfileIdentifier(profile)}!`,
    );
    return;
  };

  return (
    <form onSubmit={createProfile}>
      <fieldset>
        <legend className="text-center text-gray-600">
          Choose an handle for your profile
        </legend>

        <div className="bg-white rounded-xl h-80 w-72 p-7">
          <div className="h-full rounded-xl w-full bg-green-200 flex items-center justify-center">
            <FaUser size={200} className="text-green-500" />
          </div>
        </div>

        <div className=" w-full items-center   flex flex-col gap-2 py-5">
          <div className="h-12 flex items-center w-full ">
            <p className="w-[15%]"> lens/&nbsp;</p>
            <Input
              type="text"
              placeholder="Choose username"
              name="localName"
              disabled={loading}
              className="bg-background h-full w-[85%]  outline-none "
            />
          </div>
          <Button
            disabled={loading}
            type="submit"
            className="w-full h-12 font-semibold"
          >
            Mint
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
