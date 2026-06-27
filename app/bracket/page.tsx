import { BracketView } from '@/components/BracketView';
import { Shell } from '@/components/Shell';

export default function BracketPage() {
  return (
    <Shell title="Knockout Bracket" subtitle="Projected Round of 32 to Final bracket view. Pending slots are clearly labeled to avoid confusing projections with official data.">
      <div className="card"><BracketView /></div>
    </Shell>
  );
}
