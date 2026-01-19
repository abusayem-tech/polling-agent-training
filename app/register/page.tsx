"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Phone, User, MapPin, Building, ShieldCheck, CreditCard, ArrowRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { isValidBangladeshiMobile, cn } from "@/lib/utils";
import Image from "next/image";

export default function RegisterPage() {
  const [step, setStep] = useState<"mobile" | "details">("mobile");
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    nid: "",
    address: "",
    pollingCenter: "",
  });
  const { toast } = useToast();
  const router = useRouter();

  const handleMobileCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMobile = mobile.trim();
    
    if (!trimmedMobile || !isValidBangladeshiMobile(trimmedMobile)) {
      toast({
        title: "ত্রুটি",
        description: "অনুগ্রহ করে একটি বৈধ বাংলাদেশী মোবাইল নম্বর প্রদান করুন (01XXXXXXXXX)",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: trimmedMobile }),
      });
      const data = await response.json();

      if (data.exists) {
        localStorage.setItem("userMobile", trimmedMobile);
        if (data.user.name) localStorage.setItem("userName", data.user.name);
        localStorage.setItem("video1Completed", String(data.user.video1Completed || false));
        localStorage.setItem("video2Completed", String(data.user.video2Completed || false));
        localStorage.setItem("video3Completed", String(data.user.video3Completed || false));
        localStorage.setItem("video4Completed", String(data.user.video4Completed || false));
        localStorage.setItem("video5Completed", String(data.user.video5Completed || false));
        localStorage.setItem("video6Completed", String(data.user.video6Completed || false));
        localStorage.setItem("video7Completed", String(data.user.video7Completed || false));
        
        toast({
          title: "স্বাগতম!",
          description: "আপনার অ্যাকাউন্ট পাওয়া গেছে। ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...",
        });
        router.push("/dashboard");
      } else {
        setStep("details");
        toast({
          title: "নতুন ব্যবহারকারী",
          description: "অনুগ্রহ করে আপনার তথ্য দিয়ে রেজিস্ট্রেশন সম্পন্ন করুন",
        });
      }
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "সার্ভার সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFullRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.nid || !formData.address || !formData.pollingCenter) {
      toast({ title: "ত্রুটি", description: "অনুগ্রহ করে সকল তথ্য পূরণ করুন", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, ...formData }),
      });

      if (response.ok) {
        localStorage.setItem("userMobile", mobile);
        localStorage.setItem("userName", formData.name);
        localStorage.setItem("video1Completed", "false");
        localStorage.setItem("video2Completed", "false");
        localStorage.setItem("video3Completed", "false");
        localStorage.setItem("video4Completed", "false");
        localStorage.setItem("video5Completed", "false");
        localStorage.setItem("video6Completed", "false");
        localStorage.setItem("video7Completed", "false");
        
        toast({ title: "সফল!", description: "নিবন্ধন সম্পন্ন হয়েছে। প্রশিক্ষণ শুরু করা যাক!" });
        router.push("/video-1");
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      toast({ title: "ত্রুটি", description: "নিবন্ধনে সমস্যা হয়েছে। আবার চেষ্টা করুন।", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-xl space-y-8">
        {/* Progress Header */}
        <div className="flex justify-between items-center px-4">
          {[
            { id: "mobile", label: "যাচাইকরণ", icon: Phone },
            { id: "details", label: "নিবন্ধন", icon: User }
          ].map((s, i) => (
            <div key={s.id} className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                step === s.id ? "border-bangladesh-green bg-bangladesh-green text-white shadow-lg scale-110" : 
                (i === 0 && step === "details") ? "border-bangladesh-green bg-bangladesh-green/10 text-bangladesh-green" : "border-slate-200 bg-white text-slate-400"
              )}>
                <s.icon className="w-5 h-5" />
              </div>
              <span className={cn(
                "text-sm font-bold hidden sm:block",
                step === s.id ? "text-bangladesh-green" : "text-slate-400"
              )}>{s.label}</span>
              {i === 0 && <div className="h-px w-12 md:w-24 bg-slate-200 mx-2" />}
            </div>
          ))}
        </div>

        <Card className="border-none shadow-2xl overflow-hidden bg-white">
          <div className="bg-bangladesh-green h-24 relative flex items-center justify-center">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <h1 className="text-2xl font-bold text-white relative z-10">প্রশিক্ষণার্থী নিবন্ধন</h1>
          </div>

          <CardContent className="p-6 md:p-10">
            {step === "mobile" ? (
              <form onSubmit={handleMobileCheck} className="space-y-6">
                <div className="space-y-4">
                  <div className="text-center space-y-2 mb-6">
                    <h2 className="text-xl font-bold text-slate-800">আপনার মোবাইল নম্বর দিন</h2>
                    <p className="text-slate-500">আমরা আপনার অ্যাকাউন্টের স্থিতি যাচাই করব</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mobile" className="text-slate-700 font-bold">মোবাইল নম্বর</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="pl-12 h-14 text-lg border-slate-200 focus:border-bangladesh-green focus:ring-bangladesh-green/20 rounded-xl"
                        maxLength={11}
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-bangladesh-green hover:bg-bangladesh-green/90 h-14 text-lg font-bold rounded-xl shadow-lg shadow-bangladesh-green/20" disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      পরবর্তী ধাপ
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleFullRegistration} className="space-y-6">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700 font-bold">সম্পূর্ণ নাম *</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="name"
                        placeholder="আপনার নাম লিখুন"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-12 h-12 border-slate-200 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nid" className="text-slate-700 font-bold">জাতীয় পরিচয়পত্র নাম্বার *</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="nid"
                        placeholder="NID নম্বর লিখুন"
                        value={formData.nid}
                        onChange={(e) => setFormData({ ...formData, nid: e.target.value })}
                        className="pl-12 h-12 border-slate-200 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pollingCenter" className="text-slate-700 font-bold">নির্বাচনী আসন *</Label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="pollingCenter"
                        placeholder="নির্বাচনী আসন লিখুন"
                        value={formData.pollingCenter}
                        onChange={(e) => setFormData({ ...formData, pollingCenter: e.target.value })}
                        className="pl-12 h-12 border-slate-200 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-slate-700 font-bold">ঠিকানা *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
                      <textarea
                        id="address"
                        placeholder="আপনার ঠিকানা লিখুন"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full min-h-[100px] pl-12 p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bangladesh-green/20 focus:border-bangladesh-green transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep("mobile")}
                    className="flex-1 h-14 font-bold text-slate-500 hover:bg-slate-100"
                    disabled={loading}
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    পিছনে
                  </Button>
                  <Button
                    type="submit"
                    className="flex-[2] bg-bangladesh-green hover:bg-bangladesh-green/90 h-14 text-lg font-bold rounded-xl shadow-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "নিবন্ধন সম্পন্ন করুন"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
          <ShieldCheck className="w-4 h-4" />
          আপনার তথ্য সম্পূর্ণ সুরক্ষিত
        </div>
      </div>
    </div>
  );
}


