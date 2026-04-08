import React, { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth, db } from "@/lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Lock, LogIn } from "lucide-react";

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Strict email check as requested
      if (user.email !== "mdsohank361@gmail.com") {
        await auth.signOut();
        toast.error("Access denied. Only mdsohank361@gmail.com is allowed.");
        setIsLoading(false);
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists() && userDoc.data().role === "admin") {
        toast.success("Welcome, Admin!");
        navigate("/admin/dashboard");
      } else {
        // Fallback for bootstrap admin if doc doesn't exist yet
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          role: "admin",
          uid: user.uid,
          createdAt: serverTimestamp()
        });
        toast.success("Welcome, Admin (Profile Initialized)!");
        navigate("/admin/dashboard");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message || "Google Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24 flex justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="bg-secondary/50 border-gold-500/20">
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 mb-4">
              <Lock className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold gold-text-gradient">
              Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-muted-foreground text-sm">
              Please login with your authorized Google account to access the dashboard.
            </p>
            
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white text-black hover:bg-gray-100 font-bold h-12 flex items-center justify-center gap-3"
            >
              <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="Google" 
                className="h-5 w-5"
                referrerPolicy="no-referrer"
              />
              {isLoading ? "Logging in..." : "Login with Google"}
            </Button>

            <div className="pt-4 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                Authorized Access Only
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
