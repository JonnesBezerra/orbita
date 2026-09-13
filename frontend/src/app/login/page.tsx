"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      router.push("/admin");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 rounded-3xl border-b-[8px] border-blue-800 shadow-2xl bg-white">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-slate-800 mb-2">
            Admin Login
          </h1>
          <p className="text-slate-500 font-bold">Cruzeiro do Sul</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-lg font-bold text-slate-700">Email</Label>
            <Input
              type="email"
              required
              className="text-lg p-6 rounded-2xl border-4 border-slate-200 focus-visible:ring-0 focus-visible:border-blue-500 font-bold"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="director@cruzeiro.com"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-lg font-bold text-slate-700">Password</Label>
            <Input
              type="password"
              required
              className="text-lg p-6 rounded-2xl border-4 border-slate-200 focus-visible:ring-0 focus-visible:border-blue-500 font-bold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-500 font-bold text-center">{error}</p>
          )}

          <Button type="submit" className="w-full text-2xl py-8 rounded-2xl">
            Enter
          </Button>
        </form>
      </Card>
    </div>
  );
}
