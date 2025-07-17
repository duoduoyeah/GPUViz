// src/components/GraphCanvas/GraphCanvas.styles.ts
import styled from 'styled-components';

export const CanvasContainer = styled.div`
  flex: 1;
  height: 100vh;
  position: relative;
  background-color: #fafafa;
`;

export const CytoscapeContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 18px;
  color: #666;
`;