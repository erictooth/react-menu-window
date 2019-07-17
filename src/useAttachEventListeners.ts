import * as React from "react";

const setEventListeners = (
    events: Array<string>,
    fn: EventListener,
    elem: HTMLElement | Window,
    set: "add" | "remove"
) => {
    events.forEach((event) => {
        (set === "add" ? elem.addEventListener : elem.removeEventListener)(event, fn, {
            capture: true,
            passive: true,
        });
    });
};

export function useAttachEventListeners(
    elem: HTMLElement | Window | null,
    events: Array<string>,
    cb: EventListener
) {
    React.useEffect(() => {
        if (!elem) {
            return;
        }

        setEventListeners(events, cb, elem, "add");

        return () => {
            setEventListeners(events, cb, elem, "remove");
        };
    }, [cb, elem, events]);
}
