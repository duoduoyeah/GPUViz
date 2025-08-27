import type { message } from "./message.type";

export interface TrafficAnalyzer {
  // Compute preparation time (QueueWaitTime)
  getQueueWaitTime(msg: message): number;

  // Compute network time (NetworkTime)
  getNetworkTime(msg: message): number;

  // Compute processing time (ProcessingTime)
  getProcessingTime(msg: message): number;

  // Compute end-to-end time (EndToEndTime)
  getEndToEndTime(msg: message): number;

  // Compute producer efficiency ratio
  getProducerEfficiency(msg: message): number;

  // Compute consumer efficiency ratio
  getConsumerEfficiency(msg: message): number;

  // Compute message rate for a set of messages in a time period
  getMessageRate(messages: message[], timePeriod: number): number;
}