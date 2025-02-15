import React, { useState } from 'react';

// Props del componente, que incluye el id de la variación a eliminar y una función para cerrar el modal.
interface DeleteVariationModalProps {
  variationId: string;
  onClose: () => void;
  onDelete: (id: string) => void;  // Función para eliminar la variación
}

const DeleteVariationModal: React.FC<DeleteVariationModalProps> = ({ variationId, onClose, onDelete }) => {
  const [isOpen, setIsOpen] = useState(true); // Para manejar la visibilidad del modal

  const handleDelete = () => {
    onDelete(variationId); // Llamar a la función para eliminar la variación
    setIsOpen(false); // Cerrar el modal
  };

  const handleClose = () => {
    setIsOpen(false); // Cerrar el modal
    onClose(); // Llamar a la función onClose para manejar el estado del modal
  };

  if (!isOpen) return null; // Si el modal está cerrado, no renderizar nada

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Eliminar variación</h2>
        <p>¿Estás seguro de que deseas eliminar esta variación?</p>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            onClick={handleClose}
          >
            Cancelar
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            onClick={handleDelete}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteVariationModal;
