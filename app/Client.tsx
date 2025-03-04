'use client'
import React, { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import { Category, Song } from '@/interface/Song';
import { addSong, deleteSong, moveSong, updateSong } from '@/functions/Song';
import { toast } from 'react-toastify';
import { SongForm } from './SongForm';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SongCard } from '@/components/SongCard';

type Direction = 'up' | 'down';
type GridView = 1 | 2 | 3;



const SongListClient: React.FC<{
    songs: Song[],
    categories: Category[],
    categorySearch: number | undefined
}> = ({ songs, categories, categorySearch }) => {
    const [editingSong, setEditingSong] = useState<Song | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [gridView, setGridView] = useState<GridView>(3);
    
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setGridView(1);
            } else {
                setGridView(3);
            }
        };
        
        handleResize();
        
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleMoveSong = async (id: number, direction: Direction) => {
        await moveSong(id, direction);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
            if (editingSong) {
                await updateSong(formData, editingSong.id);
                toast.success(`แก้ไขเพลงสำเร็จ`, { position: `bottom-right` });
            } else {
                await addSong(formData)
                toast.success(`เพิ่มเพลงสำเร็จ`, { position: `bottom-right` });
            }
            setIsDialogOpen(false);
            setEditingSong(null);
        } catch (error) {
            console.error(error);
            toast.error(`เกิดข้อผิดพลาด`, { position: `bottom-right` });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteSong(id);
            toast.success(`ลบเพลงสำเร็จ`, { position: `bottom-right` });
        } catch (error) {
            console.error(error);
            toast.error(`เกิดข้อผิดพลาด ลบเพลงไม่ได้`);
        }
    };

    const getGridClass = () => {
        switch (gridView) {
            case 1: return "grid-cols-1";
            case 2: return "grid-cols-1 md:grid-cols-2";
            case 3: return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
            default: return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Card className="w-full">
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <CardTitle className="text-2xl">รายการเพลง</CardTitle>
                        <div className="md:flex flex-col sm:flex-row gap-4 w-full">
                            <div className="hidden md:flex items-center gap-2 bg-secondary/20 rounded-lg p-1">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button 
                                                variant={gridView === 1 ? "default" : "ghost"} 
                                                size="icon" 
                                                className={`${gridView === 1 ? 'bg-blue-500' : 'bg-blue-400'} font-medium h-8 w-8  hover:bg-blue-500`}
                                                onClick={() => setGridView(1)}
                                            >
                                                1
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>1 คอลัมน์</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button 
                                                variant={gridView === 2 ? "default" : "ghost"} 
                                                size="icon" 
                                                className={`${gridView === 2 ? 'bg-blue-500' : 'bg-blue-400'} font-medium h-8 w-8 bg-blue-400 hover:bg-blue-500`}
                                                onClick={() => setGridView(2)}
                                            >
                                                2
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>2 คอลัมน์</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button 
                                                variant={gridView === 3 ? "default" : "ghost"} 
                                                size="icon" 
                                                className={`${gridView === 3 ? 'bg-blue-500' : 'bg-blue-400'} font-medium h-8 w-8 bg-blue-400 hover:bg-blue-500`}
                                                onClick={() => setGridView(3)}
                                            >
                                                3
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>3 คอลัมน์</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
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
                    </div>
                    
                    <motion.div
                        className="flex flex-wrap gap-2 mt-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Link href="/">
                            <Button
                                variant={!categorySearch ? 'default' : 'outline'}
                                className={`${!categorySearch ? 'bg-blue-500' : 'bg-blue-400'} hover:bg-blue-500 w-full md:w-auto`}
                            >
                                ทั้งหมด
                            </Button>
                        </Link>
                        {categories.map(category => (
                            <Link key={category.id} href={`?category=${category.id}`}>
                                <Button
                                    variant={categorySearch === category.id ? 'default' : 'outline'}
                                    className={`${categorySearch === category.id ? 'bg-blue-500' : 'bg-blue-400'} font-medium hover:bg-blue-500 w-full md:w-auto`}
                                >
                                    {category.name}
                                </Button>
                            </Link>
                        ))}
                    </motion.div>
                </CardHeader>
                <CardContent>
                    <AnimatePresence mode="popLayout">
                        <div className={`grid ${getGridClass()} gap-6`}>
                            {songs.map((song, index) => (
                                <SongCard
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