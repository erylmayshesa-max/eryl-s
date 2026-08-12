/**
 * Blocks.js
 * Concrete subclasses inheriting from ContentBlock.
 */

/* 1. HEADING BLOCK */
class HeadingBlock extends ContentBlock {
    constructor(data = {}) {
        super('heading', {
            level: data.level || 'h2',
            text: data.text || ''
        });
    }

    render() {
        const text = ContentBlock.escapeHtml(this.data.text);
        const level = this.data.level || 'h2';
        const styles = {
            h1: 'text-3xl font-extrabold text-white mt-6 mb-3 tracking-tight border-b border-slate-800 pb-2',
            h2: 'text-2xl font-bold text-white mt-5 mb-2.5 tracking-tight',
            h3: 'text-xl font-bold text-emerald-400 mt-4 mb-2',
            h4: 'text-lg font-semibold text-sky-400 mt-3 mb-1.5'
        };
        const cls = styles[level] || styles.h2;
        return `<${level} class="${cls}">${text}</${level}>`;
    }

    edit(index, total) {
        const level = this.data.level || 'h2';
        return `
            <div class="space-y-2">
                <div class="flex items-center gap-3">
                    <select data-field="level" onchange="window.blockEditor.updateBlockData('${this.id}', 'level', this.value)" class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-emerald-400 font-bold focus:outline-none">
                        <option value="h1" ${level === 'h1' ? 'selected' : ''}>Heading 1 (H1)</option>
                        <option value="h2" ${level === 'h2' ? 'selected' : ''}>Heading 2 (H2)</option>
                        <option value="h3" ${level === 'h3' ? 'selected' : ''}>Heading 3 (H3)</option>
                        <option value="h4" ${level === 'h4' ? 'selected' : ''}>Heading 4 (H4)</option>
                    </select>
                    <input type="text" data-field="text" value="${ContentBlock.escapeHtml(this.data.text)}" placeholder="Ketik judul heading..." oninput="window.blockEditor.updateBlockData('${this.id}', 'text', this.value)" class="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm font-bold text-white focus:border-emerald-400 focus:outline-none">
                </div>
            </div>
        `;
    }

    save(blockElement) {
        const levelSelect = blockElement.querySelector('[data-field="level"]');
        const textInput = blockElement.querySelector('[data-field="text"]');
        if (levelSelect) this.data.level = levelSelect.value;
        if (textInput) this.data.text = textInput.value;
        return this.data;
    }
}

/* 2. PARAGRAPH BLOCK */
class ParagraphBlock extends ContentBlock {
    constructor(data = {}) {
        super('paragraph', {
            text: data.text || ''
        });
    }

    render() {
        const text = ContentBlock.escapeHtml(this.data.text).replace(/\n/g, '<br>');
        return `<p class="text-slate-300 text-sm leading-relaxed my-3 font-normal">${text}</p>`;
    }

    edit(index, total) {
        return `
            <div>
                <textarea data-field="text" rows="3" placeholder="Tuliskan paragraf teks artikel..." oninput="window.blockEditor.updateBlockData('${this.id}', 'text', this.value)" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 leading-relaxed focus:border-emerald-400 focus:outline-none">${ContentBlock.escapeHtml(this.data.text)}</textarea>
            </div>
        `;
    }

    save(blockElement) {
        const ta = blockElement.querySelector('[data-field="text"]');
        if (ta) this.data.text = ta.value;
        return this.data;
    }
}

/* 3. IMAGE BLOCK */
class ImageBlock extends ContentBlock {
    constructor(data = {}) {
        super('image', {
            url: data.url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
            caption: data.caption || '',
            alt: data.alt || 'Article Image',
            alignment: data.alignment || 'center'
        });
    }

