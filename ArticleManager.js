/**
 * ArticleManager.js
 * Master Manager for Informatics Articles, connecting BlockEditor, ArticleStorage,
 * article grid listing, and view modals.
 */
class ArticleManager {
    constructor() {
        this.storage = new ArticleStorage();
        this.articles = [];
        this.blockEditor = new BlockEditor();
        window.blockEditor = this.blockEditor;
        this.activeCategory = 'All';
        this.searchQuery = '';
        this.editingArticle = null;
    }

    init() {
        this.loadArticles();
        this.renderAll();
        this.bindEvents();
    }

    loadArticles() {
        const raw = this.storage.load();
        if (Array.isArray(raw) && raw.length > 0) {
            this.articles = raw.map(a => new Article(a));
        } else {
            this.loadDefaultSeedArticles();
        }
    }

    loadDefaultSeedArticles() {
        const seed = [
            {
                id: 'art_arch_01',
                title: 'Arsitektur Komputer & Microprocessor Hardware',
                category: 'Informatika',
                summary: 'Eksplorasi mendalam mengenai struktur mikroprosesor, hierarki memori cache L1/L2/L3, serta pipelining instruksi.',
                coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
                author: 'Eryl Mayshesa Farizal',
                readTime: '5 menit membaca',
                blocks: [
                    { type: 'heading', data: { level: 'h1', text: 'Pengantar Arsitektur Sistem Komputer' } },
                    { type: 'paragraph', data: { text: 'Arsitektur komputer menggambarkan struktur sistem fisik dan operasi logika yang memungkinkan komputer mengeksekusi instruksi program secara efisien dan cepat.' } },
                    { type: 'image', data: { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', caption: 'Komponen Arsitektur Mikroprosesor Modern', alignment: 'center' } },
                    { type: 'heading', data: { level: 'h2', text: 'Video Pembahasan Utama' } },
                    { type: 'video', data: { videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', caption: 'Visualisasi Cara Kerja CPU & Memori Utama' } },
                    { type: 'paragraph', data: { text: 'Dengan memanfaatkan kombinasi pipelining, caching, dan eksekusi spekulatif, prosesor modern mampu mengeksekusi miliaran instruksi per detik.' } },
                    { type: 'code', data: { language: 'cpp', code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Arsitektur Komputer & Informatika" << endl;\n    return 0;\n}' } },
                    { type: 'callout', data: { icon: '💡', text: 'Optimalisasi memori cache L1, L2, dan L3 memainkan peran kunci dalam menekan latency transfer data.' } }
                ]
            },
            {
                id: 'art_cyber_02',
                title: 'Keamanan Jaringan Komputer & Kriptografi',
                category: 'Keamanan Informasi',
                summary: 'Prinsip enkripsi AES-256, RSA public key cryptography, dan pencegahan serangan cyber pada infrastruktur cloud.',
                coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
                author: 'Eryl Mayshesa Farizal',
                readTime: '7 menit membaca',
                blocks: [
                    { type: 'heading', data: { level: 'h1', text: 'Dasar-Dasar Kriptografi & Keamanan Jaringan' } },
                    { type: 'paragraph', data: { text: 'Kriptografi merupakan pondasi utama dalam menjaga integritas, kerahasiaan, serta otentikasi data dalam jaringan nirkabel dan kabel.' } },
                    { type: 'gallery', data: { layout: '3col', images: [
                        { url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80', caption: 'Security Protocol' },
                        { url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80', caption: 'Network Node Security' }
                    ] } },
                    { type: 'warning', data: { title: 'Pencegahan Phishing', text: 'Selalu verifikasi sertifikat SSL/TLS domain sebelum menginput kredensial sensitif.' } }
                ]
            }
        ];

        this.articles = seed.map(a => new Article(a));
        this.saveState();
    }

    saveState() {
        this.storage.save(this.articles.map(a => a.toJSON()));
    }

    renderAll() {
        this.renderInformatikaPage();
        this.renderPortfolioWidget();
    }

    /* Filtered Articles */
    getFilteredArticles() {
        return this.articles.filter(a => {
            const matchesCat = (this.activeCategory === 'All' || a.category === this.activeCategory);
            const q = this.searchQuery.toLowerCase().trim();
            const matchesSearch = !q || (
                a.title.toLowerCase().includes(q) ||
                a.summary.toLowerCase().includes(q) ||
                a.category.toLowerCase().includes(q)
            );
            return matchesCat && matchesSearch;
        });
    }

    /* Render on informatika.html */
    renderInformatikaPage() {
        const grid = document.getElementById('articles-grid');
        if (!grid) return;

        const filtered = this.getFilteredArticles();

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400 space-y-3">
                    <i data-lucide="newspaper" class="w-12 h-12 mx-auto text-slate-500"></i>
                    <h4 class="text-lg font-extrabold text-white">Tidak ada artikel ditemukan</h4>
                    <p class="text-xs text-slate-400">Coba ubah kata kunci pencarian atau buat artikel baru menggunakan Block Editor.</p>
                </div>
            `;
            if (window.lucide) lucide.createIcons();
            return;
        }

        grid.innerHTML = filtered.map(a => `
            <article class="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col group">
                <div class="relative h-48 overflow-hidden bg-slate-950">
                    <img src="${ContentBlock.escapeHtml(a.coverImage)}" alt="${ContentBlock.escapeHtml(a.title)}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    <div class="absolute top-3 left-3">
                        <span class="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                            ${ContentBlock.escapeHtml(a.category)}
                        </span>
                    </div>
                </div>

                <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div class="space-y-2">
                        <h3 class="text-lg font-extrabold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">${ContentBlock.escapeHtml(a.title)}</h3>
                        <p class="text-xs text-slate-300 leading-relaxed line-clamp-3">${ContentBlock.escapeHtml(a.summary)}</p>
                    </div>

                    <div class="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                        <span class="text-slate-400 font-mono text-[11px]">${a.getFormattedUpdatedAt()}</span>
                        
                        <div class="flex items-center gap-2">
                            <button onclick="window.articleManager.openEditorModal('${a.id}')" class="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold text-xs transition-colors flex items-center gap-1">
                                ✏️ Edit
                            </button>
                            <button onclick="window.articleManager.deleteArticle('${a.id}')" class="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-rose-400 font-bold text-xs transition-colors">
                                🗑️
                            </button>
                            <button onclick="window.articleManager.openArticleDetailModal('${a.id}')" class="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-glow transition-all flex items-center gap-1">
                                Baca <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        `).join('');

        if (window.lucide) lucide.createIcons();
    }

    /* Render Preview Section on index.html */
    renderPortfolioWidget() {
        const container = document.getElementById('portfolio-articles-preview-container');
        if (!container) return;

        const latest = this.articles.slice(0, 3);
        if (latest.length === 0) {
            container.innerHTML = `<p class="text-xs text-slate-400">Belum ada artikel publikasi.</p>`;
            return;
        }

        container.innerHTML = latest.map(a => `
            <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-2 flex flex-col justify-between group">
                <div>
                    <span class="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">${ContentBlock.escapeHtml(a.category)}</span>
                    <h4 class="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">${ContentBlock.escapeHtml(a.title)}</h4>
                    <p class="text-xs text-slate-400 line-clamp-2 mt-1">${ContentBlock.escapeHtml(a.summary)}</p>
                </div>
                <div class="pt-2 border-t border-slate-800/80 flex justify-between items-center text-[11px]">
                    <span class="text-slate-500">${a.getFormattedUpdatedAt()}</span>
                    <a href="informatika.html" class="text-emerald-400 hover:underline font-bold flex items-center gap-1">
                        Baca Artikel <i data-lucide="arrow-right" class="w-3 h-3"></i>
                    </a>
                </div>
            </div>
        `).join('');

        if (window.lucide) lucide.createIcons();
    }

    /* CRUD Operations */
    openEditorModal(articleId = null) {
        if (articleId) {
            const found = this.articles.find(a => a.id === articleId);
            this.editingArticle = found ? new Article(JSON.parse(JSON.stringify(found.toJSON()))) : new Article();
        } else {
            this.editingArticle = new Article();
        }

        // Populate metadata fields
        document.getElementById('article-id').value = this.editingArticle.id;
        document.getElementById('article-title-input').value = this.editingArticle.title;
        document.getElementById('article-category-input').value = this.editingArticle.category;
        document.getElementById('article-summary-input').value = this.editingArticle.summary;
        document.getElementById('article-cover-input').value = this.editingArticle.coverImage;
        document.getElementById('article-author-input').value = this.editingArticle.author;

        // Initialize BlockEditor with editingArticle
        this.blockEditor.setArticle(this.editingArticle);
        this.blockEditor.setPreviewMode('edit');

        document.getElementById('article-editor-modal-title').innerText = articleId ? 'Edit Artikel (Rich Content Block Editor)' : 'Buat Artikel Baru (Rich Content Block Editor)';
        document.getElementById('article-editor-modal').classList.remove('hidden');
    }

    closeEditorModal() {
        const modal = document.getElementById('article-editor-modal');
        if (modal) modal.classList.add('hidden');
    }

    saveEditorForm(e) {
        if (e) e.preventDefault();
        if (!this.editingArticle) return;

        // Save block data from active block edit inputs
        const container = document.getElementById(this.blockEditor.containerId);
        if (container) {
            this.editingArticle.blocks.forEach(block => {
                const blockEl = container.querySelector(`[data-block-id="${block.id}"]`);
                if (blockEl) {
                    block.save(blockEl);
                }
            });
        }

        // Metadata updates
        this.editingArticle.title = document.getElementById('article-title-input').value || 'Untitled Article';
        this.editingArticle.category = document.getElementById('article-category-input').value || 'Informatika';
        this.editingArticle.summary = document.getElementById('article-summary-input').value || '';
        this.editingArticle.coverImage = document.getElementById('article-cover-input').value || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80';
        this.editingArticle.author = document.getElementById('article-author-input').value || 'Eryl Mayshesa Farizal';
        this.editingArticle.updatedAt = new Date().toISOString();

        const existingIndex = this.articles.findIndex(a => a.id === this.editingArticle.id);
        if (existingIndex !== -1) {
            this.articles[existingIndex] = this.editingArticle;
        } else {
            this.articles.unshift(this.editingArticle);
        }

        this.saveState();
        this.renderAll();
        this.closeEditorModal();
        if (window.showToast) showToast('Artikel berhasil disimpan!');
    }

    deleteArticle(id) {
        if (confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
            this.articles = this.articles.filter(a => a.id !== id);
            this.saveState();
            this.renderAll();
            if (window.showToast) showToast('Artikel berhasil dihapus.');
        }
    }

    openArticleDetailModal(id) {
        const article = this.articles.find(a => a.id === id);
        if (!article) return;

        const modal = document.getElementById('article-detail-modal');
        const body = document.getElementById('article-detail-body');
        if (!modal || !body) return;

        body.innerHTML = `
            <div class="space-y-6">
                <div class="relative h-64 sm:h-80 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
                    <img src="${ContentBlock.escapeHtml(article.coverImage)}" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 flex flex-col justify-end">
                        <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30 w-fit mb-2">
                            ${ContentBlock.escapeHtml(article.category)}
                        </span>
                        <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">${ContentBlock.escapeHtml(article.title)}</h1>
                        <p class="text-xs text-slate-300 mt-1">Oleh ${ContentBlock.escapeHtml(article.author)} • ${article.getFormattedUpdatedAt()} • ${ContentBlock.escapeHtml(article.readTime)}</p>
                    </div>
                </div>

                <div class="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                    ${article.renderHTML()}
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
        if (window.lucide) lucide.createIcons();
    }

    closeArticleDetailModal() {
        const modal = document.getElementById('article-detail-modal');
        if (modal) modal.classList.add('hidden');
    }

    setCategory(cat) {
        this.activeCategory = cat;
        this.renderInformatikaPage();
    }

    setSearch(query) {
        this.searchQuery = query;
        this.renderInformatikaPage();
    }

    bindEvents() {
        const searchInput = document.getElementById('article-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.setSearch(e.target.value));
        }
    }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    window.articleManager = new ArticleManager();
    window.articleManager.init();
});
