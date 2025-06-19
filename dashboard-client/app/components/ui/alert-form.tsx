"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Mail, Webhook, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface AlertChannel {
  id: string;
  type: "email" | "webhook" | "slack" | "discord";
  name: string;
  config: Record<string, string>;
  enabled: boolean;
}

const mockChannels: AlertChannel[] = [
  {
    id: "1",
    type: "email",
    name: "DevOps Team",
    config: { emails: "devops@company.com,alerts@company.com" },
    enabled: true,
  },
  {
    id: "2",
    type: "slack",
    name: "Alerts Channel",
    config: { webhook: "https://hooks.slack.com/services/..." },
    enabled: true,
  },
  {
    id: "3",
    type: "webhook",
    name: "PagerDuty",
    config: { url: "https://events.pagerduty.com/integration/..." },
    enabled: false,
  },
];

export function AlertForm() {
  const [channels, setChannels] = useState<AlertChannel[]>(mockChannels);
  const [newChannel, setNewChannel] = useState({
    type: "email" as AlertChannel["type"],
    name: "",
    config: {} as Record<string, string>,
  });

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
    }
  };

  const getChannelFields = (type: AlertChannel["type"]) => {
    switch (type) {
      case "email":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="emails">Email Addresses</Label>
              <Textarea
                id="emails"
                placeholder="Enter email addresses separated by commas"
                value={newChannel.config.emails || ""}
                onChange={(e : any) =>
                  setNewChannel((prev) => ({
                    ...prev,
                    config: { ...prev.config, emails: e.target.value },
                  }))
                }
              />
            </div>
          </div>
        );
      case "webhook":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                placeholder="https://your-webhook-url.com/alerts"
                value={newChannel.config.url || ""}
                onChange={(e) =>
                  setNewChannel((prev) => ({
                    ...prev,
                    config: { ...prev.config, url: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="webhook-secret">Secret (Optional)</Label>
              <Input
                id="webhook-secret"
                type="password"
                placeholder="Webhook secret for verification"
                value={newChannel.config.secret || ""}
                onChange={(e) =>
                  setNewChannel((prev) => ({
                    ...prev,
                    config: { ...prev.config, secret: e.target.value },
                  }))
                }
              />
            </div>
          </div>
        );
      case "slack":
      case "discord":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                placeholder={`https://hooks.${type}.com/services/...`}
                value={newChannel.config.webhook || ""}
                onChange={(e) =>
                  setNewChannel((prev) => ({
                    ...prev,
                    config: { ...prev.config, webhook: e.target.value },
                  }))
                }
              />
            </div>
          </div>
        );
    }
  };

  const addChannel = () => {
    if (!newChannel.name.trim()) {
      toast.error("Please enter a channel name");
      return;
    }

    const channel: AlertChannel = {
      id: Date.now().toString(),
      type: newChannel.type,
      name: newChannel.name,
      config: newChannel.config,
      enabled: true,
    };

    setChannels((prev) => [...prev, channel]);
    setNewChannel({ type: "email", name: "", config: {} });
    toast.success("Alert channel added successfully");
  };

  const toggleChannel = (id: string) => {
    setChannels((prev) =>
      prev.map((channel) =>
        channel.id === id ? { ...channel, enabled: !channel.enabled } : channel
      )
    );
  };

  const deleteChannel = (id: string) => {
    setChannels((prev) => prev.filter((channel) => channel.id !== id));
    toast.success("Alert channel deleted");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Alert Channels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {channels.map((channel) => (
            <div
              key={channel.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                {getChannelIcon(channel.type)}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{channel.name}</span>
                    <Badge variant="outline" className="capitalize">
                      {channel.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {channel.type === "email" &&
                      `${channel.config.emails?.split(",").length || 0} recipients`}
                    {channel.type === "webhook" && "Custom webhook"}
                    {(channel.type === "slack" || channel.type === "discord") &&
                      `${channel.type} integration`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={channel.enabled}
                  onCheckedChange={() => toggleChannel(channel.id)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteChannel(channel.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Alert Channel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="channel-type">Channel Type</Label>
              <Select
                value={newChannel.type}
                onValueChange={(value: AlertChannel["type"]) =>
                  setNewChannel((prev) => ({
                    ...prev,
                    type: value,
                    config: {},
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="webhook">Webhook</SelectItem>
                  <SelectItem value="slack">Slack</SelectItem>
                  <SelectItem value="discord">Discord</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="channel-name">Channel Name</Label>
              <Input
                id="channel-name"
                placeholder="e.g., DevOps Team"
                value={newChannel.name}
                onChange={(e) =>
                  setNewChannel((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
          </div>

          <Separator />

          {getChannelFields(newChannel.type)}

          <Button onClick={addChannel} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Channel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
