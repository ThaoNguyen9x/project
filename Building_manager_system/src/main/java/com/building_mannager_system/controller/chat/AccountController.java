//package com.building_mannager_system.controller.chat;
//
//import com.building_mannager_system.dto.loginDto.LoginDto;
//import com.building_mannager_system.dto.requestDto.chat.AccountDto;
//import com.building_mannager_system.dto.responseDto.ApiResponce;
//import com.building_mannager_system.entity.Account.Account;
//import com.building_mannager_system.service.chat.AccountService;
//import com.building_mannager_system.service.chat.ChatRoomUserService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/accounts")
//@CrossOrigin(origins = "http://localhost:3000")
//public class AccountController {
//    @Autowired
//    private AccountService accountService;
//
//    @Autowired
//    private ChatRoomUserService chatRoomUserService;
//
//    @Autowired
//    private SimpMessagingTemplate messagingTemplate;
//
//    @GetMapping
//    public List<AccountDto> getAllAccounts() {
//        return accountService.getAllAccounts();
//    }
//
//    @GetMapping("/{id}")
//    public AccountDto getAccountById(@PathVariable Long id) {
//        return accountService.getAccountById(id);
//    }
//
//    @PostMapping
//    public AccountDto createAccount(@RequestBody AccountDto accountDto) {
//        return accountService.createAccount(accountDto);
//    }
//
//    @DeleteMapping("/{id}")
//    public void deleteAccount(@PathVariable Long id) {
//        accountService.deleteAccount(id);
//    }
//
//    @PostMapping("/login")
//    public ResponseEntity<ApiResponce<String>> login(@RequestBody LoginDto loginDto) {
//
//        AccountDto response = accountService.checkAccountByEmailAndPassword(loginDto);
//
//        if (response != null) {
//            String token = "eyJhbGciOiJIUzUxMiJ9." +
//                    "eyJzdWIiOiJ1c2VyQGdtYWlsLmNvbSIsInBlcm1pc3Npb24iOlsiUk9MRV9VU0VSIiwiUk9MRV9BRE1JTiJdLCJleHAiOjE3MzYzODczNTUsImlhdCI6MTczNjMwMDk1NSwidXNlciI6eyJpZCI6MiwibmFtZSI6IkknbSBVc2VyIiwiZW1haWwiOiJ1c2VyQGdtYWlsLmNvbSJ9fQ.Lp-bqXxNxTupHoT_GqDN_LgoRJYYRjHbBJQJHgVuPDPPXbOPFcV4rkKpvs0MXeVhREHf7iSDcpH98P61av4v4Q";
//            ApiResponce<String> responce = new ApiResponce<>(200, token, "Đăng nhập thành công");
//            return ResponseEntity.ok(responce);
//        } else {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                    .body(new ApiResponce<>(401, null, "Sai thông tin đăng nhập"));
//        }
//    }
//
//    @GetMapping("/room/{roomId}")
//    public ResponseEntity<ApiResponce<List<AccountDto>>> getListAccountByRomChatId(
//            @PathVariable("roomId") Long roomId) {
//
//        // Gọi service để lấy danh sách tài khoản
//    List<AccountDto> list = accountService.getAcountBYRomId(roomId);
//
//        // Tạo phản hồi
//        ApiResponce<List<AccountDto>> response;
//        if (list == null || list.isEmpty()) {
//            response = new ApiResponce<>(404, null, "No accounts found for the given room ID.");
//        } else {
//            response = new ApiResponce<>(200, list, "Success");
//        }
//
//        // Trả về ResponseEntity
//        return ResponseEntity.ok(response);
//    }
//
//
//    // WebSocket cập nhật trạng thái online
//    @MessageMapping("/online/{userId}")
//    public void updateOnlineStatus(@PathVariable Long userId, Boolean isOnline) {
//        AccountDto account = accountService.getAccountById(userId);
//        account.setIsOnline(isOnline);
//        accountService.updateAccount(account);
//
//        // Gửi thông báo trạng thái tới tất cả client
//        messagingTemplate.convertAndSend("/topic/online/" + userId, isOnline);
//    }
//}
