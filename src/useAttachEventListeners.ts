import * as React from "react";

const setEventListeners = (
    events: Array<string>,
    fn: Function,
    elem: any,
    set: "add" | "remove"
) => {
    events.forEach((event) => {
        elem[`${set}EventListener`](event, fn, {
            capture: true,
            passive: true
        });
    });
};

export function useAttachEventListeners(
    elem: any,
    events: Array<string>,
    cb: Function
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
