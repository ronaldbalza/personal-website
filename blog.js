/* ═══════════════════════════════════════════════════════
   BLOG / INSIGHTS — loaded after script.js on blog pages only
═══════════════════════════════════════════════════════ */

/* ── Blog index: category filters + search ─────────────── */
(function initBlogIndex() {
  const grid = document.getElementById('postsGrid');
  if (!grid) return;

  const cards  = [...grid.querySelectorAll('.post-card')];
  const chips  = [...document.querySelectorAll('.filter-chip')];
  const search = document.getElementById('blogSearch');
  const empty  = document.getElementById('postsEmpty');

  // Chip counts — hide topics with no published posts yet
  chips.forEach(chip => {
    const cat = chip.dataset.filter;
    const n = cat === 'all' ? cards.length : cards.filter(c => c.dataset.category === cat).length;
    const badge = chip.querySelector('.chip-count');
    if (badge) badge.textContent = n;
    if (cat !== 'all' && n === 0) chip.hidden = true;
  });

  // With fewer than two populated topics there is nothing to filter between
  const populated = chips.filter(c => c.dataset.filter !== 'all' && !c.hidden).length;
  const filterRow = document.querySelector('.blog-filters');
  if (filterRow && populated < 2) filterRow.hidden = true;

  // Deep link: /blog/?topic=powerbi
  const params = new URLSearchParams(location.search);
  let active = params.get('topic') || 'all';
  if (!chips.some(c => c.dataset.filter === active)) active = 'all';
  // ?topic= for a topic with no posts yet (e.g. an article breadcrumb) falls back to All
  if (filterRow?.hidden || chips.find(c => c.dataset.filter === active)?.hidden) active = 'all';

  function apply(fromUser = true) {
    const q = (search?.value || '').trim().toLowerCase();
    let visible = 0;

    cards.forEach(card => {
      const matchCat = active === 'all' || card.dataset.category === active;
      const matchQ   = !q || card.textContent.toLowerCase().includes(q);
      const show = matchCat && matchQ;
      card.hidden = !show;
      if (show) {
        visible++;
        // After a filter change, show cards immediately instead of waiting on scroll reveal
        if (fromUser) card.classList.add('revealed');
      }
    });

    chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.filter === active)));
    if (empty) empty.hidden = visible > 0;
  }

  chips.forEach(chip => chip.addEventListener('click', () => {
    active = chip.dataset.filter;
    const url = new URL(location.href);
    if (active === 'all') url.searchParams.delete('topic');
    else url.searchParams.set('topic', active);
    history.replaceState(null, '', url);
    apply();
  }));

  search?.addEventListener('input', () => apply());

  document.getElementById('resetFilters')?.addEventListener('click', () => {
    active = 'all';
    if (search) search.value = '';
    history.replaceState(null, '', location.pathname);
    apply();
  });

  apply(active !== 'all');
})();

/* ── Article: table of contents + copy buttons ─────────── */
(function initArticle() {
  const content = document.getElementById('post-content');
  if (!content) return;

  // Build TOC from h2 headings
  const toc = document.getElementById('toc');
  const headings = [...content.querySelectorAll('h2')];
  const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  headings.forEach(h => {
    if (!h.id) h.id = slug(h.textContent);
    if (!toc) return;
    const li = document.createElement('li');
    const a  = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.dataset.toc || h.textContent;
    li.appendChild(a);
    toc.appendChild(li);
  });

  if (toc && !headings.length) toc.closest('.post-aside')?.remove();

  // Highlight the section currently being read
  if (toc && headings.length) {
    const links = [...toc.querySelectorAll('a')];
    const setActive = id => links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));

    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-15% 0px -70% 0px' });

    headings.forEach(h => observer.observe(h));
  }

  // Wrap <pre> blocks with a header + copy button
  content.querySelectorAll('pre').forEach(pre => {
    const wrap = document.createElement('div');
    wrap.className = 'code-block';

    const head = document.createElement('div');
    head.className = 'code-block-head';

    const lang = document.createElement('span');
    lang.className = 'code-lang';
    lang.textContent = pre.dataset.lang || 'Code';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pre.innerText);
        btn.textContent = 'Copied';
        btn.classList.add('copied');
      } catch {
        btn.textContent = 'Select & copy';
      }
      setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1800);
    });

    head.append(lang, btn);
    pre.parentNode.insertBefore(wrap, pre);
    wrap.append(head, pre);
  });
})();
