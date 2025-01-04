"use client";

import {
  SessionType,
  useSession as useLensSession,
} from "@lens-protocol/react-web";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { getUsers } from "@/lib/lens";
import { authUser } from "@/lib/userAuth";
import { v4 as uuidv4 } from "uuid";
import { useMutation, useQuery } from "@apollo/client";
import {
  CHALLENGE_MUTATION,
  CREATE_ACCOUNT_MUTATION,
  AUTHENTICATE_MUTATION,
  ACCOUNT_QUERY,
  SWITCH_ACCOUNT_MUTATION,
} from "@/lib/queries";
import { uploadAsJson } from "@/lib/storage-client";
import ImageUploader from "./ImageUploader";
import { Input } from "./ui/input";
import {
  ConnectWalletButton,
  DisconnectWalletButton,
  LogoutButton,
} from "./WalletButtons";
import { walletClient } from "@/lib/viem";
import { useTransactionStatusQuery } from "@/hooks/useTransactionStatusQuery"; // Import the hook

export function WelcomeToSavr() {
  const { isConnected, address, isConnecting } = useAccount();
  const { data: session } = useLensSession();
  const [image, setImage] = useState<string | null>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [localName, setLocalName] = useState<string>("");
  const [challenge] = useMutation(CHALLENGE_MUTATION);
  const [createAccountWithUsername] = useMutation(CREATE_ACCOUNT_MUTATION);
  const [authenticate] = useMutation(AUTHENTICATE_MUTATION);
  const [switchAccount] = useMutation(SWITCH_ACCOUNT_MUTATION);

  const [txHash, setTxHash] = useState<string>("");

  // Query transaction status using the txHash
  const {
    data: txStatusData,
    loading: txStatusLoading,
    error: txStatusError,
  } = useTransactionStatusQuery(txHash);

  // Query account info using txHash (new query)
  const {
    data: accountData,
    loading: accountLoading,
    error: accountError,
    refetch, // Expose refetch for manual querying
    stopPolling, // Allows stopping polling when condition is met
  } = useQuery(ACCOUNT_QUERY, {
    skip: !txHash, // Only run the query when txHash is available
    variables: {
      request: {
        txHash: txHash,
      },
    },
    pollInterval: 5000, // Poll every 5 seconds
    notifyOnNetworkStatusChange: true, // Notify when polling
  });

  // console.log(accountData, txStatusData);
  const handleChallengeMutation = async () => {
    if (!address || !image || !localName) {
      console.error("Fill all data");
      return;
    }

    setIsGenerating(true);
    try {
      await authUser(address);

      const { data: challengeData } = await challenge({
        variables: {
          request: {
            onboardingUser: {
              wallet: address,
              app: process.env.NEXT_PUBLIC_APP_ADDRESS,
            },
          },
        },
      });

      if (!challengeData?.challenge?.text) {
        throw new Error("Challenge data is missing");
      }

      const signature = await walletClient.signMessage({
        account: address,
        message: challengeData.challenge.text,
      });

      // Authenticate and get access token
      const authResponse = await authenticate({
        variables: { request: { id: challengeData.challenge.id, signature } },
      });

      const { accessToken } = authResponse?.data?.authenticate || {};

      if (!accessToken) {
        throw new Error("Authentication failed: no access token received");
      }

      const metadata = {
        $schema: "https://json-schemas.lens.dev/account/1.0.0.json",
        lens: {
          id: uuidv4(),
          picture: process.env.NEXT_PUBLIC_LIGHTHOUSE_GATE_WAY + image,
        },
      };

      const { Hash } = await uploadAsJson(metadata);
      const uri = process.env.NEXT_PUBLIC_LIGHTHOUSE_GATE_WAY + Hash;

      const request = {
        username: { localName },
        metadataUri: uri,
        accountManager: address,
      };

      const { data: accountDataResp } = await createAccountWithUsername({
        variables: { request },
        context: {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Pass access token in the header
          },
        },
      });

      if (accountDataResp?.createAccountWithUsername?.hash) {
        const newTxHash = accountDataResp.createAccountWithUsername.hash;
        setTxHash(newTxHash); // Set the transaction hash here
        console.log("Account created with hash:", newTxHash);
      }
    } catch (err) {
      console.error("Error during mutation flow:", err);
      setIsGenerating(false);
    }
  };

  const handleSwitchAccount = async (account: string) => {
    if (!account) {
      console.error("Account address is required to switch.");
      return;
    }

    //authenticate as accountOwner
    const { data: challengeData } = await challenge({
      variables: {
        request: {
          accountOwner: {
            app: process.env.NEXT_PUBLIC_APP_ADDRESS,
            account,
            owner: address,
          },
        },
      },
    });

    if (!challengeData?.challenge?.text) {
      throw new Error("Challenge data is missing");
    }

    const signature = await walletClient.signMessage({
      account: address,
      message: challengeData.challenge.text,
    });

    // Authenticate and get access token
    const authResponse = await authenticate({
      variables: { request: { id: challengeData.challenge.id, signature } },
    });
    console.log(authResponse);
    const { accessToken, refereshToken, idToken } =
      authResponse?.data?.authenticate || {};

    try {
      const response = await switchAccount({
        variables: {
          request: {
            account: account, // Use the destructured address here
          },
        },
        context: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Refresh-Token": refereshToken,
            "X-ID-Token": idToken,
          },
        },
      });

      if (response.data.switchAccount.__typename === "AuthenticationTokens") {
        console.log("Tokens received:", response.data.switchAccount);
      } else if (response.data.switchAccount.__typename === "ForbiddenError") {
        console.error(
          "Switch account failed:",
          response.data.switchAccount.reason,
        );
      }
    } catch (err) {
      console.error("Error switching account:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (
      accountData &&
      accountData.account &&
      txStatusData &&
      txStatusData.transactionStatus.__typename === "FinishedTransactionStatus"
    ) {
      const {
        address,
        createdAt,
        metadata, // Destructure metadata directly
        owner,
        username,
      } = accountData.account;

      // Check if metadata exists and destructure safely
      const { picture } = metadata || {}; // Fallback to an empty object if metadata is null or undefined
      const { localName } = username || {}; // Fallback to an empty object if username is null or undefined

      // Ensure metadata and other fields are available
      if (metadata && Object.keys(metadata).length > 0) {
        console.log("Account Address:", address);
        console.log("Created At:", createdAt);
        console.log("Profile Picture:", picture);
        console.log("Owner Address:", owner);
        console.log("Username:", localName);

        // Call handleSwitchAccount and stop polling
        handleSwitchAccount(address);
        stopPolling(); // Stop polling once the desired condition is met
      }
    }
  }, [accountData, txStatusData, stopPolling]);

  useEffect(() => {
    if (address) {
      getUsers(address);
    }
  }, [address]);

  if (!isConnected && !isConnecting) {
    return (
      <>
        <p className="mb-4 text-gray-500">
          Connect your wallet to get started.
        </p>
        <ConnectWalletButton />
      </>
    );
  }

  if (!session?.authenticated && address) {
    return (
      <>
        <p className="text-base text-gray-500">
          No Lens Profiles found in this wallet.
        </p>
        <ImageUploader image={image} setImage={setImage} />
        <div className="w-full max-w-sm flex flex-col gap-2 py-5">
          <div className="h-12 flex items-center w-full">
            <p className="w-[15%]">lens/&nbsp;</p>
            <Input
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              disabled={isGenerating}
              placeholder="Choose username"
              className="bg-background h-full w-[85%] outline-none"
            />
          </div>
          <Button
            onClick={handleChallengeMutation}
            disabled={isGenerating}
            className="w-full h-12 font-semibold"
          >
            {isGenerating ? "Generating..." : "Get one"}
          </Button>
        </div>
        <DisconnectWalletButton />
      </>
    );
  }

  if (session && session.type === SessionType.WithProfile) {
    return (
      <>
        <p className="mb-4 text-gray-500">
          You are logged in as{" "}
          <span className="text-gray-800 font-semibold">
            {session.profile.handle?.fullHandle ?? session.profile.id}
          </span>
        </p>
        <LogoutButton />
      </>
    );
  }

  // Display the transaction status section if txHash exists
  return (
    <>
      {txHash && (
        <div className="w-full max-w-sm flex flex-col gap-2 py-5">
          <p className="mb-2 text-gray-500">Transaction Status</p>
          {txStatusLoading && <p>Loading transaction status...</p>}
          {txStatusError && <p>Error: {txStatusError.message}</p>}

          {txStatusData && (
            <div>
              {txStatusData.transactionStatus.__typename ===
                "NotIndexedYetStatus" && (
                <p>
                  Transaction not indexed yet:{" "}
                  {txStatusData.transactionStatus.reason}
                </p>
              )}
              {txStatusData.transactionStatus.__typename ===
                "PendingTransactionStatus" && (
                <p>
                  Transaction pending, block timestamp:{" "}
                  {txStatusData.transactionStatus.blockTimestamp}
                </p>
              )}
              {txStatusData.transactionStatus.__typename ===
                "FinishedTransactionStatus" && (
                <p>
                  Transaction finished, block timestamp:{" "}
                  {txStatusData.transactionStatus.blockTimestamp}
                </p>
              )}
              {txStatusData.transactionStatus.__typename ===
                "FailedTransactionStatus" && (
                <p>
                  Transaction failed: {txStatusData.transactionStatus.reason},
                  block timestamp:{" "}
                  {txStatusData.transactionStatus.blockTimestamp}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Display account details from txHash query */}
      {accountData && (
        <div className="w-full max-w-sm flex flex-col gap-2 py-5">
          <p className="mb-2 text-gray-500">Account Information</p>
          {accountLoading && <p>Loading account information...</p>}
          {accountError && <p>Error: {accountError.message}</p>}

          {accountData.account && (
            <div>
              <p>
                <strong>Address:</strong> {accountData.account.address}
              </p>
              <p>
                <strong>Username:</strong> {accountData.account.username}
              </p>
              {accountData.account.metadata && (
                <div>
                  <p>
                    <strong>Name:</strong> {accountData.account.metadata.name}
                  </p>
                  <p>
                    <strong>Picture:</strong>{" "}
                    {accountData.account.metadata.picture}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
