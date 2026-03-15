'use client'

import { motion, useScroll } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";
import { useAuth } from "../auth/auth-provider";
import Image from "next/image";

// Landing page nav links — only shown on "/"
const LANDING_LINKS = ["Features", "How it works", "Pricing", "Stories"];

// App nav links — shown when logged in
const APP_LINKS = [
    { href: "/library", label: "My Stories" },
    { href: "/create", label: "Create" },
];

export default function Navbar() {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const { scrollY } = useScroll();
    const [scrolled, setScrolled] = useState(false);

    const isLanding = pathname === "/";

    useEffect(() => {
        const unsub = scrollY.on("change", (v) => setScrolled(v > 20));
        return unsub;
    }, [scrollY]);

    const handleSignOut = async () => {
        await signOut();
        router.replace("/login");
    };

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-background/90 backdrop-blur-md border-b border-border"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link href={user ? "/library" : "/"} className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <Image src="/book.png" alt="Logo" width={24} height={24} />
                    </div>
                    <span className="text-xl font-bold tracking-tight">DreamBook</span>
                </Link>

                {/* Center links */}
                <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
                    {user ? (
                        // ── Logged in: app nav links with active indicator ──
                        APP_LINKS.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`relative px-3 py-1.5 rounded-lg transition-colors ${pathname === href
                                    ? "text-foreground font-medium bg-muted"
                                    : "hover:text-foreground hover:bg-muted/60"
                                    }`}
                            >
                                {label}
                            </Link>
                        ))
                    ) : isLanding ? (
                        // ── Logged out on landing: anchor links ──
                        LANDING_LINKS.map((item) => (
                            <Link
                                key={item}
                                href={`#${item.toLowerCase().replace(" ", "-")}`}
                                className="px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/60 transition-colors"
                            >
                                {item}
                            </Link>
                        ))
                    ) : null}
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {user ? (
                        // ── Logged in: avatar + sign out ──
                        <>
                            {user.photoURL && (
                                <img
                                    src={user.photoURL}
                                    alt={user.displayName ?? "User"}
                                    className="w-8 h-8 rounded-full border border-border"
                                />
                            )}
                            <Button className="cursor-pointer" variant="outline" size="sm" onClick={handleSignOut}>
                                Sign out
                            </Button>
                            {/* <Link href="/create">
                                <Button size="sm">+ Create</Button>
                            </Link> */}
                        </>
                    ) : (
                        // ── Logged out: sign in + create free ──
                        <>
                            <Button asChild variant="default" size="sm" className='cursor-pointer'>
                                <Link href="/login">
                                    Sign in
                                </Link>
                            </Button>

                            {/* <Link href="/login">
                                <Button size="sm">Create free</Button>
                            </Link> */}
                        </>
                    )}
                    <ModeToggle />
                </div>

            </div>
        </motion.nav>
    );
}