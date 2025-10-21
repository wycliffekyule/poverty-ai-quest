import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, AlertCircle } from "lucide-react";

export function DashboardStats() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [studentsRes, paymentsRes] = await Promise.all([
        supabase.from("students").select("id, total_fees, status"),
        supabase.from("payments").select("amount, student_id"),
      ]);

      const students = studentsRes.data || [];
      const payments = paymentsRes.data || [];

      const totalStudents = students.length;
      const activeStudents = students.filter((s) => s.status === "active").length;
      const totalFees = students.reduce((sum, s) => sum + Number(s.total_fees), 0);
      const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
      const totalPending = totalFees - totalPaid;
      const overdueCount = students.filter((s) => {
        const studentPayments = payments.filter((p) => p.student_id === s.id);
        const paid = studentPayments.reduce((sum, p) => sum + Number(p.amount), 0);
        return paid < Number(s.total_fees);
      }).length;

      return {
        totalStudents,
        activeStudents,
        totalFees,
        totalPaid,
        totalPending,
        overdueCount,
      };
    },
  });

  const statCards = [
    {
      title: "Total Students",
      value: stats?.totalStudents || 0,
      icon: Users,
      description: `${stats?.activeStudents || 0} active`,
    },
    {
      title: "Total Fees",
      value: `$${(stats?.totalFees || 0).toFixed(2)}`,
      icon: DollarSign,
      description: "Expected revenue",
    },
    {
      title: "Total Collected",
      value: `$${(stats?.totalPaid || 0).toFixed(2)}`,
      icon: TrendingUp,
      description: "Payments received",
    },
    {
      title: "Pending Amount",
      value: `$${(stats?.totalPending || 0).toFixed(2)}`,
      icon: AlertCircle,
      description: `${stats?.overdueCount || 0} students pending`,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
