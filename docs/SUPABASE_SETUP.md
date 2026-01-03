# 🔄 Supabase Sync Setup Guide

**Chakana Portal - Cross-Device Reflection Synchronization**

This guide will help you set up Supabase to sync saved reflections across all user devices.

---

## 📋 Prerequisites

- A free [Supabase](https://supabase.com) account
- Node.js 18+ installed
- This repository cloned locally

---

## 🚀 Quick Start (5 minutes)

### Step 1: Create Supabase Project

1. Go to https://app.supabase.com
2. Click **"New Project"**
3. Fill in:
   - **Name:** `chakana-portal` (or your choice)
   - **Database Password:** (generate a strong one)
   - **Region:** Choose closest to your users
4. Click **"Create new project"**
5. ⏱️ Wait ~2 minutes for provisioning

### Step 2: Run Database Migration

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy the entire contents of `supabase-migration.sql` from this repo
4. Paste into the SQL editor
5. Click **"Run"** ▶️
6. ✅ You should see "Success. No rows returned"

### Step 3: Get API Credentials

1. In Supabase, go to **Settings → API** (left sidebar)
2. Find these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with: `eyJhbG...`)

### Step 4: Configure Environment Variables

1. In your project root, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and fill in your values:
   ```env
   VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Save the file

### Step 5: Restart Development Server

```bash
npm run dev
```

---

## ✅ Verify It's Working

1. Open your app in the browser
2. Save a reflection (heart icon on any quote)
3. Open Supabase → **Table Editor** → `reflections`
4. You should see your reflection appear! 🎉

---

## 🔐 Security Features

The migration includes **Row Level Security (RLS)** policies:

- ✅ Users can only see their own reflections
- ✅ Anonymous users get device-specific IDs (`anon_*`)
- ✅ Authenticated users (future) get proper user IDs
- ✅ All queries are automatically scoped to `user_id`

---

## 🛠️ How Sync Works

### Auto-Sync (Background)

Reflections automatically sync to Supabase when you:
- **Save** a new reflection → Pushes to cloud
- **Update** a reflection (note/tags) → Pushes to cloud
- **Delete** a reflection → Deletes from cloud

### Manual Sync (Future)

In a future update, users will have a **"Sync Now"** button to:
1. Pull latest reflections from cloud
2. Merge with local using last-write-wins
3. Push merged result back to cloud

---

## 🌍 Cross-Device Sync

### How It Works

1. **Device A:** User saves a reflection
   - Stored in local IndexedDB (Zustand persist)
   - Auto-pushed to Supabase in background

2. **Device B:** User opens the app
   - Calls `syncReflections()` on mount
   - Pulls from Supabase, merges with local
   - User sees all their reflections! ✨

### Conflict Resolution

- **Strategy:** Last-write-wins
- **Key:** `updatedAt` timestamp
- **Logic:** If remote `updatedAt > local updatedAt`, use remote

---

## 📊 Database Schema

```sql
public.reflections
├── id              TEXT (PK)
├── user_id         TEXT (indexed)
├── quote_id        TEXT (indexed)
├── quote_data      JSONB
├── user_note       TEXT (nullable)
├── tags            TEXT[] (GIN indexed)
├── saved_at        TIMESTAMPTZ
├── updated_at      TIMESTAMPTZ (auto-updated)
└── created_at      TIMESTAMPTZ
```

**Indexes for Performance:**
- `user_id` → Fast user queries
- `quote_id` → Duplicate detection
- `updated_at DESC` → Sync operations
- `tags` (GIN) → Tag searches

---

## 🧪 Testing Sync

### Test Cross-Device Sync

1. **Device A (Chrome):**
   - Save reflection "Foo"
   - Wait 2 seconds for auto-sync

2. **Device B (Firefox Private):**
   - Open app (same anonymous ID won't work)
   - Manually call sync in console:
     ```js
     useWisdomStore.getState().syncReflections()
     ```

3. ✅ Reflection "Foo" should appear on Device B

### Test Conflict Resolution

1. **Device A:** Save reflection with note "Version A"
2. **Go offline** (Network tab → Offline)
3. **Device A:** Edit note to "Version A2"
4. **Device B:** Edit same note to "Version B2"
5. **Go online** (both devices)
6. The **last edit wins** based on `updatedAt`

---

## 🐛 Troubleshooting

### "Supabase not configured" error

- ✅ Check `.env` file exists
- ✅ Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- ✅ Restart dev server (`npm run dev`)

### Reflections not syncing

- ✅ Check browser console for errors
- ✅ Open Supabase → Logs → check for API errors
- ✅ Verify RLS policies are enabled (`Table Editor → ... → Edit Table`)

### "row-level security policy violation"

- ✅ Make sure you ran the full migration (not just CREATE TABLE)
- ✅ Check policies exist: `SELECT * FROM pg_policies WHERE tablename = 'reflections'`

---

## 🔮 Future Enhancements

- [ ] **Authentication:** Replace anonymous IDs with Supabase Auth
- [ ] **Realtime:** Live sync using Supabase Realtime
- [ ] **Offline Queue:** Queue writes when offline, sync when back online
- [ ] **Conflict UI:** Show conflicts to user, let them choose
- [ ] **Sync Button:** Manual sync UI in Settings
- [ ] **Sync Status:** Visual indicator (syncing, synced, error)

---

## 📖 References

- [Supabase Docs](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Zustand Persist](https://github.com/pmndrs/zustand#persist-middleware)

---

## 🤝 Need Help?

- **Supabase Discord:** https://discord.supabase.com
- **Project Issues:** [GitHub Issues](../../issues)

---

**Happy syncing! 🔄✨**
