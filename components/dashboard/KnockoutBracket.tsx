"use client";
import React, { useEffect, useState } from 'react';
import { fetchScoreboard } from '../../utils/api';
import type { Event } from '../../types/espn';
import MatchCard from './MatchCard';
import Loader from './Loader';
import '../../styles/KnockoutBracket.css';

// Mock structure for 32-team knockout tree (16 -> 8 -> 4 -> 2 -> 1)
const MOCK_ROUNDS = [
  {
    id: 'round-of-32',
    title: 'Vòng 32 đội',
    matchCount: 16,
  },
  {
    id: 'round-of-16',
    title: 'Vòng 16 đội',
    matchCount: 8,
  },
  {
    id: 'quarterfinals',
    title: 'Tứ kết',
    matchCount: 4,
  },
  {
    id: 'semifinals',
    title: 'Bán kết',
    matchCount: 2,
  },
  {
    id: 'final',
    title: 'Chung kết',
    matchCount: 1,
  }
];

const KnockoutBracket: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const response = await fetchScoreboard();
        setEvents(response.events || []);
      } catch (err) {
        setError('Không thể tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, []);

  if (loading) return <Loader message="Đang tải sơ đồ..." />;
  if (error) return <div className="dashboard-error">⚠️ {error}</div>;

  const getMatchesForRound = (slugQuery: string) => {
    return events.filter(e => {
      const slug = e.season?.slug?.toLowerCase() || '';
      const name = e.name?.toLowerCase() || '';
      return slug.includes(slugQuery) || name.includes(slugQuery);
    });
  };

  return (
    <div className="bracket-container fade-in">
      <p className="bracket-note">Lưu ý: Sơ đồ hiển thị khung dự kiến. Dữ liệu thực tế sẽ được cập nhật khi ESPN có thông tin vòng loại trực tiếp.</p>
      
      <div className="bracket-scroll-area">
        <div className="bracket-stages">
          {MOCK_ROUNDS.map((round, roundIndex) => {
            const actualMatches = getMatchesForRound(round.id.replace('-', ''));
            // Create array of slots based on matchCount
            const slots = Array.from({ length: round.matchCount }).map((_, idx) => {
              // Use actual match if available, otherwise mock
              if (actualMatches[idx]) {
                return { isReal: true, data: actualMatches[idx] };
              }
              return { 
                isReal: false, 
                label: `Trận ${idx + 1}` 
              };
            });

            return (
              <div key={round.id} className="bracket-round">
                <h3 className="round-title">{round.title}</h3>
                <div className="round-matches">
                  {slots.map((slot, idx) => (
                    <div className={`bracket-match-wrapper round-${roundIndex}`} key={idx}>
                       {slot.isReal ? (
                         <MatchCard match={slot.data as Event} />
                       ) : (
                         <div className="mock-match-card">
                           <div className="mock-team"><span>Chưa xác định</span></div>
                           <div className="mock-divider"></div>
                           <div className="mock-team"><span>Chưa xác định</span></div>
                         </div>
                       )}
                       {/* Connector line to next round (except final) */}
                       {roundIndex < MOCK_ROUNDS.length - 1 && (
                         <div className={`connector-line connector-${idx % 2 === 0 ? 'top' : 'bottom'}`}></div>
                       )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KnockoutBracket;


