/* Vendor: KYC onboarding — upload ID / business license (PDF/JPG/PNG, <10MB),
   status states PENDING / VERIFIED / REJECTED with reason. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Badge, StatusBadge, Input, Select, Modal } = DS;

  // Webcam capture for the selfie; falls back to a message when camera access is denied.
  function CameraModal({ onClose, onShot }) {
    const video = React.useRef(null);
    const [err, setErr] = React.useState('');
    React.useEffect(() => {
      let stream = null;
      if (!navigator.mediaDevices) { setErr('Không thể truy cập camera. Vui lòng cấp quyền camera trong trình duyệt.'); return undefined; }
      navigator.mediaDevices.getUserMedia({ video: true }).then((s) => { stream = s; if (video.current) video.current.srcObject = s; })
        .catch(() => setErr('Không thể truy cập camera. Vui lòng cấp quyền camera trong trình duyệt.'));
      return () => { if (stream) stream.getTracks().forEach((t) => t.stop()); };
    }, []);
    const capture = () => {
      const v = video.current, c = document.createElement('canvas');
      c.width = v.videoWidth; c.height = v.videoHeight; c.getContext('2d').drawImage(v, 0, 0);
      onShot(c.toDataURL('image/jpeg'));
    };
    return (
      <Modal open onClose={onClose} width={520} title="Chụp ảnh chân dung"
        footer={<><Button variant="ghost" onClick={onClose}>Huỷ</Button><Button iconLeft="camera" disabled={!!err} onClick={capture}>Chụp</Button></>}>
        {err ? <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--red-600)', font: 'var(--type-body-sm)' }}><Icon name="circle-alert" size={16} />{err}</div>
          : <video ref={video} autoPlay playsInline muted style={{ width: '100%', borderRadius: 'var(--radius-md)', background: 'var(--ink-900)' }} />}
      </Modal>
    );
  }

  // Try these to preview each state: 'PENDING' | 'VERIFIED' | 'REJECTED'
  function Onboarding({ onSubmit }) {
    const [state, setState] = React.useState(window.LZ_KYC_STATUS || 'VERIFIED');
    React.useEffect(() => { if (window.LZ_KYC_STATUS) setState(window.LZ_KYC_STATUS); }, [window.LZ_KYC_STATUS]);
    const [files, setFiles] = React.useState({});
    const [selfie, setSelfie] = React.useState(null);
    const [camOpen, setCamOpen] = React.useState(false);
    const [draftMsg, setDraftMsg] = React.useState('');
    const [note, setNote] = React.useState('');
    const pick = (key, e) => {
      const f = e.target.files[0]; e.target.value = '';
      if (!f) return;
      if (f.size > 10 * 1024 * 1024) { setNote('File quá lớn (tối đa 10MB)'); return; }
      setNote('');
      setFiles((s) => ({ ...s, [key]: { file: f.name, size: (f.size / 1048576).toFixed(1).replace('.', ',') + ' MB' } }));
    };
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
    const submit = () => {
      if (state !== 'VERIFIED' && !selfie) { setNote('Hồ sơ chưa hoàn thiện: vui lòng bổ sung ảnh chân dung (selfie).'); return; }
      setNote(''); setState('PENDING'); setDraftMsg('Hồ sơ của bạn đã được tiếp nhận và đang được thẩm định tự động');
      if (onSubmit) onSubmit(formData);
    };
    const docs = [
      { key: 'id_front', label: 'CCCD / CMND — mặt trước', done: true, file: 'cccd-truoc.jpg', size: '2,1 MB' },
      { key: 'id_back', label: 'CCCD / CMND — mặt sau', done: true, file: 'cccd-sau.jpg', size: '1,9 MB' },
      { key: 'license', label: 'Giấy phép kinh doanh', done: state === 'VERIFIED' || state === 'PENDING', file: 'gpkd.pdf', size: '3,4 MB' },
    ].map((d) => (files[d.key] ? { ...d, done: true, ...files[d.key] } : d));
    const banner = {
      PENDING: { v: 'warning', icon: 'clock', t: 'Hồ sơ đang chờ duyệt', s: 'Đội ngũ Lazadee sẽ xét duyệt trong vòng 24 giờ. Bạn chưa thể đăng bán cho đến khi được duyệt.' },
      VERIFIED: { v: 'success', icon: 'badge-check', t: 'Hồ sơ đã được xác minh', s: 'Tài khoản của bạn đã VERIFIED — bạn có thể đăng bán sản phẩm và nhận thanh toán.' },
      REJECTED: { v: 'danger', icon: 'triangle-alert', t: 'Hồ sơ bị từ chối', s: 'Lý do: Ảnh giấy tờ không hợp lệ. Vui lòng tải lại và gửi duyệt.' },
      SUPPLEMENT_REQUESTED: { v: 'warning', icon: 'file-text', t: 'Yêu cầu bổ sung hồ sơ', s: 'Vui lòng cung cấp CCCD hoặc Giấy phép kinh doanh để chúng tôi xác minh danh tính của bạn. Hạn bổ sung: 7 ngày.' },
    }[state];

    return (
      <div style={{ maxWidth: 1180 }}>
        {/* state preview toggle (demo only) */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, alignItems: 'center' }}>
          <span style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>Xem trạng thái (demo):</span>
          {['PENDING', 'VERIFIED', 'REJECTED', 'SUPPLEMENT_REQUESTED'].map((s) => (
            <button key={s} onClick={() => setState(s)} style={{ height: 28, padding: '0 12px', borderRadius: 'var(--radius-pill)', border: '1px solid ' + (state === s ? 'var(--color-primary)' : 'var(--border-default)'), background: state === s ? 'var(--color-primary-tint)' : '#fff', color: state === s ? 'var(--orange-700)' : 'var(--text-muted)', font: '600 12px var(--font-sans)', cursor: 'pointer' }}>{s}</button>
          ))}
        </div>

        {/* status banner */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: `var(--${banner.v === 'success' ? 'green' : banner.v === 'warning' ? 'amber' : 'red'}-50)`, borderRadius: 'var(--radius-lg)', padding: '16px 18px', marginBottom: 18 }}>
          <Icon name={banner.icon} size={22} style={{ color: `var(--${banner.v === 'success' ? 'green' : banner.v === 'warning' ? 'amber' : 'red'}-600)`, marginTop: 1 }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ font: 'var(--weight-bold) var(--text-base) var(--font-sans)', color: 'var(--text-strong)' }}>{banner.t}</span>
              <StatusBadge status={state === 'SUPPLEMENT_REQUESTED' ? 'PENDING' : state} label={state === 'SUPPLEMENT_REQUESTED' ? 'Cần bổ sung' : undefined} />
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
                <label style={{ cursor: 'pointer' }}>
                  <input type="file" hidden accept=".pdf,image/jpeg,image/png" onChange={(e) => pick(d.key, e)} />
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 12px', borderRadius: 'var(--radius-md)', background: d.done ? 'transparent' : 'var(--orange-50)', color: d.done ? 'var(--text-body)' : 'var(--orange-700)', font: '600 13px var(--font-sans)' }}><Icon name={d.done ? 'refresh-cw' : 'upload'} size={14} />{d.done ? 'Thay đổi' : 'Chọn file'}</span>
                </label>
              </div>
            ))}
          </div>

          {/* selfie */}
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)' }}>Ảnh chân dung (selfie)</span>
              {!selfie && <Badge variant="danger">Bắt buộc</Badge>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, font: 'var(--type-caption)', color: 'var(--text-subtle)', marginBottom: 10 }}><Icon name="info" size={14} />Chụp ảnh chân dung rõ mặt, đủ ánh sáng, không đội mũ/đeo kính đen</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, border: '1.5px dashed ' + (selfie ? 'var(--mint-500)' : 'var(--border-strong)'), borderRadius: 'var(--radius-md)', padding: '12px 16px', background: selfie ? 'var(--mint-50)' : 'var(--gray-25)' }}>
              {selfie ? <img src={selfie} alt="Ảnh chân dung" style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} /> : <Icon name="camera" size={22} style={{ color: 'var(--text-subtle)' }} />}
              <div style={{ flex: 1, font: 'var(--type-body-sm)', color: selfie ? 'var(--mint-600)' : 'var(--text-muted)' }}>{selfie ? 'Đã tải lên (mã hóa)' : 'Tải ảnh lên hoặc chụp từ camera'}</div>
              <label style={{ cursor: 'pointer' }}>
                <input type="file" hidden accept="image/jpeg,image/png" onChange={(e) => { const f = e.target.files[0]; e.target.value = ''; if (f) setSelfie(URL.createObjectURL(f)); }} />
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 12px', font: '600 13px var(--font-sans)', color: 'var(--text-body)' }}><Icon name="upload" size={14} />Chọn file</span>
              </label>
              <Button size="sm" variant="secondary" iconLeft="camera" onClick={() => setCamOpen(true)}>Chụp ảnh</Button>
            </div>
          </div>
          {note && <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--red-600)', font: 'var(--type-caption)', marginTop: 10 }}><Icon name="circle-alert" size={13} />{note}</div>}
        </div>
        {camOpen && <CameraModal onClose={() => setCamOpen(false)} onShot={(src) => { setSelfie(src); setCamOpen(false); }} />}

        {draftMsg && <div role="status" style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12, color: 'var(--mint-600)', font: 'var(--type-body-sm)' }}><Icon name="circle-check" size={16} />{draftMsg}</div>}
        {state !== 'VERIFIED' && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button variant="ghost" onClick={() => setDraftMsg('Đã lưu nháp hồ sơ')}>Lưu nháp</Button>
            <Button iconLeft="send" onClick={submit}>{state === 'REJECTED' || state === 'SUPPLEMENT_REQUESTED' ? 'Gửi lại hồ sơ' : 'Gửi duyệt KYC'}</Button>
          </div>
        )}
      </div>
    );
  }
  window.LZVOnboarding = Onboarding;
})();
