"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  className?: string;
}

export function ImageUpload({
  value = "",
  onChange,
  folder = "nexhack",
  label = "Banner Poster / Image",
  className = "",
}: ImageUploadProps) {
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState(value);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, WEBP, GIF, SVG).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size exceeds 10MB limit.");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image.");
      }

      onChange(data.url);
      setUrlInput(data.url);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    onChange(urlInput.trim());
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Label & Tabs */}
      <div className="flex items-center justify-between">
        {label && (
          <label className="block text-xs font-semibold text-slate-700">
            {label}
          </label>
        )}

        <div className="flex p-0.5 bg-slate-100 rounded-lg text-[11px] font-semibold border border-slate-200">
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={`px-2.5 py-0.5 rounded-md transition-all cursor-pointer ${
              tab === "upload"
                ? "bg-white text-indigo-700 shadow-2xs font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setTab("url")}
            className={`px-2.5 py-0.5 rounded-md transition-all cursor-pointer ${
              tab === "url"
                ? "bg-white text-indigo-700 shadow-2xs font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Paste URL
          </button>
        </div>
      </div>

      {/* If Image is Selected */}
      {value ? (
        <div className="relative group rounded-2xl border border-slate-200 bg-slate-50 p-3 flex items-center gap-4 shadow-2xs">
          <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
            <Image
              src={value}
              alt="Uploaded Banner Preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Banner Active</span>
            </div>
            <p className="text-[11px] text-slate-500 truncate mt-0.5 font-mono" title={value}>
              {value}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              onChange("");
              setUrlInput("");
            }}
            className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
            title="Remove banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : tab === "upload" ? (
        /* Upload Mode */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
            dragActive
              ? "border-indigo-500 bg-indigo-50/50"
              : "border-slate-300 bg-slate-50 hover:bg-slate-100/70 hover:border-slate-400"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
              <p className="text-xs text-slate-700 font-semibold">Uploading to Cloudinary...</p>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  Click or drag & drop banner image
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  PNG, JPG, WEBP, SVG up to 10MB
                </p>
              </div>
            </>
          )}
        </div>
      ) : (
        /* URL Input Mode */
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://images.unsplash.com/... or Cloudinary URL"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shrink-0 cursor-pointer"
          >
            Apply
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 text-rose-700 text-xs bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
