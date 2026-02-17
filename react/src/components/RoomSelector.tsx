export interface RoomSelectorProps {
  selectedRoom?: string | null;
  onRoomSelect?: (roomId: string) => void;
  rooms?: string[];
  className?: string;
  uploadedImages?: unknown[];
  onImagesUpload?: (images: unknown[]) => void;
  onContinue?: () => void;
  hasUploadedImages?: boolean;
  onSurfaceChange?: (surface: number) => void;
  onDeleteImage?: (imageId: string) => void;
}

export function RoomSelector({
  selectedRoom,
  onRoomSelect,
  rooms = [],
  className,
}: RoomSelectorProps) {
  return (
    <div className={className} data-testid="room-selector">
      {rooms.map((roomId) => (
        <button
          key={roomId}
          type="button"
          data-selected={selectedRoom === roomId}
          onClick={() => onRoomSelect?.(roomId)}
        >
          {roomId}
        </button>
      ))}
    </div>
  );
}
