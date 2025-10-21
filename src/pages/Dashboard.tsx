import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { GraduationCap, LogOut, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { StudentsList } from "@/components/dashboard/StudentsList";
import { AddStudentDialog } from "@/components/dashboard/AddStudentDialog";
import { ClassSummary } from "@/components/dashboard/ClassSummary";

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAddStudent, setShowAddStudent] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">School Funds Manager</h1>
              <p className="text-sm text-muted-foreground">Student Payment Tracking</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowAddStudent(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <DashboardStats />
        <ClassSummary />
        <StudentsList />
      </main>

      <AddStudentDialog open={showAddStudent} onOpenChange={setShowAddStudent} />
    </div>
  );
}
