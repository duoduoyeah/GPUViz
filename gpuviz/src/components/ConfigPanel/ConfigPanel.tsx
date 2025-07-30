import React, { useState } from 'react';
import type { RefObject } from 'react';
import { styles } from './ConfigPanel.styles';
import type { GraphCanvasHandles } from '../GraphCanvas/GraphCanvas';

interface ConfigPanelProps {
  onSubmit: (config: {
    level: number;
    filter: 'all' | 'memory' | 'compute';
    selectedItems: string[];
  }) => void;
  graphCanvasRef: RefObject<GraphCanvasHandles | null>;
}

// Mock data - replace with actual data source
const mockItems = {
  all: ['item-A', 'item-B', 'item-C', 'item-D'],
  memory: ['mem-1', 'mem-2', 'mem-3'],
  compute: ['comp-1', 'comp-2', 'comp-3']
};

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ onSubmit, graphCanvasRef }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [level, setLevel] = useState<number | ''>('');
  const [filter, setFilter] = useState<'all' | 'memory' | 'compute'>('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleItemToggle = (item: string) => {
    setSelectedItems(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const handleSubmit = () => {
    onSubmit({ 
      level: typeof level === 'number' ? level : 0, 
      filter, 
      selectedItems 
    });
  };

  const getFilteredItems = () => {
    // TODO: Filter items based on level and filter type
    // This is mock implementation
    return mockItems[filter];
  };

  const handleFit = () => graphCanvasRef.current?.fit();
  const handleCenter = () => graphCanvasRef.current?.center();
  const handleReset = () => graphCanvasRef.current?.reset();

  if (isCollapsed) {
    return (
      <div style={styles.collapsedContainer}>
        <button 
          onClick={() => setIsCollapsed(false)}
          style={styles.chevronButton}
        >
          ▶
        </button>
      </div>
    );
  }

  return (
    <div style={styles.mainContainer}>
      {/* Header */}
      <div style={styles.header}>
        <button 
          onClick={() => setIsCollapsed(true)}
          style={styles.chevronButton}
        >
          ◀
        </button>
        <span style={styles.title}>GPU Config</span>
      </div>

      {/* Level selector */}
      <div style={styles.section}>
        <label>
          Level: 
          <input
            type="number"
            value={level}
            onChange={(e) => {
              const value = e.target.value;
              setLevel(value === '' ? '' : Number(value));
            }}
            min={0}
            style={styles.levelInput}
            placeholder="0"
          />
        </label>
      </div>

      {/* Filter toggle */}
      <div style={styles.section}>
        <div>Show:</div>
        <div style={styles.filterButtonGroup}>
          <button
            onClick={() => setFilter('all')}
            style={styles.filterButton(filter === 'all')}
          >
            All
          </button>
          <button
            onClick={() => setFilter('memory')}
            style={styles.filterButton(filter === 'memory')}
          >
            Memory
          </button>
          <button
            onClick={() => setFilter('compute')}
            style={styles.filterButton(filter === 'compute')}
          >
            Compute
          </button>
        </div>
      </div>

      {/* Item list */}
      <div style={styles.itemList}>
        {getFilteredItems().map(item => (
          <label
            key={item}
            style={styles.itemLabel}
          >
            <input
              type="checkbox"
              checked={selectedItems.includes(item)}
              onChange={() => handleItemToggle(item)}
              style={styles.itemCheckbox}
            />
            {item}
          </label>
        ))}
      </div>

      {/* Submit button */}
      <div style={styles.submitSection}>
        <button
          onClick={handleSubmit}
          style={styles.submitButton}
        >
          Update Graph
        </button>
      </div>

      {/* Graph Controls */}
      <div style={styles.section}>
        <div>Graph Controls:</div>
        <div style={styles.filterButtonGroup}>
          <button onClick={handleFit} style={styles.filterButton(false)}>Fit</button>
          <button onClick={handleCenter} style={styles.filterButton(false)}>Center</button>
          <button onClick={handleReset} style={styles.filterButton(false)}>Reset</button>
        </div>
      </div>
    </div>
  );
};