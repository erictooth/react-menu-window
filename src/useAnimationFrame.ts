import * as React from "react";

export function useAnimationFrame(
    update: Function,
    pause: boolean | Function = false,
    deps: Array<any> = []
) {
    const latestAnimationFrame = React.useRef<number | null>(null);

    React.useEffect(() => {
        if (typeof pause === "function" ? pause() : pause) {
            return;
        }

        latestAnimationFrame.current = requestAnimationFrame(() => {
            update();
        });

        return () => {
            if (latestAnimationFrame.current) {
                cancelAnimationFrame(latestAnimationFrame.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [update, pause, ...deps]);
}
