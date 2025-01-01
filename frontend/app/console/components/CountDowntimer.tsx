import { Circle, Cycle } from "@/types";
import { useState, useEffect } from "react";

// Function to format time in days:hours:minutes:seconds or hours:minutes:seconds format
const formatTime = (seconds: number) => {
  const remainingSeconds = seconds % 60;
  if (seconds >= 86400) {
    // More than 24 hours, show in days:hours:minutes:seconds format
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
  } else {
    // Less than 24 hours, show in hours:minutes:seconds format
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }
};

// Function to get active cycle (assuming only one active cycle at a time)
const getActiveCycle = (selectedCircle: Circle): Cycle | null => {
  const currentTimestamp = BigInt(Math.floor(Date.now() / 1000)); // Get current timestamp as BigInt

  const activeCycle = selectedCircle.cycles.find((cycle) => {
    const { createdAt, deadline } = cycle;
    return createdAt <= currentTimestamp && currentTimestamp <= deadline;
  });

  return activeCycle || null; // Return the active cycle or null if none is active
};

const CountdownTimer = ({ selectedCircle }: { selectedCircle: Circle }) => {
  const [timeLeft, setTimeLeft] = useState<string>("00:00:00");

  useEffect(() => {
    // Get the active cycle
    const activeCycle = getActiveCycle(selectedCircle);

    if (activeCycle) {
      const deadlineTimestamp = Number(activeCycle.deadline);

      const countdownInterval = setInterval(() => {
        const currentTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
        const remainingTime = deadlineTimestamp - currentTimestamp;

        if (remainingTime <= 0) {
          clearInterval(countdownInterval);
          setTimeLeft("00:00:00"); // Timer reached zero
        } else {
          setTimeLeft(formatTime(remainingTime)); // Update the remaining time
        }
      }, 1000);

      // Cleanup the interval when the component is unmounted or the cycle changes
      return () => clearInterval(countdownInterval);
    }
  }, [selectedCircle]);

  return <>{timeLeft}</>;
};

export default CountdownTimer;
