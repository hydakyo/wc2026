import { Shell } from '@/components/Shell';
import { tournamentSummary } from '@/lib/worldcup-data';

export default function HealthPage() {
  const summary = tournamentSummary();
  return (
    <Shell title="Trạng thái dữ liệu" subtitle="Trang vận hành cho độ tươi dữ liệu, trạng thái mock-provider và mức sẵn sàng tích hợp production.">
      <section className="metric-grid">
        <div className="card metric"><span>Chế độ nguồn dữ liệu</span><strong>Mock</strong><em>Sẵn sàng thay bằng API thật</em></div>
        <div className="card metric"><span>Trận đang đá</span><strong>{summary.liveCount}</strong><em>Sẵn sàng polling phía frontend</em></div>
        <div className="card metric"><span>Route</span><strong>8</strong><em>Dashboard + API</em></div>
        <div className="card metric"><span>Múi giờ</span><strong>ICT</strong><em>Asia/Ho_Chi_Minh</em></div>
      </section>
      <div className="card"><div className="section-title"><h2>Checklist production</h2><span>Trước khi public</span></div><p>Cần tích hợp provider adapter phía server, thêm cache, bảo vệ API key, cảnh báo dữ liệu cũ và xác thực tie-breaker chính thức qua nguồn dữ liệu.</p></div>
    </Shell>
  );
}
