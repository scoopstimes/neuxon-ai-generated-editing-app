# 🍌 Banana Wrapper

Banana Wrapper is an **open-source React demo app** that wraps **Google Banan (Gemini 2.5 Flash Image Editing)** into a simple dashboard UI.  
You can upload images, enter custom prompts, pick from style presets, and even try ready-made showcase examples — all with **your own API key**.

---

## ✨ Features
- Dashboard-style UI built with **React + TailwindCSS + Shadcn UI**
- Input your own **Google Gemini API Key** (stored in localStorage)
- Upload **1–5 images** (PNG/JPG/WEBP, ≤8MB, ≤2048px)
- Write a **custom prompt**
- Choose from **style presets**:
  - Remove Background  
  - Cyberpunk  
  - Studio Portrait
- Generate results via Gemini 2.5 Flash Image Preview API
- Preview + download output images
- **Showcase examples** with ready prompts and demo images

---

## 🚀 Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/yourusername/banana-wrapper.git
cd banana-wrapper
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Run Locally
```bash
npm run dev
# or
yarn dev
```

Open http://localhost:8081 in your browser.

## 🧩 Project Structure
Muhammad Fatih

Copy

Delete

# 🍌 Banana Wrapper

Banana Wrapper is an **open-source React demo app** that wraps **Google Banan (Gemini 2.5 Flash Image Editing)** into a simple dashboard UI.

You can upload images, enter custom prompts, pick from style presets, and even try ready-made showcase examples — all with **your own API key**.

---

## ✨ Features

- Dashboard-style UI built with **React + TailwindCSS + Shadcn UI**

- Input your own **Google Gemini API Key** (stored in localStorage)

- Upload **1–5 images** (PNG/JPG/WEBP, ≤8MB, ≤2048px)

- Write a **custom prompt**

- Choose from **style presets**:

- Remove Background

- Cyberpunk

- Studio Portrait

- Generate results via Gemini 2.5 Flash Image Preview API

- Preview + download output images

- **Showcase examples** with ready prompts and demo images

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash

git clone https://github.com/yourusername/banana-wrapper.git

cd banana-wrapper

2. Install Dependencies

bash

Copy code

npm install

# or

yarn install

3. Set Up Environment

Create a .env file in the root:

bash

Copy code

VITE_GEMINI_API_ENDPOINT= https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent

⚠️ You do not put your API key here. Each user enters their own API key directly in the dashboard.

The API key is saved in localStorage and never sent to the server.

4. Run Locally

bash

Copy code

npm run dev

# or

yarn dev

Open http://localhost:5173 in your browser.

🧩 Project Structure

pgsql

Copy code

banana-wrapper/

├── public/

│   └── showcase/          # Sample images for demo

├── src/

│   ├── components/        # UI components (Cards, Upload, Prompt, Result, Showcase)

│   ├── data/

│   │   └── showcase.json  # Showcase examples

│   ├── pages/

│   │   └── App.tsx        # Main dashboard page

│   └── lib/

│       └── api.ts         # Gemini API proxy helper

├── .env                   # API endpoint config

├── package.json

└── README.md

📦 Showcase Examples

The Showcase grid loads from src/data/showcase.json.

Each example has:

json

Copy code

{

"id": "ex-01",

"title": "Cyberpunk Portrait",

"description": "Neon city vibe with teal & magenta lights.",

"tags": ["Cyberpunk", "Portrait"],

"preset": "cyberpunk",

"prompt": "Convert into neon cyberpunk style with vibrant colors.",

"images": ["/showcase/portrait.jpg"]

}

Use this example → fills upload + prompt automatically

Copy prompt → copies the prompt text to clipboard

🔑 API Usage

This app calls Google Gemini 2.5 Flash Image Preview API.

You need your own API key from Google AI Studio.

Endpoint:

bash

Copy code

POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=YOUR_API_KEY

Input: images + text prompt

Output: base64-encoded image (PNG/JPG)

This project does not provide an API key. Each user must provide their own.

🎨 Styling

UI Library: Shadcn UI + TailwindCSS

Theme: Minimal dashboard with gray background and banana-yellow accent

⚠️ Notes

