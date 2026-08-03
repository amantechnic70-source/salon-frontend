import { useEffect, useState } from "react";

export function useElapsedTime(startTime: Date | null) {
    const [elapsed, setElapsed] = useState("00:00:00");

    useEffect(() => {
        if (!startTime) {
            setElapsed("00:00:00");
            return;
        }

        const tick = () => {
            const diffMs = Date.now() - startTime.getTime();
            const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));

            const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
            const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
                2,
                "0"
            );
            const seconds = String(totalSeconds % 60).padStart(2, "0");

            setElapsed(`${hours}:${minutes}:${seconds}`);
        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    return elapsed;
}