package ensm.server2.packages;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ShellCommandExecutor {

    private final ApacheConfigProperties props;

    public String execute(String[] args) {
        // ssh 용 (개발 테스트 용으로 만들었음)
        System.out.println("SSH enabled: " + props.isSshEnabled());
        System.out.println("Script path: " + props.getScriptPath());
        System.out.println("SSH host: " + props.getSshHost());
        System.out.println("실행 명령어 배열: " + java.util.Arrays.toString(args));
        for (String c : args) {
            if (c == null) {
                throw new IllegalArgumentException("명령어 배열에 null이 포함되어 있습니다.");
            }
        }
        List<String> cmd = new ArrayList<>();
        if (props.isSshEnabled()) {
            System.out.println("SSH 실행 경로 진입함"); //테스트 코드
            cmd.add("sshpass");
            cmd.add("-p");
            cmd.add(props.getSshPassword());
            cmd.add("ssh");
            cmd.add(props.getSshUser() + "@" + props.getSshHost());
            cmd.add("sudo");
            cmd.add(props.getScriptPath());
        } else {
            cmd.add(props.getScriptPath());
        }

        for (String arg : args) {
            cmd.add(arg);
        }

        try {
            ProcessBuilder pb = new ProcessBuilder(cmd);
            pb.redirectErrorStream(true);
            Process process = pb.start();
            return new String(process.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            return "[오류] 명령 실행 실패: " + e.getMessage();
        }
    }
}