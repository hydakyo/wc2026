import type { TournamentData } from '@/lib/live-data';
import { bracketStatusLabel, stageLabel, teamLabel } from '@/lib/worldcup-data';

function entrantLabel(value: string) {
  if (value === 'TBD') return 'Chờ xác định';
  if (value.startsWith('Winner ')) return value.replace('Winner ', 'Thắng ');
  return teamLabel(value, false);
}

function statusClass(status: string) {
  const value = status.toLowerCase();
  if (value.includes('official')) return 'official';
  if (value.includes('projected')) return 'projected';
  return 'pending';
}

export function BracketView({ data }: { data: TournamentData }) {
  if (!data.bracket.length) {
    return <p className="subtle">Provider chưa có dữ liệu nhánh knock-out. Nhánh đấu sẽ xuất hiện khi provider trả về dữ liệu vòng knock-out.</p>;
  }

  const rounds = Array.from(new Set(data.bracket.map((item) => item.round)));
  return (
    <section className="bracket-modern">
      <p className="bracket-note">Dữ liệu nhánh đấu lấy từ luồng production hiện có. Giao diện chỉ đổi lớp hiển thị, không tự thay đổi kết quả dữ liệu.</p>
      <div className="bracket-board">
        {rounds.map((round) => (
          <div className="bracket-round" key={round}>
            <h2>{stageLabel(round)}</h2>
            <div className="round-matches">
              {data.bracket.filter((item) => item.round === round).map((item, index) => (
                <article className={`bracket-match ${statusClass(item.status)}`} key={`${round}-${index}`}>
                  <div className="bracket-team"><b>{entrantLabel(item.left)}</b></div>
                  <div className="bracket-divider" />
                  <div className="bracket-team"><b>{entrantLabel(item.right)}</b></div>
                  <span>{bracketStatusLabel(item.status)}</span>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
