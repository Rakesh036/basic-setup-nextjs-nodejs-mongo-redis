#!/bin/bash

echo "🛠 Creating folders..."

# Client folders
mkdir -p client/src/{components,hooks,lib}
touch client/src/components/.gitkeep
touch client/src/hooks/.gitkeep
touch client/src/lib/.gitkeep

# Server folders
mkdir -p server/{config,controllers,middlewares,models,routes,services,utils}
touch server/config/.gitkeep
touch server/controllers/.gitkeep
touch server/middlewares/.gitkeep
touch server/models/.gitkeep
touch server/routes/.gitkeep
touch server/services/.gitkeep
touch server/utils/.gitkeep

echo "📄 Creating environment files..."

cat <<EOF > client/.env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
EOF

cat <<EOF > server/.env
PORT=5000
MONGO_URI=mongodb://localhost:27017/auth-db
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
EOF

echo "🎨 Creating Tailwind and PostCSS config..."

cat <<EOF > client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
EOF

cat <<EOF > client/postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
EOF

echo "✅ Creating ESLint and Prettier config..."

cat <<EOF > client/.eslintrc.json
{
  "extends": ["next", "next/core-web-vitals", "eslint:recommended"],
  "rules": {
    "semi": ["error", "always"],
    "quotes": ["error", "single"]
  }
}
EOF

cat <<EOF > client/.prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
EOF

echo "📝 Creating README.md..."

cat <<EOF > README.md
# Basic Auth Fullstack App

A fullstack authentication project using:

- **Frontend:** Next.js 15, Tailwind CSS, React 19
- **Backend:** Node.js, Express, MongoDB, Redis
- **Dev Tools:** ESLint, Prettier, Docker

## Features

- Signup, Login, Logout, Forgot Password
- JWT or Session-based auth
- Protected routes
- Uses cookies or JWT tokens
- Docker support

## Folder Structure

- \`client/\` - Next.js frontend
- \`server/\` - Express backend

## Getting Started

### Client
\`\`\`bash
cd client
npm install
npm run dev
\`\`\`

### Server
\`\`\`bash
cd server
npm install
npm run dev
\`\`\`

## Author

Rakesh Kumar
EOF

echo "✅ Setup complete! Your fullstack auth project is now structured and ready to go."
