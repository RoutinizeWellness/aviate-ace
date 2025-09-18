# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/81eadc70-73e6-45eb-98ee-0028736700dc

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/81eadc70-73e6-45eb-98ee-0028736700dc) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/81eadc70-73e6-45eb-98ee-0028736700dc) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Authentication Setup

This project uses Convex for backend services. To fully utilize the authentication features:

1. Create a Convex account at [convex.dev](https://convex.dev)
2. Create a new Convex project
3. Add your Convex project URL to the `.env` file:

```env
VITE_CONVEX_URL=your-convex-project-url
```

4. For production use, consider implementing proper authentication with Convex Auth:

```bash
npm install convex-auth
```

Then follow the Convex Auth setup guide at [https://docs.convex.dev/auth](https://docs.convex.dev/auth)

## Troubleshooting

If you encounter ID validation errors:

1. Run the clear-mock-auth.js script in your browser console
2. Refresh the page to generate new valid IDs
3. For permanent solution, set up proper Convex authentication