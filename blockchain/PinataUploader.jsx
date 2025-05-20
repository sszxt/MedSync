import { useState, useRef, useEffect } from 'react';

const PinataUploader = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const PINATA_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkNjExZmZlNy04Y2M0LTRkMmItYWE2ZC0zYmZkZTk2YTM3NjQiLCJlbWFpbCI6ImFha2lmc2F0dGFyMDRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjYxYjYzYjQ0ZDFlZDM1YTNlNTQ2Iiwic2NvcGVkS2V5U2VjcmV0IjoiN2M5N2U4NGEwYjUzMmVlMzdkMTBjMTQxMzE3OTlhZDgxNGFiN2E1MDZiMDM4ODM4ZTdjZjMxZGUyMWNkYWU4YSIsImV4cCI6MTc3NTI4MTU3NH0.O5ruuXOwm2yazhl7shk8gX4PiG3hzOsZUjjcv1GxrF0'; // Replace with your actual JWT

  // Load history from localStorage
  useEffect(() => {
    const savedFiles = JSON.parse(localStorage.getItem('pinataUploads')) || [];
    setUploadedFiles(savedFiles);
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('pinataUploads', JSON.stringify(uploadedFiles));
  }, [uploadedFiles]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const uploadToPinata = async () => {
    if (!file) {
      setError('Please select a file!');
      return;
    }

    setIsLoading(true);
    setStatus('Uploading...');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('pinataMetadata', JSON.stringify({ name: file.name }));

    try {
      const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: { Authorization: `Bearer ${PINATA_JWT}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      const pinataUrl = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;

      // Save file info to history (no fetching!)
      setUploadedFiles(prev => [
        ...prev,
        { name: file.name, url: pinataUrl, timestamp: new Date().toISOString() }
      ]);

      setStatus('Uploaded!');
      setFile(null);
      fileInputRef.current.value = ''; // Reset input
    } catch (err) {
      setError(err.message);
      setStatus('Upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFile = (index) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
  };

  return (
    <div style={styles.container}>
      <h2>Upload Files to Pinata</h2>
      
      <div style={styles.uploadSection}>
        <input
  type="file"
  id="file-upload"
  className="hidden"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("File selected:", file);
      setSelectedFile(file);
      setError('');
    }
  }}
  accept="*"
/>
<label
  htmlFor="file-upload"
  className="flex-1 cursor-pointer border-2 border-dashed border-gray-400 px-4 py-2 rounded w-full text-center"
>
  {selectedFile ? selectedFile.name : 'Choose a file...'}
</label>

        <button
          onClick={uploadToPinata}
          disabled={!file || isLoading}
          style={styles.uploadButton}
        >
          {isLoading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      {status && <p style={status.includes('failed') ? styles.error : styles.status}>
        {status}
      </p>}

      <div style={styles.fileList}>
        <h3>Uploaded Files</h3>
        {uploadedFiles.length === 0 ? (
          <p>No files uploaded yet.</p>
        ) : (
          <ul style={styles.list}>
            {uploadedFiles.map((file, index) => (
              <li key={index} style={styles.listItem}>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.fileLink}
                >
                  {file.name}
                </a>
                <button 
                  onClick={() => deleteFile(index)} 
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// Inline styles (replace with CSS if preferred)
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  uploadSection: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  fileInput: {
    flex: 1,
    padding: '8px'
  },
  uploadButton: {
    padding: '8px 16px',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  status: {
    color: 'green',
    margin: '10px 0'
  },
  error: {
    color: 'red',
    margin: '10px 0'
  },
  fileList: {
    marginTop: '20px'
  },
  list: {
    listStyle: 'none',
    padding: 0
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px',
    borderBottom: '1px solid #ddd'
  },
  fileLink: {
    color: '#007bff',
    textDecoration: 'none'
  },
  deleteButton: {
    background: '#ff4444',
    color: 'white',
    border: 'none',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default PinataUploader;