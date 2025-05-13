package com.RababEraj.EventSaz.service;

import com.RababEraj.EventSaz.entity.Feedback;
import com.RababEraj.EventSaz.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;

    public Feedback postFeedback(Feedback feedback){
        return feedbackRepository.save(feedback);
    }
    public List<Feedback> findAll(){
        return feedbackRepository.findAll();
    }
}
