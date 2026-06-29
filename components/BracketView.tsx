import type { TournamentData } from '@/lib/live-data';
import { bracketStatusLabel, stageLabel, teamLabel } from '@/lib/worldcup-data';

function entrantLabel(value: string) {
  if (value === 'TBD') return 'Chưa xác định';
  if (value.startsWith('Winner ')) return value.replace('Winner ', 'Thắng ');
  return teamLabel(value, false);
}

export function BracketView({ data }: { data: TournamentData }) {
  if (!data.bracket.length) {
    return <p className="subtle">Provider chưa có dữ liệu nhánh knock-out. Nhánh đấu sẽ xuất hiện khi API trả về dữ liệu vòng knock-out.</p>;
  }

  const rounds = Array.from(new Set(data.bracket.map((item) => item.round)));
  return (
    <section className="bracket-board">
      {rounds.map((round) => (
        <div className="bracket-round" key={round}>
          <h2>{stageLabel(round)}</h2>
          {data.bracket.filter((item) => item.round === round).map((item, index) => (
            <article className="bracket-match" key={`${round}-${index}`}>
              <div><b>{entrantLabel(item.left)}</b></div>
              <div><b>{entrantLabel(item.right)}</b></div>
              <span>{bracketStatusLabel(item.status)}</span>
            </article>
          ))}
        </div>
      ))}
    </section>
  );
}
