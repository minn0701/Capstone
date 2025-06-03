package com.ensm.server.auth;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import org.yaml.snakeyaml.Yaml;
import org.yaml.snakeyaml.constructor.Constructor;

import java.io.InputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
import java.util.List;
import java.util.Optional;

@Component
public class UserStore {
    private List<User> users;

    @PostConstruct
    public void loadUsers() {
        InputStream input = getClass().getClassLoader().getResourceAsStream("users.yml");
        UserListWrapper wrapper = new Yaml().loadAs(input, UserListWrapper.class);
        this.users = wrapper.getUsers();
    }

    public Optional<User> findByUsername(String username) {
        return users.stream()
            .filter(user -> user.getUsername().equals(username))
            .findFirst();
    }

    public static class UserListWrapper {
        private List<User> users;
        public List<User> getUsers() { return users; }
        public void setUsers(List<User> users) { this.users = users; }
    }

    public void saveUserList() {
        Yaml yaml = new Yaml();
        UserListWrapper wrapper = new UserListWrapper();
        wrapper.setUsers(this.users);

        try (Writer writer = new FileWriter("src/main/resources/users.yml")) {
            yaml.dump(wrapper, writer);
        } catch (IOException e) {
            throw new RuntimeException("Failed to save users.yml", e);
        }
    }
}
