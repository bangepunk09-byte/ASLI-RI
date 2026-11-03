import { User, Post, Task, Channel, ChatMessage, Meeting, DocumentItem, NotificationItem, AuditLog, WorkspaceInfo, DivisionItem } from '../types';

export const INITIAL_WORKSPACE_INFO: WorkspaceInfo = {
  name: 'ASLI GROUP',
  tagline: 'Corporate Collaboration Hub',
  orgDomain: 'asliri.id',
  logoUrl: '',
  timezone: 'Asia/Jakarta (WIB)',
  loginBgStyle: 'sky',
  loginBgCustomUrl: '',
  loginBgBlur: 0,
  loginBgOverlayOpacity: 30
};

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_saeful',
    name: 'Saeful Rohman',
    email: 'saeful.rohman@asliri.id',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    role: 'super_admin',
    department: 'Technology & Engineering',
    position: 'VP of Technology & Digital Innovation',
    phone: '+62 812-9845-7721',
    location: 'Headquarters - Jakarta (Tower A, Lt. 18)',
    status: 'online',
    bio: 'Fokus pada arsitektur skala enterprise, integrasi identitas digital, keandalan sistem cloud, dan transformasi AI modern.',
    skills: ['System Architecture', 'Cloud Infrastructure', 'Cybersecurity', 'Executive Leadership', 'AI Systems'],
    directReports: ['usr_budi', 'usr_citra', 'usr_hendra'],
    joinedDate: '2021-03-15',
  },
  {
    id: 'usr_nadia',
    name: 'Nadia Putri',
    email: 'nadia.putri@workspace.corp',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
    role: 'manager',
    department: 'Product & Design',
    position: 'Lead Product Manager & Design Director',
    phone: '+62 811-2345-6789',
    location: 'Headquarters - Jakarta (Tower A, Lt. 16)',
    status: 'in_meeting',
    bio: 'Menjembatani pengalaman pengguna kelas dunia dengan metrik pertumbuhan produk dan kolaborasi lintas departemen.',
    skills: ['Product Strategy', 'UI/UX Design Systems', 'Agile Scrum', 'User Research', 'Design Sprint'],
    managerId: 'usr_saeful',
    directReports: ['usr_dimas'],
    joinedDate: '2022-01-10',
  },
  {
    id: 'usr_budi',
    name: 'Budi Santoso',
    email: 'budi.santoso@workspace.corp',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    role: 'admin',
    department: 'Technology & Engineering',
    position: 'Principal Software Engineer',
    phone: '+62 813-8899-1122',
    location: 'Headquarters - Jakarta / Hybrid',
    status: 'online',
    bio: 'Tech lead untuk backend core, microservices event-driven, dan optimalisasi database throughput tinggi.',
    skills: ['Go', 'TypeScript', 'PostgreSQL', 'Kafka', 'Kubernetes', 'Clean Architecture'],
    managerId: 'usr_saeful',
    joinedDate: '2021-08-01',
  },
  {
    id: 'usr_rina',
    name: 'Rina Wijaya',
    email: 'rina.wijaya@workspace.corp',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
    role: 'manager',
    department: 'People Operations & Culture',
    position: 'Head of People Operations',
    phone: '+62 815-4433-2211',
    location: 'Headquarters - Jakarta (Tower A, Lt. 12)',
    status: 'busy',
    bio: 'Membangun lingkungan kerja kolaboratif, transparan, berkembang, dan sehat secara mental bagi seluruh talenta perusahaan.',
    skills: ['Talent Development', 'People Analytics', 'Compensation & Benefits', 'Conflict Resolution', 'Internal Communications'],
    joinedDate: '2021-11-20',
  },
  {
    id: 'usr_dimas',
    name: 'Dimas Aditya',
    email: 'dimas.aditya@workspace.corp',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
    role: 'employee',
    department: 'Marketing & Brand',
    position: 'Senior Product Marketing Specialist',
    phone: '+62 812-7766-5544',
    location: 'Bandung Office Hub',
    status: 'away',
    bio: 'Mengelola komunikasi peluncuran produk enterprise, kampanye B2B, dan konten edukasi solusi digital.',
    skills: ['B2B Marketing', 'Content Strategy', 'Copywriting', 'SEO', 'Product Storytelling'],
    managerId: 'usr_nadia',
    joinedDate: '2023-04-12',
  },
  {
    id: 'usr_citra',
    name: 'Citra Lestari',
    email: 'citra.lestari@workspace.corp',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80',
    role: 'employee',
    department: 'Technology & Engineering',
    position: 'Senior AI & Data Engineer',
    phone: '+62 819-3322-1100',
    location: 'Yogyakarta Tech Center',
    status: 'online',
    bio: 'Menerapkan model AI multimodal, pipeline data real-time, dan machine learning ops untuk otomasi proses bisnis.',
    skills: ['Python', 'LLM Fine-tuning', 'Vector Databases', 'PyTorch', 'Data Warehousing'],
    managerId: 'usr_saeful',
    joinedDate: '2023-09-01',
  },
  {
    id: 'usr_hendra',
    name: 'Hendra Kurniawan',
    email: 'hendra.kurniawan@workspace.corp',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80',
    role: 'employee',
    department: 'Technology & Engineering',
    position: 'DevOps & Site Reliability Architect',
    phone: '+62 818-5544-3322',
    location: 'Headquarters - Jakarta (Tower A, Lt. 18)',
    status: 'online',
    bio: 'Menjaga uptime 99.99%, otomatisasi CI/CD zero-downtime, dan kepatuhan standar keamanan infrastruktur cloud.',
    skills: ['Terraform', 'GCP', 'AWS', 'Docker', 'Prometheus', 'Chaos Engineering'],
    managerId: 'usr_saeful',
    joinedDate: '2022-06-15',
  },
  {
    id: 'usr_maya',
    name: 'Maya Anggraini',
    email: 'maya.anggraini@workspace.corp',
    avatar: 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?auto=format&fit=crop&w=256&h=256&q=80',
    role: 'manager',
    department: 'Finance & Legal Governance',
    position: 'Head of Legal & Compliance',
    phone: '+62 811-9988-7766',
    location: 'Headquarters - Jakarta (Tower A, Lt. 20)',
    status: 'offline',
    bio: 'Kepatuhan regulasi perbankan/fintech, sertifikasi ISO 27001, audit data privacy, dan kontrak kerjasama strategis.',
    skills: ['Enterprise Law', 'ISO 27001 Compliance', 'Data Protection Law', 'Contract Negotiation'],
    joinedDate: '2021-05-10',
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    authorId: 'usr_saeful',
    authorName: 'Saeful Rohman',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    authorRole: 'VP of Technology & Digital Innovation',
    authorDept: 'Technology & Engineering',
    content: '🚀 **Pengumuman Resmi: Peluncuran WORKSPACE Corporate Hub v2.4**\n\nSelamat pagi rekan-rekan! Hari ini kita resmi merilis platform kerja internal baru perusahaan kita. Platform ini menyatukan percakapan chat, dokumen resmi, board task kanban, dan kalender meeting dalam satu sistem terintegrasi yang aman dan cepat.\n\nMohon feedback dan saran di kolom komentar atau via channel #general-announcements. Terima kasih atas kerja keras seluruh tim!',
    type: 'announcement',
    isPinned: true,
    category: 'announcements',
    tags: ['Announcement', 'WorkspaceLaunch', 'AllHands', 'Productivity'],
    likes: ['usr_nadia', 'usr_budi', 'usr_rina', 'usr_citra', 'usr_hendra', 'usr_dimas'],
    bookmarks: ['usr_nadia', 'usr_budi'],
    reposts: ['usr_nadia', 'usr_rina'],
    createdAt: '2026-11-01T08:30:00Z',
    attachments: [
      {
        name: 'Workspace_Architecture_Overview_v2.4.pdf',
        url: '#',
        type: 'pdf',
        size: '3.4 MB'
      }
    ],
    comments: [
      {
        id: 'c_1',
        postId: 'post_1',
        authorId: 'usr_nadia',
        authorName: 'Nadia Putri',
        authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
        authorRole: 'Lead Product Manager',
        content: 'Luar biasa tim Tech & Design! Desainnya jauh lebih clean dan responsive di smartphone. Akses dari lapangan jadi super lancar 👏',
        createdAt: '2026-11-01T08:45:00Z',
        likes: ['usr_saeful', 'usr_budi']
      },
      {
        id: 'c_2',
        postId: 'post_1',
        authorId: 'usr_budi',
        authorName: 'Budi Santoso',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
        authorRole: 'Principal Software Engineer',
        content: 'Latensi pesan real-time turun di bawah 50ms berkat arsitektur event stream baru. Siap support ribuan daily concurrent users!',
        createdAt: '2026-11-01T09:00:00Z',
        likes: ['usr_saeful', 'usr_hendra']
      }
    ]
  },
  {
    id: 'post_2',
    authorId: 'usr_budi',
    authorName: 'Budi Santoso',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    authorRole: 'Principal Software Engineer',
    authorDept: 'Technology & Engineering',
    content: '📊 **Quick Poll untuk Tim Engineering & DevOps**:\n\nUntuk sistem antrian tugas background (Background Job & Webhook processor) pada microservices Q4, pendekatan apa yang paling ingin kita prioritaskan untuk standarisasi perusahaan?',
    type: 'poll',
    isPinned: false,
    category: 'tech',
    tags: ['Engineering', 'Architecture', 'TechPoll', 'DevOps'],
    pollOptions: [
      { id: 'opt_1', text: 'Apache Kafka + Strimzi Operator', votes: ['usr_budi', 'usr_hendra', 'usr_citra'] },
      { id: 'opt_2', text: 'RabbitMQ Enterprise Cluster', votes: ['usr_saeful'] },
      { id: 'opt_3', text: 'Cloud Pub/Sub Serverless Managed', votes: ['usr_dimas'] }
    ],
    likes: ['usr_saeful', 'usr_citra', 'usr_hendra'],
    bookmarks: ['usr_citra'],
    reposts: [],
    createdAt: '2026-11-01T10:15:00Z',
    comments: [
      {
        id: 'c_3',
        postId: 'post_2',
        authorId: 'usr_hendra',
        authorName: 'Hendra Kurniawan',
        authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80',
        authorRole: 'DevOps Architect',
        content: 'Vote Kafka untuk event-replay capability saat audit security log!',
        createdAt: '2026-11-01T10:20:00Z',
        likes: ['usr_budi']
      }
    ]
  },
  {
    id: 'post_3',
    authorId: 'usr_rina',
    authorName: 'Rina Wijaya',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
    authorRole: 'Head of People Operations',
    authorDept: 'People Operations & Culture',
    content: '🌿 **Kebijakan Wellness Day & Pembaruan Asuransi Kesehatan 2026**\n\nHalo rekan-rekan WORKSPACE! Kami telah memperbarui pedoman manfaat karyawan di Document Center. Kini setiap karyawan berhak atas 1 hari Wellness Leave per kuartal serta klaim kacamata yang ditingkatkan.\n\nSilakan cek dokumen "SOP-HR-2026-04" di tab Documents untuk panduan lengkap pengajuannya.',
    type: 'standard',
    isPinned: false,
    category: 'hr',
    tags: ['PeopleOps', 'Wellness', 'Benefits', 'Culture'],
    likes: ['usr_saeful', 'usr_nadia', 'usr_dimas', 'usr_citra', 'usr_maya'],
    bookmarks: ['usr_dimas', 'usr_citra'],
    reposts: ['usr_dimas'],
    createdAt: '2026-10-31T14:00:00Z',
    comments: []
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'tsk_1',
    title: 'Finalisasi Audit Keamanan ISO 27001 & Penetration Testing Report',
    description: 'Meninjau hasil temuan vulnerability assessment dari konsultan eksternal dan melengkapi dokumen mitigasi penutupan celah keamanan sebelum batas waktu re-audit.',
    status: 'on_progress',
    priority: 'urgent',
    assigneeId: 'usr_saeful',
    assigneeName: 'Saeful Rohman',
    assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    assigneeDept: 'Technology & Engineering',
    reporterId: 'usr_maya',
    reporterName: 'Maya Anggraini',
    project: 'Security & Compliance 2026',
    groupId: 'tech',
    groupName: 'Technology & Engineering',
    deadline: '2026-11-04',
    labels: ['Security', 'Audit', 'ISO27001', 'High-Priority'],
    checklists: [
      { id: 'chk_1', text: 'Tinjau laporan temuan OWASP Top 10', completed: true },
      { id: 'chk_2', text: 'Patch dependency library di microservice auth', completed: true },
      { id: 'chk_3', text: 'Tandatangani Berita Acara Rekomendasi bersama Tim Legal', completed: false },
      { id: 'chk_4', text: 'Upload dokumen sertifikasi final ke Document Center', completed: false }
    ],
    checkpoints: [
      { id: 'cp_1', title: '1. Audit Celah OWASP', isCompleted: true, completedAt: '2026-10-30', targetDate: '2026-10-31' },
      { id: 'cp_2', title: '2. Patching Celah Critical', isCompleted: true, completedAt: '2026-11-01', targetDate: '2026-11-02' },
      { id: 'cp_3', title: '3. Legal Signing Berita Acara', isCompleted: false, targetDate: '2026-11-04' },
      { id: 'cp_4', title: '4. Penerbitan Sertifikat Resmi', isCompleted: false, targetDate: '2026-11-06' }
    ],
    reports: [
      {
        id: 'rep_1',
        authorId: 'usr_saeful',
        authorName: 'Saeful Rohman',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
        type: 'progress_update',
        content: 'Patch authentication microservice selesai di-deploy ke staging. Pentest ulang lolos 100% tanpa celah HIGH.',
        createdAt: '2026-11-01T10:30:00Z'
      },
      {
        id: 'rep_2',
        authorId: 'usr_maya',
        authorName: 'Maya Anggraini',
        authorAvatar: 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?auto=format&fit=crop&w=256&h=256&q=80',
        type: 'note',
        content: 'Draft dokumen ISO 27001 Bab 5 & 6 sudah diunggah ke Knowledge Base untuk cross-check.',
        createdAt: '2026-11-01T11:15:00Z'
      }
    ],
    comments: [
      {
        id: 'tc_1',
        userId: 'usr_maya',
        userName: 'Maya Anggraini',
        userAvatar: 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?auto=format&fit=crop&w=256&h=256&q=80',
        content: 'Dokumen legal addendum sudah siap di-review ya Pak Saeful.',
        timestamp: '2026-11-01T11:00:00Z'
      }
    ],
    activity: [
      { id: 'act_1', userId: 'usr_saeful', userName: 'Saeful Rohman', action: 'Memindahkan status ke In Progress', timestamp: '2026-11-01T09:10:00Z' }
    ],
    estimatedHours: 12,
    createdAt: '2026-10-28T09:00:00Z',
    updatedAt: '2026-11-01T11:00:00Z'
  },
  {
    id: 'tsk_2',
    title: 'Revamp Tampilan Mobile & Responsive Touch Controls',
    description: 'Menyempurnakan interaksi gesture, bottom sheet navigasi, dan optimasi sentuhan pada viewport mobile untuk karyawan lapangan.',
    status: 'on_progress',
    priority: 'high',
    assigneeId: 'usr_nadia',
    assigneeName: 'Nadia Putri',
    assigneeAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
    assigneeDept: 'Product & Design',
    reporterId: 'usr_saeful',
    reporterName: 'Saeful Rohman',
    project: 'WORKSPACE UI Polish',
    groupId: 'product',
    groupName: 'Product & Design',
    deadline: '2026-11-03',
    labels: ['UI/UX', 'Mobile', 'Tailwind', 'DesignSystem'],
    checklists: [
      { id: 'chk_5', text: 'Audit padding dan touch targets (min 44px)', completed: true },
      { id: 'chk_6', text: 'Bottom bar quick action menu', completed: true },
      { id: 'chk_7', text: 'Uji pada layar iPhone 15 & Samsung S24', completed: true },
      { id: 'chk_8', text: 'Validasi kontras warna dark/light mode', completed: false }
    ],
    checkpoints: [
      { id: 'cp_2_1', title: '1. Wireframe Bottom Navigation', isCompleted: true, completedAt: '2026-10-31', targetDate: '2026-10-31' },
      { id: 'cp_2_2', title: '2. Prototype Touch Feedback', isCompleted: true, completedAt: '2026-11-01', targetDate: '2026-11-02' },
      { id: 'cp_2_3', title: '3. Cross-Browser Device Test', isCompleted: false, targetDate: '2026-11-03' }
    ],
    reports: [
      {
        id: 'rep_2_1',
        authorId: 'usr_nadia',
        authorName: 'Nadia Putri',
        authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
        type: 'progress_update',
        content: 'Touch target bottom bar sudah diuji di resolusi 375px hingga 428px. Sangat responsif!',
        createdAt: '2026-11-01T14:00:00Z'
      }
    ],
    comments: [],
    activity: [],
    estimatedHours: 8,
    createdAt: '2026-10-30T10:00:00Z',
    updatedAt: '2026-11-01T14:30:00Z'
  },
  {
    id: 'tsk_3',
    title: 'Migrasi Database Cache ke Redis Cluster Multi-AZ',
    description: 'Melakukan failover testing dan benchmark read/write latency untuk menjamin nol downtime saat traffic spike.',
    status: 'on_review',
    priority: 'high',
    assigneeId: 'usr_hendra',
    assigneeName: 'Hendra Kurniawan',
    assigneeAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80',
    assigneeDept: 'Technology & Engineering',
    reporterId: 'usr_budi',
    reporterName: 'Budi Santoso',
    project: 'Core Infrastructure',
    groupId: 'tech',
    groupName: 'Technology & Engineering',
    deadline: '2026-11-05',
    labels: ['DevOps', 'Redis', 'Database', 'Cloud'],
    checklists: [
      { id: 'chk_9', text: 'Setup Terraform script cluster Redis', completed: true },
      { id: 'chk_10', text: 'Benchmark 50,000 req/sec', completed: true },
      { id: 'chk_11', text: 'Review konfigurasi security firewall VPC', completed: false }
    ],
    checkpoints: [
      { id: 'cp_3_1', title: '1. Provisioning Multi-AZ Nodes', isCompleted: true, completedAt: '2026-10-28', targetDate: '2026-10-29' },
      { id: 'cp_3_2', title: '2. Staging Load Testing 50k req/s', isCompleted: true, completedAt: '2026-10-31', targetDate: '2026-10-31' },
      { id: 'cp_3_3', title: '3. Production Traffic Cutover', isCompleted: false, targetDate: '2026-11-05' }
    ],
    reports: [
      {
        id: 'rep_3_1',
        authorId: 'usr_hendra',
        authorName: 'Hendra Kurniawan',
        authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80',
        type: 'progress_update',
        content: 'Latency p99 di 1.2ms. Tidak ada memory leak saat stress-test 6 jam non-stop.',
        createdAt: '2026-11-01T15:00:00Z'
      }
    ],
    comments: [],
    activity: [],
    estimatedHours: 16,
    createdAt: '2026-10-25T08:00:00Z',
    updatedAt: '2026-11-01T15:00:00Z'
  },
  {
    id: 'tsk_4',
    title: 'Integrasi Multi-Agent Vector Search untuk Document Center',
    description: 'Menambahkan kemampuan semantik pencarian cerdas berbasis embedding vektor sehingga dokumen SOP dapat dicari dengan bahasa sehari-hari.',
    status: 'not_started',
    priority: 'medium',
    assigneeId: 'usr_citra',
    assigneeName: 'Citra Lestari',
    assigneeAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80',
    assigneeDept: 'Technology & Engineering',
    reporterId: 'usr_saeful',
    reporterName: 'Saeful Rohman',
    project: 'AI Enterprise Search',
    groupId: 'tech',
    groupName: 'Technology & Engineering',
    deadline: '2026-11-08',
    labels: ['AI', 'Search', 'VectorDB', 'Embeddings'],
    checklists: [
      { id: 'chk_12', text: 'Indexing seluruh dokumen PDF SOP', completed: false },
      { id: 'chk_13', text: 'Benchmark retrieval accuracy', completed: false },
      { id: 'chk_14', text: 'Testing search bar autocomplete', completed: false }
    ],
    checkpoints: [
      { id: 'cp_4_1', title: '1. Pipeline Ekstraksi Teks PDF', isCompleted: false, targetDate: '2026-11-04' },
      { id: 'cp_4_2', title: '2. Embedding Generation & Vector Store', isCompleted: false, targetDate: '2026-11-06' },
      { id: 'cp_4_3', title: '3. Integrasi UI Search Box', isCompleted: false, targetDate: '2026-11-08' }
    ],
    reports: [],
    comments: [],
    activity: [],
    estimatedHours: 20,
    createdAt: '2026-10-29T13:00:00Z',
    updatedAt: '2026-10-29T13:00:00Z'
  },
  {
    id: 'tsk_5',
    title: 'Penyusunan Materi Townhall Q4 & Performance Review 2026',
    description: 'Menyiapkan deck presentasi capaian strategis perusahaan, roadmap 2027, dan timeline evaluasi kinerja tahunan bagi seluruh karyawan.',
    status: 'not_started',
    priority: 'medium',
    assigneeId: 'usr_rina',
    assigneeName: 'Rina Wijaya',
    assigneeAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
    assigneeDept: 'People Operations & Culture',
    reporterId: 'usr_saeful',
    reporterName: 'Saeful Rohman',
    project: 'Company Operations',
    groupId: 'hr',
    groupName: 'People Operations & Culture',
    deadline: '2026-11-10',
    labels: ['Townhall', 'Presentation', 'HR', 'AnnualReview'],
    checklists: [
      { id: 'chk_15', text: 'Kumpulkan KPI capaian dari tiap Head of Dept', completed: false },
      { id: 'chk_16', text: 'Finalisasi slide deck presentasi', completed: false }
    ],
    checkpoints: [
      { id: 'cp_5_1', title: '1. Pengumpulan Laporan Capaian Divisi', isCompleted: false, targetDate: '2026-11-05' },
      { id: 'cp_5_2', title: '2. Review Direksi & VP', isCompleted: false, targetDate: '2026-11-08' },
      { id: 'cp_5_3', title: '3. Gladi Bersih Townhall', isCompleted: false, targetDate: '2026-11-10' }
    ],
    reports: [],
    comments: [],
    activity: [],
    estimatedHours: 10,
    createdAt: '2026-10-31T09:00:00Z',
    updatedAt: '2026-10-31T09:00:00Z'
  },
  {
    id: 'tsk_6',
    title: 'Peluncuran Kampanye B2B Product Showcase & Case Study',
    description: 'Menulis artikel studi kasus implementasi platform di klien tier-1 dan mempublikasikan siaran pers ke media teknologi nasional.',
    status: 'done',
    priority: 'low',
    assigneeId: 'usr_dimas',
    assigneeName: 'Dimas Aditya',
    assigneeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
    assigneeDept: 'Marketing & Brand',
    reporterId: 'usr_nadia',
    reporterName: 'Nadia Putri',
    project: 'Brand & Growth',
    groupId: 'marketing',
    groupName: 'Marketing & Brand',
    deadline: '2026-10-30',
    labels: ['Marketing', 'PR', 'Content', 'CaseStudy'],
    checklists: [
      { id: 'chk_17', text: 'Wawancara dengan Project Manager klien', completed: true },
      { id: 'chk_18', text: 'Approval materi dari pihak Legal', completed: true },
      { id: 'chk_19', text: 'Distribusi rilis media', completed: true }
    ],
    checkpoints: [
      { id: 'cp_6_1', title: '1. Wawancara Narasumber Klien', isCompleted: true, completedAt: '2026-10-22', targetDate: '2026-10-22' },
      { id: 'cp_6_2', title: '2. Proofreading & Approval Legal', isCompleted: true, completedAt: '2026-10-28', targetDate: '2026-10-28' },
      { id: 'cp_6_3', title: '3. Siaran Pers Terpublikasi', isCompleted: true, completedAt: '2026-10-30', targetDate: '2026-10-30' }
    ],
    reports: [
      {
        id: 'rep_6_1',
        authorId: 'usr_dimas',
        authorName: 'Dimas Aditya',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
        type: 'progress_update',
        content: 'Rilis pers diliput 4 media nasional. Traffic landing page naik 42%!',
        createdAt: '2026-10-30T18:00:00Z'
      }
    ],
    comments: [],
    activity: [],
    estimatedHours: 14,
    completedAt: '2026-10-30T17:00:00Z',
    createdAt: '2026-10-20T11:00:00Z',
    updatedAt: '2026-10-30T17:00:00Z'
  },
  {
    id: 'tsk_7',
    title: 'Implementasi Single Sign-On (SSO) & Biometric Auth Gateway',
    description: 'Menambahkan autentikasi terpusat OpenID Connect / SAML 2.0 untuk seluruh aplikasi corporate tools.',
    status: 'not_started',
    priority: 'medium',
    assigneeId: 'usr_budi',
    assigneeName: 'Budi Santoso',
    assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    assigneeDept: 'Technology & Engineering',
    reporterId: 'usr_saeful',
    reporterName: 'Saeful Rohman',
    project: 'Security & Compliance 2026',
    groupId: 'tech',
    groupName: 'Technology & Engineering',
    deadline: '2026-11-20',
    labels: ['Auth', 'SSO', 'Identity', 'Security'],
    checklists: [
      { id: 'chk_20', text: 'Spesifikasi protocol SAML/OIDC', completed: false }
    ],
    checkpoints: [
      { id: 'cp_7_1', title: '1. Spesifikasi Protokol IdP', isCompleted: false, targetDate: '2026-11-12' },
      { id: 'cp_7_2', title: '2. Sandbox UAT Testing', isCompleted: false, targetDate: '2026-11-18' }
    ],
    reports: [],
    comments: [],
    activity: [],
    estimatedHours: 25,
    createdAt: '2026-10-27T14:00:00Z',
    updatedAt: '2026-10-27T14:00:00Z'
  },
  {
    id: 'tsk_8',
    title: 'Penyusunan Laporan Audit Pajak & Rekonsiliasi Finansial Q3',
    description: 'Melakukan rekonsiliasi arus kas operasional dan penyesuaian bukti potong faktur pajak korporat bersama konsultan akuntansi eksternal.',
    status: 'on_progress',
    priority: 'high',
    assigneeId: 'usr_maya',
    assigneeName: 'Maya Anggraini',
    assigneeAvatar: 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?auto=format&fit=crop&w=256&h=256&q=80',
    assigneeDept: 'Finance & Legal',
    reporterId: 'usr_saeful',
    reporterName: 'Saeful Rohman',
    project: 'Financial Integrity 2026',
    groupId: 'finance',
    groupName: 'Finance & Legal',
    deadline: '2026-11-06',
    labels: ['Finance', 'Tax', 'Audit', 'Q3Report'],
    checklists: [
      { id: 'chk_21', text: 'Rekonsiliasi rekening koran BCA & Mandiri', completed: true },
      { id: 'chk_22', text: 'Validasi e-Faktur Pajak Pertambahan Nilai', completed: true },
      { id: 'chk_23', text: 'Laporan tanda tangan CFO', completed: false }
    ],
    checkpoints: [
      { id: 'cp_8_1', title: '1. Rekonsiliasi Arus Kas Bank', isCompleted: true, completedAt: '2026-10-31', targetDate: '2026-10-31' },
      { id: 'cp_8_2', title: '2. Validasi e-Faktur Pajak', isCompleted: true, completedAt: '2026-11-01', targetDate: '2026-11-02' },
      { id: 'cp_8_3', title: '3. Approval CFO & Dirut', isCompleted: false, targetDate: '2026-11-06' }
    ],
    reports: [
      {
        id: 'rep_8_1',
        authorId: 'usr_maya',
        authorName: 'Maya Anggraini',
        authorAvatar: 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?auto=format&fit=crop&w=256&h=256&q=80',
        type: 'progress_update',
        content: 'Seluruh mutasi perbankan sudah klop 100%. Tinggal menunggu tanda tangan basah CFO besok siang.',
        createdAt: '2026-11-01T16:00:00Z'
      }
    ],
    comments: [],
    activity: [],
    estimatedHours: 12,
    createdAt: '2026-10-26T08:00:00Z',
    updatedAt: '2026-11-01T16:00:00Z'
  }
];

