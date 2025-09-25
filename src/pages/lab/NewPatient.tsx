import { useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, ShieldCheck, Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const TEST_CATALOG = [
  {
    id: 'CBC',
    name: 'Complete Blood Count',
    description: 'Comprehensive blood analysis including RBC, WBC, platelets',
    category: 'Hematology'
  },
  {
    id: 'LIPID',
    name: 'Lipid Profile',
    description: 'Cholesterol, HDL, LDL, triglycerides analysis',
    category: 'Biochemistry'
  },
  {
    id: 'GLUCOSE',
    name: 'Glucose (Fasting)',
    description: 'Blood sugar level measurement after fasting',
    category: 'Biochemistry'
  },
  {
    id: 'HBA1C',
    name: 'HbA1c',
    description: 'Average blood sugar levels over 2-3 months',
    category: 'Biochemistry'
  },
  {
    id: 'THYROID',
    name: 'Thyroid Function Test',
    description: 'TSH, T3, T4 hormone levels',
    category: 'Endocrinology'
  },
  {
    id: 'LIVER',
    name: 'Liver Function Test',
    description: 'SGOT, SGPT, bilirubin, protein levels',
    category: 'Biochemistry'
  }
];

export default function LabNewPatient() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [pin, setPin] = useState('');
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [purpose, setPurpose] = useState('Laboratory testing as per doctor\'s prescription');
  const [consentStatus, setConsentStatus] = useState<'pending' | 'approved' | 'denied' | null>(null);
  const [patientInfo, setPatientInfo] = useState(null);

  const handlePinSubmit = () => {
    if (pin.length < 6) {
      toast({
        title: "Invalid PIN",
        description: "Please enter a valid 6-digit PIN",
        variant: "destructive"
      });
      return;
    }
    
    // Mock patient lookup
    setPatientInfo({
      name: 'Rajesh Kumar',
      age: 45,
      gender: 'M'
    });
    setCurrentStep(2);
  };

  const handleTestToggle = (testId: string) => {
    setSelectedTests(prev => 
      prev.includes(testId) 
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };

  const handleConsentRequest = () => {
    if (selectedTests.length === 0) {
      toast({
        title: "No tests selected",
        description: "Please select at least one test to proceed",
        variant: "destructive"
      });
      return;
    }
    
    setCurrentStep(3);
    setConsentStatus('pending');
    
    // Simulate consent response after 2 seconds
    setTimeout(() => {
      setConsentStatus('approved');
      toast({
        title: "Consent approved",
        description: "Patient has approved access for selected tests",
      });
    }, 2000);
  };

  const getStepStatus = (step: number) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'current';
    return 'upcoming';
  };

  const getTestsByCategory = () => {
    const grouped = TEST_CATALOG.reduce((acc, test) => {
      if (!acc[test.category]) {
        acc[test.category] = [];
      }
      acc[test.category].push(test);
      return acc;
    }, {} as Record<string, typeof TEST_CATALOG>);
    return grouped;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">New Patient Testing</h1>
          <p className="text-muted-foreground mt-1">
            Request consent for laboratory testing
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium
                  ${getStepStatus(step) === 'completed' 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : getStepStatus(step) === 'current'
                    ? 'border-primary text-primary'
                    : 'border-muted-foreground text-muted-foreground'
                  }
                `}>
                  {getStepStatus(step) === 'completed' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div className={`
                    w-16 h-0.5 mx-2
                    ${step < currentStep ? 'bg-primary' : 'bg-muted'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm">
            <span className={currentStep >= 1 ? 'text-foreground font-medium' : 'text-muted-foreground'}>
              Enter PIN
            </span>
            <span className={currentStep >= 2 ? 'text-foreground font-medium' : 'text-muted-foreground'}>
              Select Tests
            </span>
            <span className={currentStep >= 3 ? 'text-foreground font-medium' : 'text-muted-foreground'}>
              Request Consent
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FlaskConical className="h-5 w-5 mr-2" />
                Patient Identification
              </CardTitle>
              <CardDescription>
                Enter the patient's unique PIN to begin test setup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="pin">Patient PIN</Label>
                <Input
                  id="pin"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter 6-digit PIN"
                  maxLength={6}
                  className="text-center text-lg font-mono"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Ask the patient for their unique UHB PIN
                </p>
              </div>
              <Button onClick={handlePinSubmit} className="w-full">
                Look Up Patient
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Select Laboratory Tests
              </CardTitle>
              <CardDescription>
                Choose the tests to be performed for {patientInfo?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {patientInfo && (
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-medium mb-2">Patient Information</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Name</p>
                      <p className="text-muted-foreground">{patientInfo.name}</p>
                    </div>
                    <div>
                      <p className="font-medium">Age</p>
                      <p className="text-muted-foreground">{patientInfo.age} years</p>
                    </div>
                    <div>
                      <p className="font-medium">Gender</p>
                      <p className="text-muted-foreground">{patientInfo.gender === 'M' ? 'Male' : 'Female'}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {Object.entries(getTestsByCategory()).map(([category, tests]) => (
                  <div key={category}>
                    <h4 className="font-medium text-sm mb-3">{category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {tests.map((test) => (
                        <div key={test.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/20">
                          <Checkbox
                            id={test.id}
                            checked={selectedTests.includes(test.id)}
                            onCheckedChange={() => handleTestToggle(test.id)}
                          />
                          <div className="flex-1">
                            <Label htmlFor={test.id} className="font-medium cursor-pointer">
                              {test.name}
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {test.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <Label htmlFor="purpose">Purpose of Testing</Label>
                <Textarea
                  id="purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Describe the reason for these tests..."
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {selectedTests.length} test{selectedTests.length !== 1 ? 's' : ''} selected
                </p>
                <Button onClick={handleConsentRequest}>
                  Request Consent for Selected Tests
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Consent Status
              </CardTitle>
              <CardDescription>
                Waiting for patient consent for laboratory testing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                {consentStatus === 'pending' && (
                  <>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground">
                      Consent request sent to patient PIN: <span className="font-mono font-medium">{pin}</span>
                    </p>
                  </>
                )}

                {consentStatus === 'approved' && (
                  <>
                    <CheckCircle className="h-12 w-12 text-success mx-auto" />
                    <div>
                      <p className="font-medium text-success">Consent Approved</p>
                      <p className="text-sm text-muted-foreground">
                        Patient has granted access for selected laboratory tests
                      </p>
                    </div>
                  </>
                )}

                {consentStatus === 'denied' && (
                  <>
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                    <div>
                      <p className="font-medium text-destructive">Consent Denied</p>
                      <p className="text-sm text-muted-foreground">
                        Patient has declined consent for laboratory testing
                      </p>
                    </div>
                  </>
                )}
              </div>

              {consentStatus === 'approved' && (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/20">
                    <h4 className="font-medium mb-3">Approved Tests:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedTests.map(testId => {
                        const test = TEST_CATALOG.find(t => t.id === testId);
                        return test ? (
                          <div key={testId} className="flex items-center">
                            <Badge variant="secondary" className="text-xs">
                              {test.name}
                            </Badge>
                          </div>
                        ) : null;
                      })}
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                      <strong>Purpose:</strong> {purpose}
                    </p>
                  </div>

                  <div className="text-center space-y-2">
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      Ready for Testing
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      You can now proceed with sample collection and testing
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => window.location.href = '/lab/reports/upload'}>
                        Upload Results
                      </Button>
                      <Button onClick={() => window.location.href = '/lab/patients'}>
                        View Patient List
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}