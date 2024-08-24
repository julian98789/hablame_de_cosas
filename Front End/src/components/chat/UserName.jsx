// src/components/UserName.js
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';

const UserName = ({ username, setUsername, setIsUsernameSet }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <div className="bg-[rgba(54,68,72,255)] text-aura1  textarea-shadow border  border-neutral-200 rounded-lg w-full max-w-sm p-6 m-4">
                <label htmlFor="username" className="block text-white text-lg font-bold mb-2">
                    Nombre de usuario:
                </label>
                <input
                    type="text"
                    className={`bg-[rgba(54,68,72,255)] border border-neutral-200 rounded-lg w-full py-2 px-3  focus:outline-none ${username.trim() === '' ? 'placeholder-gray-400' : 'text-white text-aura2 box-shadow2 '}`}
                    id="username"
                    autoComplete="off"
                    placeholder="Introduce tu nombre"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button
                    onClick={() => {
                        if (!username.trim()) {
                            toast.dismiss();
                            toast.error('El nombre de usuario no puede estar vacío.', {
                                style: {
                                    backgroundColor: 'black',
                                    color: 'white',
                                },
                            });
                            return;
                        }
                        localStorage.setItem('username', username);
                        setIsUsernameSet(true);
                    }}
                    className={`bg-[rgba(26,36,41,255)] font-bold py-2 px-4 rounded-full mt-2 text-white ${username.trim() === '' ? 'opacity-50 shadow-none ' : 'hover:bg-[#161e22] enviar2-shadow focus:shadow-outline'}`}
                    disabled={username.trim() === ''}
                >
                    Confirmar
                </button>
            </div>
        </div>
    );
};

export default UserName;
