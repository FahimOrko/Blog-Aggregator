# Blog Aggregator

A TypeScript-based RSS feed aggregator that fetches, parses, and manages blog content from multiple sources into a centralized PostgreSQL database.

## Overview

Blog Aggregator is a command-line application designed to collect and organize RSS feeds from various blogs. It parses XML feeds, stores them in a PostgreSQL database, and provides a unified interface for managing multiple blog subscriptions.

## Features

- 📰 **RSS Feed Parsing** - Automatically fetches and parses RSS feeds from multiple sources
- 💾 **Database Management** - Stores blog data in PostgreSQL using Drizzle ORM
- 🔄 **Feed Aggregation** - Centralizes content from multiple blogs into one place
- ⚡ **TypeScript** - Fully typed codebase for better development experience
- 🛠️ **Database Migrations** - Built-in migration system using Drizzle Kit

## Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **XML Parser**: fast-xml-parser
- **Build Tools**: TSC, tsx

## Prerequisites

- Node.js (v18 or higher recommended)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/FahimOrko/Blog-Aggregator.git
cd Blog-Aggregator
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables (create a `.env` file):
```
DATABASE_URL=postgres://user:password@localhost:5432/blog_aggregator
```

## Usage

### Development

Run the application in development mode with TypeScript compilation:
```bash
npm run start
```

### Building

Compile TypeScript to JavaScript:
```bash
npm run build
```

### Production

Run the compiled application:
```bash
npm run dev
```

### Database

Generate migrations:
```bash
npm run generate
```

Run migrations:
```bash
npm run migrate
```

## Project Structure

```
Blog-Aggregator/
├── src/
│   └── index.ts          # Main application entry point
├── dist/                 # Compiled JavaScript output
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## Getting Started

1. Set up your PostgreSQL database
2. Configure your database URL in environment variables
3. Run migrations to set up the schema
4. Configure your RSS feed sources
5. Start the aggregator to begin collecting feeds

## Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run start` | Run the application with tsx (development) |
| `npm run dev` | Build and run the application |
| `npm run generate` | Generate database migrations |
| `npm run migrate` | Apply database migrations |

## Dependencies

- **drizzle-orm** - Type-safe ORM for database operations
- **fast-xml-parser** - Efficient XML/RSS feed parsing
- **postgres** - PostgreSQL database client

## Development Dependencies

- **@types/node** - TypeScript types for Node.js
- **typescript** - TypeScript compiler
- **tsx** - TypeScript execution engine
- **drizzle-kit** - Database migration toolkit

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

ISC

## Author

FahimOrko

---

**For more information or support, open an issue on the repository.**
