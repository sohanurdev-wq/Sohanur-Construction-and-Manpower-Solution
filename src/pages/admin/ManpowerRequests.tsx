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
import { ArrowLeft, Trash2, Eye, CheckCircle, Clock, Phone, User, Briefcase, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function ManpowerRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) navigate("/admin/login");
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const q = query(collection(db, "manpowerRequests"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      await deleteDoc(doc(db, "manpowerRequests", id));
      toast.success("Request deleted successfully");
    } catch (error) {
      toast.error("Failed to delete request");
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "manpowerRequests", id), { status: newStatus });
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
        <h1 className="text-3xl font-bold gold-text-gradient">Manpower Requests</h1>
      </div>

      <Card className="bg-secondary/30 border-gold-500/10 overflow-hidden">
        <CardHeader className="border-b border-gold-500/10">
          <CardTitle className="text-xl">All Requests ({requests.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-black/40">
                <TableRow className="border-gold-500/10">
                  <TableHead className="text-gold-500">Date</TableHead>
                  <TableHead className="text-gold-500">Client/Company</TableHead>
                  <TableHead className="text-gold-500">Work Type</TableHead>
                  <TableHead className="text-gold-500">Count</TableHead>
                  <TableHead className="text-gold-500">Status</TableHead>
                  <TableHead className="text-gold-500 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      Loading requests...
                    </TableCell>
                  </TableRow>
                ) : requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((req) => (
                    <TableRow key={req.id} className="border-gold-500/5 hover:bg-gold-500/5 transition-colors">
                      <TableCell className="whitespace-nowrap">
                        {req.createdAt?.toDate().toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{req.clientName}</div>
                        <div className="text-xs text-muted-foreground">{req.companyName}</div>
                      </TableCell>
                      <TableCell>{req.workType}</TableCell>
                      <TableCell>{req.workerCount}</TableCell>
                      <TableCell>
                        <Badge className={req.status === 'completed' ? 'bg-green-500' : 'bg-gold-500 text-black'}>
                          {req.status.toUpperCase()}
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
                                <DialogTitle className="text-2xl font-bold gold-text-gradient">Request Details</DialogTitle>
                              </DialogHeader>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-xs text-gold-500 uppercase tracking-widest font-bold">Client Name</label>
                                    <p className="text-lg">{req.clientName}</p>
                                  </div>
                                  <div>
                                    <label className="text-xs text-gold-500 uppercase tracking-widest font-bold">Company</label>
                                    <p className="text-lg">{req.companyName || "N/A"}</p>
                                  </div>
                                  <div>
                                    <label className="text-xs text-gold-500 uppercase tracking-widest font-bold">Phone</label>
                                    <p className="text-lg flex items-center gap-2">
                                      <Phone className="h-4 w-4 text-gold-500" /> {req.phone}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-xs text-gold-500 uppercase tracking-widest font-bold">Location</label>
                                    <p className="text-lg flex items-center gap-2">
                                      <MapPin className="h-4 w-4 text-gold-500" /> {req.location}
                                    </p>
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-xs text-gold-500 uppercase tracking-widest font-bold">Work Type</label>
                                    <p className="text-lg flex items-center gap-2">
                                      <Briefcase className="h-4 w-4 text-gold-500" /> {req.workType}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-xs text-gold-500 uppercase tracking-widest font-bold">Worker Count</label>
                                    <p className="text-lg">{req.workerCount}</p>
                                  </div>
                                  <div>
                                    <label className="text-xs text-gold-500 uppercase tracking-widest font-bold">Status</label>
                                    <div className="mt-1">
                                      <Badge className={req.status === 'completed' ? 'bg-green-500' : 'bg-gold-500 text-black'}>
                                        {req.status.toUpperCase()}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-xs text-gold-500 uppercase tracking-widest font-bold">Date Submitted</label>
                                    <p className="text-lg">{req.createdAt?.toDate().toLocaleString()}</p>
                                  </div>
                                </div>
                                <div className="md:col-span-2">
                                  <label className="text-xs text-gold-500 uppercase tracking-widest font-bold">Description / Notes</label>
                                  <p className="text-muted-foreground bg-white/5 p-4 rounded-lg mt-2 leading-relaxed">
                                    {req.description || "No additional notes provided."}
                                  </p>
                                </div>
                              </div>
                              <div className="flex justify-end gap-3 pt-4 border-t border-gold-500/10">
                                {req.status !== 'completed' && (
                                  <Button 
                                    onClick={() => handleUpdateStatus(req.id, 'completed')}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" /> Mark Completed
                                  </Button>
                                )}
                                <Button 
                                  variant="destructive" 
                                  onClick={() => {
                                    handleDelete(req.id);
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
                            onClick={() => handleDelete(req.id)}
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
