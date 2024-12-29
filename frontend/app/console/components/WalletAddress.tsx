import React from "react";

interface WalletAddressProps {
  address: string;
  startLength?: number;
  endLength?: number;
}

const truncateAddress = (
  address: string,
  startLength: number = 6,
  endLength: number = 4,
): string => {
  if (!address) return "";
  return `${address.substring(0, startLength)}...${address.substring(address.length - endLength)}`;
};

const WalletAddress: React.FC<WalletAddressProps> = ({
  address,
  startLength = 4,
  endLength = 3,
}) => {
  const truncated = truncateAddress(address, startLength, endLength);
  return <span>{truncated}</span>;
};

export default WalletAddress;
