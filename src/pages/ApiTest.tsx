import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export default function ApiTest() {
  const [sessionResult, setSessionResult] = useState<any>(null);
  const [linkResult, setLinkResult] = useState<any>(null);
  const [externalUserId, setExternalUserId] = useState('test-user-123');
  const [loading, setLoading] = useState(false);

  const testSessionCheck = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      setSessionResult(data);
    } catch (error) {
      setSessionResult({ error: 'Network error', details: error });
    } finally {
      setLoading(false);
    }
  };

  const testLinkAccount = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/link-account', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          externalAppUserId: externalUserId
        })
      });
      
      const data = await response.json();
      setLinkResult(data);
    } catch (error) {
      setLinkResult({ error: 'Network error', details: error });
    } finally {
      setLoading(false);
    }
  };

  const simulateExternalApp = () => {
    const redirectUrl = `${window.location.origin}/api-test`;
    const authUrl = `/auth?redirect_to=${encodeURIComponent(redirectUrl)}`;
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">AxionLabs API Integration Test</h1>
          <p className="text-lg text-muted-foreground">
            Test the authentication API endpoints for external app integration
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Session Check Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline">GET</Badge>
                Session Check API
              </CardTitle>
              <CardDescription>
                Test the /api/auth/session endpoint to check if user is logged in
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={testSessionCheck}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Testing...' : 'Test Session Check'}
              </Button>
              
              {sessionResult && (
                <Alert>
                  <AlertDescription>
                    <pre className="text-sm overflow-auto">
                      {JSON.stringify(sessionResult, null, 2)}
                    </pre>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Link Account Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline">POST</Badge>
                Link Account API
              </CardTitle>
              <CardDescription>
                Test the /api/link-account endpoint to link external app user
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="external-user-id">External App User ID</Label>
                <Input
                  id="external-user-id"
                  value={externalUserId}
                  onChange={(e) => setExternalUserId(e.target.value)}
                  placeholder="Enter external app user ID"
                />
              </div>
              
              <Button 
                onClick={testLinkAccount}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Testing...' : 'Test Link Account'}
              </Button>
              
              {linkResult && (
                <Alert>
                  <AlertDescription>
                    <pre className="text-sm overflow-auto">
                      {JSON.stringify(linkResult, null, 2)}
                    </pre>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* External App Simulation */}
        <Card>
          <CardHeader>
            <CardTitle>External App Simulation</CardTitle>
            <CardDescription>
              Simulate how an external app would redirect users to AxionLabs for authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={simulateExternalApp}
              variant="outline"
              className="w-full"
            >
              Simulate External App Login Flow
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              This will redirect you to /auth with a redirect_to parameter, simulating how an external app would integrate
            </p>
          </CardContent>
        </Card>

        {/* Documentation Link */}
        <Card>
          <CardHeader>
            <CardTitle>Integration Documentation</CardTitle>
            <CardDescription>
              Complete guide for external app developers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View the complete API integration guide including code examples, security considerations, and best practices.
            </p>
            <Button variant="link" className="p-0">
              <a href="/API_INTEGRATION.md" target="_blank" rel="noopener noreferrer">
                View API Integration Guide →
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}