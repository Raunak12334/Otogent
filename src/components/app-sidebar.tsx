"use client"

import {
    Bot,
    Clock,
    CreditCardIcon,
    HistoryIcon,
    KeyIcon,
    LogOutIcon,
    Route,
    StarIcon,
    Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscription";
import { SidebarThemeCycleButton, ThemeToggle } from "@/components/theme-toggle";

const menuItems = [
    {
        title: "Home",
        items: [
            {
                title: "Agents",
                icon: Bot,
                url: "/agents",
            },
            {
                title: "Automations",
                icon: Clock,
                url: "/workflows",
            },
            {
                title: "Credentials",
                icon: KeyIcon,
                url: "/credentials",
            },
            {
                title: "Executions",
                icon: HistoryIcon,
                url: "/executions",
            },
        ]

    }
];

export const AppSidebar = () => {
    const { hasActiveSubscription, isLoading } = useHasActiveSubscription();
    const pathname = usePathname();
    const router = useRouter();
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                {/* Trigger row — always visible in both expanded and collapsed (icon) mode */}
                <div className="flex items-center justify-between">
                    <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
                        <SidebarMenuButton asChild className="gap-x-2 h-10 px-4">
                            <Link prefetch href={"/"}>
                                <Image src={"/logo.svg"} alt="Otogent" width={25} height={25} />
                                <span className="font-semibold text-xl">Otogent</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarTrigger />
                </div>
            </SidebarHeader>
            <SidebarContent>
                {menuItems.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((items) => <SidebarMenuItem key={items.title}>
                                    <SidebarMenuButton
                                        tooltip={items.title}
                                        isActive={items.url === "/" ? pathname === "/" : pathname.startsWith(items.url)}
                                        asChild
                                        className="gap-x-4 h-10 px-4"
                                    >
                                        <Link href={items.url} prefetch>
                                            <items.icon className="size-4" />
                                            <span>{items.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>)}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                            <div className="flex h-10 items-center px-4 group-data-[collapsible=icon]:hidden">
                                <ThemeToggle />
                            </div>
                            <SidebarThemeCycleButton />
                    </SidebarMenuItem>
                    {!hasActiveSubscription && !isLoading && (
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                tooltip="Upgrade to Pro"
                                onClick={() => authClient.checkout({ slug: "project-x-pro" })}
                                className="gap-x-4 h-10 px-4"
                            >
                                <StarIcon className="size-4" />
                                <span>Upgrade to Pro</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}

                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="Billing Portal"
                            onClick={() => { }}
                            className="gap-x-4 h-10 px-4"
                        >
                            <CreditCardIcon className="size-4" />
                            <span>Billing Portal</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="Logout"
                            onClick={() => authClient.signOut({
                                fetchOptions: {
                                    onSuccess: () => {
                                        router.push("/login");
                                    },
                                },
                            })}
                            className="gap-x-4 h-10 px-4"
                        >
                            <LogOutIcon className="size-4" />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}