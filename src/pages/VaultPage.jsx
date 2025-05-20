import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import PatientSidebar from "../components/PatientSidebar";
import axios from "axios";

const VaultPage = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadFiles = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:5000/api/files", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Files response data:", res.data);
      // Ensure files is always an array
      const filesArray = Array.isArray(res.data)
        ? res.data
        : res.data.data && Array.isArray(res.data.data)
        ? res.data.data
        : [];
      setFiles(filesArray);
    } catch (err) {
      setError("Failed to load files");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post("http://localhost:5000/api/files", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Append newly uploaded file at the top
      setFiles((prevFiles) => [res.data, ...prevFiles]);
      setSelectedFile(null);
    } catch (err) {
      setError("Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (fileId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this file?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/files/${fileId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFiles((prevFiles) => prevFiles.filter((file) => file._id !== fileId));
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete file: " + (err.response?.data?.message || err.message));
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <PatientSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="hidden md:block">
        <PatientSidebar />
      </div>
      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 font-sans ml-0 md:ml-64">
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Upload New Document</h2>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={(e) => setSelectedFile(e.target.files?.[0])}
              accept="*"
            />
            <label
              htmlFor="file-upload"
              className="flex-1 cursor-pointer border-2 border-dashed border-gray-400 px-4 py-2 rounded w-full text-center"
            >
              {selectedFile ? selectedFile.name : "Choose a file..."}
            </label>
            <button
              onClick={handleFileUpload}
              disabled={!selectedFile || isUploading}
              className={`px-4 py-2 rounded text-white ${
                isUploading || !selectedFile
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isUploading ? "Uploading..." : "Upload to Vault"}
            </button>
          </div>
          {error && <p className="text-red-600 mt-3">{error}</p>}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Your Documents</h2>
          {files.length === 0 ? (
            <p className="text-gray-500">No documents uploaded yet.</p>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {files.map((file) => (
                <div
                  key={file._id}
                  className="border rounded-lg p-4 shadow hover:shadow-md transition"
                >
                  <div className="text-4xl mb-2">
                    {file.name && file.name.includes(".pdf")
                      ? "📕"
                      : file.name && file.name.match(/\.(jpg|jpeg|png|gif)$/i)
                      ? "🖼️"
                      : "📄"}
                  </div>
                  <h3 className="font-medium">{file.name || "Unnamed file"}</h3>
                  <p className="text-sm text-gray-600">
                    {file.ipfsHash
                      ? `CID: ${file.ipfsHash.slice(0, 6)}...${file.ipfsHash.slice(-4)}`
                      : "Processing..."}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    Uploaded: {new Date(file.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <a
                      href={file.url || `https://gateway.pinata.cloud/ipfs/${file.ipfsHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Open
                    </a>
                    <button
                      onClick={() => deleteFile(file._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VaultPage;