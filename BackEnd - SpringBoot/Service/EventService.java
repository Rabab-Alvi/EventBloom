package com.RababEraj.EventSaz.service;

import com.RababEraj.EventSaz.entity.Event;
import com.RababEraj.EventSaz.entity.User;
import com.RababEraj.EventSaz.repository.EvenetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EvenetRepository eventRepository;

    public Event postEvent(Event event){
        return eventRepository.save(event);
    }
    public List<Event> findAll(){
        return eventRepository.findAll();
    }
}
