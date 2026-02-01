
import React from 'react';
import { GalleryImage } from '../types';

const Gallery: React.FC<{ images: GalleryImage[] }> = ({ images }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fadeIn">
      <h2 className="text-4xl font-bold text-center mb-12 text-slate-800">গ্যালারি</h2>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {images.map((img) => (
          <div key={img.id} className="relative overflow-hidden rounded-2xl group cursor-pointer break-inside-avoid shadow-lg">
            <img src={img.url} alt={img.caption} className="w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <p className="text-white font-bold">{img.caption}</p>
            </div>
          </div>
        ))}
      </div>
      {images.length === 0 && <p className="text-center text-slate-400 py-20 italic">বর্তমানে কোনো ছবি নেই</p>}
    </div>
  );
};

export default Gallery;
