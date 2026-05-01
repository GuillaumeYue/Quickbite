# QuickBite Project Summary

## Project Overview

QuickBite is an online ordering system for small restaurants. It exposes two surfaces from a single codebase: a customer side for browsing the menu, building a cart, placing orders and tracking the live status, and a staff side for managing the order queue and the menu itself. The two sides talk to each other through WebSocket events, so order status changes flow from the kitchen to the customer in real time without any page refresh.

The whole project went from the first commit on April 20 to a fully deployed system on May 2, around 12 days of work, kept intentionally as small, focused commits.

## Tech Stack

**Backend**: Node.js, Express, MongoDB Atlas via Mongoose, Socket.IO for real-time events, JSON Web Tokens with bcryptjs for authentication.

**Frontend**: React 18 with Vite, React Router for client-side routing, Axios for the REST layer, Socket.IO Client for live updates. The styling is hand-written CSS with a small set of design tokens and the Inter font, no UI framework.

**Deployment**: Render Web Service for the backend, Render Static Site for the frontend, MongoDB Atlas for the database.

## Challenges and How They Were Solved

**Authenticating the WebSocket connection**: Socket.IO does not ship with an opinionated auth model. Verifying a token on every emitted event would have made the controllers noisy. The chosen approach was to verify the JWT once during the socket handshake, then have each user join named rooms (`user:<id>` for customers, `staff` for staff and admin). After that, broadcasting to a room is enough to enforce the access boundary.

**SPA routing returned 404 in production**: Everything worked locally, but on the deployed Static Site, opening `/menu` directly or refreshing any page returned Not Found. The cause was that Render was looking for a literal file at that path. The fix was a single rewrite rule in the Render dashboard, sending every unmatched path to `index.html` so React Router could take over on the client.

**A chain of three deploy bugs that combined into one symptom**: After the first deploy, the login request just hung. Network inspection plus the Render logs revealed three separate problems stacked together: (1) Render appended a four-character random suffix to the free-tier service URLs, so the `VITE_API_URL` configured on the frontend pointed at a domain that did not exist; (2) the backend `CLIENT_ORIGIN` had not been updated from the placeholder, so CORS rejected the actual frontend origin; (3) the MongoDB connection string was missing the `/quickbite` database name and was silently connecting to the default `test` database where the seeded admin did not exist. None of these were complex on their own, but stacked they were confusing. The takeaway was a debugging order: read the Network panel for the request URL and status code first, then read the backend logs, then sanity check the env vars.

**Vite environment variables only inject at build time**: Updating `VITE_API_URL` on Render required a Clear build cache & deploy, not a normal redeploy, because the value is baked into the bundle during the build step.

## Future Features and Optimizations

**Product features**

- **Payments**: integrate Stripe Checkout so the order flow ends with a real payment
- **Image upload**: today menu images either ship with the build or live on a third-party host like Imgur, ideally staff would upload directly through Cloudinary or AWS S3 from the admin form
- **Customer side**: favorites list, one-tap reorder from history, search and filter on the orders page
- **Staff dashboard**: daily revenue, top selling items and order volume charts using Recharts
- **Notifications**: email or SMS to the customer when status changes
- **Internationalization**: i18n switch between English and Chinese

**Engineering improvements**

- **Tests**: Jest unit tests for the controllers and Playwright end to end tests for the order flow
- **CI/CD**: GitHub Actions to run the test suite on every pull request and trigger the Render deploy
- **PWA**: web manifest and service worker so customers can install the app on a phone home screen
- **Performance**: lazy load menu images and split the bundle to shrink first paint
- **Observability**: Sentry for frontend errors, plus the Render metrics and log stream for backend health
