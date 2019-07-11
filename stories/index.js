import React from "react";

import { storiesOf } from "@storybook/react";

import { MenuWindow } from "../src/index.tsx";

const stories = storiesOf("MenuWindow", /*eslint-disable-line no-undef*/ module);

stories.add("basic", () => {
    return (
        <MenuWindow
            render={() => (
                <div style={{ background: "#333", color: "white", padding: "1em" }}>
                    Positioned content
                </div>
            )}>
            <div
                style={{
                    width: "400px",
                    height: "400px",
                    background: "lightgrey",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                Right-click in here!
            </div>
        </MenuWindow>
    );
});
