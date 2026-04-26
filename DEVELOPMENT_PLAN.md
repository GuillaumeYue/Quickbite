# Development Plan

Deadline: May 2, 2026 (Sat)
Today: Apr 25, 2026 (Sat)

## Progress

- [x] Day 1 - Apr 20 (Mon) - Skeleton
- [x] Day 2 - Apr 21 (Tue) - MongoDB + User model
- [x] Day 3 - Apr 23 (Thu) - Auth (signup, login, middleware)
- [x] Day 4 - Apr 24 (Fri) - Menu items CRUD
- [x] Day 5 - Apr 25 (Sat) - Orders CRUD
- [ ] Day 6 - Apr 26 (Sun) - Socket.IO + deploy backend (doing today, pulled forward)
- [ ] Day 7 - Apr 27 (Sun) - Frontend foundation + Login + Register
- [ ] Day 8 - Apr 28 (Mon) - Landing + Menu page + item detail
- [ ] Day 9 - Apr 29 (Tue) - Cart + place order + my orders + WebSocket
- [ ] Day 10 - Apr 30 (Wed) - Staff dashboard + menu management + deploy frontend
- [ ] Day 11 - May 1 (Fri) - Buffer / E2E test
- [ ] Day 12 - May 2 (Sat) - Demo video + submit

## Design Decisions

### Reference
Customer pages follow the Lilies Food Place Figma design.
Staff order management functionality follows a separate food admin reference.
Both share the same visual language (colors, font, card style, sidebar layout).

### Currency
CAD Canadian Dollar, format: $10.50 / $1,000.00

### Color tokens
- Primary dark green: #0B3B36 (buttons, headings, sidebar text)
- Warm peach accent: #FAB57E
- Cream accent: #F5D6A8 (used on Sign Up button text)
- Success green: #1FC16B (Add to cart text, Delivered status)
- Danger red: #F23030 (Remove text, Cooking/Cancelled status)
- Sidebar background: #FBF7F1 (off-white cream)
- Card background: #FFFFFF
- Body text: #0B0D17
- Gray scale: #F4F5F7 / #EEEFF4 / #D9DBE1

### Typography
Inter font from Google Fonts.
- Body: 14px / 400
- Subtitle: 18px / 500
- Heading: larger sizes 24-48 / 600

### Layout pattern
Customer Dashboard uses left fixed sidebar plus right content area plus right slide-out drawer for detail/cart/confirm/orders. So routing is simple, drawers are state-driven not separate routes.

Food images are circular (border-radius 50 percent).

Cards have white background, subtle shadow, rounded corners.

## Page List (frontend)

Public pages:
1. Landing /
2. Login /login
3. Register /register

Customer pages (after login as customer):
4. Menu dashboard /menu
5. Item detail (slide-out drawer over menu)
6. Cart (slide-out drawer)
7. Confirm order (slide-out, replaces payment, asks for table number and note)
8. My orders (slide-out drawer, status colored)

Staff pages (after login as staff or admin):
9. Order wall /staff (3-column grid of order cards with action buttons by status)
10. Order history /staff/history (completed and cancelled archive)
11. Menu management /staff/menu (CRUD for menu items, same card style plus edit/delete)
12. Statistics /staff/stats (today order count and revenue)

Misc:
13. 404 / Not Found

## Status Mapping

Internal order status -> what staff sees -> what customer sees

| Status | Staff buttons | Customer label color |
|---|---|---|
| pending | X Reject + check Accept | Pending (orange) |
| preparing | Mark as Ready | Cooking (red) |
| ready | Mark as Completed | Ready for pickup (blue) |
| completed | check COMPLETED badge | Delivered (green) |
| cancelled | X CANCELLED badge | Cancelled (gray) |

## Day 3 - Apr 23 (Thu) - Auth (DONE)

- bcryptjs and jsonwebtoken installed
- User model with pre-save bcrypt hook
- POST /api/auth/signup (returns JWT)
- POST /api/auth/login (returns JWT)
- protect middleware (verify JWT)
- requireRole middleware
- GET /api/auth/me

## Day 4 - Apr 24 (Fri) - Menu items CRUD (DONE)

- MenuItem model: name, description, price, category, imageUrl, available
- Controller: list, get, create, update, delete
- Routes: reads public, writes admin/staff, delete admin only

## Day 5 - Apr 25 (Sat) - Orders CRUD (DONE)

- Order model with embedded order items, status enum, table number, note
- Customer creates and cancels own pending orders
- Staff/admin updates status
- All routes protected, role checks done

## Day 6 - Apr 26 (Sun) - Socket.IO + deploy backend (pulled forward to today)

- Install socket.io
- Wrap express app in http.createServer for socket support
- JWT auth on socket handshake (read token from auth field)
- Customer joins room user:userId
- Staff/admin joins room staff
- Emit order:new to staff room when order created
- Emit order:status to staff room and to user:customerId when status changes (also for cancel)
- Add engines field for Render
- Make CORS origin configurable via CLIENT_ORIGIN env var
- Push to GitHub
- Connect repo to Render and deploy as Web Service

## Day 7 - Apr 27 (Sun) - Frontend foundation + Login + Register

- Install react-router-dom, axios, socket.io-client, lucide-react
- Set up Inter font in index.css
- Define color tokens as CSS variables
- api/client.js (axios with token interceptor)
- AuthContext (user state, login, signup, logout)
- BrowserRouter and route map
- Login page (split layout, food photo on left)
- Register page (split layout)
- Logout

## Day 8 - Apr 28 (Mon) - Landing + Menu page + item detail

- Landing page (dark green hero, three featured dishes, newsletter CTA, footer)
- Customer Sidebar component (Lilies style)
- Menu page (4-column grid of food cards)
- Item detail drawer (slide from right, qty +/-, Add to cart)
- Cart state (React context or simple useState)

## Day 9 - Apr 29 (Tue) - Cart + place order + my orders + WebSocket

- Cart drawer (table view: item / qty / unit price / sub-total + total + Confirm Order)
- Confirm order drawer (table number + note + Confirm button -> POST /api/orders)
- My orders drawer (status colored)
- Wire up socket.io-client on customer side
- Subscribe to order:status for live status updates

## Day 10 - Apr 30 (Wed) - Staff dashboard + menu management + deploy frontend

- Staff Sidebar (Home / Order History / Menu Management / Statistics / Logout)
- Order wall page (status filter chips, 3-column order cards)
- Action buttons per status (Accept/Reject/Mark Ready/Mark Completed)
- Subscribe to order:new and order:status (live updates)
- Order History page (filter for completed and cancelled)
- Menu management page (cards with Edit/Delete + Add New Item modal)
- Build and deploy frontend as Static Site on Render
- Update CLIENT_ORIGIN env var on backend service

## Day 11 - May 1 (Fri) - Buffer / E2E test

- Full end-to-end test on deployed site
- Sign up two accounts (customer + staff)
- Customer places order, staff sees it live, staff updates status, customer sees update
- Fix any production bugs (CORS, env var, socket connection, mongo URI)
- Polish styling

## Day 12 - May 2 (Sat) - Video + submit

- Record demo video under 5 min:
  - signup and login flow
  - admin adds menu item (live for customer)
  - customer places order (staff receives in real time)
  - staff advances status (customer sees live update)
  - delete a menu item
- Update README with deployed URL and video link
- Final commit and push
- Submit
