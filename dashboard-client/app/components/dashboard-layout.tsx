"use client";

import type React from "react";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TopBar } from "./top-bar";
import { SidebarInset } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <TopBar title={title} />
        <main className="flex-1 space-y-6 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
