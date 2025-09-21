import { useState } from "react";
import styles from "./ViewSwitcher.module.scss";
import clsx from "clsx";
import { DataTable, LineGraph } from "@/app/components/icons";
import Button from "@/app/components/Button";

export type ViewMode = "table" | "graph";

interface ViewSwitcherProps {
  defaultView?: ViewMode;
  onViewChange: (mode: ViewMode) => void;
}

const ViewSwitcher = ({
  defaultView = "table",
  onViewChange,
}: ViewSwitcherProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultView);

  const handleViewModeChange = (newMode: ViewMode) => {
    if (newMode !== viewMode) {
      setViewMode(newMode);
      onViewChange(newMode);
    }
  };

  return (
    <div
      className={styles.viewModeSwitcher}
      role="tablist"
      aria-label="View mode switcher"
    >
      <Button
        role="tab"
        aria-selected={viewMode === "table"}
        aria-label="Table view"
        className={clsx(styles.viewButton, {
          [styles.activeView]: viewMode === "table",
        })}
        type="button"
        variant="ghost"
        onClick={() => handleViewModeChange("table")}
      >
        <DataTable className={styles.viewContent} />
      </Button>
      <Button
        role="tab"
        aria-selected={viewMode === "graph"}
        aria-label="Graph view"
        className={clsx(styles.viewButton, {
          [styles.activeView]: viewMode === "graph",
        })}
        type="button"
        variant="ghost"
        onClick={() => handleViewModeChange("graph")}
      >
        <LineGraph className={styles.viewContent} />
      </Button>
    </div>
  );
};

export default ViewSwitcher;
