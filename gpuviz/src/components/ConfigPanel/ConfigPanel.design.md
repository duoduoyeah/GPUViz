The config Panel is in the left side of our program.

It could be shrink.

Requirement:
There will be some setting include level,
There will be one toggle that let the user pick item displayed,
include all, memory, computem, three category.

1.The default is at the level 1, (level 0 is the root level).

2.There will has a button that has the submit feature, it
will upate the right side graph.

---

### 1. Position & Behavior

- **Location**: Left edge of the UI, fixed.
- **Collapse**: Single chevron toggles open / closed (animated).

---

### 2. Internal Sections (top-to-bottom, always visible when open)

| Section                   | Purpose                                                                                                                                        | Default / Notes                |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ----------- | ------------------ |
| **A. Hierarchy Level**    | One small number input (spinner or slider).                                                                                                    | 1 (range 0–N). Level 0 = root. |
| **B. Item Filter Toggle** | Three mutually-exclusive buttons: \*\*All                                                                                                      | Memory                         | Compute\*\* | Default = **All**. |
| **C. Dynamic Item List**  | Displays the items that belong to the chosen filter **and** the chosen level. If level = 0, list root nodes. No sliders—just selectable items. |
| **D. Submit Button**      | “Update Graph” (or similar). Triggers a single callback that delivers the current **{ level, filter, selectedItems[] }** to parent.            |

---

### 3. Data Contracts (between ConfigPanel & parent)

Props **received** by ConfigPanel

- `onSubmit(config: { level: number; filter: 'all'|'memory'|'compute'; selectedItems: string[] })`

Events **emitted** by ConfigPanel

- Whenever the **Submit** button is pressed.  
  (No live debounce; parent decides how often to re-render the right-side graph.)

---

### 4. Internal State (private to ConfigPanel)

- `isCollapsed: boolean`
- `level: number`
- `filter: 'all' | 'memory' | 'compute'`
- `selectedItems: string[]` (checkbox / multi-select)

---

### 5. Visual Flow (no code)

```
┌─────────────────────────────┐
│  ◀  GPU Config              │ ← Title + collapse chevron
├─────────────────────────────┤
│ Hierarchy Level: [1 ▲▼]     │ ← small numeric input
├─────────────────────────────┤
│ Show: [All|Mem|Comp]        │ ← toggle buttons
├─────────────────────────────┤
│ □ item-A                    │ ← scrollable list
│ □ item-B                    │    checkboxes
│ ■ item-C                    │
│ ...                         │
├─────────────────────────────┤
│ [   Update Graph   ]        │ ← full-width button
└─────────────────────────────┘
```

When collapsed → only the chevron remains on the left edge.

---
