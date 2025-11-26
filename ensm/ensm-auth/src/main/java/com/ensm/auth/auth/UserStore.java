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
        InputStream input = null;
        
        // 절대 경로 우선 시도: /opt/ensm/config/users.yml
        java.nio.file.Path configPath = java.nio.file.Paths.get("/opt/ensm/config/users.yml");
        if (java.nio.file.Files.exists(configPath)) {
            try {
                input = java.nio.file.Files.newInputStream(configPath);
            } catch (IOException e) {
                System.err.println("/opt/ensm/config/users.yml 로드 실패: " + e.getMessage());
            }
        }
        
        // 절대 경로가 없으면 상대 경로 시도: config/users.yml
        if (input == null) {
            configPath = java.nio.file.Paths.get("config/users.yml");
            if (java.nio.file.Files.exists(configPath)) {
                try {
                    input = java.nio.file.Files.newInputStream(configPath);
                } catch (IOException e) {
                    System.err.println("config/users.yml 로드 실패: " + e.getMessage());
                }
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
            e.printStackTrace(); // 스택 트레이스 출력
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
        
        // root 계정명 사용 불가 (추가 보안 검증)
        if (user != null && "root".equalsIgnoreCase(user.getUsername())) {
            throw new IllegalArgumentException("root는 예약된 계정명입니다. 다른 사용자명을 사용해주세요.");
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
    
    /**
     * 사용자를 직접 추가합니다 (검증 없이).
     * 내부적으로만 사용되며, replaceRootAccount에서 사용됩니다.
     * 
     * @param user 추가할 사용자
     */
    public void addUserDirectly(User user) {
        if (users == null) {
            users = new java.util.ArrayList<>();
        }
        users.add(user);
        saveUserList();
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

        java.nio.file.Path configPath = null;
        IOException lastException = null;
        
        // 절대 경로 우선 시도: /opt/ensm/config/users.yml
        try {
            configPath = java.nio.file.Paths.get("/opt/ensm/config/users.yml");
            java.nio.file.Path configDir = configPath.getParent();
            
            // 디렉토리가 없으면 생성
            if (configDir != null && !java.nio.file.Files.exists(configDir)) {
                System.out.println("config 디렉토리 생성 시도: " + configDir);
                java.nio.file.Files.createDirectories(configDir);
                System.out.println("config 디렉토리 생성 성공");
                
                // 디렉토리 권한 설정 시도 (실패해도 계속 진행)
                try {
                    java.util.Set<java.nio.file.attribute.PosixFilePermission> permissions = 
                        java.nio.file.attribute.PosixFilePermissions.fromString("rwxr-xr-x");
                    java.nio.file.Files.setPosixFilePermissions(configDir, permissions);
                } catch (Exception e) {
                    System.err.println("디렉토리 권한 설정 실패 (무시됨): " + e.getMessage());
                }
            }
            
            // 파일이 존재하는지 확인
            boolean fileExists = java.nio.file.Files.exists(configPath);
            System.out.println("users.yml 파일 존재 여부: " + fileExists + " (" + configPath + ")");
            
            // 파일이 존재하면 권한 확인
            if (fileExists) {
                try {
                    java.nio.file.attribute.PosixFileAttributeView attrView = 
                        java.nio.file.Files.getFileAttributeView(configPath, 
                            java.nio.file.attribute.PosixFileAttributeView.class);
                    if (attrView != null) {
                        java.nio.file.attribute.PosixFileAttributes attrs = attrView.readAttributes();
                        System.out.println("파일 소유자: " + attrs.owner().getName());
                        System.out.println("파일 권한: " + attrs.permissions());
                    }
                } catch (Exception e) {
                    System.err.println("파일 속성 확인 실패 (무시됨): " + e.getMessage());
                }
            }
            
            // 임시 파일로 먼저 저장한 후 원자적으로 이동 (권한 문제 회피)
            java.nio.file.Path tempPath = configPath.resolveSibling(configPath.getFileName() + ".tmp");
            System.out.println("임시 파일로 저장 시도: " + tempPath);
            
            try (Writer writer = java.nio.file.Files.newBufferedWriter(tempPath, 
                    java.nio.file.StandardOpenOption.CREATE, 
                    java.nio.file.StandardOpenOption.TRUNCATE_EXISTING, 
                    java.nio.file.StandardOpenOption.WRITE)) {
                yaml.dump(wrapper, writer);
            }
            
            System.out.println("임시 파일 저장 성공, 원본 파일로 이동 시도");
            
            // 원본 파일이 존재하면 삭제 후 이동
            if (fileExists) {
                java.nio.file.Files.delete(configPath);
            }
            java.nio.file.Files.move(tempPath, configPath, 
                java.nio.file.StandardCopyOption.ATOMIC_MOVE, 
                java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            
            System.out.println("users.yml 저장 성공: " + configPath);
            
            // 파일 권한 설정 시도 (실패해도 계속 진행)
            try {
                java.util.Set<java.nio.file.attribute.PosixFilePermission> permissions = 
                    java.nio.file.attribute.PosixFilePermissions.fromString("rw-r--r--");
                java.nio.file.Files.setPosixFilePermissions(configPath, permissions);
            } catch (Exception e) {
                System.err.println("파일 권한 설정 실패 (무시됨): " + e.getMessage());
            }
            
            return; // 성공하면 여기서 종료
            
        } catch (IOException e) {
            System.err.println("/opt/ensm/config/users.yml 저장 실패: " + e.getMessage());
            e.printStackTrace();
            lastException = e;
        }
        
        // 절대 경로 실패 시 상대 경로 시도: config/users.yml
        try {
            configPath = java.nio.file.Paths.get("config/users.yml");
            java.nio.file.Path configDir = configPath.getParent();
            
            if (configDir != null && !java.nio.file.Files.exists(configDir)) {
                java.nio.file.Files.createDirectories(configDir);
            }
            
            try (Writer writer = java.nio.file.Files.newBufferedWriter(configPath)) {
                yaml.dump(wrapper, writer);
            }
            
            System.out.println("users.yml 저장 성공 (상대 경로): " + configPath);
            return; // 성공하면 여기서 종료
            
        } catch (IOException e) {
            System.err.println("config/users.yml 저장 실패: " + e.getMessage());
            e.printStackTrace();
            lastException = e;
        }
        
        // 모든 시도 실패
        String errorMsg = "users.yml 저장 실패. 절대 경로와 상대 경로 모두 시도했지만 실패했습니다.";
        if (lastException != null) {
            errorMsg += " 마지막 오류: " + lastException.getMessage();
        }
        System.err.println(errorMsg);
        throw new RuntimeException(errorMsg, lastException);
    }
}