export const INITIAL_CHANNELS: Channel[] = [
  {
    id: 'chn_general',
    name: 'general-announcements',
    type: 'channel',
    description: 'Pengumuman resmi perusahaan, kabar korporat, dan berita organisasi penting.',
    isPrivate: false,
    memberIds: ['usr_saeful', 'usr_nadia', 'usr_budi', 'usr_rina', 'usr_dimas', 'usr_citra', 'usr_hendra', 'usr_maya'],
    unreadCount: 0,
    lastMessage: 'Dokumen panduan sudah bisa diunduh di tab Documents ya.',
    lastMessageTime: '09:20'
  },
  {
    id: 'chn_tech',
    name: 'tech-engineering',
    type: 'channel',
    description: 'Diskusi arsitektur kode, sprint engineering, review PR, dan deployment.',
    isPrivate: false,
    memberIds: ['usr_saeful', 'usr_budi', 'usr_citra', 'usr_hendra'],
    dept: 'Technology',
    unreadCount: 2,
    lastMessage: 'Cluster staging sudah ter-update dengan image Docker terbaru.',
    lastMessageTime: '11:15'
  },
  {
    id: 'chn_product',
    name: 'product-design',
    type: 'channel',
    description: 'Kolaborasi desain UI/UX, user feedback, wireframe, dan roadmap produk.',
    isPrivate: false,
    memberIds: ['usr_saeful', 'usr_nadia', 'usr_budi', 'usr_dimas'],
    dept: 'Product',
    unreadCount: 0,
    lastMessage: 'Figma prototype sudah sinkron dengan design token baru.',
    lastMessageTime: 'Kemarin'
  },
  {
    id: 'chn_titan',
    name: 'project-titan-q4',
    type: 'channel',
    description: 'Taskforce peluncuran sistem enterprise dan koordinasi lintas departemen.',
    isPrivate: true,
    memberIds: ['usr_saeful', 'usr_nadia', 'usr_budi', 'usr_rina', 'usr_maya'],
    unreadCount: 0,
    lastMessage: 'Meeting sinkronisasi kickoff jam 14:00 di Ruang Bimasakti.',
    lastMessageTime: 'Kemarin'
  },
  // Direct Messages
  {
    id: 'dm_nadia',
    name: 'Nadia Putri',
    type: 'direct',
    otherUserId: 'usr_nadia',
    memberIds: ['usr_saeful', 'usr_nadia'],
    unreadCount: 1,
    lastMessage: 'Pak Saeful, bisakah cek sebentar mockup dashboard task baru?',
    lastMessageTime: '11:42'
  },
  {
    id: 'dm_budi',
    name: 'Budi Santoso',
    type: 'direct',
    otherUserId: 'usr_budi',
    memberIds: ['usr_saeful', 'usr_budi'],
    unreadCount: 0,
    lastMessage: 'Siap Pak, PR backend sudah saya approve dan pass linting.',
    lastMessageTime: '10:05'
  },
  {
    id: 'dm_rina',
    name: 'Rina Wijaya',
    type: 'direct',
    otherUserId: 'usr_rina',
    memberIds: ['usr_saeful', 'usr_rina'],
    unreadCount: 0,
    lastMessage: 'Jadwal interview kandidat Lead Architect sudah saya kirimkan ke kalender.',
    lastMessageTime: '08:30'
  }
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  chn_tech: [
    {
      id: 'm_1',
      channelId: 'chn_tech',
      senderId: 'usr_saeful',
      senderName: 'Saeful Rohman',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
      content: 'Halo tim, pastikan semua endpoint API baru menggunakan validasi payload ketat dan rate limiter ya.',
      createdAt: '2026-11-01T10:00:00Z',
      reactions: [{ emoji: '👍', userIds: ['usr_budi', 'usr_hendra'] }]
    },
    {
      id: 'm_2',
      channelId: 'chn_tech',
      senderId: 'usr_budi',
      senderName: 'Budi Santoso',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
      content: 'Siap Pak Saeful, kami sudah terapkan middleware validasi Zod + rate limit 120 req/menit per API key.',
      createdAt: '2026-11-01T10:30:00Z',
      reactions: [{ emoji: '🚀', userIds: ['usr_saeful'] }]
    },
    {
      id: 'm_3',
      channelId: 'chn_tech',
      senderId: 'usr_hendra',
      senderName: 'Hendra Kurniawan',
      senderAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80',
      content: 'Cluster staging sudah ter-update dengan image Docker terbaru. CI/CD pipeline lulus 100% green tests! 🎯',
      createdAt: '2026-11-01T11:15:00Z',
      reactions: [{ emoji: '🎉', userIds: ['usr_saeful', 'usr_citra'] }]
    }
  ],
  chn_general: [
    {
      id: 'm_gen_1',
      channelId: 'chn_general',
      senderId: 'usr_rina',
      senderName: 'Rina Wijaya',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
      content: 'Selamat pagi semuanya! Jangan lupa mengisi presensi dan cek jadwal Townhall hari ini.',
      createdAt: '2026-11-01T08:00:00Z',
      reactions: [{ emoji: '☕', userIds: ['usr_saeful', 'usr_nadia', 'usr_dimas'] }]
    },
    {
      id: 'm_gen_2',
      channelId: 'chn_general',
      senderId: 'usr_saeful',
      senderName: 'Saeful Rohman',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
      content: 'Dokumen panduan sudah bisa diunduh di tab Documents ya.',
      createdAt: '2026-11-01T09:20:00Z',
      reactions: [{ emoji: '🙏', userIds: ['usr_rina'] }]
    }
  ],
  dm_nadia: [
    {
      id: 'm_dm_1',
      channelId: 'dm_nadia',
      senderId: 'usr_nadia',
      senderName: 'Nadia Putri',
      senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
      content: 'Pak Saeful, bisakah cek sebentar mockup dashboard task baru? Kami menambahkan filter tag dan view timeline.',
      createdAt: '2026-11-01T11:42:00Z',
      reactions: []
    }
  ]
};

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 'meet_1',
    title: 'Townhall Triwulan IV & Peluncuran Strategic Tech 2027',
    description: 'Pertemuan menyeluruh seluruh karyawan untuk penyampaian capaian tahun 2026, penghargaan tim berprestasi, dan sesi tanya jawab terbuka bersama Direksi.',
    date: '2026-11-02',
    startTime: '10:00',
    endTime: '11:30',
    location: 'Auditorium Utama Lt. 3 / Google Meet Hybrid',
    meetLink: 'https://meet.google.com/wsp-corp-all',
    organizerId: 'usr_saeful',
    organizerName: 'Saeful Rohman',
    organizerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    status: 'scheduled',
    department: 'All Departments',
    agenda: [
      'Pembukaan & Keynote Speech oleh VP of Technology',
      'Capaian Finansial & Produk 2026',
      'Peluncuran Resmi WORKSPACE Corporate Portal',
      'Sesi Q&A Terbuka & Doorprize Inovasi'
    ],
    notes: 'Mohon seluruh tim hadir 10 menit sebelum acara dimulai untuk setup audio & koneksi livestream.',
    actionItems: [
      { id: 'ai_1', text: 'Uji livestream hybrid audio di auditorium', assigneeName: 'Hendra Kurniawan', assigneeId: 'usr_hendra', isConvertedToTask: false },
      { id: 'ai_2', text: 'Finalisasi slide deck presentasi', assigneeName: 'Nadia Putri', assigneeId: 'usr_nadia', isConvertedToTask: true, taskId: 'tsk_5' }
    ],
    attendees: [
      { userId: 'usr_saeful', name: 'Saeful Rohman', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80', role: 'Organizer', status: 'accepted' },
      { userId: 'usr_nadia', name: 'Nadia Putri', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80', role: 'Speaker', status: 'accepted' },
      { userId: 'usr_budi', name: 'Budi Santoso', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80', role: 'Attendee', status: 'accepted' },
      { userId: 'usr_rina', name: 'Rina Wijaya', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80', role: 'Moderator', status: 'accepted' }
    ],
    createdAt: '2026-10-25T10:00:00Z'
  },
  {
    id: 'meet_2',
    title: 'Architecture Review: Multi-Tenant Data Isolation & Encryption',
    description: 'Sesi mendalam arsitektur data untuk memastikan pemisahan tenant dan enkripsi AES-256 pada database penyimpanan dokumen.',
    date: '2026-11-02',
    startTime: '14:00',
    endTime: '15:30',
    location: 'Meeting Room Alpha (Lt. 18)',
    meetLink: 'https://meet.google.com/sec-arch-rev',
    organizerId: 'usr_budi',
    organizerName: 'Budi Santoso',
    organizerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    status: 'scheduled',
    department: 'Technology & Engineering',
    agenda: [
      'Evaluasi KMS Key rotation policy',
      'Database row-level security benchmarks',
      'Penyelarasan dengan checklist audit ISO 27001'
    ],
    notes: 'Membawa laptop yang sudah terhubung ke staging VPN.',
    actionItems: [
      { id: 'ai_3', text: 'Dokumentasikan diagram sequence arsitektur KMS', assigneeName: 'Budi Santoso', assigneeId: 'usr_budi', isConvertedToTask: false }
    ],
    attendees: [
      { userId: 'usr_saeful', name: 'Saeful Rohman', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80', role: 'Executive Sponsor', status: 'accepted' },
      { userId: 'usr_budi', name: 'Budi Santoso', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80', role: 'Organizer', status: 'accepted' },
      { userId: 'usr_citra', name: 'Citra Lestari', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80', role: 'Attendee', status: 'accepted' },
      { userId: 'usr_hendra', name: 'Hendra Kurniawan', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80', role: 'Attendee', status: 'accepted' }
    ],
    createdAt: '2026-10-29T11:00:00Z'
  },
  {
    id: 'meet_3',
    title: 'Weekly Product Design Critique & Usability Review',
    description: 'Review interaksi komponen antarmuka, aksesibilitas kontras warna, dan feedback pengguna mobile.',
    date: '2026-11-03',
    startTime: '09:30',
    endTime: '10:30',
    location: 'Design Studio Lt. 16',
    meetLink: 'https://meet.google.com/ux-critique-room',
    organizerId: 'usr_nadia',
    organizerName: 'Nadia Putri',
    organizerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
    status: 'scheduled',
    department: 'Product & Design',
    agenda: [
      'Demo interaksi Drag & Drop Kanban board di layar sentuh',
      'Validasi feedback micro-copy Bahasa Indonesia',
      'Persetujuan palet warna navy/crimson corporate'
    ],
    actionItems: [],
    attendees: [
      { userId: 'usr_nadia', name: 'Nadia Putri', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80', role: 'Lead', status: 'accepted' },
      { userId: 'usr_dimas', name: 'Dimas Aditya', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80', role: 'Reviewer', status: 'accepted' },
      { userId: 'usr_saeful', name: 'Saeful Rohman', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80', role: 'Guest', status: 'tentative' }
    ],
    createdAt: '2026-10-30T15:00:00Z'
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc_1',
    title: 'SOP Keamanan Sistem Informasi & Kepatuhan ISO 27001:2022',
    description: 'Standar Operasional Prosedur penanganan data rahasia perusahaan, tata cara otentikasi kata sandi, dan respons insiden siber.',
    category: 'sop',
    fileName: 'SOP-SEC-2026-001_Information_Security.pdf',
    fileSize: '4.8 MB',
    fileType: 'pdf',
    version: 'v3.2',
    uploadedBy: 'usr_saeful',
    uploaderName: 'Saeful Rohman',
    uploaderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    accessRole: 'all',
    isStarred: true,
    downloadsCount: 142,
    tags: ['Security', 'ISO27001', 'Mandatory', 'SOP'],
    updatedAt: '2026-10-28',
    createdAt: '2026-01-15',
    contentPreview: 'Dokumen ini menguraikan seluruh protokol keamanan informasi yang mengikat seluruh karyawan, kontraktor, dan mitra eksternal WORKSPACE Corporation. Meliputi manajemen akses hak istimewa (PAM), rotasi token autentikasi, enkripsi end-to-end, dan tata kelola pemulihan bencana (Disaster Recovery).'
  },
  {
    id: 'doc_2',
    title: 'Buku Panduan Identitas Brand & Design System 2026',
    description: 'Panduan tipografi, palet warna Navy-Crimson, penggunaan logo resmi, ikonografi, dan tata letak komunikasi korporat.',
    category: 'guideline',
    fileName: 'WORKSPACE_Brand_Guidelines_2026.pdf',
    fileSize: '12.4 MB',
    fileType: 'pdf',
    version: 'v2.0',
    uploadedBy: 'usr_nadia',
    uploaderName: 'Nadia Putri',
    uploaderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
    accessRole: 'all',
    isStarred: true,
    downloadsCount: 98,
    tags: ['Brand', 'DesignSystem', 'UI', 'Marketing'],
    updatedAt: '2026-10-25',
    createdAt: '2026-02-10',
    contentPreview: 'Brand WORKSPACE melambangkan ketelitian, keandalan, dan inovasi terdepan. Warna primer: Deep Corporate Navy (#0F172A) melambangkan stabilitas korporat, dipadukan Crimson Red (#DC2626) sebagai aksen vitalitas dan ketegasan.'
  },
  {
    id: 'doc_3',
    title: 'Kebijakan Kerja Hybrid & Tunjangan Fasilitas Lapangan',
    description: 'Panduan jam kerja fleksibel, klaim peralatan home office, tunjangan internet, dan keselamatan kerja di luar kantor.',
    category: 'handbook',
    fileName: 'Kebijakan_Hybrid_Working_2026.docx',
    fileSize: '1.2 MB',
    fileType: 'docx',
    version: 'v1.4',
    uploadedBy: 'usr_rina',
    uploaderName: 'Rina Wijaya',
    uploaderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
    accessRole: 'all',
    isStarred: false,
    downloadsCount: 215,
    tags: ['HR', 'Hybrid', 'Handbook', 'Allowance'],
    updatedAt: '2026-10-31',
    createdAt: '2026-03-01',
    contentPreview: 'Perusahaan memberikan fleksibilitas kerja 3 hari di kantor dan 2 hari remote (WFH) atau fleksibilitas penuh bagi staf mobile lapangan dengan kesepakatan manajer divisi masing-masing.'
  },
  {
    id: 'doc_4',
    title: 'Cetak Biru Arsitektur Microservices & Standar API Gateway',
    description: 'Diagram teknis, spesifikasi OpenAPI v3, pedoman penamaan endpoint, logging OpenTelemetry, dan idempotensi transaksi.',
    category: 'architecture',
    fileName: 'Enterprise_Architecture_Blueprint_Q4.pdf',
    fileSize: '8.1 MB',
    fileType: 'pdf',
    version: 'v4.0',
    uploadedBy: 'usr_budi',
    uploaderName: 'Budi Santoso',
    uploaderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    accessRole: 'manager',
    isStarred: true,
    downloadsCount: 67,
    tags: ['Architecture', 'Tech', 'Microservices', 'Engineering'],
    updatedAt: '2026-10-22',
    createdAt: '2026-04-14',
    contentPreview: 'Arsitektur sistem dibangun di atas Kubernetes cluster dengan zero-trust network policy. Komunikasi antar-service menggunakan gRPC untuk synchronous calls dan Apache Kafka untuk distributed events.'
  },
  {
    id: 'doc_5',
    title: 'Template Proposal Proyek & Business Case Presentation',
    description: 'Format baku slide presentasi PowerPoint dan estimasi ROI untuk pengajuan inisiatif baru ke jajaran Board of Directors.',
    category: 'template',
    fileName: 'Template_Project_Proposal_BoD.pptx',
    fileSize: '5.6 MB',
    fileType: 'pptx',
    version: 'v2.1',
    uploadedBy: 'usr_dimas',
    uploaderName: 'Dimas Aditya',
    uploaderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
    accessRole: 'all',
    isStarred: false,
    downloadsCount: 53,
    tags: ['Template', 'Proposal', 'BoD', 'Business'],
    updatedAt: '2026-09-18',
    createdAt: '2026-05-19'
  },
  {
    id: 'doc_6',
    title: 'Perjanjian Kerahasiaan (NDA) Standar Karyawan & Rekanan',
    description: 'Format baku Non-Disclosure Agreement yang disahkan oleh tim Legal untuk perlindungan rahasia dagang dan hak kekayaan intelektual.',
    category: 'legal',
    fileName: 'Standard_NDA_Corporate_2026.docx',
    fileSize: '850 KB',
    fileType: 'docx',
    version: 'v2.5',
    uploadedBy: 'usr_maya',
    uploaderName: 'Maya Anggraini',
    uploaderAvatar: 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?auto=format&fit=crop&w=256&h=256&q=80',
    accessRole: 'admin',
    isStarred: false,
    downloadsCount: 84,
    tags: ['Legal', 'NDA', 'Compliance', 'IPR'],
    updatedAt: '2026-10-15',
    createdAt: '2026-01-20'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    recipientId: 'usr_saeful',
    senderId: 'usr_nadia',
    senderName: 'Nadia Putri',
    senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
    type: 'chat',
    title: 'Pesan Baru di DM',
    message: 'Nadia mengirim pesan baru terkait mockup dashboard task.',
    targetTab: 'chat',
    read: false,
    createdAt: '10 menit yang lalu'
  },
  {
    id: 'notif_2',
    recipientId: 'usr_saeful',
    senderId: 'usr_maya',
    senderName: 'Maya Anggraini',
    senderAvatar: 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?auto=format&fit=crop&w=256&h=256&q=80',
    type: 'task',
    title: 'Task Ditugaskan ke Anda',
    message: 'Anda ditugaskan pada: Finalisasi Audit Keamanan ISO 27001',
    targetTab: 'tasks',
    read: false,
    createdAt: '1 jam yang lalu'
  },
  {
    id: 'notif_3',
    recipientId: 'usr_saeful',
    senderId: 'usr_budi',
    senderName: 'Budi Santoso',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    type: 'meeting',
    title: 'Undangan Meeting Baru',
    message: 'Architecture Review: Multi-Tenant Data Isolation dijadwalkan hari ini pkl 14:00.',
    targetTab: 'meetings',
    read: false,
    createdAt: '2 jam yang lalu'
  },
  {
    id: 'notif_4',
    recipientId: 'usr_saeful',
    senderId: 'usr_rina',
    senderName: 'Rina Wijaya',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
    type: 'announcement',
    title: 'Pengumuman Penting HR',
    message: 'Kebijakan Wellness Day & Pembaruan Asuransi Kesehatan 2026 telah diposting.',
    targetTab: 'feed',
    read: true,
    createdAt: '1 hari yang lalu'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_1',
    userId: 'usr_saeful',
    userName: 'Saeful Rohman',
    userRole: 'super_admin',
    action: 'SYSTEM_SETTINGS_UPDATE',
    resource: 'Platform Configuration',
    details: 'Memperbarui tema default menjadi Corporate Navy-Crimson dan mengaktifkan SSO 2FA',
    timestamp: '2026-11-01 10:14:22',
    ipAddress: '10.240.12.8 (Internal HQ)'
  },
  {
    id: 'log_2',
    userId: 'usr_budi',
    userName: 'Budi Santoso',
    userRole: 'admin',
    action: 'TASK_STATUS_TRANSITION',
    resource: 'Task #tsk_3',
    details: 'Status task dialihkan dari In Progress ke Review',
    timestamp: '2026-11-01 09:45:10',
    ipAddress: '10.240.14.55'
  },
  {
    id: 'log_3',
    userId: 'usr_saeful',
    userName: 'Saeful Rohman',
    userRole: 'super_admin',
    action: 'POST_PUBLISH_BROADCAST',
    resource: 'Social Feed',
    details: 'Mempublikasikan pengumuman pinned peluncuran WORKSPACE v2.4',
    timestamp: '2026-11-01 08:30:00',
    ipAddress: '10.240.12.8 (Internal HQ)'
  },
  {
    id: 'log_4',
    userId: 'usr_rina',
    userName: 'Rina Wijaya',
    userRole: 'manager',
    action: 'DOCUMENT_UPLOAD',
    resource: 'Document Center',
    details: 'Mengunggah SOP-HR-2026-04 Kebijakan Hybrid Working',
    timestamp: '2026-10-31 14:02:15',
    ipAddress: '10.240.20.19'
  }
];

export const INITIAL_BRAND_DRIVE_FOLDERS = [
  {
    id: 'bdf_1',
    brandName: 'Brand Alpha (A-Creative Studio)',
    brandCode: 'ALPHA',
    folderTitle: '📁 [MASTER] Brand Alpha - Design System & 3D Vector Assets',
    description: 'Master logo .svg/.ai, font license typography, Figma token exports, Blender 3D render master, dan aset visual identitas brand.',
    category: 'creative_assets' as const,
    color: 'from-blue-600 to-indigo-700',
    googleDriveUrl: 'https://drive.google.com/drive/folders/1AlphaMasterCreativeDesignAssets2026',
    itemCount: 148,
    storageUsed: '18.4 GB',
    lastUpdated: '2026-11-01',
    managerName: 'Dimas Aditya',
    managerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
    tags: ['MasterLogo', '3DBlender', 'FigmaTokens', 'BrandGuidelines'],
    isStarred: true
  },
  {
    id: 'bdf_2',
    brandName: 'Brand Beta (B-Fashion & Urban Retail)',
    brandCode: 'BETA',
    folderTitle: '📁 [MASTER] Brand Beta - Raw 4K Video Footage & TikTok Reels',
    description: 'Folder master rekaman video 4K talent shooting, sinkronisasi audio WAV, color grading LUTs (.cube), dan footage reels.',
    category: 'raw_footage' as const,
    color: 'from-purple-600 to-pink-600',
    googleDriveUrl: 'https://drive.google.com/drive/folders/1BetaRawVideoFootageTikTokReels2026',
    itemCount: 312,
    storageUsed: '64.8 GB',
    lastUpdated: '2026-10-31',
    managerName: 'Nadia Putri',
    managerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
    tags: ['4KFootage', 'Reels', 'B-Roll', 'SoundFX', 'Voiceover'],
    isStarred: true
  },
  {
    id: 'bdf_3',
    brandName: 'Brand Gamma (SaaS & Enterprise Tech)',
    brandCode: 'GAMMA',
    folderTitle: '📁 [MASTER] Brand Gamma - Product Showcase, Screencasts & Decks',
    description: 'Slide investor pitch deck BoD, rekaman screencast tutorial HD, wireframes prototype high-fidelity, dan marketing kit.',
    category: 'campaigns' as const,
    color: 'from-emerald-600 to-teal-700',
    googleDriveUrl: 'https://drive.google.com/drive/folders/1GammaProductShowcaseDeckEnterprise2026',
    itemCount: 84,
    storageUsed: '7.2 GB',
    lastUpdated: '2026-10-28',
    managerName: 'Saeful Rohman',
    managerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    tags: ['PitchDeck', 'ProductDemo', 'Screenshots', 'EnterpriseKit'],
    isStarred: false
  },
  {
    id: 'bdf_4',
    brandName: 'Brand Delta (Lifestyle & FMCG)',
    brandCode: 'DELTA',
    folderTitle: '📁 [MASTER] Brand Delta - Photoshoot Bank, Lookbook & PR Kits',
    description: 'Koleksi foto resolusi tinggi katalog busana/lifestyle, media kit siaran pers media, kontrak endorsement influencer Q1-Q4.',
    category: 'brand_guidelines' as const,
    color: 'from-amber-500 to-orange-600',
    googleDriveUrl: 'https://drive.google.com/drive/folders/1DeltaLifestyleCampaignPRPhotoshoot2026',
    itemCount: 196,
    storageUsed: '24.1 GB',
    lastUpdated: '2026-10-25',
    managerName: 'Rina Wijaya',
    managerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
    tags: ['Lookbook', 'Photoshoot', 'PressKit', 'Influencer'],
    isStarred: false
  },
  {
    id: 'bdf_5',
    brandName: 'Holding Corporate & Governance',
    brandCode: 'CORP',
    folderTitle: '📁 [MASTER] Corporate Holding - Legal, Trademark HAKI & Finance',
    description: 'Sertifikat pendaftaran merek HAKI Ditjen KI, akta notaris pendirian holding, audit finansial independen, dan template kontrak rekanan.',
    category: 'finance_legal' as const,
    color: 'from-slate-700 to-slate-900',
    googleDriveUrl: 'https://drive.google.com/drive/folders/1CorporateLegalMasterTrademarkHAKI2026',
    itemCount: 62,
    storageUsed: '3.5 GB',
    lastUpdated: '2026-10-20',
    managerName: 'Maya Anggraini',
    managerAvatar: 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?auto=format&fit=crop&w=256&h=256&q=80',
    tags: ['HAKI', 'LegalMOU', 'TaxAudit', 'CorporateGovernance'],
    isStarred: true
  }
];

export const INITIAL_DIVISIONS: DivisionItem[] = [
  {
    id: 'tech',
    name: 'Technology & Engineering',
    departmentMatch: 'Technology & Engineering',
    leadName: 'Saeful Rohman',
    leadRole: 'VP of Technology & Engineering',
    leadAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    color: 'blue',
    bannerGradient: 'from-blue-600 via-indigo-700 to-slate-900',
    description: 'Arsitektur sistem, infrastruktur cloud multi-AZ, microservices, keamanan data ISO 27001, dan AI research.'
  },
  {
    id: 'product',
    name: 'Product & Design',
    departmentMatch: 'Product & Design',
    leadName: 'Nadia Putri',
    leadRole: 'Lead Product Manager',
    leadAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
    color: 'purple',
    bannerGradient: 'from-purple-600 via-pink-700 to-slate-900',
    description: 'Riset pengguna (UX research), desain antarmuka, design system, storyboard video kampanye, dan roadmap fitur.'
  },
  {
    id: 'hr',
    name: 'People Operations & HR',
    departmentMatch: 'People Operations & Culture',
    leadName: 'Rina Wijaya',
    leadRole: 'Head of People Operations',
    leadAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
    color: 'emerald',
    bannerGradient: 'from-emerald-600 via-teal-700 to-slate-900',
    description: 'Manajemen talenta, SOP kepegawaian, asuransi, evaluasi kinerja tahunan, dan kultur kerja kolaboratif.'
  },
  {
    id: 'marketing',
    name: 'Marketing & Brand',
    departmentMatch: 'Marketing & Brand',
    leadName: 'Dimas Aditya',
    leadRole: 'Brand Marketing Lead',
    leadAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
    color: 'amber',
    bannerGradient: 'from-amber-500 via-orange-600 to-slate-900',
    description: 'Kampanye B2B, peluncuran media, materi kreatif video promo, studi kasus klien, dan pertumbuhan brand.'
  },
  {
    id: 'finance',
    name: 'Finance & Legal',
    departmentMatch: 'Finance & Legal',
    leadName: 'Maya Anggraini',
    leadRole: 'Finance Director',
    leadAvatar: 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?auto=format&fit=crop&w=256&h=256&q=80',
    color: 'rose',
    bannerGradient: 'from-rose-600 via-red-700 to-slate-900',
    description: 'Audit finansial, rekonsiliasi arus kas, kepatuhan pajak korporat, dan pengesahan kontrak legal formal.'
  }
];
