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

  // 监听图片是否进入视口
  const imgRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 当组件挂载时，开始观察是否进入视口，使用 Intersection Observer 监听图片进入视口
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
      // 50px 的预加载距离
      {
        rootMargin: '50px', 
        threshold: 0.01,
      }
    );
    // 开始观察图片容器是否进入视口
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
