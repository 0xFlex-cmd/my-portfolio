# Personal Portfolio Admin - TODO

## Database & Schema
- [x] Add blog posts table to schema
- [x] Add Homelab projects table to schema
- [x] Generate and apply SQL migrations

## Backend (tRPC & Database)
- [x] Add query helpers for blog posts in server/db.ts
- [x] Add query helpers for Homelab projects in server/db.ts
- [x] Create blog router with CRUD procedures (protected by admin)
- [x] Create Homelab router with CRUD procedures (protected by admin)
- [x] Add vitest tests for blog procedures
- [x] Add vitest tests for Homelab procedures

## Admin Dashboard Pages
- [x] Create Admin Dashboard layout with DashboardLayout
- [x] Build Blog Management page (list view with CRUD actions)
- [x] Build Add/Edit Blog Post page with markdown editor
- [x] Build Homelab Management page (list view with CRUD actions)
- [x] Build Add/Edit Homelab Project page
- [x] Add admin-only route protection

## Public Pages
- [x] Update Home.tsx to display latest blog posts
- [x] Update Home.tsx to display Homelab projects
- [x] Create single blog post detail page with markdown rendering
- [x] Create single Homelab project detail page
- [x] Add navigation links to blog and Homelab sections

## Routing & Navigation
- [x] Update App.tsx with new routes
- [x] Add admin route protection middleware
- [x] Update DashboardLayout navigation items

## Testing & Verification
- [x] Test blog CRUD operations
- [x] Test Homelab CRUD operations
- [x] Test admin-only access restrictions
- [x] Test markdown rendering on blog posts
- [x] Verify all pages load correctly
- [x] Test responsive design

## Deployment
- [ ] Create checkpoint
- [ ] Verify all features working in production
