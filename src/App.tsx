import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { RouteGuard } from "@/components/auth/RouteGuard";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Patient Pages
import PatientDashboard from "./pages/patient/Dashboard";

// Doctor Pages  
import DoctorDashboard from "./pages/doctor/Dashboard";

// Lab Pages
import LabDashboard from "./pages/lab/Dashboard";

// Other Pages
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/auth/login" replace />} />

          {/* Auth Routes - No Shell */}
          <Route path="/auth/login" element={
            <RouteGuard requireAuth={false}>
              <Login />
            </RouteGuard>
          } />
          <Route path="/auth/register" element={
            <RouteGuard requireAuth={false}>
              <Register />
            </RouteGuard>
          } />

          {/* Patient Portal */}
          <Route path="/patient" element={
            <RouteGuard requiredRole="patient">
              <AppShell>
                <PatientDashboard />
              </AppShell>
            </RouteGuard>
          } />
          <Route path="/patient/treatments" element={
            <RouteGuard requiredRole="patient">
              <AppShell>
                <div className="p-8 text-center">Treatments page coming soon...</div>
              </AppShell>
            </RouteGuard>
          } />
          <Route path="/patient/reports" element={
            <RouteGuard requiredRole="patient">
              <AppShell>
                <div className="p-8 text-center">Reports page coming soon...</div>
              </AppShell>
            </RouteGuard>
          } />
          <Route path="/patient/consents" element={
            <RouteGuard requiredRole="patient">
              <AppShell>
                <div className="p-8 text-center">Consents page coming soon...</div>
              </AppShell>
            </RouteGuard>
          } />
          <Route path="/patient/alerts" element={
            <RouteGuard requiredRole="patient">
              <AppShell>
                <div className="p-8 text-center">Alerts page coming soon...</div>
              </AppShell>
            </RouteGuard>
          } />
          <Route path="/patient/schemes" element={
            <RouteGuard requiredRole="patient">
              <AppShell>
                <div className="p-8 text-center">Schemes page coming soon...</div>
              </AppShell>
            </RouteGuard>
          } />
          <Route path="/patient/profile" element={
            <RouteGuard requiredRole="patient">
              <AppShell>
                <div className="p-8 text-center">Profile page coming soon...</div>
              </AppShell>
            </RouteGuard>
          } />

          {/* Doctor Portal */}
          <Route path="/doctor" element={
            <RouteGuard requiredRole="doctor">
              <AppShell>
                <DoctorDashboard />
              </AppShell>
            </RouteGuard>
          } />
          <Route path="/doctor/new-patient" element={
            <RouteGuard requiredRole="doctor">
              <AppShell>
                <div className="p-8 text-center">New Patient page coming soon...</div>
              </AppShell>
            </RouteGuard>
          } />
          <Route path="/doctor/patients" element={
            <RouteGuard requiredRole="doctor">
              <AppShell>
                <div className="p-8 text-center">Patients page coming soon...</div>
              </AppShell>
            </RouteGuard>
          } />
          <Route path="/doctor/episodes" element={
            <RouteGuard requiredRole="doctor">
              <AppShell>
                <div className="p-8 text-center">Episodes page coming soon...</div>
              </AppShell>
            </RouteGuard>
          } />
          <Route path="/doctor/profile" element={
            <RouteGuard requiredRole="doctor">
              <AppShell>
                <div className="p-8 text-center">Profile page coming soon...</div>
              </AppShell>
            </RouteGuard>
          } />

          {/* Lab Portal */}
          <Route path="/lab" element={
            <RouteGuard requiredRole="lab">
              <AppShell>
                <LabDashboard />
              </AppShell>
            </RouteGuard>
          } />
          <Route path="/lab/new-patient" element={
            <RouteGuard requiredRole="lab">
              <AppShell>
                <div className="p-8 text-center">New Patient page coming soon...</div>
              </AppShell>
            </RouteGuard>
          } />
          <Route path="/lab/reports" element={
            <RouteGuard requiredRole="lab">
              <AppShell>
                <div className="p-8 text-center">Reports page coming soon...</div>
              </AppShell>
            </RouteGuard>
          } />
          <Route path="/lab/reports/upload" element={
            <RouteGuard requiredRole="lab">
              <AppShell>
                <div className="p-8 text-center">Upload page coming soon...</div>
              </AppShell>
            </RouteGuard>
          } />
          <Route path="/lab/patients" element={
            <RouteGuard requiredRole="lab">
              <AppShell>
                <div className="p-8 text-center">Patients page coming soon...</div>
              </AppShell>
            </RouteGuard>
          } />
          <Route path="/lab/profile" element={
            <RouteGuard requiredRole="lab">
              <AppShell>
                <div className="p-8 text-center">Profile page coming soon...</div>
              </AppShell>
            </RouteGuard>
          } />

          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
