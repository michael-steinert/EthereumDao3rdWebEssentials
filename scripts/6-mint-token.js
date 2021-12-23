import {ethers} from "ethers";
import sdk from "./1-initialize-sdk.js";

/* TokenModule Address of ERC-20 Smart Contract comes from Script `5-deploy-token.js` */
const tokenModule = sdk.getTokenModule("0x6E8Ef50550882D0f788f77540cB6d24e04DC417f");

/* Immediately-Invoked Function Expression (IIFE) */
/* The IIFE executes immediately after it is created */
(async () => {
    try {
        /* Maximal Supply of Tokens */
        const amount = 1_000_000;
        /* `ethers.utils.parseUnits()` converts Numbers as Strings, which makes their Precision good but Math hard */
        const amountWith18Decimals = ethers.utils.parseUnits(amount.toString(), 18);
        /* Interact with deployed ERC-20 Smart Contract and mint these Tokens */
        await tokenModule.mint(amountWith18Decimals);
        const totalSupply = await tokenModule.totalSupply();
        console.log(`There now ${ethers.utils.formatUnits(totalSupply, 18)} Tokens minted and in Circulation`);
    } catch (error) {
        console.error("Failed to mint Token", error);
    }
})();