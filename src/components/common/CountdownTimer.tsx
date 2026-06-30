import { useCountdown } from "../../hooks/useCountdown";

interface CountdownTimerProps {
  targetDate?: Date | number;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const getNextMidnight = () => {
    const nextMid = new Date();
    nextMid.setHours(24, 0, 0, 0);
    return nextMid;
  };

  const target = targetDate ?? getNextMidnight();
  const { hours, minutes, seconds } = useCountdown(target);

  const padNum = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="flex gap-[4px] items-center">
      <div className="bg-gray rounded-[7px] px-2.5 py-[3px] font-display text-[16px] font-bold text-dark min-w-[36px] text-center">
        {padNum(hours)}
      </div>
      <span className="font-display font-bold text-dark">:</span>
      <div className="bg-gray rounded-[7px] px-2.5 py-[3px] font-display text-[16px] font-bold text-dark min-w-[36px] text-center">
        {padNum(minutes)}
      </div>
      <span className="font-display font-bold text-dark">:</span>
      <div className="bg-gray rounded-[7px] px-2.5 py-[3px] font-display text-[16px] font-bold text-dark min-w-[36px] text-center">
        {padNum(seconds)}
      </div>
    </div>
  );
}
