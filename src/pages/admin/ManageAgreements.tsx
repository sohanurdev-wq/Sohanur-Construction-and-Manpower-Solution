import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { auth, db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Upload, Plus, FileText, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ManageAgreements() {
  const [agreements, setAgreements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [newAgreement, setNewAgreement] = useState({ title: "", imageUrl: "" });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) navigate("/admin/login");
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const q = query(collection(db, "agreements"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAgreements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "agreements");
    });
    return () => unsubscribe();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800000) {
        toast.error("File is too large. Max 800KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAgreement({ ...newAgreement, imageUrl: reader.result as string });
        toast.success("Photo ready for upload!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAgreement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgreement.title || !newAgreement.imageUrl) {
      toast.error("Please provide both a title and an image.");
      return;
    }

    setIsUploading(true);
    try {
      await addDoc(collection(db, "agreements"), {
        ...newAgreement,
        createdAt: serverTimestamp()
      });
      setNewAgreement({ title: "", imageUrl: "" });
      toast.success("Agreement added successfully!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "agreements");
      toast.error("Failed to add agreement.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteDoc(doc(db, "agreements", deleteId));
      toast.success("Agreement deleted successfully");
      setDeleteId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `agreements/${deleteId}`);
      toast.error("Failed to delete agreement");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate("/admin/dashboard")} className="text-gold-500">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="text-3xl font-bold gold-text-gradient">Manage Agreements</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form */}
        <Card className="bg-secondary/30 border-gold-500/10 h-fit">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Plus className="h-5 w-5 text-gold-500" /> Add New Agreement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAgreement} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Agreement Title / Client Name</Label>
                <Input
                  id="title"
                  value={newAgreement.title}
                  onChange={(e) => setNewAgreement({ ...newAgreement, title: e.target.value })}
                  placeholder="e.g. Agreement with Mr. Rahim"
                  className="bg-black border-gold-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label>Agreement Photo</Label>
                <div className="flex flex-col gap-4">
                  {newAgreement.imageUrl && (
                    <img 
                      src={newAgreement.imageUrl} 
                      alt="Preview" 
                      className="max-h-40 rounded border border-gold-500/20 mx-auto"
                    />
                  )}
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="agreement-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('agreement-upload')?.click()}
                      className="w-full border-gold-500/20 text-gold-500 hover:bg-gold-500/10 flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" /> {newAgreement.imageUrl ? "Change Photo" : "Select Photo"}
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isUploading}
                className="w-full bg-gold-500 text-black hover:bg-gold-600 font-bold"
              >
                {isUploading ? "Uploading..." : "Save Agreement"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Agreements List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-gold-500" /> Existing Agreements ({agreements.length})
          </h2>
          
          {isLoading ? (
            <p className="text-muted-foreground">Loading agreements...</p>
          ) : agreements.length === 0 ? (
            <p className="text-muted-foreground">No agreements uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {agreements.map((agreement) => (
                <motion.div
                  key={agreement.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="bg-secondary/20 border-gold-500/10 overflow-hidden group">
                    <div className="aspect-[4/3] relative overflow-hidden bg-black">
                      <img 
                        src={agreement.imageUrl} 
                        alt={agreement.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => setDeleteId(agreement.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-gold-500 truncate">{agreement.title}</h3>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                        {agreement.createdAt?.toDate().toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="bg-black border-gold-500/20 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-500 flex items-center gap-2">
              <Trash2 className="h-5 w-5" /> Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <p className="text-muted-foreground">
              Are you sure you want to delete this agreement? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteId(null)} className="font-bold">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="font-bold">
              Delete Permanently
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
