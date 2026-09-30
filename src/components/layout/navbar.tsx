"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConnectButton } from "@/components/wallet/connect-button";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/verify", label: "Verify" },
  { href: "/history", label: "History" },
];

export function Navbar() {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-purple-600" />
          <span className="text-[15px] font-semibold tracking-tight text-gray-900">
            PrivateDrop
          </span>
        </Link>

        {/* Nav links — hidden on landing page */}
        {!isLanding && (
          <div className="-mx-2 flex items-center gap-1 overflow-x-auto">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "text-purple-600"
                      : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        )}

        {/* Wallet connect button */}
        <ConnectButton />
      </nav>
    </header>
  );
}
