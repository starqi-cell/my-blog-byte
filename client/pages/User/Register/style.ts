import styled from 'styled-components';
import { Card, Button } from 'antd';


export const RegisterContainer = styled.div`
  min-height: calc(100vh - 200px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
`;

export const RegisterCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 12px ${({ theme }) => theme.colors.shadow};
`;

export const Title = styled.h2`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text};
`;

export const RegisterButton = styled(Button)`
  width: 100%;
`;

export const LoginLink = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textSecondary};
`;