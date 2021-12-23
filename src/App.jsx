import {useEffect, useMemo, useState} from "react";
import {useWeb3} from "@3rdweb/hooks";
import {ThirdwebSDK} from "@3rdweb/sdk";
import {ethers} from "ethers";

/* Instantiate the SDK on Testnet Rinkeby */
const sdk = new ThirdwebSDK("rinkeby");

/* Grab a JavaScript Reference to the deployed ERC-1155 Smart Contract */
/* DropModule Address comes from Script `2-deploy-drop.js` */
const bundleDropModule = sdk.getBundleDropModule("0x3c7c05A116cBD477ED7A5dde02454d146B81DEcD");

/* Token Module (an ERC-20 Smart Contract) Address comes from Script `5-deploy-token.js` */
/* Token Module can interact with the ERC-1155 Smart Contract and the ERC-20 Smart Contract */
/* The ERC-1155 Smart Contract will retrieve all Member’s Addresses */
/* The ERC-20 Smart Contract will retrieve the Number of tokens each Member holds */
const tokenModule = sdk.getTokenModule("0x6E8Ef50550882D0f788f77540cB6d24e04DC417f");

/* Vote Module (a Smart Contract) Address comes from Script `8-deploy-vote.js` */
/* Vote Module can interact with the ERC-1155 Smart Contract and the ERC-20 Smart Contract */
/* Vote Module contains the Proposals */
const voteModule = sdk.getVoteModule("0x6AE5dFD5721e67de28108E2Bbc080059BA462494");

