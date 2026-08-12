/**
 * BlockEditor.js
 * Interactive Block Editor UI Controller for block-based articles.
 */
class BlockEditor {
    constructor() {
        this.currentArticle = null;
        this.previewMode = 'edit'; // 'edit' | 'preview' | 'published'
        this.containerId = 'block-editor-canvas';
        this.toolbarId = 'block-insertion-toolbar';
    }

    setArticle(article) {
        this.currentArticle = article;
        this.render();
    }

    setPreviewMode(mode) {
        this.previewMode = mode;
        this.render();
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container || !this.currentArticle) return;

        if (this.previewMode === 'preview' || this.previewMode === 'published') {
            container.innerHTML = `
                <div class="prose dark:prose-invert max-w-none space-y-4 animate-fade-in p-6 bg-slate-900/60 rounded-3xl border border-slate-800">
                    <div class="mb-6 border-b border-slate-800 pb-4">
                        <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">${ContentBlock.escapeHtml(this.currentArticle.category)}</span>
                        <h1 class="text-3xl font-extrabold text-white mt-2">${ContentBlock.escapeHtml(this.currentArticle.title)}</h1>
                        <p class="text-xs text-slate-400 mt-1">Oleh ${ContentBlock.escapeHtml(this.currentArticle.author)} • ${this.currentArticle.getFormattedUpdatedAt()}</p>
                    </div>
                    ${this.currentArticle.renderHTML()}
                </div>
            `;
            if (window.lucide) lucide.createIcons();
            return;
        }

        // Live Edit Mode
        const total = this.currentArticle.blocks.length;

