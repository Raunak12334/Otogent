import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export const requireAuth = async () => {
    let session;
    try {
        session = await auth.api.getSession({
            headers: await headers(),
        });
    } catch {
        // DB unreachable or auth error — treat as unauthenticated
        redirect("/login");
    }

    if (!session) {
        redirect("/login");
    }

    return session;
};

export const requireUnauth = async () => {
    let session;
    try {
        session = await auth.api.getSession({
            headers: await headers(),
        });
    } catch {
        // DB unreachable or auth error — allow through to auth page
        return;
    }

    if (session) {
        redirect("/workflows");
    }
};