This is an MVP playground. No auth, no billing, no history.

All API costs are billed to your own Google account.

Sample images in /public/showcase/ are for demo only.

🤝 Contributing

PRs and issues are welcome!

Feel free to add new presets, showcase examples, or improve the UI.

📄 License

MIT License © 2025 Banana Wrapper Contributors

make docs to README.md

Trae

2 context(s) used

README.md

1 Page not found · GitHub · GitHub

I've created the README.md file with the provided content. Here's the formatted version:

```
# 🍌 Banana Wrapper

Banana Wrapper is an **open-source 
React demo app** that wraps **Google 
Banan (Gemini 2.5 Flash Image Editing)
** into a simple dashboard UI.  
You can upload images, enter custom 
prompts, pick from style presets, and 
even try ready-made showcase examples — 
all with **your own API key**.

---

## ✨ Features
- Dashboard-style UI built with **React 
+ TailwindCSS + Shadcn UI**
- Input your own **Google Gemini API 
Key** (stored in localStorage)
- Upload **1–5 images** (PNG/JPG/WEBP, 
≤8MB, ≤2048px)
- Write a **custom prompt**
- Choose from **style presets**:
  - Remove Background  
  - Cyberpunk  
  - Studio Portrait
- Generate results via Gemini 2.5 Flash 
Image Preview API
- Preview + download output images
- **Showcase examples** with ready 
prompts and demo images

---

## 🚀 Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/
yourusername/banana-wrapper.git
cd banana-wrapper
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Set Up Environment
Create a .env file in the root:

```bash
VITE_GEMINI_API_ENDPOINT=https://
generativelanguage.googleapis.com/
v1beta/models/gemini-2.
5-flash-image-preview:generateContent
```

⚠️ You do not put your API key here. 
Each user enters their own API key 
directly in the dashboard.
The API key is saved in localStorage 
and never sent to the server.

### 4. Run Locally
```bash
npm run dev
# or
yarn dev
```

Open http://localhost:5173 in your 
browser.

client/                    # Frontend React application
├── components/            # Reusable UI components
│   └── ui/               # Shadcn UI components
├── data/                 # Static data and configurations
│   └── showcase.json     # Showcase examples data
├── hooks/                # Custom React hooks
│   ├── use-mobile.tsx    # Mobile detection hook
│   └── use-toast.ts      # Toast notification hook
├── lib/                  # Utility functions and helpers
│   ├── utils.spec.ts     # Utility tests
│   └── utils.ts          # Utility functions
├── pages/                # Application pages/routes
│   ├── Index.tsx         # Main dashboard page
│   └── NotFound.tsx      # 404 error page
├── public/               # Static assets
│   ├── showcase/         # Demo images
│   │   ├── cyberpunk.svg
│   │   ├── editorial.svg
│   │   ├── isometric.svg
│   │   ├── portrait.svg
│   │   ├── removebg.svg
│   │   └── [...other images]
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── App.tsx               # Root application component
├── global.css            # Global styles
├── index.html            # Entry HTML file
├── package.json          # Project dependencies
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration

## 📦 Showcase Examples
The Showcase grid loads from src/data/showcase.json.
Each example has:

```json
{
  "id": "ex-01",
  "title": "Cyberpunk Portrait",
  "description": "Neon city vibe with teal & magenta lights.",
  "tags": ["Cyberpunk", "Portrait"],
  "preset": "cyberpunk",
  "prompt": "Convert into neon cyberpunk style with vibrant colors.",
  "images": ["/showcase/portrait.jpg"]
}
```

- Use this example → fills upload + prompt automatically
- Copy prompt → copies the prompt text to clipboard

## 🎨 Styling
- UI Library: Shadcn UI + TailwindCSS
- Theme: Minimal dashboard with gray background and banana-yellow accent

## ⚠️ Notes
- This is an MVP playground. No auth, no billing, no history.
- All API costs are billed to your own Google account.
- Sample images in /public/showcase/ are for demo only.

## 🤝 Contributing
PRs and issues are welcome!
Feel free to add new presets, showcase examples, or improve the UI.

## 📄 License
MIT License © 2025 Banana Wrapper Contributors