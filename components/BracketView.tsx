import { bracket, bracketStatusLabel, stageLabel, teamLabel } from '@/lib/worldcup-data';

export function BracketView() {
  const rounds = Array.from(new Set(bracket.map((item) => item.round)));
  return (
    <section className="bracket-board">
      {rounds.map((round) => (
        <div className="bracket-round" key={round}>
          <h2>{stageLabel(round)}</h2>
          {bracket.filter((item) => item.round === round).map((item, index) => (
            <article className="bracket-match" key={`${round}-${index}`}>
              <div><b>{teamLabel(item.left, false)}</b></div>
              <div><b>{teamLabel(item.right, false)}</b></div>
              <span>{bracketStatusLabel(item.status)}</span>
            </article>
          ))}
        </div>
      ))}
    </section>
  );
}
