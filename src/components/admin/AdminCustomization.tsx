import React, { useState } from 'react';
import {
  ShieldCheck,
  Palette,
  Users,
  Activity,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Lock,
  Eye,
  Server,
  FileCheck,
  Check,
  Building2,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Globe,
  Tag,
  MessageSquare,
  Type
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { UserRole, AccentColor, WorkspaceInfo } from '../../types';

export const AdminCustomization: React.FC = () => {
  const {
    currentUser,
    users,
    updateUserRole,
    themeSettings,
    updateThemeSettings,
    themeMode,
    setThemeMode,
    auditLogs,
    resetAllData,
    tasks,
    documents,
    workspaceInfo,
    updateWorkspaceInfo
  } = useWorkspace();

  const [activeTab, setActiveTab] = useState<'workspace' | 'roles' | 'theme' | 'audit' | 'metrics'>('workspace');
  const [auditSearch, setAuditSearch] = useState('');

  // Workspace settings form state
  const [wsName, setWsName] = useState(workspaceInfo.name);
  const [wsTagline, setWsTagline] = useState(workspaceInfo.tagline);
  const [wsDomain, setWsDomain] = useState(workspaceInfo.orgDomain);
  const [wsLogoUrl, setWsLogoUrl] = useState(workspaceInfo.logoUrl || '');
  const [wsLoginBgStyle, setWsLoginBgStyle] = useState<WorkspaceInfo['loginBgStyle']>(workspaceInfo.loginBgStyle || 'deep-navy');
  const [wsLoginBgCustomUrl, setWsLoginBgCustomUrl] = useState(workspaceInfo.loginBgCustomUrl || '');
  const [wsLoginBgBlur, setWsLoginBgBlur] = useState<number>(workspaceInfo.loginBgBlur ?? 0);
  const [wsLoginBgOverlayOpacity, setWsLoginBgOverlayOpacity] = useState<number>(workspaceInfo.loginBgOverlayOpacity ?? 60);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const isSuperAdmin = currentUser.role === 'super_admin';
  const isAdminOrSuper = isSuperAdmin || currentUser.role === 'admin';

  const accentColorPresets: { id: AccentColor; name: string; primary: string; accent: string }[] = [
    { id: 'navy-crimson', name: 'Corporate Navy (Utama) & Crimson (Aksen #2)', primary: 'bg-slate-900', accent: 'bg-red-600' },
    { id: 'royal-blue', name: 'Royal Blue & Sky Accent', primary: 'bg-blue-900', accent: 'bg-blue-600' },
    { id: 'emerald', name: 'Deep Forest & Emerald Accent', primary: 'bg-emerald-950', accent: 'bg-emerald-600' },
    { id: 'purple', name: 'Executive Midnight & Royal Violet', primary: 'bg-purple-950', accent: 'bg-purple-600' },
    { id: 'amber', name: 'Warm Amber & Gold Prestige', primary: 'bg-amber-950', accent: 'bg-amber-500' }
  ];

  const handleSaveWorkspaceSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateWorkspaceInfo({
      name: wsName.trim(),
      tagline: wsTagline.trim(),
      orgDomain: wsDomain.trim(),
      logoUrl: wsLogoUrl.trim(),
      loginBgStyle: wsLoginBgStyle,
      loginBgCustomUrl: wsLoginBgCustomUrl.trim(),
      loginBgBlur: wsLoginBgBlur,
      loginBgOverlayOpacity: wsLoginBgOverlayOpacity
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setWsLogoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    if (!auditSearch.trim()) return true;
    const q = auditSearch.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.userName.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header and Warning */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-red-600" />
              Panel Administrasi, Workspace & Kustomisasi UI
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Konfigurasi nama & logo perusahaan, manajemen hak akses RBAC, serta palet warna korporat.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-xl px-3 py-1.5 text-xs font-bold ${
                isSuperAdmin
                  ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              Role Anda: {currentUser.role.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        {/* Tab switcher with spacious slider track */}
        <div className="mt-5 border-t border-slate-100 pt-3.5 dark:border-slate-800">
          <div className="flex items-center gap-2.5 overflow-x-auto tab-slider-scroll pt-1 pb-3.5 px-1">
            <button
              onClick={() => setActiveTab('workspace')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition ${
                activeTab === 'workspace'
                  ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <Building2 className="h-4 w-4 text-red-500" />
              <span>Pengaturan Workspace (Nama & Logo)</span>
            </button>

            <button
              onClick={() => setActiveTab('roles')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition ${
                activeTab === 'roles'
                  ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Manajemen Role (RBAC)</span>
            </button>

            <button
              onClick={() => setActiveTab('theme')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition ${
                activeTab === 'theme'
                  ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <Palette className="h-4 w-4" />
              <span>Tema & Aksen UI</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition ${
                activeTab === 'audit'
                  ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>Audit Log Sistem</span>
            </button>

            <button
              onClick={() => setActiveTab('metrics')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition ${
                activeTab === 'metrics'
                  ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <Server className="h-4 w-4" />
              <span>Metrik Penggunaan</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 0: PENGATURAN WORKSPACE (NAMA & LOGO) */}
      {activeTab === 'workspace' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form
            onSubmit={handleSaveWorkspaceSettings}
            className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-5"
          >
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Identitas & Branding Workspace
              </h3>
              <p className="text-xs text-slate-500">
                Nama dan logo yang diatur di sini akan langsung tampil di sidebar, navbar, dokumen, dan halaman login.
              </p>
            </div>

            {savedSuccess && (
              <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-900 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Pengaturan Workspace berhasil disimpan dan diterapkan secara real-time!</span>
              </div>
            )}

            {/* Nama Workspace */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Workspace / Perusahaan
              </label>
              <input
                type="text"
                required
                value={wsName}
                onChange={e => setWsName(e.target.value)}
                placeholder="cth: WORKSPACE Corp, PT Asli Rancangan Indonesia"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-red-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Tagline / Deskripsi */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Slogan / Tagline Perusahaan
              </label>
              <input
                type="text"
                value={wsTagline}
                onChange={e => setWsTagline(e.target.value)}
                placeholder="cth: Enterprise Digital Collaboration Hub & Secure Operating System"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-red-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>

            {/* Domain Email Korporat */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Domain Email Kantor
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs text-slate-400">@</span>
                <input
                  type="text"
                  value={wsDomain}
                  onChange={e => setWsDomain(e.target.value)}
                  placeholder="asliri.id atau workspace.corp"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3.5 py-2.5 text-xs text-slate-800 focus:border-red-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            {/* Logo Settings */}
            <div className="border-t border-slate-100 pt-4 dark:border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Logo Workspace
              </label>

              {/* Upload file simulation */}
              <div className="flex flex-col sm:flex-row gap-3">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <Upload className="h-4 w-4 text-red-500" />
                  <span>Unggah File Logo (PNG/SVG)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <div className="relative flex-1">
                  <input
                    type="url"
                    placeholder="Atau tempel URL gambar logo..."
                    value={wsLogoUrl}
                    onChange={e => setWsLogoUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-red-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                  {wsLogoUrl && (
                    <button
                      type="button"
                      onClick={() => setWsLogoUrl('')}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-red-500"
                    >
                      Reset Logo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Kustomisasi Background Halaman Login */}
            <div className="border-t border-slate-100 pt-5 dark:border-slate-800 space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-red-500" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Latar Belakang Halaman Login (Adjustable by Super Admin)
                  </h4>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Sesuaikan gaya background login portal korporat: warna navy minimalis, aurora, grid cyber, atau foto arsitektur kantor kustom.
                </p>
              </div>

              {/* Preset Selection */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    id: 'sky',
                    name: 'Sky & Ring Arcs (Compact)',
                    desc: 'Langit cerah & konsentris modern',
                    preview: 'bg-gradient-to-b from-sky-200 to-sky-100 border border-sky-300'
                  },
                  {
                    id: 'deep-navy',
                    name: 'Deep Navy Corporate',
                    desc: 'Navy gelap elegan & minimalis',
                    preview: 'bg-slate-950 border border-slate-800'
                  },
                  {
                    id: 'aurora',
                    name: 'Aurora & Crimson Glow',
                    desc: 'Pendaran neon modern',
                    preview: 'bg-gradient-to-br from-slate-950 via-slate-900 to-red-950'
                  },
                  {
                    id: 'geometric-grid',
                    name: 'Cyber Grid & Dot Matrix',
                    desc: 'Pola geometris teknologi',
                    preview: 'bg-slate-900 border border-indigo-900'
                  },
                  {
                    id: 'modern-office',
                    name: 'Arsitektur Gedung Kantor',
                    desc: 'Gedung kaca modern korporat',
                    preview: 'bg-slate-800'
                  },
                  {
                    id: 'custom-image',
                    name: 'Custom Image URL',
                    desc: 'Gunakan tautan gambar sendiri',
                    preview: 'bg-slate-800 border-dashed border'
                  }
                ].map(item => {
                  const isSelected = wsLoginBgStyle === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setWsLoginBgStyle(item.id as WorkspaceInfo['loginBgStyle'])}
                      className={`flex flex-col text-left p-3 rounded-2xl border transition ${
                        isSelected
                          ? 'border-red-500 bg-red-50/20 dark:bg-red-950/30 ring-1 ring-red-500 font-bold'
                          : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 dark:border-slate-700/80 dark:bg-slate-800/60 dark:hover:bg-slate-700/60'
                      }`}
                    >
                      <div className={`h-8 w-full rounded-xl mb-2 ${item.preview} shadow-2xs`} />
                      <span className="text-xs text-slate-900 dark:text-white font-semibold">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Image URL input if selected */}
              {wsLoginBgStyle === 'custom-image' && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-700 dark:bg-slate-800/80 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    URL Gambar Background Kustom:
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={wsLoginBgCustomUrl}
                    onChange={e => setWsLoginBgCustomUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 focus:border-red-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
                  />
                  <p className="text-[10px] text-slate-400">
                    Tempel URL gambar berkualitas tinggi (disarankan resolusi landscape 1920x1080).
                  </p>
                </div>
              )}

              {/* Sliders: Blur & Overlay Darkness */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>Efek Blur Background:</span>
                    <span className="font-mono text-red-500">{wsLoginBgBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={wsLoginBgBlur}
                    onChange={e => setWsLoginBgBlur(Number(e.target.value))}
                    className="w-full accent-red-600"
                  />
                  <span className="text-[10px] text-slate-400">0px (tajam) hingga 20px (sangat halus)</span>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>Kegelapan Overlay (Darkness):</span>
                    <span className="font-mono text-red-500">{wsLoginBgOverlayOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="95"
                    step="5"
                    value={wsLoginBgOverlayOpacity}
                    onChange={e => setWsLoginBgOverlayOpacity(Number(e.target.value))}
                    className="w-full accent-red-600"
                  />
                  <span className="text-[10px] text-slate-400">Menjaga teks login tetap memiliki kontras tinggi</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-slate-950 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-black transition active:scale-95"
              >
                <Check className="h-4 w-4 text-red-500" />
                <span>Simpan Konfigurasi Workspace</span>
              </button>
            </div>
          </form>

          {/* Live Preview Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pratinjau Branding Real-Time
            </h3>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/60 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-md">
                  {wsLogoUrl ? (
                    <img src={wsLogoUrl} alt="Logo" className="h-8 w-8 rounded-lg object-contain" />
                  ) : (
                    <Building2 className="h-6 w-6 text-red-500" />
                  )}
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{wsName || 'ASLI GROUP'}</span>
                    <span className="h-2 w-2 rounded-full bg-red-600" />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {wsTagline || 'Corporate Collaboration Hub'}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 dark:border-slate-700 text-xs text-slate-500 space-y-1">
                <div>Domain: <strong>@{wsDomain || 'asliri.id'}</strong></div>
                <div>Format Header: <strong>Sidebar & Navbar Synced</strong></div>
                <div>Background Login: <strong className="capitalize">{wsLoginBgStyle}</strong></div>
              </div>
            </div>

            {/* Mini Login Card Mockup */}
            <div className="mt-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 text-slate-900 dark:text-white shadow-xl space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Simulasi Pratinjau Login Card
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-600" />
                <span className="font-extrabold text-xs">{wsName || 'ASLI GROUP'}</span>
              </div>
              <div className="text-[10px] text-center text-slate-500 dark:text-slate-400">
                {wsTagline || 'Corporate Collaboration Hub'}
              </div>
              <div className="h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] flex items-center px-2 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                saeful.rohman@{wsDomain || 'asliri.id'}
              </div>
              <div className="h-6 rounded-lg bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold text-[10px] flex items-center justify-center">
                Masuk ke Sistem
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: ROLE MANAGEMENT (RBAC) */}
      {activeTab === 'roles' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Pengaturan Hak Akses & Peran Karyawan (RBAC)
            </h3>
            <p className="text-xs text-slate-500">
              Super Admin memiliki kewenangan penuh untuk mengubah peran dan otoritas divisi anggota.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800">
                <tr>
                  <th className="px-4 py-3">Karyawan</th>
                  <th className="px-4 py-3">Departemen</th>
                  <th className="px-4 py-3">Jabatan</th>
                  <th className="px-4 py-3">Status Saat Ini</th>
                  <th className="px-4 py-3">Tingkat Akses (Role)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map(u => (
                  <tr key={u.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <img src={u.avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
                        <div>
                          <div>{u.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{u.department}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{u.position}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className={`h-2 w-2 rounded-full ${u.status === 'online' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        <span className="capitalize text-slate-600 dark:text-slate-300">{u.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {isSuperAdmin ? (
                        <select
                          value={u.role}
                          onChange={e => updateUserRole(u.id, e.target.value as UserRole)}
                          className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold focus:border-red-500 dark:border-slate-700 dark:bg-slate-800"
                        >
                          <option value="super_admin">Super Admin</option>
                          <option value="admin">Admin</option>
                          <option value="manager">Manager</option>
                          <option value="employee">Employee</option>
                        </select>
                      ) : (
                        <span className="text-[11px] text-slate-400">Terkunci (Super Admin Only)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: FULL THEME & UI CUSTOMIZATION */}
      {activeTab === 'theme' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Mode & Palet Warna */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Palette className="h-4 w-4 text-blue-600" />
                <span>Mode Tampilan & Warna Workspace</span>
              </h3>
              <p className="text-xs text-slate-500">
                Sesuaikan skema pencahayaan dan palet identitas warna korporat.
              </p>

              {/* Mode toggle */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Mode Pencahayaan:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setThemeMode('light')}
                    className={`flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-bold transition cursor-pointer ${
                      themeMode === 'light'
                        ? 'border-slate-900 bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    ☀️ Light Mode (Default)
                  </button>
                  <button
                    type="button"
                    onClick={() => setThemeMode('dark')}
                    className={`flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-bold transition cursor-pointer ${
                      themeMode === 'dark'
                        ? 'border-slate-900 bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    🌙 Dark Mode
                  </button>
                </div>
              </div>

              {/* Preset Palettes */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Pilihan Palet Preset Korporat:
                </label>
                <div className="space-y-2">
                  {accentColorPresets.map(preset => {
                    const isSelected = themeSettings.accentColor === preset.id && !themeSettings.customPrimaryColor;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => updateThemeSettings({
                          accentColor: preset.id,
                          customPrimaryColor: undefined,
                          customAccentColor: undefined
                        })}
                        className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3 transition ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/40 dark:border-blue-700 dark:bg-blue-950/30'
                            : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/80'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center -space-x-1">
                            <span className={`h-5 w-5 rounded-full ${preset.primary} ring-2 ring-white`} />
                            <span className={`h-5 w-5 rounded-full ${preset.accent} ring-2 ring-white`} />
                          </div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {preset.name}
                          </span>
                        </div>
                        {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom Hex Color Pickers */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-700 dark:bg-slate-800/60 space-y-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  🎨 Kustomisasi Hex Warna Sendiri (Custom Hex):
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Warna Primer Utama:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeSettings.customPrimaryColor || '#0f172a'}
                        onChange={e => updateThemeSettings({ customPrimaryColor: e.target.value })}
                        className="h-8 w-10 cursor-pointer rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent p-0.5"
                      />
                      <input
                        type="text"
                        value={themeSettings.customPrimaryColor || '#0f172a'}
                        onChange={e => updateThemeSettings({ customPrimaryColor: e.target.value })}
                        className="w-24 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-mono dark:border-slate-700 dark:bg-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Warna Aksen Sekunder:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeSettings.customAccentColor || '#dc2626'}
                        onChange={e => updateThemeSettings({ customAccentColor: e.target.value })}
                        className="h-8 w-10 cursor-pointer rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent p-0.5"
                      />
                      <input
                        type="text"
                        value={themeSettings.customAccentColor || '#dc2626'}
                        onChange={e => updateThemeSettings({ customAccentColor: e.target.value })}
                        className="w-24 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-mono dark:border-slate-700 dark:bg-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {(themeSettings.customPrimaryColor || themeSettings.customAccentColor) && (
                  <button
                    type="button"
                    onClick={() => updateThemeSettings({
                      customPrimaryColor: undefined,
                      customAccentColor: undefined
                    })}
                    className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Kembali ke Palet Preset Bawaan
                  </button>
                )}
              </div>

              {/* 💬 Custom Chat Bubble Color */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-700 dark:bg-slate-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
                    <span>Warna Gelembung Chat (Bubble Pesan Terkirim):</span>
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">WhatsApp / Slack Style</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'red', name: 'Crimson Red', color: '#dc2626' },
                    { id: 'emerald', name: 'WhatsApp Green', color: '#059669' },
                    { id: 'blue', name: 'Corporate Blue', color: '#2563eb' },
                    { id: 'purple', name: 'Royal Violet', color: '#7c3aed' },
                    { id: 'navy', name: 'Deep Slate Navy', color: '#0f172a' },
                    { id: 'amber', name: 'Warm Amber', color: '#d97706' }
                  ].map(b => {
                    const isSelected = (!themeSettings.chatBubbleColor && b.id === 'red') || themeSettings.chatBubbleColor === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => updateThemeSettings({ chatBubbleColor: b.id as any, customChatBubbleColor: undefined })}
                        className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                          isSelected
                            ? 'border-blue-600 bg-white dark:bg-slate-900 shadow-2xs'
                            : 'border-slate-200 bg-white/70 hover:bg-white dark:border-slate-700 dark:bg-slate-900/60'
                        }`}
                      >
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: b.color }} />
                        <span className="text-slate-800 dark:text-slate-200">{b.name}</span>
                        {isSelected && <Check className="h-3 w-3 text-blue-600" />}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Hex Chat Bubble Picker */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/70 dark:border-slate-700/60">
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Atau Pilih Warna Hex Kustom:
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeSettings.customChatBubbleColor || '#dc2626'}
                      onChange={e => updateThemeSettings({ chatBubbleColor: 'custom', customChatBubbleColor: e.target.value })}
                      className="h-7 w-8 cursor-pointer rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent p-0.5"
                    />
                    <input
                      type="text"
                      value={themeSettings.customChatBubbleColor || (themeSettings.chatBubbleColor ? '' : '#dc2626')}
                      placeholder="#dc2626"
                      onChange={e => updateThemeSettings({ chatBubbleColor: 'custom', customChatBubbleColor: e.target.value })}
                      className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-xs font-mono dark:border-slate-700 dark:bg-slate-900"
                    />
                  </div>
                </div>

                {/* Mini Chat Bubble Preview */}
                <div className="rounded-xl bg-white p-3 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex justify-end">
                  <div className="chat-bubble-outgoing rounded-2xl rounded-tr-xs px-3.5 py-1.5 text-xs shadow-xs font-medium">
                    Halo tim, dokumen & storyboard video sudah selesai! ✓✓
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Ukuran Huruf, Bentuk UI (Radius) & Pilihan Background */}
            <div className="space-y-6">
              {/* 🔤 Kustomisasi Ukuran Font (Small - Normal - Large) */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Type className="h-4 w-4 text-emerald-600" />
                    <span>Ukuran Huruf Aplikasi (Font Size)</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    Live Scaling
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Sesuaikan ukuran keterbacaan font di seluruh antarmuka workspace: Ringkas (Small), Standar Proporsional (Normal), atau Nyaman Dibaca (Large).
                </p>

                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'small', label: 'Small', sample: 'Aa', desc: 'Ringkas & muat banyak info' },
                    { id: 'normal', label: 'Normal', sample: 'Aa', desc: 'Standar proporsional' },
                    { id: 'large', label: 'Large', sample: 'Aa', desc: 'Sangat jelas & nyaman dibaca' }
                  ].map(fs => {
                    const isSelected = (themeSettings.fontSize || 'normal') === fs.id;
                    return (
                      <button
                        key={fs.id}
                        type="button"
                        onClick={() => updateThemeSettings({ fontSize: fs.id as any })}
                        className={`flex flex-col items-center text-center p-3 rounded-2xl border transition cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/50 dark:border-emerald-500 dark:bg-emerald-950/30 ring-2 ring-emerald-500 font-bold'
                            : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40'
                        }`}
                      >
                        <span className={`font-black mb-1 text-slate-900 dark:text-white ${fs.id === 'small' ? 'text-xs' : fs.id === 'normal' ? 'text-sm' : 'text-base'}`}>
                          {fs.sample}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {fs.label}
                          </span>
                          {isSelected && <Check className="h-3 w-3 text-emerald-600" />}
                        </div>
                        <span className="text-[9px] text-slate-400 mt-0.5 line-clamp-1">{fs.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bentuk UI (Card Radius) */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-purple-600" />
                  <span>Bentuk Sudut UI (Card Corner Radius)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Ubah kelengkungan sudut kartu, tombol, dan panel di seluruh antarmuka aplikasi.
                </p>

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'sharp', label: 'Tegas / Sharp', radius: '8px', desc: 'Sudut ringkas 8px' },
                    { id: 'rounded', label: 'Standar / Rounded', radius: '16px', desc: 'Modern standar 16px' },
                    { id: 'smooth', label: 'Halus / Smooth', radius: '24px', desc: 'Melengkung halus 24px' },
                    { id: 'pill', label: 'Ekstra Bulat / Pill', radius: '36px', desc: 'Super rounded 36px' }
                  ].map(shape => {
                    const isSelected = (themeSettings.cardRadius || 'rounded') === shape.id;
                    return (
                      <button
                        key={shape.id}
                        type="button"
                        onClick={() => updateThemeSettings({ cardRadius: shape.id as any })}
                        className={`flex flex-col text-left p-3.5 border transition cursor-pointer ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 dark:border-blue-600 dark:bg-blue-950/30 ring-1 ring-blue-600'
                            : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40'
                        }`}
                        style={{ borderRadius: shape.radius }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {shape.label}
                          </span>
                          {isSelected && <Check className="h-3.5 w-3.5 text-blue-600" />}
                        </div>
                        <span className="text-[10px] text-slate-400">{shape.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Background Pattern Workspace */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>Pilihan Background Pola Workspace</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Pola latar belakang elegan yang diterapkan ke seluruh kanvas kerja aplikasi.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'clean', name: 'Polos & Bersih', desc: 'Tanpa pola (Minimalist standard)' },
                    { id: 'dots', name: 'Pola Matrix Titik', desc: 'Subtle dots bernuansa arsitektur' },
                    { id: 'grid', name: 'Kotak Geometris', desc: 'Precision grid teknik korporat' },
                    { id: 'mesh', name: 'Fluid Gradient Mesh', desc: 'Gradasi abstrak modern & lembut' },
                    { id: 'aurora', name: 'Aurora Dinamis', desc: 'Pendaran cahaya lembut di sudut' }
                  ].map(pattern => {
                    const isSelected = (themeSettings.bgPattern || 'clean') === pattern.id;
                    return (
                      <button
                        key={pattern.id}
                        type="button"
                        onClick={() => updateThemeSettings({ bgPattern: pattern.id as any })}
                        className={`flex flex-col text-left p-3 rounded-2xl border transition cursor-pointer ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 dark:border-blue-600 dark:bg-blue-950/30 ring-1 ring-blue-600'
                            : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {pattern.name}
                          </span>
                          {isSelected && <Check className="h-3.5 w-3.5 text-blue-600" />}
                        </div>
                        <span className="text-[10px] text-slate-400">{pattern.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Maintenance & Reset */}
              <div className="rounded-3xl border border-red-200 bg-red-50/50 p-5 dark:border-red-900/60 dark:bg-red-950/20 space-y-3">
                <h4 className="text-xs font-bold text-red-800 dark:text-red-300 flex items-center gap-1.5">
                  <RotateCcw className="h-4 w-4" />
                  Reset Semua Data ke Kondisi Awal
                </h4>
                <p className="text-[11px] text-red-700/80 dark:text-red-400">
                  Akan menghapus seluruh task, divisi baru, percakapan baru, dan pengaturan kustom, lalu memuat ulang seed database awal.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Apakah Anda yakin ingin mereset seluruh database aplikasi ke kondisi awal pabrik?')) {
                      resetAllData();
                    }
                  }}
                  className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition cursor-pointer"
                >
                  Reset Database Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Rekam Jejak Audit & Kepatuhan ISO 27001
              </h3>
              <p className="text-xs text-slate-500">
                Seluruh aksi krusial pengguna (perubahan task, role, dokumen, dan login) tercatat dengan aman.
              </p>
            </div>

            <input
              type="text"
              placeholder="Cari aksi audit..."
              value={auditSearch}
              onChange={e => setAuditSearch(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs focus:border-red-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800">
                <tr>
                  <th className="px-4 py-2.5">Waktu</th>
                  <th className="px-4 py-2.5">Pengguna</th>
                  <th className="px-4 py-2.5">Aksi</th>
                  <th className="px-4 py-2.5">Modul / Resource</th>
                  <th className="px-4 py-2.5">Rincian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-2.5 font-mono text-[11px] text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString('id-ID')}
                    </td>
                    <td className="px-4 py-2.5 font-semibold text-slate-900 dark:text-white">
                      {log.userName}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{log.resource}</td>
                    <td className="px-4 py-2.5 text-slate-500">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: METRICS */}
      {activeTab === 'metrics' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-500">Total Karyawan Terdaftar</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{users.length} User</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">100% Akun Aktif Terverifikasi</div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-500">Total Tugas Berjalan</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{tasks.length} Task</div>
            <div className="text-[11px] text-blue-600 font-semibold mt-1">{tasks.filter(t => t.status === 'done').length} Selesai</div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-500">Dokumen Resmi & SOP</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{documents.length} Berkas</div>
            <div className="text-[11px] text-slate-400 mt-1">Tersimpan di Cloud Storage Terenkripsi</div>
          </div>
        </div>
      )}
    </div>
  );
};
