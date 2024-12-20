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
    action: string;
    children: ReactElement;
}

const Confirm: React.FC<ConfirmDialogProps> = ({ id, onConfirm, action, children }) => {
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
                    Do you really want to {action}?
                </DialogDescription>
                <DialogFooter>
                    <Button className='bg-blue-600 hover:bg-blue-400' onClick={handleCancel}>No</Button>
                    <Button className='bg-green-600 hover:bg-green-400' onClick={handleConfirm}>Yes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default Confirm

