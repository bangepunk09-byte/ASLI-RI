import React, { useState } from 'react';
import {
  X,
  CheckSquare,
  Plus,
  Clapperboard,
  Film,
  Video,
  Image as ImageIcon,
  Link as LinkIcon,
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { TaskPriority, TaskStatus, VideoDraftScene } from '../../types';

export const CreateTaskModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { currentUser, users, createTask, divisions, selectedTaskGroup } = useWorkspace();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState('Campaign Creative & Video');
  const [divisionId, setDivisionId] = useState<string>(() => {
    if (selectedTaskGroup && selectedTaskGroup !== 'all') return selectedTaskGroup;
    return divisions[0]?.id || 'tech';
  });
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('not_started');
  const [assigneeId, setAssigneeId] = useState(currentUser.id);
  const [deadline, setDeadline] = useState('2026-11-12');
  const [labelsInput, setLabelsInput] = useState('Video Production, Creative, Content');
  const [checklists, setChecklists] = useState(['Draft naskah & storyboard', 'Review internal tim creative', 'Shooting & editing']);

  // Video Draft Scene Breakdown state
  const [isVideoMode, setIsVideoMode] = useState(true);
  const [videoScenes, setVideoScenes] = useState<VideoDraftScene[]>([
    {
      id: 'sc_1',
      sceneNumber: 1,
      title: 'Scene 1: Hook Pembuka (00:00 - 00:03)',
      visualDirection: 'Talent menatap smartphone dengan ekspresi bingung, push-in shot cepat ke layar yang penuh notifikasi berantakan.',
      audioScript: 'VO: "Pernah ga sih kerjaan kantor numpuk tapi gak tau mana yang harus selesai duluan?"',
      durationText: '00:03',
      referenceImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60',
      googleLinks: [
        { type: 'drive', title: 'Asset Folder Google Drive', url: 'https://drive.google.com' },
        { type: 'docs', title: 'Naskah Lengkap Google Docs', url: 'https://docs.google.com' }
      ]
    },
    {
      id: 'sc_2',
      sceneNumber: 2,
      title: 'Scene 2: Agitasi Masalah (00:03 - 00:08)',
      visualDirection: 'Cut to montase meja kantor berantakan, chat grup WA spamming pertanyaan status task.',
      audioScript: 'VO: "Grup WA kantor berisik, file approval nyangkut, deadline terlewat."',
      durationText: '00:05',
      referenceImageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=60',
      googleLinks: []
    },
    {
      id: 'sc_3',
      sceneNumber: 3,
      title: 'Scene 3: Solusi WORKSPACE Board (00:08 - 00:15)',
      visualDirection: 'Transisi swipe modern ke tampilan WORKSPACE: 4-stage Pastel Board, timeline Gantt, dan live huddle.',
      audioScript: 'VO: "Kenalin Workspace OS. Satu platform untuk task per divisi, approval manajer 1-klik, dan video huddle langsung."',
      durationText: '00:07',
      referenceImageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60',
      googleLinks: [
        { type: 'youtube', title: 'Referensi Motion Graphic YT', url: 'https://youtube.com' }
      ]
    }
  ]);

  const handleAddChecklist = () => {
    setChecklists([...checklists, '']);
  };

  const handleChecklistChange = (idx: number, val: string) => {
    const updated = [...checklists];
    updated[idx] = val;
    setChecklists(updated);
  };

  // Video Scene Handlers
  const handleAddScene = () => {
    const nextNum = videoScenes.length + 1;
    const newScene: VideoDraftScene = {
      id: 'sc_' + Date.now(),
      sceneNumber: nextNum,
      title: `Scene ${nextNum}: Scene Tambahan (${nextNum <= 7 ? `00:${(nextNum * 3).toString().padStart(2, '0')}` : '00:30'})`,
      visualDirection: '',
      audioScript: '',
      durationText: '00:04',
      googleLinks: []
    };
    setVideoScenes([...videoScenes, newScene]);
  };

  const handleRemoveScene = (id: string) => {
    const filtered = videoScenes.filter(s => s.id !== id);
    const reindexed = filtered.map((s, idx) => ({
      ...s,
      sceneNumber: idx + 1,
      title: s.title.startsWith('Scene ') ? `Scene ${idx + 1}: ${s.title.split(': ').slice(1).join(': ') || ''}` : s.title
    }));
    setVideoScenes(reindexed);
  };

  const handleSceneFieldChange = (id: string, field: keyof VideoDraftScene, val: any) => {
    setVideoScenes(prev =>
      prev.map(s => (s.id === id ? { ...s, [field]: val } : s))
    );
  };

  const handleAddGoogleLink = (sceneId: string) => {
    const titlePrompt = window.prompt('Masukkan nama link (cth: Google Drive Assets, Script Docs):', 'Google Drive Asset');
    if (!titlePrompt) return;
    const urlPrompt = window.prompt('Masukkan URL link (Google Drive / Docs / Sheets / YouTube):', 'https://drive.google.com');
    if (!urlPrompt) return;

    let type: 'drive' | 'docs' | 'sheets' | 'youtube' | 'other' = 'other';
    const lower = urlPrompt.toLowerCase();
    if (lower.includes('drive.google')) type = 'drive';
    else if (lower.includes('docs.google')) type = 'docs';
    else if (lower.includes('sheets.google')) type = 'sheets';
    else if (lower.includes('youtube') || lower.includes('youtu.be')) type = 'youtube';

    setVideoScenes(prev =>
      prev.map(s => {
        if (s.id !== sceneId) return s;
        const currentLinks = s.googleLinks || [];
        return {
          ...s,
          googleLinks: [...currentLinks, { type, title: titlePrompt, url: urlPrompt }]
        };
      })
    );
  };

  // Quick 7-Scene Short-Form Template
  const load7SceneTemplate = () => {
    const template: VideoDraftScene[] = [
      {
        id: 'sc_t1',
        sceneNumber: 1,
        title: 'Scene 1: Hook Pembuka 3 Detik',
        visualDirection: 'Talent menatap kamera heran sambil menunjukkan kalender kerja berantakan. Teks overlay besar "STOP PAKAI CARA LAMA".',
        audioScript: 'VO: "Kamu masih rekap deadline kerjaan kantor manual di spreadsheet?"',
        durationText: '00:03',
        referenceImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60',
        googleLinks: [{ type: 'docs', title: 'Script Draft Docs', url: 'https://docs.google.com' }]
      },
      {
        id: 'sc_t2',
        sceneNumber: 2,
        title: 'Scene 2: Problem & Frustrasi',
        visualDirection: 'Talent mengetik panik, transisi cut cepat notifikasi chat bertubi-tubi.',
        audioScript: 'VO: "File terselip, revisi gak kecatat, manajer nanyain terus."',
        durationText: '00:04',
        referenceImageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=60',
        googleLinks: []
      },
      {
        id: 'sc_t3',
        sceneNumber: 3,
        title: 'Scene 3: Introduksi Solusi Baru',
        visualDirection: 'Tampilan clean UI Workspace OS. Talent tersenyum lega.',
        audioScript: 'VO: "Sekarang semua divisi perusahaan sudah pakai satu operating system."',
        durationText: '00:05',
        referenceImageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60',
        googleLinks: [{ type: 'drive', title: 'Raw Video Footage Drive', url: 'https://drive.google.com' }]
      },
      {
        id: 'sc_t4',
        sceneNumber: 4,
        title: 'Scene 4: Fitur Board Per Divisi',
        visualDirection: 'Animasi cursor menggeser kartu Kanban dari On Progress ke On Review.',
        audioScript: 'VO: "Akses tiap divisi aman terisolasi, Not Started sampai Done transparan."',
        durationText: '00:05',
        referenceImageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&auto=format&fit=crop&q=60',
        googleLinks: []
      },
      {
        id: 'sc_t5',
        sceneNumber: 5,
        title: 'Scene 5: 1-Klik Kirim Approval ke Manajer',
        visualDirection: 'Cursor mengklik "Kirim ke Grup Approval", manajer klik Setujui langsung berubah hijau Selesai.',
        audioScript: 'VO: "Kirim kartu ke grup untuk persetujuan manajer. Sekali approve, otomatis Done!"',
        durationText: '00:05',
        referenceImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60',
        googleLinks: [{ type: 'sheets', title: 'Content Matrix Sheets', url: 'https://sheets.google.com' }]
      },
      {
        id: 'sc_t6',
        sceneNumber: 6,
        title: 'Scene 6: Live Huddle Voice & Video',
        visualDirection: 'Tampilan Huddle call aktif di pojok bawah, audio waves bergetar dinamis.',
        audioScript: 'VO: "Perlu quick sync? Langsung nyalakan Huddle call tanpa ganti aplikasi."',
        durationText: '00:05',
        referenceImageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&auto=format&fit=crop&q=60',
        googleLinks: []
      },
      {
        id: 'sc_t7',
        sceneNumber: 7,
        title: 'Scene 7: CTA (Call to Action) & Penutup',
        visualDirection: 'Logo Workspace OS muncul di tengah dengan tombol "Coba Gratis Sekarang". Sound effect swoosh.',
        audioScript: 'VO: "Tingkatkan produktivitas tim kamu hari ini. Cek link di bio!"',
        durationText: '00:03',
        referenceImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=60',
        googleLinks: [{ type: 'youtube', title: 'B-Roll & Audio Reference', url: 'https://youtube.com' }]
      }
    ];
    setVideoScenes(template);
    setTitle('Produksi Video: 7-Scene Short-Form Campaign Reels/TikTok');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const assignee = users.find(u => u.id === assigneeId) || currentUser;
    const targetDivision = divisions.find(d => d.id === divisionId) || divisions[0];

    createTask({
      title,
      description,
      project,
      status,
      priority,
      assigneeId: assignee.id,
      assigneeName: assignee.name,
      assigneeAvatar: assignee.avatar,
      assigneeDept: targetDivision?.departmentMatch || assignee.department,
      groupId: targetDivision?.id || 'tech',
      groupName: targetDivision?.name || 'Technology & Engineering',
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      deadline,
      labels: labelsInput.split(',').map(l => l.trim()).filter(Boolean),
      checklists: checklists
        .filter(c => c.trim().length > 0)
        .map((text, idx) => ({
          id: 'chk_' + Date.now() + '_' + idx,
          text,
          completed: false
        })),
      videoDraftScenes: isVideoMode && videoScenes.length > 0 ? videoScenes : undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-5 sm:p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-red-600 text-white shadow-xs">
              <CheckSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Buat Tugas Baru & Storyboard Video
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Lengkapi detail pekerjaan, deadline, tim pelaksana, serta draft scene video
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Judul Tugas / Campaign *
            </label>
            <input
              type="text"
              placeholder="contoh: Produksi Video Ads Reels Scene 1-7 & Review Manajer"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 focus:border-red-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-2xs"
            />
          </div>

          {/* Project & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Workspace / Proyek
              </label>
              <input
                type="text"
                value={project}
                onChange={e => setProject(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold focus:border-red-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-2xs"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Tenggat Waktu (Deadline)
              </label>
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold focus:border-red-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-2xs"
              />
            </div>
          </div>

          {/* Division / Department Selection */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Divisi / Tim Pelaksana *
            </label>
            <select
              value={divisionId}
              onChange={e => setDivisionId(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold focus:border-red-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-2xs cursor-pointer"
            >
              {divisions.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.leadName})
                </option>
              ))}
            </select>
          </div>

          {/* Assignee, Priority, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Penanggung Jawab (Assignee)
              </label>
              <select
                value={assigneeId}
                onChange={e => setAssigneeId(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold focus:border-red-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-2xs cursor-pointer"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Prioritas
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TaskPriority)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold focus:border-red-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-2xs cursor-pointer"
              >
                <option value="urgent">Urgent (Tinggi Sekali)</option>
                <option value="high">High (Tinggi)</option>
                <option value="medium">Medium (Sedang)</option>
                <option value="low">Low (Rendah)</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Tahap Flow (Default: Not started)
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as TaskStatus)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold focus:border-red-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-2xs cursor-pointer"
              >
                <option value="not_started">Not started</option>
                <option value="on_progress">On Progress</option>
                <option value="on_review">On Review</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Deskripsi Scope Pekerjaan
            </label>
            <textarea
              placeholder="Tuliskan tujuan campaign, target audiens, dan ekspektasi output..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium focus:border-red-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-2xs"
            />
          </div>

          {/* 🎬 VIDEO DRAFT & SCENE BREAKDOWN (SCENE 1-7) FEATURE */}
          <div className="rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-slate-50 p-4 dark:border-indigo-900/60 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-slate-900 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-indigo-100 pb-3 dark:border-indigo-900/60">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                  <Clapperboard className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    Fitur Video Draft & Scene Breakdown (Scene 1-7+)
                    <span className="rounded-md bg-indigo-100 px-1.5 py-0.5 text-[9px] font-extrabold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
                      {videoScenes.length} Scene
                    </span>
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Breakdown visual, naskah audio/script, durasi, attach gambar & link Google
                  </p>
                </div>
              </div>

              {/* Quick Template & Action Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={load7SceneTemplate}
                  className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-indigo-700 transition cursor-pointer"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Template 7-Scene TikTok/Reels</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddScene}
                  className="inline-flex items-center gap-1 rounded-xl border border-indigo-300 bg-white px-2.5 py-1 text-[11px] font-bold text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:bg-slate-800 dark:text-indigo-300 dark:hover:bg-slate-700 shadow-2xs transition cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                  <span>Scene {videoScenes.length + 1}</span>
                </button>
              </div>
            </div>

            {/* Scenes Cards List */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {videoScenes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-indigo-200 p-4 text-center text-slate-400 text-xs">
                  Belum ada scene. Klik tombol "+ Scene" atau muat template 7-scene di atas.
                </div>
              ) : (
                videoScenes.map((scene, idx) => (
                  <div
                    key={scene.id}
                    className="rounded-2xl border border-indigo-100/90 bg-white p-3.5 shadow-xs dark:border-indigo-900/50 dark:bg-slate-900 space-y-2.5"
                  >
                    {/* Scene Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-[10px] font-black">
                          {scene.sceneNumber}
                        </span>
                        <input
                          type="text"
                          value={scene.title}
                          onChange={e => handleSceneFieldChange(scene.id, 'title', e.target.value)}
                          placeholder={`Scene ${scene.sceneNumber} Title...`}
                          className="font-bold text-xs text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none px-1"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-slate-400 font-semibold">Durasi:</span>
                          <input
                            type="text"
                            value={scene.durationText || '00:03'}
                            onChange={e => handleSceneFieldChange(scene.id, 'durationText', e.target.value)}
                            className="w-14 rounded-lg border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] font-mono text-center font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveScene(scene.id)}
                          className="text-slate-400 hover:text-red-600 transition p-1"
                          title="Hapus Scene"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Visual & Audio fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 block mb-0.5">
                          📹 Arahan Visual & Shot
                        </label>
                        <textarea
                          rows={2}
                          value={scene.visualDirection}
                          onChange={e => handleSceneFieldChange(scene.id, 'visualDirection', e.target.value)}
                          placeholder="Contoh: Talent close-up ekspresi bingung, kamera push-in cepat..."
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2 text-[11px] focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">
                          🎙️ Naskah Voiceover / Audio Script
                        </label>
                        <textarea
                          rows={2}
                          value={scene.audioScript}
                          onChange={e => handleSceneFieldChange(scene.id, 'audioScript', e.target.value)}
                          placeholder="Contoh: VO: 'Pernah ga sih ngerasa kerjaan kantor berantakan...'"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2 text-[11px] focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200"
                        />
                      </div>
                    </div>

                    {/* Image Reference URL & Google Links */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center gap-2 flex-1">
                        <ImageIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <input
                          type="url"
                          placeholder="URL gambar referensi (Unsplash / Drive image link)..."
                          value={scene.referenceImageUrl || ''}
                          onChange={e => handleSceneFieldChange(scene.id, 'referenceImageUrl', e.target.value)}
                          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] text-slate-700 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        />
                      </div>

                      {/* Google links chips & add button */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {(scene.googleLinks || []).map((link, lIdx) => (
                          <a
                            key={lIdx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:text-indigo-300"
                          >
                            <LinkIcon className="h-2.5 w-2.5" />
                            <span className="truncate max-w-[90px]">{link.title}</span>
                          </a>
                        ))}
                        <button
                          type="button"
                          onClick={() => handleAddGoogleLink(scene.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-dashed border-slate-300 px-2 py-0.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400"
                        >
                          <Plus className="h-2.5 w-2.5" />
                          <span>Link Google</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Subtask Checklists */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Checklist / Tahapan Eksekusi
              </label>
              <button
                type="button"
                onClick={handleAddChecklist}
                className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
              >
                Tambah Item
              </button>
            </div>
            <div className="space-y-1.5">
              {checklists.map((c, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`Subtask ${i + 1}`}
                  value={c}
                  onChange={e => handleChecklistChange(i, e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs focus:border-red-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-2xs"
                />
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition cursor-pointer"
            >
              Simpan Tugas & Storyboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
