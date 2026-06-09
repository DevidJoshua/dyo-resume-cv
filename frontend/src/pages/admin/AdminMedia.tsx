import { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { MediaFile } from '../../types';
import { toast } from 'react-toastify';
import { FiUpload, FiTrash2, FiSearch, FiCopy, FiCheck } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminMedia = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => { loadFiles(); }, []);

  const loadFiles = async (q?: string) => {
    try {
      const params = q ? { search: q } : {};
      const res = await api.get('/media', { params });
      setFiles(res.data);
    } catch { toast.error('Failed to load media'); }
    finally { setLoading(false); }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('altText', file.name);
    try {
      await api.post('/media/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('File uploaded');
      loadFiles();
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this file?')) return;
    try { await api.delete(`/media/${id}`); toast.success('File deleted'); loadFiles(); }
    catch { toast.error('Delete failed'); }
  };

  const copyUrl = (file: MediaFile) => {
    navigator.clipboard.writeText(file.filePath);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    const timer = setTimeout(() => loadFiles(search || undefined), 300);
    return () => clearTimeout(timer);
  }, [search]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-crud-page">
      <div className="admin-crud-header">
        <h1 className="admin-page-title">Media Library</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="media-search">
            <FiSearch />
            <input className="form-input" placeholder="Search files..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
          </div>
          <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            <FiUpload /> {uploading ? 'Uploading...' : 'Upload'}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
        </div>
      </div>
      {files.length === 0 ? (
        <div className="media-empty">
          <FiUpload size={48} />
          <p>No files yet. Upload your first image.</p>
        </div>
      ) : (
        <div className="media-grid">
          {files.map((file) => (
            <div key={file.id} className="media-card">
              <div className="media-preview">
                <img src={file.filePath} alt={file.altText || file.originalFilename} />
              </div>
              <div className="media-info">
                <div className="media-name" title={file.originalFilename}>{file.originalFilename}</div>
                <div className="media-meta">
                  <span>{(file.fileSize / 1024).toFixed(1)} KB</span>
                  <span>{file.mimeType}</span>
                </div>
                <div className="media-actions">
                  <button className="media-btn" onClick={() => copyUrl(file)}>
                    {copiedId === file.id ? <><FiCheck /> Copied</> : <><FiCopy /> Copy URL</>}
                  </button>
                  <button className="media-btn danger" onClick={() => handleDelete(file.id)}><FiTrash2 /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`
        .media-search { position: relative; }
        .media-search svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #8A8A8A; }
        .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
        .media-card { background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .media-preview { height: 150px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .media-preview img { width: 100%; height: 100%; object-fit: cover; }
        .media-info { padding: 12px; }
        .media-name { font-size: 12px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px; }
        .media-meta { display: flex; gap: 8px; font-size: 11px; color: #8A8A8A; margin-bottom: 8px; }
        .media-actions { display: flex; gap: 6px; }
        .media-btn {
          display: flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 6px;
          border: 1px solid #e5e7eb; background: #fff; font-size: 11px; cursor: pointer;
          transition: all 0.2s; color: #555;
        }
        .media-btn:hover { border-color: #7152E1; color: #7152E1; }
        .media-btn.danger:hover { border-color: #f44336; color: #f44336; }
        .media-empty { text-align: center; padding: 80px 20px; color: #8A8A8A; }
        .media-empty p { margin-top: 16px; }
        @media (max-width: 768px) {
          .admin-crud-header { flex-direction: column; align-items: stretch; }
          .admin-crud-header > div { flex-direction: column; }
          .media-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
        }
      `}</style>
    </div>
  );
};

export default AdminMedia;
