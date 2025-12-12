import styled from 'styled-components';
import { Card, Tag } from 'antd';

export const TagCloudCard = styled(Card)`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export const CloudContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
`;

export const StyledTag = styled(Tag)<{ $size: number, $isSelected: boolean }>`
  cursor: pointer;
  font-size: ${({ $size }) => `${Math.max(12, Math.min(24, $size))}px`};
  padding: ${({ $size }) => `${Math.max(4, Math.min(12, $size / 2))}px ${Math.max(8, Math.min(20, $size))}px`};
  margin: ${({ theme }) => theme.spacing.xs};
  transition: all ${({ theme }) => theme.transition.normal};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  opacity: ${({ $isSelected }) => ($isSelected ? 0.5 : 1)};
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 8px ${({ theme }) => theme.colors.shadow};
  }
`;
