package com.ensm.auth.auth;

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

/**
 * 사용자 정보 저장소
 * YAML 파일에서 사용자 정보를 로드하고 관리합니다.
 */
@Component
public class UserStore {
    private List<User> users;

    /**
     * 애플리케이션 시작 시 users.yml 파일에서 사용자 정보를 로드합니다.
     */
    @PostConstruct
    public void loadUsers() {
        java.nio.file.Path configPath = java.nio.file.Paths.get("config/users.yml");
        InputStream input = null;
        
        // config/users.yml을 먼저 확인
        if (java.nio.file.Files.exists(configPath)) {
            try {
                input = java.nio.file.Files.newInputStream(configPath);
            } catch (IOException e) {
                System.err.println("config/users.yml 로드 실패: " + e.getMessage());
            }
        }
        
        // config/users.yml이 없으면 resources/users.yml 확인
        if (input == null) {
            input = getClass().getClassLoader().getResourceAsStream("users.yml");
        }
        
        if (input == null) {
            // 파일이 없으면 빈 리스트로 초기화 (최초 설치 상태)
            this.users = new java.util.ArrayList<>();
            return;
        }
        
        try {
            Yaml yaml = new Yaml();
            UserListWrapper wrapper = yaml.loadAs(input, UserListWrapper.class);
            if (wrapper == null || wrapper.getUsers() == null) {
                this.users = new java.util.ArrayList<>();
            } else {
                this.users = wrapper.getUsers();
            }
        } catch (Exception e) {
            System.err.println("users.yml 파싱 실패: " + e.getMessage());
            this.users = new java.util.ArrayList<>();
        } finally {
            try {
                input.close();
            } catch (IOException e) {
                // 무시
            }
        }
    }
    
    /**
     * 사용자가 등록되어 있는지 확인합니다.
     */
    public boolean hasUsers() {
        return users != null && !users.isEmpty();
    }
    
    /**
     * 새 사용자를 추가합니다.
     */
    public void addUser(User user) {
        if (users == null) {
            users = new java.util.ArrayList<>();
        }
        users.add(user);
        saveUserList();
    }
    
    /**
     * 사용자를 삭제합니다.
     */
    public void removeUser(String username) {
        if (users == null) {
            return;
        }
        users.removeIf(user -> user.getUsername().equals(username));
        saveUserList();
    }
    
    /**
     * 모든 사용자 목록을 반환합니다.
     */
    public List<User> getUsers() {
        return users != null ? users : new java.util.ArrayList<>();
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

    /**
     * 변경된 사용자 정보를 users.yml 파일에 저장합니다.
     */
    public void saveUserList() {
        Yaml yaml = new Yaml();
        UserListWrapper wrapper = new UserListWrapper();
        wrapper.setUsers(this.users);

        try {
            java.nio.file.Path configPath = java.nio.file.Paths.get("config/users.yml");
            java.nio.file.Path configDir = configPath.getParent();
            
            // 디렉토리가 없으면 생성
            if (configDir != null && !java.nio.file.Files.exists(configDir)) {
                java.nio.file.Files.createDirectories(configDir);
            }
            
            // config/users.yml이 없으면 resources/users.yml에 저장 (기존 방식 호환)
            if (!java.nio.file.Files.exists(configPath)) {
                try (Writer writer = new FileWriter("src/main/resources/users.yml")) {
                    yaml.dump(wrapper, writer);
                }
            } else {
                try (Writer writer = java.nio.file.Files.newBufferedWriter(configPath)) {
                    yaml.dump(wrapper, writer);
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to save users.yml", e);
        }
    }
}
