"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Unit = { _id: string; name: string; color: string };
type Completion = { unitId: string; status: "on_time" | "late" };
type Challenge = {
  _id: string;
  title: string;
  pointValue: number;
  completedBy: Completion[];
};

export default function Scoring() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null,
  );
  const [completions, setCompletions] = useState<
    Map<string, "on_time" | "late">
  >(new Map());
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
    const newCompletions = new Map<string, "on_time" | "late">();
    challenge.completedBy.forEach((c) =>
      newCompletions.set(c.unitId, c.status),
    );
    setCompletions(newCompletions);
  };

  const toggleUnit = (unitId: string) => {
    const newCompletions = new Map(completions);
    const current = newCompletions.get(unitId);
    if (!current) {
      newCompletions.set(unitId, "on_time");
    } else if (current === "on_time") {
      newCompletions.set(unitId, "late");
    } else {
      newCompletions.delete(unitId);
    }
    setCompletions(newCompletions);
  };

  const handleSave = async () => {
    if (!selectedChallenge) return;
    const token = localStorage.getItem("token");

    const payloadCompletions = Array.from(completions.entries()).map(
      ([unitId, status]) => ({ unitId, status }),
    );

    try {
      const res = await fetch(
        `http://localhost:3001/challenges/${selectedChallenge._id}/completions`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ completions: payloadCompletions }),
        },
      );

      if (res.ok) {
        setChallenges(
          challenges.map((c) =>
            c._id === selectedChallenge._id
              ? { ...c, completedBy: payloadCompletions }
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
              const status = completions.get(unit._id);
              const isCompleted = !!status;

              let bgColor = "#f8fafc";
              let borderColor = "#e2e8f0";
              let textColor = "#64748b";
              let statusText = "Not Completed";

              if (status === "on_time") {
                bgColor = `${unit.color}20`;
                borderColor = unit.color;
                textColor = unit.color;
                statusText = "On Time (100%)";
              } else if (status === "late") {
                bgColor = "#fef3c7";
                borderColor = "#f59e0b";
                textColor = "#d97706";
                statusText = "Late (25%)";
              }

              return (
                <div
                  key={unit._id}
                  onClick={() => toggleUnit(unit._id)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all border-4 text-center select-none flex flex-col justify-center items-center ${
                    isCompleted
                      ? "scale-105 shadow-lg border-b-[6px]"
                      : "opacity-50 grayscale hover:grayscale-0"
                  }`}
                  style={{
                    borderColor: borderColor,
                    backgroundColor: bgColor,
                  }}
                >
                  <h3
                    className="text-2xl font-black mb-2"
                    style={{ color: textColor }}
                  >
                    {unit.name}
                  </h3>
                  <span
                    className="text-sm font-bold opacity-90"
                    style={{ color: textColor }}
                  >
                    {statusText}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
