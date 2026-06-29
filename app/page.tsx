import Dashboard from '@/components/dashboard/Dashboard';
import { getProductionTournamentData } from '@/lib/production-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const tournamentData = await getProductionTournamentData();

  return (
    <div>
      <Dashboard tournamentData={tournamentData} />
    </div>
  );
}
