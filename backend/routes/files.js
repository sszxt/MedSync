import express from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import File from '../models/File.js'; // Note the .js extensionAssuming you have a File model

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });
// File upload endpoint
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Pinata
    const pinataMetadata = JSON.stringify({ name: req.file.originalname });
    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path));
    formData.append('pinataMetadata', pinataMetadata);

    const pinataRes = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      headers: {
        'Authorization': `Bearer ${process.env.PINATA_JWT}`,
        ...formData.getHeaders()
      }
    });

    // Save to database
    const newFile = await File.create({
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype,
      ipfs_pin_hash: pinataRes.data.IpfsHash, // <-- Save the CID here!
      url: `https://gateway.pinata.cloud/ipfs/${pinataRes.data.IpfsHash}`,
      user: req.user.id,
    });

    // Clean up the temporary file
    fs.unlinkSync(req.file.path);

    res.status(201).json(newFile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'File upload failed' });
  }
});

// File delete endpoint
router.delete('/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Verify ownership
    if (file.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete from Pinata (optional)
    try {
      await axios.delete(`https://api.pinata.cloud/pinning/unpin/${file.ipfs_pin_hash}`, {
  headers: {
    'Authorization': `Bearer ${process.env.PINATA_JWT}`
  }
});
    } catch (pinataError) {
      console.error('Error unpinning from Pinata:', pinataError);
      // Continue with deletion even if Pinata unpin fails
    }

    // Delete from database
    await File.findByIdAndDelete(req.params.id);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'File deletion failed' });
  }
});


export default router;
