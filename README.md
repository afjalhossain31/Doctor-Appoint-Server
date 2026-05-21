# Doctor Appointment Server

Live API: https://doctor-appoint-server-alpha.vercel.app/

This is the backend server for the Doctor Appointment project.

## Public Endpoints

- `GET /` - Health/welcome response
- `GET /doctors` - Get all doctors
- `GET /doctors/:doctorId` - Get a single doctor by ID
- `GET /appointments` - Get all appointments
- `GET /appointments/:email` - Get appointments by user email

## Write Endpoints

- `POST /doctors` - Add a doctor
- `POST /appointments` - Add an appointment
- `PUT /appointments/:id` - Update an appointment
- `DELETE /appointments/:id` - Delete an appointment
- `POST /users` - Register a user
- `DELETE /doctors/:id` - Delete a doctor

## Auth / Signout

- `POST /api/auth/signout` - Server-side signout that clears cookies and tells the client to clear local storage/session storage

## Notes

- The `users` endpoint is intended for backend registration flow and is not meant for public browsing.
- For cross-site login/session support, set `CLIENT_URL`, `COOKIE_DOMAIN` and the required Vercel environment variables.
- Make sure `MONGODB_URI` is configured in the Vercel dashboard.
