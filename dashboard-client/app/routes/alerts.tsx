import { DashboardLayout } from "@/components/dashboard-layout";
import { AlertSystem } from "@/components/alert-form";

export default function AlertsPage() {

  return (
    <DashboardLayout title="Alerts">
      <div className="space-y-6">
        <AlertSystem />
      </div>
    </DashboardLayout>
  );
}
