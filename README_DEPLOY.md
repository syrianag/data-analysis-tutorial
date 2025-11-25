Deployment
==========

This project is configured to deploy to Vercel.

Quick deploy steps (manual):

1. Push your branch to GitHub (the repository).
2. Visit https://vercel.com and import the repository, or connect from the Vercel GitHub integration.
3. Set environment variables in Vercel (if you plan to use AI features):
   - OPENAI_API_KEY
   - NEXT_PUBLIC_MAX_FILE_SIZE_MB
   - NEXT_PUBLIC_SUPPORTED_FORMATS

CI
--

A simple GitHub Actions workflow is included at `.github/workflows/ci.yml` which will run tests and build on pushes/PRs to `main`.
