import styled from 'styled-components';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';

const { Header: AntHeader } = Layout;

export const StyledHeader = styled(AntHeader)`
  background-color: ${({ theme }) => theme.colors.surface} !important;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0 ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px ${({ theme }) => theme.colors.shadow};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`;

export const Logo = styled(Link)`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary} !important;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &:hover {
    color: ${({ theme }) => theme.colors.primaryHover} !important;
  }
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

export const NavLink = styled(Link)`
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  transition: color ${({ theme }) => theme.transition.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`;