// src/components/Layout/AppLayout.tsx
import React from 'react';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const LeftPanel = styled.div`
  flex-shrink: 0;
`;

const RightPanel = styled.div`
  flex: 1;
  position: relative;
`;

interface AppLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ leftPanel, rightPanel }) => {
  return (
    <LayoutContainer>
      <LeftPanel>{leftPanel}</LeftPanel>
      <RightPanel>{rightPanel}</RightPanel>
    </LayoutContainer>
  );
};