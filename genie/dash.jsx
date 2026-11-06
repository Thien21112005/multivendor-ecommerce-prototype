/* Shared dashboard pieces for Seller Center and Admin Console: stat tile, work queue,
   comparison, bars, money stack, order pipeline and the time chart (with axis, crosshair,
   keyboard and table view). Charts are gray first; only the period that matters is colored. */
(function () {
  const { Icon } = window.LazadeeDesignSystem_0477b7;

  const trim = (n, d) => n.toLocaleString('vi-VN', { maximumFractionDigits: d });
  const vnd = (n) => Math.round(n).toLocaleString('vi-VN') + '₫';
  // Compact money for axes and tight spots: 1,84 tỷ / 45,8 tr / 950k
  const short = (n) => {
    const a = Math.abs(n);
    if (a >= 1e9) return trim(n / 1e9, 2) + ' tỷ';
    if (a >= 1e6) return trim(n / 1e6, 1) + ' tr';
    if (a >= 1e3) return trim(n / 1e3, 0) + 'k';
    return trim(n, 0);
  };
  // Signed percent change; null when there is nothing to compare with.
  const change = (cur, prev) => (prev ? ((cur - prev) / prev) * 100 : null);

  function Delta({ cur, prev, against, downIsGood }) {
    const p = change(cur, prev);
    if (p === null) return <span>{against ? 'Chưa có dữ liệu ' + against : 'Chưa có dữ liệu so sánh'}</span>;
    const flat = Math.abs(p) < 0.05;
    const up = p > 0;
    const good = downIsGood ? !up : up;
    return (
      <span>
        <span className={'dash-delta' + (flat ? '' : good ? ' dash-delta--good' : ' dash-delta--bad')}>
          {!flat && <Icon name={up ? 'arrow-up-right' : 'arrow-down-right'} size={13} />}
          {(up ? '+' : '') + trim(p, 1)}%
        </span>
        {against ? ' ' + against : ''}
      </span>
    );
  }

  // One tile for every dashboard. It is a button only when it leads somewhere.
  function StatTile({ label, value, note, onClick }) {
    const Tag = onClick ? 'button' : 'div';
    return (
      <Tag className="dash-tile" onClick={onClick}>
        <span className="dash-tile__label">{label}{onClick && <Icon name="chevron-right" size={15} />}</span>
        <span className="dash-tile__value">{value}</span>
        {note && <span className="dash-tile__note">{note}</span>}
      </Tag>
    );
  }

  // jobs: [{ id, count, label, hint, go }]
  function WorkQueue({ title, jobs, doneText }) {
    const total = jobs.reduce((n, j) => n + j.count, 0);
    return (
      <section className="dash-sheet" aria-label={title}>
        <div className="dash-head">
          <h2 className="dash-title">{title}</h2>
          <span className="dash-sub">{total > 0 ? total + ' việc đang chờ bạn' : doneText}</span>
        </div>
        <div className="dash-queue" style={{ '--n': Math.min(jobs.length, 5) }}>
          {jobs.map((j) => (
            <button key={j.id} className="dash-job" data-done={j.count === 0 ? 1 : 0} onClick={j.go}>
              <b>{j.count}<Icon name="chevron-right" size={16} /></b>
              <span>{j.label}</span>
              <small>{j.count === 0 ? 'Không có việc tồn' : j.hint}</small>
            </button>
          ))}
        </div>
      </section>
    );
  }

  function Segmented({ label, value, onChange, items }) {
    return (
      <div className="dash-seg" role="group" aria-label={label}>
        {items.map(([id, text]) => <button key={id} aria-pressed={value === id} onClick={() => onChange(id)}>{text}</button>)}
      </div>
    );
  }

  // rows: [[label, value]]; widths are shares of the largest row. The leader is marked.
  function BarList({ rows, format }) {
    const max = Math.max(...rows.map((r) => r[1]), 1);
    return (
      <ol className="dash-bars">
        {rows.map(([k, v], i) => (
          <li key={k} data-lead={i === 0 && v === max ? 1 : 0}>
            <div className="dash-bar__top"><span>{k}</span><b>{format ? format(v) : v.toLocaleString('vi-VN')}</b></div>
            <div className="dash-bar__track"><div className="dash-bar__fill" style={{ width: (v / max) * 100 + '%' }} /></div>
          </li>
        ))}
      </ol>
    );
  }

  // One bar split into parts of a whole, with a legend that carries the numbers.
  // parts: [{ label, value, tone: 'held' | 'ok' | 'wait' | 'info' | 'bad', note?, go? }]
  function StackBar({ parts, format = vnd, label }) {
    const total = parts.reduce((n, p) => n + p.value, 0) || 1;
    const pct = (v) => (v / total * 100).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + '%';
    return (
      <div className="dash-stack">
        <div className="dash-stack__bar" role="img" aria-label={label + ': ' + parts.map((p) => p.label + ' ' + format(p.value)).join(', ')}>
          {parts.map((p) => p.value > 0 && <i key={p.label} data-tone={p.tone} style={{ flexGrow: p.value }} />)}
        </div>
        <ul className="dash-stack__legend">
          {parts.map((p) => {
            const Tag = p.go ? 'button' : 'div';
            return (
              <li key={p.label}>
                <Tag className="dash-stack__item" onClick={p.go}>
                  <i data-tone={p.tone} aria-hidden="true" />
                  <span>{p.label}{p.note && <small>{p.note}</small>}</span>
                  <b>{format(p.value)}<small>{pct(p.value)}</small></b>
                </Tag>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  // Orders still moving, left to right, then how finished orders ended.
  // steps: [[label, count, tone]], outcomes: [[label, count, tone]]
  function Pipeline({ steps, outcomes }) {
    const moving = steps.reduce((n, s) => n + s[1], 0);
    const ended = outcomes.reduce((n, s) => n + s[1], 0) || 1;
    return (
      <div className="dash-pipe">
        <ol className="dash-pipe__steps" aria-label={moving + ' đơn đang xử lý'}>
          {steps.map(([k, v, tone]) => (
            <li key={k} data-tone={tone}>
              <b>{v.toLocaleString('vi-VN')}</b>
              <span>{k}</span>
              <i style={{ width: Math.max(4, (v / Math.max(...steps.map((s) => s[1]), 1)) * 100) + '%' }} />
            </li>
          ))}
        </ol>
        <div className="dash-pipe__out">
          <span className="dash-sub">Kết quả các đơn đã xong</span>
          {outcomes.map(([k, v, tone]) => (
            <span key={k} className="dash-pipe__chip" data-tone={tone}><i aria-hidden="true" />{k} <b>{v.toLocaleString('vi-VN')}</b> <small>{(v / ended * 100).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}%</small></span>
          ))}
        </div>
      </div>
    );
  }

  const niceStep = (max, n) => {
    const raw = max / n, mag = Math.pow(10, Math.floor(Math.log10(raw || 1))), f = raw / mag;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * mag;
  };

  // data: [{ label, value }]. kind: 'bar' for separate periods, 'line' for a running trend.
  function TimeChart({ data, kind = 'bar', name, format = vnd, axis = short, height = 240 }) {
    const box = React.useRef(null);
    const [width, setWidth] = React.useState(680);
    const [active, setActive] = React.useState(null);
    React.useEffect(() => {
      const ro = new ResizeObserver((e) => setWidth(Math.max(240, e[0].contentRect.width)));
      ro.observe(box.current);
      return () => ro.disconnect();
    }, []);
    React.useEffect(() => setActive(null), [data]);

    const PL = 58, PR = 10, PT = 26, PB = 26;
    const plotW = width - PL - PR, plotH = height - PT - PB, base = PT + plotH;
    const n = data.length, max = Math.max(...data.map((d) => d.value), 1);
    const step = niceStep(max, 4), top = Math.ceil(max / step) * step;
    const ticks = []; for (let t = 0; t <= top + step / 2; t += step) ticks.push(t);
    const slot = plotW / n;
    const x = (i) => (kind === 'bar' ? PL + (i + 0.5) * slot : PL + (n > 1 ? (i / (n - 1)) * plotW : plotW / 2));
    const y = (v) => PT + (1 - v / top) * plotH;
    const every = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(plotW / 62))));
    const peak = data.findIndex((d) => d.value === max);
    const barW = Math.min(24, Math.max(4, slot * 0.62));
    const line = data.map((d, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(d.value).toFixed(1)).join(' ');
    const pick = (e) => {
      const r = e.currentTarget.getBoundingClientRect(), px = e.clientX - r.left;
      const i = kind === 'bar' ? Math.floor((px - PL) / slot) : Math.round(((px - PL) / plotW) * (n - 1));
      setActive(Math.min(n - 1, Math.max(0, i)));
    };
    const keys = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const d = e.key === 'ArrowRight' ? 1 : -1;
        setActive((a) => Math.min(n - 1, Math.max(0, (a === null ? (d > 0 ? -1 : n) : a) + d)));
      }
      if (e.key === 'Escape') setActive(null);
    };
    const tipX = active === null ? 0 : Math.min(width - 72, Math.max(72, x(active)));

    return (
      <div>
        <div className="dash-chart" ref={box}>
          <svg width={width} height={height} viewBox={'0 0 ' + width + ' ' + height} role="img" tabIndex={0}
            aria-label={name + '. Cao nhất ' + format(max) + ' vào ' + data[peak].label + '. Dùng phím mũi tên để đọc từng mốc.'}
            onPointerMove={pick} onPointerDown={pick} onPointerLeave={() => setActive(null)} onKeyDown={keys} onBlur={() => setActive(null)}>
            {ticks.map((t) => (
              <g key={t}>
                <line x1={PL} x2={width - PR} y1={y(t)} y2={y(t)} stroke={t === 0 ? 'var(--gray-300)' : 'var(--gray-100)'} />
                <text x={PL - 8} y={y(t) + 4} textAnchor="end">{axis(t)}</text>
              </g>
            ))}
            {data.map((d, i) => (n - 1 - i) % every === 0 && <text key={'x' + i} x={x(i)} y={height - 6} textAnchor={x(i) > width - 24 ? 'end' : 'middle'}>{d.label}</text>)}
            {kind === 'bar' && data.map((d, i) => {
              const h = Math.max(d.value ? 2 : 0, base - y(d.value)), bx = x(i) - barW / 2, r = Math.min(4, h);
              return <path key={i} d={'M' + bx + ' ' + base + 'V' + (base - h + r) + 'q0 ' + -r + ' ' + r + ' ' + -r + 'H' + (bx + barW - r) + 'q' + r + ' 0 ' + r + ' ' + r + 'V' + base + 'Z'} fill={active === i ? 'var(--brand-900)' : i === n - 1 ? 'var(--brand-700)' : 'var(--gray-300)'} />;
            })}
            {kind === 'line' && <>
              <path d={line + ' L' + x(n - 1) + ' ' + base + ' L' + x(0) + ' ' + base + ' Z'} fill="var(--gray-400)" fillOpacity=".12" />
              <path d={line} fill="none" stroke="var(--ink-700)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {active !== null && <line x1={x(active)} x2={x(active)} y1={PT} y2={base} stroke="var(--gray-300)" />}
              <circle cx={x(active === null ? n - 1 : active)} cy={y(data[active === null ? n - 1 : active].value)} r="6" fill="var(--color-accent)" stroke="var(--brand-900)" strokeWidth="2" />
            </>}
            {active === null && <text className="dash-chart__peak" x={Math.min(width - PR - 30, Math.max(PL + 30, x(peak)))} y={y(max) - 8} textAnchor="middle">{axis(max)}</text>}
          </svg>
          {active !== null && <div className="dash-tip" style={{ left: tipX }}><b>{format(data[active].value)}</b>{data[active].label}</div>}
        </div>
        <details className="dash-table-toggle">
          <summary>Xem dạng bảng</summary>
          <table><thead><tr><th>Mốc</th><th>{name}</th></tr></thead><tbody>{data.map((d) => <tr key={d.label}><td>{d.label}</td><td>{format(d.value)}</td></tr>)}</tbody></table>
        </details>
      </div>
    );
  }

  // One whole split into a few parts, read at a glance: a tall bar whose blocks print their
  // share, and a legend that names each part with its count. parts: [{ label, value, tone }]
  function SegBar({ parts, label, format = (v) => v.toLocaleString('vi-VN') }) {
    const total = parts.reduce((n, p) => n + p.value, 0) || 1;
    const share = (v) => (v / total * 100).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + '%';
    return (
      <div className="dash-seg-bar">
        <div className="dash-seg-bar__bar" role="img" aria-label={label + ': ' + parts.map((p) => p.label + ' ' + format(p.value) + ' (' + share(p.value) + ')').join(', ')}>
          {parts.map((p) => p.value > 0 && <i key={p.label} data-tone={p.tone} style={{ flexGrow: p.value }} title={p.label + ': ' + format(p.value) + ' · ' + share(p.value)}>{p.value / total >= 0.09 && share(p.value)}</i>)}
        </div>
        <ul className="dash-seg-bar__legend">
          {parts.map((p) => <li key={p.label} data-tone={p.tone}><i aria-hidden="true" />{p.label}<b>{format(p.value)}</b><small>{share(p.value)}</small></li>)}
        </ul>
      </div>
    );
  }

  window.TRDash = { vnd, short, change, Delta, StatTile, WorkQueue, Segmented, BarList, StackBar, Pipeline, TimeChart, SegBar };
})();
