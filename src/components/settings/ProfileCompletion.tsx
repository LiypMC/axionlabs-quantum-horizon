
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

interface ProfileCompletionProps {
  user: User | null;
}

export const ProfileCompletion = ({ user }: ProfileCompletionProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    jobTitle: '',
    phoneNumber: '',
    department: '',
    companySize: '',
    industry: '',
    useCase: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          company_name: formData.companyName,
          job_title: formData.jobTitle,
          phone_number: formData.phoneNumber,
          department: formData.department,
          company_size: formData.companySize,
          industry: formData.industry,
          use_case: formData.useCase,
          profile_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile completed successfully!', {
        description: 'Your quantum research profile is now complete.'
      });
      
      // Refresh the page to update the UI
      window.location.reload();
    } catch (error: any) {
      toast.error('Failed to complete profile setup');
      console.error('Profile setup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-foreground">Full Name *</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className="bg-background/50 border-border/30 focus:border-primary"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-foreground">Company Name *</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            className="bg-background/50 border-border/30 focus:border-primary"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="jobTitle" className="text-foreground">Job Title *</Label>
          <Input
            id="jobTitle"
            value={formData.jobTitle}
            onChange={(e) => handleInputChange('jobTitle', e.target.value)}
            className="bg-background/50 border-border/30 focus:border-primary"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="text-foreground">Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            className="bg-background/50 border-border/30 focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="department" className="text-foreground">Department</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => handleInputChange('department', e.target.value)}
            className="bg-background/50 border-border/30 focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companySize" className="text-foreground">Company Size *</Label>
          <Select value={formData.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
            <SelectTrigger className="bg-background/50 border-border/30 focus:border-primary">
              <SelectValue placeholder="Select company size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">1-10 employees</SelectItem>
              <SelectItem value="11-50">11-50 employees</SelectItem>
              <SelectItem value="51-200">51-200 employees</SelectItem>
              <SelectItem value="201-1000">201-1000 employees</SelectItem>
              <SelectItem value="1000+">1000+ employees</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry" className="text-foreground">Industry</Label>
        <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
          <SelectTrigger className="bg-background/50 border-border/30 focus:border-primary">
            <SelectValue placeholder="Select your industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="manufacturing">Manufacturing</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="consulting">Consulting</SelectItem>
            <SelectItem value="government">Government</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="useCase" className="text-foreground">How do you plan to use AxionLabs?</Label>
        <Textarea
          id="useCase"
          value={formData.useCase}
          onChange={(e) => handleInputChange('useCase', e.target.value)}
          placeholder="Tell us about your intended use case..."
          className="bg-background/50 border-border/30 focus:border-primary min-h-[80px]"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold shadow-lg h-12"
        disabled={loading || !formData.fullName || !formData.companyName || !formData.jobTitle || !formData.companySize}
      >
        {loading ? 'Completing Profile...' : 'Complete Profile'}
      </Button>
    </form>
  );
};
