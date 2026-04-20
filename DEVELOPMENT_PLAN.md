# Development Plan

Deadline: May 2, 2026.

## Day 1 - Apr 20 (Mon) - Skeleton

- Setup project folders
- Backend: basic Express server returns JSON
- Frontend: Vite + React renders a page
- Run both locally to confirm they work

## Day 2 - Apr 21 (Tue) - MongoDB + User model

- Sign up for MongoDB Atlas, get connection string
- Install mongoose in backend
- Create User schema (email, password, name, role)
- Connect to DB on server start

## Day 3 - Apr 22 (Wed) - Auth signup & login

- Install bcryptjs and jsonwebtoken
- Hash passwords with bcrypt
- POST /api/auth/signup returns JWT
- POST /api/auth/login returns JWT

## Day 4 - Apr 23 (Thu) - Auth middleware

- Write protect middleware (verify JWT)
- Write requireRole middleware
- GET /api/auth/me returns current user
- Test in Postman

## Day 5 - Apr 24 (Fri) - Menu items (CRUD 1)

- MenuItem model (name, price, category, available)
- Controller with list, get, create, update, delete
- Routes: reads public, writes admin-only

## Day 6 - Apr 25 (Sat) - Orders (CRUD 2)

- Order model (customer, items, total, status, table)
- Customer can create and cancel
- Staff can update status
- Routes all protected

## Day 7 - Apr 26 (Sun) - Socket.IO

- Install socket.io
- Emit order:new when order created
- Emit order:status-changed when status updated
- Push to GitHub and deploy backend to Render

## Day 8 - Apr 27 (Mon) - Frontend base

- Install react-router-dom, axios, socket.io-client
- Setup routing in App.jsx
- Create axios instance with JWT header
- Create AuthContext

## Day 9 - Apr 28 (Tue) - Login / Signup / Menu pages

- Login page
- Signup page
- Menu page fetches from /api/menu
- Simple navbar

## Day 10 - Apr 29 (Wed) - Cart + Order tracking

- Cart page with localStorage
- Place order submits to /api/orders
- Order tracking page listens for order:status-changed

## Day 11 - Apr 30 (Thu) - Kitchen + Admin

- Kitchen dashboard subscribes to order:new
- Buttons to advance order status
- Admin menu management page (CRUD form)

## Day 12 - May 1 (Fri) - Deploy frontend

- Run npm run build, fix errors
- Deploy static site on Render
- Update CLIENT_ORIGIN on backend
- Test end-to-end on deployed URL

## Day 13 - May 2 (Sat) - Video + submit

- Record demo video showing all features
- Polish README with deployed URL
- Final commit
- Submit
