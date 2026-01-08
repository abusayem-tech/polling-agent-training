"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Video, Download, PlayCircle, LogOut, LayoutDashboard, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const VIDEO_1_ID = "aNdPC_OpAQQ";
const VIDEO_2_ID = "salY_Sm6mv4";

export default function DashboardPage() {
  const [userMobile, setUserMobile] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [v1Completed, setV1Completed] = useState(false);
  const [v2Completed, setV2Completed] = useState(false);
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
    setIsReady(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  const progressValue = (v1Completed ? 50 : 0) + (v2Completed ? 50 : 0);

  if (!isReady || !userMobile) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-bangladesh-green p-2 rounded-xl">
              <LayoutDashboard className="w-6 h-6 text-white" />
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
                      : "সার্টিফিকেট পেতে দুটি ভিডিও সম্পূর্ণ দেখা প্রয়োজন।"}
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
                    <div className="flex justify-center md:justify-end gap-2 md:gap-3">
                      <div className={cn("px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold flex items-center gap-1.5 md:gap-2", v1Completed ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-100 text-slate-400 border border-slate-200")}>
                        <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4" /> ভিডিও ১
                      </div>
                      <div className={cn("px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold flex items-center gap-1.5 md:gap-2", v2Completed ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-100 text-slate-400 border border-slate-200")}>
                        <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4" /> ভিডিও ২
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Videos Grid */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {[
              {
                id: 1,
                videoId: VIDEO_1_ID,
                title: "প্রশিক্ষণ ভিডিও ১",
                desc: "পোলিং এজেন্টের মূল দায়িত্ব ও কর্তব্য",
                completed: v1Completed,
                unlocked: true,
                href: "/video-1"
              },
              {
                id: 2,
                videoId: VIDEO_2_ID,
                title: "প্রশিক্ষণ ভিডিও ২",
                desc: "নির্বাচনী কার্যক্রম পর্যবেক্ষণ ও রিপোর্টিং",
                completed: v2Completed,
                unlocked: v1Completed,
                href: "/video-2"
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
                    <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-emerald-500 text-white px-2.5 py-1 rounded-full text-[10px] md:text-xs font-black flex items-center gap-1.5 shadow-xl">
                      <CheckCircle2 className="w-3 md:w-3.5 h-3 md:h-3.5" />
                      সম্পন্ন
                    </div>
                  )}

                  {v.unlocked && !v.completed && (
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
                    {v.unlocked && !v.completed && (
                      <Link href={v.href}>
                        <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 rounded-xl px-4 py-1.5 h-auto text-xs font-bold">
                          শুরু করুন
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Help Section */}
          <div className="bg-emerald-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-2xl font-bold">যেকোনো প্রয়োজনে সহায়তা নিন</h3>
                <p className="text-emerald-100/70">আমাদের সাপোর্ট টিম আপনার সহায়তায় সবসময় পাশে আছে।</p>
              </div>
              <div className="flex gap-4">
                <a href="mailto:contact@abusayem.me">
                  <Button variant="outline" className="border-white/20 bg-white/10 hover:bg-white/20 text-white h-12 px-6 rounded-xl">
                    contact@abusayem.me
                  </Button>
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>
      
      <footer className="py-8 text-center text-slate-400 text-sm">
        বাংলাদেশের গণতন্ত্র রক্ষায় আপনার অবদানের জন্য ধন্যবাদ 🇧🇩
      </footer>
    </div>
  );
}


