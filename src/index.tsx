import * as React from "react";
import { Portal } from "reakit/Portal";
import { useFitInViewport } from "./useFitInViewport";
import { useAttachEventListeners } from "./useAttachEventListeners";

type ContentPosition = { top: number; left: number };
export type MenuWindowProps = {
    children: React.ReactElement<any>;
    hideOn: string;
    getPosition: (e: React.MouseEvent) => ContentPosition;
    render: (e: React.MouseEvent, props: { close: () => void }) => React.ReactElement<any>;
    shouldOpen: () => boolean;
    viewportOffset: number;
};

const GET_POSITION_DEFAULT: MenuWindowProps["getPosition"] = (e) => ({
    top: e.pageY,
    left: e.pageX,
});
const HIDE_ON_DEFAULT = "resize contextmenu mousedown click scroll keydown";
const SHOULD_OPEN_DEFAULT = () => true;

export function MenuWindow({
    children,
    getPosition = GET_POSITION_DEFAULT,
    hideOn = HIDE_ON_DEFAULT,
    render,
    shouldOpen = SHOULD_OPEN_DEFAULT,
    viewportOffset = 8,
}: MenuWindowProps) {
    const latestEvent = React.useRef<React.MouseEvent | null>(null);
    const [pos, setPos] = React.useState<ContentPosition | null>(null);

    const contentRef = React.useRef<HTMLElement | null>(null);

    const handleContextMenu = React.useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            e.persist();
            latestEvent.current = e;
            if (shouldOpen()) {
                setPos(getPosition(e));
            }
        },
        [getPosition, shouldOpen]
    );

    const handleClose = React.useCallback(
        (e: any) => {
            /**
             * Ignore all hideOn events if they're triggered on the content element or any of its children.
             */
            if (
                !contentRef.current ||
                (e.target !== contentRef.current && !contentRef.current.contains(e.target))
            ) {
                setPos(null);
            }
        },
        [contentRef, setPos]
    );

    useAttachEventListeners(pos ? window : null, hideOn.split(" "), handleClose);

    const renderedContent =
        latestEvent.current && pos
            ? render(latestEvent.current, { close: () => setPos(null) })
            : null;

    const { style: contentStyles } = useFitInViewport(contentRef, pos, viewportOffset);

    return (
        <>
            {React.cloneElement(React.Children.only(children), {
                onContextMenu: handleContextMenu,
            })}
            {renderedContent ? (
                <Portal>
                    {React.cloneElement(renderedContent, {
                        ref: contentRef,
                        style: {
                            ...renderedContent.props.style,
                            position: "absolute",
                            ...contentStyles,
                        },
                    })}
                </Portal>
            ) : null}
        </>
    );
}
