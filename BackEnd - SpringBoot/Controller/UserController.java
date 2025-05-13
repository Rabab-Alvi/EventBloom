package com.RababEraj.EventSaz.controller;

import com.RababEraj.EventSaz.entity.User;
import com.RababEraj.EventSaz.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin("*")
public class UserController {

    private final UserService userService;

    @PostMapping("/user")
    public User postUser(@RequestBody User user){
        return userService.postUser(user);
    }

    @GetMapping("/user")
    public List<User> getAllUsers() {
        return userService.findAll();
    }
    @GetMapping("/user/{email}/{password}")
    public ResponseEntity<?> getUserByemail(@PathVariable String email, @PathVariable String password){
        Optional<User> user= Optional.ofNullable(userService.loginUser(email, password));
        if(user.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(user);
    }

}
