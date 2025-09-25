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
import PatientTreatments from "./pages/patient/Treatments";
import PatientReports from "./pages/patient/Reports";
import PatientConsents from "./pages/patient/Consents";
import PatientAlerts from "./pages/patient/Alerts";
import PatientSchemes from "./pages/patient/Schemes";
import PatientProfile from "./pages/patient/Profile";

// Doctor Pages  
import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorNewPatient from "./pages/doctor/NewPatient";
import DoctorPatients from "./pages/doctor/Patients";
import DoctorProfile from "./pages/doctor/Profile";

// Lab Pages
import LabDashboard from "./pages/lab/Dashboard";
import LabNewPatient from "./pages/lab/NewPatient";
import LabReports from "./pages/lab/Reports";
import LabReportsUpload from "./pages/lab/ReportsUpload";
import LabPatients from "./pages/lab/Patients";
import LabProfile from "./pages/lab/Profile";

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
                <PatientTreatments />
              </AppShell>
            </RouteGuard>
          } />
          <Route path="/patient/reports" element={
            <RouteGuard requiredRole="patient">
              <AppShell>
                <PatientReports />
              </AppShell>
            </RouteGuard>
          } />
          <Route path="/patient/consents" element={
            <RouteGuard requiredRole="patient">
              <AppShell>
                <PatientConsents />
              </AppShell>
            </RouteGuard>
          } />
          <Route path="/patient/alerts" element={
            <RouteGuard requiredRole="patient">
              <AppShell>
                <PatientAlerts />
              </AppShell>
            </RouteGuard>
          } />
          <Route path="/patient/schemes" element={
            <RouteGuard requiredRole="patient">
              <AppShell>
                <PatientSchemes />
              </AppShell>
            </RouteGuard>
          } />
          <Route path="/patient/profile" element={
            <RouteGuard requiredRole="patient">
              <AppShell>
                <PatientProfile />
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
                <DoctorNewPatient />
              </AppShell>
            </RouteGuard>
          } />
          <Route path="/doctor/patients" element={
            <RouteGuard requiredRole="doctor">
              <AppShell>
                <DoctorPatients />
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
                <DoctorProfile />
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
                <LabNewPatient />
              </AppShell>
            </RouteGuard>
          } />
          <Route path="/lab/reports" element={
            <RouteGuard requiredRole="lab">
              <AppShell>
                <LabReports />
              </AppShell>
            </RouteGuard>
          } />
          <Route path="/lab/reports/upload" element={
            <RouteGuard requiredRole="lab">
              <AppShell>
                <LabReportsUpload />
              </AppShell>
            </RouteGuard>
          } />
          <Route path="/lab/patients" element={
            <RouteGuard requiredRole="lab">
              <AppShell>
                <LabPatients />
              </AppShell>
            </RouteGuard>
          } />
          <Route path="/lab/profile" element={
            <RouteGuard requiredRole="lab">
              <AppShell>
                <LabProfile />
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
