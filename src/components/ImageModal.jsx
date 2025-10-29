import { useEffect } from "react";


function ImageModal({ onClose, url, title }) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
            <div className="bg-white rounded-3xl shadow-sm p-8 flex flex-col items-center relative gap-5 max-w-[90%] max-h-[90%] overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-900 cursor-pointer"
                >
                    ✕
                </button>

                <div className="flex items-center justify-center flex-1 overflow-auto">
                    <img
                        src={url || "../../public/user.png"}
                        alt=""
                        className="object-contain max-w-full max-h-full"
                    />
                </div>

                <h2 className="font-bold text-center">{title?.toUpperCase() || "NO TITLE"}</h2>
            </div>


        </div>
    );
}

export default ImageModal;