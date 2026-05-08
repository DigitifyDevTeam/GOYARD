import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Dialog } from "./ui/dialog";

export type LightboxImage = {
  src: string;
  alt: string;
};

export function LightboxImageDialog({
  image,
  onClose,
}: Readonly<{
  image: LightboxImage | null;
  onClose: () => void;
}>) {
  return (
    <Dialog
      open={image != null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md" />
        <DialogPrimitive.Content
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          aria-label="Aperçu de l'image"
        >
          {image ? (
            <div className="relative w-full max-w-[1200px]">
              <img
                src={image.src}
                alt={image.alt}
                className="h-auto max-h-[90vh] w-full rounded-2xl object-contain shadow-2xl"
              />

              <div className="mt-3 rounded-xl bg-black/40 px-4 py-2 text-center font-['Poppins',sans-serif]">
                <p className="text-sm font-medium text-white">{image.alt}</p>
              </div>
            </div>
          ) : null}

          <DialogPrimitive.Close
            type="button"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/90 transition-colors hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#CC922F] focus:ring-offset-2 focus:ring-offset-black/50"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
}

