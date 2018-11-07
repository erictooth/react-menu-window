import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import { getPositionStyle, setEventListeners } from "./utils";

function ContextMenuWindow({
    children,
    containerStyle = {},
    hideOn = "resize contextmenu mousedown click scroll keydown",
    renderMenu,
    shouldMenuOpen = () => true,
}) {
    const [visible, setVisible] = useState(null);

    const openContextMenu = useCallback(
        e => {
            e.preventDefault();
            e.stopPropagation();
            if (!shouldMenuOpen(e)) {
                return;
            }
            e.persist();
            setVisible(e);
        },
        [setVisible, shouldMenuOpen]
    );

    const closeContextMenu = useCallback(
        () => {
            setVisible(null);
        },
        [setVisible]
    );

    useCloseListener(visible, closeContextMenu, hideOn.split(" "));

    const { handleMouseEnter, handleMouseLeave } = useIgnoreClickInsideContextMenu(
        closeContextMenu,
        hideOn.split(" ")
    );

    const portalEl = usePortal();

    return (
        <div onContextMenu={openContextMenu}>
            {visible
                ? ReactDOM.createPortal(
                      <div
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                          style={{
                              position: "absolute",
                              ...getPositionStyle(visible),
                              ...containerStyle,
                          }}>
                          {renderMenu(visible)}
                      </div>,
                      portalEl
                  )
                : null}
            {children}
        </div>
    );
}

function useCloseListener(visible, handleClose, events) {
    useEffect(
        () => {
            if (!visible) {
                return;
            }

            setEventListeners(events, handleClose, window, "add");

            return () => {
                setEventListeners(events, handleClose, window, "remove");
            };
        },
        [visible, handleClose]
    );
}

function useIgnoreClickInsideContextMenu(handleClose, hideOn) {
    const events = ["mousedown", "click"].filter(event => hideOn.includes(event));
    const handleMouseEnter = useCallback(
        () => {
            setEventListeners(events, handleClose, window, "remove");
        },
        [handleClose]
    );

    const handleMouseLeave = useCallback(
        () => {
            setEventListeners(events, handleClose, window, "add");
        },
        [handleClose]
    );

    return {
        handleMouseEnter,
        handleMouseLeave,
    };
}

function usePortal() {
    const portalContainer = useRef(null);

    if (!portalContainer.current) {
        portalContainer.current = document.createElement("div");
        document.body.appendChild(portalContainer.current);
    }

    return portalContainer.current;
}

export default ContextMenuWindow;
