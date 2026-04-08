import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, FileText, AlertCircle, Scale, Image as ImageIcon, Calendar } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export default function Agreement() {
  const [agreements, setAgreements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "agreements"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAgreements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto px-4 py-24 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 gold-text-gradient">Service Agreements</h1>
        <p className="text-muted-foreground text-lg">
          Official signed documents and standard terms for our manpower supply services.
        </p>
      </div>

      {/* Client Agreements Gallery */}
      <div className="mb-24">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <ImageIcon className="h-6 w-6 text-gold-500" /> Client Agreements
        </h2>
        
        {isLoading ? (
          <p className="text-muted-foreground">Loading agreements...</p>
        ) : agreements.length === 0 ? (
          <p className="text-muted-foreground bg-secondary/20 p-8 rounded-lg border border-gold-500/10 text-center">
            No client agreements have been uploaded yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {agreements.map((agreement) => (
              <motion.div
                key={agreement.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card className="bg-secondary/30 border-gold-500/20 overflow-hidden hover:border-gold-500/40 transition-all group">
                  <CardHeader className="border-b border-gold-500/10 bg-black/40">
                    <CardTitle className="text-lg font-bold text-gold-500 flex items-center justify-between">
                      {agreement.title}
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {agreement.createdAt?.toDate().toLocaleDateString()}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="aspect-[4/5] relative overflow-hidden bg-black">
                      <img 
                        src={agreement.imageUrl} 
                        alt={agreement.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Terms */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-secondary/50 border-gold-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gold-500">
                <FileText className="h-6 w-6" /> Terms & Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6 text-muted-foreground leading-relaxed">
              <section>
                <h3 className="text-white font-bold mb-3">1. Scope of Service</h3>
                <p>
                  Sohanur Construction & Manpower Solution agrees to provide skilled and unskilled labor as requested by the client. The specific number of workers and their roles will be defined in the project-specific work order.
                </p>
              </section>

              <section>
                <h3 className="text-white font-bold mb-3">2. Client Responsibilities</h3>
                <p>
                  The client is responsible for providing safe accommodation (থাকার জায়গা), cooking facilities (রান্নার বাবুর্চি), and necessary utilities (গ্যাস/সুবিধা) for the workers at the project site.
                </p>
              </section>

              <section>
                <h3 className="text-white font-bold mb-3">3. Payment Terms</h3>
                <p>
                  Payments must be made on a weekly basis (every 7 days). Full bill payment is required, and no dues are permitted. Failure to make payments on time may result in immediate withdrawal of manpower.
                </p>
              </section>

              <section>
                <h3 className="text-white font-bold mb-3">4. Worker Welfare</h3>
                <p>
                  Workers will bear their own food costs. The client must ensure a safe working environment that complies with local labor laws and safety standards.
                </p>
              </section>
            </CardContent>
          </Card>

          <Card className="bg-red-500/5 border-red-500/20">
            <CardContent className="p-8 flex items-start gap-4">
              <Scale className="h-8 w-8 text-red-500 shrink-0" />
              <div>
                <h3 className="text-red-500 font-bold text-xl mb-2">Legal Notice</h3>
                <p className="text-red-400/80">
                  Violation of this agreement, especially regarding non-payment or worker mistreatment, may result in immediate legal action under the laws of Bangladesh. We maintain a zero-tolerance policy for payment defaults.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <Card className="bg-gold-500 text-black">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Agreement Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6" />
                <span className="font-bold">Legally Binding</span>
              </div>
              <p className="text-sm font-medium opacity-80">
                All clients must sign a physical or digital copy of the full agreement before workers are dispatched to the site.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-secondary border-gold-500/10">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Need the PDF?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Contact our office to receive a full PDF version of the agreement with current rates.
              </p>
              <a 
                href="tel:+8801805090910" 
                className="text-gold-500 font-bold flex items-center gap-2 hover:underline"
              >
                Request PDF Agreement
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
