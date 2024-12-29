import React from "react";
import { formatDistanceToNow } from "date-fns";

const TimeAgo = ({ timestamp }: { timestamp: number }) => {
  const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  return <small className="text-gray-500">{timeAgo}</small>;
};

export default TimeAgo;
