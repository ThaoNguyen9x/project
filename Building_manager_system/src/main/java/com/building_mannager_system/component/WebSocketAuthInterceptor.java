package com.building_mannager_system.component;

//
//import com.building_mannager_system.dto.requestDto.chat.AccountDto;
//import com.building_mannager_system.entity.Account.Account;
//import com.building_mannager_system.service.chat.AccountService;
//import com.building_mannager_system.untils.JwtUtil;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.server.ServerHttpRequest;
//import org.springframework.http.server.ServerHttpResponse;
//import org.springframework.http.server.ServletServerHttpRequest;
//import org.springframework.stereotype.Component;
//import org.springframework.web.socket.WebSocketHandler;
//import org.springframework.web.socket.server.HandshakeInterceptor;
//
//import java.util.List;
//import java.util.Map;
//
//
//@Component
//public class WebSocketAuthInterceptor  implements HandshakeInterceptor {
//
//    private JwtUtil jwtUtil;
//    private AccountService accountService;
//    public WebSocketAuthInterceptor(JwtUtil jwtUtil, AccountService accountService) {
//        this.jwtUtil = jwtUtil;
//        this.accountService = accountService;
//    }
//    @Override
//    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
//                                   WebSocketHandler wsHandler, Map<String, Object> attributes) {
//        String token = null;
//
//        if (request instanceof ServletServerHttpRequest) {
//            // ✅ Lấy token từ query param
//            String query = ((ServletServerHttpRequest) request).getURI().getQuery();
//            if (query != null && query.contains("token=")) {
//                token = query.split("token=")[1];
//            }
//
//            // ✅ Nếu không có token trong query, kiểm tra token từ header
//            if (token == null) {
//                ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
//                token = servletRequest.getServletRequest().getHeader("Authorization");
//            }
//
//            // ✅ Kiểm tra token và xác thực
//            if (token != null && token.startsWith("Bearer ")) {
//              accountService.updateIsOnlineWebsocket(1l);
////                try {
////                    String jwt = token.replace("Bearer ", "").trim();
////                    if (jwtUtil.validateToken(jwt)) {
////                        attributes.put("user", jwtUtil.extractUserDetails(jwt));
////                        System.out.println("✅ Token hợp lệ, kết nối WebSocket thành công!");
////                        return true;
////                    } else {
////                        response.setStatusCode(HttpStatus.UNAUTHORIZED);
////                        System.out.println("❌ Token không hợp lệ.");
////                        return false;
////                    }
////                } catch (Exception e) {
////                    response.setStatusCode(HttpStatus.UNAUTHORIZED);
////                    System.out.println("❌ Lỗi xử lý token: " + e.getMessage());
////                    return false;
////                }
//                return true;
//            }
//        }
//
//        response.setStatusCode(HttpStatus.UNAUTHORIZED);
//        System.out.println("❌ Token không được cung cấp.");
//        return false;
//    }
//
//
//    @Override
//    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
//                               WebSocketHandler wsHandler, Exception exception) {
//    }
//}
