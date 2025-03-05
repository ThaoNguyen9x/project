package com.building_mannager_system.service.impl;

import com.building_mannager_system.entity.PasswordResetToken;
import com.building_mannager_system.entity.Role;
import com.building_mannager_system.entity.User;
import com.building_mannager_system.dto.ResultPaginationDTO;
import com.building_mannager_system.dto.responseDto.ResUserDTO;
import com.building_mannager_system.repository.PasswordResetTokenRepository;
import com.building_mannager_system.repository.RoleRepository;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.security.SecurityUtil;
import com.building_mannager_system.service.EmailService;
import com.building_mannager_system.service.UserService;
import com.building_mannager_system.utils.exception.APIException;
import jakarta.persistence.criteria.JoinType;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;

    public UserServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder,
                           ModelMapper modelMapper,
                           PasswordResetTokenRepository passwordResetTokenRepository,
                           EmailService emailService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.modelMapper = modelMapper;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailService = emailService;
    }

    @Override
    public ResultPaginationDTO getAllUsers(Specification<User> spec, Pageable pageable) {

        String email = SecurityUtil.getCurrentUserLogin().isPresent()
                ? SecurityUtil.getCurrentUserLogin().get()
                : "";

        Specification<User> specWithoutLoggedInUser = spec.and((root, query, builder) ->
                builder.notEqual(root.get("email"), email));

        Page<User> page = userRepository.findAll(specWithoutLoggedInUser, pageable);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(page.getTotalPages());

        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);

        List<ResUserDTO> list = page.getContent()
                .stream()
                .map(item -> modelMapper.map(item, ResUserDTO.class))
                .collect(Collectors.toList());

        rs.setResult(list);

        return rs;
    }

    @Override
    public ResultPaginationDTO getAllUsersUsed(Specification<User> spec, Pageable pageable) {

        Page<User> pageUser = userRepository.findAll(spec.and((root, query, criteriaBuilder) ->
                criteriaBuilder.isNotNull(root.join("customer", JoinType.LEFT).get("id"))
        ), pageable);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageUser.getTotalPages());
        meta.setTotal(pageUser.getTotalElements());
        rs.setMeta(meta);

        List<ResUserDTO> list = pageUser.getContent()
                .stream()
                .map(item -> modelMapper.map(item, ResUserDTO.class))
                .collect(Collectors.toList());
        rs.setResult(list);

        return rs;
    }

    @Override
    @Transactional
    public ResUserDTO createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new APIException(HttpStatus.BAD_REQUEST, "Email đã được sử dụng");
        }

        // Check role
        if (user.getRole() != null) {
            Role role = roleRepository.findById(user.getRole().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Role not found with ID: " + user.getRole().getId()));
            user.setRole(role);
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return modelMapper.map(userRepository.save(user), ResUserDTO.class);
    }

    @Override
    public ResUserDTO getUser(int id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "User not found with ID: " + id));

        return modelMapper.map(user, ResUserDTO.class);
    }

    @Override
    public ResUserDTO updateUser(int id, User user) {
        User ex = userRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "User not found with ID: " + id));


        if (userRepository.existsByEmailAndIdNot(user.getEmail(), id)) {
            throw new APIException(HttpStatus.BAD_REQUEST, "Email đã được sử dụng");
        }

        // Check role
        if (user.getRole() != null) {
            Role role = roleRepository.findById(user.getRole().getId())
                    .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "Role not found with ID: " + user.getRole().getId()));
            user.setRole(role);
        }

        ex.setName(user.getName());
        ex.setEmail(user.getEmail());
        ex.setMobile(user.getMobile());
        ex.setStatus(user.isStatus());
        ex.setRole(user.getRole());

        return modelMapper.map(userRepository.save(ex), ResUserDTO.class);
    }

    @Override
    public void deleteUser(int id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "User not found with ID: " + id));

        userRepository.delete(user);
    }

    @Override
    public void refreshToken(String token, String email) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            user.setRefreshToken(token);
            userRepository.save(user);
        }
    }

    @Value("${frontend.url}")
    String frontendUrl;

    @Override
    public void generatePasswordResetToken(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new APIException(HttpStatus.BAD_REQUEST, "Không tìm thấy");
        }

        String token = UUID.randomUUID().toString();
        Instant expiryDate = Instant.now().plusSeconds(360);
        PasswordResetToken resetToken = new PasswordResetToken(token, expiryDate, user);

        passwordResetTokenRepository.save(resetToken);

        String resetUrl = frontendUrl + "/reset-password?token=" + token;

        // Send email to user
        emailService.sendPasswordResetEmail(user.getEmail(), resetUrl);
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new APIException(HttpStatus.BAD_REQUEST, "Token đặt lại mật khẩu không hợp lệ"));

        if (resetToken.isUsed()) {
            throw new APIException(HttpStatus.BAD_REQUEST, "Token đặt lại mật khẩu đã được sử dụng");
        }

        if (resetToken.getExpiryDate().isBefore(Instant.now())) {
            throw new APIException(HttpStatus.BAD_REQUEST, "Token đặt lại mật khẩu đã hết hạn");
        }

        User user = resetToken.getUser(); // Lấy user từ token
        if (user == null) {
            throw new APIException(HttpStatus.BAD_REQUEST, "Không tìm thấy người dùng liên quan đến token");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
    }

    @Override
    public void changePassword(String email, String oldPassword, String newPassword) {
        User user = userRepository.findByEmail(email);

        if (user != null) {
            if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
                throw new APIException(HttpStatus.BAD_REQUEST, "Mật khẩu cũ không đúng");
            }

            if (passwordEncoder.matches(newPassword, user.getPassword())) {
                throw new APIException(HttpStatus.BAD_REQUEST, "Mật khẩu mới không được trùng với mật khẩu cũ");
            }

            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
        }
    }
}
