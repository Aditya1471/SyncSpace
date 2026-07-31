export const KEYBOARD_SHORTCUTS = [
  {
    id: "save-file",
    title: "Save File",
    shortcut: "Ctrl+S",
    mac: "⌘S",
    category: "File",
    description: "Save the active file",
    action: "save",
  },
  {
    id: "new-file",
    title: "New File",
    shortcut: "Ctrl+N",
    mac: "⌘N",
    category: "File",
    description: "Create a new file",
    action: "newFile",
  },
  {
    id: "quick-open",
    title: "Quick Open",
    shortcut: "Ctrl+P",
    mac: "⌘P",
    category: "Navigation",
    description: "Open a file quickly",
    action: "quickOpen",
  },
  {
    id: "command-palette",
    title: "Command Palette",
    shortcut: "Ctrl+Shift+P",
    mac: "⌘⇧P",
    category: "Navigation",
    description: "Open Command Palette",
    action: "commandPalette",
  },
  {
    id: "find",
    title: "Find",
    shortcut: "Ctrl+F",
    mac: "⌘F",
    category: "Search",
    description: "Find in current file",
    action: "find",
  },
  {
    id: "replace",
    title: "Replace",
    shortcut: "Ctrl+H",
    mac: "⌘⌥F",
    category: "Search",
    description: "Replace in current file",
    action: "replace",
  },
  {
    id: "toggle-sidebar",
    title: "Toggle Sidebar",
    shortcut: "Ctrl+B",
    mac: "⌘B",
    category: "View",
    description: "Show or hide Explorer",
    action: "toggleSidebar",
  },
  {
    id: "toggle-terminal",
    title: "Toggle Terminal",
    shortcut: "Ctrl+J",
    mac: "⌘J",
    category: "View",
    description: "Show or hide Terminal",
    action: "toggleTerminal",
  },
  {
    id: "close-tab",
    title: "Close Tab",
    shortcut: "Ctrl+W",
    mac: "⌘W",
    category: "Editor",
    description: "Close active tab",
    action: "closeTab",
  },
  {
    id: "reopen-tab",
    title: "Reopen Closed Tab",
    shortcut: "Ctrl+Shift+T",
    mac: "⌘⇧T",
    category: "Editor",
    description: "Reopen last closed tab",
    action: "reopenTab",
  },
  {
    id: "toggle-comment",
    title: "Toggle Comment",
    shortcut: "Ctrl+/",
    mac: "⌘/",
    category: "Editor",
    description: "Comment or uncomment selected lines",
    action: "comment",
  },
  {
    id: "format-document",
    title: "Format Document",
    shortcut: "Shift+Alt+F",
    mac: "⇧⌥F",
    category: "Editor",
    description: "Format current document",
    action: "format",
  },
  {
    id: "run-code",
    title: "Run Code",
    shortcut: "F5",
    mac: "F5",
    category: "Run",
    description: "Run current program",
    action: "run",
  },
  {
    id: "fullscreen",
    title: "Toggle Fullscreen",
    shortcut: "F11",
    mac: "Ctrl+⌘F",
    category: "View",
    description: "Enter or exit fullscreen",
    action: "fullscreen",
  },
  {
    id: "zoom-in",
    title: "Zoom In",
    shortcut: "Ctrl+=",
    mac: "⌘=",
    category: "View",
    description: "Increase editor font size",
    action: "zoomIn",
  },
  {
    id: "zoom-out",
    title: "Zoom Out",
    shortcut: "Ctrl+-",
    mac: "⌘-",
    category: "View",
    description: "Decrease editor font size",
    action: "zoomOut",
  },
  {
    id: "reset-zoom",
    title: "Reset Zoom",
    shortcut: "Ctrl+0",
    mac: "⌘0",
    category: "View",
    description: "Reset editor zoom level",
    action: "resetZoom",
  },
];

export const SHORTCUT_CATEGORIES = [
  "File",
  "Editor",
  "Navigation",
  "Search",
  "Run",
  "View",
];

export function getShortcut(action) {
  return KEYBOARD_SHORTCUTS.find(
    (shortcut) => shortcut.action === action
  );
}

export function getShortcutsByCategory(category) {
  return KEYBOARD_SHORTCUTS.filter(
    (shortcut) => shortcut.category === category
  );
}

export function searchShortcuts(keyword) {
  const search = keyword.toLowerCase();

  return KEYBOARD_SHORTCUTS.filter(
    (shortcut) =>
      shortcut.title.toLowerCase().includes(search) ||
      shortcut.description.toLowerCase().includes(search) ||
      shortcut.shortcut.toLowerCase().includes(search)
  );
}