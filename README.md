# OneNote Daily Notes

An Office Add-in for OneNote on the web that creates template-based daily note pages with a structured notebook hierarchy.

## What It Does

For each selected date, the add-in creates:

```
Notebook {YYYY}
  └── Section Group {MM Mmmm}
        └── Section {DD Dddd}
              └── Page {YYYY-MM-DD Dddd}
```

**Example** (March 3, 2026):

```
Notebook "2026"
  └── Section Group "03 March"
        └── Section "03 Tuesday"
              └── Page "2026-03-03 Tuesday"
```

Each daily note page contains three sections:

- **Agenda** — table with Start, End, Who, What columns
- **Action Items** — bulleted list
- **Notes** — free-form text area

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A Microsoft 365 account with access to [OneNote on the web](https://www.onenote.com/)
- A notebook named with the current year (e.g., "2026") must already exist

## Setup

```bash
npm install
```

## Development

### Start the dev server

```bash
npm run dev-server
```

This starts a webpack dev server on `https://localhost:3000` with HTTPS (using Office Add-in dev certificates).

### Start a tunnel (required for OneNote on the web)

OneNote on the web blocks requests to `localhost` due to browser Private Network Access restrictions. A tunnel is required to proxy traffic through a public URL.

```bash
# Install cloudflared (one-time)
brew install cloudflared

# Start the tunnel (updates manifest.xml automatically)
npm run tunnel
```

This starts a Cloudflare tunnel and updates `manifest.xml` with the tunnel URL.

### Sideload the add-in

1. Open a notebook in [OneNote on the web](https://www.onenote.com/)
2. Go to **Insert > Office Add-ins > Upload My Add-in**
3. Upload `manifest.xml`
4. Click the **Daily Notes** button on the Home tab

### Run tests

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

### Build for production

```bash
npm run build
```

Outputs optimized files to `dist/`.

## Beta Testing

To distribute to beta testers:

### 1. Host the built files

Build the production assets and host the `dist/` folder on any static HTTPS server:

- **GitHub Pages** — free, auto-deploys on push
- **Azure Static Web Apps** — Microsoft ecosystem, free tier
- **Netlify / Vercel** — drag-and-drop or connect to repo

The `dist/` folder contains everything needed:
- `taskpane.html`
- `taskpane.bundle.js`
- `assets/icon-*.png`

### 2. Update the manifest

Replace all `https://localhost:3000` URLs in `manifest.xml` with your hosted URL:

```bash
# Example for GitHub Pages
sed -i '' 's|https://localhost:3000|https://kenlefeb.github.io/onenote-journal|g' manifest.xml
```

### 3. Distribute to testers

**Option A: Sideloading (simplest)**

Share the updated `manifest.xml` file with testers. They sideload it manually:

1. Open OneNote on the web
2. Go to **Insert > Office Add-ins > Upload My Add-in**
3. Upload `manifest.xml`

Testers do **not** need to re-upload the manifest when you update the hosted code — only when the manifest itself changes (e.g., new URLs or permissions).

**Option B: Centralized Deployment (recommended for organizations)**

If you are a Microsoft 365 admin:

1. Go to the [Microsoft 365 admin center](https://admin.microsoft.com/)
2. Navigate to **Settings > Integrated Apps > Upload Custom App**
3. Upload `manifest.xml`
4. Assign to specific users or groups

The add-in appears automatically for designated users.

**Option C: SharePoint App Catalog**

Upload the manifest to a SharePoint app catalog. Users install it from the Office Add-ins dialog without needing the manifest file directly.

## Project Structure

```
src/
  taskpane/            # Task pane UI (HTML, CSS, TypeScript)
  daily-note/          # Date formatting, page template, orchestration
  onenote/             # OneNote API wrappers
  shared/              # Constants, error handling

tests/
  daily-note/          # Date formatter, template, service tests
  onenote/             # OneNote client tests
  helpers/             # Mock objects

scripts/
  start-tunnel.sh      # Cloudflare tunnel helper

public/
  assets/              # Add-in icons
```

## npm Scripts

| Script | Description |
|--------|-------------|
| `npm run dev-server` | Start webpack dev server (HTTPS, port 3000) |
| `npm run build` | Production build to `dist/` |
| `npm run build:dev` | Development build to `dist/` |
| `npm test` | Run Jest tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run tunnel` | Start Cloudflare tunnel and update manifest |
| `npm run lint` | Run ESLint |
| `npm run validate` | Validate the Office Add-in manifest |

## Future Plans

- Outlook calendar integration: populate the Agenda table from calendar events
- Meeting sub-pages: create a linked sub-page for each calendar event
- Custom templates: allow users to configure page layout

## License

ISC
