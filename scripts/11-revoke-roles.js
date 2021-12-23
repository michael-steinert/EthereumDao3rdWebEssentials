import sdk from "./1-initialize-sdk.js";

/* TokenModule Address of ERC-20 Smart Contract comes from Script `5-deploy-token.js` */
const tokenModule = sdk.getTokenModule("0x6E8Ef50550882D0f788f77540cB6d24e04DC417f");

/* Immediately-Invoked Function Expression (IIFE) */
/* The IIFE executes immediately after it is created */
(async () => {
    try {
        /* Log the current Roles of Token Module */
        console.log("Roles that exist right now:", await tokenModule.getAllRoleMembers());
        /* Revoke all the Permissions that the Creator has over the Token Module (ERC-20 Smart Contract) */
        await tokenModule.revokeAllRolesFromAddress(process.env.WALLET_ADDRESS);
        console.log("Roles after revoking Permissions of Creator", await tokenModule.getAllRoleMembers());
        console.log("Successfully revoked Permissions from the ERC-20 Smart Contract");
    } catch (error) {
        console.error("Failed to revoke Permissions from the DAO Treasury", error);
    }
})();