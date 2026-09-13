import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Camera, Check } from 'lucide-react';

/**
 * Image upload component supporting both drag-and-drop and click-to-browse.
 * Converts uploaded image to an optimized Base64 data URL for direct MongoDB storage.
 */
export const ImageUpload = ({
  value,
  onChange,
  onRemove,
  label = 'Upload Your Profile Picture',
  helperText = 'PNG, JPG or WebP up to 4MB. Converted securely to your profile.',
  className = '',
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const processFile = (file) => {
    setUploadError('');
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    // Validate size (max 4MB)
    if (file.size > 4 * 1024 * 1024) {
      setUploadError('Image size exceeds 4MB. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      if (onChange) {
        onChange(dataUrl);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read the image file. Please try another one.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onRemove) {
      onRemove();
    } else if (onChange) {
      onChange('');
    }
  };

  return (
    <div className={`w-full space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          {label}
        </label>
      )}

      {value ? (
        <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-800/40 transition-all">
          <div className="relative group">
            <img
              src={value}
              alt="Uploaded Avatar Preview"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-500 shadow-md"
            />
            <button
              type="button"
              onClick={handleRemove}
              aria-label="Remove uploaded image"
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md hover:bg-rose-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <Check className="w-3.5 h-3.5" />
              <span>Custom Photo Selected</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              Will be saved to your MongoDB traveler account
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-1.5 text-xs font-semibold text-[#6C3DF5] hover:text-[#5826df] dark:text-purple-400 underline underline-offset-2"
            >
              Change Photo
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed cursor-pointer transition-all text-center ${
            isDragging
              ? 'border-[#6C3DF5] bg-purple-50/60 dark:bg-purple-950/30'
              : 'border-slate-200 dark:border-slate-700/80 hover:border-purple-400 dark:hover:border-purple-500/60 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-purple-50/20'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-[#6C3DF5] dark:text-purple-400 mb-2">
            <Upload className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Click to browse or drag & drop photo
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {helperText}
          </p>
        </div>
      )}

      {uploadError && (
        <p className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-1">
          {uploadError}
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
