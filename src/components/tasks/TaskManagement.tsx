import React, { useState } from 'react';
import {
  Kanban,
  List,
  Calendar as CalendarIcon,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Check,
  Clock,
  AlertCircle,
  MoreVertical,
  CheckSquare,
  MessageSquare,
  Paperclip,
  User,
  ChevronDown,
  Layers,
  ArrowUpDown,
  Trash2,
  X,
  Flag,
  FileBarChart,
  ShieldAlert,
  Send,
  AlertTriangle,
  FileText,
  Building2,
  Lock,
  Sparkles,
  Printer,
  CalendarDays,
  Clapperboard,
  Film,
  Video,
  ThumbsUp,
  ThumbsDown,
  Image as ImageIcon,
  Mail,
  Archive,
  RotateCcw
} from 'lucide-react';
import { GanttChartTimeline } from './GanttChartTimeline';
import { TaskProductivityChart } from './TaskProductivityChart';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Task, TaskStatus, TaskPriority, TaskCheckpoint, TaskReportItem, VideoDraftScene, TaskApproval } from '../../types';

// Group / Division Definitions
interface GroupMeta {
  id: string;
  name: string;
  departmentMatch: string;
  color: string;
}

const TASK_GROUPS: GroupMeta[] = [
  { id: 'tech', name: 'Technology & Engineering', departmentMatch: 'Technology & Engineering', color: 'bg-blue-600' },
  { id: 'product', name: 'Product & Design', departmentMatch: 'Product & Design', color: 'bg-purple-600' },
  { id: 'hr', name: 'People Operations & HR', departmentMatch: 'People Operations & Culture', color: 'bg-emerald-600' },
  { id: 'marketing', name: 'Marketing & Brand', departmentMatch: 'Marketing & Brand', color: 'bg-amber-600' },
  { id: 'finance', name: 'Finance & Legal', departmentMatch: 'Finance & Legal', color: 'bg-rose-600' }
];

