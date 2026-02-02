# **App Name**: Adminix

## Core Features:

- Login Authentication: Authenticate admins using credentials stored in environment variables and set an authentication cookie.
- Route Protection: Use middleware to protect dashboard routes, redirecting unauthenticated users to the login page.
- Dashboard Layout: Implement a sidebar layout for navigation, with the main content area on the right.
- Blog Management (CRUD): Enable admins to create, read, update, and delete blog posts with title and description fields. Uses local state or localStorage.
- Banner Management: Allow admins to update banner titles and image URLs for two banners. Uses local state or localStorage.
- Users Page: Display the total user count and a static user list in a table layout.
- Agency Page: Display the total agency count and a static agency list.

## Style Guidelines:

- Primary color: Dark slate blue (#374151) to convey professionalism and stability.
- Background color: Light gray (#F9FAFB), a very desaturated tint of the primary color, to provide a clean, neutral backdrop.
- Accent color: Teal (#34D399), to provide a vibrant contrast to the analogous palette and highlight key actions.
- Body and headline font: 'Inter', a sans-serif font for clear and modern readability.
- Simple, outlined icons for sidebar navigation, maintaining a clean and consistent style.
- Sidebar on the left with a contrasting background color to the main content area for clear separation.
- Subtle transitions for page loading and form interactions to improve user experience.