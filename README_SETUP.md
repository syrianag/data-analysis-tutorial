# Quick setup (added)

This lightweight README gives just the commands you need to get running quickly (from repo root):

Install pnpm (optional but recommended):

```bash
npm install -g pnpm
```

Install dependencies:

```bash
pnpm install
```

Create `.env.local` with your OpenAI key (do not commit):

```bash
printf "OPENAI_API_KEY=your_api_key_here\nNEXT_PUBLIC_MAX_FILE_SIZE_MB=50\nNEXT_PUBLIC_SUPPORTED_FORMATS=csv,json,xlsx\n" > .env.local
```

Run dev server:

```bash
pnpm run dev
```

Open http://localhost:3000

Refer to `instructions/data-analysis-tutorial/04-SETUP_INSTRUCTIONS.md` for more details.
