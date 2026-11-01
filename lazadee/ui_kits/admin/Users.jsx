/* Admin: customer and shop accounts — search by email, phone or shop name; see status,
   order count and warnings; suspend with reason + duration, unlock with reason. Staff
   accounts are locked from Phân quyền nhân viên. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Badge, Avatar, Modal, Select, Tabs } = DS;
  const { USERS } = window.LZA;

  const STATUS = {
    ACTIVE: ['success', 'Hoạt động'],
    SUSPENDED: ['warning', 'Đình chỉ'],
    LOCKED: ['danger', 'Đã khóa'],
  };
  const TERMS = { '7 ngày': '7 ngày', '30 ngày': '30 ngày', 'Vô thời hạn': null };
  const REASONS = ['Người bán gian lận hàng giả', 'Hoàn hàng bất thường nhiều lần', 'Spam đánh giá / mua giả', 'Lừa đảo, chuyển hướng giao dịch', 'Lý do khác'];

  function Users() {
    const [rows, setRows] = React.useState(USERS);
    const [q, setQ] = React.useState('');
    const [tab, setTab] = React.useState('all');
    const [lock, setLock] = React.useState(null);
    const [unlock, setUnlock] = React.useState(null);
    const [reason, setReason] = React.useState(REASONS[0]);
    const [note, setNote] = React.useState('');
    const [term, setTerm] = React.useState('7 ngày');
    const [noteErr, setNoteErr] = React.useState(false);

    const needle = q.trim().toLowerCase();
    const list = rows
      .filter((u) => tab === 'all' || (tab === 'locked' ? u.status !== 'ACTIVE' : u.role === tab))
      .filter((u) => !needle || [u.name, u.email, u.phone, u.shop || ''].join(' ').toLowerCase().includes(needle));

    const openLock = (u) => { setLock(u); setReason(REASONS[0]); setNote(''); setTerm('7 ngày'); setNoteErr(false); };
    const openUnlock = (u) => { setUnlock(u); setNote(''); setNoteErr(false); };
    const doLock = () => {
      if (reason === 'Lý do khác' && !note.trim()) { setNoteErr(true); return; }
      const text = reason === 'Lý do khác' ? note.trim() : reason;
      const until = TERMS[term];
      setRows((rs) => rs.map((u) => (u.id === lock.id ? { ...u, status: 'SUSPENDED', reason: text, until: until || 'Vô thời hạn' } : u)));
      setLock(null);
    };
    const doUnlock = () => {
      if (!note.trim()) { setNoteErr(true); return; }
      setRows((rs) => rs.map((u) => (u.id === unlock.id ? { ...u, status: 'ACTIVE', reason: null, until: null } : u)));
      setUnlock(null);
    };
    const count = (fn) => rows.filter(fn).length;

    return (
      <div style={{ maxWidth: 1180 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 280, maxWidth: 440 }}>
            <span style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-subtle)', display: 'flex' }}><Icon name="search" size={16} /></span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm theo email, số điện thoại, tên shop..." style={{ width: '100%', height: 40, paddingLeft: 36, border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', font: 'var(--type-body-sm)', outline: 'none', boxSizing: 'border-box', background: '#fff' }} />
          </div>
          <span style={{ marginLeft: 'auto', font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Khóa nhân viên ở mục <b>Phân quyền nhân viên</b>.</span>
        </div>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <div style={{ padding: '4px 16px 0' }}>
            <Tabs value={tab} onChange={setTab} items={[
              { id: 'all', label: 'Tất cả', badge: rows.length },
              { id: 'CUSTOMER', label: 'Khách hàng', badge: count((u) => u.role === 'CUSTOMER') },
              { id: 'VENDOR', label: 'Shop', badge: count((u) => u.role === 'VENDOR') },
              { id: 'locked', label: 'Đang khóa / đình chỉ', badge: count((u) => u.status !== 'ACTIVE') || undefined },
            ]} />
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: 880, borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums' }}>
              <thead><tr style={hrow}><th style={c}>Tài khoản</th><th style={c}>Loại</th><th style={c}>Số điện thoại</th><th style={{ ...c, textAlign: 'right' }}>Số đơn</th><th style={c}>Cảnh báo</th><th style={c}>Trạng thái</th><th style={{ ...c, textAlign: 'right' }}>Thao tác</th></tr></thead>
              <tbody>
                {list.length === 0 && <tr><td colSpan="7" style={{ padding: 40, textAlign: 'center', font: 'var(--type-body)', color: 'var(--text-muted)' }}>Không tìm thấy tài khoản nào.</td></tr>}
                {list.map((u) => {
                  const [v, l] = STATUS[u.status];
                  return (
                    <tr key={u.id} style={{ borderTop: '1px solid var(--border-subtle)', font: '13px var(--font-sans)', color: 'var(--text-body)' }}>
                      <td style={c}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Avatar name={u.shop || u.name} size={34} square={u.role === 'VENDOR'} /><div><div style={{ fontWeight: 600, color: 'var(--text-strong)' }}>{u.shop || u.name}</div><div className="code" style={{ font: '11px var(--font-mono)', color: 'var(--text-muted)' }}>{u.email}</div></div></div></td>
                      <td style={c}><Badge variant={u.role === 'VENDOR' ? 'primary' : 'neutral'}>{u.role === 'VENDOR' ? 'Shop' : 'Khách hàng'}</Badge></td>
                      <td style={c}><span className="code">{u.phone}</span></td>
                      <td style={{ ...c, textAlign: 'right' }}>{u.orders.toLocaleString('vi-VN')}</td>
                      <td style={c}>{u.warnings > 0 ? <Badge variant="danger" icon="triangle-alert">{u.warnings} cảnh báo</Badge> : <span style={{ color: 'var(--text-subtle)' }}>—</span>}</td>
                      <td style={c}><Badge variant={v}>{l}</Badge>{u.reason && <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 3, maxWidth: 220, whiteSpace: 'normal' }}>{u.reason}{u.until ? ' · ' + u.until : ''}</div>}</td>
                      <td style={{ ...c, textAlign: 'right' }}>{u.status === 'ACTIVE'
                        ? <Button size="sm" variant="ghost" iconLeft="lock" style={{ color: 'var(--red-600)' }} onClick={() => openLock(u)}>Khóa tài khoản</Button>
                        : <Button size="sm" variant="outline" iconLeft="check" onClick={() => openUnlock(u)}>Mở khóa</Button>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <Modal open={!!lock} onClose={() => setLock(null)} width={480} title={lock && 'Khóa tài khoản — ' + (lock.shop || lock.name)}
          footer={<><Button variant="ghost" onClick={() => setLock(null)}>Huỷ</Button><Button variant="danger" iconLeft="lock" onClick={doLock}>Xác nhận khóa</Button></>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Select label="Lý do đình chỉ" value={reason} onChange={(e) => { setReason(e.target.value); setNoteErr(false); }}>{REASONS.map((r) => <option key={r}>{r}</option>)}</Select>
            <Select label="Thời hạn" value={term} onChange={(e) => setTerm(e.target.value)}>{Object.keys(TERMS).map((t) => <option key={t}>{t}</option>)}</Select>
            {reason === 'Lý do khác' && <Note value={note} onChange={(v) => { setNote(v); setNoteErr(false); }} err={noteErr} label="Mô tả lý do" />}
            <div style={{ display: 'flex', gap: 8, font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.5 }}><Icon name="info" size={15} style={{ flex: 'none', color: 'var(--blue-600)' }} />Mọi phiên đăng nhập của tài khoản sẽ bị thu hồi ngay. Đình chỉ có thời hạn tự mở khi hết hạn; vô thời hạn chỉ mở thủ công.</div>
          </div>
        </Modal>
        <Modal open={!!unlock} onClose={() => setUnlock(null)} width={440} title={unlock && 'Mở khóa — ' + (unlock.shop || unlock.name)}
          footer={<><Button variant="ghost" onClick={() => setUnlock(null)}>Huỷ</Button><Button iconLeft="check" onClick={doUnlock}>Mở khóa</Button></>}>
          <Note value={note} onChange={(v) => { setNote(v); setNoteErr(false); }} err={noteErr} label="Lý do mở khóa (bắt buộc)" />
        </Modal>
      </div>
    );
  }

  function Note({ value, onChange, err, label }) {
    return (
      <div>
        <label style={{ display: 'block', font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)', marginBottom: 6 }}>{label}</label>
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} style={{ width: '100%', padding: '9px 12px', border: '1.5px solid ' + (err ? 'var(--red-500)' : 'var(--border-default)'), borderRadius: 'var(--radius-md)', font: 'var(--type-body)', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
        {err && <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--red-600)', font: 'var(--type-caption)', marginTop: 4 }}><Icon name="circle-alert" size={13} />Vui lòng nhập lý do</div>}
      </div>
    );
  }
  const hrow = { font: '600 12px var(--font-sans)', color: 'var(--text-muted)', textAlign: 'left', background: 'var(--gray-25)' };
  const c = { padding: '11px 16px', whiteSpace: 'nowrap', verticalAlign: 'middle' };
  window.LZAUsers = Users;
})();
