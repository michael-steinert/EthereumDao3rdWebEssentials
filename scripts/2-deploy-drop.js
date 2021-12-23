import {ethers} from "ethers";
import sdk from "./1-initialize-sdk.js";
import {readFileSync} from "fs";

/* In Order to deploy the new Smart Contract the App Module is needed */
/* The Address from App Module comes from Script `1-initialize-sdk.js` */
const appModule = sdk.getAppModule("0xe6e63386Ef2F2d5e7B5C8718f54097Bc0CFA9499");

/* Immediately-Invoked Function Expression (IIFE) */
/* The IIFE executes immediately after it is created */
(async () => {
    try {
        /* Deploying an ERC-1155 Smart Contract */
        const bundleDropModule = await appModule.deployBundleDropModule({
            name: "Agile Development Membership",
            description: "A DAO for Agile Development in Software",
            image: readFileSync("scripts/assets/scrum.png"),
            /* Address of the Person who will be receiving the Revenue from Sales of NFTs */
            /* If the Drop of NFTs should be for free (People should not be charged), the Zero Address should be passed */
            primarySaleRecipientAddress: ethers.constants.AddressZero
        });
        console.log("Successfully deployed BundleDrop Module, Address:", bundleDropModule.address);
        console.log("BundleDrop Metadata:", await bundleDropModule.getMetadata());
    } catch (error) {
        console.error("Failed to deploy BundleDrop Module", error);
    }
})();