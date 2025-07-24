import React, { useState } from 'react';
import { styles } from './ConfigPanel.styles';

interface ConfigPanelProps {
  onSubmit: (config: {
    level: number;
    filter: 'all' | 'memory' | 'compute';
    selectedItems: string[];
  }) => void;
}

// Mock data - replace with actual data source
const mockItems = {
  all: ['item-A', 'item-B', 'item-C', 'item-D'],
  memory: ['mem-1', 'mem-2', 'mem-3'],
  compute: ['comp-1', 'comp-2', 'comp-3']
};

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ onSubmit }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [level, setLevel] = useState(1);
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
    onSubmit({ level, filter, selectedItems });
  };

  const getFilteredItems = () => {
    // TODO: Filter items based on level and filter type
    // This is mock implementation
    return mockItems[filter];
  };

  if (isCollapsed) {
    return (
      <div style={styles.collapsedContainer}>
        <button onClick={() => setIsCollapsed(false)}>▶</button>
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
          Hierarchy Level: 
          <input
            type="number"
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            min={0}
            style={styles.levelInput}
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
    </div>
  );
};