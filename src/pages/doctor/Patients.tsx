import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, Calendar, FileText, AlertCircle, Clock, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';

// Mock data
const patients = [
  {
    pin: 'UHB123456',
    name: 'Rajesh Kumar',
    age: 45,
    gender: 'M' as const,
    lastVisit: '2024-01-15T10:30:00Z',
    activeEpisodeCount: 2,
    phone: '+91 9876543210',
    email: 'rajesh.kumar@email.com',
    consentExpiry: '2024-01-20T18:00:00Z',
    nextAppointment: '2024-01-25T14:00:00Z'
  },
  {
    pin: 'UHB789012',
    name: 'Priya Sharma',
    age: 32,
    gender: 'F' as const,
    lastVisit: '2024-01-10T14:15:00Z',
    activeEpisodeCount: 1,
    phone: '+91 9876543211',
    email: 'priya.sharma@email.com',
    consentExpiry: null,
    nextAppointment: null
  },
  {
    pin: 'UHB345678',
    name: 'Mohammed Ali',
    age: 58,
    gender: 'M' as const,
    lastVisit: '2024-01-08T09:45:00Z',
    activeEpisodeCount: 3,
    phone: '+91 9876543212',
    email: 'mohammed.ali@email.com',
    consentExpiry: '2024-01-22T12:00:00Z',
    nextAppointment: '2024-01-28T11:30:00Z'
  }
];

const episodes = [
  {
    id: 'EP001',
    pin: 'UHB123456',
    diagnosis: 'Hypertension Management',
    status: 'ongoing' as const,
    startedAt: '2024-01-01T00:00:00Z',
    nextVisitAt: '2024-01-25T14:00:00Z',
    prescriptionCount: 3,
    procedureCount: 1
  },
  {
    id: 'EP002',
    pin: 'UHB123456',
    diagnosis: 'Annual Physical Examination',
    status: 'upcoming' as const,
    startedAt: '2024-01-20T00:00:00Z',
    nextVisitAt: '2024-01-30T10:00:00Z',
    prescriptionCount: 0,
    procedureCount: 2
  }
];

const reports = [
  {
    id: 'R001',
    pin: 'UHB123456',
    testName: 'Complete Blood Count',
    uploadedAt: '2024-01-10T12:00:00Z',
    status: 'available' as const,
    labName: 'Apollo Diagnostics',
    aiSummary: {
      patient: 'Your blood tests show normal values across all parameters.',
      clinician: 'CBC results within normal limits. Hemoglobin 14.2 g/dL, WBC count normal.'
    }
  },
  {
    id: 'R002',
    pin: 'UHB123456',
    testName: 'Lipid Profile',
    uploadedAt: '2024-01-12T14:30:00Z',
    status: 'available' as const,
    labName: 'SRL Diagnostics',
    aiSummary: {
      patient: 'Your cholesterol levels are slightly elevated and may need attention.',
      clinician: 'Total cholesterol 245 mg/dL (elevated). LDL 165 mg/dL (high). Consider statin therapy.'
    }
  }
];

