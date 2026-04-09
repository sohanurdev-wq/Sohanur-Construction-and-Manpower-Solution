import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HardHat, Info, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function WorkWithUs() {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workType, setWorkType] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      location: formData.get("address") as string,
      workType: workType,
      experience: formData.get("experience") as string,
      teamSize: formData.get("teamSize") as string,
      availableAnytime: (e.currentTarget.elements.namedItem("available") as HTMLInputElement)?.checked || false,
      details: formData.get("details") as string,
      status: "pending",
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "workerApplications"), data);
      
      // Send Telegram Notification
      const telegramMessage = `🟢 <b>New Worker Registration</b>\n\n` +
        `👤 <b>Name:</b> ${data.name}\n` +
        `📞 <b>Phone:</b> ${data.phone}\n` +
        `📍 <b>Address:</b> ${data.location}\n` +
        `🛠 <b>Skill:</b> ${data.workType}\n` +
        `📅 <b>Experience:</b> ${data.experience} Years\n` +
        `👥 <b>Team:</b> ${data.teamSize || "No"}\n` +
        `⚡ <b>Available Now:</b> ${data.availableAnytime ? "Yes" : "No"}\n` +
        `📝 <b>Work Details:</b> ${data.details || "N/A"}`;

      fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: telegramMessage }),
      }).catch(err => console.error("Notification failed:", err));

      toast.success("Application submitted successfully! We will contact you soon.");
      e.currentTarget.reset();
      setShowForm(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "workerApplications");
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <AnimatePresence mode="wait">
        {!showForm ? (
          <motion.div
            key="instructions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 gold-text-gradient">Worker Registration</h1>
              <p className="text-muted-foreground">Join our team of skilled construction professionals.</p>
            </div>

            <Card className="bg-secondary/50 border-gold-500/20 overflow-hidden">
              <CardHeader className="bg-gold-500/10 border-b border-gold-500/10">
                <CardTitle className="flex items-center gap-2 text-gold-500">
                  <Info className="h-5 w-5" /> Requirements & Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <ul className="space-y-4">
                  {[
                    "Must have real work experience in construction",
                    "Salary depends on skill level & work quality",
                    "Must be ready to join anytime as per project needs",
                    "If you have a team (দল), please mention the number of members",
                    "Workers must maintain discipline at the project site",
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-gold-500 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{text}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-6">
                  <Button 
                    onClick={() => setShowForm(true)} 
                    className="w-full bg-gold-500 text-black hover:bg-gold-600 font-bold h-14 text-lg"
                  >
                    I Understand & Want to Apply
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 gold-text-gradient">Worker Application Form</h1>
              <p className="text-muted-foreground">Please provide accurate information about your skills and experience.</p>
            </div>

            <Card className="bg-secondary/50 border-gold-500/20">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" placeholder="Enter your full name" required className="bg-black border-gold-500/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="+880" required className="bg-black border-gold-500/20" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" placeholder="Your current address" required className="bg-black border-gold-500/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workType">Work Type</Label>
                    <Select required onValueChange={setWorkType}>
                      <SelectTrigger className="bg-black border-gold-500/20">
                        <SelectValue placeholder="Select your skill" />
                      </SelectTrigger>
                      <SelectContent className="bg-secondary border-gold-500/20 text-white">
                        <SelectItem value="rod">Rod Mistry</SelectItem>
                        <SelectItem value="raj">Raj Mistry</SelectItem>
                        <SelectItem value="helper">Helper</SelectItem>
                        <SelectItem value="welder">Welder</SelectItem>
                        <SelectItem value="fitter">Fitter</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience (Years)</Label>
                    <Input id="experience" name="experience" type="number" min="0" placeholder="e.g. 5" required className="bg-black border-gold-500/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teamSize">Do you have a team? How many?</Label>
                    <Input id="teamSize" name="teamSize" placeholder="e.g. Yes, 5 members" className="bg-black border-gold-500/20" />
                  </div>
                  <div className="flex items-center space-x-2 pt-8">
                    <Checkbox id="available" name="available" className="border-gold-500 data-[state=checked]:bg-gold-500 data-[state=checked]:text-black" />
                    <Label htmlFor="available" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Available to join anytime?
                    </Label>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="details">Previous Work Details</Label>
                    <Textarea id="details" name="details" placeholder="List some of your previous projects or companies you worked for..." className="bg-black border-gold-500/20 min-h-[120px]" />
                  </div>
                  <div className="md:col-span-2 pt-4">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-gold-500 text-black hover:bg-gold-600 font-bold h-14 text-lg"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                    <Button 
                      type="button"
                      variant="ghost"
                      onClick={() => setShowForm(false)}
                      className="w-full mt-4 text-muted-foreground hover:text-gold-500"
                    >
                      Back to Instructions
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
