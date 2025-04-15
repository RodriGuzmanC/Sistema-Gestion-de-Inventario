import React, { useState, ChangeEvent } from 'react';

// Definición de tipos para las props
interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageUploaded: (url: string) => void;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ isOpen, onClose, onImageUploaded }) => {
  const [image, setImage] = useState<File | null>(null); // El tipo File se usa para representar archivos
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Función para manejar la selección de un archivo de imagen
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImage(file);
    }
  };

  // Función para subir la imagen a Cloudinary
  const handleImageUpload = async (): Promise<void> => {
    if (!image) {
      return;
    }
    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'preset_alondra_md'); // Reemplaza con tu propio upload_preset
    formData.append('api_key', 'sZsXwdczsIDmTCzt_moZIzrE1bA'); // Reemplaza con tu propia API key
    formData.append('cloud_name', 'daxgq3gzj'); // Reemplaza con tu propio cloud_name

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/daxgq3gzj/image/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        const uploadedImageUrl = result.secure_url;
        onImageUploaded(uploadedImageUrl); // Llamar a la función para manejar la URL de la imagen subida
        onClose(); // Cerrar la ventana modal
      } else {
        throw new Error('Error desconocido: ' + result.error.message)
      }
    } catch (error) {
      setUploadError('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null; // Si el modal no está abierto, no se renderiza nada

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Sube una imagen</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {image && <p>{image.name}</p>}
        {uploading ? (
          <p>Subiendo...</p>
        ) : (
          <div>
            <button onClick={handleImageUpload}>Subir Imagen</button>
            <button onClick={onClose}>Cancelar</button>
          </div>
        )}
        {uploadError && <p className="error">{uploadError}</p>}
      </div>
    </div>
  );
};

export default ImageUploadModal;
