/* Admin: product moderation — queue by status with search, reassign moderator,
   moderator on/off config + redistribute, and a detail page with AI analysis,
   legal documents, SKU table and approve / reject / send back. AI only flags or
   rejects; a person still approves before a product goes live. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Badge, Modal, Switch, Select } = DS;
  const { MODERATION, MODERATORS } = window.LZA;
  const img = (n) => '../../assets/img/' + n + '.jpg';
  const fmt = (n) => n.toLocaleString('vi-VN') + ' ₫';
  const STATE = {
    PENDING_APPROVAL: ['warning', 'clock', 'Chờ duyệt'],
    FLAGGED: ['warning', 'triangle-alert', 'AI nghi ngờ'],
    // Nhãn của sản phẩm đưa lại hàng chờ: trạng thái vẫn là PENDING_APPROVAL (ProductStatus), cờ requeued chỉ đổi nhãn.
    REQUEUED: ['warning', 'refresh-cw', 'Chờ duyệt lại'],
    PUBLISHED: ['success', 'circle-check', 'Đã duyệt'],
    REJECTED: ['danger', 'ban', 'Từ chối'],
  };
  const REJECT_REASONS = ['Thiếu chứng nhận an toàn', 'Vi phạm chính sách', 'Ảnh sản phẩm không đạt', 'Mô tả sai / gây hiểu lầm', 'Giá bất hợp lý', 'Hàng cấm / hạn chế'];
  const labelOf = (p) => STATE[p.state === 'PENDING_APPROVAL' && p.requeued ? 'REQUEUED' : p.state];
  const TABS = { PENDING: ['PENDING_APPROVAL', 'FLAGGED'], PUBLISHED: ['PUBLISHED'], REJECTED: ['REJECTED'] };

  function Toast({ text }) {
    return text ? <div role="status" style={{ position: 'fixed', top: 24, right: 24, zIndex: 1000, display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '1px solid var(--border-default)', padding: '12px 18px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', font: 'var(--weight-medium) 14px var(--font-sans)', color: 'var(--text-strong)' }}><Icon name="info" size={18} style={{ color: 'var(--blue-500)' }} />{text}</div> : null;
  }

  function Detail({ p, onBack, onDecide }) {
    const [note, setNote] = React.useState('');
    const [reason, setReason] = React.useState(REJECT_REASONS[0]);
    const [confirm, setConfirm] = React.useState(null); // PUBLISHED | REJECTED
    const [doc, setDoc] = React.useState(null);
    const [zoom, setZoom] = React.useState(null);
    const rejectText = reason + (note.trim() ? ': ' + note.trim() : '');
    const askReject = () => setConfirm('REJECTED');
    const st = labelOf(p);
    const aiRejected = p.state === 'REJECTED' && !p.moderator;
    return (
      <div style={{ maxWidth: 1180, paddingBottom: 96 }}>
        <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: 0, background: 'transparent', color: 'var(--text-muted)', font: 'var(--type-body-sm)', cursor: 'pointer', marginBottom: 14 }}><Icon name="arrow-left" size={16} /> Quay lại danh sách</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div>
            <h2 style={{ font: 'var(--type-h3)', color: 'var(--text-strong)', margin: 0 }}>Duyệt Sản phẩm #{p.id}</h2>
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 4 }}>Ngày tạo: {p.created} · Nhà bán: {p.vendor}</div>
          </div>
          <span style={{ marginLeft: 'auto' }}><Badge variant={st[0]} icon={st[1]}>{st[2]}</Badge></span>
        </div>

        {p.ai && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', marginBottom: 12, borderRadius: 'var(--radius-md)', background: '#fff', boxShadow: 'var(--shadow-sm)', font: 'var(--type-body-sm)', color: 'var(--text-body)', flexWrap: 'wrap' }}>
            <Icon name="cpu" size={18} style={{ color: 'var(--blue-600)' }} />
            <b>Gemini:</b> <span className="code">{p.ai.decision}</span>
            <span>· Điểm rủi ro <b style={{ color: p.ai.risk >= 85 ? 'var(--red-600)' : p.ai.risk >= 30 ? 'var(--amber-600)' : 'var(--mint-600)' }}>{p.ai.risk}/100</b></span>
            {p.ai.violations.length > 0 ? p.ai.violations.map((v) => <Badge key={v} variant="danger">{v}</Badge>) : <span style={{ color: 'var(--text-muted)' }}>· Không phát hiện vi phạm</span>}
          </div>
        )}
        {p.aiReason && (
          <div style={{ display: 'flex', gap: 14, padding: 16, marginBottom: 16, borderRadius: 'var(--radius-md)', background: p.state === 'REJECTED' ? 'var(--red-50)' : 'var(--amber-50)', border: '1px solid ' + (p.state === 'REJECTED' ? 'var(--red-300, #F3B0A8)' : 'var(--gold-400)') }}>
            <Icon name={aiRejected ? 'cpu' : 'triangle-alert'} size={22} style={{ color: p.state === 'REJECTED' ? 'var(--red-600)' : 'var(--amber-600)', flex: 'none' }} />
            <div><div style={{ font: 'var(--weight-bold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>{aiRejected ? 'Lý do AI từ chối:' : p.state === 'REJECTED' ? 'Lý do từ chối:' : 'Phân tích từ AI (Nghi ngờ):'}</div><p style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)', margin: '4px 0 0' }}>{p.aiReason}</p></div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: 16, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={card}>
              <h3 style={h3}><Icon name="image" size={16} /> Ảnh sản phẩm</h3>
              <img src={img(p.img)} alt={p.name} onClick={() => setZoom(img(p.img))} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 'var(--radius-md)', cursor: 'zoom-in' }} />
            </div>
            <div style={card}>
              <h3 style={h3}><Icon name="file-text" size={16} /> Hồ sơ pháp lý sản phẩm</h3>
              {p.docs.length === 0 && <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Không có tệp đính kèm</div>}
              {p.docs.map((d) => (
                <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--blue-50)', color: 'var(--blue-600)', display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name="file-text" size={18} /></span>
                  <span style={{ flex: 1, minWidth: 0, font: 'var(--type-body-sm)', color: 'var(--text-body)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={d}>{d}</span>
                  <Button size="sm" variant="ghost" iconLeft="eye" onClick={() => setDoc(d)}>Xem trực tiếp</Button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
            <div style={card}>
              <h2 style={{ font: 'var(--type-h4)', color: 'var(--text-strong)', margin: '0 0 14px' }}>{p.name}</h2>
              <Grid rows={[['Danh mục', p.category], ['Thương hiệu', p.brand], ['Tình trạng', p.condition], ['Xuất xứ', p.origin]]} />
              <h3 style={{ ...h3, marginTop: 18 }}><Icon name="file-text" size={16} /> Mô tả sản phẩm</h3>
              <p style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
            </div>
            <div style={card}>
              <h3 style={h3}><Icon name="package" size={16} /> Thông tin Vận chuyển & Kích thước</h3>
              <Grid rows={[['Cân nặng', p.weight + 'g'], ['Kích thước', p.size], ['Gửi hàng từ', p.shipsFrom], ['Người trả phí ship', p.payer]]} />
            </div>
            <div style={card}>
              <h3 style={h3}><Icon name="layers" size={16} /> Phân loại hàng (SKU)</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', font: '13px var(--font-sans)', fontVariantNumeric: 'tabular-nums' }}>
                <thead><tr style={{ color: 'var(--text-muted)', textAlign: 'left' }}><th style={tc}>Mã SKU</th><th style={tc}>Tên Phân Loại</th><th style={{ ...tc, textAlign: 'right' }}>Giá bán</th><th style={{ ...tc, textAlign: 'right' }}>Tồn kho</th></tr></thead>
                <tbody>{p.skus.map((s) => <tr key={s[0]} style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-body)' }}><td style={tc}><span className="code">{s[0]}</span></td><td style={tc}>{s[1]}</td><td style={{ ...tc, textAlign: 'right' }}>{fmt(s[2])}</td><td style={{ ...tc, textAlign: 'right' }}>{s[3]}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </div>

        {/* sticky decision bar */}
        <div style={{ position: 'sticky', bottom: 0, display: 'flex', alignItems: 'flex-end', gap: 10, marginTop: 16, padding: '14px 18px', background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)', marginBottom: 6 }}>Lý do nếu từ chối</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 240, flex: 'none' }}><Select value={reason} onChange={(e) => setReason(e.target.value)}>{REJECT_REASONS.map((r) => <option key={r}>{r}</option>)}</Select></div>
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ghi chú thêm cho người bán..." style={{ flex: 1, minWidth: 0, height: 44, padding: '0 12px', border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', font: 'var(--type-body-sm)', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>
          {p.state !== 'REJECTED' && <Button variant="danger" iconLeft="ban" onClick={askReject}>Từ chối</Button>}
          {p.state !== 'PUBLISHED' && <Button iconLeft="circle-check" onClick={() => setConfirm('PUBLISHED')}>Duyệt lên sàn</Button>}
          {!TABS.PENDING.includes(p.state) && <Button variant="outline" iconLeft="refresh-cw" onClick={() => onDecide(p, 'PENDING_APPROVAL', '', true)}>Chờ duyệt lại</Button>}
        </div>

        <Modal open={!!confirm} onClose={() => setConfirm(null)} width={420} title={confirm === 'PUBLISHED' ? 'Xác nhận duyệt sản phẩm' : 'Xác nhận từ chối sản phẩm'}
          footer={<><Button variant="ghost" onClick={() => setConfirm(null)}>Hủy</Button><Button variant={confirm === 'PUBLISHED' ? 'primary' : 'danger'} onClick={() => onDecide(p, confirm, rejectText)}>{confirm === 'PUBLISHED' ? 'Duyệt lên sàn' : 'Từ chối'}</Button></>}>
          <div style={{ font: 'var(--type-body)', color: 'var(--text-body)', lineHeight: 1.5 }}>Bạn có chắc chắn muốn {confirm === 'PUBLISHED' ? 'duyệt' : 'từ chối'} sản phẩm này không?{confirm === 'REJECTED' && <div style={{ marginTop: 8, color: 'var(--text-muted)' }}>Lý do: {rejectText}</div>}</div>
        </Modal>
        <Modal open={!!doc} onClose={() => setDoc(null)} width={640} title="Trình xem tài liệu" footer={<Button onClick={() => setDoc(null)}>Đóng</Button>}>
          <div style={{ display: 'grid', placeItems: 'center', gap: 10, height: 320, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
            <div style={{ textAlign: 'center' }}><Icon name="file-text" size={52} /><div style={{ font: 'var(--type-body-sm)', marginTop: 10 }}>{doc}</div><div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 4 }}>Bản xem trước mô phỏng trong prototype</div></div>
          </div>
        </Modal>
        {zoom && <div onClick={() => setZoom(null)} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(20,23,31,.88)', display: 'grid', placeItems: 'center', cursor: 'zoom-out' }}><img src={zoom} alt="" style={{ maxWidth: '80vw', maxHeight: '86vh', borderRadius: 'var(--radius-lg)' }} /></div>}
      </div>
    );
  }

  function Grid({ rows }) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
        {rows.map(([k, v]) => <div key={k}><div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{k}</div><div style={{ font: 'var(--weight-medium) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)', marginTop: 2 }}>{v}</div></div>)}
      </div>
    );
  }

  function ProductModeration() {
    const [rows, setRows] = React.useState(MODERATION);
    const [tab, setTab] = React.useState('PENDING'); // PENDING | PUBLISHED | REJECTED | CONFIG
    const [q, setQ] = React.useState('');
    const [openId, setOpenId] = React.useState(null);
    const [staff, setStaff] = React.useState(MODERATORS);
    const [redo, setRedo] = React.useState(false);
    const [toast, setToast] = React.useState('');
    const say = (m) => { setToast(m); setTimeout(() => setToast(''), 2400); };

    const inTab = (p, t) => TABS[t].includes(p.state);
    const open = rows.find((p) => p.id === openId);
    const decide = (p, state, note, requeued = false) => {
      setRows((rs) => rs.map((x) => (x.id === p.id ? { ...x, state, requeued, aiReason: state === 'REJECTED' ? note : x.aiReason, moderator: x.moderator || staff[0].name } : x)));
      setOpenId(null);
      say(state === 'PUBLISHED' ? 'Đã duyệt sản phẩm thành công!' : state === 'REJECTED' ? 'Đã từ chối sản phẩm!' : 'Đã đưa sản phẩm về hàng chờ duyệt lại');
    };
    const redistribute = () => {
      const on = staff.filter((s) => s.active);
      if (on.length) setRows((rs) => { let i = 0; return rs.map((x) => (inTab(x, 'PENDING') ? { ...x, moderator: on[i++ % on.length].name } : x)); });
      setRedo(false); say('Đã phân phối lại sản phẩm thành công!');
    };

    if (open) return <><Detail p={open} onBack={() => setOpenId(null)} onDecide={decide} /><Toast text={toast} /></>;

    // flagged products lead the queue
    const shown = tab === 'CONFIG' ? [] : rows.filter((p) => inTab(p, tab)).filter((p) => (p.name + ' ' + p.vendor + ' ' + p.id).toLowerCase().includes(q.trim().toLowerCase())).sort((a, b) => (b.state === 'FLAGGED') - (a.state === 'FLAGGED'));
    const Tab = ({ id, icon, label }) => {
      const on = tab === id;
      const n = id === 'CONFIG' ? 0 : rows.filter((p) => inTab(p, id)).length;
      return <button onClick={() => setTab(id)} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 7, height: 40, padding: '0 14px', borderRadius: 'var(--radius-md)', cursor: 'pointer', border: '1.5px solid var(--blue-500)', background: on ? 'var(--blue-500)' : '#fff', color: on ? '#fff' : 'var(--blue-600)', font: '600 13px var(--font-sans)' }}><Icon name={icon} size={16} />{label}{n > 0 && <span style={{ position: 'absolute', top: -8, right: -8, minWidth: 20, height: 20, padding: '0 4px', borderRadius: 10, background: 'var(--red-500)', color: '#fff', font: '700 11px/20px var(--font-sans)', textAlign: 'center', boxSizing: 'border-box' }}>{n}</span>}</button>;
    };
    return (
      <div style={{ maxWidth: 1180 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 260, maxWidth: 440 }}>
            <span style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-subtle)', display: 'flex' }}><Icon name="search" size={16} /></span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nhập tên sản phẩm hoặc tên nhà bán..." style={{ width: '100%', height: 40, paddingLeft: 36, border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', font: 'var(--type-body-sm)', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', gap: 12, marginLeft: 'auto' }}>
            <Tab id="CONFIG" icon="user" label="Cấu hình nhân viên" />
            <Tab id="PUBLISHED" icon="circle-check" label="Đã duyệt" />
            <Tab id="REJECTED" icon="ban" label="Không duyệt" />
            <Tab id="PENDING" icon="clock" label="Chờ duyệt" />
          </div>
        </div>

        {tab === 'CONFIG' ? (
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>Nhân viên duyệt sản phẩm</span>
              <Button size="sm" variant="outline" iconLeft="refresh-cw" style={{ marginLeft: 'auto' }} onClick={() => setRedo(true)}>Phân phối lại</Button>
              <Button size="sm" iconLeft="check" style={{ marginLeft: 8 }} onClick={() => say('Đã lưu cấu hình nhân viên!')}>Lưu cấu hình</Button>
            </div>
            {staff.map((s) => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ flex: 1 }}><div style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>{s.name}</div><div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{rows.filter((p) => inTab(p, 'PENDING') && p.moderator === s.name).length} sản phẩm đang chờ</div></div>
                <Switch checked={s.active} onChange={() => setStaff((xs) => xs.map((x) => (x.name === s.name ? { ...x, active: !x.active } : x)))} />
                <span style={{ width: 110, font: '500 13px var(--font-sans)', color: s.active ? 'var(--blue-600)' : 'var(--text-muted)' }}>{s.active ? 'Đang nhận việc' : 'Tạm ngưng'}</span>
              </div>
            ))}
          </div>
        ) : shown.length === 0 ? (
          <div style={{ display: 'grid', placeItems: 'center', gap: 8, height: 360, background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
            <div><Icon name="package" size={46} style={{ color: 'var(--text-subtle)' }} /><h3 style={{ font: 'var(--type-h4)', color: 'var(--text-strong)', margin: '12px 0 4px' }}>Hiện tại không có sản phẩm nào</h3><p style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)', margin: 0 }}>Tất cả sản phẩm đã được kiểm duyệt xong. Hãy quay lại sau nhé!</p></div>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ font: '600 12px var(--font-sans)', color: 'var(--text-muted)', textAlign: 'left', background: 'var(--gray-25)' }}><th style={c}>Sản phẩm</th><th style={c}>Nhà bán (Vendor)</th><th style={c}>Trạng thái</th><th style={c}>Người duyệt</th><th style={{ ...c, textAlign: 'right' }}>Thao tác</th></tr></thead>
              <tbody>
                {shown.map((p) => {
                  const st = labelOf(p);
                  return (
                    <tr key={p.id} style={{ borderTop: '1px solid var(--border-subtle)', font: '13px var(--font-sans)', color: 'var(--text-body)' }}>
                      <td style={c}><span style={{ display: 'flex', alignItems: 'center', gap: 10 }}><img src={img(p.img)} alt="" width="44" height="44" style={{ borderRadius: 'var(--radius-sm)', objectFit: 'cover', flex: 'none' }} /><span><span style={{ display: 'block', fontWeight: 600, color: 'var(--text-strong)' }}>{p.name}</span><span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>ID: #{p.id}</span></span></span></td>
                      <td style={c}>{p.vendor}</td>
                      <td style={c}><Badge variant={st[0]} icon={st[1]}>{st[2]}</Badge></td>
                      <td style={{ ...c, width: 200 }}>{p.state === 'REJECTED' && !p.moderator
                        ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}><Icon name="cpu" size={15} />AI Hệ thống</span>
                        : <Select value={p.moderator || '-- Chưa phân công --'} onChange={(e) => { const v = e.target.value; setRows((rs) => rs.map((x) => (x.id === p.id ? { ...x, moderator: v } : x))); say('Phân công thành công!'); }}><option>-- Chưa phân công --</option>{staff.map((s) => <option key={s.name}>{s.name}</option>)}</Select>}</td>
                      <td style={{ ...c, textAlign: 'right' }}><Button size="sm" variant="outline" onClick={() => setOpenId(p.id)}>Kiểm duyệt</Button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <Modal open={redo} onClose={() => setRedo(false)} width={440} title="Xác nhận phân phối lại"
          footer={<><Button variant="ghost" onClick={() => setRedo(false)}>Hủy</Button><Button onClick={redistribute}>Xác nhận phân phối</Button></>}>
          <div style={{ font: 'var(--type-body)', color: 'var(--text-body)', lineHeight: 1.5 }}>Bạn có chắc muốn phân phối lại <b>toàn bộ sản phẩm đang chờ duyệt</b> cho các nhân viên đang online?<div style={{ marginTop: 8, font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Lưu ý: Các nhân viên đã bị tắt trạng thái "Đang nhận việc" sẽ không được chia thêm sản phẩm mới.</div></div>
        </Modal>
        <Toast text={toast} />
      </div>
    );
  }
  const card = { background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: '16px 18px' };
  const h3 = { display: 'flex', alignItems: 'center', gap: 7, font: 'var(--weight-bold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)', margin: '0 0 12px' };
  const tc = { padding: '9px 8px', whiteSpace: 'nowrap' };
  const c = { padding: '11px 18px' };
  window.LZAModeration = ProductModeration;
})();
