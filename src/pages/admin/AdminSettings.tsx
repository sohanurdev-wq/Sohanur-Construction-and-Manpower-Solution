import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Globe, Image as ImageIcon, Type, FileText, Upload } from "lucide-react";
import { toast } from "sonner";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    siteName: "",
    agreementImage: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) navigate("/admin/login");
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "general");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data() as any);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800000) { // ~800KB limit to stay safe with Firestore 1MB limit
        toast.error("File is too large. Please use an image smaller than 800KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings({ ...settings, agreementImage: reader.result as string });
        toast.success("Photo uploaded and converted successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await setDoc(doc(db, "settings", "general"), settings);
      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate("/admin/dashboard")} className="text-gold-500">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="text-3xl font-bold gold-text-gradient">Site Settings</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="bg-secondary/30 border-gold-500/10">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Globe className="h-5 w-5 text-gold-500" /> Open Graph & SEO
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="siteName" className="flex items-center gap-2">
                  <Type className="h-4 w-4 text-gold-500" /> Website Name
                </Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  placeholder="e.g. Sohanur Construction"
                  className="bg-black border-gold-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogTitle" className="flex items-center gap-2">
                  <Type className="h-4 w-4 text-gold-500" /> OG Title
                </Label>
                <Input
                  id="ogTitle"
                  value={settings.ogTitle}
                  onChange={(e) => setSettings({ ...settings, ogTitle: e.target.value })}
                  placeholder="Title for social media shares"
                  className="bg-black border-gold-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogDescription" className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gold-500" /> OG Description
                </Label>
                <Textarea
                  id="ogDescription"
                  value={settings.ogDescription}
                  onChange={(e) => setSettings({ ...settings, ogDescription: e.target.value })}
                  placeholder="Description for social media shares"
                  className="bg-black border-gold-500/20 min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogImage" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-gold-500" /> OG Image URL (Logo)
                </Label>
                <Input
                  id="ogImage"
                  value={settings.ogImage}
                  onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="bg-black border-gold-500/20"
                />
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                  Provide a direct link to your logo image (1200x630 recommended)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="agreementImage" className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gold-500" /> Agreement Image URL (PNG)
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="agreementImage"
                    value={settings.agreementImage.startsWith('data:') ? 'Photo Uploaded (Base64)' : settings.agreementImage}
                    onChange={(e) => setSettings({ ...settings, agreementImage: e.target.value })}
                    placeholder="https://example.com/agreement.png"
                    className="bg-black border-gold-500/20"
                  />
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      className="border-gold-500/20 text-gold-500 hover:bg-gold-500/10"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                  Provide a direct link OR upload a photo (Max 800KB)
                </p>
              </div>

              {(settings.ogImage || settings.agreementImage) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {settings.ogImage && (
                    <div className="p-4 bg-black/40 rounded-lg border border-gold-500/10">
                      <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">OG Preview:</p>
                      <img 
                        src={settings.ogImage} 
                        alt="OG Preview" 
                        className="max-h-40 rounded border border-gold-500/20 mx-auto"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                  {settings.agreementImage && (
                    <div className="p-4 bg-black/40 rounded-lg border border-gold-500/10">
                      <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">Agreement Preview:</p>
                      <img 
                        src={settings.agreementImage} 
                        alt="Agreement Preview" 
                        className="max-h-40 rounded border border-gold-500/20 mx-auto"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSaving}
                className="w-full bg-gold-500 text-black hover:bg-gold-600 font-bold h-12"
              >
                {isSaving ? "Saving..." : (
                  <span className="flex items-center gap-2">
                    <Save className="h-5 w-5" /> Save Settings
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
