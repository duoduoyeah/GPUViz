export {};

export interface GPUConfig {
    memorySize: number;      // in GB
    coreCount: number;       // total cores
    shaderArrayCount: number;
    clockSpeed: number;      // in MHz
}

export interface GPUComponent {
    id: string;
    type: 'shader-array' | 'memory-controller' | 'command-processor' | 'cache';
    name: string;
    properties: Record<string, any>;
    position?: { x: number; y: number };
    color: string;
}