import type { DataSourceInfo } from '@/lib/live-data';

export function DataSourceBanner({ source }: { source: DataSourceInfo }) {
  const updatedAt = new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    timeStyle: 'medium',
    dateStyle: 'short'
  }).format(new Date(source.updatedAt));

  return (
    <div className={`data-source ${source.configured ? 'real' : 'mock'}`}>
      <div className="source-left">
        <span className="source-dot" />
        <b>{source.configured ? 'Dữ liệu trực tiếp' : 'Dữ liệu mô phỏng'}</b>
        <span>{source.label}</span>
      </div>
      <p>Cập nhật: {updatedAt}</p>
    </div>
  );
}
