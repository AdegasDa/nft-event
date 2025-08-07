"use client";

import { MediaRenderer, TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { client } from "./client";
import { defineChain, getContract, readContract, toEther } from "thirdweb";
import { ethereum } from "thirdweb/chains";
import { claimTo, getActiveClaimCondition, getTotalClaimedSupply, nextTokenIdToMint } from "thirdweb/extensions/erc721";
import { useEffect, useState } from "react";

export default function Home() {
  const chain = defineChain(ethereum);
  const account = useActiveAccount();
  const contract = getContract({client, chain, address: "0x595d574F26f4EFec809359c09b44e5C1a203438E"});
  
  const { data: totalNFTSupply, isLoading: isTotalSupplyLoading } = useReadContract(nextTokenIdToMint, { contract });
  const { data: claimCondition } = useReadContract(getActiveClaimCondition, { contract });
  const { data: claimedSupply, isLoading: isClaimedSupplyLoading } = useReadContract(getTotalClaimedSupply, { contract: contract });
  
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [contractMetadata, setContractMetadata] = useState<any>(null);
  const [nftList, setNftList] = useState<any[]>([]);

  const getQuantity = (index: number) => quantities[index] || 1;
  const updateQuantity = (index: number, newValue: number) => {
  setQuantities((prev) => ({
    ...prev,
    [index]: Math.max(1, newValue),
  }));
};

  const normalizeIpfs = (url: string): string =>
    url?.startsWith("ipfs://")
      ? url.replace("ipfs://", "https://ipfs.io/ipfs/")
      : url;

  const getPrice = (quantity: number) => {
    const total =
      quantity * parseInt(claimCondition?.pricePerToken.toString() || "0");
    return toEther(BigInt(total));
  };

  useEffect(() => {
    const fetchContractMetadata = async () => {
      try {
        const uri: string = await readContract({
          contract,
          method: "function contractURI() view returns (string)",
        });

        const res = await fetch(normalizeIpfs(uri));
        const data = await res.json();
        setContractMetadata(data);
      } catch (err) {
        console.error("Failed to fetch contract metadata:", err);
      }
    };

    fetchContractMetadata();
  }, []);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!totalNFTSupply) return;

      const nftPromises = [];

      for (let i = 0; i < Number(totalNFTSupply); i++) {
        nftPromises.push(
          readContract({
            contract,
            method: "function tokenURI(uint256) view returns (string)",
            params: [BigInt(i)],
          })
            .then((uri: string) => {
              const normalizedUri = normalizeIpfs(uri);
              return fetch(normalizedUri).then((res) => res.json());
            })
            .then((metadata) => ({
              name: metadata.name,
              description: metadata.description,
              image: metadata.image,
            }))
            .catch((err) => {
              console.error("Failed to fetch token", i, err);
              return null;
            })
        );
      }

      const nftData = (await Promise.all(nftPromises)).filter(Boolean);
      setNftList(nftData);
      console.log("NFTS",nftData);
    };

    fetchNFTs();
  }, [totalNFTSupply]);

  return (
    <main className="pb-20 min-h-[100vh] flex flex-col items-center max-w-screen container mx-auto">
      <div className="py-20 text-center w-full">
        <Header />

        {!contractMetadata ? (
            <div className="text-center mt-10">
              <p>Loading contract metadata...</p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-center gap-10 my-10 px-6 bg-zinc-800 w-full rounded-lg">
              <MediaRenderer
                client={client}
                src={normalizeIpfs(contractMetadata.image)}
                className="rounded-xl w-64 h-64 object-cover shadow-lg"
              />

              <div className="max-w-xl text-left">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Welcome to NFT-Based Event Registration
                </h2>
                <p className="text-zinc-300 text-md">
                  This platform leverages NFTs as digital event tickets. Discover events,
                  collect unique passes, and unlock access to exclusive experiences —
                  all on-chain.
                </p>
              </div>
            </div>
          )}
      </div>

      {/* 🎟️ NFT Card Section */}
      <section className="w-full">
        <div className="flex">
          <p className="text-3xl font-bold text-center mb-8">
            Available Events
          </p>
          {isClaimedSupplyLoading || isTotalSupplyLoading ? (
            <></>
          ) : (
            <>
              <p className="text-lg ms-auto">
                Total Subscriptions: {claimedSupply?.toString()}/{totalNFTSupply?.toString()}
              </p>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 w-full md:grid-cols-3 gap-8">
          {nftList.map((nft, index) => {
            

            return <div
                      key={index}
                      className="bg-zinc-900 text-white p-4 rounded-xl shadow-md transform transition-transform duration-300 hover:scale-105 cursor:pointer"
                    >
                      <MediaRenderer
                        client={client}
                        src={nft?.image}
                        className="rounded-md mb-4 w-full object-cover"
                      />
                      <h4 className="text-xl font-semibold">{nft.name}</h4>
                      <p className="text-sm text-zinc-300">{nft.description}</p>

                      <div className="flex flex-col items-center justify-center my-4">
                        <div className="flex items-center">
                          <button
                            onClick={() => updateQuantity(index, getQuantity(index) - 1)}
                            className="border border-gray-500 rounded bg-gray-700 px-3 py-1 text-white"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min={1}
                            value={getQuantity(index)}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value)) updateQuantity(index, value);
                            }}
                            className="mx-2 w-14 text-center border border-gray-500 rounded-md bg-gray-800 py-1 text-white"
                          />
                          <button
                            onClick={() => updateQuantity(index, getQuantity(index) + 1)}
                            className="border border-gray-500 rounded bg-gray-700 px-3 py-1 text-white"
                          >
                            +
                          </button>

                        </div>
                        <div className="mt-2">
                          <TransactionButton
                            transaction={() => claimTo({
                              contract,
                              to: account?.address || "",
                              quantity: BigInt(getQuantity(index))
                            })}
                            onTransactionConfirmed={async () => {
                              alert("NFT Claimed!");
                              updateQuantity(index, 1);
                            }}
                            className="ms-8 bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded shadow"
                            >
                            {`Claim NFT (${getPrice(getQuantity(index))} ETH)`}
                          </TransactionButton>
                        </div>
                      </div>

                    </div>
          })}
        </div>
      </section>
    </main>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center mb-20">
      <h1 className="text-3xl md:text-6xl font-semibold tracking-tighter mt-4 text-zinc-100">
        NFT-Based Event Registration
      </h1>
    </header>
  );
}
