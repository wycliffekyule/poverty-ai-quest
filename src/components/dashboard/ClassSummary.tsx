import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ClassSummary() {
  const { data: classSummary } = useQuery({
    queryKey: ["class-summary"],
    queryFn: async () => {
      const { data: students } = await supabase
        .from("students")
        .select("class_name, total_fees, payments(amount)")
        .eq("status", "active");

      if (!students) return [];

      const summaryMap = new Map();

      students.forEach((student) => {
        const className = student.class_name;
        const totalPaid = student.payments?.reduce(
          (sum: number, p: any) => sum + Number(p.amount),
          0
        ) || 0;

        if (!summaryMap.has(className)) {
          summaryMap.set(className, {
            className,
            studentCount: 0,
            totalFees: 0,
            totalPaid: 0,
          });
        }

        const summary = summaryMap.get(className);
        summary.studentCount += 1;
        summary.totalFees += Number(student.total_fees);
        summary.totalPaid += totalPaid;
      });

      return Array.from(summaryMap.values()).sort((a, b) =>
        a.className.localeCompare(b.className)
      );
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class-wise Summary</CardTitle>
        <CardDescription>Overview of payments by class</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Total Fees</TableHead>
                <TableHead>Total Paid</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Collection %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classSummary?.map((summary) => {
                const balance = summary.totalFees - summary.totalPaid;
                const collectionPercent = summary.totalFees > 0
                  ? (summary.totalPaid / summary.totalFees) * 100
                  : 0;

                return (
                  <TableRow key={summary.className}>
                    <TableCell className="font-medium">{summary.className}</TableCell>
                    <TableCell>{summary.studentCount}</TableCell>
                    <TableCell>${summary.totalFees.toFixed(2)}</TableCell>
                    <TableCell>${summary.totalPaid.toFixed(2)}</TableCell>
                    <TableCell className={balance > 0 ? "text-destructive font-semibold" : "text-green-600"}>
                      ${balance.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(collectionPercent, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium min-w-[3rem] text-right">
                          {collectionPercent.toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
