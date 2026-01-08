"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Users, Video, Award, ShieldCheck, ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    const mobile = localStorage.getItem("userMobile");
    if (mobile) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <div className="bg-bangladesh-green relative overflow-hidden py-12 md:py-24">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center space-y-4 md:space-y-6">
          <div className="inline-flex p-2 md:p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-2 md:mb-4 animate-bounce">
            <ShieldCheck className="w-8 h-8 md:w-14 md:h-14 text-white" />
          </div>
          <h1 className="text-3xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            পোলিং এজেন্ট <span className="text-yellow-400 font-black">প্রশিক্ষণ</span>
          </h1>
          <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto font-medium px-2">
            বাংলাদেশের গণতন্ত্র রক্ষায় আপনার ভূমিকা নিশ্চিত করুন। প্রশিক্ষিত হোন, সঠিক দায়িত্ব পালন করুন।
          </p>
          <div className="pt-6 md:pt-8">
            <Link href="/register">
              <Button size="lg" className="bg-white text-bangladesh-green hover:bg-slate-100 text-lg md:text-xl h-14 md:h-16 px-8 md:px-10 rounded-full shadow-2xl hover:scale-105 transition-transform font-bold group">
                প্রশিক্ষণ শুরু করুন
                <ArrowRight className="ml-2 w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-12 md:-mt-16 pb-20 relative z-20">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Stats/Features Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                icon: Users, 
                title: "সহজ নিবন্ধন", 
                desc: "মাত্র ১ মিনিটে মোবাইল নম্বর দিয়ে শুরু করুন",
                color: "bg-blue-50 text-blue-600"
              },
              { 
                icon: Video, 
                title: "ভিডিও লার্নিং", 
                desc: "সহজ সাবলীল ভাষায় দুটি ভিডিও দেখে শিখুন",
                color: "bg-purple-50 text-purple-600"
              },
              { 
                icon: Award, 
                title: "ডিজিটাল সার্টিফিকেট", 
                desc: "সাফল্যের সাথে সম্পন্ন করে সার্টিফিকেট নিন",
                color: "bg-emerald-50 text-emerald-600"
              }
            ].map((feature, i) => (
              <Card key={i} className="border-none shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 rounded-2xl ${feature.color}`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{feature.title}</h3>
                  <p className="text-slate-500">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Info Section */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
            <div className="grid md:grid-cols-2">
              <div className="p-6 md:p-12 space-y-6 md:space-y-8">
                <div className="space-y-3 md:space-y-4 text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800">আপনি যা শিখবেন</h2>
                  <p className="text-slate-500 text-base md:text-lg leading-relaxed">
                    এই প্রশিক্ষণ প্রোগ্রামটি পোলিং এজেন্টদের দায়িত্ব ও নির্বাচনী আইন সম্পর্কে পূর্ণ ধারণা দেওয়ার জন্য ডিজাইন করা হয়েছে।
                  </p>
                </div>

                <div className="space-y-3 md:space-y-4">
                  {[
                    "পোলিং এজেন্টের আইনি অধিকার ও সুরক্ষা",
                    "ভোট গ্রহণের সঠিক পদ্ধতি পর্যবেক্ষণ",
                    "ভোট গণনা এবং ফলাফলের সঠিকতা নিশ্চিতকরণ",
                    "যেকোনো অনিয়মে তাৎক্ষণিক রিপোর্ট করার প্রক্রিয়া"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                      <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-bangladesh-green flex-shrink-0" />
                      <span className="font-medium text-sm md:text-base text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 p-8 md:p-12 flex flex-col justify-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
                <div className="relative z-10 space-y-4 md:space-y-6 text-center md:text-left flex flex-col items-center md:items-start">
                  <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-bangladesh-red/20 text-bangladesh-red border border-bangladesh-red/30 text-sm font-bold animate-pulse">
                    <Play className="w-4 h-4 fill-current" />
                    এখনই দেখুন
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold">প্রশিক্ষণ শুরু করতে প্রস্তুত?</h3>
                  <p className="text-slate-400 text-base md:text-lg">
                    আপনার যাত্রা শুরু করতে নিচের বাটনে ক্লিক করুন। আমরা আপনাকে ধাপে ধাপে পূর্ণ প্রশিক্ষণ প্রদান করব।
                  </p>
                  <Link href="/register" className="w-full pt-2 md:pt-4">
                    <Button size="lg" className="w-full bg-bangladesh-red hover:bg-bangladesh-red/90 text-white h-12 md:h-14 rounded-xl font-bold text-lg">
                      রেজিস্ট্রেশন করুন
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4 text-slate-400">
              <div className="h-px w-12 bg-slate-200"></div>
              <a
                href="mailto:contact@abusayem.me"
                className="text-sm font-medium uppercase tracking-widest hover:text-slate-600 transition-colors"
              >
                contact@abusayem.me
              </a>
              <div className="h-px w-12 bg-slate-200"></div>
            </div>
            <p className="text-slate-500">
              বাংলাদেশের গণতন্ত্র রক্ষায় আপনার অবদানের জন্য ধন্যবাদ 🇧🇩
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


