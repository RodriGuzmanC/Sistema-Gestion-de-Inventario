import AttibuteTypesService from "@/features/attributes/AttributeTypesService";
import React, { useState } from "react";

const UpdateAttributeForm: React.FC = () => {
    const [formData, setFormData] = useState({ id: "", name: "" });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const updatedAttribute = await AttibuteTypesService.update(Number(formData.id), {
                nombre: formData.name,
            });
            console.log(updatedAttribute)
            setSuccess(`Attribute updated successfully: ${updatedAttribute.nombre}`);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
        }
    };


    const createSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const updatedAttribute = await AttibuteTypesService.create({
                nombre: formData.name,
            });
            console.log(updatedAttribute)
            setSuccess(`Attribute created successfully: ${updatedAttribute.nombre}`);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
        }
    };

    const deleteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const updatedAttribute = await AttibuteTypesService.delete(Number(formData.id));
            console.log(updatedAttribute)
            setSuccess(`Attribute deleted successfully`);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
        }
    };

    return (
        <div>
            <form onSubmit={deleteSubmit} className="max-w-md mx-auto p-4 border rounded shadow">
                <h2 className="text-xl font-bold mb-4">Update Attribute</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                {success && <p className="text-green-500 mb-2">{success}</p>}

                <div className="mb-4">
                    <label htmlFor="id" className="block font-medium mb-1">ID:</label>
                    <input
                        type="text"
                        name="id"
                        id="id"
                        value={formData.id}
                        onChange={handleInputChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="name" className="block font-medium mb-1">Name:</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Update Attribute
                </button>
            </form>
            
        </div>
    );
};

export default UpdateAttributeForm;
