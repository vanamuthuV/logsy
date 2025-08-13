import { DashboardLayout } from "@/components/dashboard-layout";
import { EnhancedLogTable as LogTable } from "@/components/log-table";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setMode } from "@/store/logSlice";

export default function LogsPage() {

  return (
    <DashboardLayout title="Logs">
      <LogTable />
    </DashboardLayout>
  );
}
