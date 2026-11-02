/* Admin finance & governance: withdrawal processing, commission config,
   append-only ledger, staff RBAC. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Badge, StatusBadge, Avatar, Switch, Input, Money } = DS;
  const { WITHDRAWALS, LEDGER, STAFF, ROLES, PERMS, ALL_PERMS, PERM_DESC, ROLE_PERMS, CURRENT_USER, downloadCsv } = window.LZA;
  const { Modal, Select, Checkbox } = DS;
  const APW_COLORS = ['var(--red-500)', 'var(--red-500)', 'var(--gold-500)', 'var(--mint-500)', 'var(--mint-600)'];
  const APW_LABELS = ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
  const aStrength = (p) => { let s = 0; if (p.length >= 8) s++; if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++; return s; };
  const formatVND = Money.format;

  /* ---------- Withdrawals ---------- */
  // Mock QR tile: not scannable, stands in for the VietQR image the bank app would read.
  function FakeQr({ seed, size = 148 }) {
    let h = 7; for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    const n = 21, cells = [];
    const finder = (x, y) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      if (finder(x, y)) continue;
      h = (h * 1103515245 + 12345) >>> 0;
      if ((h >>> 16) & 1) cells.push(<rect key={x + '-' + y} x={x} y={y} width="1" height="1" />);
    }
    const eye = (x, y) => <g key={x + '.' + y}><rect x={x} y={y} width="7" height="7" /><rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" /><rect x={x + 2} y={y + 2} width="3" height="3" /></g>;
    return <svg viewBox={'0 0 ' + n + ' ' + n} width={size} height={size} role="img" aria-label="Mã VietQR mô phỏng" shapeRendering="crispEdges" style={{ background: '#fff', padding: 8, border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', boxSizing: 'content-box' }}>{cells}{eye(0, 0)}{eye(n - 7, 0)}{eye(0, n - 7)}</svg>;
  }
  const W_REASONS = ['Tài khoản nhận không khớp hồ sơ', 'Shop có khiếu nại đang mở', 'Nghi ngờ giao dịch bất thường', 'Lý do khác'];

  function Withdrawals() {
    const [done, setDone] = React.useState({});
    const [reject, setReject] = React.useState(null);
    const [reason, setReason] = React.useState(W_REASONS[0]);
    const [pay, setPay] = React.useState(null);
    const [manual, setManual] = React.useState(false);
    const [bankRef, setBankRef] = React.useState('');
    const st = (w) => done[w.id] || w.state;
    const queue = WITHDRAWALS.filter((w) => st(w) === 'PENDING');
    const payable = queue.filter((w) => w.kyc === 'VERIFIED');
    const totalPending = payable.reduce((n, w) => n + w.amount, 0);
    const blockedTotal = queue.reduce((n, w) => n + w.amount, 0) - totalPending;
    const [approve, setApprove] = React.useState(null);
    const settle = () => { setDone((d) => ({ ...d, [pay.id]: 'PAID' })); setPay(null); setManual(false); setBankRef(''); };
    return (
      <div style={{ maxWidth: 1180 }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <Kpi label="Chờ xử lý" value={queue.length + ' yêu cầu'} />
          <Kpi label="Có thể chi ngay" value={formatVND(totalPending)} />
          <Kpi label="Bị chặn chờ hồ sơ KYC" value={formatVND(blockedTotal)} />
        </div>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 900, borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums' }}>
            <thead><tr style={hrow}><th style={th}>Mã</th><th style={th}>Người bán</th><th style={th}>Tài khoản nhận</th><th style={{ ...th, textAlign: 'right' }}>Số tiền</th><th style={th}>KYC</th><th style={th}>Yêu cầu</th><th style={{ ...th, textAlign: 'right' }}>Thao tác</th></tr></thead>
            <tbody>
              {WITHDRAWALS.map((w) => {
                const blocked = w.kyc !== 'VERIFIED';
                return (
                  <tr key={w.id} style={brow}>
                    <td style={td}><span className="code" style={{ fontSize: 12 }}>{w.id}</span></td>
                    <td style={td}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Avatar name={w.shop} size={26} square />{w.shop}</div></td>
                    <td style={{ ...td, color: 'var(--text-muted)' }} className="code">{w.bank} <Icon name="badge-check" size={13} style={{ color: 'var(--mint-600)' }} title="Đã xác minh chính chủ" /></td>
                    <td style={{ ...td, textAlign: 'right', fontWeight: 700 }}>{formatVND(w.amount)}</td>
                    <td style={td}><StatusBadge status={w.kyc === 'VERIFIED' ? 'VERIFIED' : 'PENDING'} label={w.kyc === 'VERIFIED' ? 'Đã duyệt' : w.kyc === 'SUPPLEMENT_REQUESTED' ? 'Cần bổ sung' : 'Chờ duyệt'} dot={false} /></td>
                    <td style={{ ...td, color: 'var(--text-muted)', fontSize: 12 }}>{w.requested}</td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      {st(w) === 'PAID' ? <Badge variant="success" icon="circle-check">Đã chi</Badge>
                        : st(w) === 'REJECTED' ? <Badge variant="danger" icon="ban">Đã từ chối, hoàn ví</Badge>
                        : st(w) === 'APPROVED' ? <Button size="sm" variant="outline" iconLeft="clock" onClick={() => setPay(w)}>Chờ chuyển khoản</Button>
                        : blocked ? <Badge variant="danger" icon="lock">Chặn, hồ sơ KYC cần bổ sung</Badge>
                        : <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                            <Button variant="ghost" size="sm" onClick={() => { setReason(W_REASONS[0]); setReject(w); }}>Từ chối</Button>
                            <Button size="sm" iconLeft="check" onClick={() => setApprove(w)}>Duyệt chi</Button>
                          </div>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Modal open={!!approve} onClose={() => setApprove(null)} width={460} title={approve && 'Duyệt chi lệnh ' + approve.id}
          footer={<><Button variant="ghost" onClick={() => setApprove(null)}>Huỷ</Button><Button iconLeft="check" onClick={() => { setDone((d) => ({ ...d, [approve.id]: 'APPROVED' })); setPay(approve); setApprove(null); }}>Duyệt và mở chuyển khoản</Button></>}>
          {approve && <div style={{ font: 'var(--type-body)', color: 'var(--text-body)', lineHeight: 1.5 }}>Chuyển <b>{formatVND(approve.amount)}</b> cho <b>{approve.shop}</b> vào tài khoản <span className="code">{approve.bank}</span>. Lệnh đã duyệt không thể huỷ, hãy kiểm tra đúng số tiền và tài khoản.</div>}
        </Modal>

        <Modal open={!!reject} onClose={() => setReject(null)} title={reject && 'Từ chối lệnh ' + reject.id}
          footer={<><Button variant="ghost" onClick={() => setReject(null)}>Huỷ</Button><Button variant="danger" onClick={() => { setDone((d) => ({ ...d, [reject.id]: 'REJECTED' })); setReject(null); }}>Từ chối & hoàn ví</Button></>}>
          {reject && <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Select label="Lý do từ chối" value={reason} onChange={(e) => setReason(e.target.value)}>{W_REASONS.map((r) => <option key={r}>{r}</option>)}</Select>
            <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)', lineHeight: 1.5 }}><b>{formatVND(reject.amount)}</b> sẽ trả lại số dư khả dụng của {reject.shop}.</div>
          </div>}
        </Modal>

        <Modal open={!!pay} onClose={() => { setPay(null); setManual(false); }} width={520} title={pay && 'Chuyển khoản lệnh ' + pay.id}
          footer={pay && <><Button variant="ghost" onClick={() => { setPay(null); setManual(false); }}>Đóng</Button>{manual ? <Button iconLeft="check" disabled={!bankRef.trim()} onClick={settle}>Xác nhận tay</Button> : <Button iconLeft="circle-check" onClick={settle}>Mô phỏng: SePay báo tiền đã ra</Button>}</>}>
          {pay && <div>
            <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
              <FakeQr seed={pay.id} />
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 7, font: 'var(--type-body-sm)' }}>
                <div><span style={{ color: 'var(--text-muted)' }}>Tài khoản nhận: </span><b>{pay.bank}</b></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Số tiền: </span><b style={{ color: 'var(--text-price)' }}>{formatVND(pay.amount)}</b></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Nội dung bắt buộc: </span><b className="code">TRWD{pay.id.replace(/\D/g, '')}</b></div>
                <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Quét mã bằng app ngân hàng của sàn. Hệ thống tự hoàn tất khi SePay báo tiền ra khỏi tài khoản.</div>
              </div>
            </div>
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
              {!manual
                ? <a onClick={() => setManual(true)} style={{ font: 'var(--type-caption)', color: 'var(--blue-600)', cursor: 'pointer', fontWeight: 600 }}>Sau 24 giờ chưa thấy webhook? Xác nhận tay</a>
                : <Input label="Mã giao dịch ngân hàng" value={bankRef} onChange={(e) => setBankRef(e.target.value)} placeholder="VD: FT26170123456" />}
            </div>
          </div>}
        </Modal>
      </div>
    );
  }

  /* ---------- Commission config ---------- */
  function Commission() {
    const [cats, setCats] = React.useState([['Điện tử', '5', true], ['Thời trang', '8', true], ['Làm đẹp', '10', true], ['Nhà cửa', '6', true], ['Phụ kiện', '7', true], ['Bách hoá', '4', true]]);
    const [def, setDef] = React.useState('5');
    const [toast, setToast] = React.useState('');
    const say = (m) => { setToast(m); setTimeout(() => setToast(''), 2400); };
    const setCat = (i, patch) => setCats((c) => c.map((row, j) => (j === i ? [row[0], patch.v != null ? patch.v : row[1], patch.on != null ? patch.on : row[2]] : row)));
    return (
      <div style={{ maxWidth: 1180 }}>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: 22, marginBottom: 16 }}>
          <div style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)', marginBottom: 4 }}>Phí hoa hồng mặc định</div>
          <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)', marginBottom: 16 }}>Thứ tự áp dụng: hoa hồng riêng của shop → theo ngành hàng → mặc định.</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
            <div style={{ width: 140 }}><Input label="Phí sàn (%)" value={def} onChange={(e) => setDef(e.target.value.replace(/\D/g, ''))} iconRight="percent" /></div>
            <Button variant="secondary" disabled={!def} onClick={() => say('Đã lưu phí hoa hồng mặc định!')}>Lưu mặc định</Button>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>Hoa hồng theo ngành hàng</div>
          {cats.map(([c, v, on], i) => (
            <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ flex: 1, font: 'var(--type-body)', color: on ? 'var(--text-body)' : 'var(--text-subtle)' }}>{c}</span>
              <div style={{ width: 90 }}><Input value={v} onChange={(e) => setCat(i, { v: e.target.value.replace(/\D/g, '') })} iconRight="percent" /></div>
              <Switch checked={on} onChange={() => setCat(i, { on: !on })} />
            </div>
          ))}
          <div style={{ padding: 16, textAlign: 'right' }}><Button onClick={() => say('Đã lưu tất cả thay đổi cấu hình')}>Lưu cấu hình</Button></div>
        </div>
        {toast && <div role="status" style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--ink-900)', color: '#fff', padding: '11px 18px', borderRadius: 'var(--radius-pill)', font: 'var(--type-body-sm)', boxShadow: 'var(--shadow-lg)', zIndex: 200 }}>{toast}</div>}
      </div>
    );
  }

  /* ---------- Append-only ledger ---------- */
  function Ledger() {
    const [q, setQ] = React.useState('');
    const [ev, setEv] = React.useState('Tất cả sự kiện');
    const events = ['Tất cả sự kiện', ...Array.from(new Set(LEDGER.map((r) => r.event)))];
    const rows = LEDGER.filter((r) => ev === 'Tất cả sự kiện' || r.event === ev).filter((r) => (r.ref + ' ' + r.account).toLowerCase().includes(q.trim().toLowerCase()));
    const exportCsv = () => downloadCsv('so-cai-tai-chinh.csv', [['Seq', 'Thời gian', 'Sự kiện', 'Tham chiếu', 'Tài khoản', 'Nợ', 'Có'], ...rows.map((r) => [r.seq, r.ts, r.event, r.ref, r.account, r.debit, r.credit])]);
    return (
      <div style={{ maxWidth: 1180 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <Badge variant="neutral"><Icon name="lock" size={11} /> Append-only · bất biến</Badge>
          <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Mỗi dòng là một bút toán không thể sửa/xoá. Điều chỉnh = thêm bút toán đảo.</span>
          <Button variant="secondary" size="sm" iconLeft="download" style={{ marginLeft: 'auto' }} onClick={exportCsv}>Xuất sổ cái</Button>
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1, maxWidth: 360 }}><Input iconLeft="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Mã tham chiếu, tài khoản..." /></div>
          <div style={{ width: 220 }}><Select value={ev} onChange={(e) => setEv(e.target.value)}>{events.map((x) => <option key={x}>{x}</option>)}</Select></div>
        </div>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 900, borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums' }}>
            <thead><tr style={hrow}><th style={th}>Seq</th><th style={th}>Thời gian</th><th style={th}>Sự kiện</th><th style={th}>Tham chiếu</th><th style={th}>Tài khoản</th><th style={{ ...th, textAlign: 'right' }}>Nợ</th><th style={{ ...th, textAlign: 'right' }}>Có</th></tr></thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan="7" style={{ padding: 32, textAlign: 'center', font: 'var(--type-body)', color: 'var(--text-muted)' }}>Không có bút toán nào khớp bộ lọc.</td></tr>}
              {rows.map((r) => (
                <tr key={r.seq} style={brow}>
                  <td style={{ ...td, color: 'var(--text-subtle)' }} className="code">#{r.seq}</td>
                  <td style={{ ...td, color: 'var(--text-muted)', fontSize: 12 }} className="code">{r.ts}</td>
                  <td style={td}><Badge variant={EVENT[r.event] || 'neutral'}>{r.event}</Badge></td>
                  <td style={td}><span className="code" style={{ fontSize: 12 }}>{r.ref}</span></td>
                  <td style={{ ...td, color: 'var(--text-body)' }}>{r.account}</td>
                  <td style={{ ...td, textAlign: 'right', color: r.debit ? 'var(--text-strong)' : 'var(--text-disabled)', fontWeight: r.debit ? 600 : 400 }}>{r.debit ? formatVND(r.debit) : '—'}</td>
                  <td style={{ ...td, textAlign: 'right', color: r.credit ? 'var(--text-strong)' : 'var(--text-disabled)', fontWeight: r.credit ? 600 : 400 }}>{r.credit ? formatVND(r.credit) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* ---------- RBAC ---------- */
  function Rbac() {
    const [staff, setStaff] = React.useState(STAFF);
    const [editing, setEditing] = React.useState(null);
    const [inviting, setInviting] = React.useState(false);
    const save = (email, patch) => setStaff((list) => list.map((s) => (s.email === email ? { ...s, ...patch } : s)));
    const addStaff = (s) => { setStaff((list) => [...list, s]); setInviting(false); };
    const [q, setQ] = React.useState('');
    const [delStaff, setDelStaff] = React.useState(null);
    const [lockStaff, setLockStaff] = React.useState(null);
    const [lockWhy, setLockWhy] = React.useState('');
    const [toast, setToast] = React.useState('');
    const say = (m) => { setToast(m); setTimeout(() => setToast(''), 2400); };
    const shownStaff = staff.filter((s) => (s.name + ' ' + s.email).toLowerCase().includes(q.trim().toLowerCase()));
    return (
      <div style={{ maxWidth: 1180 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>{staff.length} nhân viên · 3 chức danh + Admin · {ALL_PERMS.length} mã quyền. Di chuột lên mã quyền để xem mô tả.</span>
          <Button size="sm" iconLeft="plus-circle" style={{ marginLeft: 'auto' }} onClick={() => setInviting(true)}>Mời nhân viên mới</Button>
        </div>
        <div style={{ position: 'relative', maxWidth: 380, marginBottom: 12 }}>
          <span style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-subtle)', display: 'flex' }}><Icon name="search" size={16} /></span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm kiếm theo tên hoặc email..." style={{ width: '100%', height: 40, paddingLeft: 36, border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', font: 'var(--type-body-sm)', outline: 'none', boxSizing: 'border-box', background: '#fff' }} />
        </div>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 760, borderCollapse: 'collapse' }}>
            <thead><tr style={hrow}><th style={th}>Nhân viên</th><th style={th}>Chức danh</th><th style={th}>Quyền</th><th style={th}>Trạng thái</th><th style={{ ...th, textAlign: 'right' }}></th></tr></thead>
            <tbody>
              {shownStaff.map((s) => {
                const isAdmin = s.role === 'Admin';
                const perms = isAdmin ? ['Toàn quyền'] : s.perms;
                return (
                  <tr key={s.email} style={brow}>
                    <td style={td}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Avatar name={s.name} size={34} /><div><div style={{ font: '600 13px var(--font-sans)', color: 'var(--text-strong)' }}>{s.name}</div><div className="code" style={{ font: '11px var(--font-mono)', color: 'var(--text-muted)' }}>{s.email}</div></div></div></td>
                    <td style={td}><Badge variant={isAdmin ? 'primary' : 'outline'}>{s.role}</Badge></td>
                    <td style={td}><div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', maxWidth: 300 }}>{perms.map((p) => <span key={p} title={PERM_DESC[p] || (p === 'Toàn quyền' ? 'Có tất cả quyền trong hệ thống' : p)} className="code" style={{ font: '11px var(--font-mono)', background: 'var(--gray-100)', color: 'var(--text-body)', padding: '2px 6px', borderRadius: 'var(--radius-xs)', cursor: 'help' }}>{p}</span>)}</div></td>
                    <td style={td}>{s.pending ? <Badge variant="warning" icon="clock">Chờ kích hoạt</Badge> : s.active ? <Badge variant="success">Hoạt động</Badge> : <Badge variant="neutral">Tạm khoá</Badge>}</td>
                    <td style={{ ...td, textAlign: 'right' }}>{isAdmin ? <span style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>Tài khoản của bạn</span> : <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      {s.pending && <Button variant="ghost" size="sm" iconLeft="send" onClick={() => say('Đã gửi lại lời mời tới ' + s.email)}>Gửi lại lời mời</Button>}
                      <Button variant="ghost" size="sm" iconLeft="pencil" onClick={() => setEditing(s)}>Sửa quyền</Button>
                      {!s.pending && <Button variant="ghost" size="sm" iconLeft="lock" onClick={() => { if (s.active) { setLockWhy(''); setLockStaff(s); } else { save(s.email, { active: true }); say('Mở khóa tài khoản thành công!'); } }}>{s.active ? 'Khóa' : 'Mở khóa'}</Button>}
                      <Button variant="ghost" size="sm" iconLeft="trash-2" style={{ color: 'var(--red-600)' }} onClick={() => setDelStaff(s)}>Xóa</Button>
                    </div>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {editing && <RbacEditor staff={editing} onClose={() => setEditing(null)} onSave={(patch) => { save(editing.email, patch); setEditing(null); }} />}
        {inviting && <InviteStaff existing={staff.map((s) => s.email)} onClose={() => setInviting(false)} onInvite={addStaff} />}
        {lockStaff && <Modal open onClose={() => setLockStaff(null)} title={'Khóa tài khoản — ' + lockStaff.name}
          footer={<><Button variant="ghost" onClick={() => setLockStaff(null)}>Huỷ</Button><Button variant="danger" iconLeft="lock" disabled={!lockWhy.trim()} onClick={() => { save(lockStaff.email, { active: false }); setLockStaff(null); say('Khóa tài khoản thành công!'); }}>Xác nhận khóa</Button></>}>
          <Input label="Lý do khóa" value={lockWhy} onChange={(e) => setLockWhy(e.target.value)} placeholder="VD: Nhân viên đã chấm dứt hợp đồng lao động" />
        </Modal>}
        {toast && <div role="status" style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--ink-900)', color: '#fff', padding: '11px 18px', borderRadius: 'var(--radius-pill)', font: 'var(--type-body-sm)', boxShadow: 'var(--shadow-lg)', zIndex: 200 }}>{toast}</div>}
        {delStaff && <Modal open onClose={() => setDelStaff(null)} title="Xóa tài khoản nhân viên"
          footer={<><Button variant="ghost" onClick={() => setDelStaff(null)}>Huỷ</Button><Button variant="danger" iconLeft="trash-2" onClick={() => { setStaff((l) => l.filter((x) => x.email !== delStaff.email)); setDelStaff(null); }}>Xóa tài khoản</Button></>}>
          <div style={{ font: 'var(--type-body)', color: 'var(--text-body)', lineHeight: 1.5 }}><b style={{ color: 'var(--red-600)' }}>CẢNH BÁO:</b> Hành động này sẽ xoá hoàn toàn tài khoản và quyền của nhân viên <b>{delStaff.name}</b>. Bạn có chắc chắn?</div>
        </Modal>}
      </div>
    );
  }

  function InviteStaff({ existing, onClose, onInvite }) {
    const [f, setF] = React.useState({ name: '', email: '', role: 'Moderator' });
    const [perms, setPerms] = React.useState((ROLE_PERMS['Moderator'] || []).slice());
    const [sent, setSent] = React.useState(false);
    const [err, setErr] = React.useState({});
    const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
    const pickRole = (r) => { set('role', r); if (ROLE_PERMS[r]) setPerms(ROLE_PERMS[r].slice()); };
    const toggle = (code) => { if (code === 'MANAGE_RBAC') return; setPerms((p) => (p.includes(code) ? p.filter((x) => x !== code) : [...p, code])); };
    const submit = () => {
      const e = {};
      if (!f.name.trim()) e.name = 'Nhập họ tên';
      if (!/^[^@\s]+@genie\.example$/i.test(f.email.trim())) e.email = 'Email công việc phải có đuôi @genie.example';
      else if (existing.includes(f.email.trim().toLowerCase())) e.email = 'Email đã được sử dụng';
      setErr(e);
      if (Object.keys(e).length === 0) {
        onInvite({ name: f.name.trim(), email: f.email.trim(), role: f.role, perms: perms.slice(), active: false, pending: true });
      }
    };
    return (
      <Modal open onClose={onClose} title="Mời nhân viên mới" width={560}
        footer={<><Button variant="ghost" onClick={onClose}>Huỷ</Button><Button iconLeft="send" onClick={submit}>Gửi lời mời</Button></>}>
        <div style={{ width: 'min(520px, 82vw)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 9, alignItems: 'center', background: 'var(--blue-50)', border: '1px solid var(--blue-200)', borderRadius: 'var(--radius-md)', padding: '10px 13px' }}>
            <Icon name="info" size={16} style={{ color: 'var(--blue-600)', flex: 'none' }} />
            <span style={{ font: 'var(--type-caption)', color: 'var(--text-body)' }}>Nhân viên sẽ nhận email lời mời và kích hoạt tài khoản qua OTP. Trạng thái ban đầu là <b>Chờ kích hoạt</b>.</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="Họ và tên" value={f.name} onChange={(e) => set('name', e.target.value)} error={err.name} placeholder="Nguyễn Văn A" />
            <div><label style={lab}>Chức danh</label><div style={{ marginTop: 6 }}><Select value={f.role} onChange={(e) => pickRole(e.target.value)}>{EDIT_ROLES.map((r) => <option key={r}>{r}</option>)}</Select></div></div>
          </div>
          <Input label="Email công việc" iconLeft="mail" value={f.email} onChange={(e) => set('email', e.target.value)} error={err.email} placeholder="ten@genie.example" />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <label style={lab}>Quyền cấp theo chức danh</label>
              <span style={{ marginLeft: 'auto', font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{perms.length}/{ALL_PERMS.length} quyền</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {PERMS.filter((p) => p.code !== 'MANAGE_RBAC').map((p) => {
                const on = perms.includes(p.code);
                return (
                  <button key={p.code} onClick={() => toggle(p.code)} title={p.desc} className="code" style={{ font: '11px var(--font-mono)', padding: '4px 9px', borderRadius: 'var(--radius-pill)', border: '1px solid ' + (on ? 'var(--blue-500)' : 'var(--border-default)'), background: on ? 'var(--blue-50)' : '#fff', color: on ? 'var(--blue-600)' : 'var(--text-muted)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Icon name={on ? 'check' : 'plus'} size={12} />{p.code}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  const EDIT_ROLES = ['Moderator', 'CS Specialist', 'Finance Officer', 'Tùy chỉnh'];
  function RbacEditor({ staff, onClose, onSave }) {
    const initRole = EDIT_ROLES.includes(staff.role) ? staff.role : 'Tùy chỉnh';
    const [role, setRole] = React.useState(initRole);
    const [perms, setPerms] = React.useState(() => staff.perms.slice());
    const [active, setActive] = React.useState(staff.active);
    const pickRole = (r) => { setRole(r); if (ROLE_PERMS[r]) setPerms(ROLE_PERMS[r].slice()); };
    const toggle = (code) => { if (code === 'MANAGE_RBAC') return; setPerms((p) => (p.includes(code) ? p.filter((x) => x !== code) : [...p, code])); };
    const conflict = perms.includes('PROCESS_PAYOUT') && perms.includes('UPDATE_COMMISSION');
    return (
      <Modal open onClose={onClose} title={`Chỉnh quyền — ${staff.name}`} width={560}
        footer={<div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
          {active && <Button variant="danger" iconLeft="lock" onClick={() => { onSave({ active: false }); }}>Tạm khoá tài khoản</Button>}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            <Button variant="ghost" onClick={onClose}>Huỷ</Button>
            <Button iconLeft="check" onClick={() => onSave({ role, perms: perms.slice(), active })}>Lưu</Button>
          </div>
        </div>}>
        <div style={{ width: 'min(520px, 82vw)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={lab}>Chức danh</label>
            <div style={{ marginTop: 6 }}><Select value={role} onChange={(e) => pickRole(e.target.value)}>{EDIT_ROLES.map((r) => <option key={r}>{r}</option>)}</Select></div>
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 6 }}>Chọn chức danh sẽ nạp bộ quyền mặc định — bạn có thể tuỳ chỉnh bên dưới.</div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <label style={lab}>Quyền chi tiết</label>
              <span style={{ marginLeft: 'auto', font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{perms.length}/{ALL_PERMS.length} quyền</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              {PERMS.map((p, i) => {
                const on = perms.includes(p.code);
                return (
                  <label key={p.code} style={{ display: 'flex', alignItems: 'flex-start', gap: 11, padding: '11px 14px', cursor: p.code === 'MANAGE_RBAC' ? 'not-allowed' : 'pointer', opacity: p.code === 'MANAGE_RBAC' ? 0.55 : 1, background: on ? 'var(--blue-50)' : '#fff', borderTop: i ? '1px solid var(--border-subtle)' : 'none' }}>
                    <Checkbox checked={on} disabled={p.code === 'MANAGE_RBAC'} onChange={() => toggle(p.code)} />
                    <div style={{ minWidth: 0 }}>
                      <div className="code" style={{ font: '12px var(--font-mono)', color: on ? 'var(--blue-600)' : 'var(--text-strong)', fontWeight: 600 }}>{p.code}</div>
                      <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 1 }}>{p.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
          {conflict && <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'var(--amber-50)', color: 'var(--amber-600)', borderRadius: 'var(--radius-md)', padding: '10px 14px', font: 'var(--type-body-sm)' }}><Icon name="triangle-alert" size={16} style={{ flex: 'none' }} />Một người giữ cả PROCESS_PAYOUT và UPDATE_COMMISSION vi phạm tách biệt nhiệm vụ. Vẫn lưu được và sẽ ghi log.</div>}
          {!active && <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-md)', padding: '10px 14px' }}>
            <Icon name="lock" size={16} style={{ color: 'var(--text-muted)' }} />
            <span style={{ flex: 1, font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>Tài khoản đang tạm khoá.</span>
            <Button size="sm" variant="secondary" onClick={() => setActive(true)}>Mở khoá</Button>
          </div>}
        </div>
      </Modal>
    );
  }

  /* ---------- Admin account / profile (VĐ-3) ---------- */
  function AccountAdmin() {
    const u = CURRENT_USER;
    const [name, setName] = React.useState(u.name);
    const [avatar, setAvatar] = React.useState(null);
    const [editName, setEditName] = React.useState(false);
    const [signedOut, setSignedOut] = React.useState(false);
    const fileRef = React.useRef(null);
    const pickAvatar = (e) => { const file = e.target.files[0]; e.target.value = ''; if (file && /^image\/(jpeg|png)$/.test(file.type) && file.size <= 1024 * 1024) setAvatar(URL.createObjectURL(file)); };
    const [f, setF] = React.useState({ cur: '', nw: '', cf: '' });
    const [err, setErr] = React.useState({});
    const [stage, setStage] = React.useState('form');
    const [otp, setOtp] = React.useState('');
    const [resend, setResend] = React.useState(0);
    const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
    const strength = aStrength(f.nw);
    React.useEffect(() => { if (stage !== 'otp' || resend <= 0) return; const t = setInterval(() => setResend((s) => (s > 0 ? s - 1 : 0)), 1000); return () => clearInterval(t); }, [stage, resend]);
    const submit = () => {
      const e = {};
      if (!f.cur) e.cur = 'Nhập mật khẩu hiện tại';
      if (f.nw.length < 8) e.nw = 'Tối thiểu 8 ký tự'; else if (!/[A-Z]/.test(f.nw)) e.nw = 'Cần ít nhất 1 chữ hoa'; else if (!/[a-z]/.test(f.nw)) e.nw = 'Cần ít nhất 1 chữ thường'; else if (f.nw === f.cur) e.nw = 'Mật khẩu mới phải khác mật khẩu hiện tại'; else if (!/[0-9]/.test(f.nw)) e.nw = 'Cần ít nhất 1 chữ số'; else if (!/[^A-Za-z0-9]/.test(f.nw)) e.nw = 'Cần ít nhất 1 ký tự đặc biệt';
      if (f.cf !== f.nw) e.cf = 'Mật khẩu nhập lại không khớp';
      setErr(e); if (Object.keys(e).length === 0) { setStage('otp'); setResend(60); setOtp(''); }
    };
    const confirm = () => { if (otp !== '123456') { setErr({ otp: 'Mã OTP không đúng' }); return; } setErr({}); setStage('done'); setF({ cur: '', nw: '', cf: '' }); setTimeout(() => setStage('form'), 2800); };
    return (
      <div style={{ maxWidth: 1180, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* profile */}
        <div style={cardBox}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div onClick={() => fileRef.current.click()} title="Đổi ảnh đại diện" style={{ cursor: 'pointer' }}><Avatar name={name} src={avatar} size={64} /></div>
            <input ref={fileRef} type="file" hidden accept="image/*" onChange={pickAvatar} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                {editName
                  ? <><div style={{ width: 240 }}><Input value={name} onChange={(e) => setName(e.target.value)} /></div><Button size="sm" disabled={!name.trim()} onClick={() => setEditName(false)}>Lưu</Button></>
                  : <><h2 style={{ font: 'var(--type-h4)', color: 'var(--text-strong)', margin: 0 }}>{name}</h2><Button size="sm" variant="ghost" iconLeft="pencil" onClick={() => setEditName(true)}>Sửa</Button></>}
                <Badge variant="primary">{u.role}</Badge>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                <span className="code" style={{ font: '13px var(--font-mono)', color: 'var(--text-muted)' }}>{u.email}</span>
                <Badge variant="mint" icon="badge-check">Xác minh</Badge>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 16 }}>
            <Info k="Vai trò" v={u.role} />
            <Info k="Số quyền" v={`${u.perms.length}/${ALL_PERMS.length}`} />
            <Info k="Trạng thái" v="Đang hoạt động" tone="var(--mint-600)" />
          </div>
        </div>

        {/* change password */}
        <div style={cardBox}>
          <SecHead icon="shield-check" title="Đổi mật khẩu" />
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 260px', gap: 24, alignItems: 'start', marginTop: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <APwField label="Mật khẩu hiện tại" value={f.cur} onChange={(v) => set('cur', v)} err={err.cur} />
              <div>
                <APwField label="Mật khẩu mới" value={f.nw} onChange={(v) => set('nw', v)} err={err.nw} hint="Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt" />
                {f.nw && <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}><div style={{ flex: 1, height: 5, borderRadius: 3, background: 'var(--gray-200)', overflow: 'hidden' }}><div style={{ width: (strength / 4 * 100) + '%', height: '100%', borderRadius: 3, background: APW_COLORS[strength], transition: 'all .3s' }} /></div><span style={{ font: '600 12px var(--font-sans)', color: APW_COLORS[strength], minWidth: 64 }}>{APW_LABELS[strength]}</span></div>}
              </div>
              <APwField label="Nhập lại mật khẩu mới" value={f.cf} onChange={(v) => set('cf', v)} err={err.cf} />
              {stage === 'form' && <div><Button iconLeft="check" onClick={submit}>Cập nhật mật khẩu</Button></div>}
              {stage === 'otp' && (
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}><Icon name="mail" size={16} style={{ color: 'var(--blue-600)' }} /><span style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>Mã OTP đã gửi đến <b>ye****@genie.example</b> (demo: 123456)</span></div>
                  <AOtpBoxes onChange={setOtp} />
                  {err.otp && <div style={{ color: 'var(--red-600)', font: 'var(--type-caption)', marginTop: 8 }}>{err.otp}</div>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
                    <Button iconLeft="check" disabled={otp.length < 6} onClick={confirm}>Xác nhận</Button>
                    <Button variant="ghost" onClick={() => setStage('form')}>Huỷ</Button>
                    <span style={{ marginLeft: 'auto', font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>{resend > 0 ? `Gửi lại OTP (còn ${resend}s)` : <a style={{ color: 'var(--blue-600)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setResend(60)}>Gửi lại OTP</a>}</span>
                  </div>
                </div>
              )}
              {stage === 'done' && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: 'var(--mint-600)', font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', background: 'var(--mint-50)', borderRadius: 'var(--radius-md)', padding: '10px 14px' }}><Icon name="circle-check" size={18} />Đổi mật khẩu thành công</div>}
            </div>
            <div style={{ background: 'var(--surface-sunken)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}><Icon name="info" size={16} style={{ color: 'var(--blue-600)' }} /><span style={{ font: 'var(--weight-bold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>Bắt buộc OTP</span></div>
              <p style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>Tài khoản quản trị bắt buộc xác thực OTP khi đổi mật khẩu để bảo vệ quyền truy cập hệ thống.</p>
            </div>
          </div>
        </div>

        {/* sessions */}
        <div style={cardBox}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SecHead icon="lock" title="Phiên đăng nhập" />
            <Button variant="outline" size="sm" iconLeft="log-out" style={{ marginLeft: 'auto' }} disabled={signedOut} onClick={() => setSignedOut(true)}>{signedOut ? 'Đã thu hồi phiên khác' : 'Đăng xuất tất cả'}</Button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, border: '1px solid var(--mint-300, #BCEDD8)', background: 'var(--mint-50)', borderRadius: 'var(--radius-md)', padding: '14px 16px', marginTop: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--mint-500)', color: '#fff', display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name="layout-dashboard" size={22} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>Windows PC · Chrome 126</span><Badge variant="mint" icon="badge-check">Thiết bị hiện tại</Badge></div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 14px', marginTop: 4, font: 'var(--type-caption)', color: 'var(--text-muted)' }}><span>TP. Hồ Chí Minh, VN</span><span className="code">IP 113.161.40.12</span><span>Đang hoạt động</span></div>
            </div>
            <span style={{ font: 'var(--type-caption)', color: 'var(--mint-600)', fontWeight: 600 }}>Phiên này</span>
          </div>
        </div>
      </div>
    );
  }
  function Info({ k, v, tone }) {
    return (
      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
        <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{k}</div>
        <div style={{ font: '700 16px var(--font-sans)', color: tone || 'var(--text-strong)', marginTop: 3 }}>{v}</div>
      </div>
    );
  }
  function SecHead({ icon, title }) {
    return <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon name={icon} size={19} style={{ color: 'var(--blue-600)' }} /><span style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>{title}</span></div>;
  }
  function APwField({ label, value, onChange, err, hint }) {
    const [show, setShow] = React.useState(false);
    return (
      <div>
        <label style={lab}>{label}</label>
        <div style={{ position: 'relative', marginTop: 6 }}>
          <input type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} style={{ width: '100%', height: 44, border: '1.5px solid ' + (err ? 'var(--red-500)' : 'var(--border-default)'), borderRadius: 'var(--radius-md)', padding: '0 42px 0 14px', font: 'var(--type-body)', outline: 'none', boxSizing: 'border-box', color: 'var(--text-strong)' }} />
          <button type="button" onClick={() => setShow((s) => !s)} style={{ position: 'absolute', right: 6, top: 6, width: 32, height: 32, border: 0, background: 'transparent', color: 'var(--text-subtle)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}><Icon name={show ? 'eye-off' : 'eye'} size={18} /></button>
        </div>
        {err ? <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--red-600)', font: 'var(--type-caption)', marginTop: 5 }}><Icon name="circle-alert" size={13} />{err}</div> : hint ? <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 5 }}>{hint}</div> : null}
      </div>
    );
  }
  function AOtpBoxes({ onChange }) {
    const [d, setD] = React.useState(['', '', '', '', '', '']);
    const refs = React.useRef([]);
    const set = (i, val) => { const v = val.replace(/\D/g, '').slice(-1); const nd = d.slice(); nd[i] = v; setD(nd); onChange && onChange(nd.join('')); if (v && i < 5 && refs.current[i + 1]) refs.current[i + 1].focus(); };
    const key = (i, e) => { if (e.key === 'Backspace' && !d[i] && i > 0 && refs.current[i - 1]) refs.current[i - 1].focus(); };
    return (<div style={{ display: 'flex', gap: 10 }}>{d.map((x, i) => (<input key={i} ref={(el) => (refs.current[i] = el)} inputMode="numeric" maxLength={1} value={x} onChange={(e) => set(i, e.target.value)} onKeyDown={(e) => key(i, e)} onFocus={(e) => (e.target.style.borderColor = 'var(--blue-500)')} onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')} style={{ width: 44, height: 52, textAlign: 'center', font: '800 22px var(--font-sans)', color: 'var(--text-strong)', border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', outline: 'none', boxSizing: 'border-box' }} />))}</div>);
  }

  function Kpi({ label, value }) {
    return <div style={{ flex: 1, minWidth: 0 }}><window.TRDash.StatTile label={label} value={value} /></div>;
  }

  const EVENT = { ESCROW_IN: 'warning', COMMISSION: 'primary', ESCROW_RELEASE: 'success', PAYOUT_ACCRUE: 'mint', PAYOUT_SETTLE: 'neutral', REFUND: 'danger', COD_REMIT: 'warning' };
  const lab = { font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)', display: 'block' };
  const cardBox = { background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: 22 };
  const hrow = { font: '600 12px var(--font-sans)', color: 'var(--text-muted)', textAlign: 'left', background: 'var(--gray-25)' };
  const brow = { borderTop: '1px solid var(--border-subtle)', font: '13px var(--font-sans)', color: 'var(--text-body)' };
  const th = { padding: '11px 12px', whiteSpace: 'nowrap' };
  const td = { padding: '12px 12px', whiteSpace: 'nowrap' };

  window.LZAWithdrawals = Withdrawals;
  window.LZACommission = Commission;
  window.LZALedger = Ledger;
  window.LZARbac = Rbac;
  window.LZAAccount = AccountAdmin;
})();
