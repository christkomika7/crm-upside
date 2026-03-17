"use client"

import { useEffect, useState } from "react"
import {
  formatBytes,
  useFileUpload,
  type FileWithPreview,
} from "@/hooks/use-file-upload"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { UserIcon, XIcon, CircleAlertIcon } from "lucide-react"
import { Spinner } from "../ui/spinner"

interface AvatarUploadProps {
  maxSize?: number;
  className?: string;
  onFileChange?: (file: FileWithPreview | null) => void;
  onDefaultRemove?: () => void;
  defaultAvatar?: string;
  isLoading?: boolean;
}

export function AvatarProfil({
  maxSize = 2 * 1024 * 1024,
  className,
  onFileChange,
  defaultAvatar,
  onDefaultRemove,
  isLoading,
}: AvatarUploadProps) {
  const [
    { files, isDragging, errors },
    {
      removeFile,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles: 1,
    maxSize,
    accept: "image/*",
    multiple: false,
  })
  const [defaultRemoved, setDefaultRemoved] = useState(false)

  const currentFile = files[0]
  const previewUrl = currentFile?.preview || (!defaultRemoved ? defaultAvatar : undefined)
  const showRemoveButton = !!currentFile || (!!defaultAvatar && !defaultRemoved)


  useEffect(() => {
    if (onFileChange) {
      onFileChange(currentFile || null)
    }
  }, [currentFile, onFileChange])



  const handleRemove = () => {
    if (currentFile) {
      removeFile(currentFile.id)
    } else if (defaultAvatar && !defaultRemoved) {
      setDefaultRemoved(true)
      onDefaultRemove?.()
    }
  }

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative">
        <div
          className={cn(
            "group/avatar relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border border-dashed transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/20",
            previewUrl && "border-solid"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input {...getInputProps()} className="sr-only" />

          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <UserIcon className="text-muted-foreground size-6" />
            </div>
          )}
        </div>

        {showRemoveButton && (
          <Button
            size="icon"
            variant="outline"
            onClick={(e) => { e.stopPropagation(); handleRemove(); }}
            className="absolute end-0.5 top-0.5 z-10 size-6 rounded-full dark:bg-zinc-800 hover:dark:bg-zinc-700"
            aria-label="Remove avatar"
          >
            <XIcon className="size-3.5" />
          </Button>
        )}

        {isLoading && (
          <Button
            size="icon"
            variant="outline"
            className="absolute end-0.5 top-0.5 z-10 size-6 rounded-full dark:bg-zinc-800 hover:dark:bg-zinc-700"
            aria-label="Remove avatar"
          >
            <Spinner className="size-3.5" />
          </Button>
        )}
      </div>

      <div className="space-y-0.5 text-center">
        <p className="text-sm font-medium">
          {currentFile ? "Avatar téléchargé" : "Télécharger l’avatar"}
        </p>
        <p className="text-muted-foreground text-xs">
          Formats acceptés : PNG, JPG (jusqu’à {formatBytes(maxSize)})
        </p>
      </div>

      {errors.length > 0 && (
        <Alert variant="destructive" className="mt-5">
          <CircleAlertIcon />
          <AlertTitle>Échec de l’envoi du fichier.</AlertTitle>
          <AlertDescription>
            {errors.map((error, index) => (
              <p key={index} className="last:mb-0">
                {error}
              </p>
            ))}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}