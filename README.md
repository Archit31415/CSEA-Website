# CSEA Website Developer Guide

A concise guide to run, manage, and modify the CSEA website repository.

---

## 1. Project Structure
- `/src`: Frontend React source code.
- `/backend`: Node.js Express server source code.
- `/backend/models`: MongoDB schemas (User, Event, Team, InternExp).
- `/src/components/games`: Arcade games frontend logic.

---

## 2. Installation & Running Locally

### Backend Server
1. Navigate to `/backend`.
2. Create a `.env` file in the `/backend` directory and add your SMTP credentials for OTP mail delivery:
   ```env
   SMTP_USER=your_email@iitg.ac.in
   SMTP_PASS=your_email_app_password
   SMTP_HOST=smtp.iitg.ac.in
   SMTP_PORT=587
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the backend:
   ```bash
   npm start
   ```
   *Note: Runs on `http://localhost:3000`.*

### Frontend React App
1. Navigate to the root directory `/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the frontend:
   ```bash
   npm start
   ```
   *Note: Runs on `http://localhost:3001`.*

---

## 3. Database Management with MongoDB Compass

The application connects to a cloud MongoDB Atlas cluster. Follow these steps to view and manage user scores, events, and other site data:

1. Download and open **MongoDB Compass**.
2. Connect using the following URI:
   ```text
   mongodb+srv://actedcone:dualipa@atlascluster.t9cnxbb.mongodb.net/
   ```
3. Database Name: Look for the active database (usually matches the connection context, e.g. Mongoose default database).
4. **Key Collections & schemas**:
   - **`users`**:
     - `email`: User login email.
     - `name`: User display name.
     - `scores`: Object holding high scores (`math`, `dino`, `marketmaker`).
   - **`events`**: Calendar events.
   - **`teams`**: Student committee profiles.
   - **`internexps`**: Intern experience records.
5. **Editing / Deleting Data**: Use the Compass GUI to edit values, insert documents, or delete records. Changes apply in real time to the website leaderboard/views.

---

## 4. Modifying Website Data

### Games Configuration
- Arcade games frontend source is located in `src/components/games`.
- Offline game logic fallbacks are implemented in each component (`ChromeDino.jsx`, `MarketMaker.jsx`, `TwentyInTwo.jsx`) so they run standalone if the backend server is offline.

### Contact Forms
- Form submissions in `src/components/contact.jsx` utilize **EmailJS**. To receive emails to a real inbox:
  1. Set up an account on [EmailJS](https://www.emailjs.com/) and link your Outlook (or personal) email.
  2. Replace `"YOUR_SERVICE_ID"`, `"YOUR_TEMPLATE_ID"`, and `"YOUR_USER_ID"` placeholders in `contact.jsx` with your active EmailJS keys.

---

## 5. Build & Deployment
Build the production bundle of the React app:
```bash
npm run build
```
This repository is configured to deploy to GitHub Pages at: `https://redluigi1.github.io/cseatemp/`
