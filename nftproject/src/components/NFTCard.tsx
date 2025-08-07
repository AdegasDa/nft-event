import { useState } from "react";

export default function NFTCard({ nft }: any) {
  const [showQR, setShowQR] = useState(false);

  // Get QR code from attributes
  const qrAttribute = nft.attributes?.find(
    (attr: any) => attr.trait_type === "QR Code URL"
  );
  const qrUrl = qrAttribute?.value?.replace("ipfs://", "https://ipfs.io/ipfs/");

  return (
    <div className="bg-zinc-900 text-white p-4 rounded-xl shadow-md">
      {showQR ? (
        <>
          <img
            src={qrUrl}
            alt="QR Code"
            className="w-full object-cover mb-4"
          />
          <h4 className="text-xl font-semibold">{nft.name}</h4>
          <p className="text-sm text-zinc-300">{nft.description}</p>
          <button
            onClick={() => setShowQR(false)}
            className="mt-2 px-4 py-1 bg-gray-700 rounded hover:bg-gray-600"
          >
            Back to Ticket
          </button>
        </>
      ) : (
        <>
          <img
            src={nft.image.replace("ipfs://", "https://ipfs.io/ipfs/")}
            alt={nft.name}
            className="w-full object-cover rounded-md mb-4"
          />
          <h4 className="text-xl font-semibold">{nft.name}</h4>
          <p className="text-sm text-zinc-300">{nft.description}</p>
          <button
            onClick={() => setShowQR(true)}
            className="mt-4 px-4 py-1 bg-purple-600 hover:bg-purple-700 rounded"
          >
            Show QR Code
          </button>
        </>
      )}
    </div>
  );
}
