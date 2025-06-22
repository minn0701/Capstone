package ensm.server2.packages;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApacheConfigService {

    private final ShellCommandExecutor executor;

    public String applyConfiguration(ApacheConfigRequest req) {

        List<String[]> commands = new ArrayList<>();

        if (req.getPort() != null) {
            String[] cmd = new String[]{"set_port", req.getPort().toString()};
            System.out.println("명령어: " + java.util.Arrays.toString(cmd));
            commands.add(cmd);
        }
        if (req.getServerName() != null) {
            String[] cmd = new String[]{"set_servername", req.getServerName()};
            System.out.println("명령어: " + java.util.Arrays.toString(cmd));
            commands.add(cmd);
        }
        if (req.getDocumentRoot() != null) {
            String[] cmd = new String[]{"set_docroot", req.getDocumentRoot()};
            System.out.println("명령어: " + java.util.Arrays.toString(cmd));
            commands.add(cmd);
        }
        if (req.getUser() != null) {
            String[] cmd = new String[]{"set_user", req.getUser()};
            System.out.println("명령어: " + java.util.Arrays.toString(cmd));
            commands.add(cmd);
        }
        if (req.getGroup() != null) {
            String[] cmd = new String[]{"set_group", req.getGroup()};
            System.out.println("명령어: " + java.util.Arrays.toString(cmd));
            commands.add(cmd);
        }
        if (Boolean.TRUE.equals(req.getApply())) {
            String[] cmd = new String[]{"apply"};
            System.out.println("명령어: " + java.util.Arrays.toString(cmd));
            commands.add(cmd);
        }

        StringBuilder log = new StringBuilder();
        for (String[] cmd : commands) {
            // 이미 위에서 로그 출력했으니 중복 출력 방지, 필요하다면 여기도 남겨둘 수 있음!
            log.append(String.join(" ", cmd)).append("\n")
                    .append(executor.execute(cmd)).append("\n\n");
        }

        return log.toString();
    }
}