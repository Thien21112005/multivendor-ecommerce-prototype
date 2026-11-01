/* Admin: KYC review queue. List + detail with document thumbnails, approve /
   reject-with-reason. Products can't publish until VERIFIED. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Badge, StatusBadge, Avatar, Modal, Select, Tabs, Checkbox } = DS;
  const { KYC } = window.LZA;

  const SUPP_DOCS = ['CCCD / CMND mặt trước (ảnh mờ / thiếu)', 'CCCD / CMND mặt sau', 'Giấy phép kinh doanh (thiếu / hết hạn)', 'Đăng ký kinh doanh (doanh nghiệp)', 'Ảnh chân dung chủ shop', 'Thông báo thuế'];

  const RISK = { low: ['success', 'Rủi ro thấp'], medium: ['warning', 'Rủi ro trung bình'], high: ['danger', 'Rủi ro cao'] };
  const REASONS = ['Ảnh giấy tờ mờ / không đọc được', 'Thông tin không khớp', 'Giấy tờ hết hạn', 'Nghi ngờ giả mạo', 'Thiếu giấy phép kinh doanh'];

  function KYCReview() {
    const [tab, setTab] = React.useState('PENDING');
    const list = KYC.filter((k) => tab === 'ALL' || k.status === tab);
    const [sel, setSel] = React.useState(KYC[0]);
    const [reject, setReject] = React.useState(false);
    const [reason, setReason] = React.useState(REASONS[0]);
    const [supplement, setSupplement] = React.useState(false);
    const [suppDocs, setSuppDocs] = React.useState([]);
    const [suppNote, setSuppNote] = React.useState('');
    const [suppErr, setSuppErr] = React.useState(false);
    const [decided, setDecided] = React.useState({});
    const toggleSupp = (d) => setSuppDocs((s) => (s.includes(d) ? s.filter((x) => x !== d) : [...s, d]));

    const status = (k) => decided[k.id] || k.status;

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '440px 1fr', gap: 20, alignItems: 'start' }}>
        {/* queue */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <div style={{ padding: '4px 14px 0' }}>
            <div style={{ display: 'flex', whiteSpace: 'nowrap' }}>
            <Tabs value={tab} onChange={setTab} size="sm" items={[
              { id: 'PENDING', label: 'Chờ duyệt', badge: KYC.filter((k) => status(k) === 'PENDING').length },
              { id: 'SUPPLEMENT_REQUESTED', label: 'Chờ bổ sung', badge: Object.values(decided).filter((s) => s === 'SUPPLEMENT_REQUESTED').length || undefined },
              { id: 'VERIFIED', label: 'Đã duyệt' }, { id: 'REJECTED', label: 'Từ chối' }, { id: 'ALL', label: 'Tất cả' },
            ]} />
            </div>
          </div>
          <div>
            {list.map((k) => {
              const on = sel.id === k.id;
              return (
                <button key={k.id} onClick={() => setSel(k)} style={{
                  display: 'flex', gap: 12, width: '100%', textAlign: 'left', border: 0, cursor: 'pointer',
                  padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)', borderLeft: '3px solid ' + (on ? 'var(--blue-500)' : 'transparent'),
                  background: on ? 'var(--blue-50)' : '#fff',
                }}>
                  <Avatar name={k.shop} size={40} square />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ font: '600 14px var(--font-sans)', color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{k.shop}</span>
                    </div>
                    <div style={{ font: '12px var(--font-sans)', color: 'var(--text-muted)', marginTop: 2 }}>{k.owner} · {k.type}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 7 }}>
                      <StatusBadge status={status(k) === 'SUPPLEMENT_REQUESTED' ? 'PENDING' : status(k)} label={status(k) === 'PENDING' ? 'PENDING' : status(k) === 'SUPPLEMENT_REQUESTED' ? 'Chờ bổ sung' : status(k)} />
                      <span className="code" style={{ font: '11px var(--font-mono)', color: 'var(--text-subtle)' }}>{k.id}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* detail */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, paddingBottom: 18, borderBottom: '1px solid var(--border-subtle)' }}>
            <Avatar name={sel.shop} size={56} square />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ font: 'var(--weight-bold) var(--text-xl) var(--font-sans)', color: 'var(--text-strong)' }}>{sel.shop}</span>
                {(() => { const [v, l] = RISK[sel.risk]; return <Badge variant={v}>{l}</Badge>; })()}
              </div>
              <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)', marginTop: 4 }}>Chủ sở hữu: <b style={{ color: 'var(--text-body)' }}>{sel.owner}</b> · Loại hình: {sel.type} · Nộp lúc {sel.submitted}</div>
              <div style={{ marginTop: 8 }}><StatusBadge status={status(sel)} /></div>
            </div>
            <span className="code" style={{ font: '12px var(--font-mono)', color: 'var(--text-muted)', background: 'var(--gray-100)', padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}>{sel.id}</span>
          </div>

          {/* documents */}
          <div style={{ margin: '18px 0' }}>
            <div style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)', marginBottom: 10 }}>Hồ sơ đã tải lên ({sel.docs.length})</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {sel.docs.map((d, i) => (
                <div key={i} style={{ width: 150 }}>
                  <div style={{ height: 96, borderRadius: 'var(--radius-md)', background: 'var(--gray-100)', border: '1px solid var(--border-default)', display: 'grid', placeItems: 'center', color: 'var(--text-subtle)', position: 'relative' }}>
                    <Icon name="file-text" size={28} />
                    <span style={{ position: 'absolute', bottom: 6, right: 6, background: '#fff', borderRadius: 'var(--radius-xs)', padding: '1px 5px', font: '10px var(--font-mono)', color: 'var(--text-muted)', boxShadow: 'var(--shadow-xs)' }}>{i % 2 ? 'PDF' : 'JPG'}</span>
                  </div>
                  <div style={{ font: '12px var(--font-sans)', color: 'var(--text-body)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="eye" size={13} /> {d}</div>
                </div>
              ))}
            </div>
          </div>

          {sel.reason && status(sel) === 'REJECTED' && (
            <div style={{ display: 'flex', gap: 8, background: 'var(--red-50)', color: 'var(--red-600)', borderRadius: 'var(--radius-md)', padding: '10px 14px', font: 'var(--type-body-sm)', marginBottom: 16 }}>
              <Icon name="triangle-alert" size={16} /> <span><b>Lý do từ chối:</b> {sel.reason}</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, background: 'var(--amber-50)', color: 'var(--amber-600)', borderRadius: 'var(--radius-md)', padding: '10px 14px', font: 'var(--type-body-sm)', marginBottom: 18 }}>
            <Icon name="info" size={16} /> <span>Người bán <b>không thể đăng bán sản phẩm</b> cho đến khi hồ sơ được duyệt <b>VERIFIED</b>.</span>
          </div>

          {/* actions */}
          {status(sel) === 'PENDING' && (
            <div style={{ display: 'flex', gap: 12 }}>
              <Button variant="danger" iconLeft="ban" onClick={() => setReject(true)}>Từ chối</Button>
              <Button iconLeft="badge-check" onClick={() => setDecided((d) => ({ ...d, [sel.id]: 'VERIFIED' }))}>Phê duyệt KYC</Button>
              <Button variant="ghost" iconLeft="message-circle" onClick={() => { setSupplement(true); setSuppDocs([]); setSuppNote(''); setSuppErr(false); }}>Yêu cầu bổ sung</Button>
            </div>
          )}
          {status(sel) === 'SUPPLEMENT_REQUESTED' && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Badge variant="warning" icon="clock">Chờ bổ sung</Badge>
              <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Đã gửi yêu cầu, chờ người bán nộp lại.</span>
              <Button variant="secondary" size="sm" iconLeft="undo-2" style={{ marginLeft: 'auto' }} onClick={() => setDecided((d) => { const n = { ...d }; delete n[sel.id]; return n; })}>Đưa lại vào hàng chờ</Button>
            </div>
          )}
          {status(sel) !== 'PENDING' && status(sel) !== 'SUPPLEMENT_REQUESTED' && (
            <Button variant="secondary" iconLeft="undo-2" onClick={() => setDecided((d) => { const n = { ...d }; delete n[sel.id]; return n; })}>Đưa lại vào hàng chờ</Button>
          )}
        </div>

        <Modal open={supplement} onClose={() => setSupplement(false)} width={560} title={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Icon name="file-text" size={18} style={{ color: 'var(--amber-600, #C77700)' }} />Yêu cầu bổ sung — {sel.shop}</span>}
          footer={<>
            <Button variant="ghost" onClick={() => setSupplement(false)}>Huỷ</Button>
            <Button iconLeft="send" onClick={() => { if (suppDocs.length === 0) { setSuppErr(true); return; } setDecided((d) => ({ ...d, [sel.id]: 'SUPPLEMENT_REQUESTED' })); setSupplement(false); }}>Gửi yêu cầu bổ sung</Button>
          </>}>
          <div style={{ width: 'min(500px, 84vw)' }}>
            <label style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)', display: 'block', marginBottom: 8 }}>Chọn giấy tờ cần bổ sung:</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
              {SUPP_DOCS.map((d) => (
                <label key={d} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: suppDocs.includes(d) ? 'var(--amber-50, #FEF3E2)' : 'transparent', font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>
                  <Checkbox checked={suppDocs.includes(d)} onChange={() => toggleSupp(d)} />{d}
                </label>
              ))}
            </div>
            {suppErr && <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--red-600)', font: 'var(--type-caption)', marginBottom: 12 }}><Icon name="circle-alert" size={13} />Chọn ít nhất 1 giấy tờ cần bổ sung.</div>}
            <label style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)', display: 'block', marginBottom: 6 }}>Ghi chú cho người bán:</label>
            <textarea value={suppNote} onChange={(e) => setSuppNote(e.target.value)} rows={3} placeholder="VD: Ảnh CCCD mặt trước bị mờ, vui lòng chụp lại rõ nét hơn." style={{ width: '100%', border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '9px 12px', font: 'var(--type-body)', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: 9, marginTop: 14, padding: '11px 13px', background: 'var(--blue-50)', border: '1px solid var(--blue-200)', borderRadius: 'var(--radius-md)' }}>
              <Icon name="info" size={16} style={{ color: 'var(--blue-600)', flex: 'none', marginTop: 1 }} />
              <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)', lineHeight: 1.5 }}>Người bán sẽ nhận thông báo và có <b>7 ngày</b> để bổ sung. Hồ sơ chuyển sang trạng thái <b>Chờ bổ sung</b> (SUPPLEMENT_REQUESTED).</span>
            </div>
          </div>
        </Modal>

        <Modal open={reject} onClose={() => setReject(false)} title={'Từ chối hồ sơ ' + sel.id}
          footer={<>
            <Button variant="ghost" onClick={() => setReject(false)}>Huỷ</Button>
            <Button variant="danger" onClick={() => { setDecided((d) => ({ ...d, [sel.id]: 'REJECTED' })); setReject(false); }}>Xác nhận từ chối</Button>
          </>}>
          <p style={{ font: 'var(--type-body)', color: 'var(--text-muted)', marginBottom: 16 }}>Người bán <b style={{ color: 'var(--text-body)' }}>{sel.shop}</b> sẽ nhận thông báo kèm lý do và có thể nộp lại hồ sơ.</p>
          <Select label="Lý do từ chối" value={reason} onChange={(e) => setReason(e.target.value)}>
            {REASONS.map((r) => <option key={r}>{r}</option>)}
          </Select>
        </Modal>
      </div>
    );
  }

  window.LZAKyc = KYCReview;
})();
