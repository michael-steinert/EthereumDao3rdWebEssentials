import {ethers} from "ethers";
import sdk from "./1-initialize-sdk.js";

/* The Address from Vote Module comes from Script `8-deploy-vote.js` */
const voteModule = sdk.getVoteModule("0x6AE5dFD5721e67de28108E2Bbc080059BA462494");

/* TokenModule Address of ERC-20 Smart Contract comes from Script `5-deploy-token.js` */
const tokenModule = sdk.getTokenModule("0x6E8Ef50550882D0f788f77540cB6d24e04DC417f");

/* Immediately-Invoked Function Expression (IIFE) */
/* The IIFE executes immediately after it is created */
(async () => {
    try {
        /* Give the Treasury of the DAO the Permission to mint additional Token if needed */
        await tokenModule.grantRole("minter", voteModule.address);
        console.log("Successfully gave Vote Module Permissions to act on Token Module");
    } catch (error) {
        console.error("Failed to grant Vote Module Permissions on Token Module", error);
        process.exit(1);
    }

    try {
        /* Grab the total Number of Governance Tokens that the Creator of the DAO owns */
        /* The Creator holds the initial Supply of Governance Token */
        /* The Creator holds the entire Supply apart from the Token that were airdropped */
        const ownedTokenBalance = await tokenModule.balanceOf(process.env.WALLET_ADDRESS);
        /* Grab 94% of these Supply */
        const ownedAmount = ethers.BigNumber.from(ownedTokenBalance.value);
        const percent94 = ownedAmount.div(100).mul(94);
        /* Transfer 94% of these Supply to the Voting Contract - so it can interact with these Governance Tokens */
        await tokenModule.transfer(voteModule.address, percent94);
        console.log("Successfully transferred Governance Tokens to Vote Module");
    } catch (error) {
        console.error("Failed to transfer Governance Tokens to Vote Module", error);
    }
})();