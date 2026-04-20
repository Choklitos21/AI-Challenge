const currentTab = () => $('auth-email').dataset.tab || 'login';

const handleAuth = async () => {
  const email    = $('auth-email').value.trim();
  const password = $('auth-password').value.trim();
  hideError('auth-error');

  if (!email || !password) return showError('auth-error', 'Email and password required');

  try {
    if (currentTab() === 'login') {
      await api.login(email, password);
    } else {
      await api.register(email, password);
    }
    enterApp();
  } catch (err) {
    showError('auth-error', err.message);
  }
};

const enterApp = () => {
  $('view-auth').classList.add('hidden');
  $('view-app').classList.remove('hidden');
  showView('embed');
};

const handleLogout = async () => {
  await api.logout();
  $('view-app').classList.add('hidden');
  $('view-auth').classList.remove('hidden');
};

const handleEmbed = async () => {
  const content = $('embed-input').value.trim();
  hideError('embed-error');
  if (!content) return showError('embed-error', 'Text is required');

  setLoading('embed-btn', true);
  try {
    const { saved, failed } = await api.embed(content);
    $('results-grid').innerHTML = saved.map(renderResult).join('');
    if (failed.length) showError('embed-error', `Failed: ${failed.join(', ')}`);
    $('embed-results').classList.remove('hidden');
  } catch (err) {
    showError('embed-error', err.message);
  } finally {
    setLoading('embed-btn', false);
  }
};

const init = async () => {
  showTab('login');
  try {
    await api.me();
    enterApp();
  } catch {
    // not logged in, stay on auth view
  }
};

init();