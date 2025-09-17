import type { ChainViewer } from "../../types";

export class ChainViewerImpl implements ChainViewer {
    chainLevel: string[];
    chainIndex: string[];

    trafficAnalyzer: TrafficAnalyzer;
    chainAnalyzer: ChainAnalyzer;

    currentChain: Chain;
    currentChainLevel: string;
    currentChainIndex: string;

    constructor() {
        
    }
}