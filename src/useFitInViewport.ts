import * as React from "react";
import { useAnimationFrame } from "./useAnimationFrame";

import { getFitOffsets } from "./positionerUtils";

type PositionType = { left: number; top: number };

const DEFAULT_POSITION: PositionType = { top: 0, left: 0 };

export function useFitInViewport(
    elemRef: React.MutableRefObject<HTMLElement | null>,
    targetPos: PositionType | null,
    viewportOffset: number = 0
) {
    const [style, setStyle] = React.useState<PositionType | null>(targetPos);

    React.useEffect(() => {
        setStyle(targetPos);
    }, [targetPos]);

    useAnimationFrame(
        () => {
            if (!elemRef.current) {
                return;
            }

            const { x, y } = getFitOffsets(viewportOffset)(elemRef.current.getBoundingClientRect());
            setStyle((prevStyle) => {
                const nextStyle = {
                    top: (prevStyle || DEFAULT_POSITION).top + y,
                    left: (prevStyle || DEFAULT_POSITION).left + x,
                };

                return nextStyle;
            });
        },
        () => !elemRef.current,
        [style]
    );

    return { style };
}
