"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  onFileSelected: (file: File) => void;
  preview: string | null;
  onClear: () => void;
  isProcessing: boolean;
}

export function DropZone({
  onFileSelected,
  preview,
  onClear,
  isProcessing,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith("image/")) {
          onFileSelected(file);
        }
      }
    },
    [onFileSelected]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
  };

  if (preview) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-card-border animate-scale-in">
        <img
          src={preview}
          alt="Receipt preview"
          className="w-full max-h-72 object-contain bg-background"
        />
        {!isProcessing && (
          <button
            onClick={onClear}
            className="absolute top-3 right-3 p-2 rounded-xl glass hover:bg-danger-light hover:text-danger transition-all shadow-md"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {isProcessing && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full border-3 border-accent-blue-light border-t-accent-blue animate-spin-slow" />
            <p className="mt-4 text-sm font-semibold text-accent-blue">
              Analyzing receipt...
            </p>
            <p className="text-xs text-muted mt-1">AI is extracting data</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileRef.current?.click()}
      className={cn(
        "drop-zone rounded-2xl p-10 text-center cursor-pointer transition-all duration-200",
        isDragging
          ? "active border-accent-blue bg-accent-blue-light/50 scale-[1.01]"
          : "hover:border-muted-light hover:bg-card"
      )}
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
      <div
        className={cn(
          "w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 transition-all",
          isDragging
            ? "bg-accent-blue/10 scale-110"
            : "bg-card-border/40"
        )}
      >
        {isDragging ? (
          <ImageIcon className="w-7 h-7 text-accent-blue" />
        ) : (
          <Upload className="w-7 h-7 text-muted" />
        )}
      </div>
      <p className="text-sm font-semibold text-foreground">
        {isDragging ? "Drop your receipt here" : "Upload receipt image"}
      </p>
      <p className="text-xs text-muted-light mt-1.5">
        Drag & drop or click to browse • JPG, PNG, WebP
      </p>
    </div>
  );
}
