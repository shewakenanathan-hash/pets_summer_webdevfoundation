# PawHaven 🐾

PawHaven is a small pet-adoption CRUD website built with plain HTML, CSS and JavaScript.

## Features

- Browse all pets
- Search pets by name or breed
- Filter by species and adoption status
- View a pet's full profile
- Add a new pet with client-side validation
- Edit an existing pet
- Mark a pet as adopted
- Delete a pet with confirmation
- Responsive design for phone, tablet and desktop
- Image URL preview on Add and Edit forms

## Folder structure

```text
pets/
├── README.md
└── frontend/
    ├── html/
    │   ├── index.html
    │   ├── add-pet.html
    │   └── pet-details.html
    ├── css/
    │   └── style.css
    └── js/
        ├── config.js
        ├── index.js
        ├── add-pet.js
        └── pet-details.js
```

## API

For local development, `frontend/js/config.js` uses:

`http://localhost:4100/api`

If your instructor gives your team a deployed API URL, replace `API_BASE_URL` in `config.js`.

The frontend uses:

- `GET /api/pets`
- `GET /api/pets/:id`
- `POST /api/pets`
- `PUT /api/pets/:id`
- `DELETE /api/pets/:id`

## How to run

1. Open the `pets` folder in VS Code.
2. Make sure the API server is running.
3. Install the VS Code **Live Server** extension if needed.
4. Open `frontend/html/index.html`.
5. Click **Go Live**.
6. Test Browse → Add → Edit → Mark as adopted → Delete.

## Live link

Add the deployed frontend URL here after deployment:

`YOUR_LIVE_URL_HERE`

## GitHub repository

Use the required repository naming format:

`groupName_batchName_courseName`

Example:

`pets_summer_webdevfoundation`
