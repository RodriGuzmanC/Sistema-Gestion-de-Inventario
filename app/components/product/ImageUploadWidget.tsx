import { apiRequest } from '@/utils/utils';
import React, { useState, ChangeEvent } from 'react';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageUploaded: (url: string) => void;
  mode?: 'subir' | 'reemplazar'; // Modo por defecto es "subir"
  currentImageUrl?: string; // Para mostrar la imagen actual si se reemplaza
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  onImageUploaded,
  mode = 'subir',
  currentImageUrl,
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImage(file);
    }
  };

  const handleImageUpload = async (): Promise<void> => {
    if (!image) return;
    setUploading(true);
    setUploadError(null);
  
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || '');
    formData.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '');
  
    try {
      // 1. Subir la nueva imagen
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error('Error desconocido: ' + result.error.message);
      }
  
      const uploadedImageUrl = result.secure_url;
      console.log('Imagen nueva subida:', uploadedImageUrl);
  
      // 2. En modo "reemplazar", eliminar la imagen anterior
      if (mode === 'reemplazar' && currentImageUrl) {
        // Intentamos extraer el public_id desde la URL antigua
        const urlParts = currentImageUrl.split('/');
        const fileNameWithExt = urlParts[urlParts.length - 1];
        const publicId = fileNameWithExt.split('.')[0];

        console.log('Public ID de la imagen a eliminar:', publicId);

        const res = await apiRequest({
          url: 'products/image',
          method: 'POST',
          body: { public_id: publicId },
        })

        //const result = await res.json();

        console.log('Imagen eliminada:', res);

      }
  
      // 3. Notificar al padre y cerrar modal
      onImageUploaded(uploadedImageUrl);
      onClose();
  
    } catch (error) {
      setUploadError('Error al subir o eliminar la imagen');
      console.error('Error al subir o eliminar la imagen:', error);
    } finally {
      setUploading(false);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="modal-content bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">
          {mode === 'reemplazar' ? 'Reemplazar imagen' : 'Subir nueva imagen'}
        </h2>

        {mode === 'reemplazar' && currentImageUrl && (
          <div className="mb-4">
            <img src={currentImageUrl} alt="Imagen actual" className="w-full h-40 object-cover rounded" />
          </div>
        )}

        <input type="file" accept="image/*" onChange={handleImageChange} className="mb-2" />
        {image && <p className="text-sm text-gray-700">{image.name}</p>}

        {uploading ? (
          <p className="text-sm text-blue-500">Subiendo...</p>
        ) : (
          <div className="flex justify-between mt-4">
            <button type="button" onClick={handleImageUpload} className="bg-blue-500 text-white px-4 py-2 rounded">
              Subir Imagen
            </button>
            <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
              Cancelar
            </button>
          </div>
        )}

        {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
      </div>
    </div>
  );
};

export default ImageUploadModal;
