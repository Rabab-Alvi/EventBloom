package com.RababEraj.EventSaz.controller;

import com.RababEraj.EventSaz.entity.Event;
import com.RababEraj.EventSaz.entity.Feedback;
import com.RababEraj.EventSaz.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin("*")
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping("/feedback")
    public Feedback postUser(@RequestBody Feedback feedback) {
        return feedbackService.postFeedback(feedback);
    }

    @GetMapping("/feedback")
    public List<Feedback> getAllEvents() {
        return feedbackService.findAll();
    }
}
