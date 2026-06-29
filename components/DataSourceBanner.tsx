import type { DataSourceInfo } from '@/lib/live-data';

export function DataSourceBanner({ source }: { source: DataSourceInfo }) {
  const updatedAt = new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    dateStyle: 'short',
    timeStyle: 'medium'
  }).format(new Date(source.updatedAt));

  return (
    <div className={`data-source ${source.configured ? 'real' : 'mock'}`}>
      <div className="source-left">
        <span className="source-dot" />
        <div>
          <b>{source.configured ? 'Dữ liệu trực tiếp' : 'Dữ liệu chưa sẵn sàng'}</b>
          <span>{source.label} · {updatedAt}</span>
        </div>
      </div>
      <p>{source.warning ?? 'Server-side provider đang hoạt động. Trang tự làm mới mỗi 30 giây.'}</p>
    </div>
  );
}
