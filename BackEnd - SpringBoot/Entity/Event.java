package com.RababEraj.EventSaz.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="event")
public class Event {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long event_id;

    @Column(name="organizer_id")
    private Long organizer_id;

    @Column(name="name")
    private String name;

    @Column(name="date")
    private Date date;

    @Column(name="location")
    private String location;

    @Column(name="description")
    private String description;

    @Column(name="live_flag")
    private boolean live_flag;

    @Column(name="time")
    private String time;

    @Column(name="capacity")
    private int capacity;





}
