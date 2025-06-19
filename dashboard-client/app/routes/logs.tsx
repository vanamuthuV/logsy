import { DashboardLayout } from "@/components/dashboard-layout";
import { LogTable } from "@/components/ui/log-table";

export default function LogsPage() {
  return (
    <DashboardLayout title="Logs">
      <LogTable />
    </DashboardLayout>
  );
}
