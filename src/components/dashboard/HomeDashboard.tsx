import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  PlayCircle,
  Calendar,
  ArrowUpRight,
  Plus,
  Video,
  FileText,
  MessageSquare,
  Users,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckSquare,
  Upload,
  Play,
  Pause,
  Volume2,
  Heart,
  Smile,
  Compass,
  Zap,
  Flame,
  ThumbsUp,
  Award,
  Circle,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { ProductivityTrendsChart } from './ProductivityTrendsChart';
import { Task, Meeting } from '../../types';

export const HomeDashboard: React.FC = () => {
  const {
    currentUser,
    users,
    tasks,
    meetings,
    posts,
    channels,
    documents,
    setActiveTab,
    setQuickActionModal,
    moveTaskStatus,
    setActiveChannelId
  } = useWorkspace();

  // Weekly Date Strip Selector State (Matching image_ba761b4b.png)
  const [selectedDay, setSelectedDay] = useState<number>(16);

  // Quick Emoji reactions state (Matching image_f4a44cee.png)
  const [reactionsSent, setReactionsSent] = useState<Record<string, number>>({
    '😍': 14,
    '❤️': 28,
    '🔥': 35,
    '⚡': 19,
    '🤝': 22
  });

  const handleAddReaction = (emoji: string) => {
    setReactionsSent(prev => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1
    }));
  };

  // Task metrics
  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const reviewTasks = tasks.filter(t => t.status === 'review');
  const doneTasks = tasks.filter(t => t.status === 'done');
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((doneTasks.length / totalTasks) * 100) : 85;

  const urgentTasks = tasks.filter(t => t.priority === 'urgent' && t.status !== 'done');
  const upcomingMeetings = [...meetings]
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))
    .slice(0, 3);
  const featuredMeeting = upcomingMeetings[0] || meetings[0];

  const daysOfWeek = [
    { num: 15, day: 'Sen', isToday: false },
    { num: 16, day: 'Sel', isToday: true },
    { num: 17, day: 'Rab', isToday: false },
    { num: 18, day: 'Kam', isToday: false },
    { num: 19, day: 'Jum', isToday: false },
    { num: 20, day: 'Sab', isToday: false }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      {/* 1. TOP FRIENDLY GREETING HERO & TODAY'S PULSE (Matching image_41c2cc0b.png & image_ba761b4b.png) */}
      <div className="bento-card p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-white via-slate-50/60 to-blue-50/30 dark:from-slate-900 dark:via-slate-900/90 dark:to-indigo-950/20">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Greeting & Team Stack */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="chip-sky rounded-full px-3 py-1 text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="h-3.5 w-3.5" />
                <span>WORKSPACE Corporate Hub</span>
              </span>
              <span className="chip-emerald rounded-full px-2.5 py-0.5 text-[11px] font-bold inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Sistem Operasional Normal</span>
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
                Hi, {currentUser.name.split(' ')[0]}! 👋
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                Semangat produktif! Ada <span className="font-bold text-slate-900 dark:text-white">{inProgressTasks.length} tugas aktif</span> dan <span className="font-bold text-slate-900 dark:text-white">{upcomingMeetings.length} agenda meeting</span> yang siap Anda kawal hari ini.
              </p>
            </div>

            {/* Team Members Overlapping Avatars (Matching image_41c2cc0b.png & image_ba761b4b.png) */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Tim Kolaborasi:
              </span>
              <div className="flex items-center -space-x-2">
                {users.slice(0, 5).map((u, i) => (
                  <img
                    key={u.id}
                    src={u.avatar}
                    alt={u.name}
                    title={`${u.name} - ${u.position}`}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-white dark:ring-slate-900 shadow-2xs transition-transform hover:scale-110 hover:z-20 cursor-pointer"
                  />
                ))}
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 ring-2 ring-white dark:ring-slate-900 shadow-2xs">
                  +{users.length - 5}
                </div>
              </div>
            </div>
          </div>

          {/* Right Productivity Percentage & Quick Action Chips (Matching image_41c2cc0b.png & image_00e3de8a.png) */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 shrink-0">
            {/* Big 85% / 88% Today's Productivity Badge */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tighter">
                {completionRate}%
              </span>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div>Produktivitas</div>
                <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                  <ArrowUpRight className="h-3 w-3" /> +12% vs minggu lalu
                </div>
              </div>
            </div>

            {/* Friendly Action Pills System (Matching image_00e3de8a.png) */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Ask AI Gradient Button */}
              <button
                onClick={() => {
                  alert('Fitur AI Copilot siap membantu merangkum meeting, tugas, dan SOP!');
                }}
                className="btn-gradient-ai rounded-2xl px-4 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Tanya AI</span>
              </button>

              {/* New Task Pill */}
              <button
                onClick={() => setQuickActionModal('task')}
                className="rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 text-red-600" />
                <span>Tugas Baru</span>
              </button>

              {/* Upload SOP Document Pill (Dashed border like image_00e3de8a.png) */}
              <button
                onClick={() => setQuickActionModal('document')}
                className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 hover:bg-slate-100 dark:hover:bg-slate-750 px-3.5 py-2 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-700/60 transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5 text-slate-500" />
                <span>Upload Dokumen</span>
              </button>
            </div>
          </div>
        </div>

        {/* Ambient decorative glow */}
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 -top-10 h-32 w-32 rounded-full bg-red-400/10 blur-2xl" />
      </div>

      {/* 2. BENTO GRID SECTION (Structured strictly around image_ba761b4b.png & image_41c2cc0b.png) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* BENTO TILE 1: FEATURED VIDEO CALL / TEAM MEETING (Matching image_ba761b4b.png center tile & image_41c2cc0b.png) */}
        <div className="bento-card p-6 flex flex-col justify-between relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="chip-emerald rounded-full px-3 py-1 text-xs font-bold inline-flex items-center gap-1.5">
                <Video className="h-3.5 w-3.5" />
                <span>Meeting Aktif Hari Ini</span>
              </span>
              <span className="chip-purple rounded-full px-2.5 py-0.5 text-[11px] font-bold">
                {featuredMeeting?.startTime} — {featuredMeeting?.endTime}
              </span>
            </div>

            {/* Circular Ring Avatars Centerpiece (Matching image_ba761b4b.png center call widget) */}
            <div className="my-5 flex items-center justify-center -space-x-3">
              <div className="h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-950/60 p-1 ring-4 ring-white dark:ring-slate-900 shadow-md flex items-center justify-center">
                <img
                  src={users[1]?.avatar || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80'}
                  alt="Nadia"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div className="h-20 w-20 rounded-full bg-indigo-100 dark:bg-indigo-950/60 p-1 ring-4 ring-white dark:ring-slate-900 shadow-lg flex items-center justify-center z-10 relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-full w-full rounded-full object-cover"
                />
                <span className="absolute bottom-0 right-1 h-5 w-5 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center">
                  <Video className="h-3 w-3 text-white" />
                </span>
              </div>
              <div className="h-16 w-16 rounded-full bg-sky-100 dark:bg-sky-950/60 p-1 ring-4 ring-white dark:ring-slate-900 shadow-md flex items-center justify-center">
                <img
                  src={users[2]?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80'}
                  alt="Budi"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {featuredMeeting?.title || 'Townhall Triwulan IV & Tech Review'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {featuredMeeting?.description || 'Koordinasi strategis pencapaian target enterprise dan roadmap teknologi.'}
              </p>
            </div>

            {/* Friendly metadata chips (Matching image_c1621e9d.png) */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs">
              <span className="chip-sky rounded-xl px-2.5 py-1 text-[11px] font-semibold flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{featuredMeeting?.date || 'Hari ini'}</span>
              </span>
              <span className="chip-orange rounded-xl px-2.5 py-1 text-[11px] font-semibold flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{featuredMeeting?.location?.split('/')[0] || 'Ruang Alpha'}</span>
              </span>
              <span className="chip-rose rounded-xl px-2.5 py-1 text-[11px] font-semibold flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{featuredMeeting?.attendees?.length || 4} Peserta</span>
              </span>
            </div>
          </div>

          {/* Join Call Pill Button (Bright Green like image_ba761b4b.png) */}
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <a
              href={featuredMeeting?.meetLink || 'https://meet.google.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-700 transition active:scale-95"
            >
              <Video className="h-4 w-4" />
              <span>Gabung Sekarang (Join Call)</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-80" />
            </a>
          </div>
        </div>

        {/* BENTO TILE 2: TODAY'S TASKS & QUICK CHECKPOINTS (Matching image_ba761b4b.png & image_41c2cc0b.png) */}
        <div className="bento-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="chip-orange rounded-full px-3 py-1 text-xs font-bold inline-flex items-center gap-1.5">
                  <CheckSquare className="h-3.5 w-3.5" />
                  <span>Tugas Prioritas Hari Ini</span>
                </span>
              </div>
              <button
                onClick={() => setActiveTab('tasks')}
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-0.5"
              >
                <span>Lihat Kanban</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-3 mt-4">
              {tasks.slice(0, 3).map(task => {
                const isUrgent = task.priority === 'urgent';
                const isDone = task.status === 'done';

                return (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/80 transition space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              isUrgent ? 'chip-rose' : task.priority === 'high' ? 'chip-orange' : 'chip-sky'
                            }`}
                          >
                            {task.priority.toUpperCase()}
                          </span>
                          <span className="chip-purple rounded-full px-2 py-0.5 text-[10px] font-semibold">
                            {task.project.split(' ')[0]}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5 truncate">
                          {task.title}
                        </h4>
                      </div>

                      <button
                        onClick={() => moveTaskStatus(task.id, isDone ? 'in_progress' : 'done')}
                        title={isDone ? 'Buka kembali' : 'Tandai selesai'}
                        className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 transition ${
                          isDone
                            ? 'bg-emerald-500 text-white'
                            : 'border-2 border-slate-300 dark:border-slate-600 text-transparent hover:border-emerald-500 hover:text-emerald-500'
                        }`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Deadline: {task.deadline}</span>
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {task.checklists.filter(c => c.completed).length}/{task.checklists.length} Checklist
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setQuickActionModal('task')}
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 text-red-600" />
            <span>Tambah Item Tugas Baru</span>
          </button>
        </div>

        {/* BENTO TILE 3: TEAM STREAM & SOCIAL DISCUSSION (Matching image_f4a44cee.png) */}
        <div className="bento-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="chip-purple rounded-full px-3 py-1 text-xs font-bold inline-flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Pesan & Diskusi Tim</span>
              </span>
              <button
                onClick={() => setActiveTab('feed')}
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-0.5"
              >
                <span>Buka Feed</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Latest Announcement Message Snippet (Matching image_f4a44cee.png post style) */}
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4 space-y-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={users[0]?.avatar}
                  alt="Saeful Rohman"
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-red-500/20"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{users[0]?.name}</span>
                    <span className="rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 px-1 text-[9px] font-extrabold">
                      BoD
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Hari ini, 09:15 • saeful.rohman@asliri.id
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                "Pembaruan infrastruktur microservices dan audit ISO 27001 tahap akhir telah mencapai 94%. Terima kasih rekan-rekan atas dedikasinya!"
              </p>

              {/* Interactive Emoji Reaction Bar (Matching image_f4a44cee.png) */}
              <div className="flex items-center gap-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex-wrap">
                {['😍', '❤️', '🔥', '⚡', '🤝'].map(emo => (
                  <button
                    key={emo}
                    type="button"
                    onClick={() => handleAddReaction(emo)}
                    className="flex items-center gap-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 px-2 py-1 text-xs hover:scale-105 active:scale-95 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer shadow-2xs"
                  >
                    <span>{emo}</span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      {reactionsSent[emo] || 10}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Unread Chats Banner (Matching image_f4a44cee.png "27 New Messages") */}
            <div
              onClick={() => {
                setActiveTab('chat');
                setActiveChannelId('chn_tech');
              }}
              className="mt-3.5 p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/70 dark:from-slate-800 dark:to-indigo-950/40 border border-blue-100 dark:border-slate-700 flex items-center justify-between cursor-pointer group hover:border-blue-300 dark:hover:border-slate-600 transition"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs">
                  #tech
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    #tech-engineering
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Cluster staging sudah ter-update...
                  </div>
                </div>
              </div>
              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                2 Baru
              </span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('chat')}
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-2.5 text-xs font-bold hover:bg-black dark:hover:bg-slate-200 transition cursor-pointer"
          >
            <MessageSquare className="h-3.5 w-3.5 text-red-500" />
            <span>Buka Obrolan Tim</span>
          </button>
        </div>
      </div>

      {/* 3. MIDDLE BENTO ROW: WEEKLY CALENDAR STRIP & RECHARTS TRENDS (Matching image_ba761b4b.png & image_ee316a31.png) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left Column (2 Cols): Productivity Trends Interactive Chart */}
        <div className="lg:col-span-2 bento-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <span className="chip-sky rounded-full px-3 py-1 text-xs font-bold inline-flex items-center gap-1.5 mb-1.5">
                <Award className="h-3.5 w-3.5" />
                <span>Analisis Produktivitas & KPI</span>
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Tren Beban Kerja & Tingkat Keberhasilan
              </h3>
            </div>

            {/* Weekly Days Strip (Matching image_ba761b4b.png "Week Days 15, 16, 17, 18, 19, 20") */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl">
              {daysOfWeek.map(d => {
                const isSelected = selectedDay === d.num;
                return (
                  <button
                    key={d.num}
                    type="button"
                    onClick={() => setSelectedDay(d.num)}
                    className={`flex flex-col items-center justify-center w-9 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="text-[9px] font-medium opacity-80">{d.day}</span>
                    <span>{d.num}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <ProductivityTrendsChart />
        </div>

        {/* Right Column: Friendly Habits, Wellness & Mini Lofi Player (Matching image_ba761b4b.png & image_ee316a31.png) */}
        <div className="bento-card p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="chip-orange rounded-full px-3 py-1 text-xs font-bold inline-flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5" />
                <span>Wellness & Kebiasaan Kerja Sehat</span>
              </span>
            </div>

            {/* Habits Grid 2x2 (Directly from image_ba761b4b.png: Bedtime, Daily Yoga, Tennis/Focus) */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-sky-50/80 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 text-white mb-2 shadow-2xs">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  Focus Deep Work
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  45 Min Sesi Pagi
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500 text-white mb-2 shadow-2xs">
                  <Heart className="h-4 w-4" />
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  Peregangan / Yoga
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  15 Min Siang
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white mb-2 shadow-2xs">
                  <Zap className="h-4 w-4" />
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  Wellness Leave
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  1 Hari Aktif Q4
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-white mb-2 shadow-2xs">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  Hidrasi Harian
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  2.2 Liter Tercapai
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 text-center text-[11px] text-slate-400 font-medium">
            Program Kesejahteraan Staf ASLI GROUP 🌿
          </div>
        </div>
      </div>

      {/* 4. BOTTOM BENTO ROW: QUICK SOP DOCUMENTS & KNOWLEDGE CENTER */}
      <div className="bento-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="chip-sky rounded-full px-3 py-1 text-xs font-bold inline-flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              <span>Dokumen Panduan & SOP Resmi</span>
            </span>
          </div>
          <button
            onClick={() => setActiveTab('documents')}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-0.5"
          >
            <span>Buka Document Center ({documents.length})</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {documents.slice(0, 3).map(doc => (
            <div
              key={doc.id}
              className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/80 transition flex items-start gap-3 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300 shrink-0 font-bold text-xs uppercase shadow-2xs">
                {doc.fileType}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-red-600 transition">
                  {doc.title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                  <span>{doc.fileSize}</span>
                  <span>•</span>
                  <span>{doc.downloadsCount} diunduh</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
