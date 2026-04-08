import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { User, Mail, ArrowLeft, LogOut } from "lucide-react";
import { toast } from "sonner";

export default function AdminProfile() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) navigate("/admin/login");
      else setUser(user);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success("Logged out successfully");
      navigate("/admin/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Button 
          variant="ghost" 
          onClick={() => navigate("/admin/dashboard")} 
          className="mb-6 text-gold-500 hover:text-gold-400"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>

        <Card className="bg-secondary/50 border-gold-500/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold gold-text-gradient flex items-center gap-2">
              <User className="h-6 w-6" /> Admin Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4 py-4">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="h-20 w-20 rounded-full border-2 border-gold-500"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 border-2 border-gold-500">
                  <User className="h-10 w-10" />
                </div>
              )}
              <div className="text-center">
                <h3 className="text-xl font-bold">{user.displayName || "Administrator"}</h3>
                <p className="text-muted-foreground flex items-center justify-center gap-2 mt-1">
                  <Mail className="h-4 w-4" /> {user.email}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-gold-500/10">
              <p className="text-xs text-center text-muted-foreground mb-6">
                Account managed via Google Login. To change your profile details or security settings, please visit your Google Account.
              </p>
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="w-full font-bold h-12 flex items-center justify-center gap-2"
              >
                <LogOut className="h-5 w-5" /> Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
