package com.elvisluk.springbootlibrary.controller;

import com.elvisluk.springbootlibrary.entity.Message;
import com.elvisluk.springbootlibrary.requestModel.AdminQuestionRequest;
import com.elvisluk.springbootlibrary.service.MessageService;
import com.elvisluk.springbootlibrary.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private MessageService messageService;

    @Autowired
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/secure/add")
    public void postMessage(@RequestHeader(value = "Authorization") String token,
                            @RequestBody Message messageRequest) {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        messageService.postMessage(messageRequest, userEmail);
    }

    @PutMapping("/secure/admin/responseMessage")
    public void responseMessage(@RequestHeader(value = "Authorization") String token,
                                @RequestBody AdminQuestionRequest adminQuestionRequest)
            throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        String admin = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
        if (!"admin".equals(admin)) {
            throw new Exception("Admin only!");
        }
        messageService.responseMessage(adminQuestionRequest, userEmail);
    }
}
