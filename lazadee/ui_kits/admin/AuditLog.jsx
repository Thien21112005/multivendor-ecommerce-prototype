/* Lazadee Admin — Nhật ký hệ thống (Audit Logs). Append-only, immutable record
   of sensitive actions (logins, KYC decisions, escrow/payout/refund movements,
   RBAC + config changes). Filter by time window + action category. Mirrors the
   Ledger's "Append-only · bất biến" governance framing. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Badge, Select, Input } = DS;
  const { AUDIT } = window.LZA;

  const CATS = [
    { id: 'all', label: 'Tất cả' },
    { id: 'auth', label: 'Đăng nhập' },
    { id: 'kyc', label: 'KYC' },
    { id: 'finance', label: 'Tài chính' },
    { id: 'moderation', label: 'Kiểm duyệt' },
    { id: 'security', label: 'Bảo mật' },
    { id: 'config', label: 'Cấu hình' },
  ];
  // action → badge variant
  const VARIANT = {
    LOGIN_FAILED: 'danger', KYC_APPROVED: 'success', KYC_REJECTED: 'danger',
    ESCROW_RELEASED: 'success', PAYOUT_APPROVED: 'mint', REFUND_PROCESSED: 'warning',
    REVIEW_HIDDEN: 'neutral', COMMISSION_UPDATED: 'primary', RBAC_ROLE_CHANGED: 'primary',
    STAFF_INVITED: 'primary', PERMISSION_REVOKED: 'danger',
  };
  const CAT_TONE = {
    auth: { fg: 'var(--blue-600)', bg: 'var(--blue-50)', icon: 'lock' },
    kyc: { fg: 'var(--orange-600)', bg: 'var(--orange-50)', icon: 'user-check' },
    finance: { fg: 'var(--mint-600)', bg: 'var(--mint-50)', icon: 'banknote' },
    moderation: { fg: 'var(--text-muted)', bg: 'var(--gray-100)', icon: 'star' },
    security: { fg: 'var(--flash-600)', bg: 'var(--flash-50)', icon: 'shield-check' },
    config: { fg: 'var(--blue-600)', bg: 'var(--blue-50)', icon: 'sliders-horizontal' },
  };

  function AuditLog() {
    const [cat, setCat] = React.useState('all');
    const [range, setRange] = React.useState('7 ngày qua');
    const [q, setQ] = React.useState('');
    const list = AUDIT.filter((r) => (cat === 'all' || r.cat === cat))
      .filter((r) => !q.trim() || (r.actor + ' ' + r.action + ' ' + r.target + ' ' + r.ip).toLowerCase().includes(q.trim().toLowerCase()));
    const failed = AUDIT.filter((r) => r.result === 'DENIED').length;

    return (
      <div style={{ maxWidth: 1180 }}>
        {/* governance banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
          <Badge variant="neutral"><Icon name="lock" size={11} /> Append-only · bất biến</Badge>
          <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Nhật ký ghi nhận mọi hành động nhạy cảm. Bản ghi không thể sửa hoặc xoá — phục vụ điều tra &amp; tuân thủ.</span>
          <Button variant="secondary" size="sm" iconLeft="download" style={{ marginLeft: 'auto' }}>Xuất nhật ký</Button>
        </div>

        {/* filter bar */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: '14px 16px', marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ width: 200 }}>
            <label style={lab}>Khoảng thời gian</label>
            <div style={{ marginTop: 6 }}><Select value={range} onChange={(e) => setRange(e.target.value)}><option>Hôm nay</option><option>7 ngày qua</option><option>30 ngày qua</option><option>Tuỳ chọn…</option></Select></div>
          </div>
          <div style={{ width: 200 }}>
            <label style={lab}>Loại hành động</label>
            <div style={{ marginTop: 6 }}><Select value={cat} onChange={(e) => setCat(e.target.value)}>{CATS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</Select></div>
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <label style={lab}>Tìm kiếm</label>
            <div style={{ marginTop: 6 }}><Input iconLeft="search" placeholder="User, IP, mã tham chiếu…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 44, padding: '0 12px', borderRadius: 'var(--radius-md)', background: 'var(--flash-50)', color: 'var(--flash-600)', font: '600 12px var(--font-sans)' }}>
            <Icon name="triangle-alert" size={15} />{failed} lần truy cập bị từ chối
          </div>
        </div>

        {/* table */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 980, borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums' }}>
            <thead><tr style={hrow}><th style={th}>Thời gian</th><th style={th}>User / Vai trò</th><th style={th}>Hành động</th><th style={th}>Chi tiết</th><th style={th}>IP</th><th style={th}>Kết quả</th></tr></thead>
            <tbody>
              {list.map((r, i) => {
                const tone = CAT_TONE[r.cat] || CAT_TONE.config;
                return (
                  <tr key={i} style={brow}>
                    <td style={{ ...td, color: 'var(--text-muted)', fontSize: 12 }} className="code">{r.ts}</td>
                    <td style={td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <span style={{ width: 30, height: 30, borderRadius: 'var(--radius-md)', background: tone.bg, color: tone.fg, display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name={tone.icon} size={15} /></span>
                        <div style={{ minWidth: 0 }}>
                          <div className="code" style={{ font: '12px var(--font-mono)', color: r.actor === 'unknown' ? 'var(--flash-600)' : 'var(--text-strong)' }}>{r.actor}</div>
                          <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>{r.role}</div>
                        </div>
                      </div>
                    </td>
                    <td style={td}><Badge variant={VARIANT[r.action] || 'neutral'}>{r.action}</Badge></td>
                    <td style={{ ...td, color: 'var(--text-body)', whiteSpace: 'normal', maxWidth: 320 }}>{r.target}</td>
                    <td style={{ ...td, color: 'var(--text-muted)' }} className="code">{r.ip}</td>
                    <td style={td}>{r.result === 'OK'
                      ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--mint-600)', font: '600 12px var(--font-sans)' }}><Icon name="circle-check" size={14} />OK</span>
                      : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--red-600)', font: '600 12px var(--font-sans)' }}><Icon name="ban" size={14} />DENIED</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {list.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-subtle)', font: 'var(--type-body)' }}>Không có bản ghi nào khớp bộ lọc.</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>
          <Icon name="info" size={13} /> Hiển thị {list.length} / {AUDIT.length} bản ghi gần nhất · lưu trữ tối thiểu 12 tháng theo chính sách.
        </div>
      </div>
    );
  }

  const hrow = { font: '600 12px var(--font-sans)', color: 'var(--text-muted)', textAlign: 'left', background: 'var(--gray-25)' };
  const brow = { borderTop: '1px solid var(--border-subtle)', font: '13px var(--font-sans)', color: 'var(--text-body)' };
  const th = { padding: '11px 14px', whiteSpace: 'nowrap' };
  const td = { padding: '12px 14px', whiteSpace: 'nowrap', verticalAlign: 'middle' };
  const lab = { font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)', display: 'block' };

  window.LZAAudit = AuditLog;
})();
