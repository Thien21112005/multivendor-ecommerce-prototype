/* Lazadee review form: star picker, comment and up to 5 photos (drag & drop or file
   picker, previewed locally). */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Modal } = DS;

  function ReviewModal({ open, onClose, order, onSubmitted }) {
    const [stars, setStars] = React.useState(5);
    const [text, setText] = React.useState('');
    const [imgs, setImgs] = React.useState([]);
    const fileRef = React.useRef(null);
    React.useEffect(() => { if (open) { setStars(5); setText(''); setImgs([]); } }, [open]);
    if (!open || !order) return null;
    const item = order.items[0];

    const addFiles = (files) => {
      const pics = Array.from(files).filter((f) => f.type.startsWith('image/'));
      if (imgs.length + pics.length > 5) { window.dispatchEvent(new CustomEvent('show_toast', { detail: { message: 'Tối đa 5 ảnh thôi nhé', type: 'error' } })); return; }
      setImgs((a) => [...a, ...pics.map((f) => URL.createObjectURL(f))]);
    };

    return (
      <Modal open onClose={onClose} title="Đánh giá sản phẩm" width={540}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ font: 'var(--type-body)', color: 'var(--text-strong)' }}>
            <b>{item.title}</b>
            <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>(Mã SP: {item.productId})</span>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setStars(n)} aria-label={n + ' sao'} style={{ border: 0, background: 'transparent', padding: 0, cursor: 'pointer', color: n <= stars ? 'var(--orange-500)' : 'var(--border-strong)' }}>
                <Icon name="star" size={38} style={{ fill: n <= stars ? 'currentColor' : 'none' }} />
              </button>
            ))}
          </div>
          <div>
            <label style={lab}>Nhận xét của bạn</label>
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Hãy chia sẻ nhận xét của bạn về sản phẩm này nhé..." style={{ width: '100%', height: 96, padding: 12, border: '1.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', outline: 'none', resize: 'vertical', font: 'var(--type-body)', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={lab}>Hình ảnh đính kèm ({imgs.length}/5)</label>
            <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
              onClick={(e) => { if (imgs.length < 5 && !e.target.closest('button')) fileRef.current.click(); }}
              style={{ minHeight: 96, border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)', display: 'flex', flexWrap: 'wrap', gap: 12, padding: 14, alignItems: 'center', justifyContent: imgs.length ? 'flex-start' : 'center', cursor: imgs.length < 5 ? 'pointer' : 'default' }}>
              {imgs.length === 0 && <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'var(--text-muted)', pointerEvents: 'none' }}><Icon name="camera" size={26} /><span style={{ font: 'var(--type-body-sm)' }}>Kéo thả hoặc click vào đây để chọn ảnh</span></div>}
              {imgs.map((src, i) => (
                <div key={src} style={{ position: 'relative', width: 64, height: 64, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={() => setImgs((a) => a.filter((_, j) => j !== i))} aria-label="Xoá ảnh" style={{ position: 'absolute', top: 2, right: 2, width: 20, height: 20, border: 0, borderRadius: '50%', background: 'rgba(0,0,0,.6)', color: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer' }}><Icon name="x" size={12} /></button>
                </div>
              ))}
              {imgs.length > 0 && imgs.length < 5 && <div style={{ width: 64, height: 64, borderRadius: 8, border: '1px dashed var(--border-strong)', display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}><Icon name="plus" size={22} /></div>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} style={{ display: 'none' }} />
          </div>
          <Button size="lg" block onClick={onSubmitted}>Gửi đánh giá</Button>
        </div>
      </Modal>
    );
  }
  const lab = { display: 'block', font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)', marginBottom: 8 };

  window.LZReviewModal = ReviewModal;
})();
