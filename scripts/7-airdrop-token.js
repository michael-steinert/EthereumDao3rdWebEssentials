import {ethers} from "ethers";
import sdk from "./1-initialize-sdk.js";

/* DropModule Address comes from Script `2-deploy-drop.js` */
const bundleDropModule = sdk.getBundleDropModule("0x3c7c05A116cBD477ED7A5dde02454d146B81DEcD");

/* TokenModule Address of ERC-20 Smart Contract comes from Script `5-deploy-token.js` */
const tokenModule = sdk.getTokenModule("0x6E8Ef50550882D0f788f77540cB6d24e04DC417f");

/* Immediately-Invoked Function Expression (IIFE) */
/* The IIFE executes immediately after it is created */
(async () => {
    try {
        /* Grab all the Addresses of People who own the Membership NFT, which has a Token ID of 0 */
        const walletAddresses = await bundleDropModule.getAllClaimerAddresses("0");
        if (walletAddresses.length === 0) {
            console.log("No NFTs have been claimed yet, maybe get some friends to claim your free NFTs!",);
            process.exit(0);
        }
        /* Loop through the Array of Addresses from the Membership NFT Holders */
        const airdropTargets = walletAddresses.map((address) => {
            /* Pick a random Number between 1000 and 10000 to airdrop  for each Holder */
            const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
            console.log(`Going to airdrop ${randomAmount} Tokens to ${address}`);
            /* Set up the Target for the Airdrop */
            const airdropTarget = {
                address,
                amount: ethers.utils.parseUnits(randomAmount.toString(), 18)
            };
            return airdropTarget;
        });
        console.log("Starting Airdrop");
        /* Call transferBatch on ERC20 Smart Contract to all Airdrop Targets */
        /* `transferBatch()` will automatically loop through all the Targets, and send the Tokens */
        await tokenModule.transferBatch(airdropTargets);
        console.log("Successfully airdropped Tokens to all the Holders of the Membership NFT");
    } catch (error) {
        console.error("Failed to airdrop Tokens", error);
    }
})();