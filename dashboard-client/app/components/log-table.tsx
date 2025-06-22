"use client";

import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Download,
  Eye,
  Filter,
  RefreshCw,
  Calendar,
  Server,
  Hash,
  AlertTriangle,
  Info,
  XCircle,
  Zap,
  Copy,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "CRITICAL";
  message: string;
  service: string;
  instanceId?: string;
  metadata?: Record<string, any>;
  traceId?: string;
  stackTrace?: string;
}

const mockLogs: LogEntry[] = [
  {
    id: "log_001",
    timestamp: "2024-01-15T14:32:15.123Z",
    level: "INFO",
    service: "api-gateway",
    instanceId: "api-gw-001",
    message: "Request processed successfully",
    traceId: "trace_abc123def456",
    metadata: {
      method: "GET",
      endpoint: "/api/users",
      statusCode: 200,
      responseTime: "45ms",
      userId: "user_12345",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  },
  {
    id: "log_002",
    timestamp: "2024-01-15T14:32:10.456Z",
    level: "WARN",
    service: "auth-service",
    instanceId: "auth-svc-002",
    message: "Rate limit approaching for user",
    traceId: "trace_def456ghi789",
    metadata: {
      userId: "user_12345",
      currentRequests: 95,
      maxRequests: 100,
      timeWindow: "1h",
      clientIp: "192.168.1.100",
    },
  },
  {
    id: "log_003",
    timestamp: "2024-01-15T14:32:05.789Z",
    level: "ERROR",
    service: "database",
    instanceId: "db-pool-001",
    message: "Connection timeout occurred",
    traceId: "trace_ghi789jkl012",
    stackTrace: `java.sql.SQLException: Connection timed out
    at com.logsy.db.ConnectionPool.getConnection(ConnectionPool.java:45)
    at com.logsy.service.UserService.findUser(UserService.java:23)
    at com.logsy.controller.UserController.getUser(UserController.java:15)`,
    metadata: {
      connectionPool: "primary",
      activeConnections: 50,
      maxConnections: 50,
      timeoutMs: 30000,
      query: "SELECT * FROM users WHERE id = ?",
    },
  },
  {
    id: "log_004",
    timestamp: "2024-01-15T14:32:00.012Z",
    level: "CRITICAL",
    service: "payment-service",
    instanceId: "payment-001",
    message: "Payment processing failed - gateway timeout",
    traceId: "trace_jkl012mno345",
    stackTrace: `com.logsy.payment.PaymentException: Gateway timeout
    at com.logsy.payment.PaymentGateway.processPayment(PaymentGateway.java:78)
    at com.logsy.service.PaymentService.charge(PaymentService.java:34)`,
    metadata: {
      transactionId: "tx_123456789",
      amount: 99.99,
      currency: "USD",
      gateway: "stripe",
      customerId: "cust_abc123",
      paymentMethod: "card_ending_4242",
    },
  },
];

export function EnhancedLogTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [isLive, setIsLive] = useState(true);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const getLevelIcon = (level: LogEntry["level"]) => {
    switch (level) {
      case "INFO":
        return <Info className="h-4 w-4" />;
      case "WARN":
        return <AlertTriangle className="h-4 w-4" />;
      case "ERROR":
        return <XCircle className="h-4 w-4" />;
      case "CRITICAL":
        return <Zap className="h-4 w-4" />;
    }
  };

  const getLevelBadge = (level: LogEntry["level"]) => {
    const configs = {
      INFO: {
        className:
          "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20",
        icon: <Info className="h-3 w-3" />,
      },
      WARN: {
        className:
          "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20",
        icon: <AlertTriangle className="h-3 w-3" />,
      },
      ERROR: {
        className:
          "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20",
        icon: <XCircle className="h-3 w-3" />,
      },
      CRITICAL: {
        className:
          "bg-red-600/10 text-red-700 border-red-600/20 hover:bg-red-600/20",
        icon: <Zap className="h-3 w-3" />,
      },
    };

    const config = configs[level];
    return (
      <Badge variant="outline" className={`${config.className} font-medium`}>
        {config.icon}
        <span className="ml-1">{level}</span>
      </Badge>
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      iso: timestamp,
    };
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.traceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.instanceId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel = levelFilter === "all" || log.level === levelFilter;
    const matchesService =
      serviceFilter === "all" || log.service === serviceFilter;

    return matchesSearch && matchesLevel && matchesService;
  });

  const services = Array.from(new Set(mockLogs.map((log) => log.service)));

  // Simulate live updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // In real app, this would fetch new logs
      console.log("Fetching new logs...");
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-background to-muted/20">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                />
                Live Log Stream
              </CardTitle>
              <p className="text-muted-foreground">
                {filteredLogs.length} logs •{" "}
                {isLive ? "Live updates enabled" : "Paused"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={isLive ? "default" : "outline"}
                size="sm"
                onClick={() => setIsLive(!isLive)}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isLive ? "animate-spin" : ""}`}
                />
                {isLive ? "Live" : "Paused"}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Advanced
              </Button>
            </div>
          </div>

          {/* Enhanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs, traces, services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="INFO">Info</SelectItem>
                <SelectItem value="WARN">Warning</SelectItem>
                <SelectItem value="ERROR">Error</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Services" />
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

            <Button variant="outline" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Last 24h
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Enhanced Log Table */}
      <Card>
        <CardContent className="p-0">
          <div className="bg-gradient-to-b from-muted/20 to-background rounded-lg">
            <ScrollArea className="h-[600px]">
              <div className="space-y-1 p-4">
                {filteredLogs.map((log) => {
                  const timestamp = formatTimestamp(log.timestamp);

                  return (
                    <Dialog
                      key={log.id}
                      onOpenChange={(open) => open && setSelectedLog(log)}
                    >
                      <DialogTrigger asChild>
                        <div className="group relative p-4 rounded-lg border border-transparent hover:border-border hover:bg-muted/30 transition-all duration-200 cursor-pointer">
                          <div className="flex items-start gap-4">
                            {/* Timestamp & Level */}
                            <div className="flex flex-col items-center gap-2 min-w-0">
                              <div className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                                {timestamp.time}
                              </div>
                              {getLevelBadge(log.level)}
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 min-w-0 space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="secondary" className="text-xs">
                                  <Server className="h-3 w-3 mr-1" />
                                  {log.service}
                                </Badge>
                                {log.instanceId && (
                                  <Badge variant="outline" className="text-xs">
                                    {log.instanceId}
                                  </Badge>
                                )}
                                {log.traceId && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs font-mono"
                                  >
                                    <Hash className="h-3 w-3 mr-1" />
                                    {log.traceId.slice(-8)}
                                  </Badge>
                                )}
                              </div>

                              <p className="font-mono text-sm leading-relaxed text-foreground">
                                {log.message}
                              </p>

                              {/* Metadata Preview */}
                              {log.metadata && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  {Object.entries(log.metadata)
                                    .slice(0, 3)
                                    .map(([key, value]) => (
                                      <span
                                        key={key}
                                        className="bg-muted px-2 py-1 rounded"
                                      >
                                        {key}: {String(value).slice(0, 20)}
                                      </span>
                                    ))}
                                  {Object.keys(log.metadata).length > 3 && (
                                    <span className="text-muted-foreground">
                                      +{Object.keys(log.metadata).length - 3}{" "}
                                      more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        </div>
                      </DialogTrigger>

                      {/* Enhanced Log Detail Modal */}
                      <DialogContent className="max-w-4xl max-h-[80vh]">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            {getLevelIcon(log.level)}
                            Log Details
                            <Badge variant="outline" className="ml-auto">
                              {log.id}
                            </Badge>
                          </DialogTitle>
                        </DialogHeader>

                        <Tabs defaultValue="overview" className="w-full">
                          <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="metadata">Metadata</TabsTrigger>
                            <TabsTrigger value="trace">Trace</TabsTrigger>
                            <TabsTrigger value="stack">Stack Trace</TabsTrigger>
                          </TabsList>

                          <TabsContent value="overview" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                  Timestamp
                                </label>
                                <div className="flex items-center gap-2">
                                  <code className="text-sm bg-muted px-2 py-1 rounded">
                                    {timestamp.iso}
                                  </code>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      copyToClipboard(
                                        timestamp.iso,
                                        "Timestamp"
                                      )
                                    }
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                  Level
                                </label>
                                <div>{getLevelBadge(log.level)}</div>
                              </div>

                              <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                  Service
                                </label>
                                <Badge variant="secondary">{log.service}</Badge>
                              </div>

                              <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                  Instance
                                </label>
                                <Badge variant="outline">
                                  {log.instanceId || "N/A"}
                                </Badge>
                              </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                              <label className="text-sm font-medium text-muted-foreground">
                                Message
                              </label>
                              <div className="bg-muted p-4 rounded-lg">
                                <code className="text-sm">{log.message}</code>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="metadata" className="space-y-4">
                            {log.metadata ? (
                              <div className="space-y-3">
                                {Object.entries(log.metadata).map(
                                  ([key, value]) => (
                                    <div
                                      key={key}
                                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                                    >
                                      <span className="font-medium text-sm">
                                        {key}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <code className="text-sm">
                                          {JSON.stringify(value)}
                                        </code>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            copyToClipboard(
                                              JSON.stringify(value),
                                              key
                                            )
                                          }
                                        >
                                          <Copy className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            ) : (
                              <p className="text-muted-foreground text-center py-8">
                                No metadata available
                              </p>
                            )}
                          </TabsContent>

                          <TabsContent value="trace" className="space-y-4">
                            {log.traceId ? (
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                      Trace ID
                                    </label>
                                    <div className="flex items-center gap-2 mt-1">
                                      <code className="text-sm bg-muted px-2 py-1 rounded">
                                        {log.traceId}
                                      </code>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          copyToClipboard(
                                            log.traceId!,
                                            "Trace ID"
                                          )
                                        }
                                      >
                                        <Copy className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                  <Button variant="outline" size="sm">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View in Tracer
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-muted-foreground text-center py-8">
                                No trace information available
                              </p>
                            )}
                          </TabsContent>

                          <TabsContent value="stack" className="space-y-4">
                            {log.stackTrace ? (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <label className="text-sm font-medium text-muted-foreground">
                                    Stack Trace
                                  </label>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      copyToClipboard(
                                        log.stackTrace!,
                                        "Stack Trace"
                                      )
                                    }
                                  >
                                    <Copy className="h-3 w-3 mr-2" />
                                    Copy
                                  </Button>
                                </div>
                                <ScrollArea className="h-64">
                                  <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
                                    <code>{log.stackTrace}</code>
                                  </pre>
                                </ScrollArea>
                              </div>
                            ) : (
                              <p className="text-muted-foreground text-center py-8">
                                No stack trace available
                              </p>
                            )}
                          </TabsContent>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
