# GSM Custom GPT

A chat interface application with multiple AI model support.

## Development Setup

1. Clone the repository
2. Create a `.env.local` file based on `.env.example` with your credentials
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Environment Variables

This application uses the following environment variables:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_KEY`: Your Supabase API key
- `VITE_WEBHOOK_URL`: The webhook URL
- `VITE_AUTH_USERNAME`: Username for webhook authentication
- `VITE_AUTH_PASSWORD`: Password for webhook authentication
- `VITE_BASE_PATH`: Base path for deployment (set to '/gsm-custom-gpt/' for GitHub Pages)

## Deployment to GitHub Pages

This project is configured for deployment to GitHub Pages under the repository `tim-dlaunch/gsm-custom-gpt`.

### Setting up GitHub Repository Secrets

1. Go to your GitHub repository: https://github.com/tim-dlaunch/gsm-custom-gpt
2. Navigate to Settings > Secrets and variables > Actions
3. Add the following repository secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_KEY`
   - `VITE_WEBHOOK_URL`
   - `VITE_AUTH_USERNAME`
   - `VITE_AUTH_PASSWORD`

### Deployment Process

The GitHub Actions workflow will automatically deploy the application to GitHub Pages when you push to the main branch. You can also manually trigger the workflow from the Actions tab.

### Accessing the Deployed Application

Once deployed, your application will be available at:
https://tim-dlaunch.github.io/gsm-custom-gpt/

## Local Development vs Production

- For local development, create a `.env.local` file with your development credentials
- For production, the GitHub Actions workflow will use the repository secrets
- The application will use environment variables in both environments
