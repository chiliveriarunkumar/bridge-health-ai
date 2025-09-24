// UHB Core Types
export type UserRole = 'patient' | 'doctor' | 'lab';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  pin?: string; // For patients
  phone?: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Consent Management Types
export type ConsentScope = 'currentEpisode' | 'allLabs' | 'last12Months' | 'notesOnly';
export type ConsentStatus = 'pending' | 'active' | 'revoked' | 'expired';

export interface ConsentRequest {
  id: string;
  pin: string;
  requesterType: 'doctor' | 'lab';
  requesterId: string;
  requesterName: string;
  scope: ConsentScope[];
  purpose: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'denied';
}

export interface Consent {
  id: string;
  pin: string;
  scope: ConsentScope[];
  status: ConsentStatus;
  expiresAt: string;
  requesterId: string;
  requesterName: string;
  requesterType: 'doctor' | 'lab';
  createdAt: string;
}

// Medical Records Types
export interface Episode {
  id: string;
  pin: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  status: 'ongoing' | 'upcoming' | 'closed';
  diagnosis?: string;
  startedAt: string;
  nextVisitAt?: string;
  prescriptionCount: number;
  procedureCount: number;
  summary?: string;
}

export interface Report {
  id: string;
  pin: string;
  episodeId?: string;
  testName: string;
  testCode?: string;
  uploadedAt: string;
  status: 'available' | 'replaced';
  fileUrl: string;
  aiSummary?: {
    patient: string;
    clinician: string;
    generatedAt: string;
  };
  labName: string;
}

export interface PatientLite {
  pin: string;
  name: string;
  age?: number;
  gender?: 'M' | 'F' | 'O';
  lastVisit?: string;
  activeEpisodeCount: number;
  phone?: string;
  email?: string;
}

// Alerts & Notifications
export interface Alert {
  id: string;
  type: 'medication' | 'appointment' | 'report' | 'consent';
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

// Government Schemes
export interface Scheme {
  id: string;
  name: string;
  description: string;
  eligibility: string;
  benefits: string[];
  applicationDeadline?: string;
  status: 'active' | 'inactive';
  tags: string[];
}

export interface SchemeApplication {
  id: string;
  schemeId: string;
  schemeName: string;
  applicantPin: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  submittedAt?: string;
  reviewedAt?: string;
  notes?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Dashboard Overview Types
export interface PatientOverview {
  activeEpisodes: number;
  upcomingAppointments: number;
  recentReports: number;
  pendingConsents: number;
  todayAlerts: number;
  nextAppointment?: {
    date: string;
    doctorName: string;
    type: string;
  };
  recentReportsList: Report[];
}

export interface DoctorOverview {
  todayAppointments: number;
  activeEpisodes: number;
  expiringConsents: number;
  todayPatients: PatientLite[];
}

export interface LabOverview {
  pendingOrders: number;
  inProgress: number;
  completedToday: number;
  recentUploads: Report[];
}