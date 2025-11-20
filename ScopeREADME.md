# Bolt Ride-Hailing Management System (Cars Only)

## 📌 Project Scope

The **Bolt Ride-Hailing Management System** is a simplified ride-hailing
platform focused strictly on **car-based transportation**.\
This system manages the core operations of a ride-hailing company,
including:

### ✔ Driver Management

-   Driver registration\
-   Verification details\
-   Driver availability tracking (Available, On Trip, Offline)

### ✔ Vehicle Management (Driver-Owned Cars Only)

-   Each driver has exactly one car\
-   No vehicle type categorization\
-   No company-owned vehicles

### ✔ Rider Management

-   Rider registration\
-   Profile management\
-   Ability to request rides

### ✔ Ride/Trip Management

-   Trip request by rider\
-   System assigns an available driver\
-   Trip status management (Requested → Accepted → In Progress →
    Completed)\
-   Pickup and drop-off locations\
-   Trip history

### ✔ Payment Management

-   Fare calculation\
-   Payment processing (Cash, Card)\
-   One payment per ride

### ✔ Admin Management

-   Approve or deactivate drivers\
-   Monitor active rides\
-   Generate system reports

------------------------------------------------------------------------

## 🧱 Core Entities

### **1. Driver**

-   driver_id\
-   name\
-   phone\
-   email\
-   license_number\
-   availability_status

### **2. Vehicle**

-   vehicle_id\
-   driver_id (FK)\
-   plate_number\
-   car_model\
-   car_color\
-   manufacture_year

### **3. Rider**

-   rider_id\
-   name\
-   phone\
-   email

### **4. Ride (Trip)**

-   ride_id\
-   rider_id (FK)\
-   driver_id (FK)\
-   pickup_location\
-   dropoff_location\
-   distance_km\
-   fare_amount\
-   status\
-   requested_at\
-   completed_at

### **5. Payment**

-   payment_id\
-   ride_id (FK)\
-   amount\
-   payment_method\
-   paid_at

### **6. Admin**

-   admin_id\
-   name\
-   email\
-   role

------------------------------------------------------------------------

## 🔗 Key Relationships

-   One **driver** → one **vehicle**\
-   One **driver** → many **rides**\
-   One **rider** → many **rides**\
-   One **ride** → one **payment**

------------------------------------------------------------------------

## 🚦 Driver Availability Handling

Drivers can be in one of three states: - **AVAILABLE** - **ON_TRIP** -
**OFFLINE**

Workflow: 1. Driver logs in → set to AVAILABLE\
2. Ride assigned → set to ON_TRIP\
3. Ride completed → set back to AVAILABLE

This ensures no driver is double-booked.

------------------------------------------------------------------------

## 📚 This README is part of:

-   Business Information Requirements\
-   Conceptual ER Diagram\
-   Logical & Physical Model\
-   Database Implementation\
-   Application Implementation

------------------------------------------------------------------------
