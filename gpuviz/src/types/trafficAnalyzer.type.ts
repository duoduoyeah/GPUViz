import type { Message } from "./message.type";

export interface TrafficAnalyzer {
  // Compute preparation time (QueueWaitTime)
  getQueueWaitTime(msg: Message): number;

  // Compute network time (NetworkTime)
  getNetworkTime(msg: Message): number;

  // Compute processing time (ProcessingTime)
  getProcessingTime(msg: Message): number;

  // Compute end-to-end time (EndToEndTime)
  getEndToEndTime(msg: Message): number;

  // Compute producer efficiency ratio
  getProducerEfficiency(msg: Message): number;

  // Compute consumer efficiency ratio
  getConsumerEfficiency(msg: Message): number;

  // Compute Message rate for a set of Messages in a time period
  getMessageRate(Messages: Message[], timePeriod: number): number;
}