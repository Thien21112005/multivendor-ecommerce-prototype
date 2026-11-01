/* Vendor: KYC onboarding — upload ID / business license (PDF/JPG/PNG, <10MB),
   status states PENDING / VERIFIED / REJECTED with reason. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Badge, StatusBadge, Input, Select } = DS;

  // Try these to preview each state: 'PENDING' | 'VERIFIED' | 'REJECTED'
  function Onboarding({ onSubmit }) {
    const [state, setState] = React.useState('VERIFIED');
    // Backend OCR/KYC needs the legal identifiers split: CCCD (individual) vs MST
    // (business/household). Form state is kept in one object ready for onSubmit.
    const [formData, setFormData] = React.useState({
      shopName: 'TechZone Official',
      businessType: 'Doanh nghiệp',
      cccd: '',
      taxCode: '0312987654',
      representative: 'Đặng Quốc Huy',
    });
    const setField = (k, v) => setFormData((s) => ({ ...s, [k]: v }));
    const isIndividual = formData.businessType === 'Cá nhân';
    const submit = () => { (onSubmit || ((d) => console.log('KYC submit', d)))(formData); };
    const docs = [
      { key: 'id_front', label: 'CCCD / CMND — mặt trước', done: true, file: 'cccd-truoc.jpg', size: '2,1 MB' },
      { key: 'id_back', label: 'CCCD / CMND — mặt sau', done: true, file: 'cccd-sau.jpg', size: '1,9 MB' },
      { key: 'license', label: 'Giấy phép kinh doanh', done: state !== 'REJECTED', file: 'gpkd.pdf', size: '3,4 MB' },
    ];
    const banner = {
      PENDING: { v: 'warning', icon: 'clock', t: 'Hồ sơ đang chờ duyệt', s: 'Đội ngũ Lazadee sẽ xét duyệt trong vòng 24 giờ. Bạn chưa thể đăng bán cho đến khi được duyệt.' },
      VERIFIED: { v: 'success', icon: 'badge-check', t: 'Hồ sơ đã được xác minh', s: 'Tài khoản của bạn đã VERIFIED — bạn có thể đăng bán sản phẩm và nhận thanh toán.' },
      REJECTED: { v: 'danger', icon: 'triangle-alert', t: 'Hồ sơ bị từ chối', s: 'Lý do: Ảnh giấy phép kinh doanh bị mờ, không đọc được. Vui lòng tải lại và gửi duyệt.' },
    }[state];

    return (
      <div style={{ maxWidth: 1180 }}>
        {/* state preview toggle (demo only) */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, alignItems: 'center' }}>
          <span style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>Xem trạng thái (demo):</span>
          {['PENDING', 'VERIFIED', 'REJECTED'].map((s) => (
            <button key={s} onClick={() => setState(s)} style={{ height: 28, padding: '0 12px', borderRadius: 'var(--radius-pill)', border: '1px solid ' + (state === s ? 'var(--color-primary)' : 'var(--border-default)'), background: state === s ? 'var(--color-primary-tint)' : '#fff', color: state === s ? 'var(--orange-700)' : 'var(--text-muted)', font: '600 12px var(--font-sans)', cursor: 'pointer' }}>{s}</button>
          ))}
        </div>

        {/* status banner */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: `var(--${banner.v === 'success' ? 'green' : banner.v === 'warning' ? 'amber' : 'red'}-50)`, borderRadius: 'var(--radius-lg)', padding: '16px 18px', marginBottom: 18 }}>
          <Icon name={banner.icon} size={22} style={{ color: `var(--${banner.v === 'success' ? 'green' : banner.v === 'warning' ? 'amber' : 'red'}-600)`, marginTop: 1 }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>{banner.t}</span>
              <StatusBadge status={state} />
            </div>
            <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)', marginTop: 4 }}>{banner.s}</div>
          </div>
        </div>

        {/* step: business info */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: 22, marginBottom: 16 }}>
          <div style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)', marginBottom: 16 }}>Thông tin người bán</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{ flex: 1 }}><Input label="Tên shop" value={formData.shopName} onChange={(e) => setField('shopName', e.target.value)} required /></div>
              <div style={{ flex: 1 }}><Select label="Loại hình" value={formData.businessType} onChange={(e) => setField('businessType', e.target.value)}><option>Cá nhân</option><option>Hộ kinh doanh</option><option>Doanh nghiệp</option></Select></div>
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{ flex: 1 }}>
                {isIndividual
                  ? <Input label="Số CCCD (Dành cho Cá nhân)" iconLeft="badge-check" value={formData.cccd} onChange={(e) => setField('cccd', e.target.value)} placeholder="VD: 0790xxxxxxxx" required />
                  : <Input label="Mã số thuế (Doanh nghiệp / Hộ KD)" iconLeft="file-text" value={formData.taxCode} onChange={(e) => setField('taxCode', e.target.value)} placeholder="VD: 0312xxxxxx" required />}
              </div>
              <div style={{ flex: 1 }}><Input label="Người đại diện" value={formData.representative} onChange={(e) => setField('representative', e.target.value)} required /></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>
              <Icon name="info" size={14} />
              {isIndividual
                ? 'Cá nhân: nhập số CCCD để đối soát định danh qua OCR khi giải ngân Escrow.'
                : 'Doanh nghiệp / Hộ KD: nhập Mã số thuế (MST) để đối soát dòng tiền Escrow.'}
            </div>
          </div>
        </div>

        {/* step: documents */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: 22, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>Giấy tờ định danh</span>
            <Badge variant="neutral">PDF / JPG / PNG · &lt; 10MB</Badge>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
            {docs.map((d) => (
              <div key={d.key} style={{ display: 'flex', alignItems: 'center', gap: 14, border: '1.5px dashed ' + (d.done ? 'var(--mint-500)' : 'var(--border-strong)'), borderRadius: 'var(--radius-md)', padding: '12px 16px', background: d.done ? 'var(--mint-50)' : 'var(--gray-25)' }}>
                <Icon name={d.done ? 'circle-check' : 'upload'} size={22} style={{ color: d.done ? 'var(--mint-600)' : 'var(--text-subtle)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>{d.label}</div>
                  {d.done
                    ? <div className="code" style={{ font: '12px var(--font-mono)', color: 'var(--text-muted)', marginTop: 2 }}>{d.file} · {d.size}</div>
                    : <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 2 }}>Kéo thả hoặc bấm để tải lên</div>}
                </div>
                <Button variant={d.done ? 'ghost' : 'secondary'} size="sm" iconLeft={d.done ? 'refresh-cw' : 'upload'}>{d.done ? 'Thay đổi' : 'Tải lên'}</Button>
              </div>
            ))}
          </div>
        </div>

        {state !== 'VERIFIED' && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button variant="ghost">Lưu nháp</Button>
            <Button iconLeft="send" onClick={submit}>{state === 'REJECTED' ? 'Gửi lại hồ sơ' : 'Gửi duyệt KYC'}</Button>
          </div>
        )}
      </div>
    );
  }
  window.LZVOnboarding = Onboarding;
})();
