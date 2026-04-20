const $ = id => document.getElementById(id);

const showTab = (tab) => {
  $('tab-login').className    = 'tab-btn mono text-xs px-3 py-1.5 border rounded transition-colors ' + (tab === 'login'    ? 'border-zinc-700 bg-zinc-800 text-zinc-300' : 'border-transparent text-zinc-500');
  $('tab-register').className = 'tab-btn mono text-xs px-3 py-1.5 border rounded transition-colors ' + (tab === 'register' ? 'border-zinc-700 bg-zinc-800 text-zinc-300' : 'border-transparent text-zinc-500');
  $('auth-email').value = '';
  $('auth-password').value = '';
  hideError('auth-error');
  $('auth-email').dataset.tab = tab;
};

const showError = (id, msg) => {
  const el = $(id);
  el.textContent = msg;
  el.classList.remove('hidden');
};

const hideError = (id) => $(id).classList.add('hidden');

const showView = (view) => {
  $('view-embed').classList.add('hidden');
  $('view-history').classList.add('hidden');
  $(`view-${view}`).classList.remove('hidden');
  $(`view-${view}`).classList.add('fade-in');

  $('nav-embed').classList.toggle('text-zinc-100', view === 'embed');
  $('nav-embed').classList.toggle('text-zinc-400', view !== 'embed');
  $('nav-history').classList.toggle('text-zinc-100', view === 'history');
  $('nav-history').classList.toggle('text-zinc-400', view !== 'history');

  if (view === 'history') loadHistory();
};

const renderResult = (embedding) => {
  const providerColor = embedding.provider === 'openai' ? 'text-emerald-400' : 'text-blue-400';
  return `
    <div class="bg-zinc-900 border border-zinc-800 rounded p-4">
      <div class="flex items-center justify-between mb-3">
        <span class="mono text-xs ${providerColor}">${embedding.provider}</span>
        <span class="mono text-xs text-zinc-600">${embedding.duration_ms}ms</span>
      </div>
      <div class="flex gap-4">
        <div>
          <p class="mono text-xs text-zinc-600 mb-1">model</p>
          <p class="mono text-xs text-zinc-300">${embedding.model}</p>
        </div>
        <div>
          <p class="mono text-xs text-zinc-600 mb-1">dimensions</p>
          <p class="mono text-xs text-zinc-300">${embedding.dimensions}</p>
        </div>
      </div>
    </div>
  `;
};

const renderHistoryItem = (item) => {
  const preview = item.content.length > 80 ? item.content.slice(0, 80) + '…' : item.content;
  const date = new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const models = (item.embeddings || []).filter(e => e.provider).map(e =>
    `<span class="mono text-xs ${e.provider === 'openai' ? 'text-emerald-400' : 'text-blue-400'}">${e.provider}</span>`
  ).join('<span class="text-zinc-700 mx-1">·</span>');

  return `
    <div class="bg-zinc-900 border border-zinc-800 rounded p-4">
      <div class="flex items-start justify-between gap-4 mb-3">
        <p class="mono text-xs text-zinc-300 leading-relaxed">${preview}</p>
        <span class="mono text-xs text-zinc-600 shrink-0">${date}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="mono text-xs text-zinc-600">embedded with</span>
        ${models || '<span class="mono text-xs text-zinc-600">—</span>'}
      </div>
    </div>
  `;
};

const setLoading = (btnId, loading) => {
  const btn = $(btnId);
  btn.disabled = loading;
  btn.textContent = loading ? '...' : 'run →';
};

const loadHistory = async () => {
  const list = $('history-list');
  list.innerHTML = '<p class="mono text-xs text-zinc-600">loading...</p>';
  const { texts } = await api.history();
  if (!texts.length) {
    list.innerHTML = '<p class="mono text-xs text-zinc-600">no embeddings yet</p>';
    return;
  }
  list.innerHTML = texts.map(renderHistoryItem).join('');
};