
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Settings as SettingsIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { ProfileForm } from "@/components/settings/ProfileForm";

const Settings = () => {
  return (
    <div className="min-h-screen bg-black p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_50%)]" />
      
      {/* Back to Home */}
      <Link 
        to="/" 
        className="fixed top-6 left-6 z-10 flex items-center gap-2 text-white/70 hover:text-white transition-colors glass-button px-4 py-2 rounded-full"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="max-w-4xl mx-auto pt-20 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-white/70">Manage your account and preferences</p>
        </div>

        <Card className="glass-card border-white/10 bg-black/80 backdrop-blur-xl">
          <CardContent className="p-6">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/20 mb-6">
                <TabsTrigger value="profile" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="account" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  Account
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <Card className="glass-card border-white/10 bg-white/5">
                  <CardHeader>
                    <CardTitle className="text-white">Profile Information</CardTitle>
                    <CardDescription className="text-white/70">
                      Update your personal information and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProfileForm />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="account" className="space-y-6">
                <Card className="glass-card border-white/10 bg-white/5">
                  <CardHeader>
                    <CardTitle className="text-white">Account Settings</CardTitle>
                    <CardDescription className="text-white/70">
                      Manage your account security and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AccountSettings />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
