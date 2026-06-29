import type { DataSourceInfo } from '@/lib/live-data';

export function DataSourceBanner({ source }: { source: DataSourceInfo }) {
  return (
    <div className={`data-source ${source.configured ? 'real' : 'mock'}`}>
      <div>
        <b>{source.configured ? 'Nguồn dữ liệu thật' : 'Chưa có dữ liệu thật'}</b>
        <span>{source.label} · Cập nhật: {new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', dateStyle: 'short', timeStyle: 'medium' }).format(new Date(source.updatedAt))}</span>
      </div>
      <p>{source.warning ?? 'Dữ liệu được tải từ provider qua server-side API và tự làm mới mỗi 30 giây.'}</p>
    </div>
  );
}
