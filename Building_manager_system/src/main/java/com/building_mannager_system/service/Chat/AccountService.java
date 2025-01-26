//package com.building_mannager_system.service.Chat;
//
//import com.building_mannager_system.dto.loginDto.LoginDto;
//import com.building_mannager_system.dto.requestDto.chat.AccountDto;
//import com.building_mannager_system.entity.Account.Account;
//import com.building_mannager_system.mapper.chat.AccountMapper;
//import com.building_mannager_system.repository.chat.AccountRepository;
//import com.building_mannager_system.repository.chat.ChatRoomRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.Optional;
//import java.util.stream.Collectors;
//
//@Service
//public class AccountService {
//    @Autowired
//    private AccountRepository accountRepository;
//    @Autowired
//    private ChatRoomUserService chatRoomUserService;
//
//    @Autowired
//    private AccountMapper accountMapper;
//
//    public List<AccountDto> getAllAccounts() {
//        return accountRepository.findAll()
//                .stream()
//                .map(accountMapper::toDto)
//                .collect(Collectors.toList());
//    }
//
//    public AccountDto getAccountById(Long id) {
//        return accountMapper.toDto(
//                accountRepository.findById(id)
//                        .orElseThrow(() -> new RuntimeException("Account not found"))
//        );
//    }
//
//    public void updateIsOnlineWebsocket(Long id) {
//        // Kiểm tra xem account có tồn tại không
//        Optional<Account> optionalAccount = accountRepository.findById(id);
//
//        if (optionalAccount.isPresent()) {
//            // Nếu tồn tại, cập nhật trạng thái isOnlineWebsocket
//            Account account = optionalAccount.get();
//            account.setIsOnlineWebsocket(true);
//            accountRepository.save(account);
//        } else {
//            // Nếu không tồn tại, ném ra ngoại lệ hoặc ghi log
//            throw new RuntimeException("Account with ID " + id + " not found");
//        }
//    }
//
//    public List<AccountDto> getAcountBYRomId(Long roomId) {
//        List<Account> accounts = chatRoomUserService.getAccountsByRoomId(roomId);
//        List<AccountDto> accountDtos = accountMapper.toDtoList(accounts);
//
//        return accountDtos;
//    }
//}
