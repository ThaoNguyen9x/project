import axios from "../utils/axios_customize";
import slugify from "slugify";

/**************** CONVERT ****************/
export const convertSlugUrl = (str) => {
  if (!str) return "";

  return slugify(str, {
    lower: true,
    locale: "vi",
  });
};

/**************** AUTH ****************/
export const callLogin = (email, password) => {
  return axios.post(`/api/auth/login`, {
    email,
    password,
  });
};

export const callLogout = () => {
  return axios.post(`/api/auth/logout`);
};

export const callGetAccount = async () => {
  try {
    return await axios.get("/api/auth/account");
  } catch (error) {
    return null;
  }
};

export const callRefreshToken = () => {
  return axios.get("/api/auth/refresh");
};

export const callChangePassword = (email, oldPassword, newPassword) => {
  return axios.post(`/api/auth/change-password`, {
    email,
    oldPassword,
    newPassword,
  });
};

export const callForgotPassword = (email) => {
  return axios.post(`/api/auth/forgot-password?email=${email}`);
};

export const callResetPassword = (token, newPassword) => {
  return axios.post(
    `/api/auth/reset-password?token=${token}&newPassword=${newPassword}`
  );
};

/**************** USER ****************/
export const callGetAllUsers = (query) => {
  return axios.get(`/api/users?${query}`);
};

export const callGetAllUsersUsed = (query) => {
  return axios.get(`/api/users/used?${query}`);
};

export const callCreateUser = (name, email, mobile, password, status, role) => {
  return axios.post("/api/users", {
    name,
    email,
    mobile,
    password,
    status,
    role,
  });
};

export const callUpdateUser = (id, name, email, mobile, status, role) => {
  return axios.put(`/api/users/${id}`, {
    name,
    email,
    mobile,
    status,
    role,
  });
};

export const callDeleteUser = (id) => {
  return axios.delete(`/api/users/${id}`);
};

export const callBulkCreateUser = (id) => {
  return axios.delete(`/api/users/${id}`);
};

export const callChangeStatusUser = (id, status) => {
  return axios.put(`/api/users/change-status/${id}`, {
    id,
    status,
  });
};

/**************** ROLE ****************/
export const callGetAllRoles = (query) => {
  return axios.get(`/api/roles?${query}`);
};

export const callCreateRole = (name, description, permissions, status) => {
  return axios.post("/api/roles", {
    name,
    description,
    permissions,
    status,
  });
};

export const callUpdateRole = (id, name, description, permissions, status) => {
  return axios.put(`/api/roles/${id}`, {
    name,
    description,
    permissions,
    status,
  });
};

export const callDeleteRole = (id) => {
  return axios.delete(`/api/roles/${id}`);
};

export const callChangeStatusRole = (id, status) => {
  return axios.put(`/api/roles/change-status/${id}`, {
    id,
    status,
  });
};

/**************** PERMISSION ****************/
export const callGetAllPermissions = (query) => {
  return axios.get(`/api/permissions?${query}`);
};

export const callCreatePermission = (name, apiPath, method, module, status) => {
  return axios.post("/api/permissions", {
    name,
    apiPath,
    method,
    module,
    status,
  });
};

export const callUpdatePermission = (
  id,
  name,
  apiPath,
  method,
  module,
  status
) => {
  return axios.put(`/api/permissions/${id}`, {
    name,
    apiPath,
    method,
    module,
    status,
  });
};

export const callDeletePermission = (id) => {
  return axios.delete(`/api/permissions/${id}`);
};

export const callChangeStatusPermission = (id, status) => {
  return axios.put(`/api/permissions/change-status/${id}`, {
    id,
    status,
  });
};

/**************** CUSTOMER ****************/
export const callGetAllCustomers = (query) => {
  return axios.get(`/api/customers?${query}`);
};

export const callCreateCustomer = (
  companyName,
  customerType,
  email,
  phone,
  address,
  status,
  directorName,
  birthday,
  user
) => {
  return axios.post("/api/customers", {
    companyName,
    customerType,
    email,
    phone,
    address,
    status,
    directorName,
    birthday,
    user,
  });
};

export const callUpdateCustomer = (
  id,
  companyName,
  customerType,
  email,
  phone,
  address,
  status,
  directorName,
  birthday,
  user
) => {
  return axios.put(`/api/customers/${id}`, {
    companyName,
    customerType,
    email,
    phone,
    address,
    status,
    directorName,
    birthday,
    user,
  });
};

