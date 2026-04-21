<p align="center">
  <img src="./assets/benchyx-banner.png" width="800"/>
</p>

<h1 align="center">Benchyx</h1>
<p align="center">
  Lightweight benchmarking & performance analysis toolkit
</p>

A minimalist developer tools workspace — a web-based suite of utilities for common developer tasks, with a dark-themed UI and responsive split-panel layout.

## Tools

| Tool | Description |
|------|-------------|
| **JSON** | Format (pretty-print) or minify JSON with live validation |
| **JWT** | Decode JWT tokens — header, payload, signature, expiry info |
| **Encode** | Base64 and URL encode/decode |
| **Regex** | Test regex patterns with live match highlighting and flags (g, i, m) |
| **Time** | Convert Unix timestamps and ISO 8601 strings, with local/UTC toggle |
| **Diff** | Side-by-side text diff using LCS algorithm, with unified copy |

## Stack

- **Next.js 16** (App Router, React Server Components)
- **React 19**
- **TypeScript 5** (strict mode)
- **Tailwind CSS v4**
- **shadcn/ui** + **Radix UI**
- **Lucide React** icons

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/          # Next.js App Router (layout, page, global styles)
├── components/   # Shared UI (Sidebar, Toolbar, SplitPanel, Workspace)
│   └── ui/       # shadcn/ui primitives (Button, ...)
├── tools/        # One directory per tool (json, jwt, encode, regex, time, diff)
└── lib/          # Utilities (cn helper)
```
