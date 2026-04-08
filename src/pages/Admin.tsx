import React, { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, HardHat, LogOut, Search, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

// Mock Data
const mockRequests = [
  { id: 1, company: "ABC Builders", person: "John Doe", type: "Rod Mistry", count: 15, date: "2024-04-08" },
  { id: 2, company: "XYZ Construction", person: "Jane Smith", type: "Raj Mistry", count: 10, date: "2024-04-07" },
];

const mockWorkers = [
  { id: 1, name: "Rahim Ali", type: "Rod Mistry", exp: 5, phone: "01700000000", date: "2024-04-08" },
  { id: 2, name: "Karim Uddin", type: "Raj Mistry", exp: 8, phone: "01800000000", date: "2024-04-07" },
];

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsLoggedIn(true);
      toast.success("Welcome back, Admin!");
    } else {
      toast.error("Invalid password");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <Card className="w-full max-w-md bg-secondary border-gold-500/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold gold-text-gradient">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="bg-black border-gold-500/20"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-gold-500 text-black hover:bg-gold-600 font-bold">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-bold gold-text-gradient">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage manpower requests and worker registrations.</p>
        </div>
        <Button variant="outline" onClick={() => setIsLoggedIn(false)} className="border-red-500 text-red-500 hover:bg-red-500/10">
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </Button>
      </div>

      <Tabs defaultValue="requests" className="space-y-8">
        <TabsList className="bg-secondary border border-gold-500/20 p-1">
          <TabsTrigger value="requests" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
            <Users className="h-4 w-4 mr-2" /> Manpower Requests
          </TabsTrigger>
          <TabsTrigger value="workers" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
            <HardHat className="h-4 w-4 mr-2" /> Worker Applications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <Card className="bg-secondary border-gold-500/10">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-black/50 text-gold-500 border-b border-gold-500/10">
                    <tr>
                      <th className="px-6 py-4">Company</th>
                      <th className="px-6 py-4">Contact Person</th>
                      <th className="px-6 py-4">Work Type</th>
                      <th className="px-6 py-4">Count</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-500/5">
                    {mockRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-medium">{req.company}</td>
                        <td className="px-6 py-4">{req.person}</td>
                        <td className="px-6 py-4">{req.type}</td>
                        <td className="px-6 py-4">{req.count}</td>
                        <td className="px-6 py-4">{req.date}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Button variant="ghost" size="icon" className="text-gold-500 hover:bg-gold-500/10">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-500/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workers">
          <Card className="bg-secondary border-gold-500/10">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-black/50 text-gold-500 border-b border-gold-500/10">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Work Type</th>
                      <th className="px-6 py-4">Exp (Yrs)</th>
                      <th className="px-6 py-4">Phone</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-500/5">
                    {mockWorkers.map((worker) => (
                      <tr key={worker.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-medium">{worker.name}</td>
                        <td className="px-6 py-4">{worker.type}</td>
                        <td className="px-6 py-4">{worker.exp}</td>
                        <td className="px-6 py-4">{worker.phone}</td>
                        <td className="px-6 py-4">{worker.date}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Button variant="ghost" size="icon" className="text-gold-500 hover:bg-gold-500/10">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-500/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
