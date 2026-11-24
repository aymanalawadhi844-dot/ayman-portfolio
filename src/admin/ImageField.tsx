import { useRef, useState } from 'react';
import { Upload, Link2, Loader2, X } from 'lucide-react';
import { uploadImage } from '@/lib/adminDb';
import { inputCls } from './ui';

interface Props {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export default function ImageField({ value, onChange, folder = 'site', label }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch {
      setError('فشل رفع الصورة، تأكد من تفعيل Storage في Firebase.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && <span className="block text-xs font-semibold text-ink-300">{label}</span>}
      <div className="flex items-center gap-3">
        {value && (
          <img src={value} alt="" className="w-14 h-14 rounded-xl object-cover border border-white/10 bg-ink-950" />
        )}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-sky-300 bg-sky-500/10 border border-sky-500/25 rounded-xl hover:bg-sky-500/20 transition-all disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'جاري الرفع...' : 'رفع صورة'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = '';
          }}
        />
      </div>
      <div className="relative">
        <Link2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-600" />
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="أو الصق رابط الصورة مباشرة"
          className={`${inputCls} pr-10`}
          dir="ltr"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-600 hover:text-rose-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}
