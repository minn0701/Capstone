[root@rocky9-vm minn0701]# systemctl status ensm-auth.service
systemctl status ensm-main.service
systemctl status ensm.service
systemctl status prometheus.service
systemctl status grafana-server.service
systemctl status loki.service
systemctl status promtail.service
systemctl status node_exporter.service
● ensm-auth.service - ENSM Authentication Server
     Loaded: loaded (/usr/lib/systemd/system/ensm-auth.service; disabled; preset: disabled)
     Active: active (running) since Thu 2025-11-20 14:32:54 UTC; 3min 11s ago
   Main PID: 2408 (java)
      Tasks: 35 (limit: 22882)
     Memory: 209.2M
        CPU: 5.276s
     CGroup: /system.slice/ensm-auth.service
             └─2408 /opt/ensm/java/jdk/bin/java -Xms256m -Xmx512m -jar /opt/ensm/ensm-auth.jar

Nov 20 14:32:56 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:56.680Z  INFO 2408 --- [ensm-auth] [           main] com.en>
Nov 20 14:32:57 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:57.671Z  INFO 2408 --- [ensm-auth] [           main] o.s.b.>
Nov 20 14:32:57 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:57.680Z  INFO 2408 --- [ensm-auth] [           main] o.apac>
Nov 20 14:32:57 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:57.680Z  INFO 2408 --- [ensm-auth] [           main] o.apac>
Nov 20 14:32:57 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:57.718Z  INFO 2408 --- [ensm-auth] [           main] o.a.c.>
Nov 20 14:32:57 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:57.718Z  INFO 2408 --- [ensm-auth] [           main] w.s.c.>
Nov 20 14:32:57 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:57.949Z  INFO 2408 --- [ensm-auth] [           main] o.s.b.>
Nov 20 14:32:58 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:58.201Z  INFO 2408 --- [ensm-auth] [           main] o.s.s.>
Nov 20 14:32:58 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:58.396Z  INFO 2408 --- [ensm-auth] [           main] o.s.b.>
Nov 20 14:32:58 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:58.406Z  INFO 2408 --- [ensm-auth] [           main] com.en>
● ensm-main.service - ENSM Main Server
     Loaded: loaded (/usr/lib/systemd/system/ensm-main.service; disabled; preset: disabled)
     Active: activating (auto-restart) (Result: exit-code) since Thu 2025-11-20 14:36:00 UTC; 8s ago
    Process: 4940 ExecStart=/opt/ensm/java/jdk/bin/java $JAVA_OPTS -jar /opt/ensm/ensm-main.jar (code=exited, status=1/>
   Main PID: 4940 (code=exited, status=1/FAILURE)
        CPU: 264ms
● ensm.service - ENSM - Enterprise Network System Management (All Services)
     Loaded: loaded (/usr/lib/systemd/system/ensm.service; disabled; preset: disabled)
     Active: active (exited) since Thu 2025-11-20 14:32:54 UTC; 3min 13s ago
       Docs: https://github.com/ensm/ensm
   Main PID: 2410 (code=exited, status=0/SUCCESS)
        CPU: 1ms

Nov 20 14:32:54 rocky9-vm systemd[1]: Starting ENSM - Enterprise Network System Management (All Services)...
Nov 20 14:32:54 rocky9-vm systemd[1]: Finished ENSM - Enterprise Network System Management (All Services).
● prometheus.service - Prometheus Monitoring
     Loaded: loaded (/usr/lib/systemd/system/prometheus.service; enabled; preset: disabled)
     Active: active (running) since Thu 2025-11-20 14:32:54 UTC; 3min 13s ago
   Main PID: 2414 (prometheus)
      Tasks: 8 (limit: 22882)
     Memory: 26.3M
        CPU: 165ms
     CGroup: /system.slice/prometheus.service
             └─2414 /usr/local/bin/prometheus --config.file=/etc/prometheus/prometheus.yml --storage.tsdb.path=/var/lib>

Nov 20 14:32:54 rocky9-vm prometheus[2414]: ts=2025-11-20T14:32:54.968Z caller=head.go:831 level=info component=tsdb ms>
Nov 20 14:32:54 rocky9-vm prometheus[2414]: ts=2025-11-20T14:32:54.978Z caller=main.go:1218 level=info fs_type=XFS_SUPE>
Nov 20 14:32:54 rocky9-vm prometheus[2414]: ts=2025-11-20T14:32:54.978Z caller=main.go:1221 level=info msg="TSDB starte>
Nov 20 14:32:54 rocky9-vm prometheus[2414]: ts=2025-11-20T14:32:54.978Z caller=main.go:1404 level=info msg="Loading con>
Nov 20 14:32:54 rocky9-vm prometheus[2414]: ts=2025-11-20T14:32:54.979Z caller=tls_config.go:348 level=info component=w>
Nov 20 14:32:54 rocky9-vm prometheus[2414]: ts=2025-11-20T14:32:54.979Z caller=tls_config.go:351 level=info component=w>
Nov 20 14:32:54 rocky9-vm prometheus[2414]: ts=2025-11-20T14:32:54.993Z caller=main.go:1441 level=info msg="updated GOG>
Nov 20 14:32:54 rocky9-vm prometheus[2414]: ts=2025-11-20T14:32:54.993Z caller=main.go:1452 level=info msg="Completed l>
Nov 20 14:32:54 rocky9-vm prometheus[2414]: ts=2025-11-20T14:32:54.993Z caller=main.go:1182 level=info msg="Server is r>
Nov 20 14:32:54 rocky9-vm prometheus[2414]: ts=2025-11-20T14:32:54.993Z caller=manager.go:164 level=info component="rul>
● grafana-server.service - Grafana instance
     Loaded: loaded (/usr/lib/systemd/system/grafana-server.service; enabled; preset: disabled)
     Active: active (running) since Thu 2025-11-20 14:32:55 UTC; 3min 12s ago
       Docs: http://docs.grafana.org
   Main PID: 2411 (grafana)
      Tasks: 9 (limit: 22882)
     Memory: 145.8M
        CPU: 2.335s
     CGroup: /system.slice/grafana-server.service
             └─2411 /usr/share/grafana/bin/grafana server --config=/etc/grafana/grafana.ini --pidfile=/var/run/grafana/>

Nov 20 14:32:58 rocky9-vm grafana[2411]: logger=plugin.backgroundinstaller t=2025-11-20T14:32:58.237649612Z level=info >
Nov 20 14:32:58 rocky9-vm grafana[2411]: logger=plugin.installer t=2025-11-20T14:32:58.471031219Z level=info msg="Updat>
Nov 20 14:32:59 rocky9-vm grafana[2411]: logger=installer.fs t=2025-11-20T14:32:59.99164714Z level=info msg="Downloaded>
Nov 20 14:33:00 rocky9-vm grafana[2411]: logger=plugins.registration t=2025-11-20T14:33:00.023337203Z level=info msg="P>
Nov 20 14:33:00 rocky9-vm grafana[2411]: logger=plugin.backgroundinstaller t=2025-11-20T14:33:00.023502217Z level=info >
Nov 20 14:34:09 rocky9-vm grafana[2411]: logger=infra.usagestats t=2025-11-20T14:34:09.35826937Z level=info msg="Usage >
Nov 20 14:34:56 rocky9-vm grafana[2411]: logger=infra.usagestats.collector t=2025-11-20T14:34:56.361622155Z level=error>
Nov 20 14:34:56 rocky9-vm grafana[2411]: logger=infra.usagestats t=2025-11-20T14:34:56.36166216Z level=error msg="Faile>
Nov 20 14:34:56 rocky9-vm grafana[2411]: logger=infra.usagestats.collector t=2025-11-20T14:34:56.363968506Z level=error>
Nov 20 14:34:56 rocky9-vm grafana[2411]: logger=infra.usagestats t=2025-11-20T14:34:56.74272089Z level=info msg="Sent u>
× loki.service - Loki Log Aggregation
     Loaded: loaded (/usr/lib/systemd/system/loki.service; enabled; preset: disabled)
     Active: failed (Result: exit-code) since Thu 2025-11-20 14:33:23 UTC; 2min 45s ago
   Duration: 28ms
    Process: 4557 ExecStart=/usr/local/bin/loki --config.file=/etc/loki/config.yml (code=exited, status=1/FAILURE)
   Main PID: 4557 (code=exited, status=1/FAILURE)
        CPU: 30ms

Nov 20 14:33:23 rocky9-vm systemd[1]: loki.service: Main process exited, code=exited, status=1/FAILURE
Nov 20 14:33:23 rocky9-vm systemd[1]: loki.service: Failed with result 'exit-code'.
Nov 20 14:33:23 rocky9-vm systemd[1]: loki.service: Scheduled restart job, restart counter is at 5.
Nov 20 14:33:23 rocky9-vm systemd[1]: Stopped Loki Log Aggregation.
Nov 20 14:33:23 rocky9-vm systemd[1]: loki.service: Start request repeated too quickly.
Nov 20 14:33:23 rocky9-vm systemd[1]: loki.service: Failed with result 'exit-code'.
Nov 20 14:33:23 rocky9-vm systemd[1]: Failed to start Loki Log Aggregation.
● promtail.service - Promtail Log Forwarder
     Loaded: loaded (/usr/lib/systemd/system/promtail.service; enabled; preset: disabled)
     Active: active (running) since Thu 2025-11-20 14:32:54 UTC; 3min 14s ago
   Main PID: 2415 (promtail)
      Tasks: 8 (limit: 22882)
     Memory: 26.6M
        CPU: 1.159s
     CGroup: /system.slice/promtail.service
             └─2415 /usr/local/bin/promtail --config.file=/etc/promtail/config.yml

Nov 20 14:32:59 rocky9-vm promtail[2415]: ts=2025-11-20T14:32:59.938274455Z caller=log.go:168 level=info msg="Seeked /v>
Nov 20 14:32:59 rocky9-vm promtail[2415]: level=info ts=2025-11-20T14:32:59.938291467Z caller=tailer.go:147 component=t>
Nov 20 14:33:01 rocky9-vm promtail[2415]: level=warn ts=2025-11-20T14:33:01.030730194Z caller=client.go:419 component=c>
Nov 20 14:33:01 rocky9-vm promtail[2415]: level=warn ts=2025-11-20T14:33:01.891707348Z caller=client.go:419 component=c>
Nov 20 14:33:03 rocky9-vm promtail[2415]: level=warn ts=2025-11-20T14:33:03.781376655Z caller=client.go:419 component=c>
Nov 20 14:33:06 rocky9-vm promtail[2415]: level=warn ts=2025-11-20T14:33:06.669190798Z caller=client.go:419 component=c>
Nov 20 14:33:11 rocky9-vm promtail[2415]: level=warn ts=2025-11-20T14:33:11.732152245Z caller=client.go:419 component=c>
Nov 20 14:33:25 rocky9-vm promtail[2415]: level=warn ts=2025-11-20T14:33:25.389453053Z caller=client.go:419 component=c>
Nov 20 14:33:41 rocky9-vm promtail[2415]: level=warn ts=2025-11-20T14:33:41.853402397Z caller=client.go:419 component=c>
Nov 20 14:34:37 rocky9-vm promtail[2415]: level=warn ts=2025-11-20T14:34:37.819835284Z caller=client.go:419 component=c>
● node_exporter.service - Node Exporter
     Loaded: loaded (/usr/lib/systemd/system/node_exporter.service; enabled; preset: disabled)
     Active: active (running) since Thu 2025-11-20 14:32:54 UTC; 3min 14s ago
   Main PID: 2413 (node_exporter)
      Tasks: 4 (limit: 22882)
     Memory: 9.9M
        CPU: 102ms
     CGroup: /system.slice/node_exporter.service
             └─2413 /usr/local/bin/node_exporter

Nov 20 14:32:54 rocky9-vm node_exporter[2413]: ts=2025-11-20T14:32:54.856Z caller=node_exporter.go:118 level=info colle>
Nov 20 14:32:54 rocky9-vm node_exporter[2413]: ts=2025-11-20T14:32:54.856Z caller=node_exporter.go:118 level=info colle>
Nov 20 14:32:54 rocky9-vm node_exporter[2413]: ts=2025-11-20T14:32:54.856Z caller=node_exporter.go:118 level=info colle>
Nov 20 14:32:54 rocky9-vm node_exporter[2413]: ts=2025-11-20T14:32:54.856Z caller=node_exporter.go:118 level=info colle>
Nov 20 14:32:54 rocky9-vm node_exporter[2413]: ts=2025-11-20T14:32:54.856Z caller=node_exporter.go:118 level=info colle>
Nov 20 14:32:54 rocky9-vm node_exporter[2413]: ts=2025-11-20T14:32:54.856Z caller=node_exporter.go:118 level=info colle>
Nov 20 14:32:54 rocky9-vm node_exporter[2413]: ts=2025-11-20T14:32:54.856Z caller=node_exporter.go:118 level=info colle>
Nov 20 14:32:54 rocky9-vm node_exporter[2413]: ts=2025-11-20T14:32:54.856Z caller=node_exporter.go:118 level=info colle>
Nov 20 14:32:54 rocky9-vm node_exporter[2413]: ts=2025-11-20T14:32:54.856Z caller=tls_config.go:313 level=info msg="Lis>
Nov 20 14:32:54 rocky9-vm node_exporter[2413]: ts=2025-11-20T14:32:54.856Z caller=tls_config.go:316 level=info msg="TLS>
[root@rocky9-vm minn0701]#



[root@rocky9-vm minn0701]# systemctl is-enabled ensm-auth.service
systemctl is-enabled ensm-main.service
systemctl is-enabled ensm.service
disabled
disabled
disabled
[root@rocky9-vm minn0701]#


[root@rocky9-vm minn0701]# systemctl status ensm-auth.service
systemctl status ensm-main.service
● ensm-auth.service - ENSM Authentication Server
     Loaded: loaded (/usr/lib/systemd/system/ensm-auth.service; disabled; preset: disabled)
     Active: active (running) since Thu 2025-11-20 14:32:54 UTC; 4min 25s ago
   Main PID: 2408 (java)
      Tasks: 35 (limit: 22882)
     Memory: 209.3M
        CPU: 5.453s
     CGroup: /system.slice/ensm-auth.service
             └─2408 /opt/ensm/java/jdk/bin/java -Xms256m -Xmx512m -jar /opt/ensm/ensm-auth.jar

Nov 20 14:32:56 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:56.680Z  INFO 2408 --- [ensm-auth] [           main] com.en>
Nov 20 14:32:57 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:57.671Z  INFO 2408 --- [ensm-auth] [           main] o.s.b.>
Nov 20 14:32:57 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:57.680Z  INFO 2408 --- [ensm-auth] [           main] o.apac>
Nov 20 14:32:57 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:57.680Z  INFO 2408 --- [ensm-auth] [           main] o.apac>
Nov 20 14:32:57 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:57.718Z  INFO 2408 --- [ensm-auth] [           main] o.a.c.>
Nov 20 14:32:57 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:57.718Z  INFO 2408 --- [ensm-auth] [           main] w.s.c.>
Nov 20 14:32:57 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:57.949Z  INFO 2408 --- [ensm-auth] [           main] o.s.b.>
Nov 20 14:32:58 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:58.201Z  INFO 2408 --- [ensm-auth] [           main] o.s.s.>
Nov 20 14:32:58 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:58.396Z  INFO 2408 --- [ensm-auth] [           main] o.s.b.>
Nov 20 14:32:58 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:58.406Z  INFO 2408 --- [ensm-auth] [           main] com.en>
● ensm-main.service - ENSM Main Server
     Loaded: loaded (/usr/lib/systemd/system/ensm-main.service; disabled; preset: disabled)
     Active: activating (auto-restart) (Result: exit-code) since Thu 2025-11-20 14:37:22 UTC; 141ms ago
    Process: 5131 ExecStart=/opt/ensm/java/jdk/bin/java $JAVA_OPTS -jar /opt/ensm/ensm-main.jar (code=exited, status=1/>
   Main PID: 5131 (code=exited, status=1/FAILURE)
        CPU: 314ms

Nov 20 14:37:22 rocky9-vm systemd[1]: ensm-main.service: Main process exited, code=exited, status=1/FAILURE
Nov 20 14:37:22 rocky9-vm systemd[1]: ensm-main.service: Failed with result 'exit-code'.
[root@rocky9-vm minn0701]#

[root@rocky9-vm minn0701]# journalctl -u ensm-auth.service -n 100 --no-pager
journalctl -u ensm-main.service -n 100 --no-pager
Nov 19 13:15:05 rocky9-vm systemd[1]: ensm-auth.service: Main process exited, code=exited, status=203/EXEC
Nov 19 13:15:05 rocky9-vm systemd[1]: ensm-auth.service: Failed with result 'exit-code'.
Nov 19 13:15:16 rocky9-vm systemd[1]: ensm-auth.service: Scheduled restart job, restart counter is at 11.
Nov 19 13:15:16 rocky9-vm systemd[1]: Stopped ENSM Authentication Server.
Nov 19 13:15:16 rocky9-vm systemd[1]: Started ENSM Authentication Server.
Nov 19 13:15:16 rocky9-vm systemd[1526]: ensm-auth.service: Failed to locate executable /opt/ensm/bin/java-auth: No such file or directory
Nov 19 13:15:16 rocky9-vm systemd[1526]: ensm-auth.service: Failed at step EXEC spawning /opt/ensm/bin/java-auth: No such file or directory
Nov 19 13:15:16 rocky9-vm systemd[1]: ensm-auth.service: Main process exited, code=exited, status=203/EXEC
Nov 19 13:15:16 rocky9-vm systemd[1]: ensm-auth.service: Failed with result 'exit-code'.
Nov 19 13:15:26 rocky9-vm systemd[1]: ensm-auth.service: Scheduled restart job, restart counter is at 12.
Nov 19 13:15:26 rocky9-vm systemd[1]: Stopped ENSM Authentication Server.
Nov 19 13:15:26 rocky9-vm systemd[1]: Started ENSM Authentication Server.
Nov 19 13:15:26 rocky9-vm systemd[1533]: ensm-auth.service: Failed to locate executable /opt/ensm/bin/java-auth: No such file or directory
Nov 19 13:15:26 rocky9-vm systemd[1533]: ensm-auth.service: Failed at step EXEC spawning /opt/ensm/bin/java-auth: No such file or directory
Nov 19 13:15:26 rocky9-vm systemd[1]: ensm-auth.service: Main process exited, code=exited, status=203/EXEC
Nov 19 13:15:26 rocky9-vm systemd[1]: ensm-auth.service: Failed with result 'exit-code'.
Nov 19 13:15:36 rocky9-vm systemd[1]: ensm-auth.service: Scheduled restart job, restart counter is at 13.
Nov 19 13:15:36 rocky9-vm systemd[1]: Stopped ENSM Authentication Server.
Nov 19 13:15:36 rocky9-vm systemd[1]: Started ENSM Authentication Server.
Nov 19 13:15:36 rocky9-vm systemd[1539]: ensm-auth.service: Failed to locate executable /opt/ensm/bin/java-auth: No such file or directory
Nov 19 13:15:36 rocky9-vm systemd[1539]: ensm-auth.service: Failed at step EXEC spawning /opt/ensm/bin/java-auth: No such file or directory
Nov 19 13:15:36 rocky9-vm systemd[1]: ensm-auth.service: Main process exited, code=exited, status=203/EXEC
Nov 19 13:15:36 rocky9-vm systemd[1]: ensm-auth.service: Failed with result 'exit-code'.
Nov 19 13:15:46 rocky9-vm systemd[1]: ensm-auth.service: Scheduled restart job, restart counter is at 14.
Nov 19 13:15:46 rocky9-vm systemd[1]: Stopped ENSM Authentication Server.
Nov 19 13:15:46 rocky9-vm systemd[1]: Started ENSM Authentication Server.
Nov 19 13:15:46 rocky9-vm systemd[1545]: ensm-auth.service: Failed to locate executable /opt/ensm/bin/java-auth: No such file or directory
Nov 19 13:15:46 rocky9-vm systemd[1545]: ensm-auth.service: Failed at step EXEC spawning /opt/ensm/bin/java-auth: No such file or directory
Nov 19 13:15:46 rocky9-vm systemd[1]: ensm-auth.service: Main process exited, code=exited, status=203/EXEC
Nov 19 13:15:46 rocky9-vm systemd[1]: ensm-auth.service: Failed with result 'exit-code'.
Nov 19 13:15:57 rocky9-vm systemd[1]: ensm-auth.service: Scheduled restart job, restart counter is at 15.
Nov 19 13:15:57 rocky9-vm systemd[1]: Stopped ENSM Authentication Server.
Nov 19 13:15:57 rocky9-vm systemd[1]: Started ENSM Authentication Server.
Nov 19 13:15:57 rocky9-vm systemd[1551]: ensm-auth.service: Failed to locate executable /opt/ensm/bin/java-auth: No such file or directory
Nov 19 13:15:57 rocky9-vm systemd[1551]: ensm-auth.service: Failed at step EXEC spawning /opt/ensm/bin/java-auth: No such file or directory
Nov 19 13:15:57 rocky9-vm systemd[1]: ensm-auth.service: Main process exited, code=exited, status=203/EXEC
Nov 19 13:15:57 rocky9-vm systemd[1]: ensm-auth.service: Failed with result 'exit-code'.
Nov 19 13:16:07 rocky9-vm systemd[1]: ensm-auth.service: Scheduled restart job, restart counter is at 16.
Nov 19 13:16:07 rocky9-vm systemd[1]: Stopped ENSM Authentication Server.
Nov 19 13:16:07 rocky9-vm systemd[1]: Started ENSM Authentication Server.
Nov 19 13:16:07 rocky9-vm systemd[1559]: ensm-auth.service: Failed to locate executable /opt/ensm/bin/java-auth: No such file or directory
Nov 19 13:16:07 rocky9-vm systemd[1559]: ensm-auth.service: Failed at step EXEC spawning /opt/ensm/bin/java-auth: No such file or directory
Nov 19 13:16:07 rocky9-vm systemd[1]: ensm-auth.service: Main process exited, code=exited, status=203/EXEC
Nov 19 13:16:07 rocky9-vm systemd[1]: ensm-auth.service: Failed with result 'exit-code'.
Nov 19 13:16:17 rocky9-vm systemd[1]: ensm-auth.service: Scheduled restart job, restart counter is at 17.
Nov 19 13:16:17 rocky9-vm systemd[1]: Stopped ENSM Authentication Server.
Nov 19 13:16:17 rocky9-vm systemd[1]: Started ENSM Authentication Server.
Nov 19 13:16:17 rocky9-vm systemd[1567]: ensm-auth.service: Failed to locate executable /opt/ensm/bin/java-auth: No such file or directory
Nov 19 13:16:17 rocky9-vm systemd[1567]: ensm-auth.service: Failed at step EXEC spawning /opt/ensm/bin/java-auth: No such file or directory
Nov 19 13:16:17 rocky9-vm systemd[1]: ensm-auth.service: Main process exited, code=exited, status=203/EXEC
Nov 19 13:16:17 rocky9-vm systemd[1]: ensm-auth.service: Failed with result 'exit-code'.
Nov 19 13:16:27 rocky9-vm systemd[1]: ensm-auth.service: Scheduled restart job, restart counter is at 18.
Nov 19 13:16:27 rocky9-vm systemd[1]: Stopped ENSM Authentication Server.
Nov 19 13:16:27 rocky9-vm systemd[1]: Started ENSM Authentication Server.
Nov 19 13:16:27 rocky9-vm systemd[1639]: ensm-auth.service: Failed to locate executable /opt/ensm/bin/java-auth: No such file or directory
Nov 19 13:16:27 rocky9-vm systemd[1639]: ensm-auth.service: Failed at step EXEC spawning /opt/ensm/bin/java-auth: No such file or directory
Nov 19 13:16:27 rocky9-vm systemd[1]: ensm-auth.service: Main process exited, code=exited, status=203/EXEC
Nov 19 13:16:27 rocky9-vm systemd[1]: ensm-auth.service: Failed with result 'exit-code'.
Nov 19 13:16:37 rocky9-vm systemd[1]: ensm-auth.service: Scheduled restart job, restart counter is at 19.
Nov 19 13:16:37 rocky9-vm systemd[1]: Stopped ENSM Authentication Server.
Nov 19 13:16:37 rocky9-vm systemd[1]: Started ENSM Authentication Server.
Nov 19 13:16:37 rocky9-vm systemd[1647]: ensm-auth.service: Failed to locate executable /opt/ensm/bin/java-auth: No such file or directory
Nov 19 13:16:37 rocky9-vm systemd[1647]: ensm-auth.service: Failed at step EXEC spawning /opt/ensm/bin/java-auth: No such file or directory
Nov 19 13:16:37 rocky9-vm systemd[1]: ensm-auth.service: Main process exited, code=exited, status=203/EXEC
Nov 19 13:16:37 rocky9-vm systemd[1]: ensm-auth.service: Failed with result 'exit-code'.
Nov 19 13:16:48 rocky9-vm systemd[1]: ensm-auth.service: Scheduled restart job, restart counter is at 20.
Nov 19 13:16:48 rocky9-vm systemd[1]: Stopped ENSM Authentication Server.
Nov 19 13:16:48 rocky9-vm systemd[1]: Started ENSM Authentication Server.
Nov 19 13:16:48 rocky9-vm systemd[1657]: ensm-auth.service: Failed to locate executable /opt/ensm/bin/java-auth: No such file or directory
Nov 19 13:16:48 rocky9-vm systemd[1657]: ensm-auth.service: Failed at step EXEC spawning /opt/ensm/bin/java-auth: No such file or directory
Nov 19 13:16:48 rocky9-vm systemd[1]: ensm-auth.service: Main process exited, code=exited, status=203/EXEC
Nov 19 13:16:48 rocky9-vm systemd[1]: ensm-auth.service: Failed with result 'exit-code'.
Nov 19 13:16:58 rocky9-vm systemd[1]: ensm-auth.service: Scheduled restart job, restart counter is at 21.
Nov 19 13:16:58 rocky9-vm systemd[1]: Stopped ENSM Authentication Server.
Nov 19 13:16:58 rocky9-vm systemd[1]: Started ENSM Authentication Server.
Nov 19 13:16:58 rocky9-vm systemd[1700]: ensm-auth.service: Failed to locate executable /opt/ensm/bin/java-auth: No such file or directory
Nov 19 13:16:58 rocky9-vm systemd[1700]: ensm-auth.service: Failed at step EXEC spawning /opt/ensm/bin/java-auth: No such file or directory
Nov 19 13:16:58 rocky9-vm systemd[1]: ensm-auth.service: Main process exited, code=exited, status=203/EXEC
Nov 19 13:16:58 rocky9-vm systemd[1]: ensm-auth.service: Failed with result 'exit-code'.
Nov 19 13:17:01 rocky9-vm systemd[1]: ensm-auth.service: Failed to schedule restart job: Unit ensm-auth.service not found.
Nov 19 13:17:01 rocky9-vm systemd[1]: ensm-auth.service: Failed with result 'exit-code'.
-- Boot bdbeb1a1c41d49d19ede5f1754a810d7 --
Nov 20 14:32:54 rocky9-vm systemd[1]: Started ENSM Authentication Server.
Nov 20 14:32:56 rocky9-vm ensm-auth[2408]:   .   ____          _            __ _ _
Nov 20 14:32:56 rocky9-vm ensm-auth[2408]:  /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
Nov 20 14:32:56 rocky9-vm ensm-auth[2408]: ( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
Nov 20 14:32:56 rocky9-vm ensm-auth[2408]:  \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
Nov 20 14:32:56 rocky9-vm ensm-auth[2408]:   '  |____| .__|_| |_|_| |_\__, | / / / /
Nov 20 14:32:56 rocky9-vm ensm-auth[2408]:  =========|_|==============|___/=/_/_/_/
Nov 20 14:32:56 rocky9-vm ensm-auth[2408]:  :: Spring Boot ::                (v3.2.0)
Nov 20 14:32:56 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:56.678Z  INFO 2408 --- [ensm-auth] [           main] com.ensm.auth.EnsmAuthApplication        : Starting EnsmAuthApplication v0.0.1-SNAPSHOT using Java 21.0.9 with PID 2408 (/opt/ensm/ensm-auth.jar started by ensm in /opt/ensm)
Nov 20 14:32:56 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:56.680Z  INFO 2408 --- [ensm-auth] [           main] com.ensm.auth.EnsmAuthApplication        : No active profile set, falling back to 1 default profile: "default"
Nov 20 14:32:57 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:57.671Z  INFO 2408 --- [ensm-auth] [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port 55556 (http)
Nov 20 14:32:57 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:57.680Z  INFO 2408 --- [ensm-auth] [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
Nov 20 14:32:57 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:57.680Z  INFO 2408 --- [ensm-auth] [           main] o.apache.catalina.core.StandardEngine    : Starting Servlet engine: [Apache Tomcat/10.1.16]
Nov 20 14:32:57 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:57.718Z  INFO 2408 --- [ensm-auth] [           main] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
Nov 20 14:32:57 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:57.718Z  INFO 2408 --- [ensm-auth] [           main] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 982 ms
Nov 20 14:32:57 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:57.949Z  INFO 2408 --- [ensm-auth] [           main] o.s.b.a.w.s.WelcomePageHandlerMapping    : Adding welcome page: class path resource [static/index.html]
Nov 20 14:32:58 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:58.201Z  INFO 2408 --- [ensm-auth] [           main] o.s.s.web.DefaultSecurityFilterChain     : Will secure any request with [org.springframework.security.web.session.DisableEncodeUrlFilter@45c9b3, org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter@38b3f208, org.springframework.security.web.context.SecurityContextHolderFilter@3bf54172, org.springframework.security.web.header.HeaderWriterFilter@21b6c9c2, org.springframework.web.filter.CorsFilter@6680f714, org.springframework.security.web.authentication.logout.LogoutFilter@2dd8ff1d, com.ensm.auth.auth.JwtAuthenticationFilter@53b1a3f8, org.springframework.security.web.savedrequest.RequestCacheAwareFilter@7b3cde6f, org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter@6d091cad, org.springframework.security.web.authentication.AnonymousAuthenticationFilter@7d97e06c, org.springframework.security.web.access.ExceptionTranslationFilter@753fd7a1, org.springframework.security.web.access.intercept.AuthorizationFilter@3a6045c6]
Nov 20 14:32:58 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:58.396Z  INFO 2408 --- [ensm-auth] [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port 55556 (http) with context path ''
Nov 20 14:32:58 rocky9-vm ensm-auth[2408]: 2025-11-20T14:32:58.406Z  INFO 2408 --- [ensm-auth] [           main] com.ensm.auth.EnsmAuthApplication        : Started EnsmAuthApplication in 2.447 seconds (process running for 3.575)
Nov 20 14:37:22 rocky9-vm ensm-main[5131]:         at org.springframework.boot.loader.zip.ZipContent$Loader.load(ZipContent.java:516)
Nov 20 14:37:22 rocky9-vm ensm-main[5131]:         at org.springframework.boot.loader.zip.ZipContent.open(ZipContent.java:372)
Nov 20 14:37:22 rocky9-vm ensm-main[5131]:         at org.springframework.boot.loader.zip.ZipContent.open(ZipContent.java:361)
Nov 20 14:37:22 rocky9-vm ensm-main[5131]:         at org.springframework.boot.loader.jar.NestedJarFileResources.<init>(NestedJarFileResources.java:57)
Nov 20 14:37:22 rocky9-vm ensm-main[5131]:         at org.springframework.boot.loader.jar.NestedJarFile.<init>(NestedJarFile.java:141)
Nov 20 14:37:22 rocky9-vm ensm-main[5131]:         at org.springframework.boot.loader.jar.NestedJarFile.<init>(NestedJarFile.java:120)
Nov 20 14:37:22 rocky9-vm ensm-main[5131]:         at org.springframework.boot.loader.net.protocol.jar.UrlNestedJarFile.<init>(UrlNestedJarFile.java:42)
Nov 20 14:37:22 rocky9-vm ensm-main[5131]:         at org.springframework.boot.loader.net.protocol.jar.UrlJarFileFactory.createJarFileForNested(UrlJarFileFactory.java:86)
Nov 20 14:37:22 rocky9-vm ensm-main[5131]:         at org.springframework.boot.loader.net.protocol.jar.UrlJarFileFactory.createJarFile(UrlJarFileFactory.java:55)
Nov 20 14:37:22 rocky9-vm ensm-main[5131]:         at org.springframework.boot.loader.net.protocol.jar.UrlJarFiles.getOrCreate(UrlJarFiles.java:72)
Nov 20 14:37:22 rocky9-vm ensm-main[5131]:         at org.springframework.boot.loader.net.protocol.jar.JarUrlConnection.connect(JarUrlConnection.java:289)
Nov 20 14:37:22 rocky9-vm ensm-main[5131]:         at org.springframework.boot.loader.net.protocol.jar.JarUrlConnection.getJarFile(JarUrlConnection.java:99)
Nov 20 14:37:22 rocky9-vm ensm-main[5131]:         at org.springframework.boot.loader.net.protocol.jar.JarUrlClassLoader.getJarFile(JarUrlClassLoader.java:185)
Nov 20 14:37:22 rocky9-vm ensm-main[5131]:         at org.springframework.boot.loader.net.protocol.jar.JarUrlClassLoader.definePackage(JarUrlClassLoader.java:143)
Nov 20 14:37:22 rocky9-vm ensm-main[5131]:         at org.springframework.boot.loader.net.protocol.jar.JarUrlClassLoader.definePackageIfNecessary(JarUrlClassLoader.java:126)
Nov 20 14:37:22 rocky9-vm ensm-main[5131]:         at org.springframework.boot.loader.net.protocol.jar.JarUrlClassLoader.loadClass(JarUrlClassLoader.java:99)
Nov 20 14:37:22 rocky9-vm ensm-main[5131]:         at org.springframework.boot.loader.launch.LaunchedClassLoader.loadClass(LaunchedClassLoader.java:91)
Nov 20 14:37:22 rocky9-vm ensm-main[5131]:         at java.base/java.lang.ClassLoader.loadClass(ClassLoader.java:526)
Nov 20 14:37:22 rocky9-vm ensm-main[5131]:         at java.base/java.lang.Class.forName0(Native Method)
Nov 20 14:37:22 rocky9-vm ensm-main[5131]:         at java.base/java.lang.Class.forName(Class.java:536)
Nov 20 14:37:22 rocky9-vm ensm-main[5131]:         at java.base/java.lang.Class.forName(Class.java:515)
Nov 20 14:37:22 rocky9-vm ensm-main[5131]:         at org.springframework.boot.loader.launch.Launcher.launch(Launcher.java:88)
Nov 20 14:37:22 rocky9-vm ensm-main[5131]:         at org.springframework.boot.loader.launch.Launcher.launch(Launcher.java:53)
Nov 20 14:37:22 rocky9-vm ensm-main[5131]:         at org.springframework.boot.loader.launch.JarLauncher.main(JarLauncher.java:58)
Nov 20 14:37:22 rocky9-vm systemd[1]: ensm-main.service: Main process exited, code=exited, status=1/FAILURE
Nov 20 14:37:22 rocky9-vm systemd[1]: ensm-main.service: Failed with result 'exit-code'.
Nov 20 14:37:32 rocky9-vm systemd[1]: ensm-main.service: Scheduled restart job, restart counter is at 27.
Nov 20 14:37:32 rocky9-vm systemd[1]: Stopped ENSM Main Server.
Nov 20 14:37:32 rocky9-vm systemd[1]: Started ENSM Main Server.
Nov 20 14:37:32 rocky9-vm ensm-main[5154]: Exception in thread "main" java.lang.NegativeArraySizeException: -14101
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at org.springframework.boot.loader.zip.ZipContent$Loader.<init>(ZipContent.java:435)
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at org.springframework.boot.loader.zip.ZipContent$Loader.loadContent(ZipContent.java:565)
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at org.springframework.boot.loader.zip.ZipContent$Loader.openAndLoad(ZipContent.java:543)
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at org.springframework.boot.loader.zip.ZipContent$Loader.loadNonNested(ZipContent.java:528)
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at org.springframework.boot.loader.zip.ZipContent$Loader.load(ZipContent.java:514)
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at org.springframework.boot.loader.zip.ZipContent.open(ZipContent.java:372)
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at org.springframework.boot.loader.zip.ZipContent.open(ZipContent.java:349)
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at org.springframework.boot.loader.zip.ZipContent$Loader.load(ZipContent.java:516)
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at org.springframework.boot.loader.zip.ZipContent.open(ZipContent.java:372)
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at org.springframework.boot.loader.zip.ZipContent.open(ZipContent.java:361)
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at org.springframework.boot.loader.jar.NestedJarFileResources.<init>(NestedJarFileResources.java:57)
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at org.springframework.boot.loader.jar.NestedJarFile.<init>(NestedJarFile.java:141)
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at org.springframework.boot.loader.jar.NestedJarFile.<init>(NestedJarFile.java:120)
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at org.springframework.boot.loader.net.protocol.jar.UrlNestedJarFile.<init>(UrlNestedJarFile.java:42)
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at org.springframework.boot.loader.net.protocol.jar.UrlJarFileFactory.createJarFileForNested(UrlJarFileFactory.java:86)
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at org.springframework.boot.loader.net.protocol.jar.UrlJarFileFactory.createJarFile(UrlJarFileFactory.java:55)
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at org.springframework.boot.loader.net.protocol.jar.UrlJarFiles.getOrCreate(UrlJarFiles.java:72)
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at org.springframework.boot.loader.net.protocol.jar.JarUrlConnection.connect(JarUrlConnection.java:289)
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at org.springframework.boot.loader.net.protocol.jar.JarUrlConnection.getJarFile(JarUrlConnection.java:99)
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at org.springframework.boot.loader.net.protocol.jar.JarUrlClassLoader.getJarFile(JarUrlClassLoader.java:185)
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at org.springframework.boot.loader.net.protocol.jar.JarUrlClassLoader.definePackage(JarUrlClassLoader.java:143)
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at org.springframework.boot.loader.net.protocol.jar.JarUrlClassLoader.definePackageIfNecessary(JarUrlClassLoader.java:126)
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at org.springframework.boot.loader.net.protocol.jar.JarUrlClassLoader.loadClass(JarUrlClassLoader.java:99)
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at org.springframework.boot.loader.launch.LaunchedClassLoader.loadClass(LaunchedClassLoader.java:91)
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at java.base/java.lang.ClassLoader.loadClass(ClassLoader.java:526)
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at java.base/java.lang.Class.forName0(Native Method)
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at java.base/java.lang.Class.forName(Class.java:536)
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at java.base/java.lang.Class.forName(Class.java:515)
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at org.springframework.boot.loader.launch.Launcher.launch(Launcher.java:88)
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at org.springframework.boot.loader.launch.Launcher.launch(Launcher.java:53)
Nov 20 14:37:32 rocky9-vm ensm-main[5154]:         at org.springframework.boot.loader.launch.JarLauncher.main(JarLauncher.java:58)
Nov 20 14:37:32 rocky9-vm systemd[1]: ensm-main.service: Main process exited, code=exited, status=1/FAILURE
Nov 20 14:37:32 rocky9-vm systemd[1]: ensm-main.service: Failed with result 'exit-code'.
Nov 20 14:37:42 rocky9-vm systemd[1]: ensm-main.service: Scheduled restart job, restart counter is at 28.
Nov 20 14:37:42 rocky9-vm systemd[1]: Stopped ENSM Main Server.
Nov 20 14:37:42 rocky9-vm systemd[1]: Started ENSM Main Server.
Nov 20 14:37:42 rocky9-vm ensm-main[5176]: Exception in thread "main" java.lang.NegativeArraySizeException: -14101
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at org.springframework.boot.loader.zip.ZipContent$Loader.<init>(ZipContent.java:435)
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at org.springframework.boot.loader.zip.ZipContent$Loader.loadContent(ZipContent.java:565)
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at org.springframework.boot.loader.zip.ZipContent$Loader.openAndLoad(ZipContent.java:543)
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at org.springframework.boot.loader.zip.ZipContent$Loader.loadNonNested(ZipContent.java:528)
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at org.springframework.boot.loader.zip.ZipContent$Loader.load(ZipContent.java:514)
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at org.springframework.boot.loader.zip.ZipContent.open(ZipContent.java:372)
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at org.springframework.boot.loader.zip.ZipContent.open(ZipContent.java:349)
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at org.springframework.boot.loader.zip.ZipContent$Loader.load(ZipContent.java:516)
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at org.springframework.boot.loader.zip.ZipContent.open(ZipContent.java:372)
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at org.springframework.boot.loader.zip.ZipContent.open(ZipContent.java:361)
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at org.springframework.boot.loader.jar.NestedJarFileResources.<init>(NestedJarFileResources.java:57)
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at org.springframework.boot.loader.jar.NestedJarFile.<init>(NestedJarFile.java:141)
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at org.springframework.boot.loader.jar.NestedJarFile.<init>(NestedJarFile.java:120)
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at org.springframework.boot.loader.net.protocol.jar.UrlNestedJarFile.<init>(UrlNestedJarFile.java:42)
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at org.springframework.boot.loader.net.protocol.jar.UrlJarFileFactory.createJarFileForNested(UrlJarFileFactory.java:86)
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at org.springframework.boot.loader.net.protocol.jar.UrlJarFileFactory.createJarFile(UrlJarFileFactory.java:55)
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at org.springframework.boot.loader.net.protocol.jar.UrlJarFiles.getOrCreate(UrlJarFiles.java:72)
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at org.springframework.boot.loader.net.protocol.jar.JarUrlConnection.connect(JarUrlConnection.java:289)
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at org.springframework.boot.loader.net.protocol.jar.JarUrlConnection.getJarFile(JarUrlConnection.java:99)
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at org.springframework.boot.loader.net.protocol.jar.JarUrlClassLoader.getJarFile(JarUrlClassLoader.java:185)
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at org.springframework.boot.loader.net.protocol.jar.JarUrlClassLoader.definePackage(JarUrlClassLoader.java:143)
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at org.springframework.boot.loader.net.protocol.jar.JarUrlClassLoader.definePackageIfNecessary(JarUrlClassLoader.java:126)
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at org.springframework.boot.loader.net.protocol.jar.JarUrlClassLoader.loadClass(JarUrlClassLoader.java:99)
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at org.springframework.boot.loader.launch.LaunchedClassLoader.loadClass(LaunchedClassLoader.java:91)
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at java.base/java.lang.ClassLoader.loadClass(ClassLoader.java:526)
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at java.base/java.lang.Class.forName0(Native Method)
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at java.base/java.lang.Class.forName(Class.java:536)
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at java.base/java.lang.Class.forName(Class.java:515)
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at org.springframework.boot.loader.launch.Launcher.launch(Launcher.java:88)
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at org.springframework.boot.loader.launch.Launcher.launch(Launcher.java:53)
Nov 20 14:37:42 rocky9-vm ensm-main[5176]:         at org.springframework.boot.loader.launch.JarLauncher.main(JarLauncher.java:58)
Nov 20 14:37:42 rocky9-vm systemd[1]: ensm-main.service: Main process exited, code=exited, status=1/FAILURE
Nov 20 14:37:42 rocky9-vm systemd[1]: ensm-main.service: Failed with result 'exit-code'.
[root@rocky9-vm minn0701]# ls -la /opt/ensm/java/jdk/bin/java
/opt/ensm/java/jdk/bin/java -version
-rwxr-xr-x. 1 root root 17760 Oct 23 19:46 /opt/ensm/java/jdk/bin/java
openjdk version "21.0.9" 2025-10-21 LTS
OpenJDK Runtime Environment (Red_Hat-21.0.9.0.10-1) (build 21.0.9+10-LTS)
OpenJDK 64-Bit Server VM (Red_Hat-21.0.9.0.10-1) (build 21.0.9+10-LTS, mixed mode, sharing)
[root@rocky9-vm minn0701]# which java
java -version
/bin/java
openjdk version "21.0.9" 2025-10-21 LTS
OpenJDK Runtime Environment (Red_Hat-21.0.9.0.10-1) (build 21.0.9+10-LTS)
OpenJDK 64-Bit Server VM (Red_Hat-21.0.9.0.10-1) (build 21.0.9+10-LTS, mixed mode, sharing)
[root@rocky9-vm minn0701]# su - ensm
cd /opt/ensm
/opt/ensm/java/jdk/bin/java -jar ensm-auth.jar
This account is currently not available.

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.0)

2025-11-20T14:38:14.302Z  INFO 5302 --- [ensm-auth] [           main] com.ensm.auth.EnsmAuthApplication        : Starting EnsmAuthApplication v0.0.1-SNAPSHOT using Java 21.0.9 with PID 5302 (/opt/ensm/ensm-auth.jar started by root in /opt/ensm)
2025-11-20T14:38:14.304Z  INFO 5302 --- [ensm-auth] [           main] com.ensm.auth.EnsmAuthApplication        : No active profile set, falling back to 1 default profile: "default"
2025-11-20T14:38:15.162Z  INFO 5302 --- [ensm-auth] [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port 55556 (http)
2025-11-20T14:38:15.169Z  INFO 5302 --- [ensm-auth] [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2025-11-20T14:38:15.169Z  INFO 5302 --- [ensm-auth] [           main] o.apache.catalina.core.StandardEngine    : Starting Servlet engine: [Apache Tomcat/10.1.16]
2025-11-20T14:38:15.194Z  INFO 5302 --- [ensm-auth] [           main] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2025-11-20T14:38:15.194Z  INFO 5302 --- [ensm-auth] [           main] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 825 ms
2025-11-20T14:38:15.364Z  INFO 5302 --- [ensm-auth] [           main] o.s.b.a.w.s.WelcomePageHandlerMapping    : Adding welcome page: class path resource [static/index.html]
2025-11-20T14:38:15.463Z  INFO 5302 --- [ensm-auth] [           main] o.s.s.web.DefaultSecurityFilterChain     : Will secure any request with [org.springframework.security.web.session.DisableEncodeUrlFilter@66cd621b, org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter@d3f4505, org.springframework.security.web.context.SecurityContextHolderFilter@2ffb3aec, org.springframework.security.web.header.HeaderWriterFilter@1e692555, org.springframework.web.filter.CorsFilter@3eb292cd, org.springframework.security.web.authentication.logout.LogoutFilter@2c7db926, com.ensm.auth.auth.JwtAuthenticationFilter@7fd987ef, org.springframework.security.web.savedrequest.RequestCacheAwareFilter@46039a21, org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter@431e86b1, org.springframework.security.web.authentication.AnonymousAuthenticationFilter@7209ffb5, org.springframework.security.web.access.ExceptionTranslationFilter@7c663eaf, org.springframework.security.web.access.intercept.AuthorizationFilter@3b4a1a75]
2025-11-20T14:38:15.559Z  WARN 5302 --- [ensm-auth] [           main] ConfigServletWebServerApplicationContext : Exception encountered during context initialization - cancelling refresh attempt: org.springframework.context.ApplicationContextException: Failed to start bean 'webServerStartStop'
2025-11-20T14:38:15.570Z  INFO 5302 --- [ensm-auth] [           main] .s.b.a.l.ConditionEvaluationReportLogger :

Error starting ApplicationContext. To display the condition evaluation report re-run your application with 'debug' enabled.
2025-11-20T14:38:15.582Z ERROR 5302 --- [ensm-auth] [           main] o.s.b.d.LoggingFailureAnalysisReporter   :

***************************
APPLICATION FAILED TO START
***************************

Description:

Web server failed to start. Port 55556 was already in use.

Action:

Identify and stop the process that's listening on port 55556 or configure this application to listen on another port.

[root@rocky9-vm ensm]# ls -lh /opt/ensm/*.jar
-rw-r--r--. 1 root root 23M Nov 20 14:24 /opt/ensm/ensm-auth.jar
-rw-r--r--. 1 root root 89M Nov 20 14:24 /opt/ensm/ensm-main.jar
[root@rocky9-vm ensm]# ls -ld /var/log/ensm/
ls -ld /var/log/ensm/auth/
ls -ld /var/log/ensm/main/
drwxr-xr-x. 4 root root 30 Nov 20 14:24 /var/log/ensm/
drwxr-xr-x. 2 root root 26 Nov 20 14:38 /var/log/ensm/auth/
drwxr-xr-x. 2 root root 6 Nov 20 14:24 /var/log/ensm/main/
[root@rocky9-vm ensm]#


