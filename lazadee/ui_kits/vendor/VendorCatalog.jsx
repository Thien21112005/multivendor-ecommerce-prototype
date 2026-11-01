/* Vendor: platform-wide category tree (read only, with commission rates) and a form
   to propose a new category. Proposals are reviewed in Admin → Danh mục toàn sàn. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Input, Select, Modal, Badge } = DS;

  const TREE = [
    { name: 'Điện tử', rate: 5, count: 1284, children: [{ name: 'Điện thoại & Phụ kiện', rate: 5, count: 412 }, { name: 'Máy tính & Laptop', rate: 4, count: 386 }, { name: 'Tai nghe & Loa', rate: 6, count: 301 }, { name: 'Camera', rate: 5, count: 185 }] },
    { name: 'Thời trang', rate: 8, count: 3120, children: [{ name: 'Thời trang Nam', rate: 8, count: 1210 }, { name: 'Thời trang Nữ', rate: 8, count: 1640 }, { name: 'Đồ lót & Đồ ngủ', rate: 9, count: 270 }] },
    { name: 'Làm đẹp', rate: 7, count: 980, children: [{ name: 'Chăm sóc da', rate: 7, count: 540 }, { name: 'Trang điểm', rate: 7, count: 320 }, { name: 'Chăm sóc tóc', rate: 6, count: 120 }] },
    { name: 'Nhà cửa & Đời sống', rate: 6, count: 740, children: [{ name: 'Nội thất', rate: 6, count: 310 }, { name: 'Đồ dùng nhà bếp', rate: 6, count: 280 }, { name: 'Đồ dùng phòng tắm', rate: 6, count: 150 }] },
    { name: 'Mẹ & Bé', rate: 5, count: 460, children: [{ name: 'Đồ dùng cho bé', rate: 5, count: 350 }, { name: 'Đồ dùng cho mẹ', rate: 5, count: 110 }] },
  ];
  const SEED = [{ id: 'CP-081', name: 'Thiết bị đeo thông minh', parent: 'Điện tử', state: 'PENDING', at: '06/06/2026' }, { id: 'CP-064', name: 'Phụ kiện gaming', parent: 'Điện tử', state: 'APPROVED', at: '18/05/2026' }];
  const STATE = { PENDING: ['warning', 'Chờ duyệt'], APPROVED: ['success', 'Đã duyệt'], REJECTED: ['danger', 'Từ chối'] };

  function VendorCatalog() {
    const [open, setOpen] = React.useState(() => new Set(['Điện tử']));
    const [proposals, setProposals] = React.useState(SEED);
    const [form, setForm] = React.useState(null);
    const toggle = (n) => setOpen((s) => { const x = new Set(s); x.has(n) ? x.delete(n) : x.add(n); return x; });
    const [dup, setDup] = React.useState('');
    const allNames = TREE.flatMap((c) => [c.name, ...c.children.map((s) => s.name)]);
    const submit = () => {
      if (!form.name.trim()) return;
      const hit = allNames.find((n) => n.toLowerCase() === form.name.trim().toLowerCase());
      if (hit) { setDup('Danh mục "' + hit + '" đã có sẵn, hãy dùng danh mục này.'); return; }
      setDup('');
      setProposals((p) => [{ id: 'CP-0' + (82 + p.length), name: form.name.trim(), parent: form.parent, state: 'PENDING', at: 'Hôm nay' }, ...p]);
      setForm(null);
    };
    return (
      <div style={{ maxWidth: 1180, display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: 16, alignItems: 'start' }}>
        <div style={card}>
          <div style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)', marginBottom: 4 }}>Cây danh mục</div>
          <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginBottom: 12 }}>Danh mục cuối cùng của sản phẩm quyết định phí hoa hồng và thông số gợi ý.</div>
          {TREE.map((c) => {
            const on = open.has(c.name);
            return (
              <div key={c.name} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <button onClick={() => toggle(c.name)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 4px', border: 0, background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
                  <Icon name={on ? 'chevron-down' : 'chevron-right'} size={16} style={{ color: 'var(--text-subtle)' }} />
                  <span style={{ flex: 1, font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>{c.name}</span>
                  <span style={meta}>{c.count.toLocaleString('vi-VN')} SP</span>
                  <Badge variant="neutral">Hoa hồng {c.rate}%</Badge>
                </button>
                {on && c.children.map((s) => (
                  <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px 8px 30px' }}>
                    <span style={{ flex: 1, font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>{s.name}</span>
                    <span style={meta}>{s.count.toLocaleString('vi-VN')} SP</span>
                    <span style={{ ...meta, width: 92, textAlign: 'right' }}>Hoa hồng {s.rate}%</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>Đề xuất của Shop</span>
            <Button size="sm" iconLeft="plus" style={{ marginLeft: 'auto' }} onClick={() => { setDup(''); setForm({ name: '', parent: '— Danh mục gốc mới', why: '' }); }}>Đề xuất danh mục mới</Button>
          </div>
          {proposals.map((p) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 0', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>{p.name}</div>
                <div style={meta}>Thuộc {p.parent} · {p.at}</div>
              </div>
              <Badge variant={STATE[p.state][0]}>{STATE[p.state][1]}</Badge>
            </div>
          ))}
        </div>

        <Modal open={!!form} onClose={() => setForm(null)} title="Đề xuất danh mục mới"
          footer={<><Button variant="ghost" onClick={() => setForm(null)}>Huỷ</Button><Button iconLeft="send" disabled={!form || !form.name.trim()} onClick={submit}>Gửi đề xuất</Button></>}>
          {form && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Input label="Tên danh mục" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="VD: Thiết bị đeo thông minh" />
              <Select label="Danh mục cha" value={form.parent} onChange={(e) => setForm({ ...form, parent: e.target.value })}><option>— Danh mục gốc mới</option>{TREE.map((c) => <option key={c.name}>{c.name}</option>)}</Select>
              <Input label="Lý do đề xuất" value={form.why} onChange={(e) => setForm({ ...form, why: e.target.value })} placeholder="Sản phẩm của bạn chưa khớp danh mục nào?" />
              {dup && <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--red-600)', font: 'var(--type-caption)' }}><Icon name="circle-alert" size={13} />{dup}</div>}
            </div>
          )}
        </Modal>
      </div>
    );
  }
  const card = { background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: '18px 20px' };
  const meta = { font: 'var(--type-caption)', color: 'var(--text-muted)' };
  window.LZVCatalog = VendorCatalog;
})();
