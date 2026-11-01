/* Admin: broadcast platform notifications — stats, search + audience filter, table,
   detail, compose / edit (title, optional image, content), confirm send, delete. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Badge, Modal, Input, Select } = DS;
  const { PLATFORM_NOTIFS } = window.LZA;
  const TARGET = { ALL: 'Tất cả người dùng', SELLER: 'Chỉ Vendor', BUYER: 'Chỉ Customer' };
  const T_VARIANT = { ALL: 'primary', SELLER: 'warning', BUYER: 'mint' };
  const FILTER = { 'Tất cả đối tượng': null, 'Chỉ Vendor': 'SELLER', 'Chỉ Customer': 'BUYER' };
  const PAGE = 5;
  const short = (n) => (n < 1000 ? String(n) : n < 1e6 ? '~' + (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K' : '~' + (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M');

  function Stat({ icon, tone, label, value }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: '16px 18px' }}>
        <span style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', background: tone.bg, color: tone.fg, display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name={icon} size={20} /></span>
        <div><div style={{ font: '500 13px var(--font-sans)', color: 'var(--text-muted)' }}>{label}</div><div style={{ font: '800 24px var(--font-sans)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{value}</div></div>
      </div>
    );
  }

  function PlatformNotifications() {
    const [rows, setRows] = React.useState(PLATFORM_NOTIFS);
    const [q, setQ] = React.useState('');
    const [filter, setFilter] = React.useState('Tất cả đối tượng');
    const [page, setPage] = React.useState(1);
    const [detail, setDetail] = React.useState(null);
    const [form, setForm] = React.useState(null); // { id?, title, content, target, image }
    const [confirm, setConfirm] = React.useState(false);
    const [del, setDel] = React.useState(null);
    const [err, setErr] = React.useState('');
    const fileRef = React.useRef(null);

    const list = rows.filter((n) => !FILTER[filter] || n.target === FILTER[filter]).filter((n) => (n.title + ' ' + n.content).toLowerCase().includes(q.trim().toLowerCase()));
    const pages = Math.max(1, Math.ceil(list.length / PAGE));
    const shown = list.slice((page - 1) * PAGE, page * PAGE);

    const pickImage = (e) => {
      const f = e.target.files[0]; e.target.value = '';
      if (!f) return;
      if (!f.type.startsWith('image/')) { setErr('Vui lòng chọn file hình ảnh hợp lệ (jpg, png, ...).'); return; }
      if (f.size > 5 * 1024 * 1024) { setErr('Kích thước ảnh tối đa là 5MB.'); return; }
      setErr(''); setForm((x) => ({ ...x, image: URL.createObjectURL(f) }));
    };
    const send = () => {
      if (form.id) setRows((rs) => rs.map((n) => (n.id === form.id ? { ...n, ...form } : n)));
      else setRows((rs) => [{ ...form, id: 'PN-' + (1049 + rs.length), by: 'Admin (1)', at: 'Vừa xong', reads: 0, reach: 0 }, ...rs]);
      setConfirm(false); setForm(null); setPage(1);
    };

    return (
      <div style={{ maxWidth: 1180 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <div><h2 style={{ font: 'var(--type-h3)', color: 'var(--text-strong)', margin: 0 }}>Thông báo toàn sàn</h2><p style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)', margin: '4px 0 0' }}>Gửi và quản lý các thông báo broadcast tới người dùng</p></div>
          <Button iconLeft="send" style={{ marginLeft: 'auto' }} onClick={() => { setErr(''); setForm({ title: '', content: '', target: 'ALL', image: '' }); }}>Tạo thông báo</Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, marginBottom: 16 }}>
          <Stat icon="send" tone={{ bg: 'var(--blue-50)', fg: 'var(--blue-600)' }} label="Đã gửi tháng này" value={rows.length} />
          <Stat icon="user" tone={{ bg: 'var(--mint-50)', fg: 'var(--mint-600)' }} label="Lượt tiếp cận (Reach)" value={short(rows.reduce((n, r) => n + r.reach, 0))} />
          <Stat icon="eye" tone={{ bg: 'var(--orange-50)', fg: 'var(--orange-600)' }} label="Tổng lượt đọc" value={rows.reduce((n, r) => n + r.reads, 0).toLocaleString('vi-VN')} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-subtle)', display: 'flex' }}><Icon name="search" size={16} /></span>
            <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Tìm kiếm theo tiêu đề hoặc nội dung..." style={{ width: '100%', height: 40, paddingLeft: 36, border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', font: 'var(--type-body-sm)', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ width: 200 }}><Select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}>{Object.keys(FILTER).map((k) => <option key={k}>{k}</option>)}</Select></div>
        </div>

        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums' }}>
            <thead><tr style={{ font: '600 12px var(--font-sans)', color: 'var(--text-muted)', textAlign: 'left', background: 'var(--gray-25)' }}><th style={c}>Mã TB</th><th style={c}>Thông báo</th><th style={c}>Ảnh</th><th style={c}>Đối tượng nhận</th><th style={c}>Người gửi</th><th style={c}>Thời gian gửi</th><th style={{ ...c, textAlign: 'right' }}>Lượt đọc</th></tr></thead>
            <tbody>
              {shown.length === 0 && <tr><td colSpan="7" style={{ padding: 40, textAlign: 'center', font: 'var(--type-body)', color: 'var(--text-muted)' }}>Chưa có thông báo nào.</td></tr>}
              {shown.map((n) => (
                <tr key={n.id} onClick={() => setDetail(n)} style={{ borderTop: '1px solid var(--border-subtle)', font: '13px var(--font-sans)', color: 'var(--text-body)', cursor: 'pointer' }} onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--gray-25)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                  <td style={c}><span className="code" style={{ fontSize: 12 }}>{n.id}</span></td>
                  <td style={{ ...c, maxWidth: 320 }}><div style={{ fontWeight: 600, color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title}</div><div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.content}</div></td>
                  <td style={c}>{n.image ? <img src={n.image} alt="" width="36" height="36" style={{ borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} /> : <span style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--gray-100)', color: 'var(--text-subtle)', display: 'grid', placeItems: 'center' }}><Icon name="image" size={16} /></span>}</td>
                  <td style={c}><Badge variant={T_VARIANT[n.target]}>{TARGET[n.target]}</Badge></td>
                  <td style={c}>{n.by}</td>
                  <td style={{ ...c, color: 'var(--text-muted)' }}>{n.at}</td>
                  <td style={{ ...c, textAlign: 'right' }}>{n.reads.toLocaleString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', borderTop: '1px solid var(--border-subtle)', font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
              <span>Hiển thị <b>{(page - 1) * PAGE + 1} - {Math.min(page * PAGE, list.length)}</b> trên tổng số <b>{list.length}</b> thông báo</span>
              <Button size="sm" variant="outline" disabled={page === 1} style={{ marginLeft: 'auto' }} onClick={() => setPage((p) => p - 1)}>Trước</Button>
              <span>Trang {page} / {pages}</span>
              <Button size="sm" variant="outline" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Sau</Button>
            </div>
          )}
        </div>

        <Modal open={!!detail} onClose={() => setDetail(null)} width={500} title="Chi tiết thông báo"
          footer={<><Button variant="ghost" style={{ color: 'var(--red-600)', marginRight: 'auto' }} iconLeft="trash-2" onClick={() => { setDel(detail); setDetail(null); }}>Xóa</Button><Button variant="outline" iconLeft="pencil" onClick={() => { setForm({ ...detail }); setDetail(null); }}>Sửa</Button><Button onClick={() => setDetail(null)}>Đóng</Button></>}>
          {detail && <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div><div style={lab2}>Tiêu đề</div><div style={{ font: 'var(--weight-semibold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>{detail.title}</div></div>
            <div style={{ display: 'flex', gap: 24 }}>
              <div><div style={lab2}>Đối tượng</div><Badge variant={T_VARIANT[detail.target]}>{TARGET[detail.target]}</Badge></div>
              <div><div style={lab2}>Thời gian gửi</div><div style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>{detail.at}</div></div>
            </div>
            {detail.image && <img src={detail.image} alt="" style={{ width: '100%', borderRadius: 'var(--radius-md)' }} />}
            <div><div style={lab2}>Nội dung</div><div style={{ font: 'var(--type-body)', color: 'var(--text-body)', lineHeight: 1.6 }}>{detail.content}</div></div>
          </div>}
        </Modal>

        <Modal open={!!form} onClose={() => setForm(null)} width={560} title={form && form.id ? 'Sửa thông báo toàn sàn' : 'Tạo thông báo toàn sàn (Broadcast)'}
          footer={form && <><Button variant="ghost" onClick={() => setForm(null)}>Hủy</Button><Button iconLeft="send" disabled={!form.title.trim() || !form.content.trim()} onClick={() => setConfirm(true)}>{form.id ? 'Cập nhật' : 'Phát thông báo'}</Button></>}>
          {form && <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={lab}>Đối tượng nhận (Target Audience)</label>
              <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>{Object.entries(TARGET).map(([k, v]) => <label key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, cursor: 'pointer', font: 'var(--type-body-sm)', color: 'var(--text-body)' }}><input type="radio" name="target" checked={form.target === k} onChange={() => setForm({ ...form, target: k })} style={{ accentColor: 'var(--blue-500)' }} />{v}</label>)}</div>
            </div>
            <Input label="Tiêu đề (Title)" value={form.title} maxLength={100} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Nhập tiêu đề thông báo (Tối đa 100 ký tự)" />
            <div>
              <label style={lab}>Hình ảnh đính kèm (không bắt buộc)</label>
              {form.image
                ? <div style={{ position: 'relative', marginTop: 8 }}><img src={form.image} alt="Xem trước" style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 'var(--radius-md)' }} /><button aria-label="Xóa ảnh" onClick={() => setForm({ ...form, image: '' })} style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', border: 0, background: 'rgba(0,0,0,.6)', color: '#fff', cursor: 'pointer', display: 'grid', placeItems: 'center' }}><Icon name="x" size={16} /></button></div>
                : <div onClick={() => fileRef.current.click()} style={{ marginTop: 8, padding: '22px 0', textAlign: 'center', border: '1.5px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', background: 'var(--gray-25)', cursor: 'pointer', color: 'var(--text-muted)' }}><Icon name="upload" size={24} /><div style={{ font: 'var(--type-body-sm)', marginTop: 6 }}>Bấm để chọn ảnh</div><div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>JPG, PNG (Tối đa 5MB)</div></div>}
              <input ref={fileRef} type="file" hidden accept="image/*" onChange={pickImage} />
              {err && <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6, color: 'var(--red-600)', font: 'var(--type-caption)' }}><Icon name="circle-alert" size={13} />{err}</div>}
            </div>
            <div>
              <label style={lab}>Nội dung chi tiết</label>
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} placeholder="Nhập nội dung đầy đủ..." style={{ width: '100%', marginTop: 6, padding: '9px 12px', border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', font: 'var(--type-body)', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
          </div>}
        </Modal>

        <Modal open={confirm} onClose={() => setConfirm(false)} width={420} title={form && form.id ? 'Xác nhận cập nhật thông báo' : 'Xác nhận phát thông báo'}
          footer={<><Button variant="ghost" onClick={() => setConfirm(false)}>Quay lại</Button><Button onClick={send}>{form && form.id ? 'Xác nhận cập nhật' : 'Xác nhận phát'}</Button></>}>
          <div style={{ font: 'var(--type-body)', color: 'var(--text-body)', lineHeight: 1.5 }}>Bạn đang chuẩn bị gửi thông báo đến <b>{form && TARGET[form.target]}</b>. Hành động này không thể hoàn tác. Bạn có chắc chắn muốn tiếp tục?</div>
        </Modal>
        <Modal open={!!del} onClose={() => setDel(null)} width={400} title="Xác nhận xóa"
          footer={<><Button variant="ghost" onClick={() => setDel(null)}>Hủy</Button><Button variant="danger" onClick={() => { setRows((rs) => rs.filter((n) => n.id !== del.id)); setDel(null); }}>Xóa thông báo</Button></>}>
          <div style={{ font: 'var(--type-body)', color: 'var(--text-body)' }}>Bạn muốn xóa thông báo này? Hành động này không thể hoàn tác.</div>
        </Modal>
      </div>
    );
  }
  const c = { padding: '11px 18px', whiteSpace: 'nowrap' };
  const lab = { font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)', display: 'block' };
  const lab2 = { font: 'var(--type-caption)', color: 'var(--text-muted)', marginBottom: 3 };
  window.LZANotifications = PlatformNotifications;
})();
