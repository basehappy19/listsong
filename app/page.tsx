import React from 'react'
import SongListClient from './Client'
import { getSongs } from '@/functions/Song';
import { Category, Song } from '@/interface/Song';
import { getCategories } from '@/functions/Category';
export const revalidate = 0

export default async function HomePage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const searchParams = await props.searchParams
    const categorySearch = typeof searchParams.category === 'string' ? Number(searchParams.category) : undefined;
    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
    const songs: Song[] = await getSongs({ categoryId: categorySearch, search: search });
    const categories: Category[] = await getCategories();
    return (
        <SongListClient songs={songs} categories={categories} categorySearch={categorySearch} />
    )
}
