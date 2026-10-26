import { IconButton, Tooltip } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useThemeMode } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { mode, toggleMode } = useThemeMode();
  const nextMode = mode === "light" ? "dark" : "light";

  return (
    <Tooltip title={`Use ${nextMode} theme`}>
      <IconButton onClick={toggleMode} aria-label={`Switch to ${nextMode} theme`}>
        {mode === "light" ? <DarkMode /> : <LightMode />}
      </IconButton>
    </Tooltip>
  );
}
