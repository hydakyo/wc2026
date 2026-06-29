import { BracketView } from '@/components/BracketView';
import { Shell } from '@/components/Shell';

export default function BracketPage() {
  return (
    <Shell title="Nh\u00e1nh \u0111\u1ea5u knock-out" subtitle="S\u01a1 \u0111\u1ed3 t\u1eeb v\u00f2ng 32 \u0111\u1ed9i \u0111\u1ebfn chung k\u1ebft. C\u00e1c su\u1ea5t ch\u1edd x\u00e1c \u0111\u1ecbnh \u0111\u01b0\u1ee3c hi\u1ec3n th\u1ecb r\u00f5 \u0111\u1ec3 tr\u00e1nh nh\u1ea7m l\u1eabn gi\u1eefa d\u1ef1 ki\u1ebfn v\u00e0 d\u1eef li\u1ec7u ch\u00ednh th\u1ee9c.">
      <div className="card"><BracketView /></div>
    </Shell>
  );
}
