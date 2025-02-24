'use client'
import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ArrowUp, ArrowDown, Edit2, Trash2, Link as LinkIcon, Music } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from '@/hooks/use-toast';
import { Category, Song } from '@/interface/Song';
import { addSong, deleteSong, moveSong, updateSong } from '@/functions/Song';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Direction = 'up' | 'down';

interface SongItemProps {
    song: Song;
    index: number;
    totalSongs: number;
    onMove: (id: number, direction: Direction) => void;
    onEdit: (song: Song) => void;
    onDelete: (id: number) => void;
}

// Song Form Component
const SongForm: React.FC<{
    onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
    editingSong: Song | null;
    categories: Category[];
}> = ({ onSubmit, editingSong, categories }) => (
    <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor="title">ชื่อเพลง</Label>
                <Input
                    id="title"
                    name="title"
                    required
                    defaultValue={editingSong?.title}
                    placeholder="ใส่ชื่อเพลง"
                    className="w-full"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="artist">ศิลปิน</Label>
                <Input
                    id="artist"
                    name="artist"
                    required
                    defaultValue={editingSong?.artist}
                    placeholder="ใส่ชื่อศิลปิน"
                    className="w-full"
                />
            </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor="category">หมวดหมู่</Label>
                <Select
                    name="categoryId"
                    defaultValue={editingSong?.category?.id.toString()}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="เลือกหมวดหมู่" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((category) => (
                            <SelectItem
                                key={category.id} value={category.id.toString()}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="chordUrl">ลิงก์คอร์ด</Label>
                <Input
                    id="chordUrl"
                    name="chordUrl"
                    type="url"
                    defaultValue={editingSong?.chordUrl}
                    placeholder="https://..."
                    className="w-full"
                />
            </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
            <DialogClose asChild>
                <Button type="button" variant="outline">
                    ยกเลิก
                </Button>
            </DialogClose>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
                {editingSong ? 'บันทึกการแก้ไข' : 'เพิ่มเพลง'}
            </Button>
        </div>
    </form>
);

const SongItem: React.FC<SongItemProps> = ({
    song,
    index,
    totalSongs,
    onMove,
    onEdit,
    onDelete
}) => (
    <motion.div
        key={song.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="group flex items-center gap-4 p-4 bg-card rounded-lg border hover:border-primary transition-all duration-200"
    >
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full">
            <Music className="w-6 h-6 text-primary" />
        </div>

        <div className="flex-grow min-w-0">
            <div className="flex items-baseline gap-2">
                <h3 className="font-medium truncate">{song.title}</h3>
                {song.category && (
                    <span className="hidden md:inline-block text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {song.category.name}
                    </span>
                )}
            </div>
            <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
        </div>

        <div className="flex items-center gap-1 md:gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onMove(song.id, 'up')}
                disabled={index === 0}
                className="hidden md:inline-flex"
            >
                <ArrowUp className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onMove(song.id, 'down')}
                disabled={index === totalSongs - 1}
                className="hidden md:inline-flex"
            >
                <ArrowDown className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(song.chordUrl, '_blank')}
            >
                <LinkIcon className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(song)}
            >
                <Edit2 className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => onDelete(song.id)}
            >
                <Trash2 className="w-4 h-4" />
            </Button>
        </div>
    </motion.div>
);

// Main Component
const SongListClient: React.FC<{
    songs: Song[],
    categories: Category[],
    categorySearch: number | undefined
}> = ({ songs, categories, categorySearch }) => {
    const [editingSong, setEditingSong] = useState<Song | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const { toast } = useToast();

    const handleMoveSong = async (id: number, direction: Direction) => {
        await moveSong(id, direction);
        toast({
            title: "ย้ายเพลงสำเร็จ",
            description: "ลำดับเพลงถูกเปลี่ยนแปลงแล้ว",
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
            if (editingSong) {
                const updatedSong = await updateSong(formData, editingSong.id);
                toast({
                    title: "แก้ไขเพลงสำเร็จ",
                    description: `เพลง ${updatedSong.title} ถูกแก้ไขแล้ว`,
                });
            } else {
                const newSong = await addSong(formData)
                toast({
                    title: "เพิ่มเพลงสำเร็จ",
                    description: `เพลง ${newSong.title} ถูกเพิ่มแล้ว`,
                });
            }
            setIsDialogOpen(false);
            setEditingSong(null);
        } catch (error) {
            console.error(error);
            toast({
                title: "เกิดข้อผิดพลาด",
                description: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const deletedSong = await deleteSong(id);
            toast({
                title: "ลบเพลงสำเร็จ",
                description: `เพลง ${deletedSong.title} ถูกลบแล้ว`,
                variant: "destructive",
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "เกิดข้อผิดพลาด",
                description: "ไม่สามารถลบเพลงได้ กรุณาลองใหม่อีกครั้ง",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Card className="w-full">
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <CardTitle className="text-2xl">รายการเพลง</CardTitle>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
                                    onClick={() => setEditingSong(null)}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    เพิ่มเพลง
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>{editingSong ? 'แก้ไขเพลง' : 'เพิ่มเพลง'}</DialogTitle>
                                </DialogHeader>
                                <SongForm
                                    onSubmit={handleSubmit}
                                    editingSong={editingSong}
                                    categories={categories}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>
                    <motion.div
                        className="flex flex-wrap gap-2 mt-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Link href="/">
                            <Button
                                variant={!categorySearch ? 'default' : 'outline'}
                                className="w-full md:w-auto"
                            >
                                ทั้งหมด
                            </Button>
                        </Link>
                        {categories.map(category => (
                            <Link key={category.id} href={`?category=${category.id}`}>
                                <Button
                                    variant={categorySearch === category.id ? 'default' : 'outline'}
                                    className="w-full md:w-auto"
                                >
                                    {category.name}
                                </Button>
                            </Link>
                        ))}
                    </motion.div>
                </CardHeader>
                <CardContent>
                    <AnimatePresence mode="popLayout">
                        <div className="space-y-3">
                            {songs.map((song, index) => (
                                <SongItem
                                    key={song.id}
                                    song={song}
                                    index={index}
                                    totalSongs={songs.length}
                                    onMove={handleMoveSong}
                                    onEdit={(song) => {
                                        setEditingSong(song);
                                        setIsDialogOpen(true);
                                    }}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    );
};

export default SongListClient;