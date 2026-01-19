"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Video, Download, PlayCircle, LogOut, LayoutDashboard, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

const VIDEO_1_ID = "Nn1jYscT3rs";
const VIDEO_2_ID = "WeCtW5fmM0g";
const VIDEO_3_ID = "1OsGrB96y70";
const VIDEO_4_ID = "QLGzbf1xnDk";
const VIDEO_5_ID = "6GaL-uDymAA";
const VIDEO_6_ID = "1_KCPBvbbGk";
const VIDEO_7_ID = "yeSPlyXmGAw";

export default function DashboardPage() {
  const [userMobile, setUserMobile] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [v1Completed, setV1Completed] = useState(false);
  const [v2Completed, setV2Completed] = useState(false);
  const [v3Completed, setV3Completed] = useState(false);
  const [v4Completed, setV4Completed] = useState(false);
  const [v5Completed, setV5Completed] = useState(false);
  const [v6Completed, setV6Completed] = useState(false);
  const [v7Completed, setV7Completed] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const mobile = localStorage.getItem("userMobile");
    const name = localStorage.getItem("userName");
    if (!mobile) {
      router.push("/register");
      return;
    }
    setUserMobile(mobile);
    setUserName(name);
    setV1Completed(localStorage.getItem("video1Completed") === "true");
    setV2Completed(localStorage.getItem("video2Completed") === "true");
    setV3Completed(localStorage.getItem("video3Completed") === "true");
    setV4Completed(localStorage.getItem("video4Completed") === "true");
    setV5Completed(localStorage.getItem("video5Completed") === "true");
    setV6Completed(localStorage.getItem("video6Completed") === "true");
    setV7Completed(localStorage.getItem("video7Completed") === "true");
    setIsReady(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  const progressValue = Math.round(
    ((v1Completed ? 1 : 0) + (v2Completed ? 1 : 0) + (v3Completed ? 1 : 0) + 
     (v4Completed ? 1 : 0) + (v5Completed ? 1 : 0) + (v6Completed ? 1 : 0) + 
     (v7Completed ? 1 : 0)) * 100 / 7
  );

  if (!isReady || !userMobile) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-xl bg-white">
              <Image 
                src="/logo.svg" 
                alt="Logo" 
                width={48} 
                height={48} 
                className="w-10 h-10 md:w-12 md:h-12"
              />
            </div>
            <h1 className="text-xl font-bold text-slate-800 hidden md:block">প্রশিক্ষণ ড্যাশবোর্ড</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800">{userName || "প্রশিক্ষণার্থী"}</p>
              <p className="text-xs text-slate-500">{userMobile}</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-slate-500 hover:text-bangladesh-red hover:bg-bangladesh-red/5"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 md:py-12 space-y-10 flex-1">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* Course Title */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 text-center">
            <h2 className="text-lg md:text-xl font-bold text-slate-800">
              কোর্স নাম: ত্রয়োদশ জাতীয় সংসদ নির্বাচন উপলক্ষ্যে নির্বাচনী ও পোলিং এজেন্টদের প্রশিক্ষণ কর্মশালা
            </h2>
          </div>
          
          {/* Progress Section */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="p-6 md:p-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center text-center md:text-left">
              <div className="relative w-24 h-24 md:w-40 md:h-40 flex-shrink-0">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle className="text-slate-100" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                  <circle className="text-bangladesh-green transition-all duration-1000 ease-in-out" strokeWidth="8" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * progressValue) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl md:text-3xl font-black text-slate-800">{progressValue}%</span>
                  <span className="text-[8px] md:text-[10px] uppercase font-bold text-slate-400">অগ্রগতি</span>
                </div>
              </div>

              <div className="flex-1 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 w-full">
                <div className="space-y-2">
                  <h2 className="text-xl md:text-3xl font-bold text-slate-800 leading-tight">
                    {progressValue === 100 ? "অভিনন্দন! আপনার প্রশিক্ষণ শেষ।" : "আপনার প্রশিক্ষণ চালিয়ে যান"}
                  </h2>
                  <p className="text-slate-500 text-base md:text-lg">
                    {progressValue === 100 
                      ? "আপনার সার্টিফিকেটটি এখন সংগ্রহের জন্য প্রস্তুত।" 
                      : "সার্টিফিকেট পেতে সকল ভিডিও সম্পূর্ণ দেখা প্রয়োজন।"}
                  </p>
                </div>
                
                <div className="flex-shrink-0 w-full md:w-auto">
                  {progressValue === 100 ? (
                    <Link href="/congratulations">
                      <Button className="w-full md:w-auto bg-bangladesh-green hover:bg-bangladesh-green/90 h-12 md:h-14 px-6 md:px-8 rounded-2xl text-base md:text-lg font-bold shadow-lg shadow-bangladesh-green/20">
                        <Download className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                        সার্টিফিকেট সংগ্রহ করুন
                      </Button>
                    </Link>
                  ) : (
                    <div className="flex flex-wrap justify-center md:justify-end gap-2 md:gap-3">
                      {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                        const completed = [v1Completed, v2Completed, v3Completed, v4Completed, v5Completed, v6Completed, v7Completed][num - 1];
                        return (
                          <div key={num} className={cn("px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-1", completed ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-100 text-slate-400 border border-slate-200")}>
                            <CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5" /> {num}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Videos Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                id: 1,
                videoId: VIDEO_1_ID,
                title: "ইন্ট্রো: নির্বাচনী ও পোলিং এজেন্ট প্রশিক্ষণ কর্মশালায় স্বাগতম",
                desc: "প্রশিক্ষণ কর্মশালার পরিচিতি ও গুরুত্ব",
                completed: v1Completed,
                unlocked: true,
                href: "/video-1"
              },
              {
                id: 2,
                videoId: VIDEO_2_ID,
                title: "পর্ব ০১: নির্বাচনী ও পোলিং এর নিয়োগের সঠিক পদ্ধতি",
                desc: "নির্বাচনী ও পোলিং এজেন্ট নিয়োগের সঠিক পদ্ধতি",
                completed: v2Completed,
                unlocked: v1Completed,
                href: "/video-2"
              },
              {
                id: 3,
                videoId: VIDEO_3_ID,
                title: "পর্ব ০২: পোলিং এজেন্ট এর নির্দেশিকা",
                desc: "পোলিং এজেন্ট হিসেবে আপনার নির্দেশিকা ও দায়িত্ব",
                completed: v3Completed,
                unlocked: v2Completed,
                href: "/video-3"
              },
              {
                id: 4,
                videoId: VIDEO_4_ID,
                title: "পর্ব ০৩: ভোট চলাকালীন নজরদারি ও অনিয়ম",
                desc: "ভোট গ্রহণের সময় নজরদারি ও অনিয়ম",
                completed: v4Completed,
                unlocked: v3Completed,
                href: "/video-4"
              },
              {
                id: 5,
                videoId: VIDEO_5_ID,
                title: "পর্ব ০৪: ভোট গণনা ও ফলাফল সংগ্রহ প্রক্রিয়া",
                desc: "ভোট গণনা ও ফলাফল সংগ্রহ প্রক্রিয়া",
                completed: v5Completed,
                unlocked: v4Completed,
                href: "/video-5"
              },
              {
                id: 6,
                videoId: VIDEO_6_ID,
                title: "পর্ব ০৫: ফলাফল এবং ব্যয়ের হিসাব দাখিল",
                desc: "ফলাফল এবং ব্যয়ের হিসাব দাখিল প্রক্রিয়া",
                completed: v6Completed,
                unlocked: v5Completed,
                href: "/video-6"
              },
              {
                id: 7,
                videoId: VIDEO_7_ID,
                title: "পর্ব ০৬: ভোট পরবর্তী প্যাকেট পরিচিতি",
                desc: "ভোট পরবর্তী প্যাকেট সম্পর্কে জানুন",
                completed: v7Completed,
                unlocked: v6Completed,
                href: "/video-7"
              }
            ].map((v) => (
              <Card key={v.id} className={cn(
                "border-none shadow-xl shadow-slate-200/50 overflow-hidden transition-all duration-300 group",
                !v.unlocked && "opacity-60"
              )}>
                <div className="aspect-video relative overflow-hidden bg-slate-900">
                  {v.unlocked ? (
                    <img 
                      src={`https://img.youtube.com/vi/${v.videoId}/maxresdefault.jpg`}
                      alt={v.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40 bg-slate-900 px-4 text-center">
                      <Clock className="w-10 h-10 md:w-12 md:h-12 mb-2" />
                      <p className="font-bold text-sm md:text-base">আগের ভিডিওটি আগে দেখা প্রয়োজন</p>
                    </div>
                  )}
                  
                  {v.completed && (
                    <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-emerald-500 text-white px-2.5 py-1 rounded-full text-[10px] md:text-xs font-black flex items-center gap-1.5 shadow-xl z-10">
                      <CheckCircle2 className="w-3 md:w-3.5 h-3 md:h-3.5" />
                      সম্পন্ন
                    </div>
                  )}

                  {v.unlocked && (
                    <Link href={v.href} className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform border border-white/30 shadow-2xl">
                        <PlayCircle className="w-8 h-8 md:w-10 md:h-10 text-white" />
                      </div>
                    </Link>
                  )}
                </div>

                <div className="p-5 md:p-6 space-y-3 md:space-y-4">
                  <div className="flex justify-between items-start gap-3 md:gap-4">
                    <div className="space-y-1">
                      <h3 className="text-lg md:text-xl font-bold text-slate-800 leading-tight">{v.title}</h3>
                      <p className="text-slate-500 text-xs md:text-sm line-clamp-2">{v.desc}</p>
                    </div>
                    {v.unlocked && (
                      <Link href={v.href}>
                        <Button variant="outline" size="sm" className={cn(
                          "rounded-xl px-4 py-1.5 h-auto text-xs font-bold",
                          v.completed 
                            ? "border-slate-200 text-slate-600 hover:bg-slate-50" 
                            : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        )}>
                          {v.completed ? "আবার দেখুন" : "শুরু করুন"}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>


        </div>
      </main>
      
      <footer className="py-8 text-center text-slate-400 text-sm">
        বাংলাদেশের গণতন্ত্র রক্ষায় আপনার অবদানের জন্য ধন্যবাদ 🇧🇩
      </footer>
    </div>
  );
}


