import { useState, useEffect } from 'react';

interface LiveTimerProps {
  startTime: number;
}

export default function LiveTimer({ startTime }: LiveTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 100);

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className="flex items-center gap-2 text-sm mt-1 select-none">
      <div className="flex items-center gap-1.5">
        {[0, 150, 300].map((delay) => (
          <div
            key={delay}
            className="w-2.5 h-2.5 rounded-full animate-bounce bg-indigo-500"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
      <span className="text-xs font-semibold font-mono text-gray-500">
        {(elapsed / 1000).toFixed(1)}s
      </span>
    </div>
  );
}
