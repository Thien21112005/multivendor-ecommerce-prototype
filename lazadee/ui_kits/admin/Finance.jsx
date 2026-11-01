/* Admin finance & governance: withdrawal processing, commission config,
   append-only ledger, staff RBAC. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Badge, StatusBadge, Avatar, Switch, Input, Money } = DS;
  const { WITHDRAWALS, LEDGER, STAFF, ROLES, PERMS, ALL_PERMS, PERM_DESC, ROLE_PERMS, CURRENT_USER } = window.LZA;
  const { Modal, Select, Checkbox } = DS;
  const APW_COLORS = ['var(--red-500)', 'var(--red-500)', 'var(--gold-500)', 'var(--mint-500)', 'var(--mint-600)'];
  const APW_LABELS = ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
  const aStrength = (p) => { let s = 0; if (p.length >= 8) s++; if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++; return s; };
  const formatVND = Money.format;

  /* ---------- Withdrawals ---------- */
  function Withdrawals() {
    const [done, setDone] = React.useState({});
    const st = (w) => done[w.id] || w.state;
    const queue = WITHDRAWALS.filter((w) => st(w) === 'PENDING');
    const totalPending = queue.reduce((n, w) => n + w.amount, 0);
    return (
      <div style={{ maxWidth: 1180 }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <Kpi icon="hand-coins" label="Chờ xử lý" value={queue.length + ' yêu cầu'} tone={{ bg: 'var(--amber-50)', fg: 'var(--amber-600)' }} />
          <Kpi icon="banknote" label="Tổng tiền chờ chi" value={formatVND(totalPending)} tone={{ bg: 'var(--blue-50)', fg: 'var(--blue-600)' }} />
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
                    <td style={{ ...td, color: 'var(--text-muted)' }} className="code">{w.bank}</td>
                    <td style={{ ...td, textAlign: 'right', fontWeight: 700 }}>{formatVND(w.amount)}</td>
                    <td style={td}><StatusBadge status={w.kyc === 'VERIFIED' ? 'VERIFIED' : 'PENDING'} label={w.kyc} dot={false} /></td>
                    <td style={{ ...td, color: 'var(--text-muted)', fontSize: 12 }}>{w.requested}</td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      {st(w) === 'PAID' ? <Badge variant="success" icon="circle-check">Đã chi</Badge>
                        : st(w) === 'DONE' ? <Badge variant="success" icon="circle-check">Đã duyệt chi</Badge>
                        : blocked ? <Badge variant="danger" icon="lock">Chặn — KYC chưa duyệt</Badge>
                        : <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                            <Button variant="ghost" size="sm" onClick={() => setDone((d) => ({ ...d, [w.id]: 'REJECTED' }))}>Từ chối</Button>
                            <Button size="sm" iconLeft="check" onClick={() => setDone((d) => ({ ...d, [w.id]: 'DONE' }))}>Duyệt chi</Button>
                          </div>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* ---------- Commission config ---------- */
  function Commission() {
    const cats = [['Điện tử', 5], ['Thời trang', 8], ['Làm đẹp', 10], ['Nhà cửa', 6], ['Phụ kiện', 7], ['Bách hoá', 4]];
    return (
      <div style={{ maxWidth: 1180 }}>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: 22, marginBottom: 16 }}>
          <div style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)', marginBottom: 4 }}>Phí hoa hồng mặc định</div>
          <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)', marginBottom: 16 }}>Áp dụng cho mọi giao dịch chưa có cấu hình riêng theo ngành hàng.</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
            <div style={{ width: 140 }}><Input label="Phí sàn (%)" defaultValue="5" iconRight="percent" /></div>
            <Button variant="secondary">Lưu mặc định</Button>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>Hoa hồng theo ngành hàng</div>
          {cats.map(([c, v]) => (
            <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ flex: 1, font: 'var(--type-body)', color: 'var(--text-body)' }}>{c}</span>
              <div style={{ width: 90 }}><Input defaultValue={String(v)} iconRight="percent" /></div>
              <Switch defaultChecked />
            </div>
          ))}
          <div style={{ padding: 16, textAlign: 'right' }}><Button>Lưu cấu hình</Button></div>
        </div>
      </div>
    );
  }

  /* ---------- Append-only ledger ---------- */
  function Ledger() {
    return (
      <div style={{ maxWidth: 1180 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <Badge variant="neutral"><Icon name="lock" size={11} /> Append-only · bất biến</Badge>
          <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Mỗi dòng là một bút toán không thể sửa/xoá. Điều chỉnh = thêm bút toán đảo.</span>
          <Button variant="secondary" size="sm" iconLeft="download" style={{ marginLeft: 'auto' }}>Xuất sổ cái</Button>
        </div>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 900, borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums' }}>
            <thead><tr style={hrow}><th style={th}>Seq</th><th style={th}>Thời gian</th><th style={th}>Sự kiện</th><th style={th}>Tham chiếu</th><th style={th}>Tài khoản</th><th style={{ ...th, textAlign: 'right' }}>Nợ</th><th style={{ ...th, textAlign: 'right' }}>Có</th></tr></thead>
            <tbody>
              {LEDGER.map((r) => (
                <tr key={r.seq} style={brow}>
                  <td style={{ ...td, color: 'var(--text-subtle)' }} className="code">#{r.seq}</td>
                  <td style={{ ...td, color: 'var(--text-muted)', fontSize: 12 }} className="code">{r.ts}</td>
                  <td style={td}><Badge variant={EVENT[r.event] || 'neutral'}>{r.event}</Badge></td>
                  <td style={td}><span className="code" style={{ fontSize: 12 }}>{r.ref}</span></td>
                  <td style={{ ...td, color: 'var(--text-body)' }}>{r.account}</td>
                  <td style={{ ...td, textAlign: 'right', color: r.debit ? 'var(--red-600)' : 'var(--text-disabled)', fontWeight: r.debit ? 600 : 400 }}>{r.debit ? formatVND(r.debit) : '—'}</td>
                  <td style={{ ...td, textAlign: 'right', color: r.credit ? 'var(--green-600)' : 'var(--text-disabled)', fontWeight: r.credit ? 600 : 400 }}>{r.credit ? formatVND(r.credit) : '—'}</td>
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
    return (
      <div style={{ maxWidth: 1180 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Phân quyền theo vai trò (RBAC). {staff.length} nhân viên · {ROLES.length} vai trò. Di chuột lên mã quyền để xem mô tả.</span>
          <Button size="sm" iconLeft="plus-circle" style={{ marginLeft: 'auto' }} onClick={() => setInviting(true)}>Mời nhân viên</Button>
        </div>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 760, borderCollapse: 'collapse' }}>
            <thead><tr style={hrow}><th style={th}>Nhân viên</th><th style={th}>Vai trò</th><th style={th}>Quyền</th><th style={th}>Trạng thái</th><th style={{ ...th, textAlign: 'right' }}></th></tr></thead>
            <tbody>
              {staff.map((s) => {
                const perms = s.perms.includes('all') ? ['Toàn quyền'] : s.perms;
                return (
                  <tr key={s.email} style={brow}>
                    <td style={td}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Avatar name={s.name} size={34} /><div><div style={{ font: '600 13px var(--font-sans)', color: 'var(--text-strong)' }}>{s.name}</div><div className="code" style={{ font: '11px var(--font-mono)', color: 'var(--text-muted)' }}>{s.email}</div></div></div></td>
                    <td style={td}><Badge variant={s.role === 'Super Admin' ? 'primary' : 'outline'}>{s.role}</Badge></td>
                    <td style={td}><div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', maxWidth: 300 }}>{perms.map((p) => <span key={p} title={PERM_DESC[p] || (p === 'Toàn quyền' ? 'Có tất cả quyền trong hệ thống' : p)} className="code" style={{ font: '11px var(--font-mono)', background: 'var(--gray-100)', color: 'var(--text-body)', padding: '2px 6px', borderRadius: 'var(--radius-xs)', cursor: 'help' }}>{p}</span>)}</div></td>
                    <td style={td}>{s.pending ? <Badge variant="warning" icon="clock">Chờ kích hoạt</Badge> : s.active ? <Badge variant="success">Hoạt động</Badge> : <Badge variant="neutral">Tạm khoá</Badge>}</td>
                    <td style={{ ...td, textAlign: 'right' }}><Button variant="ghost" size="sm" iconLeft="pencil" onClick={() => setEditing(s)}>Sửa</Button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {editing && <RbacEditor staff={editing} onClose={() => setEditing(null)} onSave={(patch) => { save(editing.email, patch); setEditing(null); }} />}
        {inviting && <InviteStaff onClose={() => setInviting(false)} onInvite={addStaff} />}
      </div>
    );
  }

  function InviteStaff({ onClose, onInvite }) {
    const [f, setF] = React.useState({ name: '', email: '', role: 'Moderator' });
    const [perms, setPerms] = React.useState((ROLE_PERMS['Moderator'] || []).slice());
    const [sent, setSent] = React.useState(false);
    const [err, setErr] = React.useState({});
    const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
    const pickRole = (r) => { set('role', r); setPerms((ROLE_PERMS[r] || []).slice()); };
    const toggle = (code) => setPerms((p) => (p.includes(code) ? p.filter((x) => x !== code) : [...p, code]));
    const submit = () => {
      const e = {};
      if (!f.name.trim()) e.name = 'Nhập họ tên';
      if (!/.+@.+\..+/.test(f.email)) e.email = 'Email không hợp lệ';
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
            <div><label style={lab}>Vai trò</label><div style={{ marginTop: 6 }}><Select value={f.role} onChange={(e) => pickRole(e.target.value)}>{EDIT_ROLES.map((r) => <option key={r}>{r}</option>)}</Select></div></div>
          </div>
          <Input label="Email công việc" iconLeft="mail" value={f.email} onChange={(e) => set('email', e.target.value)} error={err.email} placeholder="ten@lazadee.vn" />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <label style={lab}>Quyền cấp theo vai trò</label>
              <span style={{ marginLeft: 'auto', font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{perms.length}/{ALL_PERMS.length} quyền</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {PERMS.map((p) => {
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

  const EDIT_ROLES = ['Super Admin', 'Moderator', 'Finance Staff', 'CS Staff'];
  function RbacEditor({ staff, onClose, onSave }) {
    const initRole = EDIT_ROLES.includes(staff.role) ? staff.role : 'Moderator';
    const [role, setRole] = React.useState(initRole);
    const [perms, setPerms] = React.useState(() => (staff.perms.includes('all') ? ALL_PERMS.slice() : staff.perms.slice()));
    const [active, setActive] = React.useState(staff.active);
    const pickRole = (r) => { setRole(r); setPerms((ROLE_PERMS[r] || []).slice()); };
    const toggle = (code) => setPerms((p) => (p.includes(code) ? p.filter((x) => x !== code) : [...p, code]));
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
            <label style={lab}>Vai trò</label>
            <div style={{ marginTop: 6 }}><Select value={role} onChange={(e) => pickRole(e.target.value)}>{EDIT_ROLES.map((r) => <option key={r}>{r}</option>)}</Select></div>
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 6 }}>Chọn vai trò sẽ tự động tích các quyền mặc định — bạn có thể tuỳ chỉnh bên dưới.</div>
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
                  <label key={p.code} style={{ display: 'flex', alignItems: 'flex-start', gap: 11, padding: '11px 14px', cursor: 'pointer', background: on ? 'var(--blue-50)' : '#fff', borderTop: i ? '1px solid var(--border-subtle)' : 'none' }}>
                    <Checkbox checked={on} onChange={() => toggle(p.code)} />
                    <div style={{ minWidth: 0 }}>
                      <div className="code" style={{ font: '12px var(--font-mono)', color: on ? 'var(--blue-600)' : 'var(--text-strong)', fontWeight: 600 }}>{p.code}</div>
                      <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 1 }}>{p.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
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
      if (f.nw.length < 8) e.nw = 'Tối thiểu 8 ký tự'; else if (!/[0-9]/.test(f.nw)) e.nw = 'Cần ít nhất 1 chữ số'; else if (!/[^A-Za-z0-9]/.test(f.nw)) e.nw = 'Cần ít nhất 1 ký tự đặc biệt';
      if (f.cf !== f.nw) e.cf = 'Mật khẩu nhập lại không khớp';
      setErr(e); if (Object.keys(e).length === 0) { setStage('otp'); setResend(60); setOtp(''); }
    };
    const confirm = () => { setStage('done'); setF({ cur: '', nw: '', cf: '' }); setTimeout(() => setStage('form'), 2800); };
    return (
      <div style={{ maxWidth: 1180, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* profile */}
        <div style={cardBox}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Avatar name={u.name} size={64} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h2 style={{ font: 'var(--type-h4)', color: 'var(--text-strong)', margin: 0 }}>{u.name}</h2>
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
                <APwField label="Mật khẩu mới" value={f.nw} onChange={(v) => set('nw', v)} err={err.nw} hint="Tối thiểu 8 ký tự, cần chữ hoa, số và ký tự đặc biệt" />
                {f.nw && <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}><div style={{ flex: 1, height: 5, borderRadius: 3, background: 'var(--gray-200)', overflow: 'hidden' }}><div style={{ width: (strength / 4 * 100) + '%', height: '100%', borderRadius: 3, background: APW_COLORS[strength], transition: 'all .3s' }} /></div><span style={{ font: '600 12px var(--font-sans)', color: APW_COLORS[strength], minWidth: 64 }}>{APW_LABELS[strength]}</span></div>}
              </div>
              <APwField label="Nhập lại mật khẩu mới" value={f.cf} onChange={(v) => set('cf', v)} err={err.cf} />
              {stage === 'form' && <div><Button iconLeft="check" onClick={submit}>Cập nhật mật khẩu</Button></div>}
              {stage === 'otp' && (
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}><Icon name="mail" size={16} style={{ color: 'var(--blue-600)' }} /><span style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>Mã OTP đã gửi đến <b>ye****@lazadee.vn</b></span></div>
                  <AOtpBoxes onChange={setOtp} />
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
            <Button variant="outline" size="sm" iconLeft="log-out" style={{ marginLeft: 'auto' }}>Đăng xuất tất cả</Button>
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

  function Kpi({ icon, label, value, tone }) {
    return (
      <div style={{ flex: 1, background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: tone.bg, color: tone.fg, display: 'grid', placeItems: 'center' }}><Icon name={icon} size={17} /></span>
          <span style={{ font: '500 13px var(--font-sans)', color: 'var(--text-muted)' }}>{label}</span>
        </div>
        <div style={{ font: '800 24px var(--font-sans)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      </div>
    );
  }

  const EVENT = { ESCROW_IN: 'warning', COMMISSION: 'primary', ESCROW_RELEASE: 'success', PAYOUT_ACCRUE: 'mint', PAYOUT_SETTLE: 'neutral', REFUND: 'danger' };
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
