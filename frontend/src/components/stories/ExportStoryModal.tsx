import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  exportStoryToPDF,
  exportStoryToEPUB,
  fetchImageAsBlob,
  blobToBase64,
  IExportStory,
  IExportOptions
} from '../../services/export.service';

interface ExportStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: IExportStory;
}

const ExportStoryModal: React.FC<ExportStoryModalProps> = ({ isOpen, onClose, story }) => {
  const [format, setFormat] = useState<'pdf' | 'epub'>('pdf');
  const [fontSize, setFontSize] = useState<IExportOptions['fontSize']>('medium');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const options: IExportOptions = { fontSize };
      
      let imageBlob: Blob | null = null;
      let base64Image: string | null = null;
      
      if (story.imageURL) {
        try {
          imageBlob = await fetchImageAsBlob(story.imageURL);
          if (format === 'pdf' && imageBlob) {
            base64Image = await blobToBase64(imageBlob);
          }
        } catch (error) {
          console.error("Failed to fetch image for export", error);
          toast.error("Failed to include cover image, but exporting anyway...");
        }
      }

      if (format === 'pdf') {
        await exportStoryToPDF(story, base64Image, options);
      } else {
        await exportStoryToEPUB(story, imageBlob, options);
      }

      toast.success(`${format.toUpperCase()} exported successfully!`);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(`Failed to export ${format.toUpperCase()}.`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up">
        <h2 className="text-2xl font-bold text-slate-100 mb-6">Export Story</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-slate-300 mb-2 font-medium">Format</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="pdf"
                  checked={format === 'pdf'}
                  onChange={() => setFormat('pdf')}
                  className="form-radio text-indigo-500 bg-slate-700 border-slate-600"
                />
                <span className="text-slate-200">PDF</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="epub"
                  checked={format === 'epub'}
                  onChange={() => setFormat('epub')}
                  className="form-radio text-indigo-500 bg-slate-700 border-slate-600"
                />
                <span className="text-slate-200">EPUB</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-2 font-medium">Font Size</label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value as any)}
              className="w-full bg-slate-700 text-slate-200 border border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportStoryModal;
