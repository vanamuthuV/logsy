
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  Plus,
  Trash2,
  Mail,
  Webhook,
  MessageSquare,
  Bell,
  Settings,
  Activity,
  Zap,
  Shield,
  Users,
  Globe,
} from "lucide-react";
import { toast } from "sonner";

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "active" | "acknowledged" | "resolved";
  timestamp: string;
  service: string;
  triggeredBy: string;
  affectedUsers?: number;
  estimatedImpact?: string;
}

interface AlertChannel {
  id: string;
  type: "email" | "webhook" | "slack" | "discord" | "teams";
  name: string;
  config: Record<string, string>;
  enabled: boolean;
  lastUsed?: string;
}

const mockAlerts: Alert[] = [
  {
    id: "alert_001",
    title: "High Error Rate Detected",
    description:
      "Error rate exceeded 5% threshold in payment-service over the last 5 minutes",
    severity: "critical",
    status: "active",
    timestamp: "2024-01-15T14:30:00Z",
    service: "payment-service",
    triggeredBy: "error_rate_monitor",
    affectedUsers: 1250,
    estimatedImpact: "Payment processing disrupted",
  },
  {
    id: "alert_002",
    title: "Database Connection Pool Exhausted",
    description:
      "PostgreSQL connection pool at 98% capacity for 3 consecutive minutes",
    severity: "high",
    status: "acknowledged",
    timestamp: "2024-01-15T14:25:00Z",
    service: "database",
    triggeredBy: "connection_pool_monitor",
    affectedUsers: 500,
    estimatedImpact: "Slower response times",
  },
  {
    id: "alert_003",
    title: "API Response Time Degraded",
    description:
      "Average response time exceeded 2s threshold for /api/users endpoint",
    severity: "medium",
    status: "active",
    timestamp: "2024-01-15T14:20:00Z",
    service: "api-gateway",
    triggeredBy: "response_time_monitor",
    affectedUsers: 200,
    estimatedImpact: "User experience degradation",
  },
];

const mockChannels: AlertChannel[] = [
  {
    id: "ch_001",
    type: "email",
    name: "DevOps Team",
    config: {
      emails: "devops@company.com,sre@company.com,oncall@company.com",
      subject_prefix: "[LOGSY ALERT]",
    },
    enabled: true,
    lastUsed: "2024-01-15T14:30:00Z",
  },
  {
    id: "ch_002",
    type: "slack",
    name: "Alerts Channel",
    config: {
      webhook: "https://hooks.slack.com/services/...",
      channel: "#alerts",
      mention_users: "@channel",
    },
    enabled: true,
    lastUsed: "2024-01-15T14:25:00Z",
  },
  {
    id: "ch_003",
    type: "webhook",
    name: "PagerDuty Integration",
    config: {
      url: "https://events.pagerduty.com/integration/...",
      routing_key: "R02ABCD1234567890",
    },
    enabled: false,
  },
];

