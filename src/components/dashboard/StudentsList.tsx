import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, Eye } from "lucide-react";
import { AddPaymentDialog } from "./AddPaymentDialog";
import { StudentDetailsDialog } from "./StudentDetailsDialog";

export function StudentsList() {
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [paymentStudent, setPaymentStudent] = useState<string | null>(null);

  const { data: students } = useQuery({
    queryKey: ["students", search],
    queryFn: async () => {
      let query = supabase
        .from("students")
        .select("*, payments(amount)")
        .eq("status", "active")
        .order("student_name");

      if (search) {
        query = query.ilike("student_name", `%${search}%`);
      }

      const { data } = await query;
      return data;
    },
  });

  const getBalance = (student: any) => {
    const totalPaid = student.payments?.reduce(
      (sum: number, p: any) => sum + Number(p.amount),
      0
    ) || 0;
    return Number(student.total_fees) - totalPaid;
  };

  const getBalanceStatus = (balance: number) => {
    if (balance <= 0) return { label: "Paid", variant: "default" as const };
    if (balance > 0 && balance < 100) return { label: "Almost Paid", variant: "secondary" as const };
    return { label: "Pending", variant: "destructive" as const };
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Students List</CardTitle>
          <CardDescription>Search and manage student payments</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Total Fees</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students?.map((student) => {
                  const totalPaid = student.payments?.reduce(
                    (sum: number, p: any) => sum + Number(p.amount),
                    0
                  ) || 0;
                  const balance = getBalance(student);
                  const status = getBalanceStatus(balance);

                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.student_name}</TableCell>
                      <TableCell>{student.class_name}</TableCell>
                      <TableCell>${Number(student.total_fees).toFixed(2)}</TableCell>
                      <TableCell>${totalPaid.toFixed(2)}</TableCell>
                      <TableCell className={balance > 0 ? "text-destructive font-semibold" : "text-green-600 font-semibold"}>
                        ${Math.abs(balance).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedStudent(student.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setPaymentStudent(student.id)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Payment
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedStudent && (
        <StudentDetailsDialog
          studentId={selectedStudent}
          open={!!selectedStudent}
          onOpenChange={(open) => !open && setSelectedStudent(null)}
        />
      )}

      {paymentStudent && (
        <AddPaymentDialog
          studentId={paymentStudent}
          open={!!paymentStudent}
          onOpenChange={(open) => !open && setPaymentStudent(null)}
        />
      )}
    </>
  );
}
