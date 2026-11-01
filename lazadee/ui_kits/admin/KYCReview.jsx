/* Admin: KYC review queue. List + detail with document thumbnails, approve /
   reject-with-reason. Products can't publish until VERIFIED. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Badge, StatusBadge, Avatar, Modal, Select, Tabs, Checkbox } = DS;
  const { KYC } = window.LZA;

  const SUPP_DOCS = ['CCCD / CMND mặt trước (ảnh mờ / thiếu)', 'CCCD / CMND mặt sau', 'Giấy phép kinh doanh (thiếu / hết hạn)', 'Đăng ký kinh doanh (doanh nghiệp)', 'Ảnh chân dung chủ shop', 'Thông báo thuế'];

  const RISK = { low: ['success', 'Rủi ro thấp'], medium: ['warning', 'Rủi ro trung bình'], high: ['danger', 'Rủi ro cao'] };
  const REASONS = ['Ảnh giấy tờ mờ / không đọc được', 'Thông tin không khớp', 'Giấy tờ hết hạn', 'Nghi ngờ giả mạo', 'Thiếu giấy phép kinh doanh', 'Lý do khác'];

  // Mock OCR/authenticity output per dossier risk level
  const OCR = {
    low: { status: ['success', 'Đạt'], checks: [['QR Code', true], ['Quốc huy', true], ['MRZ', true], ['Vân tay', true], ['Khớp khuôn mặt', true]], errors: [] },
    medium: { status: ['warning', 'Đạt một phần'], checks: [['QR Code', true], ['Quốc huy', true], ['MRZ', false], ['Vân tay', true], ['Khớp khuôn mặt', true]], errors: ['MRZ mờ, không đọc được 2 ký tự cuối.'] },
    high: { status: ['danger', 'Không đạt'], checks: [['QR Code', false], ['Quốc huy', true], ['MRZ', false], ['Vân tay', false], ['Khớp khuôn mặt', false]], errors: ['Không đọc được QR trên CCCD.', 'Độ khớp khuôn mặt 41% (yêu cầu ≥ 85%).'] },
  };

  function DocViewer({ label, onClose }) {
    const [zoom, setZoom] = React.useState(1);
    const [rot, setRot] = React.useState(0);
    const [flip, setFlip] = React.useState(false);
    const tool = (icon, title, fn) => <button aria-label={title} title={title} onClick={fn} style={{ width: 36, height: 36, border: 0, borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,.14)', color: '#fff', cursor: 'pointer', display: 'grid', placeItems: 'center' }}><Icon name={icon} size={18} /></button>;
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(20,23,31,.9)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 18px', color: '#fff' }}>
          <Icon name="file-text" size={18} /><b style={{ font: '600 14px var(--font-sans)', marginRight: 'auto' }}>Trình xem tài liệu — {label}</b>
          {tool('plus', 'Phóng to', () => setZoom((z) => Math.min(3, z + 0.25)))}
          {tool('minus', 'Thu nhỏ', () => setZoom((z) => Math.max(0.5, z - 0.25)))}
          {tool('refresh-cw', 'Xoay', () => setRot((r) => r + 90))}
          {tool('arrow-right', 'Lật', () => setFlip((f) => !f))}
          {tool('x', 'Đóng', onClose)}
        </div>
        <div style={{ flex: 1, overflow: 'auto', display: 'grid', placeItems: 'center' }}>
          <div style={{ width: 460, height: 290, borderRadius: 14, background: 'linear-gradient(135deg, #F1E7C9, #D9E8D4)', boxShadow: 'var(--shadow-xl)', padding: 22, boxSizing: 'border-box', transform: `scale(${zoom}) rotate(${rot}deg) scaleX(${flip ? -1 : 1})`, transition: 'transform .2s ease', color: '#3B3A2E' }}>
            <div style={{ font: '800 13px var(--font-sans)', letterSpacing: '.04em', textTransform: 'uppercase' }}>{label}</div>
            <div style={{ display: 'flex', gap: 16, marginTop: 18 }}>
              <div style={{ width: 96, height: 124, borderRadius: 8, background: 'rgba(0,0,0,.14)', display: 'grid', placeItems: 'center' }}><Icon name="user" size={40} /></div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>{[90, 70, 80, 60].map((w) => <span key={w} style={{ height: 11, width: w + '%', borderRadius: 3, background: 'rgba(0,0,0,.16)' }} />)}</div>
            </div>
            <div style={{ marginTop: 18, font: '11px var(--font-mono)', opacity: .65 }}>Tài liệu mẫu trong prototype</div>
          </div>
        </div>
      </div>
    );
  }

  function KYCReview() {
    const [viewer, setViewer] = React.useState(null);
    const [shopRate, setShopRate] = React.useState({});
    const [reasonNote, setReasonNote] = React.useState('');
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
                {sel.id === 'KYC-1041' && <Badge variant="outline" icon="eye">Hậu kiểm ngẫu nhiên</Badge>}
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
                <div key={i} style={{ width: 150, cursor: 'zoom-in' }} onClick={() => setViewer(d)}>
                  <div style={{ height: 96, borderRadius: 'var(--radius-md)', background: 'var(--gray-100)', border: '1px solid var(--border-default)', display: 'grid', placeItems: 'center', color: 'var(--text-subtle)', position: 'relative' }}>
                    <Icon name="file-text" size={28} />
                    <span style={{ position: 'absolute', bottom: 6, right: 6, background: '#fff', borderRadius: 'var(--radius-xs)', padding: '1px 5px', font: '10px var(--font-mono)', color: 'var(--text-muted)', boxShadow: 'var(--shadow-xs)' }}>{i % 2 ? 'PDF' : 'JPG'}</span>
                  </div>
                  <div style={{ font: '12px var(--font-sans)', color: 'var(--text-body)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="eye" size={13} /> {d}</div>
                </div>
              ))}
            </div>
          </div>

          {/* OCR + authenticity */}
          {(() => {
            const o = OCR[sel.risk] || OCR.medium;
            return (
              <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px 16px', marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Icon name="shield-check" size={17} style={{ color: 'var(--blue-600)' }} />
                  <span style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>Kết quả xác thực tự động</span>
                  <span style={{ marginLeft: 'auto' }}><Badge variant={o.status[0]}>{o.status[1]}</Badge></span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                  {o.checks.map(([k, ok]) => <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 'var(--radius-pill)', font: '600 12px var(--font-sans)', background: ok ? 'var(--mint-50)' : 'var(--red-50, #FDECEA)', color: ok ? 'var(--mint-600)' : 'var(--red-600)' }}><Icon name={ok ? 'check' : 'x'} size={13} />{k}</span>)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 18 }}>
                  <div>
                    <div style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)', marginBottom: 8 }}>So sánh khuôn mặt</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {['CCCD mặt trước', 'Ảnh chân dung'].map((l, i) => (
                        <React.Fragment key={l}>
                          {i > 0 && <Icon name="arrow-right" size={18} style={{ color: 'var(--text-subtle)' }} />}
                          <div onClick={() => setViewer(l)} style={{ textAlign: 'center', cursor: 'zoom-in' }}><div style={{ width: 72, height: 72, borderRadius: 'var(--radius-md)', background: 'var(--gray-100)', color: 'var(--text-subtle)', display: 'grid', placeItems: 'center' }}><Icon name="user" size={30} /></div><div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 4 }}>{l}</div></div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)', marginBottom: 8 }}>Dữ liệu kê khai</div>
                    {[['Loại hình', sel.type], ['Số CCCD (kê khai)', '0790•••••' + sel.id.slice(-3)], ['Người đại diện', sel.owner]].map(([k, v]) => <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '3px 0', font: 'var(--type-body-sm)' }}><span style={{ color: 'var(--text-muted)' }}>{k}</span><span style={{ color: 'var(--text-body)', fontWeight: 500 }}>{v}</span></div>)}
                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '6px 0 0', font: 'var(--type-body-sm)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Hoa hồng riêng của shop</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><input aria-label="Hoa hồng riêng của shop" value={shopRate[sel.id] || ''} onChange={(e) => setShopRate((m) => ({ ...m, [sel.id]: e.target.value.replace(/\D/g, '') }))} placeholder="Theo ngành" style={{ width: 84, height: 30, border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '0 8px', font: 'var(--type-body-sm)', outline: 'none', textAlign: 'right' }} />%</span>
                    </label>
                  </div>
                </div>
                {o.errors.length > 0 && <div style={{ marginTop: 12 }}><div style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--red-600)', marginBottom: 4 }}>Lỗi phát hiện</div>{o.errors.map((e) => <div key={e} style={{ display: 'flex', alignItems: 'center', gap: 6, font: 'var(--type-body-sm)', color: 'var(--text-body)', padding: '2px 0' }}><Icon name="triangle-alert" size={14} style={{ color: 'var(--red-600)' }} />{e}</div>)}</div>}
              </div>
            );
          })()}

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
          <Select label="Lý do chính" value={reason} onChange={(e) => setReason(e.target.value)}>
            {REASONS.map((r) => <option key={r}>{r}</option>)}
          </Select>
          <label style={{ display: 'block', font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)', margin: '14px 0 6px' }}>Chi tiết thêm (Tùy chọn hoặc nếu chọn Lý do khác):</label>
          <textarea value={reasonNote} onChange={(e) => setReasonNote(e.target.value)} rows={3} placeholder="Mô tả cụ thể..." style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', font: 'var(--type-body)', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
        </Modal>
        {viewer && <DocViewer label={viewer} onClose={() => setViewer(null)} />}
      </div>
    );
  }

  window.LZAKyc = KYCReview;
})();
