"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Download, Eye } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error" | "critical";
  service: string;
  message: string;
  details?: string;
}

const mockLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: "2024-01-15 14:32:15",
    level: "info",
    service: "api-gateway",
    message: "Request processed successfully",
    details: "GET /api/users - 200 OK - 45ms",
  },
  {
    id: "2",
    timestamp: "2024-01-15 14:32:10",
    level: "warn",
    service: "auth-service",
    message: "Rate limit approaching for user",
    details: "User ID: 12345 - Current: 95/100 requests",
  },
  {
    id: "3",
    timestamp: "2024-01-15 14:32:05",
    level: "error",
    service: "database",
    message: "Connection timeout",
    details: "Failed to connect to PostgreSQL after 30s timeout",
  },
  {
    id: "4",
    timestamp: "2024-01-15 14:32:00",
    level: "critical",
    service: "payment-service",
    message: "Payment processing failed",
    details: "Transaction ID: tx_123456 - Gateway error: NETWORK_TIMEOUT",
  },
];

export function LogTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");

  const getLevelBadge = (level: LogEntry["level"]) => {
    const variants = {
      info: "default",
      warn: "secondary",
      error: "destructive",
      critical: "destructive",
    } as const;

    const colors = {
      info: "bg-blue-500 hover:bg-blue-600",
      warn: "bg-yellow-500 hover:bg-yellow-600",
      error: "bg-red-500 hover:bg-red-600",
      critical: "bg-red-700 hover:bg-red-800",
    };

    return (
      <Badge variant={variants[level]} className={colors[level]}>
        {level.toUpperCase()}
      </Badge>
    );
  };

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === "all" || log.level === levelFilter;
    const matchesService =
      serviceFilter === "all" || log.service === serviceFilter;

    return matchesSearch && matchesLevel && matchesService;
  });

  const services = Array.from(new Set(mockLogs.map((log) => log.service)));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Live Log Feed</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Log Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warn">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>

          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              {services.map((service) => (
                <SelectItem key={service} value={service}>
                  {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="terminal-bg rounded-lg p-4">
          <ScrollArea className="h-[500px]">
            <div className="space-y-1">
              {filteredLogs.map((log) => (
                <Dialog key={log.id}>
                  <DialogTrigger asChild>
                    <div className="log-entry p-3 rounded cursor-pointer group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-muted-foreground text-xs font-mono whitespace-nowrap">
                            {log.timestamp}
                          </span>
                          {getLevelBadge(log.level)}
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            {log.service}
                          </span>
                          <span className="font-mono text-sm truncate">
                            {log.message}
                          </span>
                        </div>
                        <Eye className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Log Details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">
                            Timestamp
                          </label>
                          <p className="font-mono text-sm">{log.timestamp}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Level</label>
                          <div className="mt-1">{getLevelBadge(log.level)}</div>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Service</label>
                          <p className="text-sm">{log.service}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Log ID</label>
                          <p className="font-mono text-sm">{log.id}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Message</label>
                        <p className="font-mono text-sm mt-1 p-3 bg-muted rounded">
                          {log.message}
                        </p>
                      </div>
                      {log.details && (
                        <div>
                          <label className="text-sm font-medium">Details</label>
                          <p className="font-mono text-sm mt-1 p-3 bg-muted rounded">
                            {log.details}
                          </p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
