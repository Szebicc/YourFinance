# YourFinance

Personal finance tracker built with Next.js, TypeScript, MongoDB, and Clerk.

## Quick start

### Prerequisites

Ensure the following are installed on your system:

[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=white)](https://www.npmjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?logo=clerk&logoColor=white)](https://clerk.com/)

### Verify installations

```bash
node -v
npm -v
```

### Environment setup

Create `client/.env.local` and add:

- `MONGODB_URI` – MongoDB connection string (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/`)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` – from [Clerk Dashboard](https://dashboard.clerk.com)
- `CLERK_SECRET_KEY` – from Clerk Dashboard

### Start the application

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production build

```bash
cd client
npm run build
npm start
```

### Troubleshooting

- **NPM errors**: Run `npm install` in the `client` folder.
- **MongoDB connection errors**: Check `MONGODB_URI` in `.env.local`. For Atlas, ensure your IP is allowed under Network Access.
- **`querySrv ENOTFOUND`**: DNS can't resolve your Atlas host. Try disabling VPN, switching networks, or using public DNS (e.g. 1.1.1.1).
- **Clerk/auth errors**: Verify publishable and secret keys, and that your app URL is configured in the Clerk dashboard.
