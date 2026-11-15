# ScriptX-Engine

ScriptX-Engine is a code editor that runs entirely in your browser. It combines a VS Code-style editor, a GitHub-style repository layout and a built-in app preview, all styled after Android 13 (Material You). There is no server and no build step: it is plain HTML, CSS and JavaScript.

## What you can do

- **Repositories.** Create repositories like on GitHub, with a name, description and Public/Private setting. They start empty unless you choose to add a README.
- **Files and folders.** Create files with any name and extension. Typing `src/app.py` creates the folder too. Upload files from your device, rename and delete files, star repositories and download a repository as a ZIP.
- **Editor.** Tabs, line numbers, syntax highlighting, auto-indent, auto-closing brackets, find and replace (Ctrl+F) and a Markdown preview.
- **Autocomplete.** Commands appear while you type. For example `print` offers `console.log()`, `print()`, `System.out.println()` or `fmt.Println()` depending on the file type. Supported: JavaScript/TypeScript, Python, HTML, CSS, Java, C/C++, Go, Rust, PHP, shell, Ruby and Lua. Use the arrow keys to choose and Tab or Enter to accept.
- **Preview.** Runs your `index.html` with its linked CSS, JavaScript and images. Choose a device (Pixel 7, small phone, tablet or desktop), rotate it, switch between your HTML pages (links between pages work), reload, open it in a new tab, read the console and run JavaScript from the console box.
- **Search.** Find text across every file in a repository.
- **Command palette.** Press Ctrl+K (or Cmd+K) to jump to any page, repository or file.
- **Setup screens.** A first-run welcome flow with Android 13 shapes lets you pick a name, colours and editor options. You can replay it from Settings → About.
- **Settings.** Laid out like Android settings: Profile, Display & theme, Editor, Preview, Repositories, Storage, System update and About.

## Storage

Files are saved in your browser using IndexedDB. The app enforces **8 GB per repository** and **64 GB in total**, but the real limit is whatever your browser allows, so the Storage page also shows the browser's quota. Usage is split into categories the way Android does it: Code, Web, Images, Audio & video, Documents & other, and **System**, which is the size of the ScriptX-Engine website files. Tap a category to see its files. If a browser blocks storage completely, work is kept in memory until you close the tab.

Nothing is sent to a server. Clearing your browser data removes your repositories, so use **Download ZIP** to keep backups.

## System update (OTA)

Open **Settings → System update**, enter your GitHub repository as `owner/name` and press **Check for update**. ScriptX-Engine asks the GitHub API for the latest commits and the file list, then shows:

- the five newest commits,
- any new pages (files) that were added since your last check,
- an **Install update** button when the newest commit is not the one you are running.

Installing downloads `app.js` and `style.css` from that commit and stores them on your device. The next start loads them instead of the built-in files. If the new version fails to start, the built-in version loads again automatically, and **Use built-in version** reverts manually. The repository must be public, and GitHub allows about 60 unauthenticated requests per hour.

## Files in this project

| File | Purpose |
| --- | --- |
| `index.html` | Page markup, favicon link and the small loader for OTA updates |
| `style.css` | Android 13 / Material You styles |
| `app.js` | Editor, storage, routing, preview, setup flow and updater |
| `favicon.svg` | Site icon |
| `README.md` | This file |

## Host it on GitHub Pages

1. Put all the files above in the root of a repository.
2. Open **Settings → Pages**.
3. Choose the `main` branch and the `/ (root)` folder, then save.
4. Open the Pages address once it is published.

To use the updater, push new commits to the same repository and press **Check for update** in the app.

## Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| Ctrl/Cmd + K | Command palette |
| Ctrl/Cmd + S | Save the current file |
| Ctrl/Cmd + F | Find and replace |
| Ctrl/Cmd + Enter | Run in preview |
| Tab | Accept a suggestion or indent |

## Limits

- There is no real Git: no commits, branches or pushing from the editor.
- Private repositories are only marked private on this device.
- The preview runs in a sandbox, so pages cannot use `localStorage` or open pop-ups.
