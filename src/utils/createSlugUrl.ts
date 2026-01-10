export const createSlugUrl = (url: string): string => {
    const slugifiedUrl = url.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    return slugifiedUrl;
}