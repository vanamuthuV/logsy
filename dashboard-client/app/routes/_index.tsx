import { DashboardLayout } from "@/components/dashboard-layout";
import { StatCard } from "@/components/ui/stat-card";
import {    
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Activity, AlertTriangle, FileText, Server } from "lucide-react";
import { useAppSelector } from "@/hooks/hooks";


const logsOverTime = [
  { time: "00:00", logs: 120 },
  { time: "04:00", logs: 80 },
  { time: "08:00", logs: 200 },
  { time: "12:00", logs: 350 },
  { time: "16:00", logs: 280 },
  { time: "20:00", logs: 180 },
];



const chartConfig = {
  logs: {
    label: "Logs",
    color: "hsl(var(--chart-1))",
  },
};

export default function Dashboard() {

  const { logs } = useAppSelector(state => state.logs)

  const services = new Map();
  let errorlogs = 0;
  let fatalLogs = 0;
  let warningLogs = 0;
  let infoLogs = 0;

  logs.forEach((val) => {
    services.set(val.service, 0)
    if (val.level.toUpperCase() === "ERROR") errorlogs += 1;
    if (val.level.toUpperCase() === "FATAL") fatalLogs += 1;
    if (val.level.toUpperCase() === "WARN") warningLogs += 1;
    if (val.level.toUpperCase() === "INFO") infoLogs += 1;
  })

  const logLevels = [
    { name: "Info", value: infoLogs, color: "#3b82f6" },
    { name: "WARN", value: warningLogs, color: "#eab308" },
    { name: "Error", value: errorlogs, color: "#ef4444" },
    { name: "Fatal", value: fatalLogs, color: "#dc2626" },
  ];


  return (
    <DashboardLayout title="Dashboard">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Logs"
          value={logs.length}
          change="+12% from last hour"
          changeType="positive"
          icon={FileText}
        >
          <div className="h-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={logsOverTime}>
                <Area
                  type="monotone"
                  dataKey="logs"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </StatCard>

        <StatCard
          title="Active Alerts"
          value={errorlogs + fatalLogs}
          change={`${errorlogs} error, ${fatalLogs} fatal`}
          changeType="negative"
          icon={AlertTriangle}
        />

        <StatCard
          title="Services Monitored"
          value={services.size}
          change="All systems operational"
          changeType="positive"
          icon={Server}
        />

        <StatCard
          title="Uptime"
          value="99.9%"
          change="Last 30 days"
          changeType="positive"
          icon={Activity}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Logs Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={logsOverTime}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="logs"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Log Levels Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={logLevels}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {logLevels.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border rounded-lg p-2 shadow-lg">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {data.value}% (
                              {Math.round((data.value * 245.73) / 100)} logs)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {logLevels.map((level) => (
                <div key={level.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: level.color }}
                  />
                  <span className="text-sm">
                    {level.name}: {level.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
