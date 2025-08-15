"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  CheckCircle,
  Zap,
  Skull,
  Mail,
  Search,
  Eye,
} from "lucide-react";
import type { Levels, Logs, EmailAlert } from "../types/type";
import { useAppSelector } from "@/hooks/hooks";

const mockEmailAlerts: EmailAlert[] = [
  { name: "John Doe", email: "john.doe@company.com", active: true },
  { name: "Jane Smith", email: "jane.smith@company.com", active: false },
  { name: "DevOps Team", email: "devops@company.com", active: true },
  { name: "On-Call Engineer", email: "oncall@company.com", active: false },
];

export function AlertSystem() {
  const logs: Logs[] = useAppSelector((state) => state.logs.logs);

  const [emailAlerts, setEmailAlerts] = useState<EmailAlert[]>(mockEmailAlerts);
  const [searchTerm, setSearchTerm] = useState("");
  const [emailSearchTerm, setEmailSearchTerm] = useState("");
  const [selectedLog, setSelectedLog] = useState<Logs | null>(null);

  const getLevelConfig = (level: Levels) => {
    const configs = {
      ["ERROR"]: {
        color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
        icon: <Zap className="h-4 w-4" />,
      },
      ["FATAL"]: {
        color: "bg-red-500/10 text-red-600 border-red-500/20",
        icon: <Skull className="h-4 w-4" />,
      },
      ["INFO"]: { color: "", icon: null },
      ["DEBUG"]: { color: "", icon: null },
      ["TRACE"]: { color: "", icon: null },
      ["WARN"]: { color: "", icon: null },
    };
    return configs[level];
  };

  const toggleResolved = (index: number) => {
    // setLogs((prev) =>
    //   prev.map((log, i) =>
    //     i === index ? { ...log, resolved: !log.resolved } : log
    //   )
    // );
  };

  const toggleEmailAlert = (index: number) => {
    setEmailAlerts((prev) =>
      prev.map((alert, i) =>
        i === index ? { ...alert, active: !alert.active } : alert
      )
    );
  };

  const filterLogs = (logsList: Logs[]) => {
    if (!searchTerm) return logsList;
    return logsList.filter(
      (log) =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.level.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filterEmails = (emailList: EmailAlert[]) => {
    if (!emailSearchTerm) return emailList;
    return emailList.filter(
      (email) =>
        email.name.toLowerCase().includes(emailSearchTerm.toLowerCase()) ||
        email.email.toLowerCase().includes(emailSearchTerm.toLowerCase())
    );
  };

  const allLogs = filterLogs(logs);
  const unresolvedLogs = filterLogs(logs.filter((log) => log.resolved == false));
  const resolvedLogs = filterLogs(logs.filter((log) => log.resolved == true));
  const filteredEmails = filterEmails(emailAlerts);

  const renderLogItem = (log: Logs, index: number) => {
    const levelConfig = getLevelConfig(log.level);
    const originalIndex = logs.findIndex((l) => l === log);

    return (
      <div
        key={`${log.service}-${log.timestamp}`}
        className="flex items-start justify-between p-4 border rounded-lg"
      >
        <div className="flex items-start gap-4 flex-1">
          {log.resolved ? (
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
          )}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold">{log.message}</h3>
              <Badge variant="outline" className={levelConfig.color}>
                {levelConfig.icon}
                <span className="ml-1">{log.level}</span>
              </Badge>
              <Badge variant="secondary">{log.service}</Badge>
              {log.resolved && (
                <Badge className="bg-green-500 text-white">Resolved</Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{new Date(log.timestamp).toLocaleString()}</span>
              {log.instanceId && <span>Instance: {log.instanceId}</span>}
              {log.traceId && <span>Trace: {log.traceId}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLog(log)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {log.resolved ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                  Log Details
                </DialogTitle>
              </DialogHeader>
              {selectedLog && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Level</Label>
                      <div className="mt-1">
                        <Badge
                          variant="outline"
                          className={getLevelConfig(selectedLog.level).color}
                        >
                          {getLevelConfig(selectedLog.level).icon}
                          <span className="ml-1">{selectedLog.level}</span>
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <div className="mt-1 flex items-center gap-2">
                        {selectedLog.resolved ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                        <span>
                          {selectedLog.resolved ? "Resolved" : "Active"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Service</Label>
                      <p className="mt-1">{selectedLog.service}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Timestamp</Label>
                      <p className="mt-1">
                        {new Date(selectedLog.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {selectedLog.instanceId && (
                      <div>
                        <Label className="text-sm font-medium">
                          Instance ID
                        </Label>
                        <p className="mt-1 font-mono text-sm">
                          {selectedLog.instanceId}
                        </p>
                      </div>
                    )}
                    {selectedLog.traceId && (
                      <div>
                        <Label className="text-sm font-medium">Trace ID</Label>
                        <p className="mt-1 font-mono text-sm">
                          {selectedLog.traceId}
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Message</Label>
                    <p className="mt-1 text-sm">{selectedLog.message}</p>
                  </div>
                  {selectedLog.stackTrace && (
                    <div>
                      <Label className="text-sm font-medium">Stack Trace</Label>
                      <pre className="mt-1 text-xs bg-muted p-2 rounded overflow-x-auto">
                        {selectedLog.stackTrace}
                      </pre>
                    </div>
                  )}
                  {selectedLog.metadata && (
                    <div>
                      <Label className="text-sm font-medium">Metadata</Label>
                      <pre className="mt-1 text-xs bg-muted p-2 rounded overflow-x-auto">
                        {JSON.stringify(selectedLog.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
          <Button
            variant={log.resolved ? "outline" : "default"}
            size="sm"
            onClick={() => toggleResolved(originalIndex)}
          >
            {log.resolved ? "Mark Open" : "Mark Resolved"}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-auto flex flex-col p-6 gap-6">
      <h1 className="text-3xl font-bold">Log Monitoring Dashboard</h1>

      <div className="h-[500px] flex-shrink-0">
        <Tabs defaultValue="all" className="h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid grid-cols-3 w-fit">
              <TabsTrigger value="all">All Logs</TabsTrigger>
              <TabsTrigger value="unresolved">Unresolved Logs</TabsTrigger>
              <TabsTrigger value="resolved">Resolved Logs</TabsTrigger>
            </TabsList>

            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs by message, service, or level..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <TabsContent value="all" className="h-[420px] flex-shrink-0">
            <Card className="h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-blue-500" />
                  All Logs ({allLogs.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 min-h-0">
                <div className="h-full overflow-y-auto space-y-4">
                  {allLogs.length === 0 ? (
                    <p className="text-muted-foreground">No logs found</p>
                  ) : (
                    allLogs.map((log, index) => renderLogItem(log, index))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unresolved" className="h-[420px] flex-shrink-0">
            <Card className="h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Unresolved Logs ({unresolvedLogs.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 min-h-0">
                <div className="h-full overflow-y-auto space-y-4">
                  {unresolvedLogs.length === 0 ? (
                    <p className="text-muted-foreground">
                      No unresolved logs found
                    </p>
                  ) : (
                    unresolvedLogs.map((log, index) =>
                      renderLogItem(log, index)
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resolved" className="h-[420px] flex-shrink-0">
            <Card className="h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Resolved Logs ({resolvedLogs.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 min-h-0">
                <div className="h-full overflow-y-auto space-y-4">
                  {resolvedLogs.length === 0 ? (
                    <p className="text-muted-foreground">
                      No resolved logs found
                    </p>
                  ) : (
                    resolvedLogs.map((log) => (
                      <div
                        key={`${log.service}-${log.timestamp}`}
                        className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <div className="flex-1">
                            <p className="font-medium">{log.message}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{log.service}</span>
                              <span>
                                {new Date(log.timestamp).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedLog(log)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                  Log Details
                                </DialogTitle>
                              </DialogHeader>
                              {selectedLog && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Level
                                      </Label>
                                      <div className="mt-1">
                                        <Badge
                                          variant="outline"
                                          className={
                                            getLevelConfig(selectedLog.level)
                                              .color
                                          }
                                        >
                                          {
                                            getLevelConfig(selectedLog.level)
                                              .icon
                                          }
                                          <span className="ml-1">
                                            {selectedLog.level}
                                          </span>
                                        </Badge>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Status
                                      </Label>
                                      <div className="mt-1 flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>Resolved</span>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Service
                                      </Label>
                                      <p className="mt-1">
                                        {selectedLog.service}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Timestamp
                                      </Label>
                                      <p className="mt-1">
                                        {new Date(
                                          selectedLog.timestamp
                                        ).toLocaleString()}
                                      </p>
                                    </div>
                                    {selectedLog.instanceId && (
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Instance ID
                                        </Label>
                                        <p className="mt-1 font-mono text-sm">
                                          {selectedLog.instanceId}
                                        </p>
                                      </div>
                                    )}
                                    {selectedLog.traceId && (
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Trace ID
                                        </Label>
                                        <p className="mt-1 font-mono text-sm">
                                          {selectedLog.traceId}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Message
                                    </Label>
                                    <p className="mt-1 text-sm">
                                      {selectedLog.message}
                                    </p>
                                  </div>
                                  {selectedLog.stackTrace && (
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Stack Trace
                                      </Label>
                                      <pre className="mt-1 text-xs bg-muted p-2 rounded overflow-x-auto">
                                        {selectedLog.stackTrace}
                                      </pre>
                                    </div>
                                  )}
                                  {selectedLog.metadata && (
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Metadata
                                      </Label>
                                      <pre className="mt-1 text-xs bg-muted p-2 rounded overflow-x-auto">
                                        {JSON.stringify(
                                          selectedLog.metadata,
                                          null,
                                          2
                                        )}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Badge className="bg-green-500 text-white">
                            Resolved
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex-shrink-0">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-500" />
                Email Alerts
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search emails..."
                  value={emailSearchTerm}
                  onChange={(e) => setEmailSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 overflow-y-auto">
            <div className="space-y-4">
              {filteredEmails.length === 0 ? (
                <p className="text-muted-foreground">No email alerts found</p>
              ) : (
                filteredEmails.map((alert, index) => {
                  const originalIndex = emailAlerts.findIndex(
                    (e) => e.email === alert.email
                  );
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="font-medium">{alert.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {alert.email}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={alert.active}
                        onCheckedChange={() => toggleEmailAlert(originalIndex)}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
