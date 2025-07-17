import type { GPUConfig, GPUComponent } from '../models/gpu.types';

export function generateGPUArchitecture(config: GPUConfig): GPUComponent[] {
  const components: GPUComponent[] = [];
  
  // Generate Shader Arrays
  for (let i = 0; i < config.shaderArrayCount; i++) {
    components.push({
      id: `shader-array-${i}`,
      type: 'shader-array',
      name: `Shader Array ${i}`,
      properties: {
        coresPerArray: Math.floor(config.coreCount / config.shaderArrayCount)
      },
      color: '#4A90E2' // Blue
    });
  }
  
  // Generate Memory Controllers (1 per 8GB)
  const memoryControllerCount = Math.ceil(config.memorySize / 8);
  for (let i = 0; i < memoryControllerCount; i++) {
    components.push({
      id: `mem-controller-${i}`,
      type: 'memory-controller',
      name: `Memory Controller ${i}`,
      properties: {
        bandwidth: '256 GB/s',
        memoryPerController: Math.floor(config.memorySize / memoryControllerCount)
      },
      color: '#50C878' // Green
    });
  }
  
  // Add Command Processor
  components.push({
    id: 'command-processor',
    type: 'command-processor',
    name: 'Command Processor',
    properties: {
      clockSpeed: config.clockSpeed
    },
    color: '#FF6B6B' // Red
  });
  
  // Add L2 Cache
  components.push({
    id: 'l2-cache',
    type: 'cache',
    name: 'L2 Cache',
    properties: {
      size: '4 MB'
    },
    color: '#FFA500' // Orange
  });
  
  return components;
}