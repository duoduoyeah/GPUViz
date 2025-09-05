// The names of this file and interface is not determined.
import type { Chain, TrafficAnalyzer, ChainAnalyzer } from "./index";

export interface ChainView {
   
    chainLevel: string[];
    chainIndex: string[];

    trafficAnalyzer: TrafficAnalyzer;
    chainAnalyzer: ChainAnalyzer;

    currentChain: Chain;
    currentChainLevel: string;
    currentChainIndex: string;
}