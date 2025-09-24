import { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Building, 
  Sparkles,
  Eye,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle,
  Copy
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

// Mock data
const mockReports = [
  {
    id: 'R001',
    testName: 'Complete Blood Count (CBC)',
    testCode: 'LAB001',
    uploadedAt: '2024-01-20T14:30:00Z',
    status: 'available' as const,
    labName: 'MedLab Services',
    episodeId: 'EP001',
    fileUrl: '/sample-report.pdf',
    aiSummary: {
      patient: 'Your blood test results show normal values across all parameters. Your white blood cell count, red blood cell count, and platelet levels are all within healthy ranges. This indicates good overall health with no signs of infection or blood disorders.',
      clinician: 'CBC results within normal limits. WBC: 6.8 x10³/μL, RBC: 4.6 x10⁶/μL, Hgb: 14.2 g/dL, Hct: 42.1%, PLT: 285 x10³/μL. No abnormal morphology noted. Recommend routine follow-up.',
      generatedAt: '2024-01-20T15:00:00Z'
    }
  },
  {
    id: 'R002',
    testName: 'Lipid Profile',
    testCode: 'LAB002', 
    uploadedAt: '2024-01-18T09:15:00Z',
    status: 'available' as const,
    labName: 'DiagnosticCare Plus',
    episodeId: 'EP001',
    fileUrl: '/sample-report.pdf',
    aiSummary: {
      patient: 'Your cholesterol levels are slightly elevated. Your total cholesterol is above the recommended range, and your LDL (bad cholesterol) is also high. However, your HDL (good cholesterol) levels are good. Consider dietary changes and discuss with your doctor.',
      clinician: 'Lipid panel shows elevated total cholesterol (245 mg/dL) and LDL-C (165 mg/dL). HDL-C adequate at 45 mg/dL, triglycerides normal at 140 mg/dL. Risk stratification indicates need for lifestyle modification ± statin therapy. Follow ASCVD guidelines.',
      generatedAt: '2024-01-18T10:00:00Z'
    }
  },
  {
    id: 'R003',
    testName: 'Thyroid Function Panel',
    testCode: 'LAB003',
    uploadedAt: '2024-01-15T11:45:00Z',
    status: 'available' as const,
    labName: 'MedLab Services',
    episodeId: null,
    fileUrl: '/sample-report.pdf'
  },
  {
    id: 'R004',
    testName: 'Chest X-Ray',
    testCode: 'RAD001',
    uploadedAt: '2024-01-10T16:20:00Z',
    status: 'replaced' as const,
    labName: 'Imaging Center Pro',
    episodeId: 'EP003',
    fileUrl: '/sample-report.pdf'
  }
];

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [labFilter, setLabFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [summaryTab, setSummaryTab] = useState('patient');

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.labName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.testCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesLab = labFilter === 'all' || report.labName === labFilter;
    return matchesSearch && matchesStatus && matchesLab;
  });

  const uniqueLabs = [...new Set(mockReports.map(r => r.labName))];

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'pill-success';
      case 'replaced': return 'pill-warning';
      default: return 'pill-accent';
    }
  };

  const handleDownload = (report: any) => {
    toast({
      title: 'Download started',
      description: `Downloading ${report.testName}...`,
    });
  };

  const handleCopySummary = async (summary: string) => {
    await navigator.clipboard.writeText(summary);
    toast({
      title: 'Summary copied!',
      description: 'The AI summary has been copied to your clipboard.',
    });
  };

  const selectedReportData = selectedReport ? mockReports.find(r => r.id === selectedReport) : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Lab Reports</h1>
        <p className="text-muted-foreground mt-2">
          View your test results and AI-powered health insights
        </p>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports, tests, or labs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 focus-brand"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="replaced">Replaced</SelectItem>
                </SelectContent>
              </Select>
              <Select value={labFilter} onValueChange={setLabFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Laboratory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Labs</SelectItem>
                  {uniqueLabs.map(lab => (
                    <SelectItem key={lab} value={lab}>{lab}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      {filteredReports.length > 0 ? (
        <div className="grid gap-6">
          {filteredReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card hover:shadow-elevate transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-3 bg-brand/10 rounded-xl">
                        <FileText className="h-6 w-6 text-brand" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {report.testName}
                          </h3>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                          {report.aiSummary && (
                            <Badge className="pill-accent">
                              <Sparkles className="h-3 w-3 mr-1" />
                              AI Summary
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{report.labName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {formatDateTime(report.uploadedAt)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Code: {report.testCode}</span>
                          </div>
                        </div>
                        {report.episodeId && (
                          <p className="text-sm text-muted-foreground">
                            Associated with treatment episode {report.episodeId}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedReport(report.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(report)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No reports found"
          description={searchTerm || statusFilter !== 'all' || labFilter !== 'all'
            ? "No reports match your current filters"
            : "You don't have any lab reports yet"}
        />
      )}

      {/* Report Detail Modal */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>{selectedReportData?.testName}</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedReportData && (
            <div className="space-y-6">
              {/* Report Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-xl">
                <div>
                  <p className="text-sm text-muted-foreground">Laboratory</p>
                  <p className="font-medium">{selectedReportData.labName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Upload Date</p>
                  <p className="font-medium">{formatDateTime(selectedReportData.uploadedAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Test Code</p>
                  <p className="font-medium">{selectedReportData.testCode}</p>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="report" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="report">PDF Report</TabsTrigger>
                  <TabsTrigger value="summary" disabled={!selectedReportData.aiSummary}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Summary
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="report" className="space-y-4">
                  {/* PDF Viewer Placeholder */}
                  <Card className="glass-card">
                    <CardContent className="p-8">
                      <div className="flex flex-col items-center justify-center space-y-4 py-12">
                        <div className="p-4 bg-brand/10 rounded-2xl">
                          <FileText className="h-12 w-12 text-brand" />
                        </div>
                        <div className="text-center">
                          <h3 className="font-semibold text-foreground mb-2">PDF Report Viewer</h3>
                          <p className="text-muted-foreground mb-4">
                            PDF viewer would be embedded here in a real application
                          </p>
                          <Button onClick={() => handleDownload(selectedReportData)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="summary" className="space-y-4">
                  {selectedReportData.aiSummary ? (
                    <div className="space-y-4">
                      {/* AI Summary Disclaimer */}
                      <Card className="border-warning/20 bg-warning/5">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                            <div className="text-sm">
                              <p className="font-medium text-warning mb-1">AI-Generated Summary</p>
                              <p className="text-muted-foreground">
                                This summary is for informational purposes only and should not replace 
                                professional medical advice. Always consult with your healthcare provider 
                                for interpretation of your results.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Summary Tabs */}
                      <Tabs value={summaryTab} onValueChange={setSummaryTab}>
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="patient">Patient-Friendly</TabsTrigger>
                          <TabsTrigger value="clinician">Clinical Summary</TabsTrigger>
                        </TabsList>

                        <TabsContent value="patient" className="space-y-4">
                          <Card className="glass-card">
                            <CardHeader className="flex flex-row items-center justify-between">
                              <div>
                                <CardTitle className="text-lg">Easy-to-Understand Summary</CardTitle>
                                <CardDescription>
                                  Your results explained in simple terms
                                </CardDescription>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopySummary(selectedReportData.aiSummary!.patient)}
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                              </Button>
                            </CardHeader>
                            <CardContent>
                              <p className="text-foreground leading-relaxed">
                                {selectedReportData.aiSummary.patient}
                              </p>
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="clinician" className="space-y-4">
                          <Card className="glass-card">
                            <CardHeader className="flex flex-row items-center justify-between">
                              <div>
                                <CardTitle className="text-lg">Clinical Summary</CardTitle>
                                <CardDescription>
                                  Technical interpretation for healthcare providers
                                </CardDescription>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopySummary(selectedReportData.aiSummary!.clinician)}
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                              </Button>
                            </CardHeader>
                            <CardContent>
                              <p className="text-foreground leading-relaxed font-mono text-sm">
                                {selectedReportData.aiSummary.clinician}
                              </p>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>

                      <div className="text-xs text-muted-foreground text-center">
                        Summary generated on {formatDateTime(selectedReportData.aiSummary.generatedAt)}
                      </div>
                    </div>
                  ) : (
                    <EmptyState
                      icon={Sparkles}
                      title="AI Summary Not Available"
                      description="AI analysis is not available for this report"
                      className="py-8"
                    />
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}