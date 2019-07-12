import * as React from "react";
import { Portal } from "reakit/Portal";
import { useAttachEventListeners } from "./useAttachEventListeners";
import { parentsContainElem } from "./parentsContainElem";

type ContentPosition = { top: number; left: number };
export type MenuWindowProps = {
    children: React.ReactElement<any>;
    hideOn: string;
    getPosition: (e: React.MouseEvent) => ContentPosition;
    render: (props: { close: () => void }) => React.ReactElement<any>;
    shouldOpen: () => boolean;
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
}: MenuWindowProps) {
    const [pos, setPos] = React.useState<ContentPosition | null>(null);

    const contentRef = React.useRef(null);

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

    const handleClose = React.useCallback(
        (e: any) => {
            if (!parentsContainElem(e.target, contentRef.current)) {
                setPos(null);
            }
        },
        [contentRef, setPos]
    );

    useAttachEventListeners(pos ? window : null, hideOn.split(" "), handleClose);

    const renderedContent = render({ close: () => setPos(null) });

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
