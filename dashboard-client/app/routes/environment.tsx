import { DashboardLayout } from "@/components/dashboard-layout";
import { EnvEditor } from "@/components/ui/env-editor";

export default function EnvironmentPage() {
  return (
    <DashboardLayout title="Environment">
      <EnvEditor />
    </DashboardLayout>
  );
}
