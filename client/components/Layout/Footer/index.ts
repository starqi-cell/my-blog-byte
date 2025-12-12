import styled from 'styled-components';
import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

export const StyledFooter = styled(AntFooter)`
  background-color: ${({ theme }) => theme.colors.surface} !important;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.lg};

  a {
    color: ${({ theme }) => theme.colors.textSecondary};
    transition: color ${({ theme }) => theme.transition.fast};

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export const Copyright = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textTertiary};
`;

