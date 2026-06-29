import { DataSourceBanner } from '@/components/DataSourceBanner';
import { Shell } from '@/components/Shell';
import { getProductionTournamentData, tournamentSummaryForData } from '@/lib/production-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HealthPage() {
  const data = await getProductionTournamentData();
  const summary = tournamentSummaryForData(data);
  return (
    <Shell title="Trạng thái dữ liệu" subtitle="Trang vận hành cho độ tươi dữ liệu, provider và mức sẵn sàng tích hợp production.">
      <DataSourceBanner source={data.source} />
      <section className="metric-grid">
        <div className="metric-card"><span>Nguồn dữ liệu</span><strong>{data.source.label}</strong><em>{data.source.configured ? 'Đã cấu hình' : 'Chưa khả dụng'}</em></div>
        <div className="metric-card"><span>Trận đang đá</span><strong>{summary.liveCount}</strong><em>Tự làm mới mỗi 30 giây</em></div>
        <div className="metric-card"><span>Tổng trận</span><strong>{data.matches.length}</strong><em>Provider trả về</em></div>
        <div className="metric-card"><span>Múi giờ</span><strong>ICT</strong><em>Asia/Ho_Chi_Minh</em></div>
      </section>
      <div className="card"><div className="section-title"><h2>Cấu hình production</h2><span>Vercel / local</span></div><p><code>REALTIME_PROVIDER=espn</code>. Nếu cần demo bằng mock, bật riêng <code>REALTIME_ALLOW_MOCK=true</code>.</p></div>
    </Shell>
  );
}
