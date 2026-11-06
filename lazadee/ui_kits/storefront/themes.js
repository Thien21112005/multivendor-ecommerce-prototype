/* Genie storefront themes. The theme comes from ?theme=, then the last choice saved in this
   browser, and follows changes made in the launcher dock (the storage event). Changing theme
   replays the intro so each one can be judged from its first frame. */
(function () {
  var THEMES = [
    { id: 'genie', name: 'Đèn thần', note: 'Đúng tên Genie: đèn đồng thau, khói ngọc lam sau lớp kính', swatch: ['#0F6E78', '#E2B04A', '#2BB3B1', '#F1F6F5'] },
    { id: 'hoian', name: 'Phố Hội', note: 'Tường vàng Hội An, đèn lồng lụa, cửa chớp xanh, ngói âm dương', swatch: ['#E8B54A', '#2C6E68', '#B8326E', '#3A2312'] },
    { id: 'dongho', name: 'Giấy điệp', note: 'Tranh Đông Hồ: đỏ son, vàng hoè, mực than', swatch: ['#B5381F', '#E9B23C', '#1E1814', '#F3EDE1'] },
    { id: 'dongson', name: 'Trống đồng', note: 'Mặt trống Đông Sơn: đồng thau, vàng đồng, xanh gỉ đồng', swatch: ['#8E5A17', '#E0A93B', '#2B6B5E', '#F5F1E8'] },
    { id: 'polymer', name: 'Tiền polymer', note: 'Xanh ngọc, hồng, ô kính trong và hoa văn guilloche', swatch: ['#1F7356', '#E26A93', '#E3C15A', '#EEF4F1'] },
    { id: 'buudien', name: 'Tem bưu chính', note: 'Vàng bưu điện, mực navy, tem răng cưa và dấu bưu điện', swatch: ['#F5BE16', '#22335C', '#D9472B', '#EDEEE8'] },
    { id: 'saigon', name: 'Mái bạt Sài Gòn', note: 'Biển hiệu kẻ tay: xanh lá, vàng hướng dương, mái bạt sọc', swatch: ['#0F6E45', '#FFD024', '#D52B1E', '#FAF9F4'] },
    { id: 'sleeve', name: 'Bìa đĩa than', note: 'Một mảng tím phẳng, ảnh duotone, chữ in hoa nghiêng', swatch: ['#5B3FD1', '#C8F03C', '#111216', '#FFFFFF'] },
    { id: 'classic', name: 'Mực & hoa cúc', note: 'Bản gốc của Genie: mực navy, xanh dương và vàng hoa cúc', swatch: ['#1D4ED8', '#FFC02E', '#0B1F4B', '#F7F5F0'] },
  ];
  var KEY = 'genie_theme';
  var ids = THEMES.map(function (t) { return t.id; });
  var root = document.documentElement;

  function initial() {
    var q = new URLSearchParams(location.search).get('theme');
    if (q && ids.indexOf(q) >= 0) { try { localStorage.setItem(KEY, q); } catch (e) {} return q; }
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    return ids.indexOf(saved) >= 0 ? saved : ids[0];
  }
  function replay() {
    root.classList.remove('tr-play');
    void root.offsetWidth;
    root.classList.add('tr-play');
  }
  function apply(id) {
    if (ids.indexOf(id) < 0) return;
    root.setAttribute('data-theme', id);
    replay();
  }

  apply(initial());
  window.addEventListener('storage', function (e) { if (e.key === KEY) apply(e.newValue); });
  window.GENIE_THEMES = THEMES;
  window.GENIE_SET_THEME = function (id) { try { localStorage.setItem(KEY, id); } catch (e) {} apply(id); };
})();
