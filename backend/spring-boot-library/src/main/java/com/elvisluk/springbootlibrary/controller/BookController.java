package com.elvisluk.springbootlibrary.controller;

import com.elvisluk.springbootlibrary.entity.Book;
import com.elvisluk.springbootlibrary.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/books")
public class BookController {

    private BookService bookService;

    @Autowired
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @PutMapping("/secure/checkout")
    public Book checkoutBook(@RequestParam Long bookId) throws Exception {
        String userEmail = "testuser@email.com";
        return bookService.checkoutBook(userEmail, bookId);
    }

    @GetMapping("/secure/isBookCheckedOutByUser")
    public Boolean isBookCheckedOutByUser(@RequestParam Long bookId) {
        String userEmail = "testuser@email.com";
        return bookService.isBookCheckedOutByUser(userEmail, bookId);
    }
}
