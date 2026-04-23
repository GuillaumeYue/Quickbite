# Development Plan

Deadline: May 2, 2026 (Sat)
Today: Apr 23, 2026 (Thu)

## Progress

- [x] Day 1 - Apr 20 (Mon) - Skeleton
- [x] Day 2 - Apr 21 (Tue) - MongoDB + User model

## Day 3 - Apr 23 (Thu) - Auth (signup, login, middleware)

- Install bcryptjs and jsonwebtoken
- Hash passwords in User model (pre-save hook)
- POST /api/auth/signup (returns JWT)
- POST /api/auth/login (returns JWT)
- protect middleware (verify JWT)
- requireRole middleware
- GET /api/auth/me
- Test all routes in Postman

## Day 4 - Apr 24 (Fri) - Menu items (CRUD 1)

- MenuItem model (name, description, price, category, imageUrl, available)
- Controller: list, get, create, update, delete
- Routes: reads public, writes admin only
- Seed a few items manually via Postman

## Day 5 - Apr 25 (Sat) - Orders (CRUD 2)

- Order model (customer, items, totalPrice, status, tableNumber, notes)
- Customer can create and cancel own pending orders
- Staff/admin can update status
- All routes protected

## Day 6 - Apr 26 (Sun) - Socket.IO + deploy backend

- Install socket.io
- socket/index.js with kitchen and user rooms
- Emit order:new when order created
- Emit order:status-changed when status updated
- Push to GitHub
- Deploy backend as Web Service on Render

## Day 7 - Apr 27 (Mon) - Frontend foundation + Login/Signup

- Install react-router-dom, axios, socket.io-client
- Install and configure tailwindcss
- api/axios.js (attach JWT header)
- socket/index.js (client side)
- AuthContext (user state, login/signup/logout)
- Login page
- Signup page
- Simple navbar

## Day 8 - Apr 28 (Tue) - Menu + Cart pages

- Menu page fetches /api/menu
- Category filtering
- Add to cart button
- Cart page with localStorage
- Place order submits to /api/orders

## Day 9 - Apr 29 (Wed) - Order tracking + Kitchen (WebSocket)

- OrderTracking page lists user orders
- Subscribe to order:status-changed (customer)
- KitchenDashboard page for staff
- Subscribe to order:new and order:status-changed
- Buttons to advance order status

## Day 10 - Apr 30 (Thu) - Admin + deploy frontend

- AdminMenu page with full CRUD form
- Role-based protected routes
- npm run build, fix any errors
- Deploy static site on Render
- Update CLIENT_ORIGIN on backend
- Add rewrite rule for React Router

## Day 11 - May 1 (Fri) - Buffer / polish / E2E test

- Buffer day for anything that broke
- Full end-to-end test on deployed site
- Fix CORS, env var, and routing issues
- Polish UI if time allows

## Day 12 - May 2 (Sat) - Video + submit

- Record demo video (under 5 min):
  - signup/login flow
  - admin adds menu item (shows up live for customers)
  - customer places order (kitchen receives in real time)
  - kitchen advances status (customer sees it update)
  - delete a menu item
- Update README with deployed URL and video link
- Final commit and push
- Submit
