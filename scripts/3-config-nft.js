import sdk from "./1-initialize-sdk.js";
import {readFileSync} from "fs";

/* DropModule Address comes from Script `2-deploy-drop.js` */
const bundleDrop = sdk.getBundleDropModule("0x3c7c05A116cBD477ED7A5dde02454d146B81DEcD");

/* Immediately-Invoked Function Expression (IIFE) */
/* The IIFE executes immediately after it is created */
(async () => {
    try {
        /* The Membership NFT (ERC-1155 Smart Contract) was created by the Script `2-deploy-drop.js` */
        /* Deploy Metadata associated with Membership NFT */
        await bundleDrop.createBatch([
            {
                name: "SCRUM Vote",
                description: "This NFT will give Access to the Agile SCRUM Development",
                image: readFileSync("scripts/assets/agile_scrum.png"),
            }
        ]);
        console.log("Successfully created a new NFT in the Drop");
    } catch (error) {
        console.error("Failed to create the new NFT", error);
    }
})();