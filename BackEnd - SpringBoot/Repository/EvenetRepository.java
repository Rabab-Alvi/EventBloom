package com.RababEraj.EventSaz.repository;

import com.RababEraj.EventSaz.entity.Event;
import com.RababEraj.EventSaz.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EvenetRepository extends JpaRepository<Event, Long> {
}
