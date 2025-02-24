'use server'

import { Song } from "@/interface/Song"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export const getSongs = async ({ categoryId, search }: { categoryId: number | undefined, search: string | undefined }) => {
    const songs = await prisma.song.findMany({
        where: {
            AND: [
                categoryId ? { categoryId: categoryId } : {},
                search
                    ? {
                        OR: [
                            { title: { contains: search } },
                            { artist: { contains: search } },
                        ],
                    }
                    : {},
            ],
        },
        include: {
            category: true,
        },
        orderBy: { order: 'asc' },
    })

    return songs
}
type Direction = 'up' | 'down';

export const moveSong = async (id: number, direction: Direction): Promise<void> => {
    const songsLength = await prisma.song.count();

    const song = await prisma.song.findFirst({
        where: { id: id }
    });

    if (!song) return;

    const order = song.order;

    if (direction === 'up' && order > 0) {
        const prevSong = await prisma.song.findFirst({
            where: { order: order - 1 }
        });

        if (prevSong) {
            await prisma.song.update({
                where: { id: id },
                data: {
                    order: prevSong.order
                }
            });

            await prisma.song.update({
                where: { id: prevSong.id },
                data: {
                    order: order
                }
            });
        }
    }

    if (direction === 'down' && order < songsLength - 1) {
        const nextSong = await prisma.song.findFirst({
            where: { order: order + 1 }
        });

        if (nextSong) {
            await prisma.song.update({
                where: { id: id },
                data: {
                    order: nextSong.order
                }
            });

            await prisma.song.update({
                where: { id: nextSong.id },
                data: {
                    order: order
                }
            });
        }
    }

    revalidatePath('/');
};

export const updateSong = async (formData: FormData, songId: number) => {
    const songData: Pick<Song, 'title' | 'artist' | 'categoryId' | 'chordUrl'> = {
        title: formData.get('title') as string,
        artist: formData.get('artist') as string,
        categoryId: parseInt(formData.get('categoryId') as string),
        chordUrl: formData.get('chordUrl') as string,
    };

    const updatedSong = await prisma.song.update({
        where: { id: songId },
        data: songData
    });
    revalidatePath(`/`);
    return updatedSong;
};

export const addSong = async (formData: FormData) => {
    const lastSong = await prisma.song.findFirst({
        orderBy: { order: 'desc' }
    });

    const newOrder = lastSong ? lastSong.order + 1 : 0;

    const songData: Pick<Song, 'title' | 'artist' | 'categoryId' | 'chordUrl'> = {
        title: formData.get('title') as string,
        artist: formData.get('artist') as string,
        categoryId: parseInt(formData.get('categoryId') as string),
        chordUrl: formData.get('chordUrl') as string,
    };

    const newSong = await prisma.song.create({
        data: {
            ...songData,
            order: newOrder,
        }
    });

    revalidatePath('/');
    return newSong;
};

export const deleteSong = async (songId: number) => {
    const songToDelete = await prisma.song.findUnique({
        where: { id: songId }
    });

    if (!songToDelete) {
        throw new Error('ไม่พบเพลง');
    }

    await prisma.song.delete({
        where: { id: songId }
    });

    await prisma.song.updateMany({
        where: {
            order: { gt: songToDelete.order }
        },
        data: {
            order: {
                decrement: 1
            }
        }
    });
    revalidatePath('/');
    return songToDelete;
};
