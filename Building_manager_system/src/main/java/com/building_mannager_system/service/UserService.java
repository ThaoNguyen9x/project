package com.building_mannager_system.service;

import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.responseDto.ResUserDTO;
import com.building_mannager_system.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface UserService {

    ResultPaginationDTO getAllUsers(Specification<User> spec, Pageable pageable);

    ResultPaginationDTO getAllUsersUsed(Specification<User> spec, Pageable pageable);

    ResUserDTO createUser(User user);

    ResUserDTO getUser(int id);

    ResUserDTO updateUser(int id, User user);

    void deleteUser(int id);

    void refreshToken(String token, String email);

    void generatePasswordResetToken(String email);

    void resetPassword(String token, String newPassword);

    void changePassword(String email, String oldPassword, String newPassword);
}
