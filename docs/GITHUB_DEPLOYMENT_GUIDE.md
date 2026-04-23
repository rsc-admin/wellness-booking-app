# Getting Your RedSmart Booking on GitHub

## Quick Start (5 minutes)

### Step 1: Create a GitHub Account (if you don't have one)
1. Go to [github.com](https://github.com)
2. Click **"Sign up"**
3. Enter email, password, username
4. Verify your email

### Step 2: Create a New Repository
1. Log into GitHub
2. Click **"+"** icon (top right) → **"New repository"**
3. Fill in details:
   - **Repository name:** `wellness-booking-app`
   - **Description:** "RedSmart Booking platform with provider dashboard"
   - **Visibility:** Public (or Private if you prefer)
   - **Initialize with README:** Check this box
   - Click **"Create repository"**

### Step 3: Upload Files

You have 2 options:

#### Option A: Upload via GitHub Web Interface (Easiest - No coding needed)
1. On your new repo page, click **"Add file"** → **"Upload files"**
2. Drag and drop files or click to select:
   - `wellness-booking-google-sheets.jsx`
   - `SETUP_GUIDE.md`
   - `PROJECT_PLAN.md`
   - Any other files
3. Click **"Commit changes"**
4. Done! Your files are on GitHub

#### Option B: Use Git Command Line (Better for updates)
See "Full Setup with Git" section below.

---

## Full Setup with Git (Recommended)

### Prerequisites
1. Install Git: https://git-scm.com/download
2. Verify installation:
   ```bash
   git --version
   ```

### Setup Instructions

#### Step 1: Clone Your Repository
```bash
# Navigate to where you want the project
cd ~/Documents

# Clone the repo (replace USERNAME with your GitHub username)
git clone https://github.com/USERNAME/redsmart-booking.git

# Enter the directory
cd redsmart-booking
```

#### Step 2: Add Your Files
Copy these files into the `wellness-booking-app` folder:
- `wellness-booking-google-sheets.jsx`
- `SETUP_GUIDE.md`
- `PROJECT_PLAN.md`

#### Step 3: Create Additional Files

**Create `.gitignore` file** (optional but good practice):
```bash
# In the wellness-booking-app folder
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
echo ".DS_Store" >> .gitignore
```

**Create `README.md`** (optional - replaces the default one):
```bash
# Copy this into README.md
cat > README.md << 'EOF'
# RedSmart Booking

A mobile-responsive RedSmart Booking platform built with React and Google Sheets.

## Features
- **For Customers:** Browse services, book appointments via interactive calendar
- **For Providers:** Manage bookings, set work hours, add manual entries
- **Tech:** React + Google Sheets API (no backend needed)

## Quick Start
1. Read [SETUP_GUIDE.md](SETUP_GUIDE.md) for initial setup
2. Get your Google Sheet ID and API Key
3. Update the code with your credentials
4. Deploy!

## Project Status
- Phase 1 (Booking App): ✅ Complete
- Phase 2 (Provider Dashboard): 🔄 In Progress
- Phase 3 (Advanced Features): 📋 Planned

See [PROJECT_PLAN.md](PROJECT_PLAN.md) for the full roadmap.

## Files
- `wellness-booking-google-sheets.jsx` - Main React component
- `SETUP_GUIDE.md` - Step-by-step setup instructions
- `PROJECT_PLAN.md` - Full project roadmap and specifications

## License
MIT - Feel free to use and modify
EOF
```

#### Step 4: Commit and Push to GitHub
```bash
# Stage all files
git add .

# Commit with a message
git commit -m "Initial commit: Wellness booking app with Google Sheets integration"

# Push to GitHub
git push origin main
```

You should see:
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
Delta compression using up to 8 threads
To https://github.com/USERNAME/redsmart-booking.git
 * [new branch]      main -> main
```

✅ **Success!** Your files are now on GitHub.

---

## Verify on GitHub

1. Go to https://github.com/USERNAME/redsmart-booking
2. You should see:
   - All your files listed
   - README.md displayed at the bottom
   - File count in the top bar

---

## Next: Deploy Your App

Once files are on GitHub, you can deploy for free using:

### Option 1: Vercel (Recommended - Easiest)
1. Go to [vercel.com](https://vercel.com)
2. Click **"Import Project"**
3. Paste your GitHub repo URL
4. Click **"Import"**
5. Vercel auto-detects React and deploys
6. **Live URL:** `redsmart-booking.vercel.app` (or custom domain)

**Time to live:** ~5 minutes

### Option 2: Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub account
4. Select `wellness-booking-app` repo
5. Click **"Deploy"**

**Time to live:** ~5 minutes

### Option 3: GitHub Pages (Free but limited)
1. Go to repo **Settings** → **Pages**
2. Under "Build and deployment":
   - Source: "GitHub Actions"
   - Click **"Configure"**
3. Select **"React"** template
4. Commit the workflow file
5. GitHub automatically builds and deploys to `USERNAME.github.io/redsmart-booking`

**Time to live:** ~10 minutes

---

## Best Practices

### Folder Structure (Optional but Recommended)
```
wellness-booking-app/
├── src/
│   ├── components/
│   │   ├── CustomerBooking.jsx
│   │   ├── ProviderDashboard.jsx
│   │   └── ...
│   ├── utils/
│   │   └── googleSheetsAPI.js
│   └── App.jsx
├── public/
│   └── index.html
├── docs/
│   ├── SETUP_GUIDE.md
│   ├── PROJECT_PLAN.md
│   └── API_REFERENCE.md
├── .gitignore
├── package.json
├── README.md
└── LICENSE
```

### Git Workflow for Updates

When you make changes locally:
```bash
# Check what changed
git status

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add provider dashboard login screen"

# Push to GitHub
git push origin main
```

### Good Commit Messages
❌ Bad: "update", "fix", "changes"
✅ Good: "Add work hours management UI", "Fix availability calculation bug"

---

## Troubleshooting

### Error: "fatal: not a git repository"
```bash
# You're not in the cloned folder. Navigate to it:
cd redsmart-booking
```

### Error: "Authentication failed"
```bash
# GitHub deprecated password auth. Use personal access token:
# 1. Go to GitHub Settings → Developer settings → Personal access tokens
# 2. Generate new token with 'repo' permissions
# 3. Use token as password when prompted
```

### Error: "branch is behind origin"
```bash
# Pull latest changes first
git pull origin main

# Then make your changes and push
git add .
git commit -m "Your message"
git push origin main
```

### Files not appearing on GitHub after push
- Check you're in the right branch: `git branch` (should show `* main`)
- Force refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

---

## Advanced: Automate Deployment

Once on GitHub, you can set up automatic deployments:

### Vercel Auto-Deploy
1. Connect your GitHub account to Vercel
2. Every time you push to `main`, Vercel auto-deploys
3. Preview URLs for pull requests

### GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install && npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
```

---

## Sharing Your App

Once deployed, share the live link:
- **Customers:** `https://redsmart-booking.vercel.app`
- **Provider:** Add authentication, then share private link

---

## Summary

| Step | Tool | Time | Cost |
|------|------|------|------|
| Create GitHub repo | GitHub | 5 min | Free |
| Upload files | GitHub web UI | 2 min | Free |
| Deploy live | Vercel | 5 min | Free |
| **Total to live app** | - | **12 min** | **Free** |

---

## Next Steps

1. ✅ Create GitHub account
2. ✅ Create repository
3. ✅ Upload files
4. ✅ Deploy with Vercel/Netlify
5. 📱 Test on mobile/desktop
6. 🚀 Share with early customers

---

## Questions?

- **Git help:** https://docs.github.com/en/get-started
- **Vercel docs:** https://vercel.com/docs
- **Netlify docs:** https://docs.netlify.com
