import React, { useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import api from '../services/api';

interface UploadResponse {
  format: string;
  full: string;
  public_id: string;
  thumb: string;
}

export default function ImageUploader({ category = 'general' }: { category?: string }) {
  const [previews, setPreviews] = useState<{ id: string, url: string, file: File }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<UploadResponse[]>([]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const newFiles = Array.from(e.target.files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file), // Native fast preview
      file
    }));
    setPreviews(prev => [...prev, ...newFiles].slice(0, 5)); // Max 5 limit
  };

  const uploadImages = async () => {
    if (previews.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    previews.forEach(p => formData.append('images', p.file));

    try {
      const authHeader = `Bearer ${localStorage.getItem('loca_token')}`;
      const res = await api.post(`/upload/images?category=${category}`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': authHeader
        }
      });
      setUploadedUrls(res.data.images);
      alert('Photos envoyées avec succès !');
    } catch (err) {
      alert('Erreur lors de l\'upload');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const removePreview = (id: string) => {
    setPreviews(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100">
      <h3 className="font-semibold mb-3">Ajouter des photos (Max 5)</h3>
      
      <div className="grid grid-cols-3 gap-3 mb-4">
        {previews.map((p, index) => (
          <div key={p.id} className="relative aspect-square rounded-lg overflow-hidden border">
            {index === 0 && <span className="absolute bottom-0 w-full bg-blue-900/80 text-white text-[10px] py-1 text-center font-bold z-10">COUVERTURE</span>}
            <img src={p.url} className="w-full h-full object-cover" alt="Preview" />
            <button onClick={() => removePreview(p.id)} className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full"><X size={14}/></button>
          </div>
        ))}
        
        {previews.length < 5 && (
          <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer transition-colors">
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleFiles} />
            <ImagePlus size={24} className="mb-1" />
            <span className="text-[10px] font-semibold">Ajouter</span>
          </label>
        )}
      </div>

      {previews.length > 0 && (
        <button 
          onClick={uploadImages} 
          disabled={uploading}
          className="w-full bg-blue-900 text-white p-3 rounded-lg font-bold disabled:opacity-50"
        >
          {uploading ? 'Envoi vers le Cloud...' : `Valider (${previews.length} photos)`}
        </button>
      )}

      {/* Debug: showing returned URLs from Cloudinary */}
      {uploadedUrls.length > 0 && (
        <div className="mt-4 p-3 bg-green-50 text-green-800 text-xs rounded break-all">
          Succès ! Thumbails générés.
        </div>
      )}
    </div>
  );
}
