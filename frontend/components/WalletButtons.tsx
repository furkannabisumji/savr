import { ConnectKitButton } from "connectkit";
import { Button } from "./ui/button";
import { useAccount, useDisconnect } from "wagmi";

export function ConnectWalletButton() {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress }) => {
        return (
          <Button onClick={show} variant="secondary">
            {isConnected ? truncatedAddress : "Connect Wallet"}
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
}

export function DisconnectWalletButton() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    disconnect();
  };

  if (!isConnected) {
    return null;
  }

  return <ButtonAlt onClick={handleClick}>Disconnect</ButtonAlt>;
}

export function ButtonAlt({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="flex justify-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 disabled:opacity-75"
    >
      {children}
    </button>
  );
}

import { useLogout } from "@lens-protocol/react-web";
export function LogoutButton() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { execute } = useLogout();

  const logout = () => {
    void execute();
    disconnect();
  };

  if (!isConnected) {
    return null;
  }

  return <Button onClick={() => logout()}>Log out</Button>;
}
