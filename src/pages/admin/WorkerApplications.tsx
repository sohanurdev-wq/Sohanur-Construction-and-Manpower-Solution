import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { auth, db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Eye, CheckCircle, Clock, Phone, User, Briefcase, MapPin, Star } from "lucide-react";
import { toast } from "sonner";

export default function WorkerApplications() {
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
    const q = query(collection(db, "workerApplications"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      await deleteDoc(doc(db, "workerApplications", id));
      toast.success("Application deleted successfully");
    } catch (error) {
      toast.error("Failed to delete application");
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "workerApplications", id), { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate("/admin/dashboard")} className="text-gold-500">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="text-3xl font-bold gold-text-gradient">Worker Applications</h1>
      </div>

      <Card className="bg-secondary/30 border-gold-500/10 overflow-hidden">
        <CardHeader className="border-b border-gold-500/10">
          <CardTitle className="text-xl">All Applications ({applications.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-black/40">
                <TableRow className="border-gold-500/10">
                  <TableHead className="text-gold-500">Date</TableHead>
                  <TableHead className="text-gold-500">Worker Name</TableHead>
                  <TableHead className="text-gold-500">Work Type</TableHead>
                  <TableHead className="text-gold-500">Experience</TableHead>
                  <TableHead className="text-gold-500">Status</TableHead>
                  <TableHead className="text-gold-500 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      Loading applications...
                    </TableCell>
                  </TableRow>
                ) : applications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No applications found.
                    </TableCell>
                  </TableRow>
                ) : (
                  applications.map((app) => (
                    <TableRow key={app.id} className="border-gold-500/5 hover:bg-gold-500/5 transition-colors">
                      <TableCell className="whitespace-nowrap">
                        {app.createdAt?.toDate().toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{app.name}</div>
                        <div className="text-xs text-muted-foreground">{app.phone}</div>
                      </TableCell>
                      <TableCell>{app.workType}</TableCell>
                      <TableCell>{app.experience} Years</TableCell>
                      <TableCell>
                        <Badge className={app.status === 'hired' ? 'bg-green-500' : 'bg-gold-500 text-black'}>
                          {app.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger
                              render={
                                <Button variant="ghost" size="icon" className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              }
                            />
                            <DialogContent className="bg-black border-gold-500/20 text-white max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-bold gold-text-gradient">Application Details</DialogTitle>
                              </DialogHeader>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-xs text-gold-500 uppercase tracking-widest font-bold">Full Name</label>
                                    <p className="text-lg">{app.name}</p>
                                  </div>
                                  <div>
                                    <label className="text-xs text-gold-500 uppercase tracking-widest font-bold">Phone Number</label>
                                    <p className="text-lg flex items-center gap-2">
                                      <Phone className="h-4 w-4 text-gold-500" /> {app.phone}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-xs text-gold-500 uppercase tracking-widest font-bold">Location</label>
                                    <p className="text-lg flex items-center gap-2">
                                      <MapPin className="h-4 w-4 text-gold-500" /> {app.location}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-xs text-gold-500 uppercase tracking-widest font-bold">Team Size</label>
                                    <p className="text-lg">{app.teamSize || "Individual"}</p>
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-xs text-gold-500 uppercase tracking-widest font-bold">Work Type</label>
                                    <p className="text-lg flex items-center gap-2">
                                      <Briefcase className="h-4 w-4 text-gold-500" /> {app.workType}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-xs text-gold-500 uppercase tracking-widest font-bold">Experience</label>
                                    <p className="text-lg flex items-center gap-2">
                                      <Star className="h-4 w-4 text-gold-500" /> {app.experience} Years
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-xs text-gold-500 uppercase tracking-widest font-bold">Status</label>
                                    <div className="mt-1">
                                      <Badge className={app.status === 'hired' ? 'bg-green-500' : 'bg-gold-500 text-black'}>
                                        {app.status.toUpperCase()}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-xs text-gold-500 uppercase tracking-widest font-bold">Applied On</label>
                                    <p className="text-lg">{app.createdAt?.toDate().toLocaleString()}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-end gap-3 pt-4 border-t border-gold-500/10">
                                {app.status !== 'hired' && (
                                  <Button 
                                    onClick={() => handleUpdateStatus(app.id, 'hired')}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" /> Mark as Hired
                                  </Button>
                                )}
                                <Button 
                                  variant="destructive" 
                                  onClick={() => {
                                    handleDelete(app.id);
                                  }}
                                  className="font-bold"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                            onClick={() => handleDelete(app.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
