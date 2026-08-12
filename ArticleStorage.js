/**
 * ArticleStorage.js
 * LocalStorage JSON persistence wrapper for block-based Articles.
 */
class ArticleStorage {
    constructor(storageKey = 'userBlockArticlesData') {
        this.storageKey = storageKey;
    }

    /**
     * Load raw articles array from LocalStorage
     * @returns {Array|null}
     */
    load() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.error('Error loading articles from LocalStorage:', e);
            return null;
        }
    }

    /**
     * Save articles JSON array to LocalStorage
     * @param {Array} articlesData 
     * @returns {boolean}
     */
    save(articlesData) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(articlesData));
            return true;
        } catch (e) {
            console.error('Error saving articles to LocalStorage:', e);
            return false;
        }
    }

    /**
     * Clear all articles from LocalStorage
     */
    clear() {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (e) {
            console.error('Error clearing articles from LocalStorage:', e);
        }
    }
}
