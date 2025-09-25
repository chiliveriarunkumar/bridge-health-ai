import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserRound, ShieldCheck, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const CONSENT_SCOPES = [
  {
    id: 'currentEpisode',
    label: 'Current Episode',
    description: 'Access to data related to current treatment episode only'
  },
  {
    id: 'allLabs',
    label: 'All Lab Reports',
    description: 'Access to all laboratory test results and reports'
  },
  {
    id: 'last12Months',
    label: 'Last 12 Months',
    description: 'Access to all medical records from the past 12 months'
  },
  {
    id: 'notesOnly',
    label: 'Clinical Notes Only',
    description: 'Access to clinical notes and consultation history'
  }
];

export default function DoctorNewPatient() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [pin, setPin] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>(['currentEpisode']);
  const [purpose, setPurpose] = useState('');
  const [duration, setDuration] = useState('2');
  const [consentStatus, setConsentStatus] = useState<'pending' | 'approved' | 'denied' | null>(null);
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [sessionActive, setSessionActive] = useState(false);

  const handlePinSubmit = () => {
    if (pin.length < 6) {
      toast({
        title: "Invalid PIN",
        description: "Please enter a valid 6-digit PIN",
        variant: "destructive"
      });
      return;
    }
    setCurrentStep(2);
  };

  const handleScopeToggle = (scopeId: string) => {
    setSelectedScopes(prev => 
      prev.includes(scopeId) 
        ? prev.filter(id => id !== scopeId)
        : [...prev, scopeId]
    );
  };

  const handleConsentRequest = () => {
    if (!purpose.trim()) {
      toast({
        title: "Purpose required",
        description: "Please provide a purpose for accessing patient data",
        variant: "destructive"
      });
      return;
    }
    
    setCurrentStep(3);
    setConsentStatus('pending');
    
    // Simulate consent response after 3 seconds
    setTimeout(() => {
      setConsentStatus('approved');
      toast({
        title: "Consent approved",
        description: "Patient has approved your access request",
      });
    }, 3000);
  };

  const handleStartSession = () => {
    setIsSessionDialogOpen(true);
  };

  const handleOtpVerification = () => {
    if (otpCode === '123456') {
      setSessionActive(true);
      setIsSessionDialogOpen(false);
      toast({
        title: "Session started",
        description: "Doctor-present session is now active",
      });
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please check the OTP displayed on patient's device",
        variant: "destructive"
      });
    }
  };

  const getStepStatus = (step: number) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">New Patient Access</h1>
          <p className="text-muted-foreground mt-1">
            Request consent to access patient medical records
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
              Select Scope
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
                <UserRound className="h-5 w-5 mr-2" />
                Patient Identification
              </CardTitle>
              <CardDescription>
                Enter the patient's unique PIN to initiate access request
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
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2" />
                Select Access Scope
              </CardTitle>
              <CardDescription>
                Choose what data you need to access for this patient
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {CONSENT_SCOPES.map((scope) => (
                  <div key={scope.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={scope.id}
                      checked={selectedScopes.includes(scope.id)}
                      onCheckedChange={() => handleScopeToggle(scope.id)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={scope.id} className="font-medium cursor-pointer">
                        {scope.label}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {scope.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <Label htmlFor="duration">Access Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.25">15 minutes</SelectItem>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                    <SelectItem value="168">7 days</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  How long do you need access to this data?
                </p>
              </div>

              <div>
                <Label htmlFor="purpose">Purpose of Access</Label>
                <Textarea
                  id="purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Describe why you need access to this patient's data..."
                  rows={3}
                />
              </div>

              <Button onClick={handleConsentRequest} className="w-full">
                Request Consent
              </Button>
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
                Waiting for patient to respond to your access request
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
                        Patient has granted you access for {duration === '0.25' ? '15 minutes' : `${duration} hours`}
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
                        Patient has declined your access request
                      </p>
                    </div>
                  </>
                )}
              </div>

              {consentStatus === 'approved' && (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/20">
                    <h4 className="font-medium mb-2">Granted Access:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedScopes.map(scopeId => {
                        const scope = CONSENT_SCOPES.find(s => s.id === scopeId);
                        return scope ? (
                          <Badge key={scopeId} variant="secondary">
                            {scope.label}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      <strong>Purpose:</strong> {purpose}
                    </p>
                  </div>

                  {!sessionActive ? (
                    <Button onClick={handleStartSession} className="w-full">
                      Start Doctor-Present Session
                    </Button>
                  ) : (
                    <div className="text-center space-y-2">
                      <Badge variant="secondary" className="bg-success/10 text-success">
                        Session Active
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        You now have access to patient data
                      </p>
                      <Button variant="outline" onClick={() => window.location.href = `/doctor/patients/${pin}`}>
                        View Patient Records
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* OTP Verification Dialog */}
      <Dialog open={isSessionDialogOpen} onOpenChange={setIsSessionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Doctor-Present Verification</DialogTitle>
            <DialogDescription>
              Ask the patient for the OTP code displayed on their device
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="otp">Enter OTP Code</Label>
              <Input
                id="otp"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="text-center text-lg font-mono"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Demo OTP: 123456
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsSessionDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleOtpVerification} className="flex-1">
                Verify & Start Session
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}