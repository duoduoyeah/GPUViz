import React, { useState } from "react";
import type { RefObject } from "react";
import { styles } from "./ConfigPanel.styles";
import type { GraphCanvasHandles } from "../GraphCanvas/GraphCanvas";

interface ConfigPanelProps {
  onSubmit: (config: {
    filter: "all" | "tidy";
    selectedItems: string[];
  }) => void;
  onLevelChange: (level: number) => void;
  graphCanvasRef: RefObject<GraphCanvasHandles | null>;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  onSubmit,
  onLevelChange,
  graphCanvasRef,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [level, setLevel] = useState<number | "">(1);
  const [filter, setFilter] = useState<"all" | "tidy">("all");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleItemToggle = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const handleSubmit = () => {
    onSubmit({
      filter,
      selectedItems,
    });
  };

  const handleLevelUpdate = () => {
    const levelValue = typeof level === "number" ? level : 0;
    onLevelChange(levelValue);
  };

  const getViewItems = () => {
    // TODO: Implement actual view items based on level and view mode
    return [];
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
              setLevel(value === "" ? "" : Number(value));
            }}
            min={0}
            style={styles.levelInput}
          />
        </label>
        <button onClick={handleLevelUpdate} style={styles.submitButton}>
          Update Level
        </button>
      </div>

      {/* Filter toggle */}
      <div style={styles.section}>
        <div>Show:</div>
        <div style={styles.filterButtonGroup}>
          <button
            onClick={() => setFilter("all")}
            style={styles.filterButton(filter === "all")}
          >
            All
          </button>
          <button
            onClick={() => setFilter("tidy")}
            style={styles.filterButton(filter === "tidy")}
          >
            Tidy
          </button>
        </div>

        <button onClick={handleSubmit} style={styles.submitButton}>
          Apply Filters
        </button>
      </div>

      {/* Item list */}
      <div style={styles.itemList}>
        {getViewItems().map((item) => (
          <label key={item} style={styles.itemLabel}>
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

      {/* Graph Controls */}
      <div style={styles.section}>
        <div>Graph Controls:</div>
        <div style={styles.filterButtonGroup}>
          <button onClick={handleFit} style={styles.filterButton(false)}>
            Fit
          </button>
          <button onClick={handleCenter} style={styles.filterButton(false)}>
            Center
          </button>
          <button onClick={handleReset} style={styles.filterButton(false)}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
