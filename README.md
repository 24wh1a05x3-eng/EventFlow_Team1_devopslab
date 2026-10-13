# EventFlow – College Event Management Website

EventFlow is a beginner-friendly front-end project for showing college events and letting students register for them. It also includes a simple GitHub Actions CI/CD workflow that checks the required files and deploys the static website to GitHub Pages.

## Features

- Responsive layout for mobile and desktop
- Event cards with date, time, venue, and category
- Search events by name, category, venue, or description
- Filter events by Technical, Cultural, Workshop, and Sports
- Registration form with basic browser-side validation
- Registration confirmation message
- Add Event form with event name, category, date, time, venue, and description
- Custom events appear in the event list and are saved in the current browser
- GitHub Actions workflow for automatic GitHub Pages deployment

## Project files

```text
EventFlow_Project/
├── index.html
├── style.css
├── script.js
├── README.md
└── .github/
    └── workflows/
        └── deploy.yml
```

## Run it on your computer

1. Extract the ZIP file.
2. Open the `EventFlow_Project` folder in VS Code.
3. Open `index.html` in your browser. You can also use the VS Code Live Server extension.

No extra packages or installation are required.

## Enable CI/CD with GitHub Pages

1. Sign in to GitHub and create a **new public repository** named `EventFlow`.
2. Upload all the project files and folders from this extracted project. Make sure the `.github/workflows/deploy.yml` file is included.
3. Commit the files to the `main` branch.
4. Open your repository on GitHub and go to **Settings → Pages**.
5. Under **Build and deployment**, select **GitHub Actions** as the source if it is not already selected.
6. Open the **Actions** tab. The `EventFlow CI/CD` workflow should run after you push to `main`.
7. When the workflow succeeds, open **Settings → Pages** to find your website URL.

After the first setup, every push to `main` runs the workflow again and deploys the updated site.

## What the CI/CD workflow does

1. **Continuous Integration (CI):** GitHub Actions downloads the code and checks that the required HTML, CSS, and JavaScript files exist.
2. **Prepare:** GitHub Actions packages the website files.
3. **Continuous Deployment (CD):** GitHub Actions publishes the website to GitHub Pages.

## Important project limitation

This is a front-end demonstration. Registrations and custom events are stored in the visitor's own browser using `localStorage`; they are **not** sent to a server or shared with the college. The Add Event page is a demo form, not a protected admin page. For a real college system, connect a backend and database, add secure admin login, and validate registrations on the server.

The events and dates are sample demo content. Update them in `script.js` before presenting your project.
