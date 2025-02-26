import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category, Song } from "@/interface/Song";
import { FormEvent } from "react";

export const SongForm: React.FC<{
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