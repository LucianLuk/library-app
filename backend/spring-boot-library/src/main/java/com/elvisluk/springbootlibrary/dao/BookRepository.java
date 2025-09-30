package com.elvisluk.springbootlibrary.dao;

import com.elvisluk.springbootlibrary.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {

}
