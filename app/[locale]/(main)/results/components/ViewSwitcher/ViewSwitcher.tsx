import { useState } from "react";
import styles from "./ViewSwitcher.module.scss";
import clsx from "clsx";
import { DataTable, LineGraph } from "@/app/components/icons";

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
    <div className={styles.viewModeSwitcher} role="tablist">
      <button
        className={clsx(styles.viewButton, {
          [styles.activeView]: viewMode === "table",
        })}
        type="button"
        onClick={() => handleViewModeChange("table")}
      >
        <DataTable className={styles.viewContent} />
      </button>
      <button
        className={clsx(styles.viewButton, {
          [styles.activeView]: viewMode === "graph",
        })}
        type="button"
        onClick={() => handleViewModeChange("graph")}
      >
        <LineGraph className={styles.viewContent} />
      </button>
    </div>
  );
};

export default ViewSwitcher;
