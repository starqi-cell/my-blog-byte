// client/components/LazyImage/style.ts
// 懒加载图片组件样式文件

import styled from 'styled-components';

export const ImageWrapper = styled.div<{ $aspectRatio?: number }>`
  position: relative;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.divider};
  ${({ $aspectRatio }) => $aspectRatio && `padding-bottom: ${100 / $aspectRatio}%;`}
`;

interface StyledImageProps {
  $loaded: boolean;
  $aspectRatio?: number;
}

export const StyledImage = styled.img<StyledImageProps>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  ${(props) => props.$aspectRatio && 'position: absolute; top: 0; left: 0;'}
  opacity: ${(props) => (props.$loaded ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
`;

export const Placeholder = styled.div`
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