import { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

function ImageUploader({ onImageChange, currentImg }) {
    const [preview, setPreview] = useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const previewUrl = URL.createObjectURL(file);
            
            setPreview(previewUrl);

            onImageChange({
                file,
                preview: previewUrl,
                change: true
            });
        }
    }, [onImageChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: "image/*",
        multiple: false,
    });

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    useEffect(() => {
        if (currentImg) {
            setPreview(currentImg);
        } else {
            setPreview(null)
        }
    }, [currentImg])

    return (
        <div
            {...getRootProps()}
            className="relative w-[300px] h-[300px] rounded-lg">
            <input

                {...getInputProps()}
                type="file"
                accept="image/*"
                id="img-input"
                className="hidden"
            />

            <div
                // htmlFor="img-input"
                className={`absolute inset-0 flex justify-center items-center rounded-xs cursor-pointer overflow-hidden ${isDragActive ? "bg-green-100 border-2 border-dashed" : "bg-[#e0e0e0]"}`}
            >
                {preview ? (
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-contain rounded-lg"
                    />
                ) : (
                    <span className="text-center">
                        {isDragActive ? "Drop it like it's hot" : "Drag and drop your image's here"}
                    </span>
                )}
            </div>
        </div>


    );
}

export default ImageUploader;
