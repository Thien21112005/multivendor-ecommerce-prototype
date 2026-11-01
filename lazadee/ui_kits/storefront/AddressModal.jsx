/* Lazadee address book modal — select / set-default / add / edit a shipping
   address. Mirrors the `addresses` table (recipient, phone, province/district/
   ward, street, is_default). The add/edit form uses a GHN-style 3-level region
   picker (Tỉnh/Thành phố → Quận/Huyện → Phường/Xã) plus a "use current location"
   GPS button that reverse-geocodes into the fields. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Radio, Checkbox, Input, Modal } = DS;
  const { ADDRESSES } = window.LZ;

  /* GHN-style administrative tree (subset; real GHN API returns the full set). */
  const REGIONS = {
    'TP. Hồ Chí Minh': {
      'Quận 1': ['P. Bến Nghé', 'P. Bến Thành', 'P. Đa Kao', 'P. Cầu Ông Lãnh', 'P. Nguyễn Thái Bình', 'P. Phạm Ngũ Lão'],
      'Quận 3': ['P. Võ Thị Sáu', 'P. 1', 'P. 2', 'P. 3', 'P. 4', 'P. 5'],
      'Quận 7': ['P. Tân Phú', 'P. Tân Phong', 'P. Phú Mỹ', 'P. Tân Thuận Đông', 'P. Bình Thuận'],
      'TP. Thủ Đức': ['P. Thảo Điền', 'P. An Phú', 'P. Linh Trung', 'P. Hiệp Bình Chánh', 'P. Trường Thọ'],
      'Quận Bình Thạnh': ['P. 1', 'P. 13', 'P. 22', 'P. 25', 'P. 26', 'P. 27'],
      'Quận Phú Nhuận': ['P. 1', 'P. 2', 'P. 4', 'P. 7', 'P. 9'],
    },
    'Hà Nội': {
      'Quận Hoàn Kiếm': ['P. Hàng Bạc', 'P. Hàng Bồ', 'P. Tràng Tiền', 'P. Cửa Nam', 'P. Lý Thái Tổ'],
      'Quận Ba Đình': ['P. Điện Biên', 'P. Kim Mã', 'P. Ngọc Hà', 'P. Liễu Giai', 'P. Cống Vị'],
      'Quận Cầu Giấy': ['P. Dịch Vọng', 'P. Mai Dịch', 'P. Nghĩa Tân', 'P. Quan Hoa', 'P. Yên Hòa'],
      'Quận Đống Đa': ['P. Cát Linh', 'P. Láng Hạ', 'P. Ô Chợ Dừa', 'P. Văn Miếu'],
    },
    'Đà Nẵng': {
      'Quận Hải Châu': ['P. Hải Châu 1', 'P. Thanh Bình', 'P. Thuận Phước', 'P. Bình Hiên'],
      'Quận Sơn Trà': ['P. An Hải Bắc', 'P. Mân Thái', 'P. Thọ Quang', 'P. Nại Hiên Đông'],
      'Quận Ngũ Hành Sơn': ['P. Mỹ An', 'P. Khuê Mỹ', 'P. Hòa Hải'],
    },
    'Bình Dương': {
      'TP. Thủ Dầu Một': ['P. Phú Cường', 'P. Chánh Nghĩa', 'P. Phú Hòa', 'P. Hiệp Thành'],
      'TP. Dĩ An': ['P. Dĩ An', 'P. Tân Bình', 'P. Đông Hòa', 'P. An Bình'],
      'TP. Thuận An': ['P. Lái Thiêu', 'P. An Phú', 'P. Bình Hòa'],
    },
    'Đồng Nai': { 'TP. Biên Hòa': ['P. Trung Dũng', 'P. Quang Vinh', 'P. Tân Phong', 'P. Long Bình'] },
    'Hải Phòng': { 'Quận Hồng Bàng': ['P. Hoàng Văn Thụ', 'P. Quang Trung', 'P. Phan Bội Châu'] },
    'Cần Thơ': { 'Quận Ninh Kiều': ['P. Tân An', 'P. An Hội', 'P. Cái Khế', 'P. Xuân Khánh'] },
  };
  const PROVS = Object.keys(REGIONS);

  function AddressModal({ open, onClose, selectedId, onSelect }) {
    const [mode, setMode] = React.useState('list'); // list | form
    const [list, setList] = React.useState(ADDRESSES);
    const [editing, setEditing] = React.useState(null);
    const [pick, setPick] = React.useState(selectedId || (ADDRESSES.find((a) => a.default) || ADDRESSES[0]).id);

    React.useEffect(() => { if (open) { setMode('list'); setEditing(null); setPick(selectedId || pick); } }, [open]);

    const confirm = () => { const a = list.find((x) => x.id === pick); onSelect && onSelect(a); onClose(); };
    const save = (addr) => {
      let next;
      if (editing) next = list.map((x) => (x.id === editing.id ? { ...addr, id: editing.id } : x));
      else { const id = 'A' + (list.length + 1 + Math.floor(Math.random() * 9)); next = [...list, { ...addr, id }]; setPick(id); }
      if (addr.default) { const tid = editing ? editing.id : next[next.length - 1].id; next = next.map((x) => ({ ...x, default: x.id === tid })); }
      setList(next); setMode('list'); setEditing(null);
    };
    const makeDefault = (id) => setList((l) => l.map((x) => ({ ...x, default: x.id === id })));

    const title = mode === 'list' ? 'Địa chỉ của tôi' : (editing ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới');
    const footer = mode === 'list'
      ? <><Button variant="ghost" onClick={onClose}>Huỷ</Button><Button iconLeft="check" onClick={confirm}>Xác nhận</Button></>
      : null;

    return (
      <Modal open={open} onClose={onClose} title={title} footer={footer} width={560}>
        {mode === 'list' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {list.map((a) => {
              const on = a.id === pick;
              return (
                <label key={a.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', border: '1.5px solid ' + (on ? 'var(--color-primary)' : 'var(--border-default)'), background: on ? 'var(--color-primary-tint)' : '#fff', borderRadius: 'var(--radius-md)', padding: '13px 15px', cursor: 'pointer' }}>
                  <Radio name="addr" checked={on} onChange={() => setPick(a.id)} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 3, flexWrap: 'wrap' }}>
                      <span style={{ font: 'var(--weight-bold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>{a.recipient}</span>
                      <span style={{ width: 1, height: 12, background: 'var(--border-strong)' }} />
                      <span className="code" style={{ font: '13px var(--font-mono)', color: 'var(--text-muted)' }}>{a.phone}</span>
                      {a.label && <span style={{ font: '600 11px var(--font-sans)', color: 'var(--text-muted)', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-pill)', padding: '2px 9px' }}>{a.label}</span>}
                      {a.default && <span style={{ font: '600 11px var(--font-sans)', color: 'var(--orange-600)', border: '1px solid var(--orange-200)', borderRadius: 4, padding: '1px 7px' }}>Mặc định</span>}
                    </div>
                    <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)', lineHeight: 1.5 }}>{a.line}, {a.ward}, {a.district}, {a.city}</div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 7 }}>
                      <span style={link} onClick={(e) => { e.preventDefault(); setEditing(a); setMode('form'); }}>Sửa</span>
                      {!a.default && <span style={link} onClick={(e) => { e.preventDefault(); makeDefault(a.id); }}>Đặt làm mặc định</span>}
                    </div>
                  </div>
                </label>
              );
            })}
            <button onClick={() => { setEditing(null); setMode('form'); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4, height: 46, border: '1.5px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)', color: 'var(--orange-600)', font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', cursor: 'pointer' }}>
              <Icon name="plus" size={17} /> Thêm địa chỉ mới
            </button>
          </div>
        ) : (
          <AddressForm initial={editing} onCancel={() => { setMode('list'); setEditing(null); }} onSave={save} />
        )}
      </Modal>
    );
  }

  function AddressForm({ initial, onCancel, onSave }) {
    const [f, setF] = React.useState(initial || { recipient: '', phone: '', city: '', district: '', ward: '', line: '', label: 'Nhà riêng', default: false });
    const [err, setErr] = React.useState({});
    const [gps, setGps] = React.useState('idle'); // idle | locating | done
    const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

    const setRegion = (city, district, ward) => setF((s) => ({ ...s, city, district, ward }));

    const useGPS = () => {
      setGps('locating');
      const fill = () => {
        setRegion('TP. Hồ Chí Minh', 'Quận 1', 'P. Bến Nghé');
        setF((s) => ({ ...s, line: s.line || '72 Lê Thánh Tôn' }));
        setGps('done');
      };
      // Try real geolocation; in sandbox it usually fails/denies → fall back to a demo reverse-geocode.
      if (navigator.geolocation) {
        const t = setTimeout(fill, 1600);
        navigator.geolocation.getCurrentPosition(
          () => { clearTimeout(t); fill(); },
          () => { clearTimeout(t); fill(); },
          { timeout: 1500 }
        );
      } else { setTimeout(fill, 1200); }
    };

    const submit = () => {
      const e = {};
      if (!f.recipient.trim()) e.recipient = 'Nhập họ tên người nhận';
      if (!/^0\d{8,10}$/.test(f.phone.replace(/\s/g, ''))) e.phone = 'Số điện thoại không hợp lệ';
      if (!f.city || !f.district || !f.ward) e.region = 'Chọn đầy đủ Tỉnh / Quận / Phường';
      if (!f.line.trim()) e.line = 'Nhập địa chỉ cụ thể';
      setErr(e);
      if (Object.keys(e).length === 0) onSave(f);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Input label="Họ và tên" value={f.recipient} onChange={(e) => set('recipient', e.target.value)} error={err.recipient} placeholder="Nguyễn Văn A" />
          <Input label="Số điện thoại" value={f.phone} onChange={(e) => set('phone', e.target.value)} error={err.phone} placeholder="0901 234 567" />
        </div>

        {/* GPS */}
        <button onClick={useGPS} disabled={gps === 'locating'} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', border: '1.5px solid ' + (gps === 'done' ? 'var(--mint-500)' : 'var(--blue-300, #B7CEF9)'), background: gps === 'done' ? 'var(--mint-50)' : 'var(--blue-50)', borderRadius: 'var(--radius-md)', padding: '11px 14px', cursor: gps === 'locating' ? 'wait' : 'pointer', textAlign: 'left' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#fff', display: 'grid', placeItems: 'center', flex: 'none', color: gps === 'done' ? 'var(--mint-600)' : 'var(--blue-600)' }}>
            <Icon name={gps === 'locating' ? 'refresh-cw' : (gps === 'done' ? 'circle-check' : 'map-pin')} size={18} className={gps === 'locating' ? 'lz-spin' : ''} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>
              {gps === 'locating' ? 'Đang định vị…' : gps === 'done' ? 'Đã lấy vị trí hiện tại' : 'Dùng vị trí hiện tại (GPS)'}
            </div>
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
              {gps === 'done' ? 'Đã điền Tỉnh/Quận/Phường — bạn có thể chỉnh lại bên dưới.' : 'Tự động điền địa chỉ từ định vị thiết bị.'}
            </div>
          </div>
          {gps !== 'done' && <Icon name="chevron-right" size={18} style={{ color: 'var(--text-subtle)' }} />}
        </button>

        {/* GHN-style region picker */}
        <div>
          <label style={lab}>Tỉnh / Thành phố, Quận / Huyện, Phường / Xã</label>
          <div style={{ marginTop: 6 }}>
            <RegionPicker city={f.city} district={f.district} ward={f.ward} onChange={setRegion} error={err.region} />
          </div>
          {err.region && <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--red-600)', font: 'var(--type-caption)', marginTop: 5 }}><Icon name="circle-alert" size={13} />{err.region}</div>}
        </div>

        <Input label="Địa chỉ cụ thể (số nhà, tên đường)" value={f.line} onChange={(e) => set('line', e.target.value)} error={err.line} placeholder="25 Nguyễn Huệ, Căn hộ 12A" />

        <div>
          <label style={lab}>Loại địa chỉ</label>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {['Nhà riêng', 'Văn phòng'].map((l) => (
              <button key={l} onClick={() => set('label', l)} style={{ height: 38, padding: '0 16px', borderRadius: 'var(--radius-md)', border: '1.5px solid ' + (f.label === l ? 'var(--color-primary)' : 'var(--border-default)'), background: f.label === l ? 'var(--color-primary-tint)' : '#fff', color: f.label === l ? 'var(--orange-700)' : 'var(--text-body)', font: 'var(--type-body-sm)', cursor: 'pointer' }}>{l}</button>
            ))}
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
          <Checkbox checked={f.default} onChange={() => set('default', !f.default)} />
          <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>Đặt làm địa chỉ mặc định</span>
        </label>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
          <Button variant="ghost" iconLeft="arrow-left" onClick={onCancel}>Quay lại</Button>
          <Button iconLeft="check" onClick={submit}>Lưu địa chỉ</Button>
        </div>
      </div>
    );
  }

  /* Cascading dropdown: a trigger that opens a panel with 3 tabs + a searchable
     list per level (Tỉnh → Quận → Phường), GHN/Shopee-style. */
  function RegionPicker({ city, district, ward, onChange, error }) {
    const [open, setOpen] = React.useState(false);
    const [level, setLevel] = React.useState('city'); // city | district | ward
    const [q, setQ] = React.useState('');
    const ref = React.useRef(null);

    React.useEffect(() => {
      if (!open) return;
      const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
      document.addEventListener('mousedown', h);
      return () => document.removeEventListener('mousedown', h);
    }, [open]);

    const openPanel = () => { setOpen(true); setLevel(city ? (district ? 'ward' : 'district') : 'city'); setQ(''); };
    const options = level === 'city' ? PROVS
      : level === 'district' ? Object.keys(REGIONS[city] || {})
      : ((REGIONS[city] || {})[district] || []);
    const filtered = options.filter((o) => o.toLowerCase().includes(q.toLowerCase()));

    const choose = (val) => {
      setQ('');
      if (level === 'city') { onChange(val, '', ''); setLevel('district'); }
      else if (level === 'district') { onChange(city, val, ''); setLevel('ward'); }
      else { onChange(city, district, val); setOpen(false); }
    };

    const display = [city, district, ward].filter(Boolean).reverse().join(', ');
    const tabs = [
      { id: 'city', label: city || 'Tỉnh/Thành', enabled: true },
      { id: 'district', label: district || 'Quận/Huyện', enabled: !!city },
      { id: 'ward', label: ward || 'Phường/Xã', enabled: !!district },
    ];

    return (
      <div ref={ref} style={{ position: 'relative' }}>
        <button onClick={() => (open ? setOpen(false) : openPanel())} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, height: 44, padding: '0 12px', border: '1.5px solid ' + (error ? 'var(--red-500)' : open ? 'var(--color-primary)' : 'var(--border-default)'), borderRadius: 'var(--radius-md)', background: '#fff', cursor: 'pointer', textAlign: 'left' }}>
          <Icon name="map-pin" size={17} style={{ color: 'var(--text-subtle)', flex: 'none' }} />
          <span style={{ flex: 1, font: 'var(--type-body)', color: display ? 'var(--text-strong)' : 'var(--text-subtle)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{display || 'Chọn Tỉnh / Quận / Phường'}</span>
          <Icon name="chevron-down" size={18} style={{ color: 'var(--text-subtle)', flex: 'none', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
        </button>

        {open && (
          <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', zIndex: 20, overflow: 'hidden' }}>
            {/* tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)' }}>
              {tabs.map((t) => (
                <button key={t.id} disabled={!t.enabled} onClick={() => t.enabled && (setLevel(t.id), setQ(''))}
                  style={{ flex: 1, minWidth: 0, height: 40, border: 0, background: 'transparent', borderBottom: '2px solid ' + (level === t.id ? 'var(--color-primary)' : 'transparent'), color: level === t.id ? 'var(--orange-600)' : t.enabled ? 'var(--text-body)' : 'var(--text-disabled)', font: (level === t.id ? '600' : '500') + ' 12.5px var(--font-sans)', cursor: t.enabled ? 'pointer' : 'not-allowed', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 8px' }}>
                  {t.label}
                </button>
              ))}
            </div>
            {/* search */}
            <div style={{ padding: '8px 10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, height: 36, border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '0 10px', background: 'var(--surface-sunken)' }}>
                <Icon name="search" size={15} style={{ color: 'var(--text-subtle)' }} />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm nhanh…" autoFocus style={{ flex: 1, border: 0, background: 'transparent', outline: 'none', font: 'var(--type-body-sm)' }} />
              </div>
            </div>
            {/* list */}
            <div style={{ maxHeight: 210, overflowY: 'auto', paddingBottom: 6 }}>
              {filtered.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', font: 'var(--type-body-sm)', color: 'var(--text-subtle)' }}>Không tìm thấy</div>
              ) : filtered.map((o) => {
                const sel = (level === 'city' && o === city) || (level === 'district' && o === district) || (level === 'ward' && o === ward);
                return (
                  <button key={o} onClick={() => choose(o)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', border: 0, background: 'transparent', padding: '9px 14px', cursor: 'pointer', textAlign: 'left', font: 'var(--type-body-sm)', color: sel ? 'var(--orange-600)' : 'var(--text-body)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-sunken)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                    <span style={{ flex: 1 }}>{o}</span>
                    {sel && <Icon name="check" size={15} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  const link = { font: 'var(--type-body-sm)', color: 'var(--orange-600)', cursor: 'pointer', fontWeight: 600 };
  const lab = { font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' };

  window.LZAddressModal = AddressModal;
  window.LZRegions = REGIONS;
})();