        const blocksHtml = this.currentArticle.blocks.map((block, index) => {
            return `
                <div id="blk-card-${block.id}" class="group relative bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 transition-all shadow-lg hover:shadow-2xl space-y-3" data-block-id="${block.id}">
                    <!-- Block Header Controls Bar -->
                    <div class="flex items-center justify-between border-b border-slate-800/80 pb-2.5 text-xs text-slate-400">
                        <div class="flex items-center gap-2">
                            <span class="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-slate-200" title="Drag to reorder">
                                ⠿
                            </span>
                            <span class="px-2 py-0.5 rounded-md bg-slate-950 font-mono font-bold text-[10px] text-emerald-400 uppercase tracking-wider border border-slate-800">
                                ${block.type}
                            </span>
                            <span class="text-[10px] text-slate-400">Block #${index + 1}</span>
                        </div>

                        <!-- Action Toolbar for Block -->
                        <div class="flex items-center gap-1">
                            <button type="button" onclick="window.blockEditor.moveBlockUp('${block.id}')" ${index === 0 ? 'disabled class="opacity-30 p-1"' : 'class="p-1 hover:bg-slate-800 text-slate-300 rounded-lg"'} title="Move Up">
                                ⬆
                            </button>
                            <button type="button" onclick="window.blockEditor.moveBlockDown('${block.id}')" ${index === total - 1 ? 'disabled class="opacity-30 p-1"' : 'class="p-1 hover:bg-slate-800 text-slate-300 rounded-lg"'} title="Move Down">
                                ⬇
                            </button>
                            <button type="button" onclick="window.blockEditor.duplicateBlock('${block.id}')" class="p-1 hover:bg-slate-800 text-sky-400 rounded-lg text-xs" title="Duplicate">
                                📋
                            </button>
                            <button type="button" onclick="window.blockEditor.deleteBlock('${block.id}')" class="p-1 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs" title="Delete">
                                🗑️
                            </button>
                        </div>
                    </div>

                    <!-- Block Live Edit Body -->
                    <div class="block-edit-body">
                        ${block.edit(index, total)}
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <div class="space-y-4">
                ${blocksHtml}

                <!-- Floating Insertion Toolbar -->
                ${this.renderInsertionToolbar()}
            </div>
        `;

        if (window.lucide) lucide.createIcons();
    }

    renderInsertionToolbar() {
        return `
            <div class="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 text-center space-y-3 shadow-xl mt-6">
                <div class="flex items-center justify-center gap-2 text-xs font-bold text-emerald-400">
                    <span class="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-sm">+</span>
                    <span>Tambah Block Konten Baru</span>
                </div>

                <div class="flex flex-wrap items-center justify-center gap-2">
                    <button type="button" onclick="window.blockEditor.addBlock('paragraph')" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1">
                        📝 Paragraph
                    </button>
                    <button type="button" onclick="window.blockEditor.addBlock('heading')" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1">
                        H Heading
                    </button>
                    <button type="button" onclick="window.blockEditor.addBlock('image')" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1">
                        🖼️ Image
                    </button>
                    <button type="button" onclick="window.blockEditor.addBlock('gallery')" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1">
                        🏞️ Gallery
                    </button>
                    <button type="button" onclick="window.blockEditor.addBlock('video')" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1">
                        🎥 Video
                    </button>
                    <button type="button" onclick="window.blockEditor.addBlock('code')" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1">
                        💻 Code
                    </button>
                    <button type="button" onclick="window.blockEditor.addBlock('quote')" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1">
                        💬 Quote
                    </button>
                    <button type="button" onclick="window.blockEditor.addBlock('callout')" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1">
                        💡 Callout
                    </button>
                    <button type="button" onclick="window.blockEditor.addBlock('warning')" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1">
                        ⚠️ Warning
                    </button>
                    <button type="button" onclick="window.blockEditor.addBlock('info')" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1">
                        ℹ️ Info
                    </button>
                    <button type="button" onclick="window.blockEditor.addBlock('divider')" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1">
                        — Divider
                    </button>
                </div>
            </div>
        `;
    }

    addBlock(type) {
        if (!this.currentArticle) return;
        this.currentArticle.addBlock(type);
        this.render();
    }

    updateBlockData(blockId, field, value) {
        if (!this.currentArticle) return;
        const block = this.currentArticle.getBlockById(blockId);
        if (block) {
            block.data[field] = value;
        }
    }

    moveBlockUp(blockId) {
        if (!this.currentArticle) return;
        const index = this.currentArticle.blocks.findIndex(b => b.id === blockId);
        if (index > 0) {
            this.currentArticle.moveBlock(index, index - 1);
            this.render();
        }
    }

    moveBlockDown(blockId) {
        if (!this.currentArticle) return;
        const index = this.currentArticle.blocks.findIndex(b => b.id === blockId);
        if (index >= 0 && index < this.currentArticle.blocks.length - 1) {
            this.currentArticle.moveBlock(index, index + 1);
            this.render();
        }
    }

    duplicateBlock(blockId) {
        if (!this.currentArticle) return;
        this.currentArticle.duplicateBlock(blockId);
        this.render();
    }

    deleteBlock(blockId) {
        if (!this.currentArticle) return;
        this.currentArticle.removeBlock(blockId);
        this.render();
    }

    /* Gallery specific handlers */
    addGalleryImage(blockId) {
        const block = this.currentArticle.getBlockById(blockId);
        if (block && block.type === 'gallery') {
            block.data.images = block.data.images || [];
            block.data.images.push({
                url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
                caption: 'Gambar Baru'
            });
            this.render();
        }
    }

    updateGalleryImage(blockId, index, field, value) {
        const block = this.currentArticle.getBlockById(blockId);
        if (block && block.type === 'gallery' && block.data.images[index]) {
            block.data.images[index][field] = value;
        }
    }

    removeGalleryImage(blockId, index) {
        const block = this.currentArticle.getBlockById(blockId);
        if (block && block.type === 'gallery' && block.data.images) {
            block.data.images.splice(index, 1);
            this.render();
        }
    }

    /* Lightbox Modal Opener */
    openLightbox(imageUrl, caption) {
        const modal = document.getElementById('gallery-lightbox-modal');
        const img = document.getElementById('lightbox-img');
        const cap = document.getElementById('lightbox-caption');
        if (!modal || !img) return;

        img.src = imageUrl;
        if (cap) cap.innerText = caption || '';
        modal.classList.remove('hidden');
    }

    closeLightbox() {
        const modal = document.getElementById('gallery-lightbox-modal');
        if (modal) modal.classList.add('hidden');
    }
}
