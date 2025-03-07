export const ALL_PERMISSIONS = {
  ELECTRICITY_RATES: {
    GET_PAGINATE: {
      method: "GET",
      apiPath: "/api/electricity-rates",
      module: "ELECTRICITY_RATES",
    },
    CREATE: {
      method: "POST",
      apiPath: "/api/electricity-rates",
      module: "ELECTRICITY_RATES",
    },
    UPDATE: {
      method: "PUT",
      apiPath: "/api/electricity-rates/{id}",
      module: "ELECTRICITY_RATES",
    },
    DELETE: {
      method: "DELETE",
      apiPath: "/api/electricity-rates/{id}",
      module: "ELECTRICITY_RATES",
    },
  },
  LOCATIONS: {
    GET_PAGINATE: {
      method: "GET",
      apiPath: "/api/locations",
      module: "LOCATIONS",
    },
    CREATE: {
      method: "POST",
      apiPath: "/api/locations",
      module: "LOCATIONS",
    },
    UPDATE: {
      method: "PUT",
      apiPath: "/api/locations/{id}",
      module: "LOCATIONS",
    },
    DELETE: {
      method: "DELETE",
      apiPath: "/api/locations/{id}",
      module: "LOCATIONS",
    },
  },
  COMMON_AREAS: {
    GET_PAGINATE: {
      method: "GET",
      apiPath: "/api/common-areas",
      module: "COMMON_AREAS",
    },
    CREATE: {
      method: "POST",
      apiPath: "/api/common-areas",
      module: "COMMON_AREAS",
    },
    UPDATE: {
      method: "PUT",
      apiPath: "/api/common-areas/{id}",
      module: "COMMON_AREAS",
    },
    DELETE: {
      method: "DELETE",
      apiPath: "/api/common-areas/{id}",
      module: "COMMON_AREAS",
    },
  },
  WORK_REGISTRATIONS: {
    GET_PAGINATE: {
      method: "GET",
      apiPath: "/api/work-registrations",
      module: "WORK_REGISTRATIONS",
    },
    CREATE: {
      method: "POST",
      apiPath: "/api/work-registrations",
      module: "WORK_REGISTRATIONS",
    },
    UPDATE: {
      method: "PUT",
      apiPath: "/api/work-registrations/{id}",
      module: "WORK_REGISTRATIONS",
    },
    DELETE: {
      method: "DELETE",
      apiPath: "/api/work-registrations/{id}",
      module: "WORK_REGISTRATIONS",
    },
  },
  REPAIR_REQUEST: {
    GET_PAGINATE: {
      method: "GET",
      apiPath: "/api/repair-requests",
      module: "REPAIR_REQUEST",
    },
    CREATE: {
      method: "POST",
      apiPath: "/api/repair-requests",
      module: "REPAIR_REQUEST",
    },
    SEND: {
      method: "PATCH",
      apiPath: "/api/repair-requests/send/{id}",
      module: "REPAIR_REQUEST",
    },
    UPDATE: {
      method: "PUT",
      apiPath: "/api/repair-requests/{id}",
      module: "REPAIR_REQUEST",
    },
    DELETE: {
      method: "DELETE",
      apiPath: "/api/repair-requests/{id}",
      module: "REPAIR_REQUEST",
    },
  },
  NOTIFICATION_MAINTENANCES: {
    GET_PAGINATE: {
      method: "GET",
      apiPath: "/api/notifications",
      module: "NOTIFICATION_MAINTENANCES",
    },
    CREATE: {
      method: "POST",
      apiPath: "/api/notifications",
      module: "NOTIFICATION_MAINTENANCES",
    },
    UPDATE: {
      method: "PUT",
      apiPath: "/api/notifications/{id}",
      module: "NOTIFICATION_MAINTENANCES",
    },
    DELETE: {
      method: "DELETE",
      apiPath: "/api/notifications/{id}",
      module: "NOTIFICATION_MAINTENANCES",
    },
  },
  DEVICES: {
    GET_PAGINATE: {
      method: "GET",
      apiPath: "/api/devices",
      module: "DEVICES",
    },
    CREATE: {
      method: "POST",
      apiPath: "/api/devices",
      module: "DEVICES",
    },
    UPDATE: {
      method: "PUT",
      apiPath: "/api/devices/{id}",
      module: "DEVICES",
    },
    DELETE: {
      method: "DELETE",
      apiPath: "/api/devices/{id}",
      module: "DEVICES",
    },
  },
  QUOTATIONS: {
    GET_PAGINATE: {
      method: "GET",
      apiPath: "/api/quotations",
      module: "QUOTATIONS",
    },
    CREATE: {
      method: "POST",
      apiPath: "/api/quotations",
      module: "QUOTATIONS",
    },
    UPDATE: {
      method: "PUT",
      apiPath: "/api/quotations/{id}",
      module: "QUOTATIONS",
    },
    DELETE: {
      method: "DELETE",
      apiPath: "/api/quotations/{id}",
      module: "QUOTATIONS",
    },
  },
  ELECTRICITY_USAGES: {
    GET_PAGINATE: {
      method: "GET",
      apiPath: "/api/electricity-usages",
      module: "ELECTRICITY_USAGES",
    },
    CREATE: {
      method: "POST",
      apiPath: "/api/electricity-usages",
      module: "ELECTRICITY_USAGES",
    },
    UPDATE: {
      method: "PUT",
      apiPath: "/api/electricity-usages/{id}",
      module: "ELECTRICITY_USAGES",
    },
    DELETE: {
      method: "DELETE",
      apiPath: "/api/electricity-usages/{id}",
      module: "ELECTRICITY_USAGES",
    },
  },
  DEVICE_TYPES: {
    GET_PAGINATE: {
      method: "GET",
      apiPath: "/api/device-types",
      module: "DEVICE_TYPES",
    },
    CREATE: {
      method: "POST",
      apiPath: "/api/device-types",
      module: "DEVICE_TYPES",
    },
    UPDATE: {
      method: "PUT",
      apiPath: "/api/device-types/{id}",
      module: "DEVICE_TYPES",
    },
    DELETE: {
      method: "DELETE",
      apiPath: "/api/device-types/{id}",
      module: "DEVICE_TYPES",
    },
  },
  MAINTENANCE_HISTORIES: {
    GET_PAGINATE: {
      method: "GET",
      apiPath: "/api/maintenance_histories",
      module: "MAINTENANCE_HISTORIES",
    },
    CREATE: {
      method: "POST",
      apiPath: "/api/maintenance_histories",
      module: "MAINTENANCE_HISTORIES",
    },
    UPDATE: {
      method: "PUT",
      apiPath: "/api/maintenance_histories/{id}",
      module: "MAINTENANCE_HISTORIES",
    },
    DELETE: {
      method: "DELETE",
      apiPath: "/api/maintenance_histories/{id}",
      module: "MAINTENANCE_HISTORIES",
    },
  },
  SYSTEM_MAINTENANCE_SERVICES: {
    GET_PAGINATE: {
      method: "GET",
      apiPath: "/api/system-maintenances",
      module: "SYSTEM_MAINTENANCE_SERVICES",
    },
    CREATE: {
      method: "POST",
      apiPath: "/api/system-maintenances",
      module: "SYSTEM_MAINTENANCE_SERVICES",
    },
    UPDATE: {
      method: "PUT",
      apiPath: "/api/system-maintenances/{id}",
      module: "SYSTEM_MAINTENANCE_SERVICES",
    },
    DELETE: {
      method: "DELETE",
      apiPath: "/api/system-maintenances/{id}",
      module: "SYSTEM_MAINTENANCE_SERVICES",
    },
  },
  SUBCONTRACTS: {
    GET_PAGINATE: {
      method: "GET",
      apiPath: "/api/subcontractors",
      module: "SUBCONTRACTS",
    },
    CREATE: {
      method: "POST",
      apiPath: "/api/subcontractors",
      module: "SUBCONTRACTS",
    },
    UPDATE: {
      method: "PUT",
      apiPath: "/api/subcontractors/{id}",
      module: "SUBCONTRACTS",
    },
    DELETE: {
      method: "DELETE",
      apiPath: "/api/subcontractors/{id}",
      module: "SUBCONTRACTS",
    },
  },
  SYSTEMS: {
    GET_PAGINATE: {
      method: "GET",
      apiPath: "/api/systems",
      module: "SYSTEMS",
    },
    CREATE: {
      method: "POST",
      apiPath: "/api/systems",
      module: "SYSTEMS",
    },
    UPDATE: {
      method: "PUT",
      apiPath: "/api/systems/{id}",
      module: "SYSTEMS",
    },
    DELETE: {
      method: "DELETE",
      apiPath: "/api/systems/{id}",
      module: "SYSTEMS",
    },
  },
  PAYMENT_CONTRACTS: {
    GET_PAGINATE: {
      method: "GET",
      apiPath: "/api/payments",
      module: "PAYMENT_CONTRACTS",
    },
    CREATE: {
      method: "POST",
      apiPath: "/api/payments",
      module: "PAYMENT_CONTRACTS",
    },
    UPDATE: {
      method: "PUT",
      apiPath: "/api/payments/{id}",
      module: "PAYMENT_CONTRACTS",
    },
    DELETE: {
      method: "DELETE",
      apiPath: "/api/payments/{id}",
      module: "PAYMENT_CONTRACTS",
    },
    SEND_PAYMENT: {
      method: "POST",
      apiPath: "/api/payments/sendPaymentRequest/{paymentId}",
      module: "PAYMENT_CONTRACTS",
    },
  },
  CONTRACTS: {
    GET_PAGINATE: {
      method: "GET",
      apiPath: "/api/contracts",
      module: "CONTRACTS",
    },
    SEND: {
      method: "PATCH",
      apiPath: "/api/contracts/send/{id}",
      module: "CONTRACTS",
    },
    CREATE: {
      method: "POST",
      apiPath: "/api/contracts",
      module: "CONTRACTS",
    },
    UPDATE: {
      method: "PUT",
      apiPath: "/api/contracts/{id}",
      module: "CONTRACTS",
    },
    DELETE: {
      method: "DELETE",
      apiPath: "/api/contracts/{id}",
      module: "CONTRACTS",
    },
  },
  OFFICES: {
    GET_PAGINATE: {
      method: "GET",
      apiPath: "/api/offices",
      module: "OFFICES",
    },
    CREATE: {
      method: "POST",
      apiPath: "/api/offices",
      module: "OFFICES",
    },
    UPDATE: {
      method: "PUT",
      apiPath: "/api/offices/{id}",
      module: "OFFICES",
    },
    DELETE: {
      method: "DELETE",
      apiPath: "/api/offices/{id}",
      module: "OFFICES",
    },
  },
  CUSTOMER_TYPES: {
    GET_PAGINATE: {
      method: "GET",
      apiPath: "/api/customer-types",
      module: "CUSTOMER_TYPES",
    },
    CREATE: {
      method: "POST",
      apiPath: "/api/customer-types",
      module: "CUSTOMER_TYPES",
    },
    UPDATE: {
      method: "PUT",
      apiPath: "/api/customer-types/{id}",
      module: "CUSTOMER_TYPES",
    },
    DELETE: {
      method: "DELETE",
      apiPath: "/api/customer-types/{id}",
      module: "CUSTOMER_TYPES",
    },
  },
  CUSTOMER_TYPE_DOCUMENTS: {
    GET_PAGINATE: {
      method: "GET",
      apiPath: "/api/customer-type-documents",
      module: "CUSTOMER_TYPE_DOCUMENTS",
    },
    CREATE: {
      method: "POST",
      apiPath: "/api/customer-type-documents",
      module: "CUSTOMER_TYPE_DOCUMENTS",
    },
    UPDATE: {
      method: "PUT",
      apiPath: "/api/customer-type-documents/{id}",
      module: "CUSTOMER_TYPE_DOCUMENTS",
    },
    DELETE: {
      method: "DELETE",
      apiPath: "/api/customer-type-documents/{id}",
      module: "CUSTOMER_TYPE_DOCUMENTS",
    },
  },
  PERMISSIONS: {
    GET_PAGINATE: {
      method: "GET",
      apiPath: "/api/permissions",
      module: "PERMISSIONS",
    },
    CREATE: {
      method: "POST",
      apiPath: "/api/permissions",
      module: "PERMISSIONS",
    },
    UPDATE: {
      method: "PUT",
      apiPath: "/api/permissions/{id}",
      module: "PERMISSIONS",
    },
    DELETE: {
      method: "DELETE",
      apiPath: "/api/permissions/{id}",
      module: "PERMISSIONS",
    },
  },
  ROLES: {
    GET_PAGINATE: { method: "GET", apiPath: "/api/roles", module: "ROLES" },
    CREATE: { method: "POST", apiPath: "/api/roles", module: "ROLES" },
    UPDATE: { method: "PUT", apiPath: "/api/roles/{id}", module: "ROLES" },
    DELETE: {
      method: "DELETE",
      apiPath: "/api/roles/{id}",
      module: "ROLES",
    },
  },
  USERS: {
    GET_PAGINATE: { method: "GET", apiPath: "/api/users", module: "USERS" },
    CREATE: { method: "POST", apiPath: "/api/users", module: "USERS" },
    UPDATE: { method: "PUT", apiPath: "/api/users/{id}", module: "USERS" },
    DELETE: {
      method: "DELETE",
      apiPath: "/api/users/{id}",
      module: "USERS",
    },
  },
};

export const ALL_MODULES = [
  "COMMON_AREAS",
  "LOCATIONS",
  "ELECTRICITY_RATES",
  "WORK_REGISTRATIONS",
  "REPAIR_REQUEST",
  "NOTIFICATION_MAINTENANCES",
  "QUOTATIONS",
  "ELECTRICITY_USAGES",
  "DEVICES",
  "DEVICE_TYPES",
  "MAINTENANCE_HISTORIES",
  "SYSTEM_MAINTENANCE_SERVICES",
  "SUBCONTRACTS",
  "SYSTEMS",
  "PAYMENT_CONTRACTS",
  "CONTRACTS",
  "OFFICES",
  "CUSTOMER_TYPES",
  "CUSTOMER_TYPE_DOCUMENTS",
  "PERMISSIONS",
  "ROLES",
  "USERS",
];
