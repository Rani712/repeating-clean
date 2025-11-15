import React, { useEffect, useRef, useState } from 'react';
import RepeatingTransition from './RepeatingTransition.jsx';

const IMAGES = [
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=1600&q=80&auto=format&fit=crop'
];

export default function App(){
  return (
    <div className="app p-8">
      <RepeatingTransition images={IMAGES} />
    </div>
  );
}
