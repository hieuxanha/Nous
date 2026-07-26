package com.example.be.repository;

import com.example.be.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

//     việc viết Optional<User> thay vì trả về user trực tiếp
//    lả 1 chuẩn mục trong lập trinh trong java 8+ trở đi


//   để trách  NullPointerException
//     vầ nếu bạn không dùng op thì bạn phải dùng if RẤT DÀI DÒNG

    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
}