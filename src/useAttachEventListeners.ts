import * as React from "react";

const setEventListeners = (
    events: Array<string>,
    fn: Function,
    elem: any,
    set: "add" | "remove"
) => {
    events.forEach((event) => {
        elem[`${set}EventListener`](event, fn);
    });
};

export function useAttachEventListeners(
    elem: React.MutableRefObject<any> | null,
    events: Array<string>,
    cb: Function
) {
    React.useEffect(() => {
        if (!elem || !elem.current) {
            return;
        }

        const eventTarget = elem.current;

        setEventListeners(events, cb, eventTarget, "add");

        return () => {
            setEventListeners(events, cb, eventTarget, "remove");
        };
    }, [cb, elem, events]);
}
