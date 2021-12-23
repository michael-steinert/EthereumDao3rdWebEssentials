import sdk from "./1-initialize-sdk.js";

/* DropModule Address comes from Script `2-deploy-drop.js` */
const bundleDropModule = sdk.getBundleDropModule("0x3c7c05A116cBD477ED7A5dde02454d146B81DEcD");

/* Immediately-Invoked Function Expression (IIFE) */
/* The IIFE executes immediately after it is created */
(async () => {
    try {
        const claimConditionFactory = bundleDropModule.getClaimConditionFactory();
        /* Specify Conditions for Membership NFT */
        claimConditionFactory.newClaimPhase({
            // Users are allowed from now to start minting NFTs
            startTime: new Date(),
            // Maximal Number of NFTs that can be minted
            maxQuantity: 50_000,
            // Users can claim one NFT in a single Transaction
            maxQuantityPerTransaction: 1,
        });
        /* Interact with deployed Smart Contract and adjust its Conditions */
        /* Membership NFT has a Token ID of 0 since it is the first Token in the ERC-1155 Smart Contract */
        /* With the Standard ERC-1155 one NFT can be held / minted by multiple People - everyone mints an NFT with Token ID of 0 */
        await bundleDropModule.setClaimCondition(0, claimConditionFactory);
        console.log("Successfully set Claim Condition");
    } catch (error) {
        console.error("Failed to set Claim Condition", error);
    }
})();