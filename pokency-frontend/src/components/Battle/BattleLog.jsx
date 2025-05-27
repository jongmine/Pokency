export default function BattleLog({ log }) {
  // log: string 배열
  return (
    <div className="h-24 overflow-y-auto flex flex-col gap-1 text-base font-mono">
      {log.map((msg, i) => (
        <div key={i}>{msg}</div>
      ))}
    </div>
  );
}
