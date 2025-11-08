package com.elvisluk.springbootlibrary.controller;

import com.elvisluk.springbootlibrary.requestModel.PaymentInfoRequest;
import com.elvisluk.springbootlibrary.service.PaymentService;
import com.elvisluk.springbootlibrary.utils.ExtractJWT;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("/api/payment/secure")
public class PaymentController {

    private PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/payment-intent")
    public ResponseEntity<String> createPaymentIntent(
            @RequestBody PaymentInfoRequest paymentInfoRequest) throws Exception {
        PaymentIntent paymentIntent = paymentService.createPaymentIntent(paymentInfoRequest);
        String json = paymentIntent.toJson();

        return new ResponseEntity<>(json, HttpStatus.OK);
    }

    @PutMapping("/payment-complete")
    public ResponseEntity<String> stripePaymentComplete(
            @RequestHeader(value = "Authorization") String token) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        if (userEmail == null) {
            throw new Exception("User email is missing!");
        }
        return paymentService.stripePayment(userEmail);
    }
}
