import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import {ThirdwebWeb3Provider} from "@3rdweb/hooks";

/* Blockchain ID 4 corresponds to Testnet Rinkeby */
const supportedChainIds = [4];

/* Type of Wallet - an injected Wallet into the Browser, is for Example, Metamask */
const connectors = {
    injected: {},
};

ReactDOM.render(
    <React.StrictMode>
        {/* The entire Application has to be wrapped with the `ThirdwebWeb3Provider` */}
        {/* to hold User's authenticated Wallet Data and provides it to the Application */}
        <ThirdwebWeb3Provider
            connectors={connectors}
            supportedChainIds={supportedChainIds}
        >
            <div className={"landing"}>
                <App/>
            </div>
        </ThirdwebWeb3Provider>
    </React.StrictMode>,
    document.getElementById("root")
);