export const callDeleteCustomer = (id) => {
  return axios.delete(`/api/customers/${id}`);
};

/**************** CUSTOMER TYPE DOCUMENT ****************/
export const callGetAllCustomerTypeDocuments = (query) => {
  return axios.get(`/api/customer-type-documents?${query}`);
};

export const callCreateCustomerTypeDocument = (
  documentType,
  status,
  customerType
) => {
  return axios.post("/api/customer-type-documents", {
    documentType,
    status,
    customerType,
  });
};

export const callUpdateCustomerTypeDocument = (
  id,
  documentType,
  status,
  customerType
) => {
  return axios.put(`/api/customer-type-documents/${id}`, {
    documentType,
    status,
    customerType,
  });
};

export const callDeleteCustomerTypeDocument = (id) => {
  return axios.delete(`/api/customer-type-documents/${id}`);
};

/**************** CUSTOMER TYPE ****************/
export const callGetAllCustomerTypes = (query) => {
  return axios.get(`/api/customer-types?${query}`);
};

export const callCreateCustomerType = (typeName, status) => {
  return axios.post("/api/customer-types", {
    typeName,
    status,
  });
};

export const callUpdateCustomerType = (id, typeName, status) => {
  return axios.put(`/api/customer-types/${id}`, {
    typeName,
    status,
  });
};

export const callDeleteCustomerType = (id) => {
  return axios.delete(`/api/customer-types/${id}`);
};

/**************** OFFICE ****************/
export const callGetAllOffices = (query) => {
  return axios.get(`/api/offices?${query}`);
};

