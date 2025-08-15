import {
  Activity,
  AlertTriangle,
  FileText,
  Home,
  Settings,
  Shield,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "@remix-run/react";
import { useState } from "react";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Logs",
    url: "/logs",
    icon: FileText,
    badge: "Live",
  },
  {
    title: "Alerts",
    url: "/alerts",
    icon: AlertTriangle,
    badge: "3",
  },
  {
    title: "Environment",
    url: "/environment",
    icon: Shield,
  },
  // {
  //   title: "Settings",
  //   url: "/settings",
  //   icon: Settings,
  // },
];

export function AppSidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  // 🧠 Sidebar toggle state
  const [open, setOpen] = useState(true);

  return (
    <Sidebar
      variant="inset"
      className={`${open ? "" : "hidden"} transition-all duration-300`}
    >
      <SidebarHeader>
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Activity className="h-4 w-4" />
            </div>
            <div className="grid text-left text-sm leading-tight">
              <span className="truncate font-semibold">Logsy</span>
              <span className="truncate text-xs text-muted-foreground">
                Log Monitoring
              </span>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant={
                            item.badge === "Live" ? "default" : "secondary"
                          }
                          className="ml-auto h-5 px-1.5 text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span>System Online</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
