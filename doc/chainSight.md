


---

## What is Chain
The core is CU, and around CU, has several Chains.
Each chain has its own name.
Chain has several edges, and each edge has many message information.

## Simplify Implementation
Only tackle one chain this week.
No not tackle combine chain this week


## Backend server

## Interface
New interface:

Chain: a list of component start from CU
Topo: a list of chain that related to the same CU or the same combination of CUs.

Same type Chain: same-type components of two chains.
Sum of same-type chain: combined chain. (Sum in one SA, sum in one GPU)

ChainLink -> one edge of a chain, but this will be a combined concept.

## Frontend

### Single
Single CU Topo
Single Chain

### Combined
Combined on SA level, combined on GPU level

combined CU Topo
combined Chain

### Left Panel
option 1: scroll down?
gpu level (more than 1) 
SA level (more than 1)
single (more than 1)

option 2:
chain (more than 1) -> we start from only one chain
topology

option 3:
metrics 

option 4:
workload amount 

### How to combine Chain to Combined Chain

1. Combined to SA level chain


2. Combined to GPU level chain


## Right Display

## What data will be displayed
Message has several time stamp, EnqueueTime, TransmitTime, ReceiveTime, and DequeueTime.

### Send and Receive
send number and receive number of each component.

---

### 1. Network vs Processing Breakdown

- Preparation time (producer delay):
$$
\text{QueueWaitTime} = \text{TransmitTime} - \text{EnqueueTime}
$$

- Network time (transmission delay):
$$
\text{NetworkTime} = \text{ReceiveTime} - \text{TransmitTime}
$$
- Processing time (consumer delay):
$$
\text{ProcessingTime} = \text{DequeueTime} - \text{ReceiveTime}
$$

### 2. End-to-End Time / Total Latency
Total time from enqueue to dequeue:
$$
\text{EndToEndTime} = \text{DequeueTime} - \text{EnqueueTime}
$$

### 3. Queue Efficiency Ratio

There are two kinds of efficiency ratios:

- **Producer Party Efficiency**: Fraction of total time spent in the queue (QB time).
	$$
		ext{ProducerEfficiency} = \frac{\text{QueueWaitTime}}{\text{EndToEndTime}}
	$$

- **Consumer Party Efficiency**: Fraction of total time spent in processing.
	$$
		ext{ConsumerEfficiency} = \frac{\text{ProcessingTime}}{\text{EndToEndTime}}
	$$

### 7. Throughput & Rate Analysis (conceptual)
- Message Rate:
$$
\text{MessageRate} = \frac{\text{Number of messages dequeue}}{\text{Time period}}
$$
