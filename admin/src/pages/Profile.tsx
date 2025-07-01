
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Camera, 
  Building, 
  UserPlus, 
  Globe,
  Check,
  X
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  bio: z.string().max(500, "Bio cannot exceed 500 characters.").optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url("Invalid URL.").optional().or(z.string().length(0)),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      jobTitle: "Admin",
      company: "AdminDash Inc.",
      bio: "Experienced administrator with a passion for user experience and data management.",
      phone: "+1 (555) 123-4567",
      location: "New York, USA",
      website: "https://admindash.example.com",
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
    console.log("Profile updated:", data);
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and account.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto relative">
                <Avatar className="h-28 w-28">
                  <AvatarImage src="" alt={user?.name || "User"} />
                  <AvatarFallback className="text-3xl bg-purple-200 text-purple-700">
                    {user?.name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                {isEditingAvatar ? (
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 rounded-full">
                    <Button variant="ghost" size="icon" className="text-white h-8 w-8"
                      onClick={() => setIsEditingAvatar(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                    <Button size="icon" className="bg-green-600 hover:bg-green-700 h-8 w-8"
                      onClick={() => setIsEditingAvatar(false)}>
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                    onClick={() => setIsEditingAvatar(true)}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <CardTitle className="mt-4">{user?.name || "Admin User"}</CardTitle>
              <CardDescription>{form.getValues().jobTitle || "Admin"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 opacity-70" />
                  <span className="text-sm">{user?.email || "admin@example.com"}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 opacity-70" />
                  <span className="text-sm">{form.getValues().phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 opacity-70" />
                  <span className="text-sm">{form.getValues().location}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="mr-2 h-4 w-4 opacity-70" />
                  <a href={form.getValues().website} target="_blank" rel="noopener noreferrer" 
                     className="text-sm text-purple-600 hover:underline">
                    Personal Website
                  </a>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <div className="w-full">
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Account Type</span>
                  </div>
                  <span className="text-sm font-medium">{user?.role || "Admin"}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Member Since</span>
                  </div>
                  <span className="text-sm">April 2023</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-4">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Personal Info</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span>Work Info</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details here.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Your email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Your phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="City, Country" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input placeholder="https://your-website.com" {...field} />
                            </FormControl>
                            <FormDescription>
                              Your personal or portfolio website.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us about yourself" 
                                className="min-h-[120px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Brief description about yourself. Maximum 500 characters.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit">Save Changes</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Work Information</CardTitle>
                  <CardDescription>
                    Update your professional details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="jobTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Your job title" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company</FormLabel>
                              <FormControl>
                                <Input placeholder="Your company" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium">Team Access</h3>
                          <p className="text-sm text-muted-foreground">
                            Manage your team access and permissions.
                          </p>
                        </div>

                        <div className="flex flex-col gap-4">
                          <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <Label className="text-base">Team Members</Label>
                              <p className="text-sm text-muted-foreground">
                                Invite new team members to collaborate.
                              </p>
                            </div>
                            <Button variant="outline" className="flex items-center gap-2">
                              <UserPlus className="h-4 w-4" />
                              <span>Invite</span>
                            </Button>
                          </div>
                        </div>
                      </div>

                      <Button type="submit">Save Changes</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
