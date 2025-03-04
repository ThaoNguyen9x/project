package com.building_mannager_system.controller;

import com.building_mannager_system.entity.User;
import com.building_mannager_system.dto.requestDto.ReqChangePasswordDTO;
import com.building_mannager_system.dto.requestDto.ReqLoginDTO;
import com.building_mannager_system.dto.responseDto.ResLoginDTO;
import com.building_mannager_system.entity.account.PageFlutter;
import com.building_mannager_system.repository.UserRepository;
import com.building_mannager_system.repository.account.PageFlutterRepository;
import com.building_mannager_system.security.SecurityUtil;
import com.building_mannager_system.service.UserService;
import com.building_mannager_system.utils.annotation.ApiMessage;
import com.building_mannager_system.utils.exception.APIException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final SecurityUtil securityUtil;
    private final UserRepository userRepository;
    private final UserService userService;
    private final PageFlutterRepository pageFlutterRepository;

    public AuthController(AuthenticationManagerBuilder authenticationManagerBuilder,
                          SecurityUtil securityUtil,
                          UserRepository userRepository,
                          UserService userService,
                          PageFlutterRepository pageFlutterRepository) {
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.securityUtil = securityUtil;
        this.userRepository = userRepository;
        this.userService = userService;
        this.pageFlutterRepository = pageFlutterRepository;
    }

    @PostMapping(value = {"/login", "/sign-in"})
    @ApiMessage("Đăng nhập tài khoản thành công")
    public ResponseEntity<ResLoginDTO> login(@RequestBody ReqLoginDTO loginDTO) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                loginDTO.getEmail(), loginDTO.getPassword()
        );

        User currentUser = userRepository.findByEmail(loginDTO.getEmail());
        if (currentUser == null)
            throw new APIException(HttpStatus.BAD_REQUEST, "Email hoặc password không hợp lệ");

        boolean userStatus = currentUser.isStatus();
        if (!userStatus)
            throw new APIException(HttpStatus.BAD_REQUEST, "Tài khoản người dùng đã bị khóa");

        Authentication authentication = authenticationManagerBuilder.getObject()
                .authenticate(authenticationToken);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        ResLoginDTO res = new ResLoginDTO();
        User currentUserDB = userRepository.findByEmail(loginDTO.getEmail());
        if (currentUserDB != null) {
            ResLoginDTO.UserInfo userInfo = new ResLoginDTO.UserInfo(
                    currentUserDB.getId(),
                    currentUserDB.getName(),
                    currentUserDB.getEmail(),
                    currentUserDB.getMobile(),
                    currentUserDB.getRole(),
                    currentUserDB.getIsOnline()
            );
            res.setUser(userInfo);
        }

        // Create access token
        List<PageFlutter> pageFlutters = pageFlutterRepository.findPageFlutterByRoleIdOrderByRoute(currentUser.getRole().getId());
        String accessToken = securityUtil.createAccessToken(authentication.getName(), res, pageFlutters);
        res.setAccessToken(accessToken);

        // Create refresh token
        String refreshToken = securityUtil.createRefreshToken(loginDTO.getEmail(), res, pageFlutters);

        // Update user
        userService.refreshToken(refreshToken, loginDTO.getEmail());

        // Set cookie
        ResponseCookie resCookie = ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true).secure(true).path("/").maxAge(refreshTokenExpiration).build();

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, resCookie.toString()).body(res);
    }

    @GetMapping("/account")
    @ApiMessage("Lấy tài khoản thành công")
    public ResponseEntity<ResLoginDTO.UserInfo> getAccount() {
        String email = SecurityUtil.getCurrentUserLogin().isPresent()
                ? SecurityUtil.getCurrentUserLogin().get()
                : "";

        User currentUser = userRepository.findByEmail(email);

        ResLoginDTO.UserInfo userInfo = new ResLoginDTO.UserInfo();
        ResLoginDTO.GetAccount getAccount = new ResLoginDTO.GetAccount();

        if (currentUser != null) {
            userInfo.setId(currentUser.getId());
            userInfo.setName(currentUser.getName());
            userInfo.setEmail(currentUser.getEmail());
            userInfo.setRole(currentUser.getRole());

            getAccount.setUser(userInfo);
        }

        return ResponseEntity.ok().body(userInfo);
    }

    @GetMapping("/refresh")
    @ApiMessage("Làm mới tài khoản thành công")
    public ResponseEntity<ResLoginDTO> getRefreshToken(@CookieValue(name = "refresh_token") String refreshToken) {
        Jwt decodedToken = securityUtil.checkValidRefreshToken(refreshToken);
        String email = decodedToken.getSubject();
        User current = userRepository.findByRefreshTokenAndEmail(refreshToken, email);

        if (current == null)
            throw new APIException(HttpStatus.BAD_REQUEST, "Your refresh token is invalid or expired");

        ResLoginDTO res = new ResLoginDTO();
        User currentUser = userRepository.findByEmail(email);
        if (currentUser != null) {
            ResLoginDTO.UserInfo userInfo = new ResLoginDTO.UserInfo(
                    currentUser.getId(),
                    currentUser.getName(),
                    currentUser.getEmail(),
                    currentUser.getMobile(),
                    currentUser.getRole(),
                    currentUser.getIsOnline()
            );
            res.setUser(userInfo);
        }

        List<PageFlutter> pageFlutters = pageFlutterRepository.findPageFlutterByRoleIdOrderByRoute(currentUser.getRole().getId());
        String accessToken = securityUtil.createAccessToken(email, res, pageFlutters);
        res.setAccessToken(accessToken);

        String newRefreshToken = securityUtil.createRefreshToken(email, res, pageFlutters);
        userService.refreshToken(refreshToken, newRefreshToken);

        ResponseCookie resCookie = ResponseCookie.from("refresh_token", newRefreshToken)
                .httpOnly(true).secure(true).path("/").maxAge(refreshTokenExpiration).build();

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, resCookie.toString()).body(res);
    }

    @PostMapping(value = {"/logout", "sign-out"})
    @ApiMessage("Đăng xuất tài khoản thành công")
    public ResponseEntity<Void> logout() {
        String email = SecurityUtil.getCurrentUserLogin().orElse(null);
        userService.refreshToken(null, email);

        ResponseCookie resCookie = ResponseCookie.from("refresh_token", null)
                .httpOnly(true).secure(true).path("/").maxAge(0).build();

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, resCookie.toString()).body(null);
    }

    @PostMapping("/change-password")
    @ApiMessage("Thay đổi mật khẩu thành công")
    public ResponseEntity<Void> changePassword(@RequestBody ReqChangePasswordDTO changePasswordDTO) {
        userService.changePassword(
                changePasswordDTO.getEmail(),
                changePasswordDTO.getOldPassword(),
                changePasswordDTO.getNewPassword());
        return ResponseEntity.ok(null);
    }

    @PostMapping("/forgot-password")
    @ApiMessage("Đã gửi liên kết để đặt lại mật khẩu. Vui lòng kiểm tra")
    public ResponseEntity<Void> forgotPassword(@RequestParam String email) {
        userService.generatePasswordResetToken(email);
        return ResponseEntity.ok(null);
    }

    @PostMapping("/reset-password")
    @ApiMessage("Đặt lại mật khẩu thành công")
    public ResponseEntity<Void> resetPassword(@RequestParam String token,
                                              @RequestParam String newPassword) {
        userService.resetPassword(token, newPassword);
        return ResponseEntity.ok(null);
    }
}
