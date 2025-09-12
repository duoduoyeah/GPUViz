

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
async function getComponentTypes(): Promise<string[]>;
async function getComponentIdsByType(type: string): Promise<string[]>;
async function selectComponentById(type: string, id: ComponentNode): Promise<void>;
```


```typescript
interface ComponentCache {
  types: string[]; // List of all component types
  idsByType: Record<string, ComponentNode[]>; // Mapping of type to IDs, including "combined" as a special ID
}
```
