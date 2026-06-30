import { useState, useEffect } from "react";

export interface CountdownTime {
  hours: number;
  minutes: number;
  seconds: number;
}

export function useCountdown(targetDate: Date | number): CountdownTime {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({ hours: 0, minutes: 0, seconds: 0 });

  const targetTime = typeof targetDate === "number" ? targetDate : targetDate.getTime();

  useEffect(() => {
    function calculateTimeLeft() {
      const now = Date.now();
      const diffMs = targetTime - now;

      if (diffMs <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      const totalSecs = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSecs / 3600);
      const minutes = Math.floor((totalSecs % 3600) / 60);
      const seconds = totalSecs % 60;

      return { hours, minutes, seconds };
    }

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  return timeLeft;
}
