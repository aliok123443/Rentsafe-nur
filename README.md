# RENTSAFE — GitHub Pages package

This folder is a self-contained copy of the static site prepared for a new GitHub repository and GitHub Pages.

## Create and publish the repository

1. Create a **new empty repository** on GitHub. Do not initialize it with another README or license.
2. Copy the contents of this folder, including the hidden `.github` directory, into the repository. GitHub Desktop or Git is recommended because they preserve hidden workflow files.
3. Commit and push the files to the `main` branch.
4. In the repository, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
5. Open **Actions → Deploy to GitHub Pages**. The workflow runs the checklist tests, prepares the site from `index.html` and `src/`, then deploys it.
6. When the workflow succeeds, open the published URL shown in the deployment or **Settings → Pages**.

The workflow also supports manual runs from the Actions tab. Relative file paths allow the site to work on a GitHub project page under a repository subpath. No build step, API key, or local server is required for Pages.

## Included files

- `index.html` and `src/` — the complete static website and its assets.
- `.github/workflows/pages.yml` — test, package, and deploy workflow.
- `tests/` — checklist state tests run before deployment.
- `.gitignore` — excludes local editor files, build output, logs, and environment files.

The map uses a simplified vector outline derived from Natural Earth country geometry (distributed in the D3 Graph Gallery world GeoJSON); Astana is marked at its geographic coordinates. The AI assistant uses the configured public Cloudflare Worker endpoint and does not expose a Gemini API key in this repository.

## Local checks

With Node.js installed, run:

```powershell
node --test tests/checklist-state.test.mjs
```

For local browsing on Windows, `start.bat` starts the included Python static server if Python 3 is installed.

## Legal information

RENTSAFE provides general information, not individualized legal or tax advice. Checklist legal references may require verification. Review current official sources and the parties' signed agreement for a specific situation.
