import * as React from "react";
import { Portal } from "reakit/Portal";
// import {useCloseListener} from "./useCloseListener";
import { useAttachEventListeners } from "./useAttachEventListeners";
type ContentPosition = { top: number; left: number };

export type MenuWindowProps = {
    children: React.ReactElement<any>;
    hideOn: string;
    getPosition: (e: React.MouseEvent) => ContentPosition;
    render: () => React.ReactElement<any>;
    shouldOpen: () => boolean;
};

const HIDE_ON_DEFAULT = "resize contextmenu mousedown click scroll keydown";
const SHOULD_OPEN_DEFAULT = () => true;
const GET_POSITION_DEFAULT: MenuWindowProps["getPosition"] = (e) => ({
    top: e.pageY,
    left: e.pageX,
});

const captureEvent = (e: React.SyntheticEvent) => {
    e.stopPropagation();
};

export function MenuWindow({
    children,
    getPosition = GET_POSITION_DEFAULT,
    hideOn = HIDE_ON_DEFAULT,
    render,
    shouldOpen = SHOULD_OPEN_DEFAULT,
}: MenuWindowProps) {
    const [pos, setPos] = React.useState<ContentPosition | null>(null);
    const contentRef = React.useRef(null);
    const windowRef = React.useRef(window);

    const handleContextMenu = React.useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            e.persist();
            if (shouldOpen()) {
                setPos(getPosition(e));
            }
        },
        [getPosition, shouldOpen]
    );

    const handleClose = React.useCallback(() => {
        setPos(null);
    }, [setPos]);

    // Attach listeners to the window that close the rendered content
    useAttachEventListeners(pos ? windowRef : null, hideOn.split(" "), handleClose);

    // Prevent above actions from closing the menu when triggered inside
    useAttachEventListeners(contentRef, hideOn.split(" "), captureEvent);

    const renderedContent = render();

    return (
        <>
            {React.cloneElement(React.Children.only(children), {
                onContextMenu: handleContextMenu,
            })}
            {pos ? (
                <Portal>
                    {React.cloneElement(renderedContent, {
                        ref: contentRef,
                        style: {
                            ...renderedContent.props.style,
                            ...pos,
                            position: "absolute",
                        },
                    })}
                </Portal>
            ) : null}
        </>
    );
}
