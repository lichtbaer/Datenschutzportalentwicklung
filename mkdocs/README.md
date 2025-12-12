# Documentation Source Files

This directory contains the source Markdown files for the documentation.

The built documentation is generated in the `docs/` directory using MkDocs.

## Building the Documentation

To build the documentation:

```bash
source docs-venv/bin/activate
mkdocs build
```

The documentation will be built in the `docs/` directory.

## Publishing to GitHub Pages

1. Commit the built documentation in the `docs/` directory
2. In your GitHub repository settings, go to Pages
3. Set the source to "Deploy from a branch"
4. Select your branch (usually `main` or `master`)
5. Set the folder to `/docs`
6. Save the settings

GitHub Pages will automatically serve the documentation from the `docs/` directory.

