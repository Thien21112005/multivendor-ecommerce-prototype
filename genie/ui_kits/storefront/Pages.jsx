/* Genie static policy pages (help, legal, payment, seller policy): sidebar of
   groups + rich-text body. Content lives in pages-data.jsx. */
(function () {
  const CSS = `
    .static-content-html h3 { font: var(--type-h3); color: var(--text-strong); margin: 40px 0 16px;  border-radius: var(--radius-xs); }
    .static-content-html h4 { font: var(--type-h4); color: var(--text-strong); margin: 24px 0 12px; }
    .static-content-html p { margin: 0 0 20px; color: var(--text-muted); }
    .static-content-html ul { margin: 0 0 24px; padding-left: 28px; color: var(--text-muted); list-style-type: disc; }
    .static-content-html ol { margin: 0 0 24px; padding-left: 28px; color: var(--text-muted); list-style-type: decimal; }
    .static-content-html li { margin-bottom: 12px; padding-left: 4px; }
    .static-content-html li::marker { color: var(--color-primary); font-weight: bold; }
    .static-content-html strong { font-weight: var(--weight-bold); color: var(--text-strong); }
    .static-content-html a { color: var(--color-primary); text-decoration: none; font-weight: var(--weight-semibold); }
    .static-content-html a:hover { text-decoration: underline; }
    .static-content-html .alert-box { background: var(--amber-50); border: 1px solid var(--gold-400); padding: 20px 24px; border-radius: var(--radius-lg); margin: 32px 0; }
    .static-content-html .alert-box h4 { color: var(--amber-600); margin: 0 0 8px; font-size: var(--text-lg); }
    .static-content-html .alert-box p { color: var(--text-body); margin: 0; }
    .static-content-html .info-box { background: var(--blue-50); border: 1px solid var(--blue-200); padding: 24px; border-radius: var(--radius-lg); margin: 32px 0; }
    .static-content-html .info-box h4 { color: var(--blue-600); margin: 0 0 12px; }
    .static-content-html .info-box p { color: var(--text-body); margin: 0; }
    .static-content-html table { width: 100%; border-collapse: collapse; margin: 32px 0; border-radius: var(--radius-md); overflow: hidden; box-shadow: 0 0 0 1px var(--border-subtle); }
    .static-content-html th, .static-content-html td { border-bottom: 1px solid var(--border-subtle); padding: 16px 20px; text-align: left; font-size: 14px; }
    .static-content-html th { background: var(--gray-50); font-weight: var(--weight-bold); color: var(--text-strong); text-transform: uppercase; font-size: 12px; letter-spacing: .05em; }
    .static-content-html tr:last-child td { border-bottom: none; }
  `;

  function PolicyPage({ pageId, onNav }) {
    const groups = window.LZ_PAGE_GROUPS;
    const page = window.LZ_PAGES[pageId] || window.LZ_PAGES['help-center'];
    React.useEffect(() => { window.scrollTo(0, 0); }, [pageId]);
    return (
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 24px 72px', display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <aside style={{ width: 280, flex: 'none', position: 'sticky', top: 'calc(var(--top-h, 86px) + 12px)', maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '24px 18px', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ font: 'var(--type-h4)', color: 'var(--text-strong)', margin: '0 0 18px 10px' }}>Thông tin hỗ trợ</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {groups.map((g) => (
              <div key={g.title}>
                <div style={{ font: 'var(--weight-bold) 12px var(--font-sans)', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '.05em', margin: '0 0 8px 10px' }}>{g.title}</div>
                {g.pages.map((p) => {
                  const on = p.id === pageId;
                  return <button key={p.id} onClick={() => onNav(p.id)} style={{ display: 'block', width: '100%', textAlign: 'left', border: 0, padding: '8px 10px', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: on ? 'var(--color-primary-tint)' : 'transparent', color: on ? 'var(--color-primary)' : 'var(--text-body)', font: (on ? 'var(--weight-semibold)' : 'var(--weight-regular)') + ' 14px var(--font-sans)' }}>{p.name}</button>;
                })}
              </div>
            ))}
          </div>
        </aside>
        <main style={{ flex: 1, minWidth: 0, background: '#fff', borderRadius: 'var(--radius-xl)', padding: 40, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-subtle)' }}>
          <h1 style={{ font: 'var(--type-h1)', fontSize: 32, color: 'var(--text-strong)', margin: '0 0 24px', paddingBottom: 20, borderBottom: '2px solid var(--gray-100)' }}>{page.title}</h1>
          <div className="static-content-html" dangerouslySetInnerHTML={{ __html: page.html }} style={{ font: 'var(--type-body)', color: 'var(--text-body)', lineHeight: 1.8, fontSize: 15 }} />
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
        </main>
      </div>
    );
  }

  window.LZPolicyPage = PolicyPage;
})();
