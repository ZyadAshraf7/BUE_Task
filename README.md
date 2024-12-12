# Project Setup and Documentation

## Steps to Start the Projects

### WebAPI Project
1. Open the `appsettings.json` file.
   - Replace the comment `Your Server Name` with your actual server name.
2. Open the Package Manager Console in Visual Studio.
   - Run the following commands to initialize the database:
     ```bash
     add-migration Initial
     update-database
     ```
3. Run the project to start the WebAPI.

### ReactJS Project
1. Open the project directory in your terminal.
2. Run the following command to install the required dependencies:
   ```bash
   npm install
   ```
3. Start the application using the command:
   ```bash
   npm start
   ```
4. Access the application in your browser and test its features.
5. If you encounter any issues or find something inconvenient, please reach out to me.

---

## WebAPI Project Documentation

### Overview
This project includes a `RegistirationController` that provides the following API endpoints. All endpoints log activity using **Serilog** for detailed monitoring.

### Endpoints

#### 1. Get All Registrations
**URL:** `GET /GetRegistirations`
- **Parameters:**
  - `pageIndex` (int): The page number.
  - `pageSize` (int): The number of registrations per page.
- **Response:**
  - `200 OK`: List of registrations.
  - `500 Internal Server Error`: Error details.
- **Description:** Fetches paginated registrations.

#### 2. Get Registration Count
**URL:** `GET /GetRegistirationsCount`
- **Response:**
  - `200 OK`: Total count of registrations.
  - `500 Internal Server Error`: Error details.
- **Description:** Fetches the total number of registrations.

#### 3. Create a New Registration
**URL:** `POST /CreateRegistiration`
- **Request Body:**
  - `CreateRegistrationDTO`: Contains details like `FullName`, `EmailAddress`, `PhoneNumber`, and `Age`.
- **Response:**
  - `201 Created`: Registration created successfully.
  - `400 Bad Request`: Validation errors.
  - `409 Conflict`: Email already exists.
  - `500 Internal Server Error`: Error details.
- **Description:** Adds a new registration with validation.

#### 4. Get Registration by ID
**URL:** `GET /{id}`
- **Parameters:**
  - `id` (int): The ID of the registration.
- **Response:**
  - `200 OK`: Registration details.
  - `404 Not Found`: Registration not found.
- **Description:** Fetches a specific registration by ID.

#### 5. Search Registrations
**URL:** `POST /Search`
- **Request Body:**
  - `InputSearchDTO`: Contains `Input` (search term) and `SearchType` (Name/Email).
- **Response:**
  - `200 OK`: Search results.
  - `404 Not Found`: No results found.
  - `400 Bad Request`: Validation errors.
  - `500 Internal Server Error`: Error details.
- **Description:** Searches for registrations by name or email.

---

## ReactJS Project Documentation

### Pages

#### 1. Add New Registration Page
This page allows users to create a new registration. It enforces the following real-time constraints:

- **Full Name:**
  - Minimum 3 characters, maximum 50 characters.
  - Must only allow alphabetic characters and spaces.
- **Email Address:**
  - Valid email format (e.g., `user@example.com`).
  - Server-side uniqueness check.
- **Phone Number:**
  - Accepts only numeric values.
  - Length between 10 to 15 digits.
  - Includes country code validation (e.g., `+1`, `+20`).
- **Age:**
  - Accepts values between 18 and 99.

#### 2. View Registrations Page
This page displays all registrations with the following features:

- **Pagination:**
  - Users can navigate through the list of registrations.
- **Search:**
  - Allows searching by name or email.

