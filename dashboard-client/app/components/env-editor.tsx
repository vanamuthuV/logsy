"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Trash2, Eye, EyeOff, Key, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface EnvVariable {
  id: string;
  key: string;
  value: string;
  isSensitive: boolean;
  isVisible: boolean;
}

const mockEnvVars: EnvVariable[] = [
  {
    id: "1",
    key: "DATABASE_URL",
    value: "postgresql://user:pass@localhost:5432/logsy",
    isSensitive: true,
    isVisible: false,
  },
  {
    id: "2",
    key: "API_KEY",
    value: "sk-1234567890abcdef",
    isSensitive: true,
    isVisible: false,
  },
  {
    id: "3",
    key: "LOG_LEVEL",
    value: "info",
    isSensitive: false,
    isVisible: true,
  },
  {
    id: "4",
    key: "PORT",
    value: "3000",
    isSensitive: false,
    isVisible: true,
  },
];

export function EnvEditor() {
  const [envVars, setEnvVars] = useState<EnvVariable[]>(mockEnvVars);
  const [newVar, setNewVar] = useState({
    key: "",
    value: "",
    isSensitive: false,
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const addEnvVar = () => {
    if (!newVar.key.trim() || !newVar.value.trim()) {
      toast.error("Please enter both key and value");
      return;
    }

    if (envVars.some((v) => v.key === newVar.key)) {
      toast.error("Environment variable with this key already exists");
      return;
    }

    const envVar: EnvVariable = {
      id: Date.now().toString(),
      key: newVar.key,
      value: newVar.value,
      isSensitive: newVar.isSensitive || isSensitiveKey(newVar.key),
      isVisible: !newVar.isSensitive && !isSensitiveKey(newVar.key),
    };

    setEnvVars((prev) => [...prev, envVar]);
    setNewVar({ key: "", value: "", isSensitive: false });
    toast.success("Environment variable added");
  };

  const deleteEnvVar = (id: string) => {
    setEnvVars((prev) => prev.filter((v) => v.id !== id));
    setDeleteConfirm(null);
    toast.success("Environment variable deleted");
  };

  const toggleVisibility = (id: string) => {
    setEnvVars((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isVisible: !v.isVisible } : v))
    );
  };

  const updateEnvVar = (id: string, updates: Partial<EnvVariable>) => {
    setEnvVars((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
  };

  const isSensitiveKey = (key: string) => {
    const sensitivePatterns = [
      /password/i,
      /secret/i,
      /key/i,
      /token/i,
      /auth/i,
      /credential/i,
    ];
    return sensitivePatterns.some((pattern) => pattern.test(key));
  };

  const maskValue = (value: string) => {
    return "*".repeat(Math.min(value.length, 20));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Environment Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {envVars.map((envVar) => (
              <div
                key={envVar.id}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">KEY</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={envVar.key}
                        onChange={(e) =>
                          updateEnvVar(envVar.id, { key: e.target.value })
                        }
                        className="font-mono"
                      />
                      {envVar.isSensitive && (
                        <Badge variant="secondary" className="shrink-0">
                          <Key className="h-3 w-3 mr-1" />
                          Sensitive
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      VALUE
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type={envVar.isVisible ? "text" : "password"}
                        value={
                          envVar.isVisible
                            ? envVar.value
                            : maskValue(envVar.value)
                        }
                        onChange={(e) =>
                          updateEnvVar(envVar.id, { value: e.target.value })
                        }
                        className="font-mono"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleVisibility(envVar.id)}
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
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor={`sensitive-${envVar.id}`}
                      className="text-xs"
                    >
                      Sensitive
                    </Label>
                    <Switch
                      id={`sensitive-${envVar.id}`}
                      checked={envVar.isSensitive}
                      onCheckedChange={(checked) =>
                        updateEnvVar(envVar.id, {
                          isSensitive: checked,
                          isVisible: checked ? false : envVar.isVisible,
                        })
                      }
                    />
                  </div>
                  <Dialog
                    open={deleteConfirm === envVar.id}
                    onOpenChange={(open) =>
                      setDeleteConfirm(open ? envVar.id : null)
                    }
                  >
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Environment Variable</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete the environment
                          variable "{envVar.key}"? This action cannot be undone.
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
                          onClick={() => deleteEnvVar(envVar.id)}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Environment Variable</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="new-key">Key</Label>
              <Input
                id="new-key"
                placeholder="e.g., DATABASE_URL"
                value={newVar.key}
                onChange={(e) =>
                  setNewVar((prev) => ({ ...prev, key: e.target.value }))
                }
                className="font-mono"
              />
            </div>
            <div>
              <Label htmlFor="new-value">Value</Label>
              <Input
                id="new-value"
                placeholder="Enter value"
                value={newVar.value}
                onChange={(e) =>
                  setNewVar((prev) => ({ ...prev, value: e.target.value }))
                }
                className="font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="new-sensitive"
              checked={newVar.isSensitive || isSensitiveKey(newVar.key)}
              onCheckedChange={(checked) =>
                setNewVar((prev) => ({ ...prev, isSensitive: checked }))
              }
            />
            <Label htmlFor="new-sensitive">Mark as sensitive</Label>
            {isSensitiveKey(newVar.key) && (
              <Badge variant="secondary" className="ml-2">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Auto-detected as sensitive
              </Badge>
            )}
          </div>

          <Button onClick={addEnvVar} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Environment Variable
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
