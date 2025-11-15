import React, { useEffect, useRef, useState } from 'react';

export default function RepeatingTransition({ images = [], strips = 8 }) {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const dirRef = useRef(1);
  const timeoutRef = useRef(null);
  const progressRef = useRef(0);

  useEffect(() => {
    // simulate loader with preloading images
    let loaded = 0;
    images.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loaded++;
        progressRef.current = Math.round((loaded / images.length) * 100);
        // minor delay to animate bar
        if (loaded === images.length) {
          setTimeout(()=> setIsLoaded(true), 500);
        }
      };
      img.onerror = () => {
        loaded++;
        if (loaded === images.length) setTimeout(()=> setIsLoaded(true), 500);
      }
    });
    return () => {};
  }, [images]);

  useEffect(() => {
    if (!isLoaded) return;
    startAuto();
    return stopAuto;
  }, [isLoaded, index]);

  function startAuto(){
    stopAuto();
    timeoutRef.current = setInterval(()=> {
      goNext();
    }, 4200);
  }
  function stopAuto(){
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  function goNext(){
    if (isAnimating) return;
    setIsAnimating(true);
    dirRef.current = 1;
    setTimeout(()=> {
      setIndex(i => {
        const next = (i+1) % images.length;
        if (next === 0) setShowEnd(true);
        return next;
      });
      setIsAnimating(false);
    }, 900);
  }
  function goPrev(){
    if (isAnimating) return;
    setIsAnimating(true);
    dirRef.current = -1;
    setTimeout(()=> {
      setIndex(i => (i-1+images.length)%images.length);
      setIsAnimating(false);
    }, 900);
  }
  function goTo(i){
    if (i===index || isAnimating) return;
    dirRef.current = i>index ? 1 : -1;
    setIsAnimating(true);
    setTimeout(()=> {
      setIndex(i);
      setIsAnimating(false);
    },900);
  }

  return (
    <div className="stage">
      {/* background previous image */}
      <div className="bg" style={{backgroundImage:`url(${images[(index-1+images.length)%images.length]})`, opacity: isAnimating ? 1 : 0.6}} />
      {/* main current image */}
      <div className="bg" style={{backgroundImage:`url(${images[index]})`, opacity: isAnimating ? 0 : 1}} />

      {/* strips */}
      <div className="strips" aria-hidden>
        {Array.from({length: strips}).map((_, s) => {
          const top = (s / strips) * 100;
          const height = 100 / strips;
          const delay = (s / strips) * 0.28;
          const animName = dirRef.current === 1 ? 'slideLTR' : 'slideRTL';
          const animation = isAnimating ? `${animName} 0.9s cubic-bezier(.22,.9,.34,1) ${delay}s both` : 'none';
          const bgY = 50 + Math.round((top/100)*20);
          return (
            <div key={s} className="strip" style={{top:`${top}%`, height:`${height}%`}}>
              <div className="inner" style={{backgroundImage:`url(${images[index]})`, backgroundPosition:`center ${bgY}%`, animation}} />
            </div>
          )
        })}
      </div>

      {/* loader */}
      {!isLoaded && (
        <div className="loader">
          <div style={{textAlign:'center'}}>
            <div style={{marginBottom:12}}>Loading</div>
            <div className="bar"><div className="progress" style={{width: `${progressRef.current}%`}} /></div>
          </div>
        </div>
      )}

      {/* controls */}
      <div className="controls">
        <button className="btn" onClick={() => { stopAuto(); goPrev(); startAuto(); }}>Prev</button>
        <button className="btn" onClick={() => { stopAuto(); goNext(); startAuto(); }}>Next</button>
      </div>

      {/* dots */}
      <div className="dots">
        {images.map((_,i)=>(
          <button key={i} className={`dot ${i===index?'active':''}`} onClick={()=>{ stopAuto(); goTo(i); startAuto(); }} aria-label={`Go to ${i+1}`} />
        ))}
      </div>

      {/* end screen */}
      {showEnd && (
        <div className="endscreen">
          <div>
            <h2 className="text-2xl font-semibold mb-2">End of slideshow</h2>
            <p className="mb-4">You've reached the end — thanks!</p>
            <div style={{display:'flex', gap:8, justifyContent:'center'}}>
              <button className="btn" onClick={()=>{ setShowEnd(false); setIndex(0); startAuto(); }}>Replay</button>
              <a className="btn" href="#" onClick={(e)=>e.preventDefault()}>Visit Demo</a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
