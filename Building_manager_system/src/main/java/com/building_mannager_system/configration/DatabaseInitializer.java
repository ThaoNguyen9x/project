package com.building_mannager_system.configration;

import com.building_mannager_system.entity.Permission;
import com.building_mannager_system.entity.Role;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.entity.customer_service.customer_manager.CustomerType;
import com.building_mannager_system.entity.customer_service.customer_manager.CustomerTypeDocument;
import com.building_mannager_system.entity.customer_service.officeSpaceAllcation.Location;
import com.building_mannager_system.entity.property_manager.Systems;
import com.building_mannager_system.repository.Contract.CustomerTypeDocumentRepository;
import com.building_mannager_system.repository.Contract.CustomerTypeRepository;
import com.building_mannager_system.repository.PermissionRepository;
import com.building_mannager_system.repository.RoleRepository;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.repository.office.LocationRepository;
import com.building_mannager_system.repository.system_manager.SystemsRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DatabaseInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final PasswordEncoder passwordEncoder;
    private final LocationRepository locationRepository;
    private final CustomerTypeRepository customerTypeRepository;
    private final CustomerTypeDocumentRepository customerTypeDocumentRepository;
    private final SystemsRepository systemsRepository;

    public DatabaseInitializer(UserRepository userRepository,
                               RoleRepository roleRepository,
                               PermissionRepository permissionRepository,
                               PasswordEncoder passwordEncoder,
                               LocationRepository locationRepository,
                               CustomerTypeRepository customerTypeRepository,
                               CustomerTypeDocumentRepository customerTypeDocumentRepository,
                               SystemsRepository systemsRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
        this.passwordEncoder = passwordEncoder;
        this.locationRepository = locationRepository;
        this.customerTypeRepository = customerTypeRepository;
        this.customerTypeDocumentRepository = customerTypeDocumentRepository;
        this.systemsRepository = systemsRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        initializePermissions();
        initializeRoles();
        initializeUsers();
        initializeLocations();
        initializeCustomerTypesAndDocuments();
        initializeSystems();

        System.out.println(">>> DATABASE INITIALIZATION COMPLETED.");
    }

    private void initializePermissions() {
        if (permissionRepository.count() == 0) {
            List<Permission> permissions = List.of(
                    new Permission("Create a permission", "/api/permissions", "POST", "PERMISSIONS"),
                    new Permission("Update a permission", "/api/permissions/{id}", "PUT", "PERMISSIONS"),
                    new Permission("Delete a permission", "/api/permissions/{id}", "DELETE", "PERMISSIONS"),
                    new Permission("Get permissions with pagination", "/api/permissions", "GET", "PERMISSIONS"),

                    new Permission("Create a role", "/api/roles", "POST", "ROLES"),
                    new Permission("Update a role", "/api/roles/{id}", "PUT", "ROLES"),
                    new Permission("Delete a role", "/api/roles/{id}", "DELETE", "ROLES"),
                    new Permission("Get roles with pagination", "/api/roles", "GET", "ROLES"),

                    new Permission("Create a device", "/api/devices", "POST", "DEVICES"),
                    new Permission("Update a device", "/api/devices/{id}", "PUT", "DEVICES"),
                    new Permission("Delete a device", "/api/devices/{id}", "DELETE", "DEVICES"),
                    new Permission("Get devices with pagination", "/api/devices", "GET", "DEVICES"),

                    new Permission("Create a user", "/api/users", "POST", "USERS"),
                    new Permission("Update a user", "/api/users/{id}", "PUT", "USERS"),
                    new Permission("Delete a user", "/api/users/{id}", "DELETE", "USERS"),
                    new Permission("Get users with pagination", "/api/users", "GET", "USERS"),

                    new Permission("Create a customer type", "/api/customer-types", "POST", "CUSTOMER_TYPES"),
                    new Permission("Update a customer type", "/api/customer-types/{id}", "PUT", "CUSTOMER_TYPES"),
                    new Permission("Delete a customer type", "/api/customer-types/{id}", "DELETE", "CUSTOMER_TYPES"),
                    new Permission("Get customer types with pagination", "/api/customer-types", "GET", "CUSTOMER_TYPES"),

                    new Permission("Create a customer type document", "/api/customer-type-documents", "POST", "CUSTOMER_TYPE_DOCUMENTS"),
                    new Permission("Update a customer type document", "/api/customer-type-documents/{id}", "PUT", "CUSTOMER_TYPE_DOCUMENTS"),
                    new Permission("Delete a customer type document", "/api/customer-type-documents/{id}", "DELETE", "CUSTOMER_TYPE_DOCUMENTS"),
                    new Permission("Get customer type documents with pagination", "/api/customer-type-documents", "GET", "CUSTOMER_TYPE_DOCUMENTS"),

                    new Permission("Create a customer", "/api/customers", "POST", "CUSTOMERS"),
                    new Permission("Update a customer", "/api/customers/{id}", "PUT", "CUSTOMERS"),
                    new Permission("Delete a customer", "/api/customers/{id}", "DELETE", "CUSTOMERS"),
                    new Permission("Get customers with pagination", "/api/customers", "GET", "CUSTOMERS"),

                    new Permission("Create a office", "/api/offices", "POST", "OFFICES"),
                    new Permission("Update a office", "/api/offices/{id}", "PUT", "OFFICES"),
                    new Permission("Delete a office", "/api/offices/{id}", "DELETE", "OFFICES"),
                    new Permission("Get offices with pagination", "/api/offices", "GET", "OFFICES"),

                    new Permission("Create a contract", "/api/contracts", "POST", "CONTRACTS"),
                    new Permission("Update a contract", "/api/contracts/{id}", "PUT", "CONTRACTS"),
                    new Permission("Delete a contract", "/api/contracts/{id}", "DELETE", "CONTRACTS"),
                    new Permission("Get contracts with pagination", "/api/contracts", "GET", "CONTRACTS"),

                    new Permission("Create a payment contract", "/api/payments", "POST", "PAYMENT_CONTRACTS"),
                    new Permission("Update a payment contract", "/api/payments/{id}", "PUT", "PAYMENT_CONTRACTS"),
                    new Permission("Delete a payment contract", "/api/payments/{id}", "DELETE", "PAYMENT_CONTRACTS"),
                    new Permission("Get payment contracts with pagination", "/api/payments", "GET", "PAYMENT_CONTRACTS"),
                    new Permission("Send payment request", "/api/payments/sendPaymentRequest/{paymentId}", "POST", "PAYMENT_CONTRACTS"),

                    new Permission("Create a handover status", "/api/handover-status", "POST", "HANDOVER_STATUS"),
                    new Permission("Update a handover status", "/api/handover-status/{id}", "PUT", "HANDOVER_STATUS"),
                    new Permission("Delete a handover status", "/api/handover-status/{id}", "DELETE", "HANDOVER_STATUS"),
                    new Permission("Get handover status with pagination", "/api/handover-status", "GET", "HANDOVER_STATUS"),

                    new Permission("Create a system", "/api/systems", "POST", "SYSTEMS"),
                    new Permission("Update a system", "/api/systems/{id}", "PUT", "SYSTEMS"),
                    new Permission("Delete a system", "/api/systems/{id}", "DELETE", "SYSTEMS"),
                    new Permission("Get systems with pagination", "/api/systems", "GET", "SYSTEMS"),

                    new Permission("Create a subcontractor", "/api/subcontractors", "POST", "SUBCONTRACTS"),
                    new Permission("Update a subcontractor", "/api/subcontractors/{id}", "PUT", "SUBCONTRACTS"),
                    new Permission("Delete a subcontractor", "/api/subcontractors/{id}", "DELETE", "SUBCONTRACTS"),
                    new Permission("Get subcontractors with pagination", "/api/subcontractors", "GET", "SUBCONTRACTS"),

                    new Permission("Create a system maintenance service", "/api/system-maintenances", "POST", "SYSTEM_MAINTENANCE_SERVICES"),
                    new Permission("Update a system maintenance service", "/api/system-maintenances/{id}", "PUT", "SYSTEM_MAINTENANCE_SERVICES"),
                    new Permission("Delete a system maintenance service", "/api/system-maintenances/{id}", "DELETE", "SYSTEM_MAINTENANCE_SERVICES"),
                    new Permission("Get system maintenance services with pagination", "/api/system-maintenances", "GET", "SYSTEM_MAINTENANCE_SERVICES"),

                    new Permission("Create a maintenance history", "/api/maintenance_histories", "POST", "MAINTENANCE_HISTORIES"),
                    new Permission("Update a maintenance history", "/api/maintenance_histories/{id}", "PUT", "MAINTENANCE_HISTORIES"),
                    new Permission("Delete a maintenance history", "/api/maintenance_histories/{id}", "DELETE", "MAINTENANCE_HISTORIES"),
                    new Permission("Get maintenance histories with pagination", "/api/maintenance_histories", "GET", "MAINTENANCE_HISTORIES"),

                    new Permission("Create a device type", "/api/device-types", "POST", "DEVICE_TYPES"),
                    new Permission("Update a device type", "/api/device-types/{id}", "PUT", "DEVICE_TYPES"),
                    new Permission("Delete a device type", "/api/device-types/{id}", "DELETE", "DEVICE_TYPES"),
                    new Permission("Get device types with pagination", "/api/device-types", "GET", "DEVICE_TYPES"),

                    new Permission("Create a electricity usage", "/api/electricity-usages", "POST", "ELECTRICITY_USAGES"),
                    new Permission("Update a electricity usage", "/api/electricity-usages/{id}", "PUT", "ELECTRICITY_USAGES"),
                    new Permission("Delete a electricity usage", "/api/electricity-usages/{id}", "DELETE", "ELECTRICITY_USAGES"),
                    new Permission("Get electricity usages with pagination", "/api/electricity-usages", "GET", "ELECTRICITY_USAGES"),

                    new Permission("Create a meter", "/api/meters", "POST", "METERS"),
                    new Permission("Update a meter", "/api/meters/{id}", "PUT", "METERS"),
                    new Permission("Delete a meter", "/api/meters/{id}", "DELETE", "METERS"),
                    new Permission("Get meters with pagination", "/api/meters", "GET", "METERS"),

                    new Permission("Create a quotation", "/api/quotations", "POST", "QUOTATIONS"),
                    new Permission("Update a quotation", "/api/quotations/{id}", "PUT", "QUOTATIONS"),
                    new Permission("Delete a quotation", "/api/quotations/{id}", "DELETE", "QUOTATIONS"),
                    new Permission("Get quotations with pagination", "/api/quotations", "GET", "QUOTATIONS"),

                    new Permission("Create a repair proposal", "/api/repair-proposals", "POST", "REPAIR_PROPOSALS"),
                    new Permission("Update a repair proposal", "/api/repair-proposals/{id}", "PUT", "REPAIR_PROPOSALS"),
                    new Permission("Delete a repair proposal", "/api/repair-proposals/{id}", "DELETE", "REPAIR_PROPOSALS"),
                    new Permission("Get repair proposals with pagination", "/api/repair-proposals", "GET", "REPAIR_PROPOSALS"),

                    new Permission("Create a notification maintenance", "/api/notifications", "POST", "NOTIFICATION_MAINTENANCES"),
                    new Permission("Update a notification maintenance", "/api/notifications/{id}", "PUT", "NOTIFICATION_MAINTENANCES"),
                    new Permission("Delete a notification maintenance", "/api/notifications/{id}", "DELETE", "NOTIFICATION_MAINTENANCES"),
                    new Permission("Get notification maintenances with pagination", "/api/notifications", "GET", "NOTIFICATION_MAINTENANCES"),

                    new Permission("Create a task", "/api/tasks", "POST", "TASKS"),
                    new Permission("Update a task", "/api/tasks/{id}", "PUT", "TASKS"),
                    new Permission("Delete a task", "/api/tasks/{id}", "DELETE", "TASKS"),
                    new Permission("Get tasks with pagination", "/api/tasks", "GET", "TASKS"),

                    new Permission("Create a task", "/api/tasks", "POST", "TASKS"),
                    new Permission("Update a task", "/api/tasks/{id}", "PUT", "TASKS"),
                    new Permission("Delete a task", "/api/tasks/{id}", "DELETE", "TASKS"),
                    new Permission("Get tasks with pagination", "/api/tasks", "GET", "TASKS"),

                    new Permission("Create a repair request", "/api/repair-requests", "POST", "REPAIR_REQUEST"),
                    new Permission("Update a repair request", "/api/repair-requests/{id}", "PUT", "REPAIR_REQUEST"),
                    new Permission("Delete a repair request", "/api/repair-requests/{id}", "DELETE", "REPAIR_REQUEST"),
                    new Permission("Get repair requests with pagination", "/api/repair-requests", "GET", "REPAIR_REQUEST"),

                    new Permission("Create a work registration", "/api/work-registrations", "POST", "WORK_REGISTRATIONS"),
                    new Permission("Update a work registration", "/api/work-registrations/{id}", "PUT", "WORK_REGISTRATIONS"),
                    new Permission("Delete a work registration", "/api/work-registrations/{id}", "DELETE", "WORK_REGISTRATIONS"),
                    new Permission("Get work registrations with pagination", "/api/work-registrations", "GET", "WORK_REGISTRATIONS"),

                    new Permission("Create a risk assessment", "/api/risk-assessments", "POST", "RISK_ASSESSMENTS"),
                    new Permission("Update a risk assessment", "/api/risk-assessments/{id}", "PUT", "RISK_ASSESSMENTS"),
                    new Permission("Delete a risk assessment", "/api/risk-assessments/{id}", "DELETE", "RISK_ASSESSMENTS"),
                    new Permission("Get risk assessments with pagination", "/api/risk-assessments", "GET", "RISK_ASSESSMENTS")
            );
            permissionRepository.saveAll(permissions);
        }
    }

    private void initializeRoles() {
        if (roleRepository.count() == 0) {
            List<Permission> allPermissions = permissionRepository.findAll();

            Role adminRole = new Role("ADMIN", allPermissions);
            Role userRole = new Role("USER", new ArrayList<>());
            Role technicalRole = new Role("TECHNICAL_MANAGER", new ArrayList<>());
            Role engineeringRole = new Role("ENGINEERING", new ArrayList<>());
            Role serviceRole = new Role("SERVICE", new ArrayList<>());
            Role ceoRole = new Role("CEO", new ArrayList<>());

            roleRepository.saveAll(List.of(adminRole, userRole, technicalRole, engineeringRole, serviceRole, ceoRole));
        }
    }

    private void initializeUsers() {
        if (userRepository.count() == 0) {
            Role adminRole = roleRepository.findByName("ADMIN");
            Role userRole = roleRepository.findByName("USER");
            Role technicalRole = roleRepository.findByName("TECHNICAL_MANAGER");
            Role engineeringRole = roleRepository.findByName("ENGINEERING");
            Role serviceRole = roleRepository.findByName("SERVICE");
            Role ceoRole = roleRepository.findByName("CEO");

            if (adminRole != null && userRole != null) {
                List<User> users = List.of(
                        new User("I'm Admin", "admin@gmail.com", passwordEncoder.encode("1"), adminRole),
                        new User("I'm User", "user@gmail.com", passwordEncoder.encode("1"), userRole),
                        new User("I'm Technical Management", "technical_management@gmail.com", passwordEncoder.encode("1"), technicalRole),
                        new User("I'm Engineering", "engineering@gmail.com", passwordEncoder.encode("1"), engineeringRole),
                        new User("I'm CEO", "ceo@gmail.com", passwordEncoder.encode("1"), ceoRole),
                        new User("I'm Services", "services@gmail.com", passwordEncoder.encode("1"), serviceRole)
                );
                userRepository.saveAll(users);
            }
        }
    }

    private void initializeLocations() {
        if (locationRepository.count() == 0) {
            List<Location> locations = List.of(
                    new Location("Lầu 1"),
                    new Location("Lầu 2"),
                    new Location("Lầu 3"),
                    new Location("Lầu 4"),
                    new Location("Lầu 5"),
                    new Location("Lầu 6"),
                    new Location("Lầu 7"),
                    new Location("Lầu 8"),
                    new Location("Lầu 9"),
                    new Location("Lầu 10"),
                    new Location("Lầu 11"),
                    new Location("Lầu 12")
            );
            locationRepository.saveAll(locations);
        }
    }

    private void initializeCustomerTypesAndDocuments() {
        if (customerTypeRepository.count() == 0) {
            List<CustomerType> customerTypes = List.of(
                    new CustomerType("Customer Type 1"),
                    new CustomerType("Customer Type 2"),
                    new CustomerType("Customer Type 3")
            );
            customerTypes = customerTypeRepository.saveAll(customerTypes);

            if (customerTypeDocumentRepository.count() == 0) {
                List<CustomerTypeDocument> documents = List.of(
                        new CustomerTypeDocument("Document Type 1", customerTypes.get(0)),
                        new CustomerTypeDocument("Document Type 2", customerTypes.get(1)),
                        new CustomerTypeDocument("Document Type 3", customerTypes.get(2))
                );
                customerTypeDocumentRepository.saveAll(documents);
            }
        }
    }

    private void initializeSystems() {
        if (systemsRepository.count() == 0) {
            List<Systems> systems = List.of(
                    new Systems("Hệ thống Điện", 12),
                    new Systems("Hệ thống Cấp thoát nước", 12),
                    new Systems("Hệ thống Điều hòa không khí", 12),
                    new Systems("Hệ thống Phòng cháy", 12)
            );
            systemsRepository.saveAll(systems);
        }
    }
}
