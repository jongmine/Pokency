export default function HpBar({ hp, maxHp }) {
  const percent = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  // 색상: HP 비율에 따라 초록-노랑-빨강
  let barColor = "bg-green-400";
  if (percent < 30) barColor = "bg-red-400";
  else if (percent < 60) barColor = "bg-yellow-300";
  return (
    <div className="w-36 h-4 bg-gray-200 rounded-full border border-gray-300 overflow-hidden shadow-inner">
      <div
        className={`${barColor} h-full rounded-full transition-all`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
