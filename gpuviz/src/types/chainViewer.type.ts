// The names of this file and interface is not determined.
import type { Chain, TrafficAnalyzer, ChainAnalyzer } from "./index";

export interface ChainViewer {
   
    chainLevel: string[];
    chainIndex: string[];
    LevelIndexMap: Record<string, string[]>;


    // trafficAnalyzer: TrafficAnalyzer;
    // chainAnalyzer: ChainAnalyzer;

    // currentChain: Chain;
    // currentChainLevel: string;
    // currentChainIndex: string;
}