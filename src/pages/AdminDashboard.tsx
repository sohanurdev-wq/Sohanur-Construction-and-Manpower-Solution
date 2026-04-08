import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { auth, db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, Trash2, CheckCircle, Clock, User, Briefcase, MapPin, Phone, Mail, ArrowRight, ClipboardList, Users } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) navigate("/admin/login");
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Fetch only recent ones for dashboard overview
    const qRequests = query(collection(db, "manpowerRequests"), orderBy("createdAt", "desc"), limit(5));
    const unsubRequests = onSnapshot(qRequests, (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qApps = query(collection(db, "workerApplications"), orderBy("createdAt", "desc"), limit(5));
    const unsubApps = onSnapshot(qApps, (snapshot) => {
      setApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    });

    return () => {
      unsubRequests();
      unsubApps();
    };
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold gold-text-gradient mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your manpower requests and worker applications.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" onClick={() => navigate("/admin/settings")} className="border-gold-500 text-gold-500 hover:bg-gold-500/10">
            Site Settings
          </Button>
          <Button variant="outline" onClick={() => navigate("/admin/profile")} className="border-gold-500 text-gold-500 hover:bg-gold-500/10">
            Profile Settings
          </Button>
          <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2 font-bold">
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-secondary/30 border-gold-500/10 hover:border-gold-500/30 transition-all group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-gold-500 uppercase tracking-widest">Manpower Requests</CardTitle>
              <ClipboardList className="h-5 w-5 text-gold-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">Manage Requests</div>
              <p className="text-sm text-muted-foreground mb-6">View, update, and delete manpower requests from clients.</p>
              <Button render={<Link to="/admin/requests" />} className="w-full bg-gold-500 text-black hover:bg-gold-600 font-bold">
                View All Requests <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-secondary/30 border-gold-500/10 hover:border-gold-500/30 transition-all group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-gold-500 uppercase tracking-widest">Worker Applications</CardTitle>
              <Users className="h-5 w-5 text-gold-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">Manage Applications</div>
              <p className="text-sm text-muted-foreground mb-6">Review and manage applications from workers wanting to join.</p>
              <Button render={<Link to="/admin/applications" />} className="w-full bg-gold-500 text-black hover:bg-gold-600 font-bold">
                View All Applications <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-secondary/20 border-gold-500/10">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-gold-500" /> Recent Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requests.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No recent requests.</p>
              ) : (
                requests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-gold-500/5">
                    <div>
                      <div className="font-medium text-sm">{req.clientName}</div>
                      <div className="text-xs text-muted-foreground">{req.workType}</div>
                    </div>
                    <Badge variant="outline" className="text-[10px] border-gold-500/30 text-gold-500">
                      {req.status.toUpperCase()}
                    </Badge>
                  </div>
                ))
              )}
              <Button variant="link" onClick={() => navigate("/admin/requests")} className="text-gold-500 text-xs p-0 h-auto">
                View all requests...
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/20 border-gold-500/10">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-gold-500" /> Recent Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No recent applications.</p>
              ) : (
                applications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-gold-500/5">
                    <div>
                      <div className="font-medium text-sm">{app.name}</div>
                      <div className="text-xs text-muted-foreground">{app.workType}</div>
                    </div>
                    <Badge variant="outline" className="text-[10px] border-gold-500/30 text-gold-500">
                      {app.status.toUpperCase()}
                    </Badge>
                  </div>
                ))
              )}
              <Button variant="link" onClick={() => navigate("/admin/applications")} className="text-gold-500 text-xs p-0 h-auto">
                View all applications...
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
