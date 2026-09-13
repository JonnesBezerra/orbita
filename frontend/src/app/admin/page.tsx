"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-3xl border-b-[6px] border-slate-300 shadow-sm">
          <h1 className="text-4xl font-black text-slate-800">
            Admin Dashboard
          </h1>
          <Button
            variant="destructive"
            className="rounded-xl px-6"
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
          >
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-8 rounded-3xl border-b-[8px] border-green-700 bg-green-500 text-white flex flex-col items-center text-center hover:scale-105 transition-transform">
            <h2 className="text-3xl font-black mb-4">Create Challenge</h2>
            <p className="text-lg font-bold mb-8 opacity-90">
              Add new tasks for the units to complete
            </p>
            <Link href="/admin/challenges/new" className="w-full">
              <Button className="w-full bg-white text-green-700 hover:bg-slate-100 border-b-4 border-slate-300 text-xl py-6 rounded-2xl">
                Create New
              </Button>
            </Link>
          </Card>

          <Card className="p-8 rounded-3xl border-b-[8px] border-purple-700 bg-purple-500 text-white flex flex-col items-center text-center hover:scale-105 transition-transform">
            <h2 className="text-3xl font-black mb-4">Score Challenges</h2>
            <p className="text-lg font-bold mb-8 opacity-90">
              Mark units as completed and award points
            </p>
            <Link href="/admin/scoring" className="w-full">
              <Button className="w-full bg-white text-purple-700 hover:bg-slate-100 border-b-4 border-slate-300 text-xl py-6 rounded-2xl">
                Go to Scoring
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
