import sdk from "./1-initialize-sdk.js";

/* In Order to deploy the new Smart Contract the App Module is needed */
/* The Address from App Module comes from Script `1-initialize-sdk.js` */
const appModule = sdk.getAppModule("0xe6e63386Ef2F2d5e7B5C8718f54097Bc0CFA9499");

/* Immediately-Invoked Function Expression (IIFE) */
/* The IIFE executes immediately after it is created */
(async () => {
    try {
        /* Deploy a new Voting Contract */
        const voteModule = await appModule.deployVoteModule({
            /* Name of Governance Smart Contract */
            name: "Agile Development Proposals",
            /* Address of Governance Token (ERC-20 Smart Contract) that the Voting Contract should accept */
            votingTokenAddress: "0x6E8Ef50550882D0f788f77540cB6d24e04DC417f",
            /* After the Proposal is created, Members can start immediately to vote for it */
            proposalStartWaitTimeInSeconds: 0,
            /* Members can vote up to 24 Hours (86400 seconds) on a created Proposal */
            proposalVotingTimeInSeconds: 24 * 60 * 60,
            /* The Quorum Fraction indicates the minimum Percentage of Tokens that must be reached in Order to accept the created Proposal */
            /* For Quorum Fraction 0, if only one User votes, this User can decide about the Proposal */
            votingQuorumFraction: 0,
            /* Members need a Minimum Number of 0 Tokens (its free) to be allowed to create a Proposal */
            /* Anyone is allowed to create a Proposal even if they hold zero Governance Tokens */
            minimumNumberOfTokensNeededToPropose: "0",
        });
        console.log("Successfully deployed Vote Module, Address:", voteModule.address);
    } catch (error) {
        console.error("Failed to deploy Vote Module", error);
    }
})();