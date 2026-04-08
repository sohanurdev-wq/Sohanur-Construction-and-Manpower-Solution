/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { WhatsAppButton, CallButton } from "./components/ui/FloatingButtons";
import { Toaster } from "./components/ui/sonner";

// Lazy load pages
import Home from "./pages/Home";
import RequestManpower from "./pages/RequestManpower";
import WorkWithUs from "./pages/WorkWithUs";
import Projects from "./pages/Projects";
import Agreement from "./pages/Agreement";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProfile from "./pages/AdminProfile";
import ManpowerRequests from "./pages/admin/ManpowerRequests";
import WorkerApplications from "./pages/admin/WorkerApplications";
import AdminSettings from "./pages/admin/AdminSettings";

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col bg-black text-white selection:bg-gold-500 selection:text-black">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/request-manpower" element={<RequestManpower />} />
            <Route path="/work-with-us" element={<WorkWithUs />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/agreement" element={<Agreement />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/requests" element={<ManpowerRequests />} />
            <Route path="/admin/applications" element={<WorkerApplications />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
        <CallButton />
        <Toaster position="top-center" expand={false} richColors />
      </div>
    </Router>
  );
}