    render() {
        const url = ContentBlock.escapeHtml(this.data.url);
        const caption = ContentBlock.escapeHtml(this.data.caption);
        const alt = ContentBlock.escapeHtml(this.data.alt);
        const align = this.data.alignment || 'center';

        const alignClasses = {
            left: 'max-w-md mr-auto',
            center: 'max-w-2xl mx-auto',
            right: 'max-w-md ml-auto',
            full: 'w-full'
        };

        return `
            <figure class="my-6 ${alignClasses[align] || alignClasses.center}">
                <div class="rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950">
                    <img src="${url}" alt="${alt}" loading="lazy" class="w-full h-auto object-cover max-h-[500px] hover:scale-105 transition-transform duration-500 cursor-pointer" onclick="window.blockEditor.openLightbox('${url}', '${caption}')">
                </div>
                ${caption ? `<figcaption class="text-center text-xs text-slate-400 italic mt-2.5">📸 ${caption}</figcaption>` : ''}
            </figure>
        `;
    }

    edit(index, total) {
        return `
            <div class="space-y-3">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div class="md:col-span-2">
                        <label class="block text-[11px] font-semibold text-slate-400 mb-1">Image URL / Local File *</label>
                        <input type="url" data-field="url" value="${ContentBlock.escapeHtml(this.data.url)}" placeholder="https://..." oninput="window.blockEditor.updateBlockData('${this.id}', 'url', this.value)" class="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-emerald-400 focus:outline-none">
                    </div>
                    <div>
                        <label class="block text-[11px] font-semibold text-slate-400 mb-1">Alignment</label>
                        <select data-field="alignment" onchange="window.blockEditor.updateBlockData('${this.id}', 'alignment', this.value)" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none">
                            <option value="center" ${this.data.alignment === 'center' ? 'selected' : ''}>Center (Default)</option>
                            <option value="left" ${this.data.alignment === 'left' ? 'selected' : ''}>Left</option>
                            <option value="right" ${this.data.alignment === 'right' ? 'selected' : ''}>Right</option>
                            <option value="full" ${this.data.alignment === 'full' ? 'selected' : ''}>Full Width</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input type="text" data-field="caption" value="${ContentBlock.escapeHtml(this.data.caption)}" placeholder="Caption gambar..." oninput="window.blockEditor.updateBlockData('${this.id}', 'caption', this.value)" class="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none">
                    <input type="text" data-field="alt" value="${ContentBlock.escapeHtml(this.data.alt)}" placeholder="Alt Text..." oninput="window.blockEditor.updateBlockData('${this.id}', 'alt', this.value)" class="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none">
                </div>

                ${this.data.url ? `
                    <div class="mt-2 rounded-xl overflow-hidden max-h-36 bg-slate-950 border border-slate-800 p-2 flex items-center justify-center">
                        <img src="${ContentBlock.escapeHtml(this.data.url)}" class="max-h-32 rounded object-contain">
                    </div>
                ` : ''}
            </div>
        `;
    }

    save(blockElement) {
        const getVal = (f) => {
            const el = blockElement.querySelector(`[data-field="${f}"]`);
            return el ? el.value : '';
        };
        this.data.url = getVal('url');
        this.data.caption = getVal('caption');
        this.data.alt = getVal('alt');
        this.data.alignment = getVal('alignment') || 'center';
        return this.data;
    }
}

