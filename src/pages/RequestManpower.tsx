import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Info, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function RequestManpower() {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workType, setWorkType] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget; // Capture the form element
    setIsSubmitting(true);
    
    const formData = new FormData(form);
    const data = {
      companyName: formData.get("companyName") as string,
      clientName: formData.get("contactPerson") as string,
      phone: formData.get("phone") as string,
      location: formData.get("location") as string,
      workType: workType,
      workerCount: Number(formData.get("workersNeeded")),
      duration: formData.get("duration") as string,
      accommodation: (form.elements.namedItem("accommodation") as HTMLInputElement)?.checked || false,
      description: formData.get("details") as string,
      status: "pending",
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "manpowerRequests"), data);
      
      // Send Telegram Notification
      const telegramMessage = `🚨 <b>New Manpower Request</b>\n\n` +
        `🏢 <b>Company:</b> ${data.companyName}\n` +
        `👤 <b>Contact:</b> ${data.clientName}\n` +
        `📞 <b>Phone:</b> ${data.phone}\n` +
        `📍 <b>Location:</b> ${data.location}\n` +
        `🛠 <b>Work Type:</b> ${data.workType}\n` +
        `👷 <b>Workers:</b> ${data.workerCount}\n` +
        `⏳ <b>Duration:</b> ${data.duration}\n` +
        `🏠 <b>Accommodation:</b> ${data.accommodation ? "Yes" : "No"}\n` +
        `📝 <b>Details:</b> ${data.description || "N/A"}`;

      fetch("/.netlify/functions/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: telegramMessage }),
      })
      .then(async res => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Server Error: ${res.status} - ${errorText}`);
        }
        return res.json();
      })
      .then(data => console.log("Telegram Notification sent successfully:", data))
      .catch(err => {
        console.error("Telegram Notification failed:", err);
        toast.error("Admin notification failed, but your request was saved.");
        
        // Fallback for local/AI Studio dev
        fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: telegramMessage }),
        }).catch(e => console.error("API Fallback also failed. Ensure you have deployed the 'netlify' folder and set Environment Variables in Netlify.", e));
      });

      toast.success("Request submitted successfully! We will contact you soon.");
      form.reset(); // Use the captured form element
      setShowForm(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "manpowerRequests");
      toast.error("Failed to submit request. Please try again.");
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
              <h1 className="text-4xl font-bold mb-4 gold-text-gradient">Manpower Request Instructions</h1>
              <p className="text-muted-foreground">Please read the following terms carefully before submitting your request.</p>
            </div>

            <Card className="bg-secondary/50 border-gold-500/20 overflow-hidden">
              <CardHeader className="bg-gold-500/10 border-b border-gold-500/10">
                <CardTitle className="flex items-center gap-2 text-gold-500">
                  <Info className="h-5 w-5" /> Important Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <ul className="space-y-4">
                  {[
                    "All manpower rates are discussion-based (project-wise)",
                    "Client must sign agreement before work starts",
                    "Company must be registered and verified",
                    "Client must provide: থাকার জায়গা (Accommodation), রান্নার বাবুর্চি (Cook), গ্যাস/সুবিধা (Gas/Utilities)",
                    "Workers will only bear their food cost",
                    "Weekly payment system (7 days full bill payment)",
                    "No due allowed under any circumstances",
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-gold-500 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{text}</span>
                    </li>
                  ))}
                </ul>

                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">
                    Legal action will be taken if payment issues occur or agreement is violated.
                  </p>
                </div>

                <div className="pt-6">
                  <Button 
                    onClick={() => setShowForm(true)} 
                    className="w-full bg-gold-500 text-black hover:bg-gold-600 font-bold h-14 text-lg"
                  >
                    I Agree & Continue to Form
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
              <h1 className="text-4xl font-bold mb-4 gold-text-gradient">Request Manpower</h1>
              <p className="text-muted-foreground">Fill out the form below and we will get back to you with a quote.</p>
            </div>

            <Card className="bg-secondary/50 border-gold-500/20">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" name="companyName" placeholder="Enter your company name" required className="bg-black border-gold-500/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person Name</Label>
                    <Input id="contactPerson" name="contactPerson" placeholder="Full name" required className="bg-black border-gold-500/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="+880" required className="bg-black border-gold-500/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Project Location</Label>
                    <Input id="location" name="location" placeholder="City/Area" required className="bg-black border-gold-500/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workType">Type of Work</Label>
                    <Select required onValueChange={setWorkType}>
                      <SelectTrigger className="bg-black border-gold-500/20">
                        <SelectValue placeholder="Select work type" />
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
                    <Label htmlFor="workersNeeded">Number of Workers Needed</Label>
                    <Input id="workersNeeded" name="workersNeeded" type="number" min="1" placeholder="e.g. 10" required className="bg-black border-gold-500/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Project Duration</Label>
                    <Input id="duration" name="duration" placeholder="e.g. 3 Months" required className="bg-black border-gold-500/20" />
                  </div>
                  <div className="flex items-center space-x-2 pt-8">
                    <Checkbox id="accommodation" name="accommodation" className="border-gold-500 data-[state=checked]:bg-gold-500 data-[state=checked]:text-black" />
                    <Label htmlFor="accommodation" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Accommodation Available?
                    </Label>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="details">Message/Additional Details</Label>
                    <Textarea id="details" name="details" placeholder="Tell us more about your project requirements..." className="bg-black border-gold-500/20 min-h-[120px]" />
                  </div>
                  <div className="md:col-span-2 pt-4">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-gold-500 text-black hover:bg-gold-600 font-bold h-14 text-lg"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Request"}
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
