import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, FileText, TestTube, User, Shield, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    lastService: '2024-01-15T14:30:00Z',
    totalTests: 12,
    recentTests: ['CBC', 'Lipid Profile'],
    consentExpiry: '2024-01-20T18:00:00Z',
    phone: '+91 9876543210',
    email: 'rajesh.kumar@email.com'
  },
  {
    pin: 'UHB789012',
    name: 'Priya Sharma',
    age: 32,
    gender: 'F' as const,
    lastService: '2024-01-14T11:45:00Z',
    totalTests: 8,
    recentTests: ['HbA1c', 'Thyroid Profile'],
    consentExpiry: null,
    phone: '+91 9876543211',
    email: 'priya.sharma@email.com'
  },
  {
    pin: 'UHB345678',
    name: 'Mohammed Ali',
    age: 58,
    gender: 'M' as const,
    lastService: '2024-01-13T16:20:00Z',
    totalTests: 15,
    recentTests: ['Liver Function', 'Kidney Function'],
    consentExpiry: '2024-01-25T12:00:00Z',
    phone: '+91 9876543212',
    email: 'mohammed.ali@email.com'
  }
];

const testHistory = [
  {
    id: 'T001',
    pin: 'UHB123456',
    testName: 'Complete Blood Count',
    date: '2024-01-15T14:30:00Z',
    status: 'completed',
    reportId: 'R001'
  },
  {
    id: 'T002',
    pin: 'UHB123456',
    testName: 'Lipid Profile',
    date: '2024-01-10T09:15:00Z',
    status: 'completed',
    reportId: 'R002'
  },
  {
    id: 'T003',
    pin: 'UHB123456',
    testName: 'Glucose (Fasting)',
    date: '2024-01-05T08:00:00Z',
    status: 'completed',
    reportId: 'R003'
  }
];

export default function LabPatients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.pin.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
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
          <h1 className="text-2xl font-semibold text-foreground">Patient Records</h1>
          <p className="text-muted-foreground mt-1">
            View patients served by your laboratory
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by patient name or PIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Patients Table */}
      {filteredPatients.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No patients found"
          description="Try adjusting your search criteria"
        />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>PIN</TableHead>
                <TableHead>Total Tests</TableHead>
                <TableHead>Last Service</TableHead>
                <TableHead>Recent Tests</TableHead>
                <TableHead>Consent Status</TableHead>
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
                      <Badge variant="secondary">
                        {patient.totalTests}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(patient.lastService)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {patient.recentTests.slice(0, 2).map((test, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {test}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={consentStatus.color as any}>
                        <Shield className="h-3 w-3 mr-1" />
                        {consentStatus.text}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPatient(patient)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            View History
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
                              PIN: {patient.pin} • {patient.age} years • Last service: {formatDate(patient.lastService)}
                            </DialogDescription>
                          </DialogHeader>

                          <Tabs defaultValue="overview" className="mt-4">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="overview">Overview</TabsTrigger>
                              <TabsTrigger value="history">Test History</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Patient Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Name:</span>
                                      <span>{patient.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">PIN:</span>
                                      <span className="font-mono">{patient.pin}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Age:</span>
                                      <span>{patient.age} years</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Gender:</span>
                                      <span>{patient.gender === 'M' ? 'Male' : 'Female'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Phone:</span>
                                      <span>{patient.phone}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Email:</span>
                                      <span>{patient.email}</span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Service Summary</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Total Tests:</span>
                                      <Badge variant="secondary">{patient.totalTests}</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Last Service:</span>
                                      <span>{formatDate(patient.lastService)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Consent Status:</span>
                      <Badge variant={consentStatus.color === 'success' ? 'default' : consentStatus.color === 'warning' ? 'secondary' : consentStatus.color === 'destructive' ? 'destructive' : 'secondary'}>
                                        {consentStatus.text}
                                      </Badge>
                                    </div>
                                    {patient.consentExpiry && (
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Consent Expiry:</span>
                                        <span className="text-xs">{formatDateTime(patient.consentExpiry)}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2">Recent Test Types</h4>
                                <div className="flex flex-wrap gap-2">
                                  {patient.recentTests.map((test, index) => (
                                    <Badge key={index} variant="outline">
                                      <TestTube className="h-3 w-3 mr-1" />
                                      {test}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent value="history" className="space-y-4">
                              <div className="space-y-3">
                                {testHistory.filter(test => test.pin === patient.pin).map((test) => (
                                  <Card key={test.id}>
                                    <CardHeader className="pb-3">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <CardTitle className="text-base">{test.testName}</CardTitle>
                                          <CardDescription>
                                            {formatDateTime(test.date)}
                                          </CardDescription>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Badge variant={test.status === 'completed' ? 'success' : 'secondary'}>
                                            {test.status}
                                          </Badge>
                                          {test.reportId && (
                                            <Button variant="outline" size="sm">
                                              <FileText className="h-4 w-4 mr-1" />
                                              View Report
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    </CardHeader>
                                  </Card>
                                ))}
                              </div>
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