# 🧩 Service Configuration Feature (Printing MRP)

## 📌 Overview

This feature introduces a **Service Configuration Layer** in the ERP system to support flexible printing operations such as:

* Silk Screen Printing
* DTF Printing
* Sublimation Printing

Instead of treating each variation as a separate product, the system allows **dynamic configuration of services** based on:

* Service Type
* Options
* Conditions

These configurations automatically determine:

* Bill of Materials (BOM)
* Inventory consumption
* Pricing

---

## 🎯 Objectives

* Avoid product duplication (no need to create multiple SKUs for every variation)
* Enable flexible order entry in Sales Orders
* Automate BOM selection and inventory deduction
* Support scalable service expansion (DTF, embroidery, etc.)

---

## 🧠 Core Concept

```
Service + Option + Condition → BOM + Price + Inventory Behavior
```

---

## 🧩 Feature Components

### 1. Service Types

Defines the main category of service offered.

| Field       | Type    | Description                         |
| ----------- | ------- | ----------------------------------- |
| id          | integer | Primary key                         |
| name        | string  | e.g., Silk Screen, DTF, Sublimation |
| description | text    | Optional                            |

---

### 2. Service Options

Defines variations of a service.

| Field | Type    | Description                                    |
| ----- | ------- | ---------------------------------------------- |
| id    | integer | Primary key                                    |
| name  | string  | e.g., Print Only, Print + Label, Print + Shirt |

---

### 3. Service Conditions

Optional attributes that affect behavior.

| Field  | Type     | Description             |
| ------ | -------- | ----------------------- |
| id     | integer  | Primary key             |
| name   | string   | e.g., Label Source      |
| values | string[] | e.g., CUSTOMER, COMPANY |

---

### 4. Service Configuration (Core Table)

Maps combinations to system behavior.

| Field             | Type    | Description              |
| ----------------- | ------- | ------------------------ |
| id                | integer | Primary key              |
| service_type_id   | FK      | Link to Service Type     |
| service_option_id | FK      | Link to Option           |
| condition_value   | string  | e.g., CUSTOMER / COMPANY |
| bom_id            | FK      | Linked BOM               |
| price             | decimal | Default price            |
| is_active         | boolean | Enable/disable           |

---

## 🧾 Sales Order Integration

### Updated Sales Order Item Structure

Add the following fields:

```sql
service_type_id INTEGER
service_option_id INTEGER
label_source VARCHAR -- CUSTOMER / COMPANY
```

---

## 🧾 Example Scenario

### Customer: ORGANIC Lifestyle

### Sales Order: SO-0001

#### Item 1

* Service: Silk Screen
* Option: Print + Label
* Label Source: Customer
* Qty: 100

**Result:**

* BOM: Silk Screen (No Label)
* Inventory: Ink only

---

#### Item 2

* Service: Silk Screen
* Option: Print + Label
* Label Source: Company
* Qty: 100

**Result:**

* BOM: Silk Screen (With Label)
* Inventory: Ink + Label

---

#### Item 3

* Service: Silk Screen
* Option: Print Only
* Qty: 100

**Result:**

* BOM: Silk Screen Only
* Inventory: Ink only

---

## 🔁 System Flow

1. User creates Sales Order
2. Selects:

   * Service Type
   * Option
   * Condition (e.g., Label Source)
3. System finds matching **Service Configuration**
4. Automatically assigns:

   * BOM
   * Price
5. On confirmation:

   * Production is triggered (optional)
   * Goods Issue deducts materials

---

## 🔗 BOM Design

### Example BOMs

#### Silk Screen Only

* Ink
* Chemicals

#### Silk Screen + Label (Company)

* Ink
* Chemicals
* Label

#### Silk Screen + Label (Customer)

* Ink
* Chemicals
* (No label)

---

## 💰 Pricing Strategy

Pricing can be:

* Fixed per configuration
* Computed dynamically:

  * Base service price
  * + Material cost (e.g., label)
  * × Complexity factor

---

## 🖥️ UI Behavior

### Sales Order Form

Dynamic fields:

1. Select Service Type
2. Load Options
3. Select Option
4. Show Conditional Fields (e.g., Label Source)
5. Auto-fill:

   * Price
   * Notes (optional)

---

## 🚫 What to Avoid

* ❌ Creating separate items for every variation
* ❌ Hardcoding logic inside Sales Order
* ❌ Manual BOM selection by users

---

## ✅ Benefits

* Clean and scalable design
* Reduces item master complexity
* Automates production logic
* Flexible for future services

---

## 🚀 Future Enhancements

* Multi-condition support (size, color, fabric type)
* Tiered pricing (bulk discounts)
* Customer-specific pricing
* Integration with design uploads
* Production scheduling optimization

---

## 🧠 Summary

This feature transforms your ERP from:

> Static product-based system

into:

> Dynamic service-driven manufacturing system

---

**End of Document**
