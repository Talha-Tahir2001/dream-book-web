"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { toast } from "sonner";

export default function RootRedirect() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;
        toast.success("Welcome to Dream Book!");
        router.replace(user ? "/library" : "/login");
    }, [user, loading, router]);

    return null;
}