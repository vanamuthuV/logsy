import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Eye, EyeOff, Mail, Key } from "lucide-react";
import { toast } from "sonner";
import { EmailSubscriber, FixedEnvVar } from "@/types/type";



export function EnvEditor() {
  const [fixedEnvVars, setFixedEnvVars] = useState<FixedEnvVar[]>([
    { key: "dispatcher_email", value: "", isVisible: false },
    { key: "dispatcher_app_password", value: "", isVisible: false },
  ]);

  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([]);
  const [newSubscriber, setNewSubscriber] = useState({
    name: "",
    email: "",
    active: true,
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load data from Redis on component mount
  useEffect(() => {
    loadFromRedis();
  }, []);

  const loadFromRedis = async () => {
    setLoading(true);
    try {
      // Fetch fixed env vars
      const emailResponse = await fetch("/api/redis/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "dispatcher_email" }),
      });
      const passwordResponse = await fetch("/api/redis/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "dispatcher_app_password" }),
      });

      // Fetch subscribers
      const subscribersResponse = await fetch("/api/redis/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "email_subscribers" }),
      });

      if (emailResponse.ok) {
        const emailData = await emailResponse.json();
        if (emailData.value) {
          setFixedEnvVars((prev) =>
            prev.map((env) =>
              env.key === "dispatcher_email"
                ? { ...env, value: emailData.value }
                : env
            )
          );
        }
      }

      if (passwordResponse.ok) {
        const passwordData = await passwordResponse.json();
        if (passwordData.value) {
          setFixedEnvVars((prev) =>
            prev.map((env) =>
              env.key === "dispatcher_app_password"
                ? { ...env, value: passwordData.value }
                : env
            )
          );
        }
      }

      if (subscribersResponse.ok) {
        const subscribersData = await subscribersResponse.json();
        if (subscribersData.value) {
          try {
            let parsedSubscribers = subscribersData.value;

            // If it's a string, parse it once
            if (typeof parsedSubscribers === "string") {
              parsedSubscribers = JSON.parse(parsedSubscribers);
            }

            // If it's still a string (double-encoded), parse again
            if (typeof parsedSubscribers === "string") {
              parsedSubscribers = JSON.parse(parsedSubscribers);
            }

            // Ensure the parsed data is an array
            if (Array.isArray(parsedSubscribers)) {
              setSubscribers(parsedSubscribers);
            } else {
              console.warn(
                "Parsed subscribers data is not an array:",
                parsedSubscribers
              );
              setSubscribers([]);
            }
          } catch (parseError) {
            console.error("Error parsing subscribers JSON:", parseError);
            setSubscribers([]);
            toast.error("Failed to parse subscribers data");
          }
        } else {
          setSubscribers([]);
        }
      } else {
        setSubscribers([]);
      }
    } catch (error) {
      console.error("Error loading from Redis:", error);
      setSubscribers([]);
      toast.error("Failed to load data from Redis");
    } finally {
      setLoading(false);
    }
  };

  const saveFixedEnvVar = async (key: string, value: string) => {
    try {
      const response = await fetch("/api/redis/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });

      if (response.ok) {
        toast.success(`${key} updated successfully`);
      } else {
        toast.error(`Failed to update ${key}`);
      }
    } catch (error) {
      console.error("Error saving to Redis:", error);
      toast.error(`Failed to update ${key}`);
    }
  };

  const addSubscriber = async () => {
    if (!newSubscriber.name.trim() || !newSubscriber.email.trim()) {
      toast.error("Please enter both name and email");
      return;
    }

    if (subscribers.some((sub) => sub.email === newSubscriber.email)) {
      toast.error("Subscriber with this email already exists");
      return;
    }

    const subscriber: EmailSubscriber = {
      id: Date.now().toString(),
      name: newSubscriber.name,
      email: newSubscriber.email,
      active: newSubscriber.active,
    };

    try {
      // Fetch current subscribers, append new one, and update Redis
      const updatedSubscribers = [...subscribers, subscriber];

      const response = await fetch("/api/redis/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "email_subscribers",
          value: JSON.stringify(updatedSubscribers),
        }),
      });

      if (response.ok) {
        setSubscribers(updatedSubscribers);
        setNewSubscriber({ name: "", email: "", active: true });
        toast.success("Email subscriber added successfully");
      } else {
        toast.error("Failed to add subscriber");
      }
    } catch (error) {
      console.error("Error adding subscriber:", error);
      toast.error("Failed to add subscriber");
    }
  };

  const deleteSubscriber = async (id: string) => {
    try {
      const updatedSubscribers = subscribers.filter((sub) => sub.id !== id);

      const response = await fetch("/api/redis/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "email_subscribers",
          value: JSON.stringify(updatedSubscribers),
        }),
      });

      if (response.ok) {
        setSubscribers(updatedSubscribers);
        setDeleteConfirm(null);
        toast.success("Subscriber deleted successfully");
      } else {
        toast.error("Failed to delete subscriber");
      }
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      toast.error("Failed to delete subscriber");
    }
  };

  const toggleSubscriberActive = async (id: string) => {
    try {
      const updatedSubscribers = subscribers.map((sub) =>
        sub.id === id ? { ...sub, active: !sub.active } : sub
      );

      const response = await fetch("/api/redis/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "email_subscribers",
          value: JSON.stringify(updatedSubscribers),
        }),
      });

      if (response.ok) {
        setSubscribers(updatedSubscribers);
        toast.success("Subscriber status updated");
      } else {
        toast.error("Failed to update subscriber status");
      }
    } catch (error) {
      console.error("Error updating subscriber:", error);
      toast.error("Failed to update subscriber status");
    }
  };

  const toggleVisibility = (key: string) => {
    setFixedEnvVars((prev) =>
      prev.map((env) =>
        env.key === key ? { ...env, isVisible: !env.isVisible } : env
      )
    );
  };

  const updateFixedEnvVar = (key: string, value: string) => {
    setFixedEnvVars((prev) =>
      prev.map((env) => (env.key === key ? { ...env, value } : env))
    );
  };

  const maskValue = (value: string) => {
    return "*".repeat(Math.min(value.length, 20));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Fixed Environment Variables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Dispatcher Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fixedEnvVars.map((envVar) => (
              <div
                key={envVar.key}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">KEY</Label>
                    <Input
                      value={envVar.key}
                      disabled
                      className="font-mono bg-muted"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      VALUE
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type={envVar.isVisible ? "text" : "password"}
                        value={envVar.value}
                        onChange={(e) =>
                          updateFixedEnvVar(envVar.key, e.target.value)
                        }
                        onBlur={() => saveFixedEnvVar(envVar.key, envVar.value)}
                        className="font-mono"
                        placeholder={`Enter ${envVar.key.replace("_", " ")}...`}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleVisibility(envVar.key)}
                      >
                        {envVar.isVisible ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Subscribers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Subscribers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscribers.map((subscriber) => (
              <div
                key={subscriber.id}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      NAME
                    </Label>
                    <p className="font-medium">{subscriber.name}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      EMAIL
                    </Label>
                    <p className="font-mono text-sm">{subscriber.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor={`active-${subscriber.id}`}
                      className="text-xs"
                    >
                      Active
                    </Label>
                    <Switch
                      id={`active-${subscriber.id}`}
                      checked={subscriber.active}
                      onCheckedChange={() =>
                        toggleSubscriberActive(subscriber.id)
                      }
                    />
                  </div>
                  <Dialog
                    open={deleteConfirm === subscriber.id}
                    onOpenChange={(open) =>
                      setDeleteConfirm(open ? subscriber.id : null)
                    }
                  >
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Subscriber</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete "{subscriber.name}"
                          from the email subscribers list?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setDeleteConfirm(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => deleteSubscriber(subscriber.id)}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}

            {subscribers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No email subscribers added yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add New Subscriber */}
      <Card>
        <CardHeader>
          <CardTitle>Add Email Subscriber</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="new-name">Name</Label>
              <Input
                id="new-name"
                placeholder="Enter subscriber name"
                value={newSubscriber.name}
                onChange={(e) =>
                  setNewSubscriber((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="new-email">Email</Label>
              <Input
                id="new-email"
                type="email"
                placeholder="Enter email address"
                value={newSubscriber.email}
                onChange={(e) =>
                  setNewSubscriber((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="new-active"
              checked={newSubscriber.active}
              onCheckedChange={(checked) =>
                setNewSubscriber((prev) => ({ ...prev, active: checked }))
              }
            />
            <Label htmlFor="new-active">Active subscriber</Label>
          </div>

          <Button onClick={addSubscriber} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Email Subscriber
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
