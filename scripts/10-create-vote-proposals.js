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
        const amount = 420_000;
        /* Create Proposal to mint 420,000 new Token to the Treasury */
        await voteModule.propose(
            `Should the DAO mint an additional ${amount} Tokens into the Treasury?`,
            [
                {
                    /* Amount of ETH to send in this Proposal */
                    /* It is possible to send ETH and Governance Tokens - but this ETH has to be the Treasury if it should be sent */
                    nativeTokenValue: 0,
                    transactionData: tokenModule.contract.interface.encodeFunctionData(
                        /* A Proposal to doing a Mint of Tokens into the VoteModule, which is acting as the Treasury */
                        /* Voting Contract has set Permission to mint new Tokens from `9-setup-vote.js` */
                        "mint",
                        [
                            voteModule.address,
                            ethers.utils.parseUnits(amount.toString(), 18)
                        ]
                    ),
                    /* Token Module that executes the Mint */
                    toAddress: tokenModule.address
                }
            ]
        );
        console.log("Successfully created Proposal to mint Governance Tokens");
    } catch (error) {
        console.error("Failed to create Mint Proposal", error);
        process.exit(1);
    }

    try {
        const amount = 6_900;
        /* Create a Proposal to transfer ourselves 6,900 Tokens */
        await voteModule.propose(
            `Should the DAO transfer ${amount} Tokens from the Treasury to ${process.env.WALLET_ADDRESS}`,
            [
                {
                    /* Amount of ETH to send in this Proposal */
                    /* It is possible to send ETH and Governance Tokens - but this ETH has to be the Treasury if it should be sent */
                    nativeTokenValue: 0,
                    transactionData: tokenModule.contract.interface.encodeFunctionData(
                        /* A Proposal to doing a Transfer of Tokens into ourselves Wallet from the Treasury */
                        "transfer",
                        [
                            process.env.WALLET_ADDRESS,
                            ethers.utils.parseUnits(amount.toString(), 18)
                        ]
                    ),
                    /* Token Module that executes the Transfer */
                    toAddress: tokenModule.address,
                }
            ]
        );
        console.log("Successfully created Proposal to reward ourselves from the Treasury");
    } catch (error) {
        console.error("Failed to create Transfer Proposal", error);
    }
})();