const App = () => {
    const {connectWallet, address, error, provider} = useWeb3();
    console.log("Public Address:", address);
    /* Signer is required to sign Transactions on the Blockchain without it, only read Data is possible, not write */
    const signer = provider ? provider.getSigner() : undefined;
    const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);
    const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
    const [memberAddresses, setMemberAddresses] = useState([]);
    const [proposals, setProposals] = useState([]);
    const [isVoting, setIsVoting] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        /* Pass Signer to the SDK, which enables to interact with deployed Smart Contract */
        sdk.setProviderOrSigner(signer);
    }, [signer]);

    useEffect(() => {
        /* Checking if Users do not have a connected Wallet */
        if (!address) {
            return;
        }
        /* Checking if the User has the Membership NFT */
        bundleDropModule
            /* ID 0 is the Token ID of Membership NFT*/
            .balanceOf(address, "0")
            .then((balance) => {
                /* If Balance is greater than 0, the User has at least one Membership NFT! */
                if (balance.gt(0)) {
                    setHasClaimedNFT(true);
                    console.log("User has a Membership NFT");
                } else {
                    setHasClaimedNFT(false);
                    console.log("User does not have a Membership NFT");
                }
            })
            .catch((error) => {
                setHasClaimedNFT(false);
                console.error("Failed to get the NFT Balance", error);
            });
    }, [address]);

    /* Grab all Addresses of the Members that are holding the MMembership NFT */
    useEffect(() => {
        if (!hasClaimedNFT) {
            return;
        }
        bundleDropModule
            /* Grab all the Addresses of People who own the Membership NFT (ERC-1155), which has a Token ID of 0 */
            .getAllClaimerAddresses("0")
            .then((addresses) => {
                console.log("Members Addresses", addresses);
                setMemberAddresses(addresses);
            })
            .catch((error) => {
                console.error("Failed to get Member List", error);
            });
    }, [hasClaimedNFT]);

    /* Grab Number of Governance Token (ERC-20) each Member holds */
    useEffect(() => {
        if (!hasClaimedNFT) {
            return;
        }
        tokenModule
            /* Grab all Token Holders and their corresponding Balances */
            .getAllHolderBalances()
            .then((amounts) => {
                console.log("Amounts", amounts);
                setMemberTokenAmounts(amounts);
            })
            .catch((error) => {
                console.error("Failed to get Token Amounts", error);
            });
    }, [hasClaimedNFT]);

    /* Retrieve all existing Proposals from the DAO (Vote Module) */
    useEffect(() => {
        if (!hasClaimedNFT) {
            return;
        }
        voteModule
            /* Grab all the Proposals from Vote Module */
            .getAll()
            .then((proposals) => {
                setProposals(proposals);
                console.log("Proposals:", proposals);
            })
            .catch((error) => {
                console.error("Failed to get all Proposals", error);
            });
    }, [hasClaimedNFT]);

    /* Checking if the User has already voted */
    useEffect(() => {
        if (!hasClaimedNFT) {
            return;
        }
        // If the Retrieving of the Proposals from the `useEffect` above has not finished it is not possible to check if the User has voted */
        if (!proposals.length) {
            return;
        }
        /* Check if the User has already voted on the first (proposals[0]) Proposal */
        voteModule
            .hasVoted(proposals[0].proposalId, address)
            .then((hasVoted) => {
                /* If `hasVoted` is true the user can not vote again */
                setHasVoted(hasVoted);
                console.log("User has already voted");
            })
            .catch((error) => {
                console.error("Failed to check if User has voted", error);
            });
    }, [hasClaimedNFT, proposals, address]);

    /* Pop a Message if the user is not on Testnet Rinkeby */
    if (error && error.name === "UnsupportedChainIdError") {
        return (
            <div className={"unsupported-network"}>
                <h2>Please connect to Testnet Rinkeby</h2>
                <p>
                    This decentralized Application only works on the Testnet Rinkeby
                </p>
            </div>
        );
    }

    /* Shorten a given Wallet Address */
    const shortenAddress = (address) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    /* Combine the MemberAddresses and MemberTokenAmounts into a single Array */
    const memberList = useMemo(() => {
        return memberAddresses.map((address) => {
            return {
                address,
                tokenAmount: ethers.utils.formatUnits(
                    /* If the Address is not in memberTokenAmounts, it does not hold any of the Membership NFT */
                    /* Users can be in the DAO and hold zero Token - they should also be included in the MemberList */
                    memberTokenAmounts[address] || 0,
                    18,
                )
            };
        });
    }, [memberAddresses, memberTokenAmounts]);

    /* If User has not connected their Wallet to the Application */
    if (!address) {
        return (
            <div className={"landing"}>
                <h1>Welcome to Agile Development DAO</h1>
                <button onClick={() => connectWallet("injected")} className={"btn-hero"}>
                    Connect Wallet
                </button>
            </div>
        );
    }

    /* If User has Membership NFT, so he can vote on Proposals and see DAO related Information */
    // If the user has already claimed their NFT we want to display the interal DAO page to them
    // only DAO members will see this. Render all the members + token amounts.
    if (hasClaimedNFT) {
        return (
            <div className="member-page">
                <h1>Agile DAO</h1>
                <p>Congratulations on being a Member of the Agile DAO</p>
                <div>
                    <div>
                        <h2>Member List</h2>
                        <table className="card">
                            <thead>
                            <tr>
                                <th>Address</th>
                                <th>Token Amount</th>
                            </tr>
                            </thead>
                            <tbody>
                            {memberList.map((member) => {
                                return (
                                    <tr key={member.address}>
                                        <td>{shortenAddress(member.address)}</td>
                                        <td>{member.tokenAmount}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h2>Active Proposals</h2>
                        <form
                            onSubmit={async (event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                /* Before asynchronous Computation disable Button to prevent double Clicks */
                                setIsVoting(true);
                                /* Get Votes from the Form for the Values */
                                const votes = proposals.map((proposal) => {
                                    let voteResult = {
                                        proposalId: proposal.proposalId,
                                        /* Set Option "abstain" as Default */
                                        vote: 2
                                    };
                                    proposal.votes.forEach((vote) => {
                                        const element = document.getElementById(`${proposal.proposalId}-${vote.type}`);
                                        if (element.checked) {
                                            voteResult.vote = vote.type;
                                            return;
                                        }
                                    });
                                    return voteResult;
                                });

                                /* Check that User has delegated his Tokens to vote */
                                try {
                                    /* Check if the User still needs to delegate his Tokens before he can vote */
                                    const delegation = await tokenModule.getDelegationOf(address);
                                    /* If the Delegation is the Zero Address that means this User has not delegated his Governance Tokens */
                                    if (delegation === ethers.constants.AddressZero) {
                                        /* If User has not delegated his Tokens yet, he will has to delegate them before Voting */
                                        await tokenModule.delegateTo(address);
                                    }
                                    /* Vote on the Proposals */
                                    try {
                                        await Promise.all(
                                            votes.map(async (vote) => {
                                                /* Before Voting it is necessary to check if the Proposal is open for Voting */
                                                /* Therefore get the latest State of the Proposal */
                                                const proposal = await voteModule.get(vote.proposalId);
                                                /* A Proposal is open for Voting if it is in State of 1 */
                                                if (proposal.state === 1) {
                                                    /* Vote on Proposal */
                                                    return voteModule.vote(vote.proposalId, vote.vote);
                                                }
                                                /* If the proposal is not open for Voting then return nothing and continue with Mapping */
                                                return;
                                            })
                                        );
                                        try {
                                            /* If any of the Proposals are ready to be executed they will execute */
                                            await Promise.all(
                                                votes.map(async (vote) => {
                                                    /* Get the latest State of the Proposal again, since someone may have just voted before */
                                                    const proposal = await voteModule.get(
                                                        vote.proposalId
                                                    );
                                                    /* A Proposal is ready to be executed if it is in State of 4 */
                                                    if (proposal.state === 4) {
                                                        /* Execute the Proposal */
                                                        return voteModule.execute(vote.proposalId);
                                                    }
                                                })
                                            );
                                            setHasVoted(true);
                                            console.log("Successfully voted");
                                        } catch (error) {
                                            console.error("Failed to execute Votes", error);
                                        }
                                    } catch (error) {
                                        console.error("Failed to Vote", error);
                                    }
                                } catch (error) {
                                    console.error("Failed to delegate Tokens", error);
                                } finally {
                                    /* In either Cases the Button has to be enabled */
                                    setIsVoting(false);
                                }
                            }}
                        >
                            {
                                proposals.map((proposal, index) => (
                                    <div key={index} className={"card"}>
                                        <h5>{proposal.description}</h5>
                                        <div>
                                            {
                                                proposal.votes.map((vote) => (
                                                    <div key={vote.type}>
                                                        <input
                                                            type="radio"
                                                            id={`${proposal.proposalId}-${vote.type}`}
                                                            name={proposal.proposalId}
                                                            value={vote.type}
                                                            /* Set Option "abstain" as Default */
                                                            defaultChecked={vote.type === 2}
                                                        />
                                                        <label htmlFor={`${proposal.proposalId}-${vote.type}`}>
                                                            {vote.label}
                                                        </label>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                            <button disabled={isVoting || hasVoted} type={"submit"}>
                                {isVoting ? "Voting" : hasVoted ? "You Already Voted" : "Submit Votes"}
                            </button>
                            <small>
                                This will trigger multiple Transactions that have to be signed
                            </small>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    const mintNft = () => {
        setIsClaiming(true);
        bundleDropModule
            /* Call Smart Contract Function bundleDropModule.claim("0", 1) to mint one NFT with Token ID of 0 to User's Wallet */
            .claim("0", 1)
            .catch((error) => {
                console.error("Failed to claim NFT", error);
                setIsClaiming(false);
            })
            .finally(() => {
                /* Stop loading Page */
                setIsClaiming(false);
                /* Set Claim State */
                setHasClaimedNFT(true);
                console.log(`NFT successfully minted. OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`);
            });
    }

    /* If User has connected their Wallet to the Application */
    return (
        <div className={"mint-nft"}>
            <h1>Mint a free Agile DAO Membership NFT</h1>
            <button
                disabled={isClaiming}
                onClick={() => mintNft()}
            >
                {isClaiming ? "Minting" : "Mint a free NFT"}
            </button>
        </div>
    );
};

export default App;