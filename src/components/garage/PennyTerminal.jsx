const rows = [
  ['GARAGE STATUS', 'OPEN'],
  ['OWNER GATE', 'ARMED'],
  ['BENCH POWER', 'ONLINE'],
  ['EXPERIMENTAL SYSTEMS', 'PROBABLY FINE'],
];

export default function PennyTerminal() {
  return (
    <section className="terminal-panel" aria-labelledby="terminal-heading">
      <div className="panel-kicker">PENNY TERMINAL // LOCAL STATUS</div>
      <h2 id="terminal-heading">Bench telemetry</h2>
      <dl>
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd><span aria-hidden="true">●</span> {value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