export default function DoctorPatients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.pin.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'active' && patient.activeEpisodeCount > 0) ||
                         (filterStatus === 'inactive' && patient.activeEpisodeCount === 0);
    
    return matchesSearch && matchesFilter;
  });

  const getConsentStatus = (expiry: string | null) => {
    if (!expiry) return { status: 'none', color: 'secondary', text: 'No Active Consent' };
    
    const expiryDate = new Date(expiry);
    const now = new Date();
    const hoursUntilExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilExpiry < 0) return { status: 'expired', color: 'destructive', text: 'Expired' };
    if (hoursUntilExpiry < 2) return { status: 'expiring', color: 'warning', text: 'Expiring Soon' };
    return { status: 'active', color: 'success', text: 'Active' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">My Patients</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view your patient records
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or PIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full md:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter patients" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Patients</SelectItem>
            <SelectItem value="active">Active Episodes</SelectItem>
            <SelectItem value="inactive">No Active Episodes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Patients Table */}
      {filteredPatients.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No patients found"
          description="Try adjusting your search criteria or filters"
        />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>PIN</TableHead>
                <TableHead>Active Episodes</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Consent Status</TableHead>
                <TableHead>Next Appointment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => {
                const consentStatus = getConsentStatus(patient.consentExpiry);
                return (
                  <TableRow key={patient.pin}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {patient.age} years, {patient.gender === 'M' ? 'Male' : 'Female'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{patient.pin}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={patient.activeEpisodeCount > 0 ? "default" : "secondary"}>
                        {patient.activeEpisodeCount}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(patient.lastVisit)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={consentStatus.color as any}>
                        <Shield className="h-3 w-3 mr-1" />
                        {consentStatus.text}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {patient.nextAppointment ? (
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(patient.nextAppointment)}
                        </div>
                      ) : (
                        'None scheduled'
                      )}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPatient(patient)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {patient.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              {patient.name}
                            </DialogTitle>
                            <DialogDescription>
                              PIN: {patient.pin} • {patient.age} years • Last visit: {formatDate(patient.lastVisit)}
                            </DialogDescription>
                          </DialogHeader>

                          <Tabs defaultValue="overview" className="mt-4">
                            <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger value="overview">Overview</TabsTrigger>
                              <TabsTrigger value="episodes">Episodes</TabsTrigger>
                              <TabsTrigger value="reports">Reports</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Contact Information</h4>
                                  <div className="space-y-1 text-sm">
                                    <p>Phone: {patient.phone}</p>
                                    <p>Email: {patient.email}</p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Consent Status</h4>
                                  <Badge variant={consentStatus.color as any}>
                                    {consentStatus.text}
                                  </Badge>
                                  {patient.consentExpiry && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      Expires: {formatDateTime(patient.consentExpiry)}
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="p-4 bg-muted/20 rounded-lg">
                                <h4 className="font-medium mb-2 flex items-center">
                                  <AlertCircle className="h-4 w-4 mr-2" />
                                  AI Summary
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Patient has been under care for hypertension management. Recent lab results show 
                                  improvement in blood pressure control. Cholesterol levels require attention. 
                                  Next follow-up recommended in 2 weeks.
                                </p>
                                <p className="text-xs text-muted-foreground mt-2 italic">
                                  AI-generated summary • Verify against source records
                                </p>
                              </div>
                            </TabsContent>

                            <TabsContent value="episodes" className="space-y-4">
                              {episodes.filter(ep => ep.pin === patient.pin).map((episode) => (
                                <Card key={episode.id}>
                                  <CardHeader>
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <CardTitle className="text-lg">{episode.diagnosis}</CardTitle>
                                        <CardDescription>
                                          Started: {formatDate(episode.startedAt)}
                                        </CardDescription>
                                      </div>
                                      <Badge variant={episode.status === 'ongoing' ? 'default' : 'secondary'}>
                                        {episode.status}
                                      </Badge>
                                    </div>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                      <div>
                                        <p className="font-medium">Prescriptions</p>
                                        <p className="text-muted-foreground">{episode.prescriptionCount}</p>
                                      </div>
                                      <div>
                                        <p className="font-medium">Procedures</p>
                                        <p className="text-muted-foreground">{episode.procedureCount}</p>
                                      </div>
                                      <div>
                                        <p className="font-medium">Next Visit</p>
                                        <p className="text-muted-foreground">
                                          {episode.nextVisitAt ? formatDate(episode.nextVisitAt) : 'Not scheduled'}
                                        </p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </TabsContent>

                            <TabsContent value="reports" className="space-y-4">
                              {reports.filter(report => report.pin === patient.pin).map((report) => (
                                <Card key={report.id}>
                                  <CardHeader>
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <CardTitle className="text-lg">{report.testName}</CardTitle>
                                        <CardDescription>
                                          {report.labName} • {formatDate(report.uploadedAt)}
                                        </CardDescription>
                                      </div>
                                      <Badge variant="secondary">{report.status}</Badge>
                                    </div>
                                  </CardHeader>
                                  <CardContent>
                                    {report.aiSummary && (
                                      <div className="p-3 bg-muted/20 rounded-lg">
                                        <h4 className="font-medium text-sm mb-2">AI Summary (Clinician)</h4>
                                        <p className="text-sm">{report.aiSummary.clinician}</p>
                                        <p className="text-xs text-muted-foreground mt-2 italic">
                                          AI-generated • Verify against source records
                                        </p>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              ))}
                            </TabsContent>
                          </Tabs>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}