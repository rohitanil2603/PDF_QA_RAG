import { useRef } from "react";

interface Props {
    onFileSelect: (file: File) => void;
}

export default function FileUpload({ onFileSelect }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <>
            <button
                className="upload-btn"
                onClick={() => inputRef.current?.click()}
            >
                Upload PDF
            </button>

            <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                        onFileSelect(file);
                    }
                }}
            />
        </>
    );
}