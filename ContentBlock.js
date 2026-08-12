/**
 * ContentBlock.js
 * Abstract base class for all rich content blocks in the block editor.
 */
class ContentBlock {
    constructor(type, data = {}) {
        if (new.target === ContentBlock) {
            throw new TypeError("Cannot instantiate abstract class ContentBlock directly.");
        }
        this.id = data.id || 'blk_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        this.type = type;
        this.data = data;
    }

    /**
     * Render the block for Published/Preview View HTML
     * @returns {string} HTML string
     */
    render() {
        throw new Error("Method 'render()' must be implemented by subclass.");
    }

    /**
     * Render the block for Live Edit Mode in BlockEditor
     * @param {number} index 
     * @param {number} total 
     * @returns {string} HTML string
     */
    edit(index, total) {
        throw new Error("Method 'edit()' must be implemented by subclass.");
    }

    /**
     * Extract updated data from live edit form elements
     * @param {HTMLElement} blockElement 
     * @returns {Object} updated data
     */
    save(blockElement) {
        throw new Error("Method 'save()' must be implemented by subclass.");
    }

    /**
     * Delete/destroy block handler
     */
    delete() {
        // Default cleanup if needed
    }

    /**
     * Serialize block object to JSON
     * @returns {Object}
     */
    toJSON() {
        return {
            id: this.id,
            type: this.type,
            data: this.data
        };
    }

    static escapeHtml(str) {
        return String(str || '').replace(/[&<>"']/g, function (m) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            }[m];
        });
    }
}
