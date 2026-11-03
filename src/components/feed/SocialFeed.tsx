import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  Pin,
  Send,
  BarChart2,
  Image,
  Paperclip,
  Search,
  Sparkles,
  TrendingUp,
  Tag,
  Share2,
  Trash2,
  CheckCircle2,
  X
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Post } from '../../types';

export const SocialFeed: React.FC = () => {
  const {
    currentUser,
    posts,
    createPost,
    likePost,
    bookmarkPost,
    addComment,
    votePoll,
    togglePinPost,
    deletePost
  } = useWorkspace();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // New post state
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState<'standard' | 'announcement' | 'poll'>('standard');
  const [pollOptionsInput, setPollOptionsInput] = useState(['', '']);
  const [postTags, setPostTags] = useState('General, Update');
  const [isExpandingCreator, setIsExpandingCreator] = useState(false);

  // Comment input per post
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', label: 'Semua Kiriman' },
    { id: 'announcements', label: '📢 Pengumuman Resmi' },
    { id: 'tech', label: '💻 Tech & Engineering' },
    { id: 'hr', label: '🌿 HR & People Ops' },
    { id: 'polls', label: '📊 Polling Tim' },
  ];

  const trendingHashtags = [
    { tag: 'WorkspaceLaunch', count: '48 kiriman' },
    { tag: 'TownhallQ4', count: '32 kiriman' },
    { tag: 'SecurityISO', count: '19 kiriman' },
    { tag: 'HybridWork', count: '14 kiriman' },
    { tag: 'Sprint34', count: '12 kiriman' }
  ];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    let pollOptions = undefined;
    if (postType === 'poll') {
      const validOptions = pollOptionsInput.filter(opt => opt.trim().length > 0);
      if (validOptions.length < 2) {
        alert('Mohon isi minimal 2 pilihan polling.');
        return;
      }
      pollOptions = validOptions.map((text, idx) => ({
        id: 'opt_' + Date.now() + '_' + idx,
        text,
        votes: []
      }));
    }

    createPost({
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.position,
      authorDept: currentUser.department,
      content: postContent,
      type: postType,
      pollOptions,
      tags: postTags.split(',').map(t => t.trim()).filter(Boolean),
      category: postType === 'announcement' ? 'announcements' : 'general',
      isPinned: postType === 'announcement' && currentUser.role === 'super_admin'
    });

    setPostContent('');
    setPollOptionsInput(['', '']);
    setPostType('standard');
    setIsExpandingCreator(false);
  };

  const handleAddPollOption = () => {
    if (pollOptionsInput.length < 5) {
      setPollOptionsInput([...pollOptionsInput, '']);
    }
  };

  const handlePollOptionChange = (index: number, val: string) => {
    const updated = [...pollOptionsInput];
    updated[index] = val;
    setPollOptionsInput(updated);
  };

  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId] || '';
    if (!text.trim()) return;
    addComment(postId, text);
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    if (activeCategory === 'announcements' && post.type !== 'announcement') return false;
    if (activeCategory === 'polls' && post.type !== 'poll') return false;
    if (activeCategory === 'tech' && post.category !== 'tech') return false;
    if (activeCategory === 'hr' && post.category !== 'hr') return false;

    if (selectedTag && !post.tags.includes(selectedTag)) return false;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchContent = post.content.toLowerCase().includes(query);
      const matchAuthor = post.authorName.toLowerCase().includes(query);
      const matchTags = post.tags.some(t => t.toLowerCase().includes(query));
      return matchContent || matchAuthor || matchTags;
    }

    return true;
  });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 animate-in fade-in duration-200">
      {/* Main Feed Column (3 cols on large screen) */}
      <div className="space-y-5 lg:col-span-3">
        {/* Post Creation Box */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-5">
          <div className="flex gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
            />
            <div className="flex-1">
              <textarea
                value={postContent}
                onChange={e => setPostContent(e.target.value)}
                onFocus={() => setIsExpandingCreator(true)}
                placeholder={`Bagikan update, ide, atau pengumuman perusahaan, ${currentUser.name.split(' ')[0]}...`}
                rows={isExpandingCreator ? 3 : 2}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-red-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:focus:bg-slate-800"
              />

              {/* Poll options if poll type selected */}
              {postType === 'poll' && (
                <div className="mt-3 space-y-2 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/50">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Opsi Polling:
                  </div>
                  {pollOptionsInput.map((opt, i) => (
                    <input
                      key={i}
                      type="text"
                      placeholder={`Pilihan ${i + 1}`}
                      value={opt}
                      onChange={e => handlePollOptionChange(i, e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-red-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    />
                  ))}
                  {pollOptionsInput.length < 5 && (
                    <button
                      type="button"
                      onClick={handleAddPollOption}
                      className="text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-400"
                    >
                      + Tambah Pilihan
                    </button>
                  )}
                </div>
              )}

              {/* Creator Controls */}
              {isExpandingCreator && (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPostType('standard')}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                        postType === 'standard'
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                      }`}
                    >
                      Standar
                    </button>

                    <button
                      type="button"
                      onClick={() => setPostType('poll')}
                      className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                        postType === 'poll'
                          ? 'bg-red-600 text-white'
                          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                      }`}
                    >
                      <BarChart2 className="h-3.5 w-3.5" />
                      <span>Polling</span>
                    </button>

                    {(currentUser.role === 'super_admin' || currentUser.role === 'admin' || currentUser.role === 'manager') && (
                      <button
                        type="button"
                        onClick={() => setPostType('announcement')}
                        className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                          postType === 'announcement'
                            ? 'bg-red-600 text-white'
                            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                        }`}
                      >
                        📢 Pengumuman
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsExpandingCreator(false);
                        setPostType('standard');
                      }}
                      className="rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleCreatePost}
                      disabled={!postContent.trim()}
                      className="flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Kirim Post</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category Filter Pills & Elongated Search Bar */}
        <div className="space-y-3">
          {/* Elongated Search Bar */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari postingan, topik hashtag #, pembuat pengumuman, atau konten feed..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-9 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-red-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => {
                  setActiveCategory(c.id);
                  setSelectedTag(null);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                  activeCategory === c.id && !selectedTag
                    ? 'bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900'
                    : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Indicator */}
        {selectedTag && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-1.5 text-xs text-red-700 dark:bg-red-950/60 dark:text-red-300">
            <span>Filter tag aktif: <strong>#{selectedTag}</strong></span>
            <button
              onClick={() => setSelectedTag(null)}
              className="font-bold underline ml-auto text-[11px]"
            >
              Hapus Filter
            </button>
          </div>
        )}

        {/* Feed Posts List */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
              <Sparkles className="mx-auto h-8 w-8 text-slate-400" />
              <h3 className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                Tidak ada kiriman yang sesuai
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Coba ubah kata kunci pencarian atau kategori filter Anda.
              </p>
            </div>
          ) : (
            filteredPosts.map(post => {
              const hasLiked = post.likes.includes(currentUser.id);
              const hasBookmarked = post.bookmarks.includes(currentUser.id);
              const isAuthor = post.authorId === currentUser.id;
              const canModerate = currentUser.role === 'super_admin' || currentUser.role === 'admin';
              const showComments = expandedComments[post.id];

              return (
                <article
                  key={post.id}
                  className={`rounded-3xl border bg-white p-5 shadow-xs transition dark:bg-slate-900 ${
                    post.isPinned
                      ? 'border-red-200 bg-red-50/20 dark:border-red-900/50 dark:bg-red-950/10'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {/* Pinned banner */}
                  {post.isPinned && (
                    <div className="mb-3 flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400">
                      <Pin className="h-3.5 w-3.5 fill-red-600" />
                      <span>Pengumuman Tersemat Perusahaan (Pinned)</span>
                    </div>
                  )}

                  {/* Post Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white sm:text-sm">
                            {post.authorName}
                          </span>
                          {post.type === 'announcement' && (
                            <span className="rounded-md bg-red-100 px-1.5 py-0.2 text-[9px] font-bold text-red-700 dark:bg-red-950 dark:text-red-300">
                              Official
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {post.authorRole} • {post.authorDept.split('&')[0]}
                        </div>
                      </div>
                    </div>

                    {/* Post actions menu */}
                    <div className="flex items-center gap-1">
                      {canModerate && (
                        <button
                          onClick={() => togglePinPost(post.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800"
                          title={post.isPinned ? 'Lepas sematan' : 'Sematkan ke atas'}
                        >
                          <Pin className={`h-4 w-4 ${post.isPinned ? 'fill-red-600 text-red-600' : ''}`} />
                        </button>
                      )}
                      {(isAuthor || canModerate) && (
                        <button
                          onClick={() => deletePost(post.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800"
                          title="Hapus kiriman"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="mt-3 text-xs leading-relaxed text-slate-800 dark:text-slate-200 sm:text-sm whitespace-pre-line">
                    {post.content}
                  </div>

                  {/* Poll Options Card */}
                  {post.pollOptions && (
                    <div className="mt-4 space-y-2 rounded-2xl bg-slate-50 p-3.5 border border-slate-100 dark:border-slate-800 dark:bg-slate-800/60">
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                        Pilih opsi Anda (klik untuk vote):
                      </div>
                      {(() => {
                        const totalVotes = post.pollOptions.reduce((s, o) => s + o.votes.length, 0);
                        return post.pollOptions.map(opt => {
                          const hasVotedThis = opt.votes.includes(currentUser.id);
                          const pct = totalVotes > 0 ? Math.round((opt.votes.length / totalVotes) * 100) : 0;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => votePoll(post.id, opt.id)}
                              className={`relative w-full overflow-hidden rounded-xl border p-2.5 text-left transition ${
                                hasVotedThis
                                  ? 'border-red-500 bg-red-50/40 dark:bg-red-950/20'
                                  : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800'
                              }`}
                            >
                              <div
                                style={{ width: `${pct}%` }}
                                className="absolute inset-y-0 left-0 bg-red-100/60 dark:bg-red-950/40 transition-all duration-300"
                              />
                              <div className="relative z-10 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                                <span className="flex items-center gap-2">
                                  {hasVotedThis && <CheckCircle2 className="h-3.5 w-3.5 text-red-600" />}
                                  {opt.text}
                                </span>
                                <span className="text-slate-500 font-mono text-[11px]">
                                  {pct}% ({opt.votes.length} suara)
                                </span>
                              </div>
                            </button>
                          );
                        });
                      })()}
                    </div>
                  )}

                  {/* Attachments */}
                  {post.attachments && post.attachments.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {post.attachments.map((att, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                          <Paperclip className="h-3.5 w-3.5 text-red-600" />
                          <span className="font-medium">{att.name}</span>
                          <span className="text-[10px] text-slate-400">({att.size})</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Hashtags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {post.tags.map(t => (
                        <button
                          key={t}
                          onClick={() => setSelectedTag(t)}
                          className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                        >
                          #{t}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Interaction Bar */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800 text-slate-500">
                    <div className="flex items-center gap-4">
                      {/* Like button */}
                      <button
                        onClick={() => likePost(post.id)}
                        className={`flex items-center gap-1.5 text-xs font-semibold transition ${
                          hasLiked ? 'text-red-600 font-bold' : 'hover:text-red-600'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${hasLiked ? 'fill-red-600 text-red-600' : ''}`} />
                        <span>{post.likes.length}</span>
                      </button>

                      {/* Comment button */}
                      <button
                        onClick={() =>
                          setExpandedComments({
                            ...expandedComments,
                            [post.id]: !showComments
                          })
                        }
                        className="flex items-center gap-1.5 text-xs font-semibold hover:text-slate-800 dark:hover:text-slate-200"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments.length}</span>
                      </button>

                      {/* Repost button */}
                      <button
                        onClick={() => alert('Fitur repost berhasil dicatat!')}
                        className="flex items-center gap-1.5 text-xs font-semibold hover:text-emerald-600"
                      >
                        <Repeat2 className="h-4 w-4" />
                        <span>{post.reposts.length}</span>
                      </button>
                    </div>

                    {/* Bookmark button */}
                    <button
                      onClick={() => bookmarkPost(post.id)}
                      className={`rounded-lg p-1.5 transition ${
                        hasBookmarked ? 'text-red-600' : 'hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                      title={hasBookmarked ? 'Hapus simpanan' : 'Simpan kiriman'}
                    >
                      <Bookmark className={`h-4 w-4 ${hasBookmarked ? 'fill-red-600' : ''}`} />
                    </button>
                  </div>

                  {/* Expandable Comments Section */}
                  {showComments && (
                    <div className="mt-4 space-y-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                      {/* Comments list */}
                      <div className="space-y-2.5">
                        {post.comments.map(c => (
                          <div key={c.id} className="flex gap-2.5 text-xs">
                            <img
                              src={c.authorAvatar}
                              alt={c.authorName}
                              className="h-7 w-7 rounded-full object-cover shrink-0 mt-0.5"
                            />
                            <div className="flex-1 rounded-2xl bg-slate-50 p-2.5 dark:bg-slate-800/70">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 dark:text-white">
                                  {c.authorName}
                                </span>
                                <span className="text-[10px] text-slate-400">Baru saja</span>
                              </div>
                              <p className="mt-1 text-slate-700 dark:text-slate-300">
                                {c.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add comment input */}
                      <div className="flex items-center gap-2 pt-2">
                        <img
                          src={currentUser.avatar}
                          alt="me"
                          className="h-7 w-7 rounded-full object-cover shrink-0"
                        />
                        <input
                          type="text"
                          placeholder="Tulis balasan komentar..."
                          value={commentInputs[post.id] || ''}
                          onChange={e =>
                            setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                          }
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleCommentSubmit(post.id);
                          }}
                          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-red-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        />
                        <button
                          onClick={() => handleCommentSubmit(post.id)}
                          className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 dark:bg-red-600 dark:hover:bg-red-700"
                        >
                          Balas
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Trending Topics & Feed Rules */}
      <div className="space-y-5">
        {/* Trending Hashtags Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-red-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Trending Topics
            </h3>
          </div>
          <div className="space-y-2.5">
            {trendingHashtags.map(t => (
              <div
                key={t.tag}
                onClick={() => setSelectedTag(t.tag)}
                className="group flex cursor-pointer items-center justify-between rounded-xl p-2 transition hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-red-600">
                    #{t.tag}
                  </div>
                  <div className="text-[10px] text-slate-400">{t.count}</div>
                </div>
                <Tag className="h-3.5 w-3.5 text-slate-400 group-hover:text-red-600" />
              </div>
            ))}
          </div>
        </div>

        {/* Corporate Guidelines Card */}
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100/50 p-5 dark:border-slate-800 dark:from-slate-900 dark:to-slate-800/40">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Etika Komunikasi Feed
          </h4>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Feed internal WORKSPACE dirancang untuk meningkatkan transparansi, kolaborasi lintas divisi, dan pertukaran ide positif perusahaan. Jaga kerahasiaan data kredensial dan patuhi pedoman kode etik korporat.
          </p>
        </div>
      </div>
    </div>
  );
};
