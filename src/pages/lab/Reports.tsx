import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, FileText, Upload, Eye, Download, Calendar, User, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';
import { useToast } from '@/hooks/use-toast';

// Mock data
const reports = [
  {
    id: 'R001',
    pin: 'UHB123456',
    patientName: 'Rajesh Kumar',
    episodeId: 'EP001',
    testName: 'Complete Blood Count',
    testCode: 'CBC-001',
    uploadedAt: '2024-01-15T14:30:00Z',
    status: 'available' as const,
    fileUrl: '/sample-report.pdf',
    labName: 'Apollo Diagnostics',
    technician: 'Dr. Meera Shah',
    aiSummary: {
      patient: 'Your blood tests show normal values across all parameters. Your hemoglobin level is within the healthy range.',
      clinician: 'CBC results within normal limits. Hemoglobin 14.2 g/dL, WBC count 7,800/μL, platelets 285,000/μL. No abnormal findings.',
      generatedAt: '2024-01-15T15:00:00Z'
    }
  },
  {
    id: 'R002',
    pin: 'UHB789012',
    patientName: 'Priya Sharma',
    episodeId: null,
    testName: 'Lipid Profile',
    testCode: 'LIPID-002',
    uploadedAt: '2024-01-14T11:45:00Z',
    status: 'available' as const,
    fileUrl: '/sample-lipid-report.pdf',
    labName: 'SRL Diagnostics',
    technician: 'Dr. Amit Patel',
    aiSummary: {
      patient: 'Your cholesterol levels are slightly elevated. Consider dietary modifications and follow up with your doctor.',
      clinician: 'Total cholesterol 245 mg/dL (elevated). LDL 165 mg/dL (high risk). HDL 38 mg/dL (low). Triglycerides 180 mg/dL. Recommend statin therapy consideration.',
      generatedAt: '2024-01-14T12:15:00Z'
    }
  },
  {
    id: 'R003',
    pin: 'UHB345678',
    patientName: 'Mohammed Ali',
    episodeId: 'EP003',
    testName: 'HbA1c',
    testCode: 'HBA1C-003',
    uploadedAt: '2024-01-13T16:20:00Z',
    status: 'replaced' as const,
    fileUrl: '/sample-hba1c-report.pdf',
    labName: 'Metropolis Healthcare',
    technician: 'Dr. Sunita Roy',
    aiSummary: {
      patient: 'Your diabetes control has improved since your last test. Keep following your current treatment plan.',
      clinician: 'HbA1c 7.2% (improved from previous 8.1%). Better glycemic control achieved. Continue current diabetes management protocol.',
      generatedAt: '2024-01-13T16:45:00Z'
    }
  }
];

export default function LabReports() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTest, setFilterTest] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.pin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.testName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesTest = filterTest === 'all' || report.testName.toLowerCase().includes(filterTest.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesTest;
  });

  const handleReplaceReport = (reportId: string) => {
    toast({
      title: "Report replacement initiated",
      description: "Upload the corrected report to replace the current one.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'replaced': return 'warning';
      case 'pending': return 'secondary';
      default: return 'secondary';
    }
  };

  const uniqueTests = [...new Set(reports.map(r => r.testName))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Laboratory Reports</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view uploaded test reports
          </p>
        </div>
        <Button onClick={() => window.location.href = '/lab/reports/upload'}>
          <Upload className="h-4 w-4 mr-2" />
          Upload New Report
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by patient name, PIN, or test..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="replaced">Replaced</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterTest} onValueChange={setFilterTest}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Test Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tests</SelectItem>
              {uniqueTests.map((test) => (
                <SelectItem key={test} value={test.toLowerCase()}>
                  {test}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reports Table */}
      {filteredReports.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No reports found"
          description="Try adjusting your search criteria or upload new reports"
          action={{
            label: "Upload Report",
            onClick: () => window.location.href = '/lab/reports/upload'
          }}
        />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Test</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>AI Summary</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{report.patientName}</p>
                      <p className="text-sm text-muted-foreground font-mono">{report.pin}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{report.testName}</p>
                      <p className="text-sm text-muted-foreground">{report.testCode}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(report.uploadedAt)}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {report.technician}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(report.status) as any}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {report.aiSummary ? (
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        Available
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedReport(report)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <FileText className="h-5 w-5" />
                              {report.testName} Report
                            </DialogTitle>
                            <DialogDescription>
                              Patient: {report.patientName} • PIN: {report.pin} • {formatDate(report.uploadedAt)}
                            </DialogDescription>
                          </DialogHeader>

                          <Tabs defaultValue="summary" className="mt-4">
                            <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger value="summary">Summary</TabsTrigger>
                              <TabsTrigger value="patient">Patient View</TabsTrigger>
                              <TabsTrigger value="clinician">Clinician View</TabsTrigger>
                            </TabsList>

                            <TabsContent value="summary" className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Report Details</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Test Name:</span>
                                      <span>{report.testName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Test Code:</span>
                                      <span>{report.testCode}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Lab:</span>
                                      <span>{report.labName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Technician:</span>
                                      <span>{report.technician}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Status:</span>
                                      <Badge variant={getStatusColor(report.status) as any}>
                                        {report.status}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Patient Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Name:</span>
                                      <span>{report.patientName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">PIN:</span>
                                      <span className="font-mono">{report.pin}</span>
                                    </div>
                                    {report.episodeId && (
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Episode:</span>
                                        <span className="font-mono">{report.episodeId}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex gap-2 pt-4">
                                <Button variant="outline" className="flex-1">
                                  <Download className="h-4 w-4 mr-2" />
                                  Download PDF
                                </Button>
                                {report.status === 'available' && (
                                  <Button 
                                    variant="outline" 
                                    onClick={() => handleReplaceReport(report.id)}
                                    className="flex-1"
                                  >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Replace Report
                                  </Button>
                                )}
                              </div>
                            </TabsContent>

                            <TabsContent value="patient" className="space-y-4">
                              {report.aiSummary ? (
                                <div className="p-4 bg-muted/20 rounded-lg">
                                  <h4 className="font-medium mb-3">Patient-Friendly Summary</h4>
                                  <p className="text-sm leading-relaxed">{report.aiSummary.patient}</p>
                                  <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                    <p className="text-xs text-amber-800 dark:text-amber-200">
                                      <strong>Disclaimer:</strong> This summary is for informational purposes only and should not replace professional medical advice. 
                                      Please consult your healthcare provider for proper interpretation and guidance.
                                    </p>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Generated on {formatDate(report.aiSummary.generatedAt)}
                                  </p>
                                </div>
                              ) : (
                                <div className="text-center p-8">
                                  <p className="text-muted-foreground">AI summary is being generated...</p>
                                </div>
                              )}
                            </TabsContent>

                            <TabsContent value="clinician" className="space-y-4">
                              {report.aiSummary ? (
                                <div className="p-4 bg-muted/20 rounded-lg">
                                  <h4 className="font-medium mb-3">Clinical Summary</h4>
                                  <p className="text-sm leading-relaxed">{report.aiSummary.clinician}</p>
                                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                    <p className="text-xs text-blue-800 dark:text-blue-200">
                                      <strong>Clinical Note:</strong> AI-generated interpretation. Please verify findings against source laboratory data. 
                                      This summary should supplement, not replace, clinical judgment and detailed report review.
                                    </p>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Generated on {formatDate(report.aiSummary.generatedAt)}
                                  </p>
                                </div>
                              ) : (
                                <div className="text-center p-8">
                                  <p className="text-muted-foreground">AI summary is being generated...</p>
                                </div>
                              )}
                            </TabsContent>
                          </Tabs>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}