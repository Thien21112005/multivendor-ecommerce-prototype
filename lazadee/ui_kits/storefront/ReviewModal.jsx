/* Lazadee review form: one review per order line, with a star picker, comment, up to 5
   photos and 1 video. A review with photos earns 50 Xu. */
(function () {
  const DS = window.LazadeeDesignSystem_0477b7;
  const { Icon, Button, Modal, Radio } = DS;

  function ReviewModal({ open, onClose, order, onSubmitted }) {
    const [stars, setStars] = React.useState(5);
    const [text, setText] = React.useState('');
    const [imgs, setImgs] = React.useState([]);
    const [video, setVideo] = React.useState(null);
    const [idx, setIdx] = React.useState(0);
    const [bonus, setBonus] = React.useState(0);
    const videoRef = React.useRef(null);
    const [anon, setAnon] = React.useState(false);
    const fileRef = React.useRef(null);
    const clear = () => { setStars(5); setText(''); setImgs([]); setVideo(null); setAnon(false); };
    React.useEffect(() => { if (open) { clear(); setIdx(0); setBonus(0); } }, [open]);
    if (!open || !order) return null;
    const item = order.items[idx];
    const last = idx === order.items.length - 1;
    const pickVideo = (e) => {
      const f = e.target.files[0]; e.target.value = '';
      if (!f) return;
      if (f.size > 30 * 1048576) { window.dispatchEvent(new CustomEvent('show_toast', { detail: { message: 'Video tối đa 30MB', type: 'error' } })); return; }
      setVideo(f.name);
    };
    const submit = () => {
      const earned = bonus + (imgs.length ? 50 : 0);
      if (imgs.length) {
        window.LZ.USER.coins += 50;
        window.LZ.COIN_LOG.unshift({ type: 'earn', label: 'Đánh giá sản phẩm có ảnh', amount: 50, at: 'Hôm nay' });
      }
      if (last) { onSubmitted(earned); return; }
      setBonus(earned); setIdx(idx + 1); clear();
    };

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
            <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>(Phân loại: {item.variant}){order.items.length > 1 ? ' · Sản phẩm ' + (idx + 1) + '/' + order.items.length : ''}</span>
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
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 6 }}>Đánh giá có ảnh được tặng 50 Xu.</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input ref={videoRef} type="file" accept="video/mp4" onChange={pickVideo} style={{ display: 'none' }} />
            <Button size="sm" variant="outline" iconLeft="upload" onClick={() => videoRef.current.click()}>{video ? 'Đổi video' : 'Thêm 1 video'}</Button>
            <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{video || 'MP4, tối đa 30MB'}</span>
          </div>
          <div style={{ display: 'flex', gap: 18 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 7, font: 'var(--type-body-sm)', color: 'var(--text-body)', cursor: 'pointer' }}><Radio name="review-name" checked={!anon} onChange={() => setAnon(false)} />Hiển thị tên công khai</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 7, font: 'var(--type-body-sm)', color: 'var(--text-body)', cursor: 'pointer' }}><Radio name="review-name" checked={anon} onChange={() => setAnon(true)} />Đánh giá ẩn tên</label>
          </div>
          <Button size="lg" block onClick={submit}>{last ? 'Gửi đánh giá' : 'Gửi và đánh giá sản phẩm tiếp theo'}</Button>
        </div>
      </Modal>
    );
  }
  const lab = { display: 'block', font: 'var(--weight-semibold) var(--text-sm) var(--font-sans)', color: 'var(--text-strong)', marginBottom: 8 };

  window.LZReviewModal = ReviewModal;
})();