export const callCreateOffice = (
  name,
  location,
  area,
  rentPrice,
  serviceFee,
  status,
  drawing
) => {
  return axios.post(
    "/api/offices",
    {
      name,
      location,
      area,
      rentPrice,
      serviceFee,
      status,
      drawing,
    },
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};

export const callUpdateOffice = (
  id,
  name,
  location,
  area,
  rentPrice,
  serviceFee,
  status,
  drawing
) => {
  return axios.put(
    `/api/offices/${id}`,
    {
      name,
      location,
      area,
      rentPrice,
      serviceFee,
      status,
      drawing,
    },
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};

export const callDeleteOffice = (id) => {
  return axios.delete(`/api/offices/${id}`);
};

/**************** LOCATION ****************/
export const callGetAllLocations = (query) => {
  return axios.get(`/api/locations?${query}`);
};

/**************** CONTRACT ****************/
export const callGetAllContracts = (query) => {
  return axios.get(`/api/contracts?${query}`);
};

export const callCreateContract = (
  startDate,
  endDate,
  leaseStatus,
  office,
  customer,
  drawing
) => {
  return axios.post(
    "/api/contracts",
    {
      startDate,
      endDate,
      leaseStatus,
      office,
      customer,
      drawing,
    },
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};

export const callUpdateContract = (
  id,
  startDate,
  endDate,
  leaseStatus,
  office,
  customer,
  drawing
) => {
  return axios.put(
    `/api/contracts/${id}`,
    {
      startDate,
      endDate,
      leaseStatus,
      office,
      customer,
      drawing,
    },
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};

export const callDeleteContract = (id) => {
  return axios.delete(`/api/contracts/${id}`);
};

/**************** PAYMENT CONTRACT ****************/
export const callGetAllPaymentContracts = (query) => {
  return axios.get(`/api/payments?${query}`);
};

export const callCreatePaymentContract = (
  contract,
  paymentAmount,
  paymentDate,
  paymentStatus
) => {
  return axios.post("/api/payments", {
    contract,
    paymentAmount,
    paymentDate,
    paymentStatus,
  });
};

export const callUpdatePaymentContract = (
  paymentId,
  contract,
  paymentAmount,
  paymentDate,
  paymentStatus
) => {
  return axios.put(`/api/payments/${paymentId}`, {
    contract,
    paymentAmount,
    paymentDate,
    paymentStatus,
  });
};

export const callDeletePaymentContract = (paymentId) => {
  return axios.delete(`/api/payments/${paymentId}`);
};

export const callSendPaymentRequest = (paymentId) => {
  return axios.post(`/api/payments/sendPaymentRequest/${paymentId}`);
};

/**************** HANDOVER STATUS ****************/
export const callGetAllHandoverStatus = (query) => {
  return axios.get(`/api/handover-status?${query}`);
};

export const callCreateHandoverStatus = (
  handoverDate,
  status,
  office,
  equipmentFile,
  drawing
) => {
  return axios.post(
    "/api/handover-status",
    {
      handoverDate,
      status,
      office,
      equipmentFile,
      drawing,
    },
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};

export const callUpdateHandoverStatus = (
  id,
  handoverDate,
  status,
  office,
  equipmentFile,
  drawing
) => {
  return axios.put(
    `/api/handover-status/${id}`,
    {
      handoverDate,
      status,
      office,
      equipmentFile,
      drawing,
    },
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};

export const callDeleteHandoverStatus = (id) => {
  return axios.delete(`/api/handover-status/${id}`);
};

/**************** SYSTEM ****************/
export const callGetAllSystems = (query) => {
  return axios.get(`/api/systems?${query}`);
};

export const callCreateSystem = (systemName, description, maintenanceCycle) => {
  return axios.post("/api/systems", {
    systemName,
    description,
    maintenanceCycle,
  });
};

export const callUpdateSystem = (
  id,
  systemName,
  description,
  maintenanceCycle
) => {
  return axios.put(`/api/systems/${id}`, {
    systemName,
    description,
    maintenanceCycle,
  });
};

export const callDeleteSystem = (id) => {
  return axios.delete(`/api/systems/${id}`);
};

/**************** SUBCONTRACT ****************/
export const callGetAllSubcontracts = (query) => {
  return axios.get(`/api/subcontractors?${query}`);
};

export const callCreateSubcontract = (
  name,
  phone,
  serviceType,
  contractStartDate,
  contractEndDate,
  rating,
  system
) => {
  return axios.post("/api/subcontractors", {
    name,
    phone,
    serviceType,
    contractStartDate,
    contractEndDate,
    rating,
    system,
  });
};

export const callUpdateSubcontract = (
  id,
  name,
  phone,
  serviceType,
  contractStartDate,
  contractEndDate,
  rating,
  system
) => {
  return axios.put(`/api/subcontractors/${id}`, {
    name,
    phone,
    serviceType,
    contractStartDate,
    contractEndDate,
    rating,
    system,
  });
};

export const callDeleteSubcontract = (id) => {
  return axios.delete(`/api/subcontractors/${id}`);
};

/**************** SYSTEM MAINTENANCE SERVICES ****************/
export const callGetAllSystemMaintenanceServices = (query) => {
  return axios.get(`/api/system-maintenances?${query}`);
};

export const callCreateSystemMaintenanceService = (
  subcontractor,
  serviceType,
  maintenanceScope,
  frequency,
  nextScheduledDate,
  status
) => {
  return axios.post("/api/system-maintenances", {
    subcontractor,
    serviceType,
    maintenanceScope,
    frequency,
    nextScheduledDate,
    status,
  });
};

export const callUpdateSystemMaintenanceService = (
  id,
  subcontractor,
  serviceType,
  maintenanceScope,
  frequency,
  nextScheduledDate,
  status
) => {
  return axios.put(`/api/system-maintenances/${id}`, {
    subcontractor,
    serviceType,
    maintenanceScope,
    frequency,
    nextScheduledDate,
    status,
  });
};

export const callDeleteSystemMaintenanceService = (id) => {
  return axios.delete(`/api/system-maintenances/${id}`);
};

/**************** SYSTEM MAINTENANCE SERVICES ****************/
export const callGetAllMaintenanceHistories = (query) => {
  return axios.get(`/api/maintenance-histories?${query}`);
};

export const callCreateMaintenanceHistory = (
  maintenanceService,
  performedDate,
  notes,
  technician,
  findings,
  resolution,
  phone
) => {
  return axios.post("/api/maintenance-histories", {
    maintenanceService,
    performedDate,
    notes,
    technician,
    findings,
    resolution,
    phone,
  });
};

export const callUpdateMaintenanceHistory = (
  id,
  maintenanceService,
  performedDate,
  notes,
  technician,
  findings,
  resolution,
  phone
) => {
  return axios.put(`/api/maintenance-histories/${id}`, {
    maintenanceService,
    performedDate,
    notes,
    technician,
    findings,
    resolution,
    phone,
  });
};

export const callDeleteMaintenanceHistory = (id) => {
  return axios.delete(`/api/maintenance-histories/${id}`);
};

/**************** DEVICE TYPES ****************/
export const callGetAllDeviceTypes = (query) => {
  return axios.get(`/api/device-types?${query}`);
};

export const callCreateDeviceType = (typeName, description) => {
  return axios.post("/api/device-types", {
    typeName,
    description,
  });
};

export const callUpdateDeviceType = (id, typeName, description) => {
  return axios.put(`/api/device-types/${id}`, {
    typeName,
    description,
  });
};

export const callDeleteDeviceType = (id) => {
  return axios.delete(`/api/device-types/${id}`);
};

/**************** DEVICES ****************/
export const callGetAllDevices = (query) => {
  return axios.get(`/api/devices?${query}`);
};

export const callCreateDevice = (
  system,
  location,
  deviceType,
  deviceName,
  installationDate,
  lifespan,
  status,
  maintenanceService
) => {
  return axios.post("/api/devices", {
    system,
    location,
    deviceType,
    deviceName,
    installationDate,
    lifespan,
    status,
    maintenanceService,
  });
};

export const callUpdateDevice = (
  id,
  system,
  location,
  deviceType,
  deviceName,
  installationDate,
  lifespan,
  status,
  maintenanceService
) => {
  return axios.put(`/api/devices/${id}`, {
    system,
    location,
    deviceType,
    deviceName,
    installationDate,
    lifespan,
    status,
    maintenanceService,
  });
};

export const callDeleteDevice = (id) => {
  return axios.delete(`/api/devices/${id}`);
};

/**************** ELECTRICITY USAGES ****************/
export const callGetAllElectricityUsages = (query) => {
  return axios.get(`/api/electricity-usages?${query}`);
};

export const callCreateElectricityUsage = (
  meter,
  startReading,
  endReading,
  electricityRate,
  electricityCost,
  readingDate,
  image,
  comments
) => {
  return axios.post(
    "/api/electricity-usages",
    {
      meter,
      startReading,
      endReading,
      electricityRate,
      electricityCost,
      readingDate,
      image,
      comments,
    },
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};

export const callUpdateElectricityUsage = (
  id,
  meter,
  startReading,
  endReading,
  electricityRate,
  electricityCost,
  readingDate,
  image,
  comments
) => {
  return axios.put(
    `/api/electricity-usages/${id}`,
    {
      meter,
      startReading,
      endReading,
      electricityRate,
      electricityCost,
      readingDate,
      image,
      comments,
    },
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};

export const callDeleteElectricityUsage = (id) => {
  return axios.delete(`/api/electricity-usages/${id}`);
};

/**************** METERS ****************/
export const callGetAllMeters = (query) => {
  return axios.get(`/api/meters?${query}`);
};

export const callCreateMeter = (
  serialNumber,
  meterType,
  installationDate,
  office
) => {
  return axios.post("/api/meters", {
    serialNumber,
    meterType,
    installationDate,
    office,
  });
};

export const callUpdateMeter = (
  id,
  serialNumber,
  meterType,
  installationDate,
  office
) => {
  return axios.put(`/api/meters/${id}`, {
    serialNumber,
    meterType,
    installationDate,
    office,
  });
};

export const callDeleteMeter = (id) => {
  return axios.delete(`/api/meters/${id}`);
};

/**************** QUOTATIONS ****************/
export const callGetAllQuotations = (query) => {
  return axios.get(`/api/quotations?${query}`);
};

export const callCreateQuotation = (
  supplierName,
  totalAmount,
  details,
  image,
  status,
  repairProposal
) => {
  return axios.post(
    "/api/quotations",
    {
      supplierName,
      totalAmount,
      details,
      image,
      status,
      repairProposal,
    },
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};

export const callUpdateQuotation = (
  id,
  supplierName,
  totalAmount,
  details,
  image,
  status,
  repairProposal
) => {
  return axios.put(
    `/api/quotations/${id}`,
    {
      supplierName,
      totalAmount,
      details,
      image,
      status,
      repairProposal,
    },
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};

export const callDeleteQuotation = (id) => {
  return axios.delete(`/api/quotations/${id}`);
};

/**************** REPAIR PROPOSALS ****************/
export const callGetAllRepairProposals = (query) => {
  return axios.get(`/api/repair-proposals?${query}`);
};

export const callCreateRepairProposal = (
  title,
  description,
  requestDate,
  priority,
  proposalType,
  riskAssessment,
  status
) => {
  return axios.post("/api/repair-proposals", {
    title,
    description,
    requestDate,
    priority,
    proposalType,
    riskAssessment,
    status,
  });
};

export const callUpdateRepairProposal = (
  id,
  title,
  description,
  requestDate,
  priority,
  proposalType,
  riskAssessment,
  status
) => {
  return axios.put(`/api/repair-proposals/${id}`, {
    title,
    description,
    requestDate,
    priority,
    proposalType,
    riskAssessment,
    status,
  });
};

export const callDeleteRepairProposal = (id) => {
  return axios.delete(`/api/repair-proposals/${id}`);
};

/**************** RISK ASSESSMENTS ****************/
export const callGetAllRiskAssessments = (query) => {
  return axios.get(`/api/risk-assessments?${query}`);
};

export const callCreateRiskAssessment = (
  maintenanceHistory,
  contractor,
  systemType,
  device,
  assessmentDate,
  riskProbability,
  riskImpact,
  riskDetection,
  mitigationAction,
  remarks
) => {
  return axios.post("/api/risk-assessments", {
    maintenanceHistory,
    contractor,
    systemType,
    device,
    assessmentDate,
    riskProbability,
    riskImpact,
    riskDetection,
    mitigationAction,
    remarks,
  });
};

export const callUpdateRiskAssessment = (
  id,
  maintenanceHistory,
  contractor,
  systemType,
  device,
  assessmentDate,
  riskProbability,
  riskImpact,
  riskDetection,
  mitigationAction,
  remarks
) => {
  return axios.put(`/api/risk-assessments/${id}`, {
    maintenanceHistory,
    contractor,
    systemType,
    device,
    assessmentDate,
    riskProbability,
    riskImpact,
    riskDetection,
    mitigationAction,
    remarks,
  });
};

export const callDeleteRiskAssessment = (id) => {
  return axios.delete(`/api/risk-assessments/${id}`);
};

/**************** NOTIFICATIONS ****************/
export const callGetAllNotifications = (query) => {
  return axios.get(`/api/topic/notifications?${query}`);
};

export const callReadNotification = (id) => {
  return axios.put(`/api/topic/notifications/${id}`);
};

/**************** NOTIFICATION MAINTENANCES ****************/
export const callGetAllNotificationMaintenances = (query) => {
  return axios.get(`/api/notifications?${query}`);
};

export const callCreateNotificationMaintenance = (
  title,
  description,
  maintenanceTask,
  recipient
) => {
  return axios.post("/api/notifications", {
    title,
    description,
    maintenanceTask,
    recipient,
  });
};

export const callUpdateNotificationMaintenance = (
  id,
  title,
  description,
  maintenanceTask,
  recipient
) => {
  return axios.put(`/api/notifications/${id}`, {
    title,
    description,
    maintenanceTask,
    recipient,
  });
};

export const callDeleteNotificationMaintenance = (id) => {
  return axios.delete(`/api/notifications/${id}`);
};

export const callReadNotificationMaintenance = (id) => {
  return axios.put(`/api/notifications/change-status/${id}`);
};

/**************** TASKS ****************/
export const callGetAllTasks = (query) => {
  return axios.get(`/api/tasks?${query}`);
};

export const callCreateTask = (
  taskName,
  taskDescription,
  maintenanceType,
  assignedTo,
  assignedToPhone,
  expectedDuration
) => {
  return axios.post("/api/tasks", {
    taskName,
    taskDescription,
    maintenanceType,
    assignedTo,
    assignedToPhone,
    expectedDuration,
  });
};

export const callUpdateTask = (
  id,
  taskName,
  taskDescription,
  maintenanceType,
  assignedTo,
  assignedToPhone,
  expectedDuration
) => {
  return axios.put(`/api/tasks/${id}`, {
    taskName,
    taskDescription,
    maintenanceType,
    assignedTo,
    assignedToPhone,
    expectedDuration,
  });
};

export const callDeleteTask = (id) => {
  return axios.delete(`/api/tasks/${id}`);
};

/**************** REPAIR REQUESTS ****************/
export const callGetAllRepairRequests = (query) => {
  return axios.get(`/api/repair-requests?${query}`);
};

export const callCreateRepairRequest = (
  account,
  requestDate,
  content,
  image,
  status
) => {
  return axios.post(
    "/api/repair-requests",
    {
      account,
      requestDate,
      content,
      image,
      status,
    },
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};

export const callUpdateRepairRequest = (
  id,
  account,
  requestDate,
  content,
  image,
  status
) => {
  return axios.put(
    `/api/repair-requests/${id}`,
    {
      account,
      requestDate,
      content,
      image,
      status,
    },
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};

export const callDeleteRepairRequest = (id) => {
  return axios.delete(`/api/repair-requests/${id}`);
};

/**************** WORK REGISTRATIONS ****************/
export const callGetAllWorkRegistrations = (query) => {
  return axios.get(`/api/work-registrations?${query}`);
};

export const callCreateWorkRegistration = (
  account,
  registrationDate,
  scheduledDate,
  note,
  image,
  status
) => {
  return axios.post(
    "/api/work-registrations",
    {
      account,
      registrationDate,
      scheduledDate,
      note,
      image,
      status,
    },
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};

export const callUpdateWorkRegistration = (
  id,
  account,
  registrationDate,
  scheduledDate,
  note,
  image,
  status
) => {
  return axios.put(`/api/work-registrations/${id}`, {
    account,
    registrationDate,
    scheduledDate,
    note,
    image,
    status,
  });
};

export const callDeleteWorkRegistration = (id) => {
  return axios.delete(`/api/work-registrations/${id}`);
};

/**************** CHATS ****************/
export const callCreateCreateRoomPrivate = (account1Id, account2Id) => {
  return axios.post(
    `/api/chat-rooms/private?account1Id=${account1Id}&account2Id=${account2Id}`
  );
};

export const callCreateGroupChat = ({ accountIds }) => {
  return axios.post(`/api/chat-rooms/group`, { accountIds });
};

export const callSendMessage = (chatRoom, user, content, imageUrl) => {
  return axios.post("/api/chat-messages/sendMessage", {
    chatRoom,
    user,
    content,
    imageUrl,
  });
};

export const callGetMessagesByRoomId = (roomId, query) => {
  return axios.get(`/api/chat-messages/room/${roomId}?${query}`);
};

export const callGetChatRoomUsers = () => {
  return axios.get(`/api/chat-room-users`);
};

export const callGetChatRoomGroups = () => {
  return axios.get(`/api/chat-room-users/group`);
};

export const callDeleteChatHistory = (roomId) => {
  return axios.delete(`/api/chat-messages/chat-history/${roomId}`);
};

export const callChangeStatusMessage = (roomId) => {
  return axios.put(`/api/chat-messages/change-status/${roomId}`);
};

/**************** FILE ****************/
export const callUploadFile = async (formData) => {
  return await axios.post(`/api/files`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const callDownloadFile = (file, folder) => {
  return axios
    .get(`/api/files?fileName=${file}&folder=${folder}`, {
      responseType: "blob",
    })
    .then((obj) => {
      const blob = new Blob([obj.data], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      return { success: true };
    });
};

/**************** ITEM CHECKS ****************/
export const callGetAllItemChecks = (query) => {
  return axios.get(`/api/item-checks?${query}`);
};

export const callGetAllItemChecksByDeviceId = (deviceId, query) => {
  return axios.get(`/api/item-checks/device/${deviceId}?${query}`);
};

export const callCreateItemCheck = (
  device,
  checkCategory,
  checkName,
  standard,
  frequency
) => {
  return axios.post("/api/item-checks", {
    device,
    checkCategory,
    checkName,
    standard,
    frequency,
  });
};

export const callUpdateItemCheck = (
  id,
  device,
  checkCategory,
  checkName,
  standard,
  frequency
) => {
  return axios.put(`/api/item-checks/${id}`, {
    device,
    checkCategory,
    checkName,
    standard,
    frequency,
  });
};

export const callDeleteItemCheck = (id) => {
  return axios.delete(`/api/item-checks/${id}`);
};

/**************** RESULT CHECKS ****************/
export const callGetAllResultChecks = (query) => {
  return axios.get(`/api/result-checks?${query}`);
};

export const callGetAllResultsByCheckItemId = (itemCheckId, query) => {
  return axios.get(`/api/result-checks/item-check/${itemCheckId}?${query}`);
};

export const callCreateResultCheck = (
  itemCheck,
  result,
  note,
  technician,
  checkedAt
) => {
  return axios.post("/api/result-checks", {
    itemCheck,
    result,
    note,
    technician,
    checkedAt,
  });
};

export const callUpdateResultCheck = (
  id,
  itemCheck,
  result,
  note,
  technician,
  checkedAt
) => {
  return axios.put(`/api/result-checks/${id}`, {
    itemCheck,
    result,
    note,
    technician,
    checkedAt,
  });
};

export const callDeleteResultCheck = (id) => {
  return axios.delete(`/api/result-checks/${id}`);
};
