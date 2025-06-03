import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/primitives/input";
import { Textarea } from "@/core/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/core/components/ui/avatar";
import { Badge } from "@/core/components/ui/primitives/badge";
import { useToast } from "@/hooks";
import { User, Upload, Building, MapPin, Phone, Mail } from "lucide-react";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  position: z.string().optional(),
  department: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().max(500, "Bio must not exceed 500 characters").optional(),
  timezone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileSettings() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@araratoil.com",
      phone: "+1 (555) 123-4567",
      position: "Senior Engineer",
      department: "Engineering",
      location: "Houston, TX",
      bio: "Experienced petroleum engineer with 10+ years in the industry.",
      timezone: "America/Chicago",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: t("settings.profileUpdated", "Profile updated"),
        description: t("settings.profileUpdatedDescription", "Your profile has been updated successfully."),
      });
    } catch (error) {
      toast({
        title: t("common.error", "Error"),
        description: t("settings.profileUpdateError", "Failed to update profile. Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const timezones = [
    { value: "America/New_York", label: "Eastern Time" },
    { value: "America/Chicago", label: "Central Time" },
    { value: "America/Denver", label: "Mountain Time" },
    { value: "America/Los_Angeles", label: "Pacific Time" },
    { value: "Europe/London", label: "GMT" },
    { value: "Europe/Berlin", label: "Central European Time" },
    { value: "Asia/Tokyo", label: "Japan Standard Time" },
  ];

  const departments = [
    "Engineering",
    "Operations",
    "Finance",
    "Human Resources",
    "Safety & Environment",
    "Geology",
    "Drilling",
    "Production",
    "Maintenance",
    "IT",
  ];

  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t("settings.profilePicture", "Profile Picture")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarPreview || "/placeholder-avatar.jpg"} />
              <AvatarFallback className="text-2xl">
                {form.watch("firstName")?.[0]}{form.watch("lastName")?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" size="sm" asChild>
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  {t("settings.uploadPhoto", "Upload Photo")}
                </label>
              </Button>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <p className="text-xs text-muted-foreground">
                {t("settings.avatarHelp", "Recommended: Square image, at least 400x400px")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t("settings.basicInformation", "Basic Information")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("settings.firstName", "First Name")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("settings.lastName", "Last Name")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {t("settings.email", "Email")}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
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
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {t("settings.phone", "Phone")}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("settings.position", "Position")}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Senior Engineer" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        {t("settings.department", "Department")}
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {t("settings.location", "Location")}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Houston, TX" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("settings.timezone", "Timezone")}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timezones.map((tz) => (
                            <SelectItem key={tz.value} value={tz.value}>
                              {tz.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("settings.bio", "Bio")}</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Tell us a bit about yourself..."
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                    <div className="text-xs text-muted-foreground text-right">
                      {field.value?.length || 0} / 500
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? t("common.saving", "Saving...") : t("common.save", "Save Changes")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.accountStatus", "Account Status")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {t("settings.emailVerified", "Email Verified")}
            </Badge>
            <Badge variant="outline">
              {t("settings.memberSince", "Member since")} Jan 2023
            </Badge>
            <Badge variant="default">
              {t("settings.activeEmployee", "Active Employee")}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 