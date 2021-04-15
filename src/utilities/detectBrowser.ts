const hasDocument = typeof document !== 'undefined';
const hasWindow = typeof window !== 'undefined';
const doc: any = hasDocument && document;
// Check if the current browser is Internet Explorer 6-11
export const isIE = /*@cc_on!@*/ false || !!doc.documentMode;
// Edge 20+
export const isEdge = !isIE && hasWindow && !!window.StyleMedia;
