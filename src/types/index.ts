export type UserRole = 'super_admin' | 'admin' | 'manager' | 'employee';

export type AvailabilityStatus = 'online' | 'busy' | 'away' | 'in_meeting' | 'offline';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  department: string;
  position: string;
  phone: string;
  location: string;
  status: AvailabilityStatus;
  bio?: string;
  skills?: string[];
  managerId?: string;
  directReports?: string[];
  joinedDate: string;
}

export type PostType = 'standard' | 'announcement' | 'poll';

export interface PollOption {
  id: string;
  text: string;
  votes: string[]; // user IDs who voted
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  content: string;
  createdAt: string;
  likes: string[];
}

export interface Attachment {
  name: string;
  url: string;
  type: 'image' | 'pdf' | 'document' | 'archive';
  size: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  authorDept: string;
  content: string;
  type: PostType;
  pollOptions?: PollOption[];
  attachments?: Attachment[];
  likes: string[]; // user IDs
  bookmarks: string[];
  reposts: string[];
  comments: Comment[];
  tags: string[];
  category: 'general' | 'announcements' | 'tech' | 'hr' | 'culture';
  isPinned?: boolean;
  createdAt: string;
}

export type TaskStatus =
  | 'not_started'
  | 'on_progress'
  | 'on_review'
  | 'done'
  | 'backlog'
  | 'todo'
  | 'in_progress'
  | 'review';

export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface TaskActivity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
}

export interface TaskComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
}

export interface TaskCheckpoint {
  id: string;
  title: string;
  isCompleted: boolean;
  completedAt?: string;
  targetDate?: string;
}

export interface TaskReportItem {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  type: 'progress_update' | 'blocker' | 'note';
  content: string;
  createdAt: string;
}

export interface VideoDraftScene {
  id: string;
  sceneNumber: number; // 1 to 7+
  title: string;
  visualDirection: string;
  audioScript: string;
  durationText?: string; // e.g. "00:05"
  referenceImageUrl?: string;
  googleLinks?: {
    type: 'drive' | 'docs' | 'sheets' | 'youtube' | 'figma' | 'other';
    title: string;
    url: string;
  }[];
}

export interface TaskApproval {
  id: string;
  managerId: string;
  managerName: string;
  managerRole?: string;
  managerAvatar?: string;
  status: 'pending' | 'approved' | 'declined';
  comment?: string;
  timestamp?: string;
}

export interface TaskApprovalRequest {
  targetChannelId?: string;
  targetChannelName?: string;
  targetGroupId?: string;
  requestedAt: string;
  requestedBy: string;
  requestedByName: string;
  status: 'pending' | 'approved' | 'declined';
  requiredApprovals: TaskApproval[];
}

export interface HuddleParticipant {
  id: string;
  name: string;
  avatar: string;
  role: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isSpeaking: boolean;
  isScreenSharing?: boolean;
}

