import React from 'react';

interface StatCard {
  title: string;
  value: number;
  icon: React.ElementType;
  description: string;
  color: string;
  bgColor: string;
}

interface ProductionStatsProps {
  statsCards: StatCard[];
}

export function ProductionStats({ statsCards }: ProductionStatsProps) {
  if (statsCards.length === 0) return null;

  return (
    <div className="grid gap-4 md:grid-cols-5 mb-6">
      {statsCards.map((stat, index) => (
        <div key={index} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.title}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
