# ScriptX-Engine

A code editor that runs entirely in your browser, with a GitHub-style repository layout and an Android 13 (Material You) look.

## Features

- Create repositories, folders and files with any extension
- Syntax highlighting and autocomplete (type `print` to get the right command for the language)
- Live app preview in phone, tablet and desktop frames, with a console
- Storage page: 8 GB per repository, 64 GB in total, capped by what your browser allows
- Settings for theme, wallpaper colour, font size, tab size, autosave and more

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page markup |
| `style.css` | Android 13 styling |
| `app.js` | Editor, storage, routing and preview logic |
| `README.md` | This file |

## Host it on GitHub Pages

1. Put all four files in the root of a repository.
2. Open **Settings → Pages**.
3. Choose the `main` branch and the `/ (root)` folder, then save.

## Notes

- Data is stored in your browser (IndexedDB). It is not synced to GitHub.
- If a browser blocks storage, the app keeps your work in memory until you close the tab.
