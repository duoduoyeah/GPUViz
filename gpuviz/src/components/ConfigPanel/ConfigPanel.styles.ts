// src/components/ConfigPanel/ConfigPanel.styles.ts
import styled from 'styled-components';

export const ConfigPanelContainer = styled.div`
  width: 300px;
  padding: 20px;
  background-color: #f5f5f5;
  border-right: 1px solid #ddd;
  height: 100vh;
  overflow-y: auto;
`;

export const Title = styled.h2`
  margin-bottom: 20px;
  color: #333;
`;

export const ConfigSection = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
`;

export const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Slider = styled.input`
  flex: 1;
  height: 5px;
  background: #ddd;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    appearance: none;
    width: 15px;
    height: 15px;
    background: #4A90E2;
    cursor: pointer;
    border-radius: 50%;
  }

  &::-moz-range-thumb {
    width: 15px;
    height: 15px;
    background: #4A90E2;
    cursor: pointer;
    border-radius: 50%;
    border: none;
  }
`;

export const ValueDisplay = styled.span`
  min-width: 60px;
  text-align: right;
  font-weight: 600;
  color: #4A90E2;
`;

export const GenerateButton = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  background-color: #4A90E2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #357ABD;
  }

  &:active {
    background-color: #2968A3;
  }
`;