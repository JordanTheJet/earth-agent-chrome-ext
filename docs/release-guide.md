# GitHub Release Guide - Earth Agent Chrome Extension

This guide explains how to create a GitHub release for the Earth Agent Chrome Extension with automated building and packaging.

## Overview

The project has an automated release system using GitHub Actions. When you create a git tag, it automatically:
- Builds the extension
- Creates installation packages
- Publishes a GitHub release
- Includes proper installation instructions

## Current Release System

### Automated Workflow (`.github/workflows/build-and-release.yml`)

The workflow automatically:
1. ✅ **Builds** the extension from source
2. ✅ **Updates** manifest version to match git tag
3. ✅ **Creates** two packages:
   - `earth-agent-extension.zip` - Ready-to-install Chrome extension
   - `earth-agent-source.zip` - Source code for developers
4. ✅ **Publishes** GitHub release with installation instructions

## How to Create a Release

### Method 1: Command Line (Recommended)

1. **Ensure your changes are committed and pushed**:
   ```bash
   git add .
   git commit -m "feat: your changes description"
   git push origin main
   ```

2. **Create and push a version tag**:
   ```bash
   # For new feature release
   git tag v1.1.0
   git push origin v1.1.0
   
   # Or for patch release
   git tag v1.0.1  
   git push origin v1.0.1
   
   # Or for major release
   git tag v2.0.0
   git push origin v2.0.0
   ```

3. **GitHub Actions will automatically**:
   - Detect the new tag
   - Build the extension
   - Create the release
   - Upload installation files

### Method 2: GitHub Web Interface

1. **Go to your GitHub repository**
2. **Click "Releases" → "Create a new release"**
3. **Create new tag**: Enter version like `v1.1.0`
4. **Set as latest release**: Check the box
5. **Click "Publish release"**

The automated workflow will then build and package everything.

### Method 3: Manual Trigger

You can also trigger the workflow manually:

1. Go to **Actions** tab in your repository
2. Select **"Build and Release Extension"** workflow  
3. Click **"Run workflow"**
4. Choose your branch and run

## Version Numbering

Use [Semantic Versioning](https://semver.org/):

- **v1.0.0** - Major version (breaking changes)
- **v1.1.0** - Minor version (new features, backward compatible)
- **v1.0.1** - Patch version (bug fixes)

### Current Version Status
- **Package.json**: `1.0.0`
- **Manifest.json**: `1.0.0`

## Release Packages

Each release creates two files:

### 1. `earth-agent-extension.zip` 📦
**For end users installing the extension**
- Contains built/compiled files ready for Chrome
- Includes: `manifest.json`, `background.js`, `content.js`, `sidepanel.html`, etc.
- **Size**: ~2-5MB (compressed)

### 2. `earth-agent-source.zip` 💻  
**For developers and code review**
- Contains source code, documentation, configuration
- Excludes: `node_modules/`, `dist/`, build artifacts
- **Size**: ~1-2MB

## Installation Instructions (Auto-Generated)

Each release includes detailed instructions:

### For End Users:
1. Download `earth-agent-extension.zip`
2. Extract to a folder
3. Open `chrome://extensions/`
4. Enable "Developer mode"
5. Click "Load unpacked" → select folder
6. Configure API keys in extension settings

### For Developers:
1. Download `earth-agent-source.zip`
2. Extract and run `npm install`
3. Build with `npm run build`
4. Load from `dist/` folder

## What Happens During Build

The automated process:

1. **Environment Setup**:
   - Node.js 18 with npm cache
   - Install dependencies with fallback for peer dependencies

2. **Quality Checks**:
   - TypeScript type checking
   - Build verification

3. **Build Process**:
   - Clean previous builds
   - Webpack bundling for production
   - Verify required files exist

4. **Version Management**:
   - Extract version from git tag
   - Update `dist/manifest.json` automatically
   - Verify version update

5. **Package Creation**:
   - Zip extension files (excluding source maps)
   - Create source package (excluding build artifacts)
   - Verify package contents

## Troubleshooting Releases

### Common Issues:

#### ❌ **Build Fails**
```bash
# Check locally first:
npm run build
npm run type-check

# Fix TypeScript errors before tagging
```

#### ❌ **Missing Files in Package**
The workflow verifies these required files:
- `manifest.json`
- `background.js` 
- `content.js`
- `sidepanel.html`
- `sidepanel.js`

If any are missing, the build fails.

#### ❌ **Version Mismatch**
- Git tag version automatically updates manifest
- No need to manually edit manifest version
- Use format: `v1.2.3` (with 'v' prefix)

#### ❌ **Workflow Permissions Error**
Ensure repository has these permissions enabled:
```yaml
permissions:
  contents: write
  packages: write
```

### Manual Release (Fallback)

If automated workflow fails, you can create releases manually:

```bash
# 1. Build locally
npm run build

# 2. Update manifest version manually
sed -i 's/"version": ".*"/"version": "1.1.0"/' dist/manifest.json

# 3. Create packages
cd dist && zip -r ../earth-agent-extension.zip . -x "*.DS_Store" "*.map"
cd .. && zip -r earth-agent-source.zip . -x "node_modules/*" "dist/*" ".git/*"

# 4. Upload to GitHub releases manually
```

## Release Checklist

Before creating a release:

- [ ] All changes committed and pushed
- [ ] Tests passing (`npm run type-check`)
- [ ] Build works locally (`npm run build`)
- [ ] Version number decided (semantic versioning)
- [ ] Release notes prepared (optional)
- [ ] Ready to tag and push

After release:

- [ ] Verify release created successfully
- [ ] Test installation from release files
- [ ] Update documentation if needed
- [ ] Announce release to users

## Advanced Release Features

### Custom Release Notes

Add custom description when creating tag via GitHub UI:

```markdown
## 🚀 What's New in v1.1.0

### ✨ New Features
- Added dataset context injection for custom datasets
- Enhanced prompt engineering with modular system
- New screenshot and snapshot tools

### 🐛 Bug Fixes  
- Fixed CORS issues with Anthropic API
- Improved error handling in chat interface

### 🔧 Technical Improvements
- Updated to latest AI SDK versions
- Better TypeScript type definitions
- Optimized build process
```

### Pre-release Versions

For beta/alpha releases:
```bash
git tag v1.1.0-beta.1
git push origin v1.1.0-beta.1
```

Mark as "pre-release" in GitHub release settings.

## Security Considerations

### API Keys & Sensitive Data
- ✅ No API keys in source code
- ✅ Sensitive config in `.env` (not committed)
- ✅ OAuth client ID is public (safe to include)

### Extension Permissions  
Current permissions in manifest:
- `sidePanel`, `storage`, `activeTab` - Core functionality
- `tabs`, `scripting` - Earth Engine integration  
- `downloads`, `identity` - File exports, Google Drive
- Host permissions for specific domains only

## Future Enhancements

Planned improvements to release system:
- [ ] Automated Chrome Web Store publishing
- [ ] Release notes from conventional commits
- [ ] Multi-environment builds (dev/staging/prod)
- [ ] Automated testing in release pipeline
- [ ] Size optimization warnings