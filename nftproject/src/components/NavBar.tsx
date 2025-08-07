"use client";

import React from "react";
import { ConnectButton } from "thirdweb/react";
import { client } from "../app/client";
import { defineChain } from "thirdweb";
import { ethereum } from "thirdweb/chains";
import Link from "next/link";

function NavBar() {
  const chain = defineChain(ethereum);

  return (
    <nav className="w-full px-6 py-4 bg-zinc-900 text-white shadow-md flex items-center justify-between">
      <div className="flex gap-6 items-center">
        <Link href="/" className="text-2xl font-semibold tracking-tight hover:text-purple-300">
          🎟️ NFT Ticketing
        </Link>
        
      </div>

      <div className="text-lg gap-12 flex">
        <Link href="/" className="hover:text-purple-300">
          Home
        </Link>
        <Link href="/events" className="hover:text-purple-300">
          Events
        </Link>
        <Link href="/about" className="hover:text-purple-300">
          About
        </Link>
      </div>

      <ConnectButton
        client={client}
        chain={chain}
        theme="dark"
      />
    </nav>
  );
}

export default NavBar;