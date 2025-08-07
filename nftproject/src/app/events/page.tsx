"use client";

import { useEffect, useState } from "react";
import { MediaRenderer, useActiveAccount, useReadContract } from "thirdweb/react";
import { client } from "../client";
import { defineChain, getContract, readContract } from "thirdweb";
import { ethereum } from "thirdweb/chains";
import { getTotalClaimedSupply, nextTokenIdToMint } from "thirdweb/extensions/erc721";
import NFTCard from "@/components/NFTCard";

export default function page() {
  const account = useActiveAccount();
  const chain = defineChain(ethereum);
  const contract = getContract({ client, chain, address: "0x595d574F26f4EFec809359c09b44e5C1a203438E" });

  const [ownedNFTs, setOwnedNFTs] = useState<any[]>([]);
  const [totalSupply, setTotalSupply] = useState<number>(0);

  const { data: totalNFTSupply, isLoading: isTotalSupplyLoading } = useReadContract(nextTokenIdToMint, { contract });
    const { data: claimedSupply, isLoading: isClaimedSupplyLoading } = useReadContract(getTotalClaimedSupply, { contract: contract });

  const normalizeIpfs = (url: string): string =>
    url?.startsWith("ipfs://")
      ? url.replace("ipfs://", "https://ipfs.io/ipfs/")
      : url;

  useEffect(() => {
    const loadNFTs = async () => {
      if (!account?.address) return;

      try {
        const total: number = Number(
          await readContract({
            contract,
            method: "function totalSupply() view returns (uint256)",
          })
        );

        setTotalSupply(total);

        const nftPromises = [];

        for (let i = 0; i < total; i++) {
          nftPromises.push(
            readContract({
              contract,
              method: "function ownerOf(uint256) view returns (address)",
              params: [BigInt(i)],
            })
              .then(async (owner: string) => {
                if (owner.toLowerCase() === account.address.toLowerCase()) {
                  const uri: string = await readContract({
                    contract,
                    method: "function tokenURI(uint256) view returns (string)",
                    params: [BigInt(i)],
                  });

                  const normalizedUri = normalizeIpfs(uri);
                  const res = await fetch(normalizedUri);
                  const metadata = await res.json();

                  return {
                    tokenId: i,
                    ...metadata,
                  };
                }

                return null;
              })
              .catch(() => null)
          );
        }

        const results = await Promise.all(nftPromises);
        setOwnedNFTs(results.filter(Boolean));
      } catch (error) {
        console.error("Failed to load owned NFTs:", error);
      }
    };

    loadNFTs();
  }, [account?.address]);

  return (
    <main className="min-h-screen px-8 py-20 container mx-auto">
      <h1 className="text-4xl font-bold text-center mb-10 text-white">
        My Tickets &nbsp;
        {isClaimedSupplyLoading || isTotalSupplyLoading ? (
            <></>
          ) : (
            <span>
              ({claimedSupply?.toString()}/{totalNFTSupply?.toString()})
            </ span>
        )}
      </h1>

        <div className="bg-zinc-800 rounded-lg p-6 mb-10 text-center w-full shadow-md">
            <h2 className="text-2xl font-semibold text-white mb-2">
                Show this page at the event entrance
            </h2>
            <p className="text-zinc-300">
                This page displays the NFT event tickets you've purchased. To gain access to an event, simply present the QR code linked to your NFT. Tap on any ticket to reveal its unique QR code for validation at the venue.
            </p>
        </div>


      {ownedNFTs.length === 0 ? (
        <p className="text-center text-zinc-400">You don’t own any tickets yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {ownedNFTs.map((nft, index) => (
            <NFTCard key={index} nft={nft} />
        ))}
        </div>
      )}
    </main>
  );
}
