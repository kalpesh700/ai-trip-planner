export function normalizeKeys(obj) {
    if (typeof obj !== 'object' || obj === null) return obj;
  
    if (Array.isArray(obj)) {
      return obj.map(item => normalizeKeys(item));
    }
  
    const normalizedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const normalizedKey = key.toLowerCase();
        normalizedObj[normalizedKey] = normalizeKeys(obj[key]);
      }
    }
    return normalizedObj;
  }
  