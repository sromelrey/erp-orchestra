import { StatCard } from '@/components/entity-manager';

interface SalesOrderStatsProps {
  statsCards: StatCard[];
}

export function SalesOrderStats({ statsCards }: SalesOrderStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {statsCards.map((stat, index) => (
        <div key={index} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
