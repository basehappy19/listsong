export interface Song {
    id: number;
    title: string;
    artist: string;
    category: Category | null;
    categoryId: number | null;
    order: number;
    chordUrl: string;
}

export interface Category {
    id: number;
    name: string;
}
