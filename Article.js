/**
 * Article.js
 * Model class encapsulating article metadata and an ordered array of ContentBlock objects.
 */
class Article {
    constructor(data = {}) {
        this.id = data.id || 'art_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        this.title = data.title || 'Arsitektur Komputer & Sistem Operasi Modern';
        this.category = data.category || 'Informatika';
        this.summary = data.summary || 'Eksplorasi mendalam mengenai struktur mikroprosesor, hierarki memori, serta manajemen proses.';
        this.coverImage = data.coverImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80';
        this.author = data.author || 'Eryl Mayshesa Farizal';
        this.readTime = data.readTime || '5 menit membaca';
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();

        // Deserialize array of ContentBlock instances
        this.blocks = [];
        if (Array.isArray(data.blocks) && data.blocks.length > 0) {
            this.blocks = data.blocks.map(b => BlockFactory.createBlock(b.type, b.data || b));
        } else {
            this.loadDefaultBlocks();
        }
    }

    loadDefaultBlocks() {
        this.blocks = [
            BlockFactory.createBlock('heading', { level: 'h1', text: 'Pengantar Arsitektur Sistem Komputer' }),
            BlockFactory.createBlock('paragraph', { text: 'Arsitektur komputer menggambarkan struktur sistem fisik dan operasi logika yang memungkinkan komputer mengeksekusi instruksi program secara efisien dan cepat.' }),
            BlockFactory.createBlock('image', {
                url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
                caption: 'Komponen Arsitektur Mikroprosesor Modern',
                alignment: 'center'
            }),
            BlockFactory.createBlock('heading', { level: 'h2', text: 'Video Pembahasan Utama' }),
            BlockFactory.createBlock('video', {
                videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                caption: 'Visualisasi Cara Kerja CPU & Memori Utama'
            }),
            BlockFactory.createBlock('paragraph', { text: 'Dengan memanfaatkan kombinasi pipelining, caching, dan eksekusi spekulatif, prosesor modern mampu mengeksekusi miliaran instruksi per detik.' }),
            BlockFactory.createBlock('code', {
                language: 'cpp',
                code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Arsitektur Komputer & Informatika" << endl;\n    return 0;\n}'
            }),
            BlockFactory.createBlock('callout', {
                icon: '💡',
                text: 'Optimalisasi memori cache L1, L2, dan L3 memainkan peran kunci dalam menekan latency transfer data.'
            })
        ];
    }

    addBlock(type, data = {}, index = null) {
        const block = BlockFactory.createBlock(type, data);
        if (index !== null && index >= 0 && index < this.blocks.length) {
            this.blocks.splice(index, 0, block);
        } else {
            this.blocks.push(block);
        }
        this.updatedAt = new Date().toISOString();
        return block;
    }

    moveBlock(fromIndex, toIndex) {
        if (fromIndex < 0 || fromIndex >= this.blocks.length) return;
        if (toIndex < 0 || toIndex >= this.blocks.length) return;
        const [moved] = this.blocks.splice(fromIndex, 1);
        this.blocks.splice(toIndex, 0, moved);
        this.updatedAt = new Date().toISOString();
    }

    duplicateBlock(id) {
        const index = this.blocks.findIndex(b => b.id === id);
        if (index === -1) return;
        const orig = this.blocks[index];
        const dup = BlockFactory.createBlock(orig.type, JSON.parse(JSON.stringify(orig.data)));
        this.blocks.splice(index + 1, 0, dup);
        this.updatedAt = new Date().toISOString();
    }

    removeBlock(id) {
        this.blocks = this.blocks.filter(b => b.id !== id);
        this.updatedAt = new Date().toISOString();
    }

    getBlockById(id) {
        return this.blocks.find(b => b.id === id);
    }

    renderHTML() {
        return this.blocks.map(b => b.render()).join('');
    }

    getFormattedUpdatedAt() {
        try {
            return new Date(this.updatedAt).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return 'Terbaru';
        }
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            category: this.category,
            summary: this.summary,
            coverImage: this.coverImage,
            author: this.author,
            readTime: this.readTime,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            blocks: this.blocks.map(b => b.toJSON())
        };
    }
}
