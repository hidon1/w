# Wine Monitoring System - Simplified Version

## Overview

This is a simplified, offline-first wine production tracking system. All data is stored locally in the browser using localStorage and IndexedDB.

## Features

- **6 Production Stages Tracking**: Harvest, Crushing, Alcoholic Fermentation, Malolactic Fermentation, Aging, Bottling Prep
- **Wine Details Management** - Track wine name, vintage, grape variety, harvest date, and notes
- **Multi-Project Support** - Create and manage multiple wine production projects
- **Finance Tracking** - Income and expense tracking with balance reporting
- **Reminders System** - Date/time-based reminders with browser notifications
- **Data Visualization** - Graphs and charts for metric trends
- **Dark Mode** - Toggle between light and dark themes
- **Offline-First** - All data stored locally, no internet connection required

## Simple Access Management

### Authentication
- **Email/Password** - Create account and login with email/password
- **Local Storage** - All user data stored in browser

### Access Control
- **Share Access** - Grant other users access to your projects by email
- **Two Permission Levels**: View Only or Edit
- **Finance Access Control** - Separate toggle for financial data
- **Project-Specific Access** - Grant access to specific projects or all

## Data Storage

- **localStorage** - Projects, settings, user accounts, access control
- **IndexedDB** - Reminders metadata
- **No Cloud Sync** - All data stays on your device

## Installation

1. Open `index.html` in a web browser
2. Create an account or skip login
3. Start tracking your wine production!

## Version

**2.0** - Simplified, Firebase-Free Version
- Removed all Firebase dependencies
- Simple localStorage-based authentication
- Simplified access management
- Offline-first architecture
