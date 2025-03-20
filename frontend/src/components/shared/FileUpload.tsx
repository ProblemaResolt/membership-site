import React, { useState } from 'react';

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  accept?: string;
}

export const FileUpload = ({ onUploadComplete, accept = 'image/*' }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        const { url } = await response.json();
        onUploadComplete(url);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('File upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        onChange={handleUpload}
        accept={accept}
        disabled={uploading}
      />
      {uploading && <span>アップロード中...</span>}
    </div>
  );
};
