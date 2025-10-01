// src/components/admin/Modal.tsx

import React from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-75 transition-opacity">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:block">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle">&#8203;</span>
        <div
          className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="text-xl font-bold leading-6 text-gray-900" id="modal-headline">
                {title}
              </h3>
              <button
                type="button"
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mt-4 max-h-[80vh] overflow-y-auto aap-content-wrapper">
                {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}