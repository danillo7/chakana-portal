# 🚀 Deployment Guide - Chakana Portal

**Production Deployment Checklist**

Version: 1.0.0
Last Updated: January 2026

---

## 📋 Pre-Deployment Checklist

### 1. Code Quality

- [x] All TypeScript compilation errors fixed (`npm run typecheck`)
- [x] ESLint warnings reviewed (`npm run lint`)
- [x] Build succeeds without errors (`npm run build`)
- [x] All components properly exported
- [x] No console.log statements in production code

### 2. Environment Configuration

```bash
# Create production .env file
cp .env.example .env.production

# Required variables (if using Supabase):
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional variables:
VITE_APP_ENV=production
```

### 3. Dependencies

```bash
# Verify all dependencies installed
npm install

# Check for security vulnerabilities
npm audit

# Update critical security fixes only
npm audit fix
```

### 4. Performance Optimization

- [x] Images optimized (< 100 KB each)
- [x] Lazy loading for heavy components (PDF, Charts)
- [x] Code splitting configured (Vite auto-splits)
- [x] Bundle size analyzed (`npm run build -- --sourcemap`)

### 5. Testing

- [ ] Manual QA on Desktop (Chrome, Firefox, Safari)
- [ ] Manual QA on Mobile (iOS Safari, Android Chrome)
- [ ] Cross-device sync tested (if Supabase enabled)
- [ ] Offline mode tested (Service Worker)
- [ ] PDF export tested with 50+ reflections

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel:**
- ✅ Zero-config Vite support
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Instant rollbacks
- ✅ Free tier (generous limits)

**Steps:**

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Configure Environment Variables:**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

5. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

6. **Custom Domain (Optional):**
   - Go to Vercel Dashboard → Project → Settings → Domains
   - Add your domain (e.g., `chakana.com`)
   - Configure DNS records as shown

**Auto-Deploy:**
Connect GitHub repository to Vercel for automatic deployments on push to `main` branch.

---

### Option 2: Netlify

**Steps:**

1. **Install Netlify CLI:**
   ```bash
   npm i -g netlify-cli
   ```

2. **Login:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

4. **Configure:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Add environment variables in Netlify Dashboard

---

### Option 3: GitHub Pages

**Steps:**

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deploy script to `package.json`:**
   ```json
   {
     "scripts": {
       "deploy": "vite build && gh-pages -d dist"
     }
   }
   ```

3. **Configure base URL in `vite.config.ts`:**
   ```typescript
   export default defineConfig({
     base: '/chakana-portal/',
   })
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages:**
   - Go to Repository → Settings → Pages
   - Source: `gh-pages` branch

**Note:** GitHub Pages doesn't support server-side features. Supabase sync will still work (client-side).

---

### Option 4: Self-Hosted (VPS)

**Requirements:**
- Ubuntu 22.04+ or similar
- Node.js 18+
- Nginx or Apache
- SSL certificate (Let's Encrypt)

**Steps:**

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Upload `dist/` folder to server:**
   ```bash
   scp -r dist/ user@your-server:/var/www/chakana
   ```

3. **Configure Nginx:**
   ```nginx
   server {
     listen 80;
     server_name chakana.com;

     root /var/www/chakana;
     index index.html;

     location / {
       try_files $uri $uri/ /index.html;
     }

     # Enable gzip
     gzip on;
     gzip_types text/css application/javascript application/json;

     # Cache static assets
     location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
     }
   }
   ```

4. **Enable HTTPS (Let's Encrypt):**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d chakana.com
   ```

---

## 🔒 Security Hardening

### 1. Content Security Policy (CSP)

Add to `index.html` or server headers:

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self' 'unsafe-inline';
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;
               connect-src 'self' https://*.supabase.co;">
```

### 2. Environment Variables Protection

**CRITICAL:** Never commit `.env` to Git!

```bash
# Verify .env is in .gitignore
grep .env .gitignore

# If not, add it:
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore
```

### 3. API Key Rotation

Rotate Supabase keys periodically:
1. Generate new key in Supabase Dashboard
2. Update environment variables in deployment platform
3. Redeploy
4. Revoke old key after 24h

---

## 📊 Monitoring & Analytics

### 1. Error Tracking (Recommended: Sentry)

```bash
npm install @sentry/react @sentry/vite-plugin
```

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,
})
```

### 2. Performance Monitoring

Use Vercel Analytics (auto-enabled) or Google Lighthouse:

```bash
npx lighthouse https://chakana.com --view
```

**Target Scores:**
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 90

### 3. Uptime Monitoring

Use free services like:
- UptimeRobot (https://uptimerobot.com)
- Pingdom (https://pingdom.com)
- StatusCake (https://statuscake.com)

Configure alerts for:
- Site down (HTTP 5xx)
- Slow response (> 2s)
- SSL certificate expiry

---

## 🔄 Rollback Strategy

### Vercel

```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback <deployment-url>
```

### Netlify

```bash
# List deployments
netlify deploy --list

# Rollback to previous
netlify deploy --alias rollback
```

### Manual (Self-Hosted)

```bash
# Backup current
cp -r dist dist.backup

# Restore previous
cp -r dist.previous dist

# Restart server
sudo systemctl restart nginx
```

---

## 📦 Post-Deployment Checklist

### Immediate (within 1 hour)

- [ ] Verify site loads on production URL
- [ ] Test quote rotation
- [ ] Test save reflection (with notes/tags)
- [ ] Test PDF export
- [ ] Test social sharing (WhatsApp, native)
- [ ] Verify Supabase sync (if enabled)
- [ ] Check browser console for errors
- [ ] Test on mobile device

### Within 24 Hours

- [ ] Monitor error rates (Sentry)
- [ ] Check performance metrics (Lighthouse)
- [ ] Verify SSL certificate valid
- [ ] Test from different geographic locations
- [ ] Confirm uptime monitoring active

### Within 1 Week

- [ ] Gather user feedback
- [ ] Review analytics (if enabled)
- [ ] Identify performance bottlenecks
- [ ] Plan iteration priorities

---

## 🆘 Emergency Contacts

**Critical Issues:**
- **Platform Outage:** Check status pages
  - Vercel: https://vercel-status.com
  - Netlify: https://netlifystatus.com
  - Supabase: https://status.supabase.com

**Rollback Decision Tree:**
1. Bug affects < 10% users → Hot fix → Deploy
2. Bug affects 10-50% users → Rollback → Fix → Deploy
3. Bug affects > 50% users → Immediate rollback → Investigate

---

## 📞 Support Channels

- **Technical Issues:** GitHub Issues
- **Deployment Help:** Vercel/Netlify Support
- **Database Issues:** Supabase Support

---

## 🎉 Launch Announcement Template

```markdown
🚀 Excited to announce the launch of Chakana Wisdom Engine!

✨ Features:
- 100+ bilingual wisdom quotes
- Personal reflection journaling
- Cross-device sync
- Analytics dashboard
- PDF export & social sharing

🔗 Try it now: https://chakana.com

Built with React, TypeScript, Supabase, and ❤️
```

---

**Ready to launch! 🚀**

Last review: [  ] Code [  ] Tests [  ] Docs [  ] Deploy

Deployment by: ________________
Date: ________________