/* 4. GALLERY BLOCK */
class GalleryBlock extends ContentBlock {
    constructor(data = {}) {
        super('gallery', {
            layout: data.layout || '3col',
            images: data.images || [
                { url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80', caption: 'Cybersecurity Data' },
                { url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80', caption: 'Network Infrastructure' },
                { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80', caption: 'Hardware Architecture' }
            ]
        });
    }

    render() {
        const layout = this.data.layout || '3col';
        const gridCols = {
            '2col': 'grid-cols-1 sm:grid-cols-2',
            '3col': 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
            'grid': 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
            'masonry': 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
        };

        const items = (this.data.images || []).map(img => {
            const u = ContentBlock.escapeHtml(img.url);
            const c = ContentBlock.escapeHtml(img.caption || '');
            return `
                <div class="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl cursor-pointer" onclick="window.blockEditor.openLightbox('${u}', '${c}')">
                    <img src="${u}" alt="${c}" loading="lazy" class="w-full h-44 object-cover group-hover:scale-110 transition-transform duration-500">
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end">
                        <span class="text-xs text-white font-semibold line-clamp-1">${c || 'Zoom Image'}</span>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="my-6 space-y-2">
                <div class="grid ${gridCols[layout] || gridCols['3col']} gap-3">
                    ${items}
                </div>
            </div>
        `;
    }

    edit(index, total) {
        const imgs = this.data.images || [];
        const imgsHtml = imgs.map((img, i) => `
            <div class="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                <input type="url" value="${ContentBlock.escapeHtml(img.url)}" placeholder="Image URL..." onchange="window.blockEditor.updateGalleryImage('${this.id}', ${i}, 'url', this.value)" class="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 text-xs text-white border border-slate-700">
                <input type="text" value="${ContentBlock.escapeHtml(img.caption || '')}" placeholder="Caption..." onchange="window.blockEditor.updateGalleryImage('${this.id}', ${i}, 'caption', this.value)" class="w-36 px-3 py-1.5 rounded-lg bg-slate-950 text-xs text-slate-300 border border-slate-700">
                <button type="button" onclick="window.blockEditor.removeGalleryImage('${this.id}', ${i})" class="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg">✕</button>
            </div>
        `).join('');

        return `
            <div class="space-y-3">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-slate-300">🖼️ Image Gallery (${imgs.length} Images)</span>
                    <button type="button" onclick="window.blockEditor.addGalleryImage('${this.id}')" class="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                        + Tambah Gambar
                    </button>
                </div>

                <div class="space-y-2">
                    ${imgsHtml}
                </div>
            </div>
        `;
    }

    save() {
        return this.data;
    }
}

/* 5. VIDEO BLOCK */
class VideoBlock extends ContentBlock {
    constructor(data = {}) {
        super('video', {
            videoUrl: data.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            caption: data.caption || 'Video Pembahasan Informatika'
        });
    }

    getEmbedUrl() {
        const url = (this.data.videoUrl || '').trim();
        if (!url) return '';
        if (url.includes('/embed/')) return url;

        const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
        if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

        return url;
    }

    render() {
        const embedUrl = this.getEmbedUrl();
        const caption = ContentBlock.escapeHtml(this.data.caption);
        const isDirectMp4 = embedUrl.endsWith('.mp4');

        return `
            <figure class="my-6 max-w-3xl mx-auto">
                <div class="rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-black aspect-video">
                    ${isDirectMp4 ? `
                        <video src="${embedUrl}" controls class="w-full h-full object-cover"></video>
                    ` : `
                        <iframe src="${ContentBlock.escapeHtml(embedUrl)}" width="100%" height="100%" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="w-full h-full"></iframe>
                    `}
                </div>
                ${caption ? `<figcaption class="text-center text-xs text-slate-400 italic mt-2.5">🎥 ${caption}</figcaption>` : ''}
            </figure>
        `;
    }

    edit(index, total) {
        return `
            <div class="space-y-3">
                <div>
                    <label class="block text-[11px] font-semibold text-slate-400 mb-1">YouTube URL / MP4 Direct Link *</label>
                    <input type="url" data-field="videoUrl" value="${ContentBlock.escapeHtml(this.data.videoUrl)}" placeholder="https://www.youtube.com/watch?v=..." oninput="window.blockEditor.updateBlockData('${this.id}', 'videoUrl', this.value)" class="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-emerald-400 focus:outline-none">
                </div>
                <div>
                    <input type="text" data-field="caption" value="${ContentBlock.escapeHtml(this.data.caption)}" placeholder="Caption Video..." oninput="window.blockEditor.updateBlockData('${this.id}', 'caption', this.value)" class="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none">
                </div>
            </div>
        `;
    }

    save(blockElement) {
        const u = blockElement.querySelector('[data-field="videoUrl"]');
        const c = blockElement.querySelector('[data-field="caption"]');
        if (u) this.data.videoUrl = u.value;
        if (c) this.data.caption = c.value;
        return this.data;
    }
}

/* 6. CODE BLOCK */
class CodeBlock extends ContentBlock {
    constructor(data = {}) {
        super('code', {
            language: data.language || 'javascript',
            code: data.code || 'console.log("Hello Informatika!");'
        });
    }

    render() {
        const lang = ContentBlock.escapeHtml(this.data.language || 'code');
        const code = ContentBlock.escapeHtml(this.data.code);
        return `
            <div class="my-6 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl font-mono text-xs">
                <div class="px-4 py-2 bg-slate-900 border-b border-slate-800 flex justify-between items-center text-slate-400">
                    <span class="font-bold text-accent">${lang}</span>
                    <button onclick="navigator.clipboard.writeText(\`${code.replace(/`/g, '\\`')}\`)" class="hover:text-white text-[11px]">Copy</button>
                </div>
                <pre class="p-4 text-emerald-300 overflow-x-auto leading-relaxed"><code>${code}</code></pre>
            </div>
        `;
    }

    edit(index, total) {
        return `
            <div class="space-y-2 font-mono">
                <div class="flex justify-between items-center">
                    <select data-field="language" onchange="window.blockEditor.updateBlockData('${this.id}', 'language', this.value)" class="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-sky-400 font-bold focus:outline-none">
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                        <option value="sql">SQL</option>
                    </select>
                </div>
                <textarea data-field="code" rows="4" placeholder="Tuliskan kode program..." oninput="window.blockEditor.updateBlockData('${this.id}', 'code', this.value)" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-emerald-300 focus:outline-none">${ContentBlock.escapeHtml(this.data.code)}</textarea>
            </div>
        `;
    }

    save(blockElement) {
        const l = blockElement.querySelector('[data-field="language"]');
        const c = blockElement.querySelector('[data-field="code"]');
        if (l) this.data.language = l.value;
        if (c) this.data.code = c.value;
        return this.data;
    }
}

/* 7. QUOTE BLOCK */
class QuoteBlock extends ContentBlock {
    constructor(data = {}) {
        super('quote', {
            quote: data.quote || 'Ilmu pengetahuan adalah investasi dengan imbalan terbaik.',
            author: data.author || 'Benjamin Franklin'
        });
    }

    render() {
        const q = ContentBlock.escapeHtml(this.data.quote);
        const a = ContentBlock.escapeHtml(this.data.author);
        return `
            <blockquote class="my-6 p-5 rounded-2xl bg-slate-900/80 border-l-4 border-emerald-400 text-slate-200 italic shadow-lg space-y-2">
                <p class="text-sm font-medium leading-relaxed">"${q}"</p>
                ${a ? `<cite class="block text-xs font-bold text-emerald-400 not-italic">— ${a}</cite>` : ''}
            </blockquote>
        `;
    }

    edit(index, total) {
        return `
            <div class="space-y-2">
                <textarea data-field="quote" rows="2" placeholder="Tuliskan kutipan / quote..." oninput="window.blockEditor.updateBlockData('${this.id}', 'quote', this.value)" class="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 italic focus:outline-none">${ContentBlock.escapeHtml(this.data.quote)}</textarea>
                <input type="text" data-field="author" value="${ContentBlock.escapeHtml(this.data.author)}" placeholder="Penulis / Sumber Kutipan..." oninput="window.blockEditor.updateBlockData('${this.id}', 'author', this.value)" class="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-emerald-400 font-bold focus:outline-none">
            </div>
        `;
    }

    save(blockElement) {
        const q = blockElement.querySelector('[data-field="quote"]');
        const a = blockElement.querySelector('[data-field="author"]');
        if (q) this.data.quote = q.value;
        if (a) this.data.author = a.value;
        return this.data;
    }
}

/* 8. DIVIDER BLOCK */
class DividerBlock extends ContentBlock {
    constructor(data = {}) {
        super('divider', data);
    }

    render() {
        return `<hr class="my-8 border-t border-slate-800">`;
    }

    edit(index, total) {
        return `
            <div class="py-2 text-center text-xs font-bold text-slate-500 uppercase tracking-widest border-t border-b border-slate-800">
                — Horizontal Line Divider —
            </div>
        `;
    }

    save() {
        return this.data;
    }
}

/* 9. TABLE BLOCK */
class TableBlock extends ContentBlock {
    constructor(data = {}) {
        super('table', {
            headers: data.headers || ['Topik', 'Deskripsi', 'Status'],
            rows: data.rows || [
                ['Algoritma', 'Struktur logika komputasi', 'Selesai'],
                ['Jaringan', 'Topologi & Protokol TCP/IP', 'Proses']
            ]
        });
    }

    render() {
        const headers = (this.data.headers || []).map(h => `<th class="px-4 py-2.5 bg-slate-900 text-left text-xs font-bold text-white border-b border-slate-800">${ContentBlock.escapeHtml(h)}</th>`).join('');
        const rows = (this.data.rows || []).map(r => `
            <tr class="border-b border-slate-800/60 hover:bg-slate-900/40">
                ${r.map(cell => `<td class="px-4 py-2 text-xs text-slate-300">${ContentBlock.escapeHtml(cell)}</td>`).join('')}
            </tr>
        `).join('');

        return `
            <div class="my-6 rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950 overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead><tr>${headers}</tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;
    }

    edit(index, total) {
        return `
            <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs">
                <span class="font-bold text-slate-300 block">📊 Data Table Block</span>
                <p class="text-slate-400 text-[11px]">Tabel akan dirender secara otomatis berdasarkan struktur data yang tersimpan.</p>
            </div>
        `;
    }

    save() {
        return this.data;
    }
}

/* 10. CHECKLIST BLOCK */
class ChecklistBlock extends ContentBlock {
    constructor(data = {}) {
        super('checklist', {
            items: data.items || [
                { text: 'Memahami konsep Object-Oriented Programming', checked: true },
                { text: 'Mengimplementasikan Rich Content Block Editor', checked: true }
            ]
        });
    }

    render() {
        const items = (this.data.items || []).map(item => `
            <li class="flex items-center gap-2.5 text-xs text-slate-200">
                <span class="w-4 h-4 rounded flex items-center justify-center ${item.checked ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-700'}">
                    ${item.checked ? '✓' : ''}
                </span>
                <span class="${item.checked ? 'line-through text-slate-400' : ''}">${ContentBlock.escapeHtml(item.text)}</span>
            </li>
        `).join('');

        return `<ul class="my-4 space-y-2 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">${items}</ul>`;
    }

    edit(index, total) {
        return `
            <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <span class="font-bold text-xs text-slate-300">☑️ Checklist / Todo Items</span>
            </div>
        `;
    }

    save() {
        return this.data;
    }
}

/* 11. CALLOUT BLOCK */
class CalloutBlock extends ContentBlock {
    constructor(data = {}) {
        super('callout', {
            text: data.text || 'Catatan penting mengenai implementasi fitur.',
            icon: data.icon || '💡'
        });
    }

    render() {
        const t = ContentBlock.escapeHtml(this.data.text);
        const icon = ContentBlock.escapeHtml(this.data.icon || '💡');
        return `
            <div class="my-5 p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-200 flex items-start gap-3 text-xs leading-relaxed">
                <span class="text-base shrink-0">${icon}</span>
                <div>${t}</div>
            </div>
        `;
    }

    edit(index, total) {
        return `
            <div class="flex items-center gap-2">
                <input type="text" data-field="icon" value="${ContentBlock.escapeHtml(this.data.icon || '💡')}" class="w-12 px-2 py-2 rounded-xl bg-slate-900 border border-slate-700 text-center text-xs">
                <input type="text" data-field="text" value="${ContentBlock.escapeHtml(this.data.text)}" placeholder="Isi pesan callout..." oninput="window.blockEditor.updateBlockData('${this.id}', 'text', this.value)" class="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-sky-200 focus:outline-none">
            </div>
        `;
    }

    save(blockElement) {
        const i = blockElement.querySelector('[data-field="icon"]');
        const t = blockElement.querySelector('[data-field="text"]');
        if (i) this.data.icon = i.value;
        if (t) this.data.text = t.value;
        return this.data;
    }
}

/* 12. WARNING BLOCK */
class WarningBlock extends ContentBlock {
    constructor(data = {}) {
        super('warning', {
            title: data.title || 'Peringatan Keamanan',
            text: data.text || 'Pastikan tidak membagikan kunci API atau kata sandi secara publik.'
        });
    }

    render() {
        const title = ContentBlock.escapeHtml(this.data.title);
        const text = ContentBlock.escapeHtml(this.data.text);
        return `
            <div class="my-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-1 text-xs">
                <strong class="font-bold text-amber-400 block">⚠️ ${title}</strong>
                <p class="leading-relaxed">${text}</p>
            </div>
        `;
    }

    edit(index, total) {
        return `
            <div class="space-y-2">
                <input type="text" data-field="title" value="${ContentBlock.escapeHtml(this.data.title)}" placeholder="Judul Peringatan..." oninput="window.blockEditor.updateBlockData('${this.id}', 'title', this.value)" class="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-amber-400 font-bold focus:outline-none">
                <textarea data-field="text" rows="2" placeholder="Isi pesan peringatan..." oninput="window.blockEditor.updateBlockData('${this.id}', 'text', this.value)" class="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-amber-200 focus:outline-none">${ContentBlock.escapeHtml(this.data.text)}</textarea>
            </div>
        `;
    }

    save(blockElement) {
        const ti = blockElement.querySelector('[data-field="title"]');
        const te = blockElement.querySelector('[data-field="text"]');
        if (ti) this.data.title = ti.value;
        if (te) this.data.text = te.value;
        return this.data;
    }
}

/* 13. INFO BLOCK */
class InfoBlock extends ContentBlock {
    constructor(data = {}) {
        super('info', {
            title: data.title || 'Informasi Tambahan',
            text: data.text || 'Penjelasan mendalam mengenai konsep sains data dan komputasi.'
        });
    }

    render() {
        const title = ContentBlock.escapeHtml(this.data.title);
        const text = ContentBlock.escapeHtml(this.data.text);
        return `
            <div class="my-5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 space-y-1 text-xs">
                <strong class="font-bold text-emerald-400 block">ℹ️ ${title}</strong>
                <p class="leading-relaxed">${text}</p>
            </div>
        `;
    }

    edit(index, total) {
        return `
            <div class="space-y-2">
                <input type="text" data-field="title" value="${ContentBlock.escapeHtml(this.data.title)}" placeholder="Judul Informasi..." oninput="window.blockEditor.updateBlockData('${this.id}', 'title', this.value)" class="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-emerald-400 font-bold focus:outline-none">
                <textarea data-field="text" rows="2" placeholder="Isi pesan informasi..." oninput="window.blockEditor.updateBlockData('${this.id}', 'text', this.value)" class="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-emerald-200 focus:outline-none">${ContentBlock.escapeHtml(this.data.text)}</textarea>
            </div>
        `;
    }

    save(blockElement) {
        const ti = blockElement.querySelector('[data-field="title"]');
        const te = blockElement.querySelector('[data-field="text"]');
        if (ti) this.data.title = ti.value;
        if (te) this.data.text = te.value;
        return this.data;
    }
}

// Block Factory Helper
class BlockFactory {
    static createBlock(type, data = {}) {
        switch (type) {
            case 'heading': return new HeadingBlock(data);
            case 'paragraph': return new ParagraphBlock(data);
            case 'image': return new ImageBlock(data);
            case 'gallery': return new GalleryBlock(data);
            case 'video': return new VideoBlock(data);
            case 'code': return new CodeBlock(data);
            case 'quote': return new QuoteBlock(data);
            case 'divider': return new DividerBlock(data);
            case 'table': return new TableBlock(data);
            case 'checklist': return new ChecklistBlock(data);
            case 'callout': return new CalloutBlock(data);
            case 'warning': return new WarningBlock(data);
            case 'info': return new InfoBlock(data);
            default: return new ParagraphBlock(data);
        }
    }
}
