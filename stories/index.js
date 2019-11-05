import React from "react";

import { storiesOf } from "@storybook/react";

import { MenuWindow } from "../src/index.tsx";

const stories = storiesOf("MenuWindow", /*eslint-disable-line no-undef*/ module);

stories.add("basic", () => {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            Menu Window is {open ? "opened" : "closed"}
            <MenuWindow
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                render={(e, { close }) => (
                    <div
                        style={{
                            background: "#333",
                            color: "white",
                            padding: "1em",
                            width: "200px",
                        }}>
                        Positioned content <button onClick={close}>Close</button>
                    </div>
                )}>
                <div
                    style={{
                        width: "100%",
                        height: "400px",
                        background: "lightgrey",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    Right-click in here!
                </div>
            </MenuWindow>
        </>
    );
});
