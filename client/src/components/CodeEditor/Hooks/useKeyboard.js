import { useEffect } from "react";

export default function useKeyboard({
  onSave,
  onQuickOpen,
  onCommandPalette,
  onFind,
  onReplace,
  onToggleSidebar,
  onToggleTerminal,
  onNewFile,
  onCloseTab,
  onReopenTab,
  onComment,
  onFormat,
  onRun,
  onFullscreen,
} = {}) {
  useEffect(() => {
    const handler = (event) => {
      const key = event.key.toLowerCase();

      // Ignore shortcuts while typing
      const target = event.target;
      const isTyping =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      // Allow Monaco to handle editor shortcuts
      if (isTyping) return;

      // Ctrl/Cmd + S
      if ((event.ctrlKey || event.metaKey) && key === "s") {
        event.preventDefault();
        onSave?.();
        return;
      }

      // Ctrl/Cmd + P
      if ((event.ctrlKey || event.metaKey) && !event.shiftKey && key === "p") {
        event.preventDefault();
        onQuickOpen?.();
        return;
      }

      // Ctrl/Cmd + Shift + P
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && key === "p") {
        event.preventDefault();
        onCommandPalette?.();
        return;
      }

      // Ctrl/Cmd + F
      if ((event.ctrlKey || event.metaKey) && key === "f") {
        event.preventDefault();
        onFind?.();
        return;
      }

      // Ctrl/Cmd + H
      if ((event.ctrlKey || event.metaKey) && key === "h") {
        event.preventDefault();
        onReplace?.();
        return;
      }

      // Ctrl/Cmd + B
      if ((event.ctrlKey || event.metaKey) && key === "b") {
        event.preventDefault();
        onToggleSidebar?.();
        return;
      }

      // Ctrl/Cmd + J
      if ((event.ctrlKey || event.metaKey) && key === "j") {
        event.preventDefault();
        onToggleTerminal?.();
        return;
      }

      // Ctrl/Cmd + N
      if ((event.ctrlKey || event.metaKey) && key === "n") {
        event.preventDefault();
        onNewFile?.();
        return;
      }

      // Ctrl/Cmd + W
      if ((event.ctrlKey || event.metaKey) && key === "w") {
        event.preventDefault();
        onCloseTab?.();
        return;
      }

      // Ctrl/Cmd + Shift + T
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && key === "t") {
        event.preventDefault();
        onReopenTab?.();
        return;
      }

      // Ctrl/Cmd + /
      if ((event.ctrlKey || event.metaKey) && key === "/") {
        event.preventDefault();
        onComment?.();
        return;
      }

      // Shift + Alt + F
      if (event.shiftKey && event.altKey && key === "f") {
        event.preventDefault();
        onFormat?.();
        return;
      }

      // F5
      if (event.key === "F5") {
        event.preventDefault();
        onRun?.();
        return;
      }

      // F11
      if (event.key === "F11") {
        event.preventDefault();
        onFullscreen?.();
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [
    onSave,
    onQuickOpen,
    onCommandPalette,
    onFind,
    onReplace,
    onToggleSidebar,
    onToggleTerminal,
    onNewFile,
    onCloseTab,
    onReopenTab,
    onComment,
    onFormat,
    onRun,
    onFullscreen,
  ]);
}