export const TaskManagement: React.FC = () => {
  const {
    currentUser,
    users,
    tasks,
    divisions,
    selectedTaskGroup,
    setSelectedTaskGroup,
    moveTaskStatus,
    setQuickActionModal,
    deleteTask,
    toggleChecklistItem,
    toggleTaskCheckpoint,
    addTaskCheckpoint,
    addTaskReport,
    sendTaskForApproval,
    processTaskApproval,
    updateTaskVideoDraft,
    channels,
    addAuditLog,
    archiveTask,
    unarchiveTask
  } = useWorkspace();

  const isSuperAdmin = currentUser.role === 'super_admin';

  // Determine user's home group ID based on their department
  const userHomeGroup = TASK_GROUPS.find(g =>
    currentUser.department.toLowerCase().includes(g.departmentMatch.toLowerCase()) ||
    g.departmentMatch.toLowerCase().includes(currentUser.department.toLowerCase())
  ) || TASK_GROUPS[0];

  // Active group: Non-super admins are strictly locked to their division
  const activeGroupId = isSuperAdmin ? (selectedTaskGroup || 'all') : userHomeGroup.id;

  // Access check: Super admin can access anything. Others can only access their home division.
  const hasAccessToCurrentGroup = isSuperAdmin || activeGroupId === userHomeGroup.id;

  // DEFAULT VIEW MODE IS NOW EXPLICITLY 'kanban' (BOARD)
  const [viewMode, setViewMode] = useState<'overview' | 'kanban' | 'timeline' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showArchivedModal, setShowArchivedModal] = useState(false);

  // Approval modal state: for sending task to channel/group for manager approval
  const [approvalModalTask, setApprovalModalTask] = useState<Task | null>(null);
  const [approvalCustomMessage, setApprovalCustomMessage] = useState('');
  const [approvalChannelId, setApprovalChannelId] = useState<string>('chn_general');
  const [approvalManagerIds, setApprovalManagerIds] = useState<string[]>([]);

  const openApprovalModal = (task: Task) => {
    setApprovalModalTask(task);
    setApprovalCustomMessage(`Mohon review dan persetujuan untuk tugas: "${task.title}"`);
  };

  // Mini Report Modal state & Email Dispatch
  const [showReportModal, setShowReportModal] = useState(false);
  const [showProductivityTrend, setShowProductivityTrend] = useState(true);

  // Email report dispatch state
  const managersList = users.filter(u => u.role === 'manager' || u.role === 'super_admin' || u.role === 'admin');
  const [reportTargetManagerEmail, setReportTargetManagerEmail] = useState('');
  const [reportCcList, setReportCcList] = useState<string[]>(['executive@asliri.id']);
  const [reportCcInput, setReportCcInput] = useState('');
  const [reportMemo, setReportMemo] = useState('');
  const [isSendingReportEmail, setIsSendingReportEmail] = useState(false);
  const [reportEmailSentSuccess, setReportEmailSentSuccess] = useState(false);

  const handleAddCc = () => {
    if (!reportCcInput.trim()) return;
    const clean = reportCcInput.trim().toLowerCase();
    if (!reportCcList.includes(clean)) {
      setReportCcList(prev => [...prev, clean]);
    }
    setReportCcInput('');
  };

  const handleRemoveCc = (item: string) => {
    setReportCcList(prev => prev.filter(c => c !== item));
  };

  const handleSendReportEmail = () => {
    const finalManager = reportTargetManagerEmail || (managersList[0]?.email || 'manager@asliri.id');
    setIsSendingReportEmail(true);
    setTimeout(() => {
      setIsSendingReportEmail(false);
      setReportEmailSentSuccess(true);
      addAuditLog(
        'REPORT_DISPATCH_EMAIL',
        'Executive Report',
        `Ringkasan eksekutif sprint berhasil dikirim ke Manajer: ${finalManager} (CC: ${reportCcList.join(', ') || 'None'})`
      );
      setTimeout(() => setReportEmailSentSuccess(false), 4500);
    }, 700);
  };

  // New Checkpoint form inside task modal
  const [newCheckpointTitle, setNewCheckpointTitle] = useState('');
  const [newCheckpointDate, setNewCheckpointDate] = useState('');

  // New Progress Report / Note form inside task modal
  const [reportType, setReportType] = useState<'progress_update' | 'blocker' | 'note'>('progress_update');
  const [reportContent, setReportContent] = useState('');

  // Drag and Drop state
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColId, setDragOverColId] = useState<string | null>(null);

  // Filter tasks based on group
  const groupFilteredTasks = tasks.filter(t => {
    if (activeGroupId === 'all') return true;
    return t.groupId === activeGroupId || t.assigneeDept === TASK_GROUPS.find(g => g.id === activeGroupId)?.departmentMatch;
  });

  // Filter tasks based on search & selectors
  const filteredTasks = groupFilteredTasks.filter(t => {
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (assigneeFilter === 'mine' && t.assigneeId !== currentUser.id) return false;
    if (assigneeFilter !== 'all' && assigneeFilter !== 'mine' && t.assigneeId !== assigneeFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchProject = t.project.toLowerCase().includes(q);
      const matchAssignee = t.assigneeName.toLowerCase().includes(q);
      return matchTitle || matchProject || matchAssignee;
    }
    return true;
  });

  // Mini Report Statistics Calculation
  const totalTasks = groupFilteredTasks.length;
  const completedTasks = groupFilteredTasks.filter(t => t.status === 'done').length;
  const inProgressTasks = groupFilteredTasks.filter(t => t.status === 'on_progress' || t.status === 'in_progress').length;
  const urgentTasks = groupFilteredTasks.filter(t => t.priority === 'urgent' && t.status !== 'done').length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Checkpoints total & completed
  const allCheckpoints = groupFilteredTasks.flatMap(t => t.checkpoints || []);
  const totalCheckpoints = allCheckpoints.length;
  const completedCheckpoints = allCheckpoints.filter(cp => cp.isCompleted).length;
  const checkpointPercentage = totalCheckpoints > 0 ? Math.round((completedCheckpoints / totalCheckpoints) * 100) : 0;

  // Column visual styles matching spacious, high-end pastel board design
  const columnStyles: Record<string, {
    bg: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    addBtnBorder: string;
    addBtnText: string;
    addBtnHover: string;
    titleColor: string;
    accentDot: string;
  }> = {
    not_started: {
      bg: 'bg-[#F2EFFE] dark:bg-indigo-950/25',
      border: 'border-indigo-200/80 dark:border-indigo-900/50',
      badgeBg: 'bg-white dark:bg-indigo-900/80',
      badgeText: 'text-indigo-700 dark:text-indigo-300',
      addBtnBorder: 'border-indigo-300 dark:border-indigo-800',
      addBtnText: 'text-indigo-600 dark:text-indigo-300',
      addBtnHover: 'hover:bg-indigo-100/60 dark:hover:bg-indigo-950/40',
      titleColor: 'text-indigo-950 dark:text-indigo-200',
      accentDot: 'bg-indigo-500'
    },
    on_progress: {
      bg: 'bg-[#EAF3FD] dark:bg-blue-950/25',
      border: 'border-blue-200/80 dark:border-blue-900/50',
      badgeBg: 'bg-white dark:bg-blue-900/80',
      badgeText: 'text-blue-700 dark:text-blue-300',
      addBtnBorder: 'border-blue-300 dark:border-blue-800',
      addBtnText: 'text-blue-600 dark:text-blue-300',
      addBtnHover: 'hover:bg-blue-100/60 dark:hover:bg-blue-950/40',
      titleColor: 'text-blue-950 dark:text-blue-200',
      accentDot: 'bg-sky-500'
    },
    on_review: {
      bg: 'bg-[#FEF5E8] dark:bg-amber-950/25',
      border: 'border-amber-200/80 dark:border-amber-900/50',
      badgeBg: 'bg-white dark:bg-amber-900/80',
      badgeText: 'text-amber-700 dark:text-amber-300',
      addBtnBorder: 'border-amber-300 dark:border-amber-800',
      addBtnText: 'text-amber-600 dark:text-amber-300',
      addBtnHover: 'hover:bg-amber-100/60 dark:hover:bg-amber-950/40',
      titleColor: 'text-amber-950 dark:text-amber-200',
      accentDot: 'bg-amber-500'
    },
    done: {
      bg: 'bg-[#EBFBF3] dark:bg-emerald-950/25',
      border: 'border-emerald-200/80 dark:border-emerald-900/50',
      badgeBg: 'bg-white dark:bg-emerald-900/80',
      badgeText: 'text-emerald-700 dark:text-emerald-300',
      addBtnBorder: 'border-emerald-300 dark:border-emerald-800',
      addBtnText: 'text-emerald-600 dark:text-emerald-300',
      addBtnHover: 'hover:bg-emerald-100/60 dark:hover:bg-emerald-950/40',
      titleColor: 'text-emerald-950 dark:text-emerald-200',
      accentDot: 'bg-emerald-500'
    }
  };

  // 4 requested flow stages: Not started - On Progress - On Review - Done
  const columns: {
    id: TaskStatus;
    label: string;
    filterFn: (t: Task) => boolean;
    count: number;
  }[] = [
    {
      id: 'not_started',
      label: 'Not started',
      filterFn: t => t.status === 'not_started' || t.status === 'todo' || t.status === 'backlog',
      count: filteredTasks.filter(t => t.status === 'not_started' || t.status === 'todo' || t.status === 'backlog').length
    },
    {
      id: 'on_progress',
      label: 'On Progress',
      filterFn: t => t.status === 'on_progress' || t.status === 'in_progress',
      count: filteredTasks.filter(t => t.status === 'on_progress' || t.status === 'in_progress').length
    },
    {
      id: 'on_review',
      label: 'On Review',
      filterFn: t => t.status === 'on_review' || t.status === 'review',
      count: filteredTasks.filter(t => t.status === 'on_review' || t.status === 'review').length
    },
    {
      id: 'done',
      label: 'Done',
      filterFn: t => t.status === 'done' && !t.isArchived,
      count: filteredTasks.filter(t => t.status === 'done' && !t.isArchived).length
    }
  ];

  const archivedTasks = groupFilteredTasks.filter(t => t.status === 'done' && t.isArchived);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(id);
  };

  const handleDragOver = (e: React.DragEvent, colId: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColId !== colId) {
      setDragOverColId(colId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, colId: TaskStatus) => {
    if (dragOverColId === colId) {
      setDragOverColId(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (id) {
      moveTaskStatus(id, targetStatus);
    }
    setDraggedTaskId(null);
    setDragOverColId(null);
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return { label: 'High', bg: 'bg-[#FEE8E8] text-[#E02424] dark:bg-rose-950/70 dark:text-rose-300' };
      case 'high':
        return { label: 'High', bg: 'bg-[#FEE8E8] text-[#E02424] dark:bg-rose-950/70 dark:text-rose-300' };
      case 'medium':
        return { label: 'Medium', bg: 'bg-[#FDF1DB] text-[#D97706] dark:bg-amber-950/70 dark:text-amber-300' };
      default:
        return { label: 'Low', bg: 'bg-[#E7F8F0] text-[#057A55] dark:bg-emerald-950/70 dark:text-emerald-300' };
    }
  };

  const formatDueDisplay = (deadline: string) => {
    if (!deadline) return 'Today 11:00';
    try {
      const d = new Date(deadline);
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      if (d.toDateString() === today.toDateString()) {
        const hh = d.getHours().toString().padStart(2, '0');
        const mm = d.getMinutes().toString().padStart(2, '0');
        return `Today ${hh}:${mm || '00'}`;
      } else if (d.toDateString() === tomorrow.toDateString()) {
        return `Tomorrow 16:00`;
      } else {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return `${days[d.getDay()]} 11:00`;
      }
    } catch {
      return 'Today 11:00';
    }
  };

  const handleAddCheckpointSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !newCheckpointTitle.trim()) return;
    addTaskCheckpoint(selectedTask.id, newCheckpointTitle, newCheckpointDate || undefined);
    setNewCheckpointTitle('');
    setNewCheckpointDate('');

    // Keep selectedTask state updated in modal
    const updated = tasks.find(t => t.id === selectedTask.id);
    if (updated) setSelectedTask(updated);
  };

  const handleAddReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !reportContent.trim()) return;
    addTaskReport(selectedTask.id, {
      type: reportType,
      content: reportContent
    });
    setReportContent('');

    // Keep selectedTask state updated in modal
    const updated = tasks.find(t => t.id === selectedTask.id);
    if (updated) setSelectedTask(updated);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. GROUP SWITCHER & ACCESS CONTROL BAR */}
      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-slate-800 ring-1 ring-slate-800 shadow-xs">
            <Building2 className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Task Management Per Divisi
              </h2>
              {isSuperAdmin && (
                <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-950/80 dark:text-red-300">
                  Universal Admin Access
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Setiap divisi memiliki board kerja terpisah. Akses dibatasi sesuai otorisasi tim.
            </p>
          </div>
        </div>

        {/* Group Selector Dropdown / Pills */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Pilih Board:</span>
          <select
            value={activeGroupId}
            onChange={e => setSelectedTaskGroup(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 focus:border-red-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-2xs"
          >
            {isSuperAdmin && (
              <option value="all">🌐 Semua Divisi (Global Overview)</option>
            )}
            {TASK_GROUPS.map(g => (
              <option
                key={g.id}
                value={g.id}
                disabled={!isSuperAdmin && g.id !== userHomeGroup.id}
              >
                {g.name} {!isSuperAdmin && g.id !== userHomeGroup.id ? '🔒 (Terkunci)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ACCESS DENIED STATE FOR UNAUTHORIZED GROUPS */}
      {!hasAccessToCurrentGroup ? (
        <div className="rounded-3xl border border-red-200 bg-red-50/70 p-8 text-center dark:border-red-900/60 dark:bg-red-950/30">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/40 text-red-600 mb-3">
            <Lock className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Akses Board Terbatas
          </h3>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            Sesuai kebijakan keamanan perusahaan, Anda hanya diizinkan mengakses board divisi Anda (<strong>{currentUser.department}</strong>). Hanya <strong>Super Admin</strong> yang memiliki otorisasi penuh lintas divisi.
          </p>
          <button
            onClick={() => setSelectedTaskGroup(userHomeGroup.id)}
            className="mt-4 rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-black transition"
          >
            Beralih ke Board Saya ({userHomeGroup.name})
          </button>
        </div>
      ) : (
        <>
          {/* 2. HEADER MINI STATISTIK & MINI REPORT (EXECUTIVE WIDGET) */}
          <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileBarChart className="h-4 w-4 text-red-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Mini Report & Statistik Capaian Tim: {activeGroupId === 'all' ? 'Semua Divisi' : TASK_GROUPS.find(g => g.id === activeGroupId)?.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowProductivityTrend(!showProductivityTrend)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition self-start sm:self-auto cursor-pointer shadow-2xs ${
                    showProductivityTrend
                      ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <span>{showProductivityTrend ? 'Sembunyikan Grafik Tren' : 'Lihat Grafik Tren 30 Hari'}</span>
                </button>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition self-start sm:self-auto cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5 text-red-600" />
                  <span>Lihat Laporan Lengkap Tim</span>
                </button>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
              {/* Total Tasks */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Total Tugas</div>
                <div className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">{totalTasks}</div>
                <div className="mt-1 text-[10px] text-slate-400">Aktif di board ini</div>
              </div>

              {/* Progress Rate */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Selesai (Done)</div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{completedTasks}</span>
                  <span className="text-xs font-bold text-slate-400">({completionPercentage}%)</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${completionPercentage}%` }} />
                </div>
              </div>

              {/* In Progress */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Sedang Dikerjakan</div>
                <div className="mt-1 text-xl font-extrabold text-blue-600 dark:text-blue-400">{inProgressTasks}</div>
                <div className="mt-1 text-[10px] text-slate-400">Fokus pengerjaan aktif</div>
              </div>

              {/* Checkpoints Progress */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Checkpoint Milestones</div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">{completedCheckpoints}/{totalCheckpoints}</span>
                  <span className="text-xs font-bold text-slate-400">({checkpointPercentage}%)</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-slate-950 dark:bg-white rounded-full" style={{ width: `${checkpointPercentage}%` }} />
                </div>
              </div>

              {/* Urgent / Overdue */}
              <div className="rounded-2xl border border-red-100 bg-red-50/50 p-3 dark:border-red-950/60 dark:bg-red-950/20 col-span-2 sm:col-span-1">
                <div className="text-[10px] font-semibold text-red-600 dark:text-red-400">Prioritas Urgent</div>
                <div className="mt-1 text-xl font-extrabold text-red-600 dark:text-red-400">{urgentTasks}</div>
                <div className="mt-1 text-[10px] text-red-500/80">Perlu perhatian khusus</div>
              </div>
            </div>

            {/* Task Productivity Visualization with Recharts (30 Days Trend + Filters) */}
            {showProductivityTrend && (
              <div className="pt-2">
                <TaskProductivityChart
                  tasks={filteredTasks}
                  users={users}
                  currentUser={currentUser}
                />
              </div>
            )}
          </div>

          {/* 3. TOOLBAR & HEADER (Matching reference image_83ee1f6e.png) */}
          <div className="rounded-[28px] border border-slate-200/90 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3.5">
            {/* Top row: Project title dropdown & Members */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* Project title with dropdown like 'Movadex Project v' */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  <span>{activeGroupId === 'all' ? 'Movadex Unified Project' : (TASK_GROUPS.find(g => g.id === activeGroupId)?.name || 'Movadex Project')}</span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>
              </div>

              {/* Members Avatar Stack + Add Member Button */}
              <div className="flex items-center gap-2.5 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setQuickActionModal('meeting')}
                  className="flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 shadow-2xs transition"
                >
                  <Plus className="h-3.5 w-3.5 text-sky-600" />
                  <span>Add member</span>
                </button>

                {/* Overlapping member avatars */}
                <div className="flex items-center -space-x-2">
                  {users.slice(0, 4).map(u => (
                    <img
                      key={u.id}
                      src={u.avatar}
                      alt={u.name}
                      title={u.name}
                      className="h-7 w-7 rounded-full object-cover ring-2 ring-white dark:ring-slate-900"
                    />
                  ))}
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 ring-2 ring-white dark:ring-slate-900">
                    +{users.length > 4 ? users.length - 4 : 5}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom row: Search input + View switchers + All tasks filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
              {/* Search input with magnifying glass matching "Search here" */}
              <div className="relative w-full sm:w-72 md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search here"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200/90 bg-slate-50/70 pl-10 pr-8 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/80 dark:text-white shadow-2xs transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* View switchers: Board first, then List, Gantt, Overview */}
              <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
                {/* View switcher buttons */}
                <div className="flex items-center rounded-2xl border border-slate-200/90 bg-slate-50/80 p-1 dark:border-slate-700 dark:bg-slate-800 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setViewMode('kanban')}
                    title="Board 4 Stages"
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                      viewMode === 'kanban'
                        ? 'bg-[#0052CC] text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    <Kanban className="h-3.5 w-3.5" />
                    <span>Board</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    title="Table List View"
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-[#0052CC] text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    <List className="h-3.5 w-3.5" />
                    <span>List</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('timeline')}
                    title="Gantt Timeline Focus"
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                      viewMode === 'timeline'
                        ? 'bg-[#0052CC] text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>Gantt Chart</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('overview')}
                    title="Overview (Board + Gantt Timeline Bawah)"
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                      viewMode === 'overview'
                        ? 'bg-[#0052CC] text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span>Overview</span>
                  </button>
                </div>

                {/* Filter dropdown "All tasks v" */}
                <div className="relative">
                  <select
                    value={priorityFilter}
                    onChange={e => setPriorityFilter(e.target.value)}
                    className="appearance-none rounded-2xl border border-slate-200/90 bg-slate-50/80 pl-3.5 pr-8 py-2 text-xs font-bold text-slate-700 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 shadow-2xs cursor-pointer"
                  >
                    <option value="all">All tasks</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                </div>

                {/* Assignee filter */}
                <select
                  value={assigneeFilter}
                  onChange={e => setAssigneeFilter(e.target.value)}
                  className="rounded-2xl border border-slate-200/90 bg-slate-50/80 px-3 py-2 text-xs font-bold text-slate-700 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 shadow-2xs cursor-pointer"
                >
                  <option value="all">All members</option>
                  <option value="mine">My tasks</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>

                {/* Add task button */}
                <button
                  onClick={() => setQuickActionModal('task')}
                  className="flex items-center gap-1.5 rounded-2xl bg-slate-950 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-black active:scale-95 shrink-0 border border-slate-800 dark:bg-white dark:text-slate-900 transition cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 text-sky-500 dark:text-sky-600" />
                  <span>Add task</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4. GANTT CHART TIMELINE ONLY (When in dedicated 'timeline' view) */}
          {viewMode === 'timeline' && (
            <div className="space-y-4">
              <GanttChartTimeline
                tasks={filteredTasks}
                users={users}
                currentUser={currentUser}
                activeGroupName={
                  activeGroupId === 'all'
                    ? 'All Divisions'
                    : TASK_GROUPS.find(g => g.id === activeGroupId)?.name || 'Unified Workspace'
                }
                onSelectTask={task => setSelectedTask(task)}
                onAddTask={() => setQuickActionModal('task')}
                onToggleTaskComplete={taskId => {
                  const target = tasks.find(t => t.id === taskId);
                  if (target) {
                    moveTaskStatus(target.id, target.status === 'done' ? 'on_progress' : 'done');
                  }
                }}
              />
            </div>
          )}

          {/* 5. 4-STAGE SPACIOUS STATUS COLUMNS (Shown in 'overview' and 'kanban' views) */}
          {(viewMode === 'overview' || viewMode === 'kanban') && (
            <div className="space-y-3">
              {viewMode === 'overview' && (
                <div className="flex items-center justify-between pt-2 px-1">
                  <div className="flex items-center gap-2">
                    <Kanban className="h-4 w-4 text-slate-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Task Stages & Workflows (Not started → On Progress → On Review → Done)
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Geser (drag & drop) untuk memindahkan status tugas
                  </span>
                </div>
              )}

              {/* Grid: 4 columns with spacious gap-6 sm:gap-7, breathable padding, no cramped touching */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-7 pb-4">
                {columns.map(col => {
                  const colTasks = filteredTasks.filter(col.filterFn);
                  const style = columnStyles[col.id] || columnStyles.not_started;

                  return (
                    <div
                      key={col.id}
                      onDragOver={e => handleDragOver(e, col.id)}
                      onDragLeave={e => handleDragLeave(e, col.id)}
                      onDrop={e => handleDrop(e, col.id)}
                      className={`flex flex-col rounded-[32px] border ${style.border} ${style.bg} p-4.5 sm:p-5 min-h-[580px] shadow-xs transition-all duration-200 ease-out ${
                        dragOverColId === col.id ? 'ring-2 ring-sky-400 bg-sky-50/70 dark:bg-sky-950/40 scale-[1.01]' : ''
                      }`}
                    >
                      {/* Column Header: [Count Circle] [Title] [...] [+] */}
                      <div className="flex items-center justify-between pb-4 pt-1 px-1">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-full ${style.badgeBg} ${style.badgeText} text-xs font-black shadow-xs`}
                          >
                            {col.count}
                          </div>
                          <span className={`text-sm font-black ${style.titleColor}`}>
                            {col.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          {col.id === 'done' && (
                            <button
                              type="button"
                              onClick={() => setShowArchivedModal(true)}
                              className="flex items-center gap-1 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/80 dark:hover:bg-emerald-900 px-2 py-1 text-[10px] font-extrabold text-emerald-800 dark:text-emerald-200 shadow-2xs transition cursor-pointer"
                              title="Tugas selesai > 7 hari otomatis diarsipkan"
                            >
                              <Archive className="h-3 w-3" />
                              <span>Arsip ({archivedTasks.length})</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setQuickActionModal('task')}
                            className={`rounded-xl p-1.5 ${style.addBtnText} hover:bg-white/60 dark:hover:bg-slate-800/60 transition cursor-pointer`}
                            title="Add task"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="rounded-xl p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                            title="Options"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Task Cards List with generous space-y-4 and top clearance to avoid hover clipping */}
                      <div className="flex-1 space-y-4 overflow-y-auto overflow-x-visible pt-3.5 pb-4 px-1.5 -mx-1.5">
                        {colTasks.length === 0 ? (
                          <div className={`flex h-40 flex-col items-center justify-center rounded-[24px] border border-dashed p-4 text-center text-slate-400 transition-colors ${
                            dragOverColId === col.id ? 'border-sky-400 bg-sky-50/50 dark:bg-sky-950/20 text-sky-600' : 'border-slate-300/80 dark:border-slate-800'
                          }`}>
                            <p className="text-xs font-bold">Lepaskan kartu tugas di sini</p>
                            <p className="text-[11px] text-slate-400/80 mt-1">Kolom {col.label}</p>
                          </div>
                        ) : (
                          colTasks.map((task, taskIdx) => {
                            const priorityBadge = getPriorityBadge(task.priority);
                            const totalComments = task.comments?.length || 8;
                            const totalAttachments = task.attachments?.length || 1;
                            const isDone = task.status === 'done';

                            // Progress percentage from checkpoints or checklists
                            let progressPct = 0;
                            if (isDone) {
                              progressPct = 100;
                            } else if (task.checkpoints && task.checkpoints.length > 0) {
                              const doneCount = task.checkpoints.filter(cp => cp.isCompleted).length;
                              progressPct = Math.round((doneCount / task.checkpoints.length) * 100);
                            } else if (task.checklists && task.checklists.length > 0) {
                              const doneCount = task.checklists.filter(c => c.completed).length;
                              progressPct = Math.round((doneCount / task.checklists.length) * 100);
                            } else {
                              progressPct = col.id === 'on_progress' ? 65 : (col.id === 'on_review' ? 85 : 0);
                            }

                            return (
                              <div
                                key={task.id}
                                draggable
                                onDragStart={e => handleDragStart(e, task.id)}
                                onDragEnd={() => {
                                  setDraggedTaskId(null);
                                  setDragOverColId(null);
                                }}
                                onClick={() => setSelectedTask(task)}
                                className={`kanban-task-card group relative select-none rounded-[24px] border p-4 sm:p-5 transition-all duration-200 ease-out cursor-grab active:cursor-grabbing dark:border-slate-800/90 dark:bg-slate-900 ${
                                  draggedTaskId === task.id
                                    ? 'is-dragging scale-[1.03] -translate-y-2 rotate-1 shadow-2xl ring-2 ring-blue-500 border-blue-400 bg-white/95 dark:bg-slate-900/95 z-50'
                                    : 'bg-white shadow-xs border-white/90 hover:border-slate-200 dark:hover:border-slate-700'
                                }`}
                              >
                                {/* Top Category Tag & Project */}
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate max-w-[170px]">
                                    {task.project}
                                  </span>
                                  <span className={`h-2 w-2 rounded-full ${style.accentDot}`} />
                                </div>

                                {/* Task Title matching reference */}
                                <h4 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2 mb-3.5 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                  {task.title}
                                </h4>

                                {/* Progress Bar & Milestone Status (Matching image_5dedaf7e.png) */}
                                <div className="mb-3.5 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
                                  <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                                    <span className="text-slate-500 dark:text-slate-400">Progress</span>
                                    <span className={isDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-white'}>
                                      {progressPct}%
                                    </span>
                                  </div>
                                  <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all duration-300 ${
                                        isDone
                                          ? 'bg-emerald-500'
                                          : col.id === 'on_review'
                                          ? 'bg-amber-500'
                                          : 'bg-sky-500'
                                      }`}
                                      style={{ width: `${progressPct}%` }}
                                    />
                                  </div>
                                </div>

                                {/* Middle Row: Assignee Avatar + Due Time + Blue Checkmark Circle */}
                                <div className="flex items-center justify-between mb-3.5">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <img
                                      src={task.assigneeAvatar}
                                      alt={task.assigneeName}
                                      className="h-6 w-6 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700 shrink-0"
                                    />
                                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 truncate">
                                      {formatDueDisplay(task.deadline)}
                                    </span>
                                  </div>

                                  {/* Blue Checkmark Circle (Matching image_83ee1f6e.png & image_5dedaf7e.png) */}
                                  <button
                                    type="button"
                                    onClick={e => {
                                      e.stopPropagation();
                                      const nextStatus: TaskStatus = isDone ? 'on_progress' : 'done';
                                      moveTaskStatus(task.id, nextStatus);
                                    }}
                                    title={isDone ? 'Tandai belum selesai' : 'Tandai selesai'}
                                    className={`flex h-6 w-6 items-center justify-center rounded-full transition active:scale-90 shrink-0 ${
                                      isDone
                                        ? 'bg-sky-500 text-white shadow-2xs'
                                        : 'border-2 border-sky-500 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/40'
                                    }`}
                                  >
                                    <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                                  </button>
                                </div>

                                {/* Video Draft Scene Badge & Google Links indicator */}
                                {task.videoDraftScenes && task.videoDraftScenes.length > 0 && (
                                  <div className="mb-2.5 flex items-center justify-between rounded-xl bg-indigo-50/80 px-2.5 py-1 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-900/40">
                                    <div className="flex items-center gap-1.5">
                                      <Clapperboard className="h-3 w-3 text-indigo-600" />
                                      <span>{task.videoDraftScenes.length} Scene Video Draft</span>
                                    </div>
                                    <span className="text-[9px] font-mono opacity-80">
                                      {task.videoDraftScenes.reduce((acc, s) => acc + (s.googleLinks?.length || 0), 0)} Link
                                    </span>
                                  </div>
                                )}

                                {/* Bottom Row: Comments, Attachments + Pastel Priority Badge */}
                                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                                    <span className="flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300">
                                      <MessageSquare className="h-3.5 w-3.5" />
                                      <span>{totalComments}</span>
                                    </span>
                                    <span className="flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300">
                                      <Paperclip className="h-3.5 w-3.5" />
                                      <span>{totalAttachments}</span>
                                    </span>
                                  </div>

                                  {/* Soft Pastel Priority Badge */}
                                  <span className={`px-2.5 py-0.5 rounded-xl text-[10px] font-bold ${priorityBadge.bg}`}>
                                    {priorityBadge.label}
                                  </span>
                                </div>

                                {/* Manager Approval Banner & Action */}
                                {task.approvalRequest ? (
                                  <div className={`mt-2.5 rounded-xl p-2 text-[10px] font-bold border transition ${
                                    task.approvalRequest.status === 'approved'
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60'
                                      : task.approvalRequest.status === 'declined'
                                      ? 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60'
                                      : 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60'
                                  }`}>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1 truncate">
                                        <Send className="h-3 w-3 shrink-0" />
                                        <span className="truncate">
                                          {task.approvalRequest.status === 'approved'
                                            ? '✓ Disetujui Manajer (Auto Done)'
                                            : task.approvalRequest.status === 'declined'
                                            ? '✕ Approval Ditolak'
                                            : `⏳ Review Manajer (${task.approvalRequest.requiredApprovals.filter(a => a.status === 'approved').length}/${task.approvalRequest.requiredApprovals.length})`}
                                        </span>
                                      </div>

                                      {/* If current user is one of the approvers or super_admin and status is pending */}
                                      {task.approvalRequest.status === 'pending' && (() => {
                                        const isRequester = task.approvalRequest?.requestedBy === currentUser.id || task.reporterId === currentUser.id;

                                        if (isRequester) {
                                          return (
                                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100/90 dark:bg-amber-950/60 dark:text-amber-300 px-2 py-0.5 rounded-md">
                                              Menunggu Manajer Lain
                                            </span>
                                          );
                                        }

                                        return (
                                          <div className="flex items-center gap-1 shrink-0 ml-1">
                                            <button
                                              type="button"
                                              onClick={e => {
                                                e.stopPropagation();
                                                processTaskApproval(task.id, currentUser.id, 'approved', 'Disetujui dari card board');
                                              }}
                                              title="Setujui (Approve) & Otomatis Selesai"
                                              className="rounded-md bg-emerald-600 px-1.5 py-0.5 text-[9px] font-extrabold text-white hover:bg-emerald-700 shadow-2xs"
                                            >
                                              ✓ Setujui
                                            </button>
                                            <button
                                              type="button"
                                              onClick={e => {
                                                e.stopPropagation();
                                                processTaskApproval(task.id, currentUser.id, 'declined', 'Perlu revisi');
                                              }}
                                              title="Tolak (Decline)"
                                              className="rounded-md bg-rose-600 px-1.5 py-0.5 text-[9px] font-extrabold text-white hover:bg-rose-700 shadow-2xs"
                                            >
                                              ✕ Tolak
                                            </button>
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex justify-end">
                                    <button
                                      type="button"
                                      onClick={e => {
                                        e.stopPropagation();
                                        openApprovalModal(task);
                                      }}
                                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 shadow-2xs transition"
                                    >
                                      <Send className="h-2.5 w-2.5 text-blue-600" />
                                      <span>Kirim Approval</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                        {dragOverColId === col.id && draggedTaskId !== null && (
                          <div className="rounded-[22px] border-2 border-dashed border-sky-400 bg-sky-50/50 dark:border-sky-500 dark:bg-sky-950/20 py-4 text-center text-xs font-bold text-sky-600 dark:text-sky-300 animate-pulse select-none">
                            ↓ Pindahkan kartu ke {col.label}
                          </div>
                        )}
                      </div>

                      {/* Bottom Add New Task button with matching dashed border & color */}
                      <button
                        type="button"
                        onClick={() => setQuickActionModal('task')}
                        className={`w-full mt-4 flex items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed ${style.addBtnBorder} ${style.addBtnText} ${style.addBtnHover} py-2.5 text-xs font-bold transition shadow-2xs cursor-pointer`}
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add new task</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. GANTT CHART TIMELINE AT THE BOTTOM IN OVERVIEW MODE */}
          {viewMode === 'overview' && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-slate-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Gantt Chart Timeline (Ringkas & Terkoneksi)
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">
                  Timeline proyek & milestone per divisi
                </span>
              </div>
              <GanttChartTimeline
                tasks={filteredTasks}
                users={users}
                currentUser={currentUser}
                activeGroupName={
                  activeGroupId === 'all'
                    ? 'All Divisions'
                    : TASK_GROUPS.find(g => g.id === activeGroupId)?.name || 'Unified Workspace'
                }
                onSelectTask={task => setSelectedTask(task)}
                onAddTask={() => setQuickActionModal('task')}
                onToggleTaskComplete={taskId => {
                  const target = tasks.find(t => t.id === taskId);
                  if (target) {
                    moveTaskStatus(target.id, target.status === 'done' ? 'on_progress' : 'done');
                  }
                }}
              />
            </div>
          )}

          {/* 6. VIEW: TABLE LIST VIEW */}
          {viewMode === 'list' && (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50/80 font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/80">
                    <tr>
                      <th className="px-4 py-3">Judul Task</th>
                      <th className="px-4 py-3">Proyek & Divisi</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Prioritas</th>
                      <th className="px-4 py-3">Milestone Checkpoints</th>
                      <th className="px-4 py-3">Assignee</th>
                      <th className="px-4 py-3">Deadline</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredTasks.map(t => {
                      const priority = getPriorityBadge(t.priority);
                      const totalCp = (t.checkpoints || []).length;
                      const doneCp = (t.checkpoints || []).filter(c => c.isCompleted).length;

                      return (
                        <tr
                          key={t.id}
                          className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                          onClick={() => setSelectedTask(t)}
                        >
                          <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                            <div className="flex items-center gap-2">
                              <CheckCircle2
                                onClick={e => {
                                  e.stopPropagation();
                                  moveTaskStatus(t.id, t.status === 'done' ? 'in_progress' : 'done');
                                }}
                                className={`h-4 w-4 cursor-pointer transition ${
                                  t.status === 'done' ? 'text-emerald-500' : 'text-slate-300 hover:text-emerald-500'
                                }`}
                              />
                              <span className={t.status === 'done' ? 'line-through text-slate-400' : ''}>
                                {t.title}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-500">
                            <div>{t.project}</div>
                            <div className="text-[10px] text-slate-400">{t.groupName || t.assigneeDept}</div>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={
                                t.status === 'done'
                                  ? 'done'
                                  : t.status === 'review' || t.status === 'on_review'
                                  ? 'on_review'
                                  : t.status === 'in_progress' || t.status === 'on_progress'
                                  ? 'on_progress'
                                  : 'not_started'
                              }
                              onClick={e => e.stopPropagation()}
                              onChange={e => moveTaskStatus(t.id, e.target.value as TaskStatus)}
                              className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            >
                              <option value="not_started">Not started</option>
                              <option value="on_progress">On Progress</option>
                              <option value="on_review">On Review</option>
                              <option value="done">Done</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${priority.bg}`}>
                              {priority.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {totalCp > 0 ? (
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-700 dark:text-slate-300">{doneCp}/{totalCp}</span>
                                <div className="h-1.5 w-16 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                  <div className="h-full bg-slate-950 dark:bg-white" style={{ width: `${(doneCp / totalCp) * 100}%` }} />
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px]">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <img src={t.assigneeAvatar} alt="" className="h-6 w-6 rounded-full object-cover" />
                              <span>{t.assigneeName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{t.deadline}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                deleteTask(t.id);
                              }}
                              className="rounded-lg p-1.5 text-slate-400 hover:text-red-600"
                              title="Hapus Task"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}


        </>
      )}

      {/* 7. TASK DETAILS MODAL WITH CHECKPOINT TRACKER & REPORT/CHAT STREAM */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
                    {selectedTask.project}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    Divisi: {selectedTask.groupName || selectedTask.assigneeDept}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {selectedTask.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-5">
              {/* Status and priority controls */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-2xl dark:bg-slate-800/60 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Status</span>
                  <select
                    value={
                      selectedTask.status === 'done'
                        ? 'done'
                        : selectedTask.status === 'review' || selectedTask.status === 'on_review'
                        ? 'on_review'
                        : selectedTask.status === 'in_progress' || selectedTask.status === 'on_progress'
                        ? 'on_progress'
                        : 'not_started'
                    }
                    onChange={e => {
                      const newStatus = e.target.value as TaskStatus;
                      moveTaskStatus(selectedTask.id, newStatus);
                      setSelectedTask({ ...selectedTask, status: newStatus });
                    }}
                    className="mt-1 font-bold text-slate-800 dark:text-slate-200 bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="not_started">Not started</option>
                    <option value="on_progress">On Progress</option>
                    <option value="on_review">On Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Prioritas</span>
                  <span className="font-bold text-red-600 uppercase">{selectedTask.priority}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Deadline</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{selectedTask.deadline}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Assignee</span>
                  <div className="flex items-center gap-1.5 mt-1 font-bold">
                    <img src={selectedTask.assigneeAvatar} alt="" className="h-4 w-4 rounded-full object-cover" />
                    <span className="truncate">{selectedTask.assigneeName.split(' ')[0]}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi Pekerjaan
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800">
                  {selectedTask.description}
                </p>
              </div>

              {/* 🌟 1. FITUR KIRIM CARD KE GROUP UNTUK APPROVAL MANAJER */}
              <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/40 p-4 dark:border-blue-900/60 dark:bg-blue-950/20 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-blue-100 pb-2.5 dark:border-blue-900/50">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                      <Send className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">
                        Alur Approval Manajer
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {selectedTask.approvalRequest
                          ? `Diajukan ke ${selectedTask.approvalRequest.targetChannelName || 'Grup Channel'}`
                          : 'Kirim card ini ke grup/channel untuk mendapatkan persetujuan manajer'}
                      </p>
                    </div>
                  </div>

                  {!selectedTask.approvalRequest ? (
                    <button
                      type="button"
                      onClick={() => setApprovalModalTask(selectedTask)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition cursor-pointer self-start sm:self-auto"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Kirim ke Group untuk Approval</span>
                    </button>
                  ) : (
                    <span className={`rounded-xl px-2.5 py-1 text-[11px] font-black uppercase tracking-wider ${
                      selectedTask.approvalRequest.status === 'approved'
                        ? 'bg-emerald-600 text-white'
                        : selectedTask.approvalRequest.status === 'declined'
                        ? 'bg-rose-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}>
                      {selectedTask.approvalRequest.status === 'approved'
                        ? '✓ TELAH DISETUJUI SEMUA (OTOMATIS DONE)'
                        : selectedTask.approvalRequest.status === 'declined'
                        ? '✕ DITOLAK MANAJER'
                        : '⏳ MENUNGGU APPROVAL'}
                    </span>
                  )}
                </div>

                {/* Approvers list & action buttons */}
                {selectedTask.approvalRequest && (
                  <div className="space-y-2 pt-1">
                    <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                      Daftar Manajer Penyetuju ({selectedTask.approvalRequest.requiredApprovals.filter(a => a.status === 'approved').length}/{selectedTask.approvalRequest.requiredApprovals.length}):
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedTask.approvalRequest.requiredApprovals.map(appr => (
                        <div
                          key={appr.id}
                          className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-800 dark:bg-slate-900 shadow-2xs"
                        >
                          <div className="flex items-center gap-2">
                            <img src={appr.managerAvatar} alt="" className="h-6 w-6 rounded-full object-cover" />
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white leading-none">{appr.managerName}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">{appr.managerRole || 'Manager'}</div>
                            </div>
                          </div>

                          <span className={`rounded-lg px-2 py-0.5 text-[10px] font-extrabold ${
                            appr.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                              : appr.status === 'declined'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                          }`}>
                            {appr.status === 'approved' ? '✓ Disetujui' : appr.status === 'declined' ? '✕ Ditolak' : '⏳ Menunggu'}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Manager Action Buttons: Approve or Decline */}
                    {selectedTask.approvalRequest.status === 'pending' && (() => {
                      const isRequester = selectedTask.approvalRequest?.requestedBy === currentUser.id || selectedTask.reporterId === currentUser.id;

                      if (isRequester) {
                        return (
                          <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-amber-50 p-3 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800/60 text-amber-800 dark:text-amber-200 text-xs">
                            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                            <div>
                              <span className="font-bold block">Status Pengajuan Anda:</span>
                              <span className="text-[11px] leading-relaxed">Anda adalah pembuat / pengaju kartu approval ini. Sesuai prinsip tata kelola tim, persetujuan harus diberikan oleh manajer atau rekan anggota lain.</span>
                            </div>
                          </div>
                        );
                      }

                      if (selectedTask.approvalRequest?.requiredApprovals.some(a => a.managerId === currentUser.id) || isSuperAdmin) {
                        return (
                          <div className="mt-3 flex items-center justify-between rounded-xl bg-white p-3 border border-blue-200 dark:bg-slate-900 dark:border-blue-900">
                            <div className="text-xs">
                              <span className="font-bold text-slate-800 dark:text-white block">Tindakan Manajer Anda:</span>
                              <span className="text-[11px] text-slate-500">Jika disetujui, kartu ini otomatis dipindahkan ke status <strong>Done (Selesai)</strong>.</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  processTaskApproval(selectedTask.id, currentUser.id, 'declined', 'Perlu perbaikan naskah');
                                  setSelectedTask(prev => prev ? {
                                    ...prev,
                                    approvalRequest: prev.approvalRequest ? {
                                      ...prev.approvalRequest,
                                      status: 'declined',
                                      requiredApprovals: prev.approvalRequest.requiredApprovals.map(a =>
                                        a.managerId === currentUser.id ? { ...a, status: 'declined', comment: 'Perlu perbaikan naskah' } : a
                                      )
                                    } : undefined
                                  } : null);
                                }}
                                className="flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300 transition cursor-pointer"
                              >
                                <ThumbsDown className="h-3.5 w-3.5" />
                                <span>Tolak (Decline)</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  processTaskApproval(selectedTask.id, currentUser.id, 'approved', 'Disetujui untuk dipublikasi');
                                  setSelectedTask(prev => prev ? {
                                    ...prev,
                                    status: 'done',
                                    approvalRequest: prev.approvalRequest ? {
                                      ...prev.approvalRequest,
                                      status: 'approved',
                                      requiredApprovals: prev.approvalRequest.requiredApprovals.map(a =>
                                        a.managerId === currentUser.id ? { ...a, status: 'approved', comment: 'Disetujui untuk dipublikasi' } : a
                                      )
                                    } : undefined
                                  } : null);
                                }}
                                className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition cursor-pointer"
                              >
                                <ThumbsUp className="h-3.5 w-3.5" />
                                <span>Setujui (Approve → Done)</span>
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })()}
                  </div>
                )}
              </div>

              {/* 🎬 2. FITUR VIDEO DRAFT & SCENE BREAKDOWN (SCENE 1-7+) */}
              <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/60 to-purple-50/40 p-4 dark:border-indigo-900/60 dark:from-indigo-950/30 dark:to-purple-950/20 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-indigo-100 pb-2.5 dark:border-indigo-900/50">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                      <Clapperboard className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">
                        Storyboard Video Production Draft (Scene 1-7+)
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Rincian visual per-scene, naskah audio script, durasi, gambar referensi, dan link Google Docs/Drive
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const currentScenes = selectedTask.videoDraftScenes || [];
                        const nextNum = currentScenes.length + 1;
                        const newScene: VideoDraftScene = {
                          id: 'sc_' + Date.now(),
                          sceneNumber: nextNum,
                          title: `Scene ${nextNum}: Scene Baru`,
                          visualDirection: '',
                          audioScript: '',
                          durationText: '00:04',
                          googleLinks: []
                        };
                        const updated = [...currentScenes, newScene];
                        updateTaskVideoDraft(selectedTask.id, updated);
                        setSelectedTask({ ...selectedTask, videoDraftScenes: updated });
                      }}
                      className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Tambah Scene</span>
                    </button>
                  </div>
                </div>

                {/* Scene list */}
                {(!selectedTask.videoDraftScenes || selectedTask.videoDraftScenes.length === 0) ? (
                  <div className="rounded-xl border border-dashed border-indigo-200 p-4 text-center text-xs text-slate-500 dark:border-indigo-900/50">
                    <p className="font-semibold">Belum ada storyboard video untuk card ini.</p>
                    <button
                      type="button"
                      onClick={() => {
                        const templateScenes: VideoDraftScene[] = [
                          {
                            id: 'sc_1',
                            sceneNumber: 1,
                            title: 'Scene 1: Hook Penasaran (00:03)',
                            visualDirection: 'Talent menatap smartphone dengan ekspresi bingung, kamera push-in cepat.',
                            audioScript: 'VO: "Kerja di corporate tapi tracking task masih pake spreadsheet manual?"',
                            durationText: '00:03',
                            referenceImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60',
                            googleLinks: [{ type: 'docs', title: 'Naskah Lengkap Google Docs', url: 'https://docs.google.com' }]
                          },
                          {
                            id: 'sc_2',
                            sceneNumber: 2,
                            title: 'Scene 2: Agitasi Masalah (00:05)',
                            visualDirection: 'Montase chat spam, deadline terlewat, meja berantakan.',
                            audioScript: 'VO: "Grup chat berisik, dokumen nyangkut, kerjaan ga selesai-selesai."',
                            durationText: '00:05',
                            referenceImageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=60',
                            googleLinks: []
                          },
                          {
                            id: 'sc_3',
                            sceneNumber: 3,
                            title: 'Scene 3: Solusi WORKSPACE Board (00:07)',
                            visualDirection: 'Transisi clean ke 4-stage Pastel Board dan Huddle video call aktif.',
                            audioScript: 'VO: "Kenalin Workspace OS. Board per divisi, approval manajer 1-klik, dan video huddle terintegrasi."',
                            durationText: '00:07',
                            referenceImageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60',
                            googleLinks: [{ type: 'drive', title: 'Asset Drive Folder', url: 'https://drive.google.com' }]
                          }
                        ];
                        updateTaskVideoDraft(selectedTask.id, templateScenes);
                        setSelectedTask({ ...selectedTask, videoDraftScenes: templateScenes });
                      }}
                      className="mt-2 inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Muat Contoh 3 Scene Video Draft</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {selectedTask.videoDraftScenes.map(scene => (
                      <div
                        key={scene.id}
                        className="rounded-xl border border-indigo-100 bg-white p-3 text-xs dark:border-indigo-900/60 dark:bg-slate-900 shadow-2xs space-y-2"
                      >
                        {/* Scene Title, Duration & Trash */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-[10px] font-black">
                              {scene.sceneNumber}
                            </span>
                            <span className="font-extrabold text-slate-900 dark:text-white">
                              {scene.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                              ⏱️ {scene.durationText || '00:04'}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (selectedTask.videoDraftScenes || []).filter(s => s.id !== scene.id);
                                updateTaskVideoDraft(selectedTask.id, updated);
                                setSelectedTask({ ...selectedTask, videoDraftScenes: updated });
                              }}
                              className="text-slate-400 hover:text-rose-600 transition p-1"
                              title="Hapus scene"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Visual & Audio Columns */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          <div className="rounded-lg bg-indigo-50/60 p-2.5 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
                            <span className="font-bold text-indigo-800 dark:text-indigo-300 block mb-1">
                              📹 Arahan Visual & Shot:
                            </span>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                              {scene.visualDirection || 'Belum diisi'}
                            </p>
                          </div>
                          <div className="rounded-lg bg-emerald-50/60 p-2.5 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                            <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
                              🎙️ Voiceover / Audio Script:
                            </span>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                              {scene.audioScript || 'Belum diisi'}
                            </p>
                          </div>
                        </div>

                        {/* Reference Image & Google Links */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                          {scene.referenceImageUrl ? (
                            <div className="flex items-center gap-2">
                              <img
                                src={scene.referenceImageUrl}
                                alt="Referensi Visual"
                                className="h-8 w-12 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                              />
                              <span className="text-[10px] text-slate-500 truncate max-w-[150px]">
                                Referensi Terlampir
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Tidak ada foto referensi</span>
                          )}

                          {/* Google links */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {(scene.googleLinks || []).map((link, lIdx) => (
                              <a
                                key={lIdx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 hover:bg-blue-100 dark:bg-blue-950/70 dark:text-blue-300"
                              >
                                <LinkIcon className="h-2.5 w-2.5" />
                                <span>{link.title}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* FITUR CHECKPOINT / PROJECT MILESTONES */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-850">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4 text-red-600" />
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Tracking Checkpoint & Milestones Proyek
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {(selectedTask.checkpoints || []).filter(c => c.isCompleted).length} / {(selectedTask.checkpoints || []).length} Selesai
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-3">
                  <div
                    className="h-full bg-slate-950 dark:bg-white rounded-full transition-all duration-300"
                    style={{
                      width: `${(selectedTask.checkpoints || []).length > 0
                        ? (((selectedTask.checkpoints || []).filter(c => c.isCompleted).length / (selectedTask.checkpoints || []).length) * 100)
                        : 0}%`
                    }}
                  />
                </div>

                {/* Checkpoint list */}
                <div className="space-y-2 mb-3">
                  {(selectedTask.checkpoints || []).map(cp => (
                    <div
                      key={cp.id}
                      onClick={() => {
                        toggleTaskCheckpoint(selectedTask.id, cp.id);
                        const updatedCheckpoints = (selectedTask.checkpoints || []).map(c =>
                          c.id === cp.id ? { ...c, isCompleted: !c.isCompleted } : c
                        );
                        setSelectedTask({ ...selectedTask, checkpoints: updatedCheckpoints });
                      }}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border p-2.5 text-xs transition ${
                        cp.isCompleted
                          ? 'border-emerald-200 bg-emerald-50/50 text-slate-800 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-slate-200'
                          : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={cp.isCompleted}
                          onChange={() => {}}
                          className="rounded text-red-600"
                        />
                        <span className={cp.isCompleted ? 'line-through text-slate-400 font-medium' : 'font-bold'}>
                          {cp.title}
                        </span>
                      </div>
                      {cp.targetDate && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          Target: {cp.targetDate}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add new checkpoint inline form */}
                <form onSubmit={handleAddCheckpointSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Tambah checkpoint baru (cth: UAT Client Signed)..."
                    value={newCheckpointTitle}
                    onChange={e => setNewCheckpointTitle(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs focus:border-red-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                  />
                  <input
                    type="date"
                    value={newCheckpointDate}
                    onChange={e => setNewCheckpointDate(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-xs focus:border-red-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                  />
                  <button
                    type="submit"
                    disabled={!newCheckpointTitle.trim()}
                    className="rounded-xl bg-slate-950 px-3 py-1.5 text-xs font-bold text-white hover:bg-black disabled:opacity-50"
                  >
                    + Tambah
                  </button>
                </form>
              </div>

              {/* FITUR REPORT DENGAN CHAT & NOTES (DISCUSSION STREAM) */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-850">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-red-600" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Laporan Progres, Catatan & Kendala Blocker
                  </h4>
                </div>

                {/* Form to submit new report */}
                <form onSubmit={handleAddReportSubmit} className="space-y-2 mb-4 bg-slate-50 p-3 rounded-2xl dark:bg-slate-800/60">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">Tipe Laporan:</span>
                    <button
                      type="button"
                      onClick={() => setReportType('progress_update')}
                      className={`rounded-lg px-2 py-1 font-bold text-[11px] transition ${
                        reportType === 'progress_update'
                          ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-900'
                          : 'bg-white text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      🚀 Progres
                    </button>
                    <button
                      type="button"
                      onClick={() => setReportType('blocker')}
                      className={`rounded-lg px-2 py-1 font-bold text-[11px] transition ${
                        reportType === 'blocker'
                          ? 'bg-red-600 text-white'
                          : 'bg-white text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      ⚠️ Blocker
                    </button>
                    <button
                      type="button"
                      onClick={() => setReportType('note')}
                      className={`rounded-lg px-2 py-1 font-bold text-[11px] transition ${
                        reportType === 'note'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      📝 Catatan
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <textarea
                      placeholder="Tulis update progres milestone, status penanganan kendala, atau catatan kerja..."
                      value={reportContent}
                      onChange={e => setReportContent(e.target.value)}
                      rows={2}
                      className="flex-1 rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-red-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 resize-none"
                    />
                    <button
                      type="submit"
                      disabled={!reportContent.trim()}
                      className="self-end rounded-xl bg-slate-950 p-2.5 text-white hover:bg-black disabled:opacity-40"
                      title="Kirim Laporan"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </form>

                {/* Reports Feed */}
                <div className="space-y-2.5 max-h-56 overflow-y-auto">
                  {(selectedTask.reports || []).length === 0 ? (
                    <p className="text-center text-xs text-slate-400 py-4">
                      Belum ada laporan atau catatan progres untuk task ini.
                    </p>
                  ) : (
                    (selectedTask.reports || []).map(rep => (
                      <div
                        key={rep.id}
                        className={`rounded-xl p-3 text-xs border ${
                          rep.type === 'blocker'
                            ? 'border-red-200 bg-red-50/60 dark:border-red-900/40 dark:bg-red-950/20'
                            : rep.type === 'progress_update'
                            ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20'
                            : 'border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <img src={rep.authorAvatar} alt="" className="h-4 w-4 rounded-full object-cover" />
                            <span className="font-bold text-slate-900 dark:text-white">{rep.authorName}</span>
                            <span
                              className={`rounded px-1.5 py-0.2 text-[9px] font-extrabold uppercase ${
                                rep.type === 'blocker'
                                  ? 'bg-red-600 text-white'
                                  : rep.type === 'progress_update'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-blue-600 text-white'
                              }`}
                            >
                              {rep.type === 'blocker' ? 'BLOCKER' : rep.type === 'progress_update' ? 'PROGRES' : 'CATATAN'}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {new Date(rep.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap pl-5">
                          {rep.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              <button
                onClick={() => setSelectedTask(null)}
                className="rounded-xl bg-slate-950 px-5 py-2 text-xs font-bold text-white hover:bg-black transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. MINI REPORT MODAL (RINGKASAN EKSEKUTIF CAPAIAN TIM) */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileBarChart className="h-5 w-5 text-red-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Laporan Ringkas Kinerja & Milestones Tim
                </h3>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  Divisi: {activeGroupId === 'all' ? 'Seluruh Divisi Perusahaan' : TASK_GROUPS.find(g => g.id === activeGroupId)?.name}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Periode Sprint: Q4 2026 • Dihasilkan otomatis oleh WORKSPACE Operating System
                </div>
              </div>

              {/* Metrics Breakdown */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-slate-200 p-2.5 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400">Total Deliverables</div>
                  <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1">{totalTasks} Task</div>
                </div>
                <div className="rounded-xl border border-slate-200 p-2.5 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400">Tingkat Penyelesaian</div>
                  <div className="text-base font-extrabold text-emerald-600 mt-1">{completionPercentage}%</div>
                </div>
                <div className="rounded-xl border border-slate-200 p-2.5 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400">Milestone Checkpoint</div>
                  <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1">{completedCheckpoints}/{totalCheckpoints}</div>
                </div>
              </div>

              {/* Status List */}
              <div className="space-y-2">
                <div className="font-bold text-slate-700 dark:text-slate-300">
                  Ringkasan Task Kunci:
                </div>
                {groupFilteredTasks.slice(0, 5).map(t => (
                  <div key={t.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-[11px]">
                    <span className="font-medium truncate max-w-[280px] text-slate-800 dark:text-slate-200">{t.title}</span>
                    <span className="font-bold text-slate-600 dark:text-slate-400 uppercase">{t.status}</span>
                  </div>
                ))}
              </div>

              {/* Email Dispatch Section to Manager & CC (Requested Feature) */}
              <div className="rounded-2xl border border-blue-200/80 bg-blue-50/50 p-4 dark:border-blue-900/40 dark:bg-blue-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-bold text-slate-900 dark:text-white">
                      Kirim Laporan Lengkap ke Email Manager & Tim
                    </span>
                  </div>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                    Otomatisasi Email
                  </span>
                </div>

                {reportEmailSentSuccess && (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-2.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 animate-in fade-in">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Laporan berhasil dikirimkan ke email Manager & seluruh penerima CC!</span>
                  </div>
                )}

                {/* Manager Target Input */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kirim ke Email Manager Utama:
                  </label>
                  <select
                    value={reportTargetManagerEmail || (managersList[0]?.email || '')}
                    onChange={e => setReportTargetManagerEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {managersList.map(m => (
                      <option key={m.id} value={m.email}>
                        {m.name} ({m.position} • {m.email})
                      </option>
                    ))}
                    <option value="custom">-- Masukkan Alamat Lain --</option>
                  </select>
                  {reportTargetManagerEmail === 'custom' && (
                    <input
                      type="email"
                      placeholder="Masukkan alamat email manager (contoh: vp@perusahaan.com)"
                      onChange={e => setReportTargetManagerEmail(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  )}
                </div>

                {/* CC Recipients Section */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Penerima CC (Tembusan Rekan / Pimpinan):
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {reportCcList.map((cc, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 border border-slate-200 shadow-2xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                      >
                        <span>{cc}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCc(cc)}
                          className="text-slate-400 hover:text-rose-500 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      placeholder="Tambah email CC (misal: dirut@asliri.id, finance@asliri.id)..."
                      value={reportCcInput}
                      onChange={e => setReportCcInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCc();
                        }
                      }}
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddCc}
                      className="rounded-xl bg-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 transition cursor-pointer"
                    >
                      Tambah CC
                    </button>
                  </div>
                </div>

                {/* Send Button */}
                <button
                  type="button"
                  onClick={handleSendReportEmail}
                  disabled={isSendingReportEmail}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-blue-700 active:scale-98 transition disabled:opacity-50 cursor-pointer"
                >
                  <Mail className="h-4 w-4" />
                  <span>
                    {isSendingReportEmail
                      ? 'Mengirim Laporan...'
                      : `Kirim Laporan Lengkap via Email (${reportCcList.length} CC)`}
                  </span>
                </button>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Cetak Ringkasan</span>
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="rounded-xl bg-slate-950 dark:bg-white px-4 py-1.5 text-xs font-bold text-white dark:text-slate-950 hover:bg-black dark:hover:bg-slate-200 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. MODAL KIRIM CARD KE GROUP UNTUK APPROVAL MANAJER */}
      {approvalModalTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xs">
                  <Send className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Kirim Card ke Group untuk Approval
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Kirim kartu tugas terstruktur ke channel dengan tombol Setujui/Tolak otomatis
                  </p>
                </div>
              </div>
              <button
                onClick={() => setApprovalModalTask(null)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {/* Task summary preview formatted exactly like Chat Approval Card */}
              <div className="rounded-2xl border border-amber-300/80 bg-linear-to-br from-amber-500/10 via-amber-500/5 to-slate-900/10 p-4 space-y-3 dark:border-amber-600/40">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">
                    <FileBarChart className="h-4 w-4" />
                    <span>Card Approval Tugas (Tampilan di Chat)</span>
                  </span>
                  <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300">
                    ON REVIEW
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white line-clamp-1">
                    {approvalModalTask.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                    {approvalModalTask.project} • Assignee: <strong>{approvalModalTask.assigneeName}</strong>
                  </p>
                  {approvalModalTask.deadline && (
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Deadline: {approvalModalTask.deadline}
                    </p>
                  )}
                </div>

                {/* Simulated action buttons */}
                <div className="pt-2 border-t border-amber-200/60 dark:border-slate-800 flex items-center gap-2">
                  <div className="flex-1 rounded-xl bg-white/70 dark:bg-slate-800 py-1.5 text-[11px] font-bold text-center text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    ✕ Tolak
                  </div>
                  <div className="flex-1 rounded-xl bg-emerald-500 py-1.5 text-[11px] font-black text-center text-white shadow-xs">
                    ✓ Setujui (Approve)
                  </div>
                </div>
              </div>

              {/* Target Channel Selector */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Pilih Channel / Grup Tujuan *
                </label>
                <select
                  value={approvalChannelId}
                  onChange={e => setApprovalChannelId(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-2xs focus:border-blue-500 focus:outline-none cursor-pointer"
                >
                  {channels.map(c => (
                    <option key={c.id} value={c.id}>
                      #{c.name} ({c.type === 'channel' ? 'Channel Tim' : 'Pesan Langsung'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Managers / Approvers Multi-Selection */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Pilih Manajer Penyetuju (Bisa lebih dari 1)
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {users
                    .filter(u => u.role === 'manager' || u.role === 'super_admin' || u.role === 'admin' || u.id !== currentUser.id)
                    .map(m => {
                      const isSelected = approvalManagerIds.includes(m.id);
                      return (
                        <div
                          key={m.id}
                          onClick={() => {
                            if (isSelected) {
                              setApprovalManagerIds(approvalManagerIds.filter(id => id !== m.id));
                            } else {
                              setApprovalManagerIds([...approvalManagerIds, m.id]);
                            }
                          }}
                          className={`flex cursor-pointer items-center justify-between rounded-xl border p-2.5 transition ${
                            isSelected
                              ? 'border-blue-300 bg-blue-50/80 text-blue-950 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-200'
                              : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="rounded text-blue-600 pointer-events-none"
                            />
                            <img src={m.avatar} alt="" className="h-6 w-6 rounded-full object-cover" />
                            <div>
                              <div className="font-bold leading-none">{m.name}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">{m.department} • {m.role}</div>
                            </div>
                          </div>
                          {isSelected && (
                            <span className="text-[10px] font-bold text-blue-600">Dipilih</span>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-[11px] text-amber-800 dark:bg-amber-950/40 dark:text-amber-200 border border-amber-200 dark:border-amber-900/60">
                💡 <strong>Catatan Sistem:</strong> Ketika semua manajer yang dipilih memberikan persetujuan (Approve), kartu ini akan <strong>secara otomatis dipindahkan ke status Done (Selesai)</strong>.
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setApprovalModalTask(null)}
                className="rounded-2xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetChn = channels.find(c => c.id === approvalChannelId) || channels[0];
                  // If no specific manager was checked, default to managers in system
                  const finalManagerIds = approvalManagerIds.length > 0
                    ? approvalManagerIds
                    : users.filter(u => u.role === 'manager' || u.role === 'super_admin').map(u => u.id).slice(0, 2);

                  sendTaskForApproval(approvalModalTask.id, targetChn.id, finalManagerIds);
                  setApprovalModalTask(null);
                  setApprovalManagerIds([]);
                }}
                className="rounded-2xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-md transition cursor-pointer"
              >
                Kirim Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
