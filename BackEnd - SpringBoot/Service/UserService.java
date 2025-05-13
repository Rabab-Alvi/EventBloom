package com.RababEraj.EventSaz.service;

import com.RababEraj.EventSaz.entity.User;
import com.RababEraj.EventSaz.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User postUser(User user){
        return userRepository.save(user);
    }
    public List<User> findAll(){
        return userRepository.findAll();
    }
    public Optional<User> getUserbyEmail(String email){
        return userRepository.findByEmail(email);
    }
    public User loginUser(String email, String pass){
        Optional<User> optionalUser=userRepository.findByEmail(email);
        if(optionalUser.isPresent()){
            User existingUser=optionalUser.get();
            String password = existingUser.getPassword();
            if(Objects.equals(password, pass)){
                return existingUser;
            }
        }
        return  null;
    }
}
