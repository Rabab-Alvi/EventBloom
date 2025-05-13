package com.RababEraj.EventSaz.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="Feedback")
public class Feedback {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long feedback_id;

    @Column(name="name")
    private String name;

    @Column(name="rating")
    private int rating;

    @Column(name="comments")
    private String feedback;

    @Column(name="email")
    private String email;

    @Column(name="is_public")
    private boolean isPublic;


}
