import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

function StatusModal({ status, msg, isOpen, onClose, ask, action }) {
    const [enter, setEnter] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Enter") {
                console.log('test');
                setTimeout(() => {
                    onClose(true);
                }, 500)
                setEnter(true);
            }
            
            if (ask) {
                if (e.key === "Enter") {
                    setTimeout(() => {
                        onClose(true);
                    }, 500)
                    setEnter(true);
                }
                if (e.key === "Escape") {
                    setTimeout(() => {
                        onClose(false);
                    }, 500)
                    setEnter(false);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose, ask]);

    if (!isOpen) return null;

    const statusMsg = status ? 'Success' : 'Failed';
    const color = status ? 'bg-green-500' : 'bg-red-500';
    const hoverColor = status ? 'bg-green-800' : 'bg-red-800';


    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-3xl shadow-sm p-8 h-auto w-100 flex items-center justify-between flex-col relative gap-5">
                        <button
                            onClick={() => onClose(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-900 cursor-pointer"
                        >
                            ✕
                        </button>

                        {!ask && (
                            <div className={`${color} rounded-full w-16 h-16 flex items-center justify-center text-white text-xs font-bold`}>
                                <FontAwesomeIcon icon={faCheck} size='2x' />
                            </div>
                        )}

                        <h1 className="text-4xl font-bold tracking-widest">
                            {!ask ? statusMsg : `${action}?`}
                        </h1>

                        <h3 className="mb-5 text-lg text-gray-500 text-center">
                            {!ask ? msg : `Are you sure you want to ${action}?`}
                        </h3>

                        {!ask ? (
                            <button
                                onClick={() => onClose()}
                                className={`${!enter ? color : hoverColor} hover:${hoverColor} text-white rounded-lg px-5 py-2.5 w-full`}
                            >
                                Ok
                            </button>
                        ) : (
                            <div className="flex w-full gap-5">
                                <button
                                    onClick={() => onClose(true)}
                                    className="bg-blue-600 hover:bg-blue-800 text-white rounded-lg px-5 py-2.5 w-full cursor-pointer"
                                >
                                    Absolutely
                                </button>
                                <button
                                    onClick={() => onClose(false)}
                                    className="bg-red-600 hover:bg-red-800 text-white rounded-lg px-5 py-2.5 w-full cursor-pointer"
                                >
                                    Maybe, No
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default StatusModal;
