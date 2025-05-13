package com.RababEraj.EventSaz.controller;

import com.RababEraj.EventSaz.entity.Event;
import com.RababEraj.EventSaz.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin("*")
public class EventController {

    private final EventService eventService;

    @PostMapping("/event")
    public Event postUser(@RequestBody Event event){
        return eventService.postEvent(event);
    }

    @GetMapping("/event")
    public List<Event> getAllEvents() {
        return eventService.findAll();
    }
}
