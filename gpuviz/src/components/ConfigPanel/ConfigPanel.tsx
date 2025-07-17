// src/components/ConfigPanel/ConfigPanel.tsx
import React, { useState, useCallback } from 'react';
import {
  ConfigPanelContainer,
  Title,
  ConfigSection,
  Label,
  SliderContainer,
  Slider,
  ValueDisplay,
  GenerateButton
} from './ConfigPanel.styles';

interface ConfigPanelProps {
  onConfigChange: (config: GPUConfig) => void;
  onGenerate: () => void;
}

interface GPUConfig {
  memorySize: number;
  coreCount: number;
  shaderArrayCount: number;
  clockSpeed: number;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ onConfigChange, onGenerate }) => {
  const [config, setConfig] = useState<GPUConfig>({
    memorySize: 16,
    coreCount: 4096,
    shaderArrayCount: 4,
    clockSpeed: 1500
  });

  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleConfigChange = useCallback((key: keyof GPUConfig, value: number) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);

    // Debounced update to parent
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    const timer = setTimeout(() => {
      onConfigChange(newConfig);
    }, 300);
    setDebounceTimer(timer);
  }, [config, debounceTimer, onConfigChange]);

  return (
    <ConfigPanelContainer>
      <Title>GPU Configuration</Title>
      
      <ConfigSection>
        <Label>Memory Size: {config.memorySize} GB</Label>
        <SliderContainer>
          <Slider
            type="range"
            min="4"
            max="64"
            step="4"
            value={config.memorySize}
            onChange={(e) => handleConfigChange('memorySize', Number(e.target.value))}
          />
          <ValueDisplay>{config.memorySize}GB</ValueDisplay>
        </SliderContainer>
      </ConfigSection>

      <ConfigSection>
        <Label>Core Count: {config.coreCount}</Label>
        <SliderContainer>
          <Slider
            type="range"
            min="1024"
            max="16384"
            step="1024"
            value={config.coreCount}
            onChange={(e) => handleConfigChange('coreCount', Number(e.target.value))}
          />
          <ValueDisplay>{config.coreCount}</ValueDisplay>
        </SliderContainer>
      </ConfigSection>

      <ConfigSection>
        <Label>Shader Arrays: {config.shaderArrayCount}</Label>
        <SliderContainer>
          <Slider
            type="range"
            min="2"
            max="8"
            step="1"
            value={config.shaderArrayCount}
            onChange={(e) => handleConfigChange('shaderArrayCount', Number(e.target.value))}
          />
          <ValueDisplay>{config.shaderArrayCount}</ValueDisplay>
        </SliderContainer>
      </ConfigSection>

      <ConfigSection>
        <Label>Clock Speed: {config.clockSpeed} MHz</Label>
        <SliderContainer>
          <Slider
            type="range"
            min="1000"
            max="2500"
            step="100"
            value={config.clockSpeed}
            onChange={(e) => handleConfigChange('clockSpeed', Number(e.target.value))}
          />
          <ValueDisplay>{config.clockSpeed}MHz</ValueDisplay>
        </SliderContainer>
      </ConfigSection>

      <GenerateButton onClick={onGenerate}>
        Generate GPU Architecture
      </GenerateButton>
    </ConfigPanelContainer>
  );
};