import { DashboardLayout } from "@/components/dashboard-layout";
import { EnvEditor } from "@/components/env-editor";

export default function EnvironmentPage() {
  return (
    <DashboardLayout title="Environment">
      <EnvEditor />
    </DashboardLayout>
  );
}
