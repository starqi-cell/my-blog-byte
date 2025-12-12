// client/components/LazyImage/index.tsx
// 懒加载图片组件

import React, { useState, useEffect, useRef } from 'react';

import { ImageWrapper, StyledImage, Placeholder } from './style';

interface LazyImageProps {
  src: string;
  alt: string;
  aspectRatio?: number; 
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  aspectRatio,
  className,
  onLoad,
  onError,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !wrapperRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', 
        threshold: 0.01,
      }
    );

    observer.observe(wrapperRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    onError?.();
  };

  return (
    <ImageWrapper ref={wrapperRef} $aspectRatio={aspectRatio} className={className}>
      {!loaded && <Placeholder />}
      {inView && (
        <StyledImage
          ref={imgRef}
          src={src}
          alt={alt}
          $loaded={loaded}
          $aspectRatio={aspectRatio}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy" 
        />
      )}
    </ImageWrapper>
  );
};

export default LazyImage;
