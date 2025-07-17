import { create } from 'zustand';

interface GPUConfig {
    memorySize: number;
    coreCount: number;
    shaderArrayCount: number;
    clockSpeed: number;
}

interface GPUComponent {
    id: string;
    type: 'shader-array' | 'memory-controller' | 'command-processor' | 'cache';
    name: string;
    properties: Record<string, any>;
    position?: { x: number; y: number };
    color: string;
}

interface GPUStore {
    config: GPUConfig;
    components: GPUComponent[];
    updateConfig: (config: Partial<GPUConfig>) => void;
    generateArchitecture: () => void;
}

const useGPUStore = create<GPUStore>((set, get) => ({
    config: {
        memorySize: 16,
        coreCount: 4096,
        shaderArrayCount: 4,
        clockSpeed: 1500
    },
    components: [],
    updateConfig: (newConfig) => set((state) => ({
        config: { ...state.config, ...newConfig }
    })),
    generateArchitecture: () => {
        const { config } = get();
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
                color: '#4A90E2'
            });
        }
        
        // Generate Memory Controllers
        const memoryControllers = Math.ceil(config.memorySize / 8);
        for (let i = 0; i < memoryControllers; i++) {
            components.push({
                id: `mem-controller-${i}`,
                type: 'memory-controller',
                name: `Memory Controller ${i}`,
                properties: {
                    bandwidth: '256 GB/s'
                },
                color: '#50C878'
            });
        }
        
        // Add Command Processor
        components.push({
            id: 'command-processor',
            type: 'command-processor',
            name: 'Command Processor',
            properties: {},
            color: '#FF6B6B'
        });
        
        // Add L2 Cache
        components.push({
            id: 'l2-cache',
            type: 'cache',
            name: 'L2 Cache',
            properties: {
                size: '4 MB'
            },
            color: '#FFA500'
        });
        
        set({ components });
    }
}));

export default useGPUStore;