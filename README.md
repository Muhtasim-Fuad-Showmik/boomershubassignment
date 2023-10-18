This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the `npm install` command from a terminal in your root directory.

```bash
npm install
```

This will install all package dependencies that you will need for running the application.

Second, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Environment variables

To have the app running properly on your local machine you will need to create a `.env.local` file in your root directory and assign proper parameters for the following variables as shown in the example below.

```env
NEXT_PUBLIC_URL=http://localhost:3000
MYSQL_HOST=<Database Host Address>
MYSQL_DATABASE=<Name of Database>
MYSQL_USER=<Database User Name>
MYSQL_PASSWORD=<Database User Password>
```
