package com.building_mannager_system.component;

import com.hellosign.sdk.HelloSignException;
import com.hellosign.sdk.resource.SignatureRequest;
import com.building_mannager_system.utils.annotation.ApiMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dropboxsign")
public class DropboxSignEmailController {

    @Autowired
    private DropboxSignEmailService dropboxSignEmailService;

    /**
     * Endpoint gửi yêu cầu ký qua email sử dụng template của HelloSign.
     * Ví dụ: POST /dropboxsign/send-email/{id}
     *
     * @param id ID của hợp đồng cần gửi yêu cầu ký.
     * @return Thông báo kết quả gửi yêu cầu ký.
     */
    @PostMapping("/send-email/{id}")
    @ApiMessage("Thành công")
    public ResponseEntity<String> sendEmailSignatureRequest(@PathVariable(name = "id") int id) {
        try {
            SignatureRequest request = dropboxSignEmailService.sendEmailSignatureRequestUsingContract(id);
            return ResponseEntity.ok("Yêu cầu ký đã được gửi qua email. Request ID: " + request.getId());
        } catch (HelloSignException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi gửi yêu cầu ký qua email: " + e.getMessage());
        }
    }
}
