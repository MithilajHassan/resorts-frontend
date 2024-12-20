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

interface ConfirmDialogProps {
    id: string;
    onConfirm: (id: string, status:boolean) => void;
    isBlocked: boolean;
}

const BlockConfirm: React.FC<ConfirmDialogProps> = ({ id, onConfirm, isBlocked }) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleConfirm = () => {
        onConfirm(id,isBlocked)
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
                    className={`px-3 py-1 text-sm rounded cursor-pointer ${isBlocked
                        ? 'bg-red-600 text-white hover:bg-red-400'
                        : 'bg-green-600 text-white hover:bg-green-400'
                        }`}
                >
                    {isBlocked ? 'Unblock' : 'Block'}
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Do you really want to { isBlocked ? 'unblock' : 'block' }?
                </DialogDescription>
                <DialogFooter>
                    <Button className='bg-blue-600 hover:bg-blue-400' onClick={handleCancel}>Cancel</Button>
                    <Button variant="destructive" onClick={handleConfirm}>{isBlocked ? 'Unblock' : 'Block'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default BlockConfirm

