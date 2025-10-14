package com.elvisluk.springbootlibrary.dao;

import com.elvisluk.springbootlibrary.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}
