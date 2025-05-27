export default function RecentBattleHistory({ history }) {
  if (!history || history.length === 0) return null;
  return (
    <div className="mt-12 w-full max-w-md bg-white rounded-2xl shadow-lg border-2 border-yellow-300 p-6">
      <h2 className="text-lg font-bold text-yellow-700 mb-3">
        최근 5개 배틀 결과
      </h2>
      <ul className="flex flex-col gap-2">
        {history.map((h, i) => (
          <li key={i} className="flex items-center gap-3 text-base">
            <span
              className={`font-extrabold ${
                h.result === "win" ? "text-green-600" : "text-red-500"
              }`}
            >
              {h.result === "win" ? "승리" : "패배"}
            </span>
            <span className="text-gray-500 text-sm">
              {new Date(h.date).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
