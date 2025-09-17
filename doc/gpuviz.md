## Search Component in GPUVIZ
1. Search component types (there will be some types).
2. After choosing one type, select the ID, or combine.

```bash
gpuviz search
gpuviz search --type <type>

gpuviz select --type <type>
gpuviz select --type <type> --id <id>
```

```typescript
function getComponentTypes(): string[];
function getComponentIdsByType(type: string): string[];
function selectComponentById(type: string, id: ComponentNode): void;
```

```typescript
interface ComponentCache {
  types: string[]; // List of all component types
  idsByType: Record<string, ComponentNode[]>; // Mapping of type to IDs, including "combined" as a special ID
}
```

## chain view in GPUVIZ

```bash
chainSight search level
chainSight search level <level> id
chainSight search chain
```

```typescript
// Retrieves the levels of the chain
function getChainLevels(): string[];

// Retrieves the IDs by a specific level
function getChainIdsByLevel(level: string): Chain[];

// Selects a chain by its level and ID
function viewChainGraphById(level: string, id: Chain): void;
```

```typescript
interface ChainCache {
  levels: string[]; // List of all component types
  idsByLevel: Record<string, Chain[]>; // Mapping of type to IDs, including "combined" as a special ID
}
```
