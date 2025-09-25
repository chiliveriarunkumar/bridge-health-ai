import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge, BadgeCheck, Banknote, Calendar, FileText, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge as BadgeComponent } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
const schemes = [
  {
    id: '1',
    name: 'Ayushman Bharat - Health & Wellness Centers',
    description: 'Comprehensive primary healthcare including preventive care and management of non-communicable diseases.',
    eligibility: 'All families covered under SECC-2011',
    benefits: ['Free consultations', 'Basic diagnostics', 'Essential medicines', 'Maternal health services'],
    applicationDeadline: '2024-12-31',
    status: 'active' as const,
    tags: ['Universal Healthcare', 'Primary Care', 'Preventive Care'],
    coverageAmount: '₹5,00,000 per family per year'
  },
  {
    id: '2',
    name: 'Pradhan Mantri Jan Aushadhi Yojana',
    description: 'Affordable quality medicines through dedicated outlets across the country.',
    eligibility: 'Open to all citizens',
    benefits: ['Generic medicines at 50-90% lower cost', 'Quality assured', 'Wide availability'],
    applicationDeadline: null,
    status: 'active' as const,
    tags: ['Medicines', 'Affordability', 'Quality'],
    coverageAmount: 'Up to 90% savings on medicines'
  },
  {
    id: '3',
    name: 'Mission Indradhanush 2.0',
    description: 'Intensified immunization program to achieve full immunization coverage.',
    eligibility: 'Children under 2 years and pregnant women',
    benefits: ['Free vaccinations', 'Complete immunization schedule', 'Health tracking'],
    applicationDeadline: null,
    status: 'active' as const,
    tags: ['Immunization', 'Child Health', 'Maternal Health'],
    coverageAmount: 'Free vaccination program'
  }
];

const applications = [
  {
    id: '1',
    schemeId: '1',
    schemeName: 'Ayushman Bharat - Health & Wellness Centers',
    status: 'approved' as const,
    submittedAt: '2024-01-15T10:30:00Z',
    reviewedAt: '2024-01-20T14:15:00Z',
    notes: 'Application approved. Card will be issued within 7 working days.'
  },
  {
    id: '2',
    schemeId: '2',
    schemeName: 'Pradhan Mantri Jan Aushadhi Yojana',
    status: 'under_review' as const,
    submittedAt: '2024-02-10T09:00:00Z',
    reviewedAt: null,
    notes: null
  }
];

export default function PatientSchemes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('all');
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterTag === 'all' || scheme.tags.some(tag => 
      tag.toLowerCase().includes(filterTag.toLowerCase())
    );
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'under_review': return 'warning';
      case 'rejected': return 'destructive';
      case 'draft': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'draft': return 25;
      case 'submitted': return 50;
      case 'under_review': return 75;
      case 'approved': return 100;
      case 'rejected': return 100;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Government Schemes</h1>
          <p className="text-muted-foreground mt-1">
            Discover and apply for healthcare schemes and benefits
          </p>
        </div>
      </div>

      <Tabs defaultValue="catalog" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="catalog">Scheme Catalog</TabsTrigger>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search schemes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="healthcare">Universal Healthcare</SelectItem>
                <SelectItem value="medicines">Medicines</SelectItem>
                <SelectItem value="immunization">Immunization</SelectItem>
                <SelectItem value="maternal">Maternal Health</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Schemes Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSchemes.map((scheme) => (
              <motion.div
                key={scheme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between">
                      <Banknote className="h-8 w-8 text-primary" />
                      <BadgeComponent variant="secondary" className="text-xs">
                        {scheme.status === 'active' ? 'Active' : 'Inactive'}
                      </BadgeComponent>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{scheme.name}</CardTitle>
                      <CardDescription className="mt-2">
                        {scheme.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-foreground mb-2">Coverage</h4>
                      <p className="text-sm text-primary font-medium">{scheme.coverageAmount}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm text-foreground mb-2">Eligibility</h4>
                      <p className="text-sm text-muted-foreground">{scheme.eligibility}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm text-foreground mb-2">Key Benefits</h4>
                      <ul className="space-y-1">
                        {scheme.benefits.slice(0, 3).map((benefit, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center">
                            <BadgeCheck className="h-3 w-3 text-success mr-2 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {scheme.tags.map((tag) => (
                        <BadgeComponent key={tag} variant="outline" className="text-xs">
                          {tag}
                        </BadgeComponent>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <FileText className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{scheme.name}</DialogTitle>
                            <DialogDescription>{scheme.description}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Eligibility Criteria</h4>
                              <p className="text-sm text-muted-foreground">{scheme.eligibility}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Benefits</h4>
                              <ul className="space-y-1">
                                {scheme.benefits.map((benefit, index) => (
                                  <li key={index} className="text-sm text-muted-foreground flex items-center">
                                    <BadgeCheck className="h-4 w-4 text-success mr-2" />
                                    {benefit}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Coverage Amount</h4>
                              <p className="text-sm text-primary font-medium">{scheme.coverageAmount}</p>
                            </div>
                            {scheme.applicationDeadline && (
                              <div>
                                <h4 className="font-medium mb-2">Application Deadline</h4>
                                <p className="text-sm text-muted-foreground flex items-center">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  {new Date(scheme.applicationDeadline).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button size="sm" className="flex-1" onClick={() => setIsApplyDialogOpen(true)}>
                        Apply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{application.schemeName}</CardTitle>
                      <CardDescription>
                        Applied on {new Date(application.submittedAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <BadgeComponent variant={getStatusColor(application.status)}>
                      {application.status.replace('_', ' ').toUpperCase()}
                    </BadgeComponent>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Application Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {getStatusProgress(application.status)}%
                      </span>
                    </div>
                    <Progress value={getStatusProgress(application.status)} className="h-2" />
                  </div>
                  
                  {application.notes && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Notes</h4>
                      <p className="text-sm text-muted-foreground">{application.notes}</p>
                    </div>
                  )}

                  {application.reviewedAt && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Reviewed On</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(application.reviewedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Apply Dialog */}
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Apply for Scheme</DialogTitle>
            <DialogDescription>
              Fill in your details to apply for this government scheme.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" placeholder="Enter your full name" />
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" placeholder="Enter your age" />
            </div>
            <div>
              <Label htmlFor="income">Annual Income</Label>
              <Input id="income" type="number" placeholder="Enter annual income" />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="karnataka">Karnataka</SelectItem>
                  <SelectItem value="gujarat">Gujarat</SelectItem>
                  <SelectItem value="rajasthan">Rajasthan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="aadhar">Aadhar Number</Label>
              <Input id="aadhar" placeholder="Enter Aadhar number" />
            </div>
            <div>
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea id="additionalInfo" placeholder="Any additional information..." />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsApplyDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={() => setIsApplyDialogOpen(false)} className="flex-1">
                Submit Application
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}