export function AlertSystem() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [channels, setChannels] = useState<AlertChannel[]>(mockChannels);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const getSeverityConfig = (severity: Alert["severity"]) => {
    const configs = {
      low: {
        color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        icon: <Shield className="h-4 w-4" />,
      },
      medium: {
        color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
        icon: <AlertTriangle className="h-4 w-4" />,
      },
      high: {
        color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
        icon: <Zap className="h-4 w-4" />,
      },
      critical: {
        color: "bg-red-500/10 text-red-600 border-red-500/20",
        icon: <Activity className="h-4 w-4" />,
      },
    };
    return configs[severity];
  };

  const getStatusIcon = (status: Alert["status"]) => {
    switch (status) {
      case "active":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "acknowledged":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getChannelIcon = (type: AlertChannel["type"]) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "webhook":
        return <Webhook className="h-4 w-4" />;
      case "slack":
        return <MessageSquare className="h-4 w-4" />;
      case "discord":
        return <MessageSquare className="h-4 w-4" />;
      case "teams":
        return <Users className="h-4 w-4" />;
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? { ...alert, status: "acknowledged" as const }
          : alert
      )
    );
    toast.success("Alert acknowledged");
  };

  const resolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, status: "resolved" as const } : alert
      )
    );
    toast.success("Alert resolved");
  };

  return (
    <div className="space-y-6">
      {/* Alert Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-red-600">
                  {
                    alerts.filter(
                      (a) => a.severity === "critical" && a.status === "active"
                    ).length
                  }
                </p>
              </div>
              <Activity className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High</p>
                <p className="text-2xl font-bold text-orange-600">
                  {
                    alerts.filter(
                      (a) => a.severity === "high" && a.status === "active"
                    ).length
                  }
                </p>
              </div>
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Acknowledged</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {alerts.filter((a) => a.status === "acknowledged").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved Today</p>
                <p className="text-2xl font-bold text-green-600">12</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Alerts</TabsTrigger>
          <TabsTrigger value="channels">Alert Channels</TabsTrigger>
          <TabsTrigger value="rules">Alert Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Active & Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => {
                  const severityConfig = getSeverityConfig(alert.severity);

                  return (
                    <Dialog
                      key={alert.id}
                      onOpenChange={(open) => open && setSelectedAlert(alert)}
                    >
                      <DialogTrigger asChild>
                        <div className="group p-4 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                              {getStatusIcon(alert.status)}
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold">
                                    {alert.title}
                                  </h3>
                                  <Badge
                                    variant="outline"
                                    className={severityConfig.color}
                                  >
                                    {severityConfig.icon}
                                    <span className="ml-1 capitalize">
                                      {alert.severity}
                                    </span>
                                  </Badge>
                                  <Badge variant="secondary">
                                    {alert.service}
                                  </Badge>
                                </div>

                                <p className="text-sm text-muted-foreground">
                                  {alert.description}
                                </p>

                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span>
                                    {new Date(alert.timestamp).toLocaleString()}
                                  </span>
                                  {alert.affectedUsers && (
                                    <span className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {alert.affectedUsers.toLocaleString()}{" "}
                                      users affected
                                    </span>
                                  )}
                                  {alert.estimatedImpact && (
                                    <span className="flex items-center gap-1">
                                      <Globe className="h-3 w-3" />
                                      {alert.estimatedImpact}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {alert.status === "active" && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      acknowledgeAlert(alert.id);
                                    }}
                                  >
                                    Acknowledge
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      resolveAlert(alert.id);
                                    }}
                                  >
                                    Resolve
                                  </Button>
                                </>
                              )}
                              <Button variant="ghost" size="sm">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogTrigger>

                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            {getStatusIcon(alert.status)}
                            Alert Details
                          </DialogTitle>
                        </DialogHeader>

                        {selectedAlert && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">
                                  Severity
                                </Label>
                                <div className="mt-1">
                                  <Badge
                                    variant="outline"
                                    className={
                                      getSeverityConfig(selectedAlert.severity)
                                        .color
                                    }
                                  >
                                    {
                                      getSeverityConfig(selectedAlert.severity)
                                        .icon
                                    }
                                    <span className="ml-1 capitalize">
                                      {selectedAlert.severity}
                                    </span>
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">
                                  Status
                                </Label>
                                <div className="mt-1 flex items-center gap-2">
                                  {getStatusIcon(selectedAlert.status)}
                                  <span className="capitalize">
                                    {selectedAlert.status}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">
                                  Service
                                </Label>
                                <p className="mt-1">{selectedAlert.service}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">
                                  Triggered By
                                </Label>
                                <p className="mt-1 font-mono text-sm">
                                  {selectedAlert.triggeredBy}
                                </p>
                              </div>
                            </div>

                            <div>
                              <Label className="text-sm font-medium">
                                Description
                              </Label>
                              <p className="mt-1 text-sm">
                                {selectedAlert.description}
                              </p>
                            </div>

                            {selectedAlert.affectedUsers && (
                              <div>
                                <Label className="text-sm font-medium">
                                  Impact
                                </Label>
                                <div className="mt-1 space-y-1">
                                  <p className="text-sm">
                                    {selectedAlert.affectedUsers.toLocaleString()}{" "}
                                    users affected
                                  </p>
                                  {selectedAlert.estimatedImpact && (
                                    <p className="text-sm text-muted-foreground">
                                      {selectedAlert.estimatedImpact}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Channels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded-lg">
                      {getChannelIcon(channel.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{channel.name}</h3>
                        <Badge variant="outline" className="capitalize">
                          {channel.type}
                        </Badge>
                        {channel.enabled && (
                          <Badge variant="default" className="bg-green-500">
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {channel.lastUsed
                          ? `Last used: ${new Date(channel.lastUsed).toLocaleString()}`
                          : "Never used"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={channel.enabled}
                      onCheckedChange={(checked) => {
                        setChannels((prev) =>
                          prev.map((ch) =>
                            ch.id === channel.id
                              ? { ...ch, enabled: checked }
                              : ch
                          )
                        );
                      }}
                    />
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button className="w-full" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add New Channel
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Rules Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Configure custom alert rules and thresholds here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
