"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function NewChallenge() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pointValue, setPointValue] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/challenges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          pointValue: Number(pointValue),
        }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        console.error("Failed to create challenge");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl mb-6">
        <Link href="/admin">
          <Button
            variant="outline"
            className="rounded-xl px-6 text-lg border-2"
          >
            ← Voltar para Dashboard
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-2xl p-8 rounded-3xl border-b-[8px] border-green-800 bg-white">
        <h1 className="text-4xl font-black text-slate-800 mb-8 text-center">
          Criar Desafio
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xl font-bold text-slate-700">Título</Label>
            <Input
              required
              className="text-xl p-6 rounded-2xl border-4 border-slate-200 focus-visible:ring-0 focus-visible:border-green-500 font-bold"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Nós & Amarras"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xl font-bold text-slate-700">
              Descrição
            </Label>
            <Input
              required
              className="text-xl p-6 rounded-2xl border-4 border-slate-200 focus-visible:ring-0 focus-visible:border-green-500 font-bold"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Completar 5 nós básicos"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xl font-bold text-slate-700">
              Valor em Pontos
            </Label>
            <Input
              type="number"
              required
              min="1"
              className="text-xl p-6 rounded-2xl border-4 border-slate-200 focus-visible:ring-0 focus-visible:border-green-500 font-bold"
              value={pointValue}
              onChange={(e) => setPointValue(e.target.value)}
              placeholder="100"
            />
          </div>

          <Button
            type="submit"
            className="w-full text-2xl py-8 rounded-2xl bg-green-500 hover:bg-green-400 border-b-4 border-green-700 active:border-b-0 active:translate-y-1"
          >
            Criar
          </Button>
        </form>
      </Card>
    </div>
  );
}
