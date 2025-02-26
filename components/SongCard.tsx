import { Song } from "@/interface/Song";
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp, Edit, ExternalLink, Music, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
type GridView = 1 | 2 | 3;

type Direction = 'up' | 'down';

export const SongCard: React.FC<{
    song: Song;
    index: number;
    totalSongs: number;
    onMove: (id: number, direction: Direction) => void;
    onEdit: (song: Song) => void;
    onDelete: (id: number) => void;
    gridView: GridView;
}> = ({ song, index, totalSongs, onMove, onEdit, onDelete, gridView }) => {
    return (
        <motion.div
            key={song.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`group bg-card rounded-xl border hover:border-primary hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden`}
        >
            <div className="w-full h-2 bg-blue-300" />
            
            <div className="p-5 flex-grow flex flex-col">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full text-primary mr-3">
                            <Music className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-medium text-lg truncate">{song.title}</h3>
                            <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                        </div>
                    </div>
                </div>
                
                {song.category && (
                    <div className="mb-4">
                        <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {song.category.name}
                        </span>
                    </div>
                )}
                
                <div className="mt-auto pt-4 border-t flex justify-between items-center">
                    <div className="flex items-center gap-1">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => onMove(song.id, 'up')}
                                        disabled={index === 0}
                                        className="h-8 w-8 rounded-full bg-secondary hover:bg-secondary/80"
                                    >
                                        <ChevronUp className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>เลื่อนลำดับขึ้น</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => onMove(song.id, 'down')}
                                        disabled={index === totalSongs - 1}
                                        className="h-8 w-8 rounded-full bg-secondary hover:bg-secondary/80"
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>เลื่อนลำดับลง</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => window.open(song.chordUrl, '_blank')}
                                        className="h-8 w-8 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 border-blue-200"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>เปิดคอร์ด</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => onEdit(song)}
                                        className="h-8 w-8 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-600 hover:text-amber-700 border-amber-200"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>แก้ไขเพลง</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => onDelete(song.id)}
                                        className="h-8 w-8 rounded-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border-red-200"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>ลบเพลง</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};