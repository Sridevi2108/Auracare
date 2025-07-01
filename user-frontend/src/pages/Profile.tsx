import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Pencil, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DashboardNavbar from '@/components/DashboardNavbar';
import DashboardFooter from '@/components/DashboardFooter';
import { useDarkMode } from '@/components/DarkModeProvider';

const Profile = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    dob: '',
    location: '',
    bio: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...profile });

  // Replace with actual logged-in email or fetch from auth context/localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
const loggedInEmail = user.email;


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/profile/${loggedInEmail}`);
        if (res.data.success) {
          setProfile(res.data.data);
          setEditedProfile(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Failed to load profile',
          description: 'Could not fetch profile from server.',
          variant: 'destructive'
        });
      }
    };

    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedProfile({ ...profile }); // Reset edits
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.post('http://localhost:5000/update-profile', {
        ...editedProfile
      });

      if (response.data.success) {
        setProfile({ ...editedProfile });
        setIsEditing(false);
        toast({
          title: 'Profile updated',
          description: response.data.message
        });
      } else {
        toast({
          title: 'Update failed',
          description: response.data.message,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong while updating your profile.',
        variant: 'destructive'
      });
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/90 to-background">
      <DashboardNavbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Your Profile</h1>
          <p className="text-muted-foreground">Manage your personal information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-4 col-span-1">
            <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300 shadow-lg">
              <CardHeader className="flex flex-col items-center">
                <div className="w-32 h-32 mb-4">
                  <Avatar className="w-full h-full">
                    <AvatarFallback className="text-4xl bg-plum-gradient text-white">
                      {profile.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle>{profile.name}</CardTitle>
                <CardDescription>{profile.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">{profile.bio}</p>
                  <Button variant="outline" className="glow-effect w-full" onClick={handleEditToggle}>
                    {isEditing ? 'Cancel' : (<><Pencil className="mr-2 h-4 w-4" />Edit Profile</>)}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300 shadow-lg mt-6">
              <CardHeader>
                <CardTitle>Account Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member Since</span>
                    <span>June 2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Chat Sessions</span>
                    <span>42</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Journal Entries</span>
                    <span>15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mood Checks</span>
                    <span>28</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-8 col-span-1">
            <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300 shadow-lg">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>{isEditing ? 'Edit your information below' : 'Your personal details are shown below'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input id="name" name="name" value={editedProfile.name} onChange={handleInputChange} className="input-glow" />
                      ) : (
                        <div className="p-2 bg-muted/30 rounded-md">{profile.name}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      {isEditing ? (
                        <Input id="email" name="email" type="email" value={editedProfile.email} onChange={handleInputChange} className="input-glow" />
                      ) : (
                        <div className="p-2 bg-muted/30 rounded-md">{profile.email}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      {isEditing ? (
                        <Input id="dob" name="dob" type="date" value={editedProfile.dob} onChange={handleInputChange} className="input-glow" />
                      ) : (
                        <div className="p-2 bg-muted/30 rounded-md">
                          {new Date(profile.dob).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      {isEditing ? (
                        <Input id="location" name="location" value={editedProfile.location} onChange={handleInputChange} className="input-glow" />
                      ) : (
                        <div className="p-2 bg-muted/30 rounded-md">{profile.location}</div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                      <Input id="bio" name="bio" value={editedProfile.bio} onChange={handleInputChange} className="input-glow" />
                    ) : (
                      <div className="p-2 bg-muted/30 rounded-md">{profile.bio}</div>
                    )}
                  </div>
                </div>
              </CardContent>

              {isEditing && (
                <CardFooter>
                  <Button className="bg-plum-gradient hover:opacity-90 glow-effect" onClick={handleSaveProfile}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              )}
            </Card>

            <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300 shadow-lg mt-6">
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Manage your privacy preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Chat Data Storage', 'Analytics Consent', 'Email Notifications'].map((label, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{label}</p>
                        <p className="text-sm text-muted-foreground">Some preference details</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">Enable</Button>
                        <Button variant="ghost" size="sm">Disable</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
};

export default Profile;
