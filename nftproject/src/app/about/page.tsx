"use client";

import Link from "next/link";
import { MediaRenderer } from "thirdweb/react";
import { client } from "../client";

export default function page() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-16">
      <div className="max-w-5xl mx-auto space-y-16">
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-white">
            About Our Platform
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Redefining how events are accessed and experienced through the power of NFTs and blockchain technology.
          </p>
        </header>

        {/* Section: What is this platform */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-purple-400">🎟️ What Is NFT-Based Event Registration?</h2>
          <p className="text-zinc-300 leading-relaxed">
            Our platform leverages **NFTs (Non-Fungible Tokens)** to create unique, verifiable event passes. Instead of paper or digital tickets that can be easily duplicated or lost, each NFT is a secure digital asset that proves ownership and access to an event.
          </p>
          <p className="text-zinc-300">
            When you claim a ticket, an NFT is minted to your wallet. This token serves as your entry pass, can’t be forged, and is always verifiable on the blockchain.
          </p>
        </section>

        {/* Section: How it works */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-purple-400">⚙️ How It Works</h2>
          <ul className="list-disc list-inside space-y-2 text-zinc-300">
            <li>🔍 Browse available events on our homepage.</li>
            <li>👛 Connect your crypto wallet (e.g., MetaMask).</li>
            <li>🪙 View pricing and event details before claiming.</li>
            <li>🖼️ Claim the NFT ticket directly to your wallet.</li>
            <li>🎫 Use the NFT as your entry pass at the venue.</li>
          </ul>
        </section>

        {/* Section: Why use NFTs */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-purple-400">🚀 Why NFTs for Tickets?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-900 p-6 rounded-xl shadow border border-zinc-800 space-y-2">
              <h3 className="text-xl font-semibold text-white">Security & Authenticity</h3>
              <p className="text-zinc-300 text-sm">
                NFTs prevent fraud and duplication. Each ticket is unique and provably owned by one person.
              </p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-xl shadow border border-zinc-800 space-y-2">
              <h3 className="text-xl font-semibold text-white">Transparency</h3>
              <p className="text-zinc-300 text-sm">
                All transactions are recorded on-chain, ensuring full transparency in ticket distribution.
              </p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-xl shadow border border-zinc-800 space-y-2">
              <h3 className="text-xl font-semibold text-white">Collectibility</h3>
              <p className="text-zinc-300 text-sm">
                Your NFT ticket is also a collectible. Keep it as a digital memento or resell if it's transferable.
              </p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-xl shadow border border-zinc-800 space-y-2">
              <h3 className="text-xl font-semibold text-white">Ownership</h3>
              <p className="text-zinc-300 text-sm">
                Tickets live in your wallet, not in a central server. You're in full control of your access.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Features */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-purple-400">✨ Platform Features</h2>
          <ul className="grid sm:grid-cols-2 gap-4 text-zinc-300 list-disc list-inside">
            <li>Smart contract-backed minting</li>
            <li>IPFS-hosted metadata for event details</li>
            <li>Individual NFT ownership tracking</li>
            <li>Live claim conditions (price, supply)</li>
            <li>Connect wallet support</li>
            <li>User dashboard for claimed NFTs</li>
          </ul>
        </section>

        {/* Section: Call to Action */}
        <section className="text-center">
          <p className="text-zinc-400 mb-6">
            Ready to explore events and claim your first ticket?
          </p>
          <Link
            href="/"
            className="inline-block bg-purple-600 hover:bg-purple-700 transition text-white font-semibold px-6 py-3 rounded-xl shadow-lg"
          >
            Explore Events
          </Link>
        </section>
      </div>
    </main>
  );
}
