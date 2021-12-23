import {ThirdwebSDK} from "@3rdweb/sdk";
import ethers from "ethers";
import dotenv from "dotenv";

/* Importing and configuring our .env File to securely store the Environment Variables */
dotenv.config();

if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === "") {
    console.log("Private Key not found")
}

if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL === "") {
    console.log("Alchemy API URL not found")
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === "") {
    console.log("Wallet Address not found")
}

const thirdWebSdk = new ThirdwebSDK(
    new ethers.Wallet(
        process.env.PRIVATE_KEY,
        ethers.getDefaultProvider(process.env.ALCHEMY_API_URL)
    )
);

/* Immediately-Invoked Function Expression (IIFE) */
/* The IIFE executes immediately after it is created */
(async () => {
    try {
        const apps = await thirdWebSdk.getApps();
        console.log("Application Address is:", apps[0].address);
    } catch (error) {
        console.error("Failed to get Applications from the SDK", error);
        process.exit(1);
    }
})();

/* Exporting the initialized Thirdweb SDK so that it can be used other Scripts */
export default thirdWebSdk;