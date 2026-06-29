import { bracket, bracketStatusLabel, stageLabel, teamLabel } from '@/lib/worldcup-data';

function entrantLabel(value: string) {
  if (value === 'TBD') return 'Ch\u01b0a x\u00e1c \u0111\u1ecbnh';
  if (value.startsWith('Winner ')) return value.replace('Winner ', 'Th\u1eafng ');
  return teamLabel(value, false);
}

export function BracketView() {
  const rounds = Array.from(new Set(bracket.map((item) => item.round)));
  return (
    <section className="bracket-board">
      {rounds.map((round) => (
        <div className="bracket-round" key={round}>
          <h2>{stageLabel(round)}</h2>
          {bracket.filter((item) => item.round === round).map((item, index) => (
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
