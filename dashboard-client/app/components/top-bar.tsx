"use client";

import { Bell, Moon, Sun, User, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

interface TopBarProps {
  title: string;
}

export function TopBar({ title }: TopBarProps) {
  const { theme, setTheme } = useTheme();
  const [wsStatus, setWsStatus] = useState<
    "connected" | "reconnecting" | "disconnected"
  >("connected");

  // Simulate WebSocket status changes
  useEffect(() => {
    const interval = setInterval(() => {
      const statuses = ["connected", "reconnecting", "disconnected"] as const;
      const randomStatus =
        statuses[Math.floor(Math.random() * statuses.length)];
      setWsStatus(randomStatus);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = () => {
    switch (wsStatus) {
      case "connected":
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            <Wifi className="h-3 w-3 mr-1" />
            Live
          </Badge>
        );
      case "reconnecting":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            <Wifi className="h-3 w-3 mr-1 animate-pulse" />
            Reconnecting
          </Badge>
        );
      case "disconnected":
        return (
          <Badge variant="destructive">
            <WifiOff className="h-3 w-3 mr-1" />
            Offline
          </Badge>
        );
    }
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">{title}</h1>
          {getStatusBadge()}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