export interface ActiveHuddle {
  id: string;
  title: string;
  type: 'channel' | 'direct' | 'division';
  targetId: string;
  startedAt: string;
  participants: HuddleParticipant[];
  isMinimized: boolean;
  isVoiceOnly?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  assigneeName: string;
  assigneeAvatar: string;
  assigneeDept: string;
  reporterId: string;
  reporterName: string;
  project: string;
  groupId?: string; // Department / Group ID e.g. 'tech', 'product', 'hr', 'marketing', 'finance'
  groupName?: string;
  deadline: string;
  startDate?: string;
  progressPercent?: number;
  letterIndex?: string; // e.g. 'A', 'B', 'C', 'D' for Gantt visualization matching ref
  labels: string[];
  checklists: ChecklistItem[];
  checkpoints?: TaskCheckpoint[]; // Key milestones to track where project is
  reports?: TaskReportItem[]; // Progress notes, blocker reports, chats on task
  videoDraftScenes?: VideoDraftScene[]; // Storyboard & scene breakdown (Scene 1-7)
  approvalRequest?: TaskApprovalRequest; // Manager approval workflow
  attachments?: Attachment[];
  comments: TaskComment[];
  activity: TaskActivity[];
  estimatedHours?: number;
  completedAt?: string;
  isArchived?: boolean;
  archivedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export type ChannelType = 'channel' | 'direct';

export interface Reaction {
  emoji: string;
  userIds: string[];
}

export interface StickerData {
  id: string;
  text?: string;
  emoji?: string;
  imageUrl?: string;
  type?: 'badge' | 'custom_photo';
  style?: 'neon' | 'gold' | 'stamp' | 'emerald' | 'cyan' | 'bubble' | 'custom_photo';
  authorName?: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  createdAt: string;
  replyToId?: string;
  replyToText?: string;
  reactions: Reaction[];
  attachments?: Attachment[];
  imageUrl?: string;
  attachedTask?: Task;
  isPinned?: boolean;
  isStarred?: boolean;
  voiceNote?: {
    duration: string;
    url: string;
  };
  sticker?: StickerData;
  isSystem?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  description?: string;
  isPrivate?: boolean;
  avatar?: string;
  coverUrl?: string;
  isStarred?: boolean;
  pinnedMessageIds?: string[];
  memberIds: string[];
  dept?: string;
  unreadCount?: number;
  lastMessage?: string;
  lastMessageTime?: string;
  otherUserId?: string; // For 1-on-1 direct messages
}

export interface BrandDriveFolder {
  id: string;
  brandName: string;
  brandCode: string;
  folderTitle: string;
  description: string;
  category: 'creative_assets' | 'campaigns' | 'raw_footage' | 'brand_guidelines' | 'finance_legal';
  color: string;
  googleDriveUrl: string;
  itemCount: number;
  storageUsed: string;
  lastUpdated: string;
  managerName: string;
  managerAvatar: string;
  tags: string[];
  isStarred?: boolean;
}

export type MeetingStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface ActionItem {
  id: string;
  text: string;
  assigneeName?: string;
  assigneeId?: string;
  isConvertedToTask?: boolean;
  taskId?: string;
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location: string;
  meetLink?: string;
  organizerId: string;
  organizerName: string;
  organizerAvatar: string;
  attendees: {
    userId: string;
    name: string;
    avatar: string;
    role: string;
    status: 'accepted' | 'tentative' | 'declined';
  }[];
  agenda: string[];
  notes?: string;
  actionItems: ActionItem[];
  status: MeetingStatus;
  department?: string;
  createdAt: string;
}

export type DocCategory = 'sop' | 'guideline' | 'architecture' | 'handbook' | 'template' | 'legal';
export type DocAccessRole = 'all' | 'manager' | 'admin';

export interface DocumentItem {
  id: string;
  title: string;
  description: string;
  category: DocCategory;
  fileName: string;
  fileSize: string;
  fileType: 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'zip';
  version: string;
  uploadedBy: string;
  uploaderName: string;
  uploaderAvatar: string;
  accessRole: DocAccessRole;
  isStarred: boolean;
  downloadsCount: number;
  tags: string[];
  updatedAt: string;
  createdAt: string;
  contentPreview?: string;
}

export type NotificationType = 'chat' | 'mention' | 'task' | 'meeting' | 'announcement';

export interface NotificationItem {
  id: string;
  recipientId: string;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  targetTab?: string;
  read: boolean;
  createdAt: string;
}

export type AccentColor = 'navy-crimson' | 'royal-blue' | 'emerald' | 'purple' | 'amber';
export type CardRadius = 'sharp' | 'rounded' | 'smooth' | 'pill';
export type BackgroundPattern = 'clean' | 'dots' | 'mesh' | 'grid' | 'aurora-glow';

export interface DivisionItem {
  id: string;
  name: string;
  departmentMatch: string;
  leadName: string;
  leadRole: string;
  leadAvatar: string;
  color: string;
  bannerGradient: string;
  description: string;
  createdAt?: string;
}

export interface ThemeSettings {
  mode: 'light' | 'dark';
  accentColor: AccentColor;
  sidebarCollapsed: boolean;
  density: 'comfortable' | 'compact';
  cardRadius: CardRadius;
  bgPattern: BackgroundPattern;
  customPrimaryColor?: string;
  customAccentColor?: string;
  chatBubbleColor?: 'navy' | 'red' | 'blue' | 'emerald' | 'purple' | 'amber' | 'custom';
  customChatBubbleColor?: string;
  fontSize?: 'small' | 'normal' | 'large';
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  resource: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface WorkspaceInfo {
  name: string;
  logoUrl?: string;
  tagline: string;
  orgDomain: string;
  timezone: string;
  loginBgStyle?: 'sky' | 'deep-navy' | 'aurora' | 'geometric-grid' | 'modern-office' | 'custom-image';
  loginBgCustomUrl?: string;
  loginBgBlur?: number;
  loginBgOverlayOpacity?: number;
}

