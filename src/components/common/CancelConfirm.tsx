import { ReactElement, useState } from 'react';
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
    onConfirm: (id: string) => void;
    children: ReactElement;
}

const CancelConfirm: React.FC<ConfirmDialogProps> = ({ id, onConfirm, children }) => {
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
            {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Do you really want to cancel this booking?
                </DialogDescription>
                <DialogFooter>
                    <Button className='bg-blue-600 hover:bg-blue-400' onClick={handleCancel}>Close</Button>
                    <Button variant="destructive" onClick={handleConfirm}>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CancelConfirm

