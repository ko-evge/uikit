# UIKit - NPM Publishing Guide

Complete step-by-step guide to publish UIKit to npm.js

## Step 1: Create npm Account

If you don't have an npm account:

1. Visit https://www.npmjs.com/
2. Click "Sign Up"
3. Enter:
   - Username: `evge` (or your username)
   - Email: `Ko.evge@gmail.com` (or your email)
   - Password: (choose strong password)
4. Verify email
5. Done! ✓

## Step 2: Update package.json

Edit `package.json` and update:

```json
{
  "name": "@evge/uikit",
  "version": "1.0.0",
  "description": "Modern UI Component Library - ES6, No Dependencies, Production Ready",
  "author": "Evgeny <Ko.evge@gmail.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/uikit"
  },
  ...
}
```

**Current package.json is ready!** ✓

## Step 3: Create GitHub Repository (Optional but Recommended)

If you want to publish to GitHub:

1. Go to https://github.com/new
2. Create new repository: `uikit`
3. Push local repo:

```bash
git remote add origin https://github.com/yourusername/uikit.git
git branch -M main
git push -u origin main
```

## Step 4: Login to npm

In terminal:

```bash
npm login
```

You'll be prompted:
- **Username**: evge
- **Password**: (your npm password)
- **Email**: Ko.evge@gmail.com
- **OTP**: (if 2FA enabled, enter code)

**Output:**
```
Logged in as evge on https://registry.npmjs.org/
```

## Step 5: Publish to npm

```bash
npm publish
```

**Expected output:**
```
npm notice
npm notice 📦  @evge/uikit@1.0.0
npm notice === Tarball Contents ===
npm notice 622B  package.json
npm notice 1.1kB LICENSE
npm notice 2.1kB README.md
npm notice ...
npm notice === Tarball Details ===
npm notice name:          @evge/uikit
npm notice version:       1.0.0
npm notice filename:      @evge/uikit-1.0.0.tgz
npm notice published-on:  2026-06-01T10:00:00.000Z
npm notice === npm Package ===
npm notice homepage:      https://github.com/yourusername/uikit#readme
npm notice ...
npm notice + @evge/uikit@1.0.0
```

✅ **Published successfully!**

## Step 6: Verify Publication

Check that UIKit is on npm:

```bash
# View package info
npm view @evge/uikit

# Or visit:
# https://www.npmjs.com/package/@evge/uikit
```

**Output should show:**
```
@evge/uikit@1.0.0

Modern UI Component Library

dist-tags:
latest: 1.0.0

published 2 minutes ago
```

## Step 7: Install & Test

Test installation in a new directory:

```bash
# Create test directory
mkdir test-uikit && cd test-uikit

# Initialize npm
npm init -y

# Install UIKit
npm install @evge/uikit

# Check node_modules
ls node_modules/@evge/uikit
```

Should show:
```
UIKit/
examples.html
README.md
CHANGELOG.md
...
```

## Step 8: Use in Projects

Now anyone can install UIKit:

```bash
npm install @evge/uikit
```

In your code:

```javascript
import { Button, Grid, Form } from '@evge/uikit';

const btn = new Button('Click me');
document.body.appendChild(btn.getDOMElement());
```

---

## Future Updates

### Update UIKit Version

When you make changes:

```bash
# Update version in package.json
# Option 1: Manual
nano package.json  # Change version to 1.0.1

# Option 2: npm command
npm version patch   # 1.0.0 → 1.0.1
npm version minor   # 1.0.0 → 1.1.0
npm version major   # 1.0.0 → 2.0.0

# Publish update
npm publish
```

### Create GitHub Release

```bash
git tag v1.0.0
git push origin v1.0.0
```

Then visit GitHub and create Release with changelog.

---

## Package Contents

What gets published to npm:

```
@evge/uikit/
├── UIKit/                 ✓ All components
├── examples.html          ✓ Live examples
├── package.json           ✓ Metadata
├── README.md              ✓ Overview
├── CHANGELOG.md           ✓ Version history
├── LICENSE                ✓ MIT license
├── UIKIT_API.md          ✓ API documentation
└── .npmignore            ✓ Excludes dev files
```

Excluded from npm (via .npmignore):
- `.git/` - Git files
- `node_modules/` - Dependencies
- `OLD/` - Old code
- `*.test.js` - Tests
- Development docs

---

## Verify Package on npm.js

1. Visit: https://www.npmjs.com/package/@evge/uikit
2. Should show:
   - Package name: `@evge/uikit`
   - Version: `1.0.0`
   - Downloads: 0+ (increases as people install)
   - Last publish: today
   - License: MIT
   - Repository link
   - Dependencies: none (0)

---

## CDN Usage

After npm publication, UIKit is available via CDN:

```html
<!-- Via unpkg -->
<script src="https://unpkg.com/@evge/uikit/UIKit/index.js"></script>

<!-- Via jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/@evge/uikit/UIKit/index.js"></script>
```

---

## Troubleshooting

### "npm ERR! 403 Forbidden"
- Check if logged in: `npm whoami`
- Login again: `npm login`
- Check package name is unique (not taken)

### "npm ERR! You must be on a higher npm version"
```bash
npm install -g npm@latest
```

### "npm ERR! The package name is already taken"
- Use scoped package: `@yourscope/uikit` ✓ (already using)
- Or change name

### Package not showing on npm.js
- Wait 30 seconds and refresh
- Check: `npm view @evge/uikit`

---

## Success Checklist

After publishing:

- [ ] npm account created
- [ ] package.json updated
- [ ] `npm login` successful
- [ ] `npm publish` completed
- [ ] Package visible on npm.js
- [ ] Installation works: `npm install @evge/uikit`
- [ ] GitHub repo created (optional)
- [ ] README visible on npm
- [ ] Version shows as 1.0.0

---

## What's Next?

After successful publication:

1. **Promote UIKit:**
   - Share on GitHub
   - Post on Twitter, Reddit, forums
   - Submit to "Awesome JS" lists

2. **Add Features:**
   - Version 1.1.0: TypeScript definitions
   - Version 1.1.0: Tests
   - Version 1.2.0: More components

3. **Grow Community:**
   - Accept GitHub contributions
   - Create issues for improvements
   - Add GitHub Actions CI/CD

---

## Commands Quick Reference

```bash
# Setup
npm login                          # Login to npm
npm whoami                         # Check logged in user

# Publishing
npm publish                        # Publish package
npm version patch                  # Bump patch version
npm version minor                  # Bump minor version
npm version major                  # Bump major version

# Verify
npm view @evge/uikit              # View package info
npm info @evge/uikit              # Detailed info
npm search uikit                   # Search packages

# Install & Test
npm install @evge/uikit           # Install locally
npm install -g @evge/uikit        # Install globally

# Unpublish (if needed)
npm unpublish @evge/uikit@1.0.0   # Unpublish version
npm unpublish @evge/uikit         # Unpublish entire package
```

---

## Links

- npm Package: https://www.npmjs.com/package/@evge/uikit
- npm Docs: https://docs.npmjs.com/
- GitHub: https://github.com/yourusername/uikit
- unpkg CDN: https://unpkg.com/@evge/uikit
- jsDelivr CDN: https://cdn.jsdelivr.net/npm/@evge/uikit

---

## License

Published under MIT License - See LICENSE file

---

**Ready to go live!** 🚀
