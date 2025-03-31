# M1-Simplifi

A simple tool to help download transactions from M1 in a format upload-able to Quicken-Simplifi

⚠️ **SECURITY WARNING** ⚠️
This tool is provided as-is with no guarantees. Never trust random code from the internet with your financial data or credentials. Always review the source code and run locally.

## TODO

I need help with some of these as I don't have these accounts in order to test them.

- [ ] Add credit card transaction support
- [ ] Add borrow/lending transaction support
- Anything else, leave an issue to discuss further https://github.com/johnslemmer/m1-simplifi/issues/new
- Or open a pull request

## Local Development Setup

### Prerequisites

- [Bun](https://bun.sh/) - Fast all-in-one JavaScript runtime & toolkit
- [Git](https://git-scm.com/) - Version control system

### Getting Started

```bash
# Clone the repository
git clone https://github.com/johnslemmer/m1-simplifi.git

# Install dependencies
cd m1-simplifi
bun install

# Run development server
bun dev

# navigate to http://localhost:3000
```

### If the M1 GraphQLl Schema/API Changes

Regenerate the GraphQL client:

```bash
bun generate-client
bun typecheck
```

And address any fallout.

## Tech Stack

- [Bun](https://bun.sh/) - JavaScript runtime & package manager
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [React](https://react.dev/) - JavaScript UI Framework
- [Next.js](https://nextjs.org) - React Metaframework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - React component library
- [@genql/cli](https://genql.dev/) - for making type-safe graphql requests a breeze

Special thanks to these AI for making something like this quicker to whip up:

- [v0.dev](https://v0.dev/) - UI prototyping tool
- [VS Code Claude Sonnet](https://anthropic.com/) - AI assistance
