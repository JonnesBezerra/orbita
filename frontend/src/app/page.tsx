"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Unit = {
  _id: string;
  name: string;
  category: "Boys" | "Girls";
  color: string;
  logoUrl: string;
  totalPoints: number;
};

export default function Leaderboard() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [filter, setFilter] = useState<"Overall" | "Boys" | "Girls">("Overall");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/units/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        setUnits(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch leaderboard:", err);
        setLoading(false);
      });
  }, []);

  const filteredUnits = units.filter((unit) => {
    if (filter === "Overall") return true;
    return unit.category === filter;
  });

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col items-center">
      <h1 className="text-5xl font-black mb-8 text-center text-slate-800 drop-shadow-md">
        Cruzeiro do Sul <br />
        <span className="text-yellow-500 text-6xl">Leaderboard</span>
      </h1>

      <div className="flex gap-4 mb-10">
        <Button
          variant={filter === "Overall" ? "default" : "outline"}
          onClick={() => setFilter("Overall")}
          className="text-lg px-8 py-6 rounded-2xl"
        >
          Overall
        </Button>
        <Button
          variant={filter === "Boys" ? "default" : "outline"}
          onClick={() => setFilter("Boys")}
          className="text-lg px-8 py-6 rounded-2xl bg-blue-500 border-blue-700 hover:bg-blue-400"
        >
          Boys
        </Button>
        <Button
          variant={filter === "Girls" ? "default" : "outline"}
          onClick={() => setFilter("Girls")}
          className="text-lg px-8 py-6 rounded-2xl bg-pink-500 border-pink-700 hover:bg-pink-400"
        >
          Girls
        </Button>
      </div>

      <div className="w-full max-w-4xl flex flex-col gap-4">
        {loading ? (
          <div className="text-2xl font-bold text-center animate-pulse text-slate-500">
            Loading results...
          </div>
        ) : (
          filteredUnits.map((unit, index) => (
            <Card
              key={unit._id}
              className="flex items-center justify-between p-6 rounded-3xl border-4 shadow-[0_8px_0_0_rgba(0,0,0,0.1)] transition-transform hover:scale-[1.02]"
              style={{
                borderColor: unit.color,
                backgroundColor: `${unit.color}10`,
              }}
            >
              <div className="flex items-center gap-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-inner"
                  style={{ backgroundColor: unit.color }}
                >
                  {index + 1}
                </div>
                <div>
                  <h2
                    className="text-3xl font-black text-slate-800"
                    style={{ color: unit.color }}
                  >
                    {unit.name}
                  </h2>
                  <p className="text-lg font-bold text-slate-500">
                    {unit.category}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-5xl font-black text-slate-800">
                  {unit.totalPoints}
                </p>
                <p className="text-xl font-bold text-slate-500 uppercase tracking-widest">
                  Points
                </p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
