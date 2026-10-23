"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX_SIZE = 4 * 1024 * 1024;

function validateFiles(files: File[]) {
  for (const file of files) {
    if (!ALLOWED.has(file.type)) {
      return `${file.name}: use a JPG, PNG, WebP, or AVIF image.`;
    }
    if (file.size > MAX_SIZE) {
      return `${file.name} is larger than 4 MB.`;
    }
  }
  return null;
}

async function uploadImages(files: File[], folder: string) {
  const formData = new FormData();
  files.slice(0, 4).forEach((file) => formData.append("files", file));
  formData.append("folder", folder);

  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });
  const data = (await response.json()) as {
    success?: boolean;
    urls?: string[];
    error?: string;
  };

  if (!response.ok || !data.success || !data.urls?.length) {
    throw new Error(data.error ?? "Upload failed. Please try again.");
  }

  return data.urls;
}

function PreviewImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 90vw, 34rem"
      unoptimized
      className="object-cover"
    />
  );
}

export function ImageUploader({
  value,
  onChange,
  label = "Cover image",
  hint = "16:9 works best. JPG, PNG, WebP, or AVIF up to 4 MB.",
  folder = "projects",
  aspect = "video",
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  hint?: string;
  folder?: string;
  aspect?: "video" | "square";
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [url, setUrl] = useState(value);

  useEffect(() => setUrl(value), [value]);

  async function handleFiles(files: File[]) {
    if (!files.length) return;
    const invalid = validateFiles(files);
    if (invalid) {
      toast.error(invalid);
      return;
    }

    setUploading(true);
    try {
      const urls = await uploadImages(files.slice(0, 1), folder);
      if (urls[0]) {
        onChange(urls[0]);
        setUrl(urls[0]);
        toast.success("Image uploaded.");
      }
    } catch (uploadError) {
      toast.error(
        uploadError instanceof Error ? uploadError.message : "Upload failed.",
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="field-label">
        <span>{label}</span>
        <span className="text-[0.62rem] font-normal text-muted">Optional</span>
      </div>

      <div
        className={cn(
          "overflow-hidden rounded-xl border border-dashed border-line bg-surface/40",
          dragging && "border-accent/60 bg-accent/5",
          error && "border-red-500/60",
        )}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void handleFiles(Array.from(event.dataTransfer.files));
        }}
      >
        {value ? (
          <div
            className={cn(
              "relative w-full",
              aspect === "square" ? "aspect-square" : "aspect-video",
            )}
          >
            <PreviewImage src={value} alt={`${label} preview`} />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/45 opacity-0 transition-opacity duration-300 hover:opacity-100">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[0.65rem] font-medium text-black"
              >
                {uploading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <UploadCloud className="h-3 w-3" />
                )}
                Replace
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setUrl("");
                }}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 rounded-full bg-red-500/90 px-3 py-1.5 text-[0.65rem] font-medium text-white"
              >
                <Trash2 className="h-3 w-3" />
                Remove
              </button>
            </div>
            {uploading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              </div>
            ) : null}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={cn(
              "flex w-full flex-col items-center justify-center px-5 text-center",
              aspect === "square" ? "aspect-square" : "aspect-video",
            )}
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-muted">
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ImagePlus className="h-4 w-4" />
              )}
            </span>
            <span className="mt-3 text-xs font-medium text-ink">
              {uploading ? "Uploading…" : "Click to upload or drag an image here"}
            </span>
            <span className="mt-1 max-w-xs text-[0.62rem] leading-relaxed text-muted">
              {hint}
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(event) => {
          void handleFiles(Array.from(event.target.files ?? []));
        }}
      />

      <div className="mt-2 flex items-center gap-2">
        <input
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onChange(url.trim());
            }
          }}
          placeholder="…or paste an image URL"
          aria-label={`${label} URL`}
          className="field h-9 flex-1 text-[0.68rem]"
        />
        <button
          type="button"
          onClick={() => onChange(url.trim())}
          className="inline-flex h-9 shrink-0 items-center rounded-full border border-line bg-surface px-3 text-[0.65rem] font-medium text-ink transition-colors hover:bg-surface-muted"
        >
          Use URL
        </button>
      </div>

      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function GalleryUploader({
  value,
  onChange,
  folder = "projects",
  max = 12,
  error,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  folder?: string;
  max?: number;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");
  const [dragging, setDragging] = useState(false);

  async function handleFiles(files: File[]) {
    if (!files.length) return;
    if (value.length + files.length > max) {
      toast.error(`You can add up to ${max} gallery images.`);
      return;
    }
    const invalid = validateFiles(files);
    if (invalid) {
      toast.error(invalid);
      return;
    }

    setUploading(true);
    try {
      const urls = await uploadImages(files, folder);
      onChange([...value, ...urls].slice(0, max));
      toast.success(`${urls.length} image${urls.length === 1 ? "" : "s"} uploaded.`);
    } catch (uploadError) {
      toast.error(
        uploadError instanceof Error ? uploadError.message : "Upload failed.",
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function addUrl() {
    const trimmed = url.trim();
    if (!trimmed) return;
    if (value.includes(trimmed)) {
      toast.error("That image is already in the gallery.");
      return;
    }
    if (value.length >= max) {
      toast.error(`You can add up to ${max} gallery images.`);
      return;
    }
    onChange([...value, trimmed]);
    setUrl("");
  }

  return (
    <div>
      <div className="field-label">
        <span>Gallery</span>
        <span className="text-[0.62rem] font-normal text-muted">
          {value.length}/{max}
        </span>
      </div>

      <div
        className={cn(
          "rounded-xl border border-dashed border-line bg-surface/40 p-2.5",
          dragging && "border-accent/60 bg-accent/5",
          error && "border-red-500/60",
        )}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void handleFiles(Array.from(event.dataTransfer.files));
        }}
      >
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {value.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="group relative aspect-square overflow-hidden rounded-lg border border-line bg-surface-muted"
            >
              <PreviewImage src={image} alt={`Gallery image ${index + 1}`} />
              <button
                type="button"
                onClick={() => onChange(value.filter((item) => item !== image))}
                aria-label={`Remove gallery image ${index + 1}`}
                className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading || value.length >= max}
            className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-line-strong bg-surface/40 text-muted transition-colors hover:border-accent/40 hover:text-accent disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ImagePlus className="h-4 w-4" />
            )}
            <span className="text-[0.58rem]">
              {uploading ? "Uploading…" : "Add images"}
            </span>
          </button>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(event) => {
          void handleFiles(Array.from(event.target.files ?? []));
        }}
      />

      <div className="mt-2 flex items-center gap-2">
        <input
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addUrl();
            }
          }}
          placeholder="…or paste an image URL"
          aria-label="Gallery image URL"
          className="field h-9 flex-1 text-[0.68rem]"
        />
        <button
          type="button"
          onClick={addUrl}
          className="inline-flex h-9 shrink-0 items-center rounded-full border border-line bg-surface px-3 text-[0.65rem] font-medium text-ink transition-colors hover:bg-surface-muted"
        >
          Add URL
        </button>
      </div>

      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : (
        <p className="mt-1.5 text-[0.65rem] text-muted">
          Upload up to 4 at a time. Images are optimised by Cloudinary.
        </p>
      )}
    </div>
  );
}
