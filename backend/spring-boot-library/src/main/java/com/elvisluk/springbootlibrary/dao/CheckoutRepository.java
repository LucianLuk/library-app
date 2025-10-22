package com.elvisluk.springbootlibrary.dao;

import com.elvisluk.springbootlibrary.entity.Checkout;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CheckoutRepository extends JpaRepository<Checkout, Long> {

    Checkout findByUserEmailAndBookId(String email, Long bookId);

    List<Checkout> findBooksByUserEmail(String userEmail);
}
