export const getPositionStyle = e => ({ top: e.pageY, left: e.pageX });

export const setEventListeners = (events, fn, elem = window, set = "add") => {
    events.forEach(event => {
        elem[`${set}EventListener`](event, fn);
    });
};
