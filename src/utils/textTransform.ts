export const TextTransforms = {
  toUpperCase(text: string): string {
    return text.toUpperCase();
  },

  toLowerCase(text: string): string {
    return text.toLowerCase();
  },

  toTitleCase(text: string): string {
    return text.replace(/\b\w+/g, word => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  },

  invertCase(text: string): string {
    return text
      .split('')
      .map(char => (char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()))
      .join('');
  },

  sortLinesAscending(text: string): string {
    const lines = text.split(/\r?\n/);
    lines.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
    return lines.join('\n');
  },

  sortLinesDescending(text: string): string {
    const lines = text.split(/\r?\n/);
    lines.sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' }));
    return lines.join('\n');
  },

  removeDuplicateLines(text: string): string {
    const lines = text.split(/\r?\n/);
    const seen = new Set<string>();
    const uniqueLines = lines.filter(line => {
      if (seen.has(line)) return false;
      seen.add(line);
      return true;
    });
    return uniqueLines.join('\n');
  },

  removeEmptyLines(text: string): string {
    const lines = text.split(/\r?\n/);
    return lines.filter(line => line.trim().length > 0).join('\n');
  },

  trimTrailingWhitespace(text: string): string {
    const lines = text.split(/\r?\n/);
    return lines.map(line => line.trimEnd()).join('\n');
  },

  trimLeadingWhitespace(text: string): string {
    const lines = text.split(/\r?\n/);
    return lines.map(line => line.trimStart()).join('\n');
  },

  base64Encode(text: string): string {
    try {
      return btoa(unescape(encodeURIComponent(text)));
    } catch {
      return text;
    }
  },

  base64Decode(text: string): string {
    try {
      return decodeURIComponent(escape(atob(text)));
    } catch {
      return text;
    }
  },

  urlEncode(text: string): string {
    return encodeURIComponent(text);
  },

  urlDecode(text: string): string {
    try {
      return decodeURIComponent(text);
    } catch {
      return text;
    }
  },

  formatJSON(text: string): string {
    try {
      const parsed = JSON.parse(text);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return text;
    }
  },

  minifyJSON(text: string): string {
    try {
      const parsed = JSON.parse(text);
      return JSON.stringify(parsed);
    } catch {
      return text;
    }
  },
};
