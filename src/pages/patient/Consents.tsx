import { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldOff, 
  Timer, 
  User, 
  Building, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  History,
  Eye,
  RotateCcw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { EmptyState } from '@/components/ui/empty-state';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import type { ConsentRequest, Consent } from '@/types';

// Mock data
const mockConsentRequests: ConsentRequest[] = [
  {
    id: 'CR001',
    pin: 'UHB1234',
    requesterType: 'doctor',
    requesterId: 'D001',
    requesterName: 'Dr. Michael Chen',
    scope: ['currentEpisode', 'allLabs'],
    purpose: 'Follow-up consultation for hypertension management and review of recent lab results',
    createdAt: '2024-01-24T10:30:00Z',
    status: 'pending'
  },
  {
    id: 'CR002',
    pin: 'UHB1234',
    requesterType: 'lab',
    requesterId: 'L001',
    requesterName: 'MedLab Services',
    scope: ['currentEpisode'],
    purpose: 'Upload and share new blood test results for ongoing treatment',
    createdAt: '2024-01-24T14:15:00Z',
    status: 'pending'
  }
];

const mockActiveConsents: Consent[] = [
  {
    id: 'C001',
    pin: 'UHB1234',
    scope: ['last12Months', 'notesOnly'],
    status: 'active',
    expiresAt: '2024-01-25T15:00:00Z',
    requesterId: 'D002',
    requesterName: 'Dr. Sarah Ahmed',
    requesterType: 'doctor',
    createdAt: '2024-01-24T09:00:00Z'
  },
  {
    id: 'C002',
    pin: 'UHB1234',
    scope: ['allLabs'],
    status: 'active',
    expiresAt: '2024-01-26T18:30:00Z',
    requesterId: 'L002',
    requesterName: 'DiagnosticCare Plus',
    requesterType: 'lab',
    createdAt: '2024-01-23T16:20:00Z'
  }
];

const mockAuditLog = [
  {
    id: 'A001',
    timestamp: '2024-01-24T15:30:00Z',
    action: 'Consent Approved',
    requester: 'Dr. Michael Chen',
    scope: ['currentEpisode', 'allLabs'],
    duration: '2 hours',
    status: 'active'
  },
  {
    id: 'A002',
    timestamp: '2024-01-24T10:15:00Z',
    action: 'Consent Revoked',
    requester: 'MedLab Services',
    scope: ['currentEpisode'],
    duration: 'Early termination',
    status: 'revoked'
  },
  {
    id: 'A003',
    timestamp: '2024-01-23T18:45:00Z',
    action: 'Consent Expired',
    requester: 'Dr. Sarah Ahmed',
    scope: ['last12Months'],
    duration: '24 hours',
    status: 'expired'
  }
];

const scopeLabels = {
  currentEpisode: 'Current Episode Only',
  allLabs: 'All Lab Reports',
  last12Months: 'Last 12 Months',
  notesOnly: 'Doctor Notes Only'
};

const scopeDescriptions = {
  currentEpisode: 'Access to information related to your current treatment episode',
  allLabs: 'Access to all your laboratory test results and reports',
  last12Months: 'Access to all medical records from the past 12 months',
  notesOnly: 'Access to doctor notes and clinical observations only'
};

export default function Consents() {
  const [selectedRequest, setSelectedRequest] = useState<ConsentRequest | null>(null);
  const [selectedDuration, setSelectedDuration] = useState('2');
  const [confirmRevoke, setConfirmRevoke] = useState<string | null>(null);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeUntilExpiry = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffHours = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return { text: 'Expires soon', color: 'pill-danger' };
    if (diffHours < 6) return { text: `${diffHours}h left`, color: 'pill-warning' };
    if (diffHours < 24) return { text: `${diffHours}h left`, color: 'pill-accent' };
    return { text: `${Math.floor(diffHours / 24)}d left`, color: 'pill-success' };
  };

  const handleApproveConsent = () => {
    if (!selectedRequest) return;
    
    toast({
      title: 'Consent Approved',
      description: `Access granted to ${selectedRequest.requesterName} for ${selectedDuration} hours`,
    });
    setSelectedRequest(null);
  };

  const handleDenyConsent = () => {
    if (!selectedRequest) return;
    
    toast({
      title: 'Consent Denied',
      description: `Access request from ${selectedRequest.requesterName} has been denied`,
      variant: 'destructive',
    });
    setSelectedRequest(null);
  };

  const handleRevokeConsent = (consentId: string) => {
    toast({
      title: 'Consent Revoked',
      description: 'Healthcare provider access has been immediately terminated',
    });
    setConfirmRevoke(null);
  };

  const getRequesterIcon = (type: string) => {
    return type === 'doctor' ? User : Building;
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Consent Approved': return CheckCircle;
      case 'Consent Revoked': return XCircle;
      case 'Consent Expired': return Timer;
      default: return History;
    }
  };

  const getActionColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'revoked': return 'text-danger';
      case 'expired': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Consent Management</h1>
        <p className="text-muted-foreground mt-2">
          Control who can access your medical information and for how long
        </p>
      </div>

      {/* Consent Tabs */}
      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requests" className="flex items-center space-x-2">
            <Timer className="h-4 w-4" />
            <span>Requests</span>
            {mockConsentRequests.length > 0 && (
              <Badge className="ml-1 bg-warning text-warning-foreground">
                {mockConsentRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4" />
            <span>Active</span>
            {mockActiveConsents.length > 0 && (
              <Badge className="ml-1 bg-success text-success-foreground">
                {mockActiveConsents.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center space-x-2">
            <History className="h-4 w-4" />
            <span>Audit Log</span>
          </TabsTrigger>
        </TabsList>

        {/* Consent Requests */}
        <TabsContent value="requests" className="space-y-6">
          {mockConsentRequests.length > 0 ? (
            <div className="space-y-4">
              {mockConsentRequests.map((request, index) => {
                const RequesterIcon = getRequesterIcon(request.requesterType);
                
                return (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass-card hover:shadow-elevate transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="p-3 bg-warning/10 rounded-xl">
                              <RequesterIcon className="h-6 w-6 text-warning" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-foreground">
                                  {request.requesterName}
                                </h3>
                                <Badge className="pill-warning">
                                  {request.requesterType}
                                </Badge>
                                <Badge className="pill-accent">
                                  Pending Approval
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-4">
                                Requested {formatDateTime(request.createdAt)}
                              </p>
                              <div className="mb-4">
                                <h4 className="font-medium text-foreground mb-2">Requested Access:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {request.scope.map(scope => (
                                    <Badge key={scope} variant="outline" className="text-xs">
                                      {scopeLabels[scope]}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium text-foreground mb-2">Purpose:</h4>
                                <p className="text-sm text-muted-foreground">{request.purpose}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 ml-6">
                            <Button
                              variant="outline"
                              onClick={() => setSelectedRequest(request)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Review
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Timer}
              title="No pending requests"
              description="You don't have any consent requests waiting for approval"
            />
          )}
        </TabsContent>

        {/* Active Consents */}
        <TabsContent value="active" className="space-y-6">
          {mockActiveConsents.length > 0 ? (
            <div className="space-y-4">
              {mockActiveConsents.map((consent, index) => {
                const RequesterIcon = getRequesterIcon(consent.requesterType);
                const timeLeft = getTimeUntilExpiry(consent.expiresAt);
                
                return (
                  <motion.div
                    key={consent.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass-card">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="p-3 bg-success/10 rounded-xl">
                              <RequesterIcon className="h-6 w-6 text-success" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-foreground">
                                  {consent.requesterName}
                                </h3>
                                <Badge className="pill-success">
                                  {consent.requesterType}
                                </Badge>
                                <Badge className={timeLeft.color}>
                                  <Timer className="h-3 w-3 mr-1" />
                                  {timeLeft.text}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-4">
                                Approved {formatDateTime(consent.createdAt)} • 
                                Expires {formatDateTime(consent.expiresAt)}
                              </p>
                              <div>
                                <h4 className="font-medium text-foreground mb-2">Granted Access:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {consent.scope.map(scope => (
                                    <Badge key={scope} variant="outline" className="text-xs">
                                      {scopeLabels[scope]}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 ml-6">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setConfirmRevoke(consent.id)}
                            >
                              <ShieldOff className="h-4 w-4 mr-2" />
                              Revoke
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={ShieldCheck}
              title="No active consents"
              description="You don't have any active healthcare provider access permissions"
            />
          )}
        </TabsContent>

        {/* Audit Log */}
        <TabsContent value="audit" className="space-y-6">
          <div className="space-y-4">
            {mockAuditLog.map((entry, index) => {
              const ActionIcon = getActionIcon(entry.action);
              
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-card">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${getActionColor(entry.status)}`}>
                          <ActionIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-foreground">{entry.action}</p>
                              <p className="text-sm text-muted-foreground">
                                {entry.requester} • {entry.duration}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">
                                {formatDateTime(entry.timestamp)}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {entry.scope.map(scope => (
                                  <Badge key={scope} variant="outline" className="text-xs">
                                    {scopeLabels[scope]}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Consent Review Modal */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5" />
              <span>Review Consent Request</span>
            </DialogTitle>
            <DialogDescription>
              Review the details and decide whether to grant access to your medical information
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              {/* Requester Info */}
              <div className="p-4 bg-muted/20 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-brand/10 rounded-lg">
                    {getRequesterIcon(selectedRequest.requesterType) === User ? (
                      <User className="h-5 w-5 text-brand" />
                    ) : (
                      <Building className="h-5 w-5 text-brand" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{selectedRequest.requesterName}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {selectedRequest.requesterType}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Requested on {formatDateTime(selectedRequest.createdAt)}
                </p>
              </div>

              {/* Purpose */}
              <div>
                <h3 className="font-semibold text-foreground mb-2">Purpose of Access</h3>
                <p className="text-sm text-muted-foreground p-3 bg-muted/10 rounded-lg">
                  {selectedRequest.purpose}
                </p>
              </div>

              {/* Scope Details */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Requested Information Access</h3>
                <div className="space-y-3">
                  {selectedRequest.scope.map(scope => (
                    <div key={scope} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
                      <Checkbox checked disabled className="mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">{scopeLabels[scope]}</p>
                        <p className="text-sm text-muted-foreground">
                          {scopeDescriptions[scope]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Duration Selection */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Grant Access For</h3>
                <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.25">15 minutes</SelectItem>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="6">6 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  Access will automatically expire after the selected duration
                </p>
              </div>

              {/* Important Notice */}
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-warning mb-1">Important</p>
                    <p className="text-muted-foreground">
                      By approving this request, you're granting temporary access to your specified 
                      medical information. You can revoke access at any time from the Active Consents tab.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleDenyConsent}>
              <XCircle className="h-4 w-4 mr-2" />
              Deny Request
            </Button>
            <Button onClick={handleApproveConsent} className="btn-primary">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Confirmation Modal */}
      <Dialog open={!!confirmRevoke} onOpenChange={() => setConfirmRevoke(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <ShieldOff className="h-5 w-5 text-danger" />
              <span>Revoke Consent</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to immediately revoke access? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmRevoke(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => confirmRevoke && handleRevokeConsent(confirmRevoke)}
            >
              <ShieldOff className="h-4 w-4 mr-2" />
              Revoke Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}