import sdk from "./1-initialize-sdk.js";

/* In Order to deploy the new Smart Contract the App Module is needed */
/* The Address from App Module comes from Script `1-initialize-sdk.js` */
const appModule = sdk.getAppModule("0xe6e63386Ef2F2d5e7B5C8718f54097Bc0CFA9499");

/* Immediately-Invoked Function Expression (IIFE) */
/* The IIFE executes immediately after it is created */
(async () => {
    try {
        /* Deploy an ERC-20 Smart Contract */
        const tokenModule = await appModule.deployTokenModule({
            name: "AgileDAO Governance Token",
            symbol: "AGILE",
        });
        console.log("Successfully deployed Token Module, Address:", tokenModule.address);
    } catch (error) {
        console.error("Failed to deploy Token Module", error);
    }
})();