import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const ImageWrapper = styled.div<{ $aspectRatio?: number }>`
  position: relative;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.divider};
  ${({ $aspectRatio }) => $aspectRatio && `padding-bottom: ${100 / $aspectRatio}%;`}
`;

interface StyledImageProps {
  $loaded: boolean;
  $aspectRatio?: number;
}

const StyledImage = styled.img<StyledImageProps>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  ${(props) => props.$aspectRatio && 'position: absolute; top: 0; left: 0;'}
  opacity: ${(props) => (props.$loaded ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
`;

const Placeholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

interface LazyImageProps {
  src: string;
  alt: string;
  aspectRatio?: number; // 宽高比，例如 16/9
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
