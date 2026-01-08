"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, CheckCircle2, Download, Home, Loader2, Share2, Calendar, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

export default function CongratulationsPage() {
  const [userMobile, setUserMobile] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isFetchingName, setIsFetchingName] = useState(false);
  const [certificatePreview, setCertificatePreview] = useState<string | null>(null);
  const [certId, setCertId] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const completionDate = new Date().toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    const mobile = localStorage.getItem("userMobile");
    const name = localStorage.getItem("userName");
    
    if (!mobile) {
      router.push("/register");
      return;
    }
    
    setUserMobile(mobile);
    
    if (name) {
      setUserName(name);
      triggerConfetti();
    } else {
      // Fallback: If name is missing from localStorage, fetch it from API
      const fetchUserName = async () => {
        setIsFetchingName(true);
        try {
          const response = await fetch("/api/check-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mobile }),
          });
          const data = await response.json();
          if (data.exists && data.user?.name) {
            setUserName(data.user.name);
            localStorage.setItem("userName", data.user.name);
            triggerConfetti();
          }
        } catch (error) {
          console.error("Error fetching user name:", error);
        } finally {
          setIsFetchingName(false);
        }
      };
      fetchUserName();
    }
  }, [router]);

  // Generate certificate ID when mobile or name is available
  useEffect(() => {
    if (userMobile) {
      const str = userMobile + (userName || "");
      let hashValue = 0;
      for (let i = 0; i < str.length; i++) {
        hashValue = ((hashValue << 5) - hashValue) + str.charCodeAt(i);
        hashValue |= 0;
      }
      const hash = Math.abs(hashValue).toString(36).toUpperCase().padStart(6, '0');
      setCertId(`PA-${hash}`);
    }
  }, [userMobile, userName]);

  const triggerConfetti = () => {
    const end = Date.now() + 3 * 1000;
    const colors = ["#006A4E", "#F42A41", "#ffffff"];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // Generate preview when userName is available
  useEffect(() => {
    if (userName) {
      generateCertificate(false);
    }
  }, [userName]);

  const generateCertificate = async (forDownload: boolean) => {
    if (!userName) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = "/certificate.png";

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the certificate template
      ctx.drawImage(img, 0, 0);

      // Wait for the calligraphy font to be ready
      try {
        await document.fonts.load("120px 'Galada'");
      } catch (e) {
        console.error("Font loading failed", e);
      }

      // Configure text style
      ctx.font = "120px 'Galada', cursive"; 
      ctx.fillStyle = "#1e40af"; // Dark blue color for the name
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Draw the name in the middle
      ctx.fillText(userName, img.width / 2, img.height / 2 + 80);

      const dataUrl = canvas.toDataURL('image/png');
      
      if (forDownload) {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `certificate-${userName}.png`;
        link.click();

        toast({
          title: "ডাউনলোড সফল",
          description: "আপনার সার্টিফিকেটটি ডাউনলোড করা হয়েছে",
        });
      } else {
        setCertificatePreview(dataUrl);
      }
    } catch (error) {
      console.error("Error generating certificate:", error);
      if (forDownload) {
        toast({
          title: "ত্রুটি",
          description: "সার্টিফিকেট তৈরি করতে সমস্যা হয়েছে",
          variant: "destructive",
        });
      }
    }
  };

  const downloadCertificate = () => {
    if (!userName) {
      if (isFetchingName) {
        toast({
          title: "অপেক্ষা করুন",
          description: "আপনার তথ্য লোড করা হচ্ছে...",
        });
        return;
      }
      toast({
        title: "ত্রুটি",
        description: "ব্যবহারকারীর নাম পাওয়া যায়নি। অনুগ্রহ করে আবার লগইন করুন।",
        variant: "destructive",
      });
      return;
    }
    generateCertificate(true);
  };

  const shareOnWhatsApp = () => {
    const text = `আমি সফলভাবে পোলিং এজেন্ট প্রশিক্ষণ সম্পন্ন করেছি! 🎉 আমার সার্টিফিকেট আইডি: ${certId}। আপনিও প্রশিক্ষণ নিতে পারেন এখানে:`;
    const url = window.location.origin;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
  };

  if (!userMobile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl space-y-6 md:space-y-8">
        {/* Main Achievement Card */}
        <Card className="overflow-hidden border-none shadow-2xl bg-white rounded-3xl">
          <div className="bg-bangladesh-green h-32 md:h-48 relative flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="relative z-10 text-center space-y-2 px-4">
              <div className="inline-flex p-2 md:p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-1 md:mb-2 animate-bounce">
                <Award className="w-8 h-8 md:w-12 md:h-12 text-white" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">অভিনন্দন!</h1>
            </div>
          </div>

          <CardContent className="p-4 md:p-10 -mt-6 md:-mt-10">
            <div className="bg-white rounded-2xl shadow-lg border p-5 md:p-8 space-y-6 md:space-y-8">
              <div className="text-center space-y-2 md:space-y-3">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
                  {userName || "প্রশিক্ষণার্থী"}
                </h2>
                <p className="text-slate-500 text-base md:text-lg max-w-md mx-auto leading-relaxed">
                  আপনি সফলভাবে পোলিং এজেন্ট প্রশিক্ষণ কোর্স সম্পন্ন করেছেন এবং আপনার যোগ্যতা প্রমাণ করেছেন।
                </p>
              </div>

              {/* Certificate & Stats Grid */}
              <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-center">
                {/* Certificate Preview */}
                <div className="space-y-4">
                  <div className="relative group max-w-[400px] mx-auto lg:max-w-none">
                    <div className="absolute -inset-1 bg-gradient-to-r from-bangladesh-green to-emerald-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative aspect-[1.414/1] bg-slate-100 rounded-lg overflow-hidden border-2 border-white shadow-xl">
                      {certificatePreview ? (
                        <img 
                          src={certificatePreview} 
                          alt="Certificate Preview" 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2">
                          <Loader2 className="w-8 h-8 animate-spin" />
                          <p className="text-xs">সার্টিফিকেট তৈরি হচ্ছে...</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      className="flex-1 bg-bangladesh-green hover:bg-bangladesh-green/90 text-white shadow-lg shadow-bangladesh-green/20 h-12 rounded-xl font-bold"
                      size="lg"
                      onClick={downloadCertificate}
                      disabled={isFetchingName || !certificatePreview}
                    >
                      <Download className="mr-2 h-5 w-5" />
                      ডাউনলোড করুন
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-slate-200 hover:bg-slate-50 h-12 rounded-xl font-bold text-slate-600"
                      size="lg"
                      onClick={shareOnWhatsApp}
                    >
                      <Share2 className="mr-2 h-5 w-5 text-bangladesh-green" />
                      শেয়ার করুন
                    </Button>
                  </div>
                </div>

                {/* Status & Details */}
                <div className="space-y-4 md:space-y-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
                    <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-bangladesh-green/10 flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-bangladesh-green" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">সার্টিফিকেট আইডি</p>
                        <p className="font-mono font-bold text-slate-700 text-sm md:text-base truncate">{certId || "---"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-bangladesh-green/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 md:w-6 md:h-6 text-bangladesh-green" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">ইস্যু তারিখ</p>
                        <p className="font-bold text-slate-700 text-sm md:text-base">{completionDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 md:p-6 rounded-xl bg-emerald-50 border border-emerald-100 space-y-3 md:space-y-4">
                    <h3 className="font-bold text-emerald-900 flex items-center gap-2 text-sm md:text-base">
                      <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                      প্রশিক্ষণ মাইলফলক
                    </h3>
                    <ul className="space-y-2 md:space-y-3">
                      {[
                        "ভিডিও ১: নির্বাচনী আইন ও বিধিবিধান",
                        "ভিডিও ২: ভোট গ্রহণ ও গণনা প্রক্রিয়া",
                        "চূড়ান্ত মূল্যায়ন ও স্বীকৃতি"
                      ].map((milestone, i) => (
                        <li key={i} className="flex items-center gap-3 text-[13px] md:text-sm text-emerald-800">
                          <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-emerald-500 flex-shrink-0" />
                          {milestone}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="space-y-4 pt-4 md:pt-6 border-t border-slate-100">
                <h3 className="font-bold text-lg md:text-xl text-slate-800 text-center md:text-left">পরবর্তী পদক্ষেপ</h3>
                <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                  {[
                    "আপনার এজেন্ট কার্ডটি প্রিন্ট করে সাথে রাখুন",
                    "নির্ধারিত সেন্টারে সময়মতো উপস্থিত থাকুন",
                    "ভোটের দিন পরিচয়পত্র সাথে রাখুন",
                    "অনিয়ম দেখলে দ্রুত রিপোর্ট করুন"
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                      <div className="mt-0.5 h-5 w-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 flex-shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-[13px] md:text-sm text-slate-600 leading-relaxed font-medium">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 md:pt-6">
                <Link href="/dashboard" className="flex-1">
                  <Button variant="ghost" size="lg" className="w-full text-slate-600 hover:bg-slate-100 h-12 rounded-xl font-bold">
                    <Home className="mr-2 h-5 w-5" />
                    ড্যাশবোর্ডে ফিরে যান
                  </Button>
                </Link>
                <Link href="/" className="flex-1">
                  <Button variant="ghost" size="lg" className="w-full text-slate-600 hover:bg-slate-100 h-12 rounded-xl font-bold">
                    প্রস্থান করুন
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-slate-500 text-[13px] md:text-sm px-4">
          বাংলাদেশের গণতন্ত্র রক্ষায় আপনার অবদানের জন্য ধন্যবাদ 🇧🇩
        </p>
      </div>
    </div>
  );
}

