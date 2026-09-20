# Library System

A full-stack web application developed using Django REST Framework and React, designed to provide a platform for managing books, user accounts, and personal reading lists.

The project combines a RESTful API, relational database modelling, and a responsive frontend to deliver a book management system with secure authentication and role-based access control.

## About the Project

Library System is a full-stack application that allows users to manage their personal book collections and reading lists through an interactive web interface.

The application was developed using Django REST Framework for the backend and React for the frontend, with a relational database supporting data storage and management across three application models.

The project focuses on implementing core software engineering concepts, including RESTful API design, CRUD operations, authentication, authorisation, database modelling, and frontend-backend integration.

## Key Features

* **Book Management:** Create, retrieve, update, and delete book records through RESTful API endpoints.
* **Personal Reading Lists:** Manage personal reading lists with user-specific data access.
* **User Authentication:** JWT-based authentication to securely manage user accounts and access to protected resources.
* **Role-Based and Object-Level Authorisation:** Two levels of authorisation to control access to application functionality and individual resources.
* **RESTful API:** API endpoints supporting CRUD operations, filtering, and data validation.
* **Responsive User Interface:** A React frontend built with over 10 reusable components.
* **Relational Database:** Structured data modelling across three application models, with SQL-backed queries supporting data retrieval and management.

## Technologies Used

| Category          | Technologies                          |
| ----------------- | ------------------------------------- |
| Frontend          | React, JavaScript                     |
| Backend           | Python, Django, Django REST Framework |
| Database          | SQL, Relational Database              |
| Authentication    | JSON Web Tokens (JWT)                 |
| API               | RESTful APIs, CRUD Operations         |
| Development Tools | Git, GitHub                           |

## Architecture

The application follows a client-server architecture, separating the frontend user interface from the backend application logic.

### Frontend

The React frontend provides an interactive interface for managing books and personal reading lists.

It consists of over 10 reusable components and communicates with the backend through RESTful API requests.

### Backend

The Django REST Framework backend handles application logic, data validation, authentication, authorisation, and database operations.

It exposes RESTful API endpoints that allow the frontend to interact with application resources through CRUD operations.

### Database

The relational database stores application data across models, supporting the relationships between users, books.

## Authentication and Security

The application implements JWT authentication alongside role-based and object-level authorisation.

Protected routes and user-specific data access ensure that users can interact with application resources according to their permissions.

This approach separates authentication, which verifies user identity, from authorisation, which determines which resources and operations a user can access.

## Project Background

Library System was developed between January and May 2026 during my Computer Science studies at Dublin City University.

The project provided practical experience in full-stack software development, RESTful API design, relational database modelling, authentication, authorisation, and integrating a React frontend with a Django backend.
