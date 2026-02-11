import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getChartData, CHART_MONTHS } from "@/data/mockData";
import { useState, useMemo } from "react";
import { CalendarDays, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Props {
  onDateClick: (date: string) => void;
  onStatusClick?: (status: string) => void;
}

type Period = "weekly" | "monthly";

export default function ActivityChart({ onDateClick, onStatusClick }: Props) {
  const [period, setPeriod] = useState<Period>("weekly");
  const [selectedMonth, setSelectedMonth] = useState(CHART_MONTHS[0].value);
  const [monthOpen, setMonthOpen] = useState(false);

  const source = useMemo(() => getChartData(period, selectedMonth), [period, selectedMonth]);
  const monthLabel = CHART_MONTHS.find(m => m.value === selectedMonth)?.label || selectedMonth;

  const data = source.labels.map((label, i) => ({
    name: label,
    date: source.dates[i],
    Upload: source.uploads[i],
    Disetujui: source.disetujui[i],
    Ditolak: source.ditolak[i],
    Menunggu: source.menunggu[i],
  }));

  const handleClick = (payload: any) => {
    if (payload?.activePayload?.[0]) {
      onDateClick(payload.activePayload[0].payload.date);
    }
  };

  const handleLegendClick = (e: any) => {
    if (onStatusClick && e?.value) {
      onStatusClick(e.value);
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">📈 Aktivitas {period === "weekly" ? "Mingguan" : "Bulanan"}</h3>
          <p className="text-xs text-muted-foreground">Klik pada titik grafik untuk melihat dokumen, klik legend untuk filter status</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Popover open={monthOpen} onOpenChange={setMonthOpen}>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-1.5 border border-border rounded-md px-2.5 py-1.5 hover:bg-muted transition-colors">
                <CalendarDays size={14} className="text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">{monthLabel}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-1 z-50 bg-popover" align="end" sideOffset={4}>
              {CHART_MONTHS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => { setSelectedMonth(m.value); setMonthOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-md transition-colors ${
                    selectedMonth === m.value
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {m.label}
                  {selectedMonth === m.value && <Check size={14} />}
                </button>
              ))}
            </PopoverContent>
          </Popover>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => setPeriod("weekly")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${period === "weekly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Mingguan
            </button>
            <button
              onClick={() => setPeriod("monthly")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${period === "monthly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Bulanan
            </button>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} onClick={handleClick} style={{ cursor: "pointer" }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(350 15% 90%)" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(0 0% 49%)" angle={-25} textAnchor="end" height={60} interval={period === "monthly" ? 2 : 0} />
          <YAxis tick={{ fontSize: 12 }} stroke="hsl(0 0% 49%)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(0 0% 100%)",
              border: "1px solid hsl(350 15% 90%)",
              borderRadius: "8px",
              fontSize: "13px",
            }}
          />
          <Legend onClick={handleLegendClick} wrapperStyle={{ cursor: "pointer" }} />
          <Line type="monotone" dataKey="Upload" stroke="hsl(352 48% 28%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(352 48% 28%)" }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="Disetujui" stroke="hsl(155 54% 40%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(155 54% 40%)" }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="Ditolak" stroke="hsl(0 84% 60%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(0 84% 60%)" }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="Menunggu" stroke="hsl(35 86% 59%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(35 86% 59%)" }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
