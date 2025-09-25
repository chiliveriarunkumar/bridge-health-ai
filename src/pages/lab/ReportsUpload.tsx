import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, User, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Mock test catalog
const TEST_CATALOG = [
  { code: 'CBC', name: 'Complete Blood Count' },
  { code: 'LIPID', name: 'Lipid Profile' },
  { code: 'GLUCOSE', name: 'Glucose (Fasting)' },
  { code: 'HBA1C', name: 'HbA1c' },
  { code: 'THYROID', name: 'Thyroid Function Test' },
  { code: 'LIVER', name: 'Liver Function Test' },
  { code: 'KIDNEY', name: 'Kidney Function Test' },
  { code: 'URINE', name: 'Urine Analysis' }
];

// Mock recent patients
const RECENT_PATIENTS = [
  { pin: 'UHB123456', name: 'Rajesh Kumar', lastOrder: '2024-01-15' },
  { pin: 'UHB789012', name: 'Priya Sharma', lastOrder: '2024-01-14' },
  { pin: 'UHB345678', name: 'Mohammed Ali', lastOrder: '2024-01-13' }
];

export default function LabReportsUpload() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    pin: '',
    patientName: '',
    episodeId: '',
    testCode: '',
    testName: '',
    comments: '',
    priority: 'normal'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file only",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleTestSelect = (testCode: string) => {
    const test = TEST_CATALOG.find(t => t.code === testCode);
    if (test) {
      setFormData({
        ...formData,
        testCode: test.code,
        testName: test.name
      });
    }
  };

  const handlePatientSelect = (pin: string) => {
    const patient = RECENT_PATIENTS.find(p => p.pin === pin);
    if (patient) {
      setFormData({
        ...formData,
        pin: patient.pin,
        patientName: patient.name
      });
    }
  };

  const validateForm = () => {
    if (!formData.pin || !formData.testCode || !selectedFile) {
      toast({
        title: "Missing required fields",
        description: "Please fill in PIN, select test, and upload a file",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Simulate upload completion after 3 seconds
    setTimeout(() => {
      clearInterval(progressInterval);
      setUploadProgress(100);
      setIsUploading(false);
      setUploadSuccess(true);
      
      toast({
        title: "Report uploaded successfully",
        description: "AI summary generation has been initiated",
      });
    }, 3000);
  };

  const handleReset = () => {
    setFormData({
      pin: '',
      patientName: '',
      episodeId: '',
      testCode: '',
      testName: '',
      comments: '',
      priority: 'normal'
    });
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setUploadSuccess(false);
  };

  if (uploadSuccess) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Upload Report</h1>
            <p className="text-muted-foreground mt-1">
              Upload laboratory test reports
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-8 pb-6">
              <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Upload Successful!</h3>
              <p className="text-muted-foreground mb-4">
                Report has been uploaded and AI summary generation is in progress.
              </p>
              <div className="space-y-2 text-sm text-left bg-muted/20 p-4 rounded-lg mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Patient:</span>
                  <span>{formData.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PIN:</span>
                  <span className="font-mono">{formData.pin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Test:</span>
                  <span>{formData.testName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">File:</span>
                  <span>{selectedFile?.name}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleReset} className="flex-1">
                  Upload Another
                </Button>
                <Button onClick={() => window.location.href = '/lab/reports'} className="flex-1">
                  View Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Upload Report</h1>
          <p className="text-muted-foreground mt-1">
            Upload laboratory test reports for patients
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
              <CardDescription>Enter patient and test information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Patient Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pin">Patient PIN *</Label>
                  <Input
                    id="pin"
                    value={formData.pin}
                    onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                    placeholder="Enter patient PIN"
                    className="font-mono"
                  />
                </div>
                <div>
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    placeholder="Patient name (auto-filled)"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="episodeId">Episode ID (Optional)</Label>
                <Input
                  id="episodeId"
                  value={formData.episodeId}
                  onChange={(e) => setFormData({ ...formData, episodeId: e.target.value })}
                  placeholder="Link to specific treatment episode"
                  className="font-mono"
                />
              </div>

              {/* Test Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="testCode">Test Type *</Label>
                  <Select value={formData.testCode} onValueChange={handleTestSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select test type" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEST_CATALOG.map((test) => (
                        <SelectItem key={test.code} value={test.code}>
                          {test.name} ({test.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="comments">Comments (Optional)</Label>
                <Textarea
                  id="comments"
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  placeholder="Additional notes or observations..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Upload PDF Report *</CardTitle>
              <CardDescription>Drag and drop or click to select a PDF file</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center transition-colors
                  ${dragActive 
                    ? 'border-primary bg-primary/5' 
                    : selectedFile 
                    ? 'border-success bg-success/5' 
                    : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                  }
                `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {selectedFile ? (
                  <div className="space-y-4">
                    <CheckCircle className="h-12 w-12 text-success mx-auto" />
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <p className="text-lg font-medium">Drop PDF file here</p>
                      <p className="text-sm text-muted-foreground">or click to browse</p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button variant="outline" asChild>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        Select PDF File
                      </label>
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Maximum file size: 10MB. Only PDF files are accepted.
              </p>
            </CardContent>
          </Card>

          {/* Upload Progress */}
          {isUploading && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Uploading report...</span>
                    <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Please don't close this page while uploading
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit} 
            disabled={isUploading}
            className="w-full"
            size="lg"
          >
            {isUploading ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Report
              </>
            )}
          </Button>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Recent Patients
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {RECENT_PATIENTS.map((patient) => (
                <div
                  key={patient.pin}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-muted/20 transition-colors"
                  onClick={() => handlePatientSelect(patient.pin)}
                >
                  <p className="font-medium text-sm">{patient.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{patient.pin}</p>
                  <p className="text-xs text-muted-foreground">
                    Last order: {patient.lastOrder}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="p-3 bg-muted/20 rounded-lg">
                <p className="font-medium mb-1">File Requirements</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• PDF format only</li>
                  <li>• Maximum 10MB size</li>
                  <li>• Clear and readable</li>
                </ul>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg">
                <p className="font-medium mb-1">AI Summary</p>
                <p className="text-xs text-muted-foreground">
                  AI summaries are automatically generated after upload and will be available within a few minutes.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}