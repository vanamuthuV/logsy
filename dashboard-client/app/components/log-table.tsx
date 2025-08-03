import type React from "react";
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
  Clock,
  Activity,
  Database,
  Code,
  CheckCircle,
  FileText,
  Loader2,
  Coffee,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";
import type { Logs, Levels } from "@/types/type";
import type { JSX } from "react/jsx-runtime";

export function EnhancedLogTable({
  serverLogs,
  isLive,
  setIsLive,
  setIsRefreshing,
  isRefreshing,
}: {
  serverLogs: Logs[];
  isLive: boolean;
  setIsLive: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
  isRefreshing: boolean;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");

  const logs: Logs[] = serverLogs;
  const [selectedLog, setSelectedLog] = useState<Logs | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
  };

  const getLevelIcon = (level: Logs["level"]) => {
    switch (level) {
      case "INFO":
        return <Info className="h-4 w-4" />;
      case "WARN":
        return <AlertTriangle className="h-4 w-4" />;
      case "ERROR":
        return <XCircle className="h-4 w-4" />;
      case "DEBUG":
        return <Code className="h-4 w-4" />;
      case "TRACE":
        return <Activity className="h-4 w-4" />;
      case "FATAL":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const getLevelBadge = (level: Logs["level"]) => {
    const configs: Record<Levels, { className: string; icon: JSX.Element }> = {
      INFO: {
        className:
          "bg-blue-50 text-blue-700 border-blue-200 text-xs px-2 py-0.5",
        icon: <Info className="h-3 w-3" />,
      },
      WARN: {
        className:
          "bg-amber-50 text-amber-700 border-amber-200 text-xs px-2 py-0.5",
        icon: <AlertTriangle className="h-3 w-3" />,
      },
      ERROR: {
        className: "bg-red-50 text-red-700 border-red-200 text-xs px-2 py-0.5",
        icon: <XCircle className="h-3 w-3" />,
      },
      DEBUG: {
        className:
          "bg-slate-50 text-slate-700 border-slate-200 text-xs px-2 py-0.5",
        icon: <Code className="h-3 w-3" />,
      },
      TRACE: {
        className:
          "bg-purple-50 text-purple-700 border-purple-200 text-xs px-2 py-0.5",
        icon: <Activity className="h-3 w-3" />,
      },
      FATAL: {
        className: "bg-black text-white border-black text-xs px-2 py-0.5",
        icon: <XCircle className="h-3 w-3" />,
      },
    };

    const config = configs[level];
    if (!config) {
      return (
        <Badge variant="outline" className="text-xs px-2 py-0.5">
          UNKNOWN
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className={config.className}>
        {config.icon}
        <span className="ml-1">{level}</span>
      </Badge>
    );
  };

  const formatTimestamp = (timestamp: string | Date | number) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour12: false, timeStyle: "medium" }),
      iso: date.toISOString(),
      relative: getRelativeTime(date),
    };
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard! ✨`);
  };

  const filteredLogs = logs.filter((log) => {
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

  const services = Array.from(new Set(logs.map((log) => log.service)));

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      console.log("Fetching new logs...");
    }, 5000);
    return () => clearInterval(interval);
  }, [isLive]);

  // Empty State Component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-[500px] text-center px-4">
      <div className="mb-8">
        <div className="relative">
          <Terminal className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <div className="absolute -top-2 -right-2 animate-bounce">
            <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center">
              <Coffee className="h-3 w-3 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 max-w-md">
        <h3 className="text-2xl font-bold">No logs yet? No worries!</h3>
        <p className="text-muted-foreground leading-relaxed">
          Your logs will appear here once your services start generating them.
          Grab a <Coffee className="h-4 w-4 inline mx-1" /> while we wait!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh Logs
          </Button>

          <Button variant="outline" onClick={() => setIsLive(!isLive)}>
            <Activity
              className={`h-4 w-4 mr-2 ${isLive ? "animate-pulse" : ""}`}
            />
            {isLive ? "Live Mode On" : "Enable Live Mode"}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 pt-6 text-xs text-muted-foreground">
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-1 w-1 bg-muted-foreground rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          <span>Waiting for logs...</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Enhanced Header */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-background to-muted/20">
        <CardHeader>
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <div
                  className={`h-3 w-3 rounded-full transition-all duration-300 ${
                    isLive
                      ? "bg-green-500 animate-pulse shadow-lg shadow-green-500/50"
                      : "bg-gray-400"
                  }`}
                />
                {isLive ? "Live" : "Paused"} Log Stream
              </CardTitle>
              <p className="text-muted-foreground text-lg">
                <span className="font-semibold">{filteredLogs.length}</span>
                {filteredLogs.length === 1 ? " log" : " logs"} •
                <span className={isLive ? "text-green-600" : ""}>
                  {isLive ? "Live updates enabled" : "Updates paused"}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button
                variant={isLive ? "default" : "outline"}
                size="sm"
                onClick={() => setIsLive(!isLive)}
              >
                <Activity
                  className={`h-4 w-4 mr-2 ${isLive ? "animate-pulse" : ""}`}
                />
                {isLive ? "Live" : "Paused"}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Advanced</span>
              </Button>
            </div>
          </div>

          {/* Enhanced Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pt-6">
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
                <SelectItem value="DEBUG">Debug</SelectItem>
                <SelectItem value="TRACE">Trace</SelectItem>
                <SelectItem value="FATAL">Fatal</SelectItem>
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
                    <div className="flex items-center gap-2">
                      <Server className="h-3 w-3" />
                      {service}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Last 24h</span>
              <span className="sm:hidden">24h</span>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Enhanced Log Table or Empty State */}
      <Card>
        <CardContent className="p-0">
          {filteredLogs.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="bg-gradient-to-b from-muted/20 to-background rounded-lg">
              <ScrollArea className="h-[600px]">
                <div className="divide-y divide-border">
                  {filteredLogs.map((log, index) => {
                    const timestamp = formatTimestamp(log.timestamp);
                    return (
                      <Dialog
                        key={index}
                        onOpenChange={(open) => open && setSelectedLog(log)}
                      >
                        <DialogTrigger asChild>
                          <div className="group flex items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors cursor-pointer border-l-2 border-transparent hover:border-l-blue-500">
                            {/* Timestamp */}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono min-w-[90px] xl:min-w-[100px]">
                              <Clock className="h-3 w-3" />
                              <div className="hidden sm:block">
                                {timestamp.time}
                              </div>
                              <div className="sm:hidden">
                                {timestamp.relative}
                              </div>
                            </div>

                            {/* Level Badge */}
                            <div className="min-w-[80px] xl:min-w-[90px]">
                              {getLevelBadge(log.level)}
                            </div>

                            {/* Service */}
                            <div className="min-w-[100px] xl:min-w-[120px] hidden md:block">
                              <Badge variant="secondary" className="text-xs">
                                <Server className="h-3 w-3 mr-1" />
                                {log.service}
                              </Badge>
                            </div>

                            {/* Message */}
                            <div className="flex-1 min-w-0">
                              <p className="font-mono text-sm text-foreground truncate">
                                {log.message}
                              </p>
                              <div className="flex items-center gap-2 mt-1 md:hidden">
                                <Badge variant="outline" className="text-xs">
                                  <Server className="h-3 w-3 mr-1" />
                                  {log.service}
                                </Badge>
                                {log.traceId && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs font-mono"
                                  >
                                    <Hash className="h-3 w-3 mr-1" />
                                    {log.traceId.slice(-6)}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Metadata indicators */}
                            <div className="flex items-center gap-2 min-w-[100px] xl:min-w-[140px] justify-end">
                              {log.traceId && (
                                <Badge
                                  variant="outline"
                                  className="text-xs font-mono hidden md:flex"
                                >
                                  <Hash className="h-3 w-3 mr-1" />
                                  {log.traceId.slice(-6)}
                                </Badge>
                              )}
                              {log.instanceId && (
                                <Badge
                                  variant="outline"
                                  className="text-xs hidden lg:flex"
                                >
                                  {log.instanceId.slice(-4)}
                                </Badge>
                              )}
                              <Eye className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        </DialogTrigger>

                        {/* Enhanced Log Detail Modal */}
                        <DialogContent className="max-w-7xl max-h-[95vh] p-0">
                          <div className="flex flex-col h-full">
                            {/* Modal Header */}
                            <DialogHeader className="px-8 py-6 border-b bg-muted/30">
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                  <div className="p-3 rounded-lg bg-background border">
                                    {getLevelIcon(log.level)}
                                  </div>
                                  <div>
                                    <DialogTitle className="text-2xl font-bold">
                                      Log Details
                                    </DialogTitle>
                                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                                      <Clock className="h-4 w-4" />
                                      {timestamp.relative} • {log.service}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  {getLevelBadge(log.level)}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      copyToClipboard(
                                        JSON.stringify(log, null, 2),
                                        "Full log"
                                      )
                                    }
                                  >
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy All
                                  </Button>
                                </div>
                              </div>
                            </DialogHeader>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-hidden">
                              <Tabs
                                defaultValue="overview"
                                className="h-full flex flex-col"
                              >
                                <div className="px-8 pt-6">
                                  <TabsList className="grid w-full grid-cols-4 bg-muted/50">
                                    <TabsTrigger
                                      value="overview"
                                      className="flex items-center gap-2"
                                    >
                                      <Info className="h-4 w-4" />
                                      <span className="hidden sm:inline">
                                        Overview
                                      </span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="metadata"
                                      className="flex items-center gap-2"
                                    >
                                      <Database className="h-4 w-4" />
                                      <span className="hidden sm:inline">
                                        Metadata
                                      </span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="trace"
                                      className="flex items-center gap-2"
                                    >
                                      <Activity className="h-4 w-4" />
                                      <span className="hidden sm:inline">
                                        Trace
                                      </span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="stack"
                                      className="flex items-center gap-2"
                                    >
                                      <Code className="h-4 w-4" />
                                      <span className="hidden sm:inline">
                                        Stack
                                      </span>
                                    </TabsTrigger>
                                  </TabsList>
                                </div>

                                <div className="flex-1 overflow-hidden">
                                  <TabsContent
                                    value="overview"
                                    className="h-full p-8 space-y-8 overflow-auto"
                                  >
                                    {/* Quick Info Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                      <Card className="p-6">
                                        <div className="flex items-center gap-4">
                                          <Clock className="h-5 w-5 text-muted-foreground" />
                                          <div>
                                            <p className="text-sm font-medium">
                                              Timestamp
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                              {timestamp.relative}
                                            </p>
                                          </div>
                                        </div>
                                      </Card>
                                      <Card className="p-6">
                                        <div className="flex items-center gap-4">
                                          <Server className="h-5 w-5 text-muted-foreground" />
                                          <div>
                                            <p className="text-sm font-medium">
                                              Service
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                              {log.service}
                                            </p>
                                          </div>
                                        </div>
                                      </Card>
                                      <Card className="p-6">
                                        <div className="flex items-center gap-4">
                                          <Hash className="h-5 w-5 text-muted-foreground" />
                                          <div>
                                            <p className="text-sm font-medium">
                                              Instance
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                              {log.instanceId || "N/A"}
                                            </p>
                                          </div>
                                        </div>
                                      </Card>
                                      <Card className="p-6">
                                        <div className="flex items-center gap-4">
                                          <CheckCircle className="h-5 w-5 text-muted-foreground" />
                                          <div>
                                            <p className="text-sm font-medium">
                                              Level
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                              {log.level}
                                            </p>
                                          </div>
                                        </div>
                                      </Card>
                                    </div>

                                    <Separator />

                                    {/* Message Section */}
                                    <div className="space-y-4">
                                      <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                          <FileText className="h-5 w-5" />
                                          Message
                                        </h3>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            copyToClipboard(
                                              log.message,
                                              "Message"
                                            )
                                          }
                                        >
                                          <Copy className="h-4 w-4" />
                                        </Button>
                                      </div>
                                      <Card className="p-6 bg-muted/30">
                                        <code className="text-sm leading-relaxed block whitespace-pre-wrap font-mono">
                                          {log.message}
                                        </code>
                                      </Card>
                                    </div>

                                    {/* Full Timestamp */}
                                    <div className="space-y-4">
                                      <h3 className="text-xl font-bold flex items-center gap-2">
                                        <Clock className="h-5 w-5" />
                                        Full Timestamp
                                      </h3>
                                      <div className="flex items-center gap-3">
                                        <code className="text-sm bg-muted px-4 py-3 rounded-lg flex-1 font-mono">
                                          {timestamp.iso}
                                        </code>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            copyToClipboard(
                                              timestamp.iso,
                                              "Timestamp"
                                            )
                                          }
                                        >
                                          <Copy className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </TabsContent>

                                  <TabsContent
                                    value="metadata"
                                    className="h-full p-8 overflow-auto"
                                  >
                                    {log.metadata &&
                                    Object.keys(log.metadata).length > 0 ? (
                                      <div className="space-y-6">
                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                          <Database className="h-5 w-5" />
                                          Metadata
                                        </h3>
                                        <div className="grid gap-6">
                                          {Object.entries(log.metadata).map(
                                            ([key, value]) => (
                                              <Card key={key} className="p-6">
                                                <div className="flex items-start justify-between gap-4">
                                                  <div className="flex-1">
                                                    <h4 className="font-semibold text-lg mb-3">
                                                      {key}
                                                    </h4>
                                                    <div className="bg-muted/50 p-4 rounded-lg">
                                                      <code className="text-sm block overflow-x-auto whitespace-pre-wrap font-mono">
                                                        {JSON.stringify(
                                                          value,
                                                          null,
                                                          2
                                                        )}
                                                      </code>
                                                    </div>
                                                  </div>
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
                                                    <Copy className="h-4 w-4" />
                                                  </Button>
                                                </div>
                                              </Card>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex flex-col items-center justify-center h-full text-center">
                                        <Database className="h-16 w-16 text-muted-foreground mb-8" />
                                        <h3 className="text-2xl font-bold mb-3">
                                          No Metadata Available
                                        </h3>
                                        <p className="text-muted-foreground max-w-md">
                                          This log entry doesn't contain any
                                          metadata. Check other tabs for more
                                          information.
                                        </p>
                                      </div>
                                    )}
                                  </TabsContent>

                                  <TabsContent
                                    value="trace"
                                    className="h-full p-8 overflow-auto"
                                  >
                                    {log.traceId ? (
                                      <div className="space-y-8">
                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                          <Activity className="h-5 w-5" />
                                          Trace Information
                                        </h3>
                                        <Card className="p-8">
                                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                                            <div>
                                              <h4 className="font-bold text-lg">
                                                Trace ID
                                              </h4>
                                              <p className="text-muted-foreground mt-2">
                                                Use this ID to correlate logs
                                                across services and trace
                                                request flows
                                              </p>
                                            </div>
                                            <Button variant="outline" size="sm">
                                              <ExternalLink className="h-4 w-4 mr-2" />
                                              View in Tracer
                                            </Button>
                                          </div>
                                          <div className="flex items-center gap-3">
                                            <code className="text-sm bg-muted px-4 py-3 rounded-lg flex-1 font-mono">
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
                                              <Copy className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </Card>
                                      </div>
                                    ) : (
                                      <div className="flex flex-col items-center justify-center h-full text-center">
                                        <Activity className="h-16 w-16 text-muted-foreground mb-8" />
                                        <h3 className="text-2xl font-bold mb-3">
                                          No Trace Information
                                        </h3>
                                        <p className="text-muted-foreground max-w-md">
                                          This log entry doesn't contain trace
                                          data. Enable tracing in your
                                          application to see trace information
                                          here.
                                        </p>
                                      </div>
                                    )}
                                  </TabsContent>

                                  <TabsContent
                                    value="stack"
                                    className="h-full p-8 overflow-auto"
                                  >
                                    {log.stackTrace ? (
                                      <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                          <h3 className="text-xl font-bold flex items-center gap-2">
                                            <Code className="h-5 w-5" />
                                            Stack Trace
                                          </h3>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              copyToClipboard(
                                                log.stackTrace!,
                                                "Stack Trace"
                                              )
                                            }
                                          >
                                            <Copy className="h-4 w-4 mr-2" />
                                            Copy Stack Trace
                                          </Button>
                                        </div>
                                        <Card className="p-0 overflow-hidden">
                                          <div className="bg-muted/30 px-6 py-3 border-b">
                                            <p className="text-sm text-muted-foreground font-medium">
                                              Stack trace details
                                            </p>
                                          </div>
                                          <ScrollArea className="h-96">
                                            <pre className="text-xs p-6 bg-muted/20 overflow-x-auto">
                                              <code className="font-mono leading-relaxed">
                                                {log.stackTrace}
                                              </code>
                                            </pre>
                                          </ScrollArea>
                                        </Card>
                                      </div>
                                    ) : (
                                      <div className="flex flex-col items-center justify-center h-full text-center">
                                        <Code className="h-16 w-16 text-muted-foreground mb-8" />
                                        <h3 className="text-2xl font-bold mb-3">
                                          No Stack Trace
                                        </h3>
                                        <p className="text-muted-foreground max-w-md">
                                          This log entry doesn't contain a stack
                                          trace. Stack traces typically appear
                                          with error-level logs.
                                        </p>
                                      </div>
                                    )}
                                  </TabsContent>
                                </div>
                              </Tabs>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}