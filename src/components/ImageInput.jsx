import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

function ImageInput() {
    const [preview, setPreview] = useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },   // ✅ format baru yang benar
        multiple: false,
    });

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    return (
        <div className="w-100 h-100">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer ${isDragActive ? "bg-green-100" : "bg-gray-50"
                    }`}>

                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Letakkan gambar di sini ...</p>
                ) : (
                    <p>Tarik & letakkan gambar di sini, atau klik untuk memilih</p>
                )}
            </div>

            {preview && (
                <img
                    src={preview}
                    alt="Preview"
                    className="w-64 h-64 object-contain rounded-xl mx-auto shadow-md"
                />
            )}
        </div>
    );
}

export default ImageInput;
