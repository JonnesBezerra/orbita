"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Unit = { _id: string; name: string; color: string };
type Challenge = {
  _id: string;
  title: string;
  pointValue: number;
  completedBy: string[];
};

export default function Scoring() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null,
  );
  const [completedUnitIds, setCompletedUnitIds] = useState<Set<string>>(
    new Set(),
  );
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    Promise.all([
      fetch("http://localhost:3001/challenges", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("http://localhost:3001/units/leaderboard"),
    ])
      .then(async ([resChallenges, resUnits]) => {
        if (!resChallenges.ok) throw new Error("Failed auth");
        setChallenges(await resChallenges.json());
        setUnits(await resUnits.json());
      })
      .catch(() => router.push("/login"));
  }, [router]);

  const handleSelectChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setCompletedUnitIds(new Set(challenge.completedBy));
  };

  const toggleUnit = (unitId: string) => {
    const newSet = new Set(completedUnitIds);
    if (newSet.has(unitId)) newSet.delete(unitId);
    else newSet.add(unitId);
    setCompletedUnitIds(newSet);
  };

  const handleSave = async () => {
    if (!selectedChallenge) return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:3001/challenges/${selectedChallenge._id}/completions`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ unitIds: Array.from(completedUnitIds) }),
        },
      );

      if (res.ok) {
        // Update local state
        setChallenges(
          challenges.map((c) =>
            c._id === selectedChallenge._id
              ? { ...c, completedBy: Array.from(completedUnitIds) }
              : c,
          ),
        );
        setSelectedChallenge(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl mb-6 flex justify-between items-center">
        <Link href="/admin">
          <Button
            variant="outline"
            className="rounded-xl px-6 text-lg border-2"
          >
            ← Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-4xl font-black text-slate-800">Scoring</h1>
      </div>

      {!selectedChallenge ? (
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <Card
              key={challenge._id}
              className="p-6 rounded-3xl border-b-[6px] border-purple-800 bg-purple-500 text-white cursor-pointer hover:scale-105 transition-transform"
              onClick={() => handleSelectChallenge(challenge)}
            >
              <h2 className="text-2xl font-black mb-2">{challenge.title}</h2>
              <div className="flex justify-between items-end">
                <p className="text-lg font-bold opacity-90">
                  {challenge.pointValue} pts
                </p>
                <p className="font-bold opacity-80">
                  {challenge.completedBy.length}/{units.length} completed
                </p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="w-full max-w-5xl bg-white p-8 rounded-3xl border-b-[8px] border-slate-300 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-black text-slate-800">
                {selectedChallenge.title}
              </h2>
              <p className="text-xl font-bold text-slate-500">
                {selectedChallenge.pointValue} Points
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setSelectedChallenge(null)}
                className="rounded-xl text-lg px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="rounded-xl text-lg px-8 bg-green-500 hover:bg-green-400 border-green-700"
              >
                Save Scores
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {units.map((unit) => {
              const isCompleted = completedUnitIds.has(unit._id);
              return (
                <div
                  key={unit._id}
                  onClick={() => toggleUnit(unit._id)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all border-4 text-center select-none ${
                    isCompleted
                      ? "scale-105 shadow-lg border-b-[6px]"
                      : "opacity-50 grayscale hover:grayscale-0"
                  }`}
                  style={{
                    borderColor: isCompleted ? unit.color : "#e2e8f0",
                    backgroundColor: isCompleted
                      ? `${unit.color}20`
                      : "#f8fafc",
                  }}
                >
                  <h3
                    className="text-2xl font-black"
                    style={{ color: isCompleted ? unit.color : "#64748b" }}
                  >
                    {unit.name}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
