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
- **Setup screens.** An 11-step first-run flow with moving Android 13 shapes: name, colours and theme, interface size, animations and haptics, editor and typing options, repository defaults, preview device, persistent storage, then a short "setting things up" screen. Replay it from Settings → About.
- **Templates.** New repositories start blank by default. You can instead pick Web starter, Android-style app, Landing page, To-do app, Tap game, Python script or Documentation, and also choose topics, a README, a .gitignore, an MIT license and the default branch name.
- **Quick settings.** Tap your avatar for Android-style tiles (dark theme, autosave, live preview, autocomplete, word wrap, haptics, animations).
- **Motion.** Page transitions, staggered lists, ripples on every tap, animated dialogs and switches, and an update screen with progress. Turn it all off with Settings → Display & theme → Animations.
- **Settings.** Laid out like Android settings: Profile, Display & theme, Editor, Preview, Repositories, Storage, System update and About.

## Preview on a real device

Open **Settings → Connected devices** (or the Devices button in the Preview tab).

- **Live preview.** Press *Start connection*, open the link on your phone, copy the code it shows and paste it back on your computer. The phone then mirrors the Preview tab and updates as you type. Console messages from the phone show up in your console, and links between pages work. Files go directly from your computer to the phone over WebRTC; Google's public STUN server is only used to help the two devices find each other, so both need an internet connection.
- **Snapshot link.** Creates a link that contains a copy of your repository's text files. Open it on any device. It does not update, and images are not included.

## Storage

Files are saved in your browser using IndexedDB. The app enforces **8 GB per repository** and **64 GB in total**, but the real limit is whatever your browser allows, so the Storage page also shows the browser's quota. Usage is split into categories the way Android does it: Code, Web, Images, Audio & video, Documents & other, and **System**, which is the size of the ScriptX-Engine website files. Tap a category to see its files. If a browser blocks storage completely, work is kept in memory until you close the tab.

Nothing is sent to a server. Clearing your browser data removes your repositories, so use **Download ZIP** to keep backups.

## System update (OTA)

Open **Settings → System update** and press **Check for update**. Updates are **locked to one source, `Asterisk-e/ScriptX-Engine`**, and cannot be pointed anywhere else. ScriptX-Engine asks the GitHub API for the five newest commits and the file list, then shows:

- the latest commits,
- any new pages (files) added since your last check,
- an **Install update** button when the newest commit is not the one you are running.

Installing shows an animated progress screen while it downloads `app.js` and `style.css` from that exact commit, checks them, stores them and restarts. Only a full 40-character commit ID is accepted, and a SHA-256 checksum of the installed files is shown on the update page. If a new version fails to start, the built-in version loads again automatically, and **Use built-in version** reverts manually. GitHub allows about 60 unauthenticated requests per hour.

If you fork this project, change `OTA_REPO` near the top of the update code in `app.js` to your own repository.

## Settings

Profile, Display & theme (colours, fonts, line height, animations), Editor (autocomplete options, autosave delay, tab size, trim and final newline), Preview, Connected devices, Repositories (default template, branch, visibility), Sound & feedback, Accessibility (interface size, high contrast), Privacy & security, Backup & restore, Storage, System update and About. Tap the version in About seven times to unlock **Developer options** (layout bounds and touch indicators in the preview), just like on Android.

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
