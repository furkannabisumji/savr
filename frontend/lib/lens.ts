import {
  fetchAccount,
  fetchAccountsAvailable,
} from "@lens-protocol/client/actions";
import { client } from "./client";
import { evmAddress } from "@lens-protocol/client";
import { privateKeyToAccount } from "viem/accounts";

export const getUsers = async (address: string) => {
  const result = await fetchAccountsAvailable(client, {
    managedBy: evmAddress(address),
    includeOwned: true,
  });
  if (result.isErr()) {
    return console.error(result.error);
  }

  const account = result.value;

  console.log(account);
};
