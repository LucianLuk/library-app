package com.elvisluk.springbootlibrary.service;

import com.elvisluk.springbootlibrary.dao.BookRepository;
import com.elvisluk.springbootlibrary.dao.CheckoutRepository;
import com.elvisluk.springbootlibrary.entity.Book;
import com.elvisluk.springbootlibrary.entity.Checkout;
import com.elvisluk.springbootlibrary.responseModel.ShelfCurrentLoansResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.TimeUnit;

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

    public List<ShelfCurrentLoansResponse> currentLoans(String userEmail) throws Exception {
        List<ShelfCurrentLoansResponse> currenLoans = new ArrayList<>();
        List<Checkout> checkoutList = checkoutRepository.findBooksByUserEmail(userEmail);
        ArrayList<Long> bookIdList = new ArrayList<>();
        for (Checkout book : checkoutList) {
            bookIdList.add(book.getBookId());
        }

        List<Book> books = bookRepository.findBooksByBookIds(bookIdList);
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");

        for (Book book : books) {
            Optional<Checkout> checkout = checkoutList.stream().
                    filter(x -> Objects.equals(x.getBookId(), book.getId())).findFirst();
            if (checkout.isPresent()) {
                Date returnDate = simpleDateFormat.parse(checkout.get().getReturnDate());
                Date currentDate = simpleDateFormat.parse(LocalDate.now().toString());

                TimeUnit time = TimeUnit.DAYS;

                long difference_In_Time = time.
                        convert(returnDate.getTime() - currentDate.getTime(),
                                TimeUnit.MILLISECONDS);

                currenLoans.add(new ShelfCurrentLoansResponse(book, (int) difference_In_Time));
            }
        }
        return currenLoans;
    }
}

