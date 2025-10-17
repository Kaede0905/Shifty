import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";

type OpenDialogProps = {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  message: string;
  title: string;
  onConfirm: () => void;
};

export function SuccessDialogExample({ title, message, openDialog, setOpenDialog, onConfirm }: OpenDialogProps) {

  const onclick = () =>{
    setOpenDialog(false);
    onConfirm();
  } 
  

  return (
    <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-green-600 text-xl">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-lg">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction 
          onClick={onclick}>
            閉じる
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
