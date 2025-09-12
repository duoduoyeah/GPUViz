


---

## What is Chain
The core is CU, and around CU, has several Chains.
Each chain has its own name.
Chain has several edges, and each edge has many message information.

## Simplify Implementation
Only tackle one chain this week.

choose the level -> multi-workload, gpu, SA, single CU
choose the id of that level -> 


```bash
chainSight search level
chainSight search level <level> id
chainSight search chain
```

```bash
$ chainSight search level "SA" id
available SAs: SA[0], SA[1], SA[2]
```


```bash
chainSight select level <> id <> chain <>
```

* go take a look at ChainView in the types folder

```typescript
interface ChainStoreState {

}
```

* what about in the chainAnalyzer
-> the input here is a chain, i.e. a list of componentNodes that connects
to each other
-> backend messages api needs to be called here
