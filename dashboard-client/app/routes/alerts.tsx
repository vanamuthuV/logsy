import { DashboardLayout } from "@/components/dashboard-layout";
import { AlertSystem } from "@/components/alert-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Clock, X } from "lucide-react";

const mockAlerts = [
  {
    id: "1",
    title: "High Error Rate Detected",
    description: "Error rate exceeded 5% threshold in payment-service",
    severity: "critical" as const,
    status: "active" as const,
    timestamp: "2024-01-15 14:30:00",
    service: "payment-service",
  },
  {
    id: "2",
    title: "Database Connection Pool Full",
    description: "PostgreSQL connection pool at 95% capacity",
    severity: "warning" as const,
    status: "active" as const,
    timestamp: "2024-01-15 14:25:00",
    service: "database",
  },
  {
    id: "3",
    title: "API Response Time High",
    description: "Average response time exceeded 2s threshold",
    severity: "warning" as const,
    status: "acknowledged" as const,
    timestamp: "2024-01-15 14:20:00",
    service: "api-gateway",
  },
];

export default function AlertsPage() {
  const getSeverityBadge = (severity: "low" | "warning" | "critical") => {
    const variants = {
      low: "bg-blue-500 hover:bg-blue-600",
      warning: "bg-yellow-500 hover:bg-yellow-600",
      critical: "bg-red-500 hover:bg-red-600",
    };

    return (
      <Badge className={variants[severity]}>{severity.toUpperCase()}</Badge>
    );
  };

  const getStatusIcon = (status: "active" | "acknowledged" | "resolved") => {
    switch (status) {
      case "active":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "acknowledged":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <DashboardLayout title="Alerts">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-start gap-4 flex-1">
                    {getStatusIcon(alert.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{alert.title}</h3>
                        {getSeverityBadge(alert.severity)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {alert.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{alert.timestamp}</span>
                        <span>Service: {alert.service}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Acknowledge
                    </Button>
                    <Button variant="outline" size="sm">
                      Mute
                    </Button>
                    <Button variant="ghost" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <AlertSystem />
      </div>
    </DashboardLayout>
  );
}
