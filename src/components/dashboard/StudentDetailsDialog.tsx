import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface StudentDetailsDialogProps {
  studentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentDetailsDialog({ studentId, open, onOpenChange }: StudentDetailsDialogProps) {
  const { data: student } = useQuery({
    queryKey: ["student-details", studentId],
    queryFn: async () => {
      const { data } = await supabase
        .from("students")
        .select("*, payments(*)")
        .eq("id", studentId)
        .single();
      return data;
    },
    enabled: !!studentId && open,
  });

  const totalPaid = student?.payments?.reduce(
    (sum: number, p: any) => sum + Number(p.amount),
    0
  ) || 0;
  const balance = student ? Number(student.total_fees) - totalPaid : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Student Details</DialogTitle>
          <DialogDescription>Complete information and payment history</DialogDescription>
        </DialogHeader>

        {student && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Student Name</p>
                <p className="font-semibold">{student.student_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Class</p>
                <p className="font-semibold">{student.class_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Parent/Guardian</p>
                <p className="font-semibold">{student.parent_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="font-semibold">{student.parent_contact || "N/A"}</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Fees</p>
                <p className="text-2xl font-bold">${Number(student.total_fees).toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Balance</p>
                <p className={`text-2xl font-bold ${balance > 0 ? 'text-destructive' : 'text-green-600'}`}>
                  ${Math.abs(balance).toFixed(2)}
                </p>
                <Badge variant={balance <= 0 ? "default" : "destructive"} className="mt-1">
                  {balance <= 0 ? "Paid" : "Pending"}
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Payment History</h3>
              {student.payments && student.payments.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {student.payments
                        .sort((a: any, b: any) => 
                          new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime()
                        )
                        .map((payment: any) => (
                          <TableRow key={payment.id}>
                            <TableCell>
                              {new Date(payment.payment_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="font-semibold">
                              ${Number(payment.amount).toFixed(2)}
                            </TableCell>
                            <TableCell>{payment.payment_method || "N/A"}</TableCell>
                            <TableCell className="max-w-xs truncate">
                              {payment.notes || "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No payments recorded yet</p>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
