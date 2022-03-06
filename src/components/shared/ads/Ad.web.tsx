import { useEffect, useRef } from 'react';
import './Ad.css';

const Ad = () => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6949812709353975';
    script.async = true;
    script.crossOrigin = 'anonymous';
    const div = divRef.current;
    div?.appendChild(script);

    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.log(e);
    }

    return () => {
      div?.removeChild(script);
    };
  }, []);

  return (
    <>
      <div ref={divRef}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-format="fluid"
          data-ad-layout-key="-h6-1+16-3y+52"
          data-ad-client="ca-pub-6949812709353975"
          data-ad-slot="5143106383"
        ></ins>
      </div>
    </>
  );
};

export default Ad;
