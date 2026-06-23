// Utility for storing and retrieving media assets (like videos) client-side in IndexedDB
const DB_NAME = 'ylrk_media_db';
const STORE_NAME = 'videos';

export function getStoredHeroVideo(): Promise<Blob | null> {
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, 1);
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      
      request.onsuccess = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          resolve(null);
          return;
        }
        
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const getReq = store.get('hero_video');
        
        getReq.onsuccess = () => {
          resolve(getReq.result ? getReq.result.blob : null);
        };
        getReq.onerror = () => resolve(null);
      };
      
      request.onerror = () => resolve(null);
    } catch (e) {
      console.warn('IndexedDB is not available:', e);
      resolve(null);
    }
  });
}

export function saveStoredHeroVideo(blob: Blob): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, 1);
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const putReq = store.put({ id: 'hero_video', blob });
        
        putReq.onsuccess = () => resolve(true);
        putReq.onerror = () => resolve(false);
      };
      
      request.onerror = () => resolve(false);
    } catch (e) {
      console.warn('Failed to save to IndexedDB:', e);
      resolve(false);
    }
  });
}

export function deleteStoredHeroVideo(): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, 1);
      request.onsuccess = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          resolve(true);
          return;
        }
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const delReq = store.delete('hero_video');
        delReq.onsuccess = () => resolve(true);
        delReq.onerror = () => resolve(false);
      };
      request.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

export function getStoredInstagramImage(key: string): Promise<Blob | null> {
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, 1);
      request.onsuccess = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          resolve(null);
          return;
        }
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const getReq = store.get(`insta_${key}`);
        getReq.onsuccess = () => {
          resolve(getReq.result ? getReq.result.blob : null);
        };
        getReq.onerror = () => resolve(null);
      };
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export function saveStoredInstagramImage(key: string, blob: Blob): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, 1);
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const putReq = store.put({ id: `insta_${key}`, blob });
        putReq.onsuccess = () => resolve(true);
        putReq.onerror = () => resolve(false);
      };
      request.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

export function deleteStoredInstagramImage(key: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, 1);
      request.onsuccess = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          resolve(true);
          return;
        }
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const delReq = store.delete(`insta_${key}`);
        delReq.onsuccess = () => resolve(true);
        delReq.onerror = () => resolve(false);
      };
      request.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}
