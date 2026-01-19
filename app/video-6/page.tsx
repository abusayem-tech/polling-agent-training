"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Loader2, Video, PlayCircle, ArrowRight, Clock, ShieldCheck, ChevronLeft, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

const VIDEO_6_PLAY_DURATION = 5;
const VIDEO_6_ID = "1_KCPBvbbGk";

export default function Video6Page() {
  const [userMobile, setUserMobile] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [v5Completed, setV5Completed] = useState(false);
  const [v6Completed, setV6Completed] = useState(false);
  const [playTimer, setPlayTimer] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const mobile = localStorage.getItem("userMobile");
    const name = localStorage.getItem("userName");
    const v5 = localStorage.getItem("video5Completed") === "true";
    
    if (!mobile) {
      router.push("/register");
      return;
    }
    
    if (!v5) {
      router.push("/video-5");
      return;
    }

    setUserMobile(mobile);
    setUserName(name);
    setV5Completed(v5);
    setV6Completed(localStorage.getItem("video6Completed") === "true");
    setIsReady(true);
  }, [router]);

  useEffect(() => {
    if (!isReady || v6Completed) return;
    const interval = setInterval(() => {
      setPlayTimer((prev) => {
        if (prev >= VIDEO_6_PLAY_DURATION) {
          clearInterval(interval);
          return VIDEO_6_PLAY_DURATION;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isReady, v6Completed]);

  const handleVideo6Complete = async () => {
    if (isSubmitting || v6Completed) return;
    setIsSubmitting(true);
    try {
      setV6Completed(true);
      localStorage.setItem("video6Completed", "true");
      toast({ title: "দারুণ!", description: "ভিডিও ৬ সফলভাবে সম্পন্ন হয়েছে। পরবর্তী ভিডিও শুরু করুন।" });
      
      // Save to backend
      fetch("/api/complete-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: userMobile, videoNumber: 6 }),
      });

      router.push("/video-7");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isReady || !userMobile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-bangladesh-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 h-14 md:h-16 flex items-center px-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-1 md:gap-2 text-slate-600 hover:text-bangladesh-green transition-colors">
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span className="font-bold text-xs sm:text-sm md:text-base hidden sm:inline">ড্যাশবোর্ড</span>
          </Link>
          <div className="flex-1 flex justify-center max-w-[120px] md:max-w-[200px]">
            <div className="flex items-center gap-2 w-full">
              <div className="h-1.5 md:h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-bangladesh-green transition-all duration-500" 
                  style={{ width: v6Completed ? "85.68%" : "85.68%" }}
                />
              </div>
              <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-slate-400 whitespace-nowrap">ভিডিও ৬/৭</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <Image 
              src="/logo.svg" 
              alt="Logo" 
              width={48} 
              height={48} 
              className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12"
            />
            <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest hidden sm:inline">Training</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-12 flex-1">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Main Video Section */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
            <div className="space-y-1 sm:space-y-2 text-center md:text-left">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-slate-800 leading-tight">পর্ব ০৫: ফলাফল এবং ব্যয়ের হিসাব দাখিল</h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-500">ফলাফল এবং ব্যয়ের হিসাব দাখিল প্রক্রিয়া সম্পর্কে জানুন।</p>
            </div>

            <Card className="border-none shadow-2xl shadow-slate-200/50 overflow-hidden bg-black aspect-video relative">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${VIDEO_6_ID}?autoplay=1&modestbranding=1&rel=0`}
                title="Training Video 6"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0"
              ></iframe>
            </Card>

            <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 md:gap-6">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
                <div className={cn(
                  "w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex-shrink-0 flex items-center justify-center transition-colors",
                  v6Completed ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
                )}>
                  {v6Completed ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> : <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-xs sm:text-sm md:text-base text-slate-800">অ্যাকশন বাটন</p>
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-500">ভিডিও শেষ হলে বাটনটি সক্রিয় হবে</p>
                </div>
              </div>

              {!v6Completed ? (
                <Button
                  onClick={handleVideo6Complete}
                  disabled={isSubmitting || playTimer < VIDEO_6_PLAY_DURATION}
                  className="w-full sm:w-auto bg-bangladesh-green hover:bg-bangladesh-green/90 h-11 md:h-12 px-6 rounded-xl font-bold shadow-lg shadow-bangladesh-green/20 text-xs sm:text-sm md:text-base"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                  ) : playTimer < VIDEO_6_PLAY_DURATION ? (
                    `অপেক্ষা করুন (${VIDEO_6_PLAY_DURATION - playTimer}s)`
                  ) : (
                    <>সম্পন্ন করেছি <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" /></>
                  )}
                </Button>
              ) : (
                <Link href="/video-7" className="w-full sm:w-auto">
                  <Button className="w-full bg-bangladesh-green hover:bg-bangladesh-green/90 h-11 md:h-12 px-6 rounded-xl font-bold shadow-lg shadow-bangladesh-green/20 text-xs sm:text-sm md:text-base">
                    পরবর্তী ভিডিও <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar / Info */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="border-none shadow-xl shadow-slate-200/50 p-4 sm:p-6 space-y-4 sm:space-y-6 bg-white">
              <h3 className="font-bold text-sm sm:text-base text-slate-800 flex items-center gap-2">
                <Video className="w-4 h-4 sm:w-5 sm:h-5 text-bangladesh-green" />
                প্রশিক্ষণ সূচী
              </h3>
              
              <div className="space-y-2 sm:space-y-3">
                {[
                  { id: 1, title: "ইন্ট্রো: নির্বাচনী ও পোলিং এজেন্ট প্রশিক্ষণ কর্মশালায় স্বাগতম", duration: "", active: false, done: true },
                  { id: 2, title: "পর্ব ০১: নির্বাচনী ও পোলিং এর নিয়োগের সঠিক পদ্ধতি", duration: "", active: false, done: true },
                  { id: 3, title: "পর্ব ০২: পোলিং এজেন্ট এর নির্দেশিকা", duration: "", active: false, done: true },
                  { id: 4, title: "পর্ব ০৩: ভোট চলাকালীন নজরদারি ও অনিয়ম", duration: "", active: false, done: true },
                  { id: 5, title: "পর্ব ০৪: ভোট গণনা ও ফলাফল সংগ্রহ প্রক্রিয়া", duration: "", active: false, done: true },
                  { id: 6, title: "পর্ব ০৫: ফলাফল এবং ব্যয়ের হিসাব দাখিল", duration: "", active: true, done: v6Completed },
                  { id: 7, title: "পর্ব ০৬: ভোট পরবর্তী প্যাকেট পরিচিতি", duration: "", active: false, done: false }
                ].map((item) => (
                  <div key={item.id} className={cn(
                    "p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl flex items-start gap-2 sm:gap-3 border-2 transition-all",
                    item.active ? "border-bangladesh-green bg-bangladesh-green/5" : "border-slate-50 bg-slate-50 opacity-60"
                  )}>
                    <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className={cn(
                        "w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center text-[10px] sm:text-xs font-bold flex-shrink-0",
                        item.done ? "bg-emerald-500 text-white" : item.active ? "bg-bangladesh-green text-white" : "bg-slate-200 text-slate-500"
                      )}>
                        {item.done ? <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" /> : item.id}
                      </div>
                      <span className={cn("text-xs sm:text-sm font-bold leading-tight", item.active ? "text-slate-800" : "text-slate-500")}>{item.title}</span>
                    </div>
                    {item.duration && <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 flex-shrink-0">{item.duration}</span>}
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 leading-relaxed italic">
                  * অনুগ্রহ করে ভিডিওটি সম্পূর্ণ দেখুন। ভিডিও টেনে দেখলে বা বন্ধ করলে প্রগতি সংরক্ষিত হবে না।
                </p>
              </div>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
}
