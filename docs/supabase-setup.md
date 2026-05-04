# Supabase Setup Guide

This guide is for setting up the app database with no database experience.

## What This Does

The app needs Supabase tables before it can save fonts across browsers.

After this setup:

- New fonts save to Supabase.
- Edited font characters save to Supabase.
- Your data follows your signed-in account.
- Browser changes and app rebuilds should not delete your fonts.

## Step 1: Open SQL Editor

In Supabase:

1. Open the `Alphabet Stitch Craft` project.
2. Look at the left icon sidebar.
3. Click **SQL Editor**.
   - The icon usually looks like a small terminal or document with `SQL`.
4. Click **New query**.

## Step 2: Paste The Setup SQL

Codex can place the setup SQL on your clipboard.

Once it is on your clipboard:

1. Click inside the SQL editor text area.
2. Paste.
3. Do not edit the SQL.

## Step 3: Run The SQL

1. Click **Run**.
2. Wait for Supabase to finish.
3. If it succeeds, you should see a success message.

## Step 4: Test The App

1. Return to `http://127.0.0.1:3001/custom-fonts`.
2. Sign in from the Font Sync panel.
3. Create a new font.
4. Refresh the page.
5. The font should still be available after signing in.

## If Something Goes Wrong

If Supabase shows an error:

1. Do not change the SQL.
2. Take a screenshot of the error.
3. Send the screenshot to Codex.

## Important Safety Notes

- Never share the `service_role` key.
- Never share the database password.
- The publishable key is okay for the browser app.
- Row-level security keeps each user's private font data separate.
