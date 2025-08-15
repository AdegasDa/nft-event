import { useMemo, useState } from "react";

const GATEWAYS = [
  (path: string) => `http://127.0.0.1:8080/ipfs/${path}`,
  (path: string) => `https://ipfs.io/ipfs/${path}`,
  (path: string) => `https://cloudflare-ipfs.com/ipfs/${path}`,
  (path: string) => `https://gateway.pinata.cloud/ipfs/${path}`,
  (path: string) => `https://dweb.link/ipfs/${path}`,
];

function candidatesFromUri(uri?: string): string[] {
  if (!uri) return [];
  if (uri.startsWith("ipfs://")) {
    const path = uri.slice("ipfs://".length); 
    return GATEWAYS.map(fn => fn(path));
  }
  return [uri];
}

export default function NFTCard({ nft }: any) {
  const qrAttr = nft?.attributes?.find?.(
    (attr: any) => (attr?.trait_type || attr?.traitType) === "QR Code URL"
  );

  const imgCandidates = useMemo(() => candidatesFromUri(nft?.image), [nft?.image]);
  const qrCandidates  = useMemo(() => candidatesFromUri(qrAttr?.value), [qrAttr?.value]);

  const [imgIdx, setImgIdx] = useState(0);
  const [qrIdx, setQrIdx]   = useState(0);
  const [showQR, setShowQR] = useState(false);

  const imgSrc = imgCandidates[imgIdx];
  const qrSrc  = qrCandidates[qrIdx];

  const handleImgError = () => {
    if (imgIdx < imgCandidates.length - 1) setImgIdx(i => i + 1);
  };
  const handleQrError = () => {
    if (qrIdx < qrCandidates.length - 1) setQrIdx(i => i + 1);
  };

  return (
    <div className="bg-zinc-900 text-white p-4 rounded-xl shadow-md">
      {showQR ? (
        <>
          {qrSrc ? (
            <img src={qrSrc} alt="QR Code" onError={handleQrError}
                 className="w-full object-cover mb-4" />
          ) : (
            <div className="w-full h-64 grid place-items-center rounded-md mb-4 bg-zinc-800 text-zinc-400">
              QR not available
            </div>
          )}
          <h4 className="text-xl font-semibold">{nft?.name ?? "Untitled Ticket"}</h4>
          <p className="text-sm text-zinc-300">{nft?.description}</p>
          <button onClick={() => setShowQR(false)}
                  className="mt-2 px-4 py-1 bg-gray-700 rounded hover:bg-gray-600">
            Back to Ticket
          </button>
        </>
      ) : (
        <>
          {imgSrc ? (
            <img src={imgSrc} alt={nft?.name ?? "NFT"}
                 onError={handleImgError}
                 className="w-full object-cover rounded-md mb-4" />
          ) : (
            <div className="w-full h-64 grid place-items-center rounded-md mb-4 bg-zinc-800 text-zinc-400">
              Image not available
            </div>
          )}
          <h4 className="text-xl font-semibold">{nft?.name ?? "Untitled Ticket"}</h4>
          <p className="text-sm text-zinc-300">{nft?.description}</p>
          <button onClick={() => setShowQR(true)}
                  className="mt-4 px-4 py-1 bg-purple-600 hover:bg-purple-700 rounded">
            Show QR Code
          </button>
        </>
      )}
    </div>
  );
}
