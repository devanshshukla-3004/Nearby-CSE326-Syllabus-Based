# NearAid — Smart Location-Based Emergency Assistance Directory

A frontend-only CSE326 Internet Programming project. NearAid helps a user maintain a personal directory of nearby emergency-related services and sort saved entries by straight-line distance from a selected location.

## Important scope and safety note

- This project does **not** connect to a live places database or verify real-world facilities.
- The user must add and verify each directory entry.
- Entries are saved in the current browser using LocalStorage. They do not automatically sync to another device or browser.
- Distance is an approximate straight-line calculation, not road distance or travel time.
- For an actual emergency in India, call **112**. This project is not an emergency dispatch service.

## Technologies

- HTML5 — page structure and forms
- CSS3 — layout and responsive presentation
- Vanilla JavaScript — application logic, arrays, objects, functions and DOM updates
- Browser Geolocation API — optional current coordinates, with user permission
- Web Storage API (LocalStorage) — local directory persistence
- Git and GitHub — version control and source hosting

No Node.js, backend, database server, external places API, map provider, framework or third-party JavaScript library is used.

## Features

1. Request the current device location through browser Geolocation.
2. Enter coordinates manually when location permission is unavailable.
3. Add, edit and delete service directory entries.
4. Store service name, category, phone, address and coordinates.
5. Calculate approximate distance using the Haversine formula.
6. Search by service name, category, address or phone number.
7. Filter by service category and sort by distance, name or category.
8. Use responsive layouts on desktop and mobile.
9. Save entries locally using LocalStorage.

## Run the project

Open `index.html` in a modern browser. Geolocation generally requires a secure context (such as HTTPS or localhost) and user permission. The rest of the directory can be used with manually entered coordinates.

## Data format

Each saved service is represented as a JavaScript object with an ID, name, category, phone, address, latitude and longitude. The array of objects is serialized as JSON and stored under the LocalStorage key `nearaid.services.v1`.

## Syllabus alignment

The implementation is intentionally limited to the CSE326 syllabus technologies and concepts: HTML, CSS, JavaScript fundamentals, DOM manipulation, event handling, form validation, browser Geolocation, Web Storage, JSON, error handling and Git/GitHub. No extra framework or backend technology is introduced.

## Project files

- `index.html` — application structure and forms
- `styles.css` — responsive interface
- `script.js` — directory logic, validation, location and distance calculations

## Academic use

This repository is a student project. Before submission, test it in the target browser, verify the syllabus mapping against the official course document, and add your own verified service entries.