import { useState } from 'react';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription
} from '../ui/dialog';
import { MdDelete } from 'react-icons/md';

interface ConfirmDialogProps {
    id: string;
    onConfirm: (id: string) => void;
}

const DeletConfirm: React.FC<ConfirmDialogProps> = ({ id, onConfirm }) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleConfirm = () => {
        onConfirm(id)
        setIsOpen(false)
    }

    const handleCancel = () => {
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button
                    onClick={() => setIsOpen(true)}
                    className="text-red-600 hover:text-red-400 cursor-pointer"
                    style={{ fontSize: '1.3rem' }}
                >
                    <MdDelete />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Do you really want to delete this item? This action cannot be undone.
                </DialogDescription>
                <DialogFooter>
                    <Button className='bg-blue-600 hover:bg-blue-400' onClick={handleCancel}>Cancel</Button>
                    <Button variant="destructive" onClick={handleConfirm}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeletConfirm

