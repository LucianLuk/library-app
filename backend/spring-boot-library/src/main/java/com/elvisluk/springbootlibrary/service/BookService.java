package com.elvisluk.springbootlibrary.service;

import com.elvisluk.springbootlibrary.dao.BookRepository;
import com.elvisluk.springbootlibrary.dao.CheckoutRepository;
import com.elvisluk.springbootlibrary.entity.Book;
import com.elvisluk.springbootlibrary.entity.Checkout;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@Transactional
public class BookService {

    private BookRepository bookRepository;

    private CheckoutRepository checkoutRepository;

    public BookService(BookRepository bookRepository, CheckoutRepository checkoutRepository) {
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
    }

    public Book checkoutBook(String userEmail, Long bookId) throws Exception {
        Optional<Book> bookOptional = bookRepository.findById(bookId);
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if (!bookOptional.isPresent() || validateCheckout != null || bookOptional.get().getCopiesAvailable() <= 0) {
            throw new Exception("Book cannot be checked out because it is either not available or already checked out by the user.");
        }

        // TODO - solve concurrency issue when two users try to check out the last available copy of a book
        // TODO - solve concurrency issue when one user tries to check out the same book multiple times simultaneously
        Book book = bookOptional.get();
        book.setCopiesAvailable(book.getCopiesAvailable() - 1);
        bookRepository.save(book);

        Checkout checkout = new Checkout(userEmail,
                LocalDate.now().toString(),
                LocalDate.now().plusDays(7).toString(),
                book.getId());
        checkoutRepository.save(checkout);

        return book;
    }

    public Boolean isBookCheckedOutByUser(String userEmail, Long bookId) {
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        return validateCheckout != null;
    }

    public int currentLoansCount(String userEmail) {
        return checkoutRepository.findBooksByUserEmail(userEmail).size();
    }
}

