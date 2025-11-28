[root@rocky9-vm minn0701]# systemctl status promtail.service
systemctl status loki.service
systemctl status grafana-server.service
● promtail.service - Promtail Log Forwarder
     Loaded: loaded (/usr/lib/systemd/system/promtail.service; enabled; preset: disabled)
     Active: active (running) since Thu 2025-11-27 00:55:45 UTC; 15min ago
   Main PID: 5704 (promtail)
      Tasks: 10 (limit: 22882)
     Memory: 44.5M
        CPU: 10.872s
     CGroup: /system.slice/promtail.service
             └─5704 /usr/local/bin/promtail --config.file=/etc/promtail/config.yml

Nov 27 00:55:50 rocky9-vm promtail[5704]: ts=2025-11-27T00:55:50.563511918Z caller=log.go:168 level=info msg="Seeked /var/log/cloud-init.log - &{Offset:0 Whence:0}"
Nov 27 00:55:50 rocky9-vm promtail[5704]: level=info ts=2025-11-27T00:55:50.56356613Z caller=tailer.go:147 component=tailer msg="tail routine: started" path=/var/log/dnf.log
Nov 27 00:55:50 rocky9-vm promtail[5704]: ts=2025-11-27T00:55:50.56358686Z caller=log.go:168 level=info msg="Seeked /var/log/dnf.rpm.log - &{Offset:0 Whence:0}"
Nov 27 00:55:50 rocky9-vm promtail[5704]: level=info ts=2025-11-27T00:55:50.563710815Z caller=tailer.go:147 component=tailer msg="tail routine: started" path=/var/log/dnf.rpm.log
Nov 27 00:55:50 rocky9-vm promtail[5704]: ts=2025-11-27T00:55:50.563754577Z caller=log.go:168 level=info msg="Seeked /var/log/hawkey.log - &{Offset:0 Whence:0}"
Nov 27 00:55:50 rocky9-vm promtail[5704]: level=info ts=2025-11-27T00:55:50.563778623Z caller=tailer.go:147 component=tailer msg="tail routine: started" path=/var/log/cloud-init.>
Nov 27 00:55:50 rocky9-vm promtail[5704]: ts=2025-11-27T00:55:50.563794753Z caller=log.go:168 level=info msg="Seeked /var/log/dnf.librepo.log - &{Offset:0 Whence:0}"
Nov 27 00:55:50 rocky9-vm promtail[5704]: level=info ts=2025-11-27T00:55:50.563832766Z caller=tailer.go:147 component=tailer msg="tail routine: started" path=/var/log/dnf.librepo>
Nov 27 00:55:50 rocky9-vm promtail[5704]: ts=2025-11-27T00:55:50.563857623Z caller=log.go:168 level=info msg="Seeked /var/log/dnf.log - &{Offset:0 Whence:0}"
Nov 27 00:55:50 rocky9-vm promtail[5704]: level=info ts=2025-11-27T00:55:50.563975737Z caller=tailer.go:147 component=tailer msg="tail routine: started" path=/var/log/hawkey.log
● loki.service - Loki Log Aggregation
     Loaded: loaded (/usr/lib/systemd/system/loki.service; enabled; preset: disabled)
     Active: active (running) since Thu 2025-11-27 00:55:45 UTC; 15min ago
   Main PID: 5696 (loki)
      Tasks: 25 (limit: 22882)
     Memory: 66.1M
        CPU: 4.754s
     CGroup: /system.slice/loki.service
             └─5696 /usr/local/bin/loki --config.file=/etc/loki/config.yml

Nov 27 00:55:45 rocky9-vm systemd[1]: Started Loki Log Aggregation.
Nov 27 00:55:45 rocky9-vm loki[5696]: level=error ts=2025-11-27T00:55:45.588350205Z caller=ratestore.go:109 msg="error getting ingester clients" err="empty ring"
● grafana-server.service - Grafana instance
     Loaded: loaded (/usr/lib/systemd/system/grafana-server.service; enabled; preset: disabled)
     Active: active (running) since Thu 2025-11-27 00:55:52 UTC; 15min ago
       Docs: http://docs.grafana.org
   Main PID: 5695 (grafana)
      Tasks: 16 (limit: 22882)
     Memory: 97.0M
        CPU: 4.462s
     CGroup: /system.slice/grafana-server.service
             └─5695 grafana server --config=/etc/grafana/grafana.ini --pidfile=/run/grafana/grafana-server.pid --packaging=tar cfg:default.paths.logs=/var/log/grafana cfg:default>

Nov 27 00:56:26 rocky9-vm grafana-server[5695]: logger=context userId=0 orgId=1 uname= t=2025-11-27T00:56:26.367453226Z level=info msg="Request Completed" method=GET path=/api/li>
Nov 27 00:56:26 rocky9-vm grafana-server[5695]: logger=context userId=0 orgId=1 uname= t=2025-11-27T00:56:26.548416887Z level=info msg="Request Completed" method=GET path=/api/li>
Nov 27 00:56:26 rocky9-vm grafana-server[5695]: logger=context userId=0 orgId=1 uname= t=2025-11-27T00:56:26.691272364Z level=info msg="Request Completed" method=GET path=/api/li>
Nov 27 00:56:27 rocky9-vm grafana-server[5695]: logger=live t=2025-11-27T00:56:27.057110561Z level=info msg="Initialized channel handler" channel=grafana/dashboard/uid/sysmon-gau>
Nov 27 00:57:51 rocky9-vm grafana-server[5695]: logger=infra.usagestats t=2025-11-27T00:57:51.372972845Z level=info msg="Usage stats are ready to report"
Nov 27 01:05:52 rocky9-vm grafana-server[5695]: logger=cleanup t=2025-11-27T01:05:52.369524913Z level=info msg="Completed cleanup jobs" duration=2.686492ms
Nov 27 01:05:52 rocky9-vm grafana-server[5695]: logger=sqlstore.transactions t=2025-11-27T01:05:52.37874422Z level=info msg="Database locked, sleeping then retrying" error="datab>
Nov 27 01:05:52 rocky9-vm grafana-server[5695]: logger=grafana.update.checker t=2025-11-27T01:05:52.50340322Z level=info msg="Update check succeeded" duration=16.691235ms
Nov 27 01:05:52 rocky9-vm grafana-server[5695]: logger=plugins.update.checker t=2025-11-27T01:05:52.809819609Z level=info msg="Update check succeeded" duration=176.23402ms
Nov 27 01:10:49 rocky9-vm grafana-server[5695]: logger=sqlstore.transactions t=2025-11-27T01:10:49.16410855Z level=info msg="Database locked, sleeping then retrying" error="datab>
[root@rocky9-vm minn0701]# systemctl is-enabled promtail.service
systemctl is-enabled loki.service
systemctl is-enabled grafana-server.service
enabled
enabled
enabled
[root@rocky9-vm minn0701]# journalctl -u promtail.service -n 100 --no-pager
Nov 27 00:55:45 rocky9-vm systemd[1]: Started Promtail Log Forwarder.
Nov 27 00:55:45 rocky9-vm promtail[5704]: level=info ts=2025-11-27T00:55:45.548194057Z caller=promtail.go:133 msg="Reloading configuration file" md5sum=b65132b5b3d969c2b966f6b709f08d5f
Nov 27 00:55:45 rocky9-vm promtail[5704]: level=info ts=2025-11-27T00:55:45.562515254Z caller=server.go:354 msg="server listening on addresses" http=[::]:9080 grpc=[::]:34043
Nov 27 00:55:45 rocky9-vm promtail[5704]: level=info ts=2025-11-27T00:55:45.562631014Z caller=main.go:173 msg="Starting Promtail" version="(version=3.0.0, branch=release-3.0.x, revision=b4f7181)"
Nov 27 00:55:45 rocky9-vm promtail[5704]: level=warn ts=2025-11-27T00:55:45.562682822Z caller=promtail.go:263 msg="enable watchConfig"
Nov 27 00:55:50 rocky9-vm promtail[5704]: level=info ts=2025-11-27T00:55:50.562392434Z caller=filetargetmanager.go:372 msg="Adding target" key="/var/log/*.log:{job=\"varlogs\"}"
Nov 27 00:55:50 rocky9-vm promtail[5704]: level=info ts=2025-11-27T00:55:50.562434414Z caller=filetargetmanager.go:372 msg="Adding target" key="/var/log/ensm/**/*.log:{job=\"ensm\"}"
Nov 27 00:55:50 rocky9-vm promtail[5704]: level=info ts=2025-11-27T00:55:50.56256424Z caller=filetarget.go:313 msg="watching new directory" directory=/var/log/ensm/main
Nov 27 00:55:50 rocky9-vm promtail[5704]: level=info ts=2025-11-27T00:55:50.562570893Z caller=filetarget.go:313 msg="watching new directory" directory=/var/log/ensm/auth
Nov 27 00:55:50 rocky9-vm promtail[5704]: level=info ts=2025-11-27T00:55:50.563125023Z caller=filetarget.go:313 msg="watching new directory" directory=/var/log
Nov 27 00:55:50 rocky9-vm promtail[5704]: ts=2025-11-27T00:55:50.563285448Z caller=log.go:168 level=info msg="Seeked /var/log/ensm/auth/auth-app.log - &{Offset:0 Whence:0}"
Nov 27 00:55:50 rocky9-vm promtail[5704]: level=info ts=2025-11-27T00:55:50.563316286Z caller=tailer.go:147 component=tailer msg="tail routine: started" path=/var/log/ensm/auth/auth-app.log
Nov 27 00:55:50 rocky9-vm promtail[5704]: ts=2025-11-27T00:55:50.563355972Z caller=log.go:168 level=info msg="Seeked /var/log/ensm/main/main-app.log - &{Offset:0 Whence:0}"
Nov 27 00:55:50 rocky9-vm promtail[5704]: level=info ts=2025-11-27T00:55:50.563366972Z caller=tailer.go:147 component=tailer msg="tail routine: started" path=/var/log/ensm/main/main-app.log
Nov 27 00:55:50 rocky9-vm promtail[5704]: ts=2025-11-27T00:55:50.563402841Z caller=log.go:168 level=info msg="Seeked /var/log/boot.log - &{Offset:0 Whence:0}"
Nov 27 00:55:50 rocky9-vm promtail[5704]: level=info ts=2025-11-27T00:55:50.563422287Z caller=tailer.go:147 component=tailer msg="tail routine: started" path=/var/log/boot.log
Nov 27 00:55:50 rocky9-vm promtail[5704]: ts=2025-11-27T00:55:50.563435893Z caller=log.go:168 level=info msg="Seeked /var/log/cloud-init-output.log - &{Offset:0 Whence:0}"
Nov 27 00:55:50 rocky9-vm promtail[5704]: level=info ts=2025-11-27T00:55:50.563488513Z caller=tailer.go:147 component=tailer msg="tail routine: started" path=/var/log/cloud-init-output.log
Nov 27 00:55:50 rocky9-vm promtail[5704]: ts=2025-11-27T00:55:50.563511918Z caller=log.go:168 level=info msg="Seeked /var/log/cloud-init.log - &{Offset:0 Whence:0}"
Nov 27 00:55:50 rocky9-vm promtail[5704]: level=info ts=2025-11-27T00:55:50.56356613Z caller=tailer.go:147 component=tailer msg="tail routine: started" path=/var/log/dnf.log
Nov 27 00:55:50 rocky9-vm promtail[5704]: ts=2025-11-27T00:55:50.56358686Z caller=log.go:168 level=info msg="Seeked /var/log/dnf.rpm.log - &{Offset:0 Whence:0}"
Nov 27 00:55:50 rocky9-vm promtail[5704]: level=info ts=2025-11-27T00:55:50.563710815Z caller=tailer.go:147 component=tailer msg="tail routine: started" path=/var/log/dnf.rpm.log
Nov 27 00:55:50 rocky9-vm promtail[5704]: ts=2025-11-27T00:55:50.563754577Z caller=log.go:168 level=info msg="Seeked /var/log/hawkey.log - &{Offset:0 Whence:0}"
Nov 27 00:55:50 rocky9-vm promtail[5704]: level=info ts=2025-11-27T00:55:50.563778623Z caller=tailer.go:147 component=tailer msg="tail routine: started" path=/var/log/cloud-init.log
Nov 27 00:55:50 rocky9-vm promtail[5704]: ts=2025-11-27T00:55:50.563794753Z caller=log.go:168 level=info msg="Seeked /var/log/dnf.librepo.log - &{Offset:0 Whence:0}"
Nov 27 00:55:50 rocky9-vm promtail[5704]: level=info ts=2025-11-27T00:55:50.563832766Z caller=tailer.go:147 component=tailer msg="tail routine: started" path=/var/log/dnf.librepo.log
Nov 27 00:55:50 rocky9-vm promtail[5704]: ts=2025-11-27T00:55:50.563857623Z caller=log.go:168 level=info msg="Seeked /var/log/dnf.log - &{Offset:0 Whence:0}"
Nov 27 00:55:50 rocky9-vm promtail[5704]: level=info ts=2025-11-27T00:55:50.563975737Z caller=tailer.go:147 component=tailer msg="tail routine: started" path=/var/log/hawkey.log
[root@rocky9-vm minn0701]# ls -la /var/lib/promtail/positions.yaml
cat /var/lib/promtail/positions.yaml
-rw-------. 1 root root 467 Nov 27 01:11 /var/lib/promtail/positions.yaml
positions:
  /var/log/boot.log: "0"
  /var/log/cloud-init-output.log: "6947"
  /var/log/cloud-init.log: "175539"
  /var/log/dnf.librepo.log: "156389"
  /var/log/dnf.log: "267585"
  /var/log/dnf.rpm.log: "85186"
  /var/log/ensm/auth/auth-app.log: "17225"
  /var/log/ensm/main/main-app.log: "3931"
  /var/log/hawkey.log: "180"
  cursor-journald: s=27d207e0c0d945519f967059e6c96562;i=4687;b=413f61ba0ccd48dcbc3ffc164cde73f2;m=595ad2b3;t=644892fb9be76;x=c76511d5cbc14c89
[root@rocky9-vm minn0701]# cat /etc/promtail/config.yml
server:
  http_listen_port: 9080
  grpc_listen_port: 0
positions:
  filename: /var/lib/promtail/positions.yaml
clients:
  - url: http://127.0.0.1:3100/loki/api/v1/push
scrape_configs:
  # 시스템 로그 파일 수집
  - job_name: varlogs
    static_configs:
      - targets:
          - localhost
        labels:
          job: varlogs
          __path__: /var/log/*.log

  # ENSM 애플리케이션 로그 수집
  - job_name: ensm
    static_configs:
      - targets:
          - localhost
        labels:
          job: ensm
          __path__: /var/log/ensm/**/*.log

  # journald 로그 수집
  - job_name: journald
    journal:
      max_age: 12h
      path: /var/log/journal
      labels:
        job: journald
    relabel_configs:
      - source_labels: ['__journal__systemd_unit']
        target_label: 'unit'
      - source_labels: ['__journal__hostname']
        target_label: 'hostname'

[root@rocky9-vm minn0701]# ls -la /var/log/*.log
ls -la /var/log/ensm/**/*.log
-rw-rw-r--. 1 root root      0 May 31 05:04 /var/log/boot.log
-rw-r-----. 1 root root 175539 Nov 27 00:46 /var/log/cloud-init.log
-rw-r-----. 1 root adm    6947 Nov 27 00:46 /var/log/cloud-init-output.log
-rw-r--r--. 1 root root 156389 Nov 27 00:55 /var/log/dnf.librepo.log
-rw-r--r--. 1 root root 267585 Nov 27 00:55 /var/log/dnf.log
-rw-r--r--. 1 root root  85186 Nov 27 00:55 /var/log/dnf.rpm.log
-rw-r--r--. 1 root root    180 Nov 27 00:55 /var/log/hawkey.log
-rw-r--r--. 1 ensm ensm 17225 Nov 27 00:56 /var/log/ensm/auth/auth-app.log
-rw-r--r--. 1 ensm ensm  3931 Nov 27 00:56 /var/log/ensm/main/main-app.log
[root@rocky9-vm minn0701]# ls -la /var/log/ensm/
find /var/log/ensm -name "*.log" -type f
total 4
drwxr-xr-x.  4 ensm ensm   30 Nov 27 00:46 .
drwxr-xr-x. 10 root root 4096 Nov 27 00:55 ..
drwxr-xr-x.  2 ensm ensm   26 Nov 27 00:55 auth
drwxr-xr-x.  2 ensm ensm   26 Nov 27 00:55 main
/var/log/ensm/auth/auth-app.log
/var/log/ensm/main/main-app.log
[root@rocky9-vm minn0701]# tail -f /var/log/ensm/*/*.log
==> /var/log/ensm/auth/auth-app.log <==
        at org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:391) ~[tomcat-embed-core-10.1.16.jar!/:na]
        at org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:63) ~[tomcat-embed-core-10.1.16.jar!/:na]
        at org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:896) ~[tomcat-embed-core-10.1.16.jar!/:na]
        at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1744) ~[tomcat-embed-core-10.1.16.jar!/:na]
        at org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:52) ~[tomcat-embed-core-10.1.16.jar!/:na]
        at org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1191) ~[tomcat-embed-core-10.1.16.jar!/:na]
        at org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:659) ~[tomcat-embed-core-10.1.16.jar!/:na]
        at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61) ~[tomcat-embed-core-10.1.16.jar!/:na]
        at java.base/java.lang.Thread.run(Thread.java:1583) ~[na:na]


==> /var/log/ensm/main/main-app.log <==
This generated password is for development use only. Your security configuration must be updated before running your application in production.

2025-11-27T00:55:54.077Z  INFO 5693 --- [ensm-main] [main] o.s.s.web.DefaultSecurityFilterChain     : Will secure any request with [org.springframework.security.web.session.DisableEncodeUrlFilter@4a8ab068, org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter@1922e6d, org.springframework.security.web.context.SecurityContextHolderFilter@290b1b2e, org.springframework.security.web.header.HeaderWriterFilter@389adf1d, org.springframework.web.filter.CorsFilter@76a82f33, org.springframework.security.web.authentication.logout.LogoutFilter@b672aa8, com.ensm.main.auth.JwtAuthenticationFilter@6bab2585, org.springframework.security.web.savedrequest.RequestCacheAwareFilter@33617539, org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter@2c177f9e, org.springframework.security.web.authentication.AnonymousAuthenticationFilter@74bdc168, org.springframework.security.web.access.ExceptionTranslationFilter@72e34f77, org.springframework.security.web.access.intercept.AuthorizationFilter@55f3c410]
2025-11-27T00:55:54.231Z  INFO 5693 --- [ensm-main] [main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port 55557 (http) with context path ''
2025-11-27T00:55:54.243Z  INFO 5693 --- [ensm-main] [main] com.ensm.main.EnsmMainApplication        : Started EnsmMainApplication in 6.398 seconds (process running for 8.818)
2025-11-27T00:56:25.274Z  INFO 5693 --- [ensm-main] [http-nio-55557-exec-1] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring DispatcherServlet 'dispatcherServlet'
2025-11-27T00:56:25.276Z  INFO 5693 --- [ensm-main] [http-nio-55557-exec-1] o.s.web.servlet.DispatcherServlet        : Initializing Servlet 'dispatcherServlet'
2025-11-27T00:56:25.277Z  INFO 5693 --- [ensm-main] [http-nio-55557-exec-1] o.s.web.servlet.DispatcherServlet        : Completed initialization in 1 ms
2025-11-27T00:56:25.298Z  WARN 5693 --- [ensm-main] [http-nio-55557-exec-1] o.s.w.s.h.HandlerMappingIntrospector     : Cache miss for REQUEST dispatch to '/main/dashboard' (previous null). Performing CorsConfiguration lookup. This is logged once only at WARN level, and every time at TRACE.
2025-11-27T00:56:25.347Z  WARN 5693 --- [ensm-main] [http-nio-55557-exec-1] o.s.w.s.h.HandlerMappingIntrospector     : Cache miss for REQUEST dispatch to '/main/dashboard' (previous null). Performing MatchableHandlerMapping lookup. This is logged once only at WARN level, and every time at TRACE.
^C
[root@rocky9-vm minn0701]# ls -la /var/log/ensm/
total 4
drwxr-xr-x.  4 ensm ensm   30 Nov 27 00:46 .
drwxr-xr-x. 10 root root 4096 Nov 27 00:55 ..
drwxr-xr-x.  2 ensm ensm   26 Nov 27 00:55 auth
drwxr-xr-x.  2 ensm ensm   26 Nov 27 00:55 main
[root@rocky9-vm minn0701]# journalctl -u loki.service -n 30 --no-pager
Nov 27 00:55:45 rocky9-vm systemd[1]: Started Loki Log Aggregation.
Nov 27 00:55:45 rocky9-vm loki[5696]: level=error ts=2025-11-27T00:55:45.588350205Z caller=ratestore.go:109 msg="error getting ingester clients" err="empty ring"
[root@rocky9-vm minn0701]# q^C
[root@rocky9-vm minn0701]# curl -G -s "http://localhost:3100/loki/api/v1/label/__name__/values" | jq
{
  "status": "success"
}
[root@rocky9-vm minn0701]# curl -G -s "http://localhost:3100/loki/api/v1/labels" | jq
{
  "status": "success",
  "data": [
    "filename",
    "hostname",
    "job",
    "service_name",
    "unit"
  ]
}
[root@rocky9-vm minn0701]# curl -G -s "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode "query={job=~\"varlogs|ensm|journald\"}" \
  --data-urlencode "start=$(date -d '1 hour ago' +%s)000000000" \
  --data-urlencode "end=$(date +%s)000000000" \
  --data-urlencode "limit=10" | jq
```
{
  "status": "success",
  "data": {
    "resultType": "streams",
    "result": [
      {
        "stream": {
          "hostname": "rocky9-vm",
          "job": "journald",
          "service_name": "journald",
          "unit": "ensm-main.service"
        },
        "values": [
          [
            "1764205938170283000",
            "]"
          ],
          [
            "1764205938170283000",
            "  {\"id\": \"novnc\",\"installed\": false,\"serviceStatus\": \"stopped\",\"autoStart\": false}"
          ],
          [
            "1764205938170283000",
            "  {\"id\": \"home-assistant\",\"installed\": false,\"serviceStatus\": \"stopped\",\"autoStart\": false},"
          ],
          [
            "1764205938170283000",
            "  {\"id\": \"plex\",\"installed\": false,\"serviceStatus\": \"stopped\",\"autoStart\": false},"
          ],
          [
            "1764205938170283000",
            "  {\"id\": \"jellyfin\",\"installed\": false,\"serviceStatus\": \"stopped\",\"autoStart\": false},"
          ],
          [
            "1764205938170283000",
            "  {\"id\": \"git\",\"installed\": true,\"serviceStatus\": \"stopped\",\"autoStart\": false},"
          ],
          [
            "1764205938170283000",
            "  {\"id\": \"docker\",\"installed\": false,\"serviceStatus\": \"stopped\",\"autoStart\": false},"
          ],
          [
            "1764205938170283000",
            "  {\"id\": \"nfs-utils\",\"installed\": true,\"serviceStatus\": \"stopped\",\"autoStart\": false},"
          ],
          [
            "1764205938170283000",
            "  {\"id\": \"vsftpd\",\"installed\": false,\"serviceStatus\": \"stopped\",\"autoStart\": false},"
          ],
          [
            "1764205938170283000",
            "  {\"id\": \"bind\",\"installed\": false,\"serviceStatus\": \"stopped\",\"autoStart\": false},"
          ]
        ]
      }
    ],
    "stats": {
      "summary": {
        "bytesProcessedPerSecond": 7510119,
        "linesProcessedPerSecond": 108464,
        "totalBytesProcessed": 25065,
        "totalLinesProcessed": 362,
        "execTime": 0.003337,
        "queueTime": 0.000384,
        "subqueries": 0,
        "totalEntriesReturned": 10,
        "splits": 1,
        "shards": 0,
        "totalPostFilterLines": 362,
        "totalStructuredMetadataBytesProcessed": 0
      },
      "querier": {
        "store": {
          "totalChunksRef": 5,
          "totalChunksDownloaded": 5,
          "chunksDownloadTime": 210739,
          "queryReferencedStructuredMetadata": false,
          "chunk": {
            "headChunkBytes": 0,
            "headChunkLines": 0,
            "decompressedBytes": 1102,
            "decompressedLines": 16,
            "compressedBytes": 801,
            "totalDuplicates": 0,
            "postFilterLines": 16,
            "headChunkStructuredMetadataBytes": 0,
            "decompressedStructuredMetadataBytes": 0
          },
          "chunkRefsFetchTime": 806742,
          "congestionControlLatency": 0,
          "pipelineWrapperFilteredLines": 0
        }
      },
      "ingester": {
        "totalReached": 1,
        "totalChunksMatched": 2,
        "totalBatches": 1,
        "totalLinesSent": 10,
        "store": {
          "totalChunksRef": 0,
          "totalChunksDownloaded": 0,
          "chunksDownloadTime": 0,
          "queryReferencedStructuredMetadata": false,
          "chunk": {
            "headChunkBytes": 23963,
            "headChunkLines": 346,
            "decompressedBytes": 0,
            "decompressedLines": 0,
            "compressedBytes": 0,
            "totalDuplicates": 0,
            "postFilterLines": 346,
            "headChunkStructuredMetadataBytes": 0,
            "decompressedStructuredMetadataBytes": 0
          },
          "chunkRefsFetchTime": 0,
          "congestionControlLatency": 0,
          "pipelineWrapperFilteredLines": 0
        }
      },
      "cache": {
        "chunk": {
          "entriesFound": 5,
          "entriesRequested": 5,
          "entriesStored": 0,
          "bytesReceived": 2303,
          "bytesSent": 0,
          "requests": 2,
          "downloadTime": 9578,
          "queryLengthServed": 0
        },
        "index": {
          "entriesFound": 0,
          "entriesRequested": 0,
          "entriesStored": 0,
          "bytesReceived": 0,
          "bytesSent": 0,
          "requests": 0,
          "downloadTime": 0,
          "queryLengthServed": 0
        },
        "result": {
          "entriesFound": 0,
          "entriesRequested": 0,
          "entriesStored": 0,
          "bytesReceived": 0,
          "bytesSent": 0,
          "requests": 0,
          "downloadTime": 0,
          "queryLengthServed": 0
        },
        "statsResult": {
          "entriesFound": 0,
          "entriesRequested": 0,
          "entriesStored": 0,
          "bytesReceived": 0,
          "bytesSent": 0,
          "requests": 0,
          "downloadTime": 0,
          "queryLengthServed": 0
        },
        "volumeResult": {
          "entriesFound": 0,
          "entriesRequested": 0,
          "entriesStored": 0,
          "bytesReceived": 0,
          "bytesSent": 0,
          "requests": 0,
          "downloadTime": 0,
          "queryLengthServed": 0
        },
        "seriesResult": {
          "entriesFound": 0,
          "entriesRequested": 0,
          "entriesStored": 0,
          "bytesReceived": 0,
          "bytesSent": 0,
          "requests": 0,
          "downloadTime": 0,
          "queryLengthServed": 0
        },
        "labelResult": {
          "entriesFound": 0,
          "entriesRequested": 0,
          "entriesStored": 0,
          "bytesReceived": 0,
          "bytesSent": 0,
          "requests": 0,
          "downloadTime": 0,
          "queryLengthServed": 0
        },
        "instantMetricResult": {
          "entriesFound": 0,
          "entriesRequested": 0,
          "entriesStored": 0,
          "bytesReceived": 0,
          "bytesSent": 0,
          "requests": 0,
          "downloadTime": 0,
          "queryLengthServed": 0
        }
      },
      "index": {
        "totalChunks": 0,
        "postFilterChunks": 0
      }
    }
  }
}
> ^C
[root@rocky9-vm minn0701]# cat /etc/grafana/provisioning/datasources/datasources.yaml
apiVersion: 1
deleteDatasources:
  - name: Prometheus
    orgId: 1
  - name: Loki
    orgId: 1
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://127.0.0.1:9090
    isDefault: true
    jsonData:
      httpMethod: POST
  - name: Loki
    type: loki
    access: proxy
    url: http://127.0.0.1:3100
    jsonData:
      maxLines: 1000
[root@rocky9-vm minn0701]# curl -u admin:admin http://localhost:3000/api/datasources 2>/dev/null | jq
[
  {
    "id": 2,
    "uid": "P8E80F9AEF21F6940",
    "orgId": 1,
    "name": "Loki",
    "type": "loki",
    "typeName": "Loki",
    "typeLogoUrl": "/grafana/public/app/plugins/datasource/loki/img/loki_icon.svg",
    "access": "proxy",
    "url": "http://127.0.0.1:3100",
    "user": "",
    "database": "",
    "basicAuth": false,
    "isDefault": false,
    "jsonData": {
      "maxLines": 1000
    },
    "readOnly": true
  },
  {
    "id": 1,
    "uid": "PBFA97CFB590B2093",
    "orgId": 1,
    "name": "Prometheus",
    "type": "prometheus",
    "typeName": "Prometheus",
    "typeLogoUrl": "/grafana/public/app/plugins/datasource/prometheus/img/prometheus_logo.svg",
    "access": "proxy",
    "url": "http://127.0.0.1:9090",
    "user": "",
    "database": "",
    "basicAuth": false,
    "isDefault": true,
    "jsonData": {
      "httpMethod": "POST"
    },
    "readOnly": true
  }
]
[root@rocky9-vm minn0701]#
[root@rocky9-vm minn0701]# cat /var/lib/grafana/dashboards/system-monitor-gauge-logs.json
{
  "id": null,
  "uid": "sysmon-gauges",
  "title": "System Monitor (Gauge + Logs)",
  "timezone": "browser",
  "schemaVersion": 38,
  "version": 1,
  "refresh": "10s",
  "panels": [
    {
      "id": 1,
      "type": "gauge",
      "title": "CPU Usage (%)",
      "gridPos": { "x": 0, "y": 0, "w": 8, "h": 8 },
      "targets": [
        {
          "datasource": { "type": "prometheus", "uid": null },
          "expr": "100 - (avg by (instance) (irate(node_cpu_seconds_total{mode=\"idle\"}[5m])) * 100)",
          "refId": "A"
        }
      ],
      "fieldConfig": {
        "defaults": {
          "unit": "percent",
          "min": 0,
          "max": 100,
          "thresholds": {
            "mode": "percentage",
            "steps": [
              { "color": "green" },
              { "color": "orange", "value": 70 },
              { "color": "red", "value": 90 }
            ]
          }
        },
        "overrides": []
      },
      "options": {
        "reduceOptions": {
          "calcs": ["lastNotNull"],
          "values": false
        },
        "showThresholdLabels": false,
        "showThresholdMarkers": true
      }
    },
    {
      "id": 2,
      "type": "gauge",
      "title": "Memory Usage (%)",
      "gridPos": { "x": 8, "y": 0, "w": 8, "h": 8 },
      "targets": [
        {
          "datasource": { "type": "prometheus", "uid": null },
          "expr": "(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100",
          "refId": "A"
        }
      ],
      "fieldConfig": {
        "defaults": {
          "unit": "percent",
          "min": 0,
          "max": 100,
          "thresholds": {
            "mode": "percentage",
            "steps": [
              { "color": "green" },
              { "color": "orange", "value": 70 },
              { "color": "red", "value": 90 }
            ]
          }
        },
        "overrides": []
      },
      "options": {
        "reduceOptions": {
          "calcs": ["lastNotNull"],
          "values": false
        },
        "showThresholdLabels": false,
        "showThresholdMarkers": true
      }
    },
    {
      "id": 3,
      "type": "gauge",
      "title": "Disk Usage (%) (/ mount)",
      "gridPos": { "x": 16, "y": 0, "w": 8, "h": 8 },
      "targets": [
        {
          "datasource": { "type": "prometheus", "uid": null },
          "expr": "(1 - (node_filesystem_avail_bytes{mountpoint=\"/\",fstype!~\"tmpfs|overlay\"} / node_filesystem_size_bytes{mountpoint=\"/\",fstype!~\"tmpfs|overlay\"})) * 100",
          "refId": "A"
        }
      ],
      "fieldConfig": {
        "defaults": {
          "unit": "percent",
          "min": 0,
          "max": 100,
          "thresholds": {
            "mode": "percentage",
            "steps": [
              { "color": "green" },
              { "color": "orange", "value": 70 },
              { "color": "red", "value": 90 }
            ]
          }
        },
        "overrides": []
      },
      "options": {
        "reduceOptions": {
          "calcs": ["lastNotNull"],
          "values": false
        },
        "showThresholdLabels": false,
        "showThresholdMarkers": true
      }
    },
    {
      "id": 4,
      "type": "logs",
      "title": "System Logs (journald / varlogs / ensm)",
      "gridPos": { "x": 0, "y": 8, "w": 24, "h": 12 },
      "targets": [
        {
          "datasource": { "type": "loki", "uid": null },
          "expr": "{job=~\"varlogs|ensm|journald\"}",
          "refId": "A"
        }
      ],
      "options": {
        "showTime": true,
        "wrapLogMessage": true
      }
    }
  ],
  "templating": { "list": [] },
  "time": { "from": "now-6h", "to": "now" }
}
[root@rocky9-vm minn0701]# grep -A 5 "System Logs" /var/lib/grafana/dashboards/system-monitor-gauge-logs.json
      "title": "System Logs (journald / varlogs / ensm)",
      "gridPos": { "x": 0, "y": 8, "w": 24, "h": 12 },
      "targets": [
        {
          "datasource": { "type": "loki", "uid": null },
          "expr": "{job=~\"varlogs|ensm|journald\"}",
[root@rocky9-vm minn0701]# curl -v http://127.0.0.1:3100/ready
curl -v http://127.0.0.1:3100/metrics
*   Trying 127.0.0.1:3100...
* Connected to 127.0.0.1 (127.0.0.1) port 3100 (#0)
> GET /ready HTTP/1.1
> Host: 127.0.0.1:3100
> User-Agent: curl/7.76.1
> Accept: */*
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 503 Service Unavailable
< Content-Type: text/plain; charset=utf-8
< X-Content-Type-Options: nosniff
< Date: Thu, 27 Nov 2025 01:13:16 GMT
< Content-Length: 54
<
Ingester not ready: waiting for 15s after being ready
* Connection #0 to host 127.0.0.1 left intact
*   Trying 127.0.0.1:3100...
* Connected to 127.0.0.1 (127.0.0.1) port 3100 (#0)
> GET /metrics HTTP/1.1
> Host: 127.0.0.1:3100
> User-Agent: curl/7.76.1
> Accept: */*
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< Content-Type: text/plain; version=0.0.4; charset=utf-8; escaping=values
< Date: Thu, 27 Nov 2025 01:13:16 GMT
< Transfer-Encoding: chunked
<
# HELP deprecated_flags_inuse_total The number of deprecated flags currently set.
# TYPE deprecated_flags_inuse_total counter
deprecated_flags_inuse_total 0
# HELP go_cgo_go_to_c_calls_calls_total Count of calls made from Go to C by the current process.
# TYPE go_cgo_go_to_c_calls_calls_total counter
go_cgo_go_to_c_calls_calls_total 0
# HELP go_cpu_classes_gc_mark_assist_cpu_seconds_total Estimated total CPU time goroutines spent performing GC tasks to assist the GC and prevent it from falling behind the application. This metric is an overestimate, and not directly comparable to system CPU time measurements. Compare only with other /cpu/classes metrics.
# TYPE go_cpu_classes_gc_mark_assist_cpu_seconds_total counter
go_cpu_classes_gc_mark_assist_cpu_seconds_total 0.01988369
# HELP go_cpu_classes_gc_mark_dedicated_cpu_seconds_total Estimated total CPU time spent performing GC tasks on processors (as defined by GOMAXPROCS) dedicated to those tasks. This metric is an overestimate, and not directly comparable to system CPU time measurements. Compare only with other /cpu/classes metrics.
# TYPE go_cpu_classes_gc_mark_dedicated_cpu_seconds_total counter
go_cpu_classes_gc_mark_dedicated_cpu_seconds_total 0.03498496
# HELP go_cpu_classes_gc_mark_idle_cpu_seconds_total Estimated total CPU time spent performing GC tasks on spare CPU resources that the Go scheduler could not otherwise find a use for. This should be subtracted from the total GC CPU time to obtain a measure of compulsory GC CPU time. This metric is an overestimate, and not directly comparable to system CPU time measurements. Compare only with other /cpu/classes metrics.
# TYPE go_cpu_classes_gc_mark_idle_cpu_seconds_total counter
go_cpu_classes_gc_mark_idle_cpu_seconds_total 0.068581647
# HELP go_cpu_classes_gc_pause_cpu_seconds_total Estimated total CPU time spent with the application paused by the GC. Even if only one thread is running during the pause, this is computed as GOMAXPROCS times the pause latency because nothing else can be executing. This is the exact sum of samples in /gc/pause:seconds if each sample is multiplied by GOMAXPROCS at the time it is taken. This metric is an overestimate, and not directly comparable to system CPU time measurements. Compare only with other /cpu/classes metrics.
# TYPE go_cpu_classes_gc_pause_cpu_seconds_total counter
go_cpu_classes_gc_pause_cpu_seconds_total 0.013149374
# HELP go_cpu_classes_gc_total_cpu_seconds_total Estimated total CPU time spent performing GC tasks. This metric is an overestimate, and not directly comparable to system CPU time measurements. Compare only with other /cpu/classes metrics. Sum of all metrics in /cpu/classes/gc.
# TYPE go_cpu_classes_gc_total_cpu_seconds_total counter
go_cpu_classes_gc_total_cpu_seconds_total 0.136599671
# HELP go_cpu_classes_idle_cpu_seconds_total Estimated total available CPU time not spent executing any Go or Go runtime code. In other words, the part of /cpu/classes/total:cpu-seconds that was unused. This metric is an overestimate, and not directly comparable to system CPU time measurements. Compare only with other /cpu/classes metrics.
# TYPE go_cpu_classes_idle_cpu_seconds_total counter
go_cpu_classes_idle_cpu_seconds_total 1921.189279527
# HELP go_cpu_classes_scavenge_assist_cpu_seconds_total Estimated total CPU time spent returning unused memory to the underlying platform in response eagerly in response to memory pressure. This metric is an overestimate, and not directly comparable to system CPU time measurements. Compare only with other /cpu/classes metrics.
# TYPE go_cpu_classes_scavenge_assist_cpu_seconds_total counter
go_cpu_classes_scavenge_assist_cpu_seconds_total 2.01e-07
# HELP go_cpu_classes_scavenge_background_cpu_seconds_total Estimated total CPU time spent performing background tasks to return unused memory to the underlying platform. This metric is an overestimate, and not directly comparable to system CPU time measurements. Compare only with other /cpu/classes metrics.
# TYPE go_cpu_classes_scavenge_background_cpu_seconds_total counter
go_cpu_classes_scavenge_background_cpu_seconds_total 0.000531543
# HELP go_cpu_classes_scavenge_total_cpu_seconds_total Estimated total CPU time spent performing tasks that return unused memory to the underlying platform. This metric is an overestimate, and not directly comparable to system CPU time measurements. Compare only with other /cpu/classes metrics. Sum of all metrics in /cpu/classes/scavenge.
# TYPE go_cpu_classes_scavenge_total_cpu_seconds_total counter
go_cpu_classes_scavenge_total_cpu_seconds_total 0.000531744
# HELP go_cpu_classes_total_cpu_seconds_total Estimated total available CPU time for user Go code or the Go runtime, as defined by GOMAXPROCS. In other words, GOMAXPROCS integrated over the wall-clock duration this process has been executing for. This metric is an overestimate, and not directly comparable to system CPU time measurements. Compare only with other /cpu/classes metrics. Sum of all metrics in /cpu/classes.
# TYPE go_cpu_classes_total_cpu_seconds_total counter
go_cpu_classes_total_cpu_seconds_total 1925.291098118
# HELP go_cpu_classes_user_cpu_seconds_total Estimated total CPU time spent running user Go code. This may also include some small amount of time spent in the Go runtime. This metric is an overestimate, and not directly comparable to system CPU time measurements. Compare only with other /cpu/classes metrics.
# TYPE go_cpu_classes_user_cpu_seconds_total counter
go_cpu_classes_user_cpu_seconds_total 3.964687176
# HELP go_gc_cycles_automatic_gc_cycles_total Count of completed GC cycles generated by the Go runtime.
# TYPE go_gc_cycles_automatic_gc_cycles_total counter
go_gc_cycles_automatic_gc_cycles_total 14
# HELP go_gc_cycles_forced_gc_cycles_total Count of completed GC cycles forced by the application.
# TYPE go_gc_cycles_forced_gc_cycles_total counter
go_gc_cycles_forced_gc_cycles_total 0
# HELP go_gc_cycles_total_gc_cycles_total Count of all completed GC cycles.
# TYPE go_gc_cycles_total_gc_cycles_total counter
go_gc_cycles_total_gc_cycles_total 14
# HELP go_gc_duration_seconds A summary of the pause duration of garbage collection cycles.
# TYPE go_gc_duration_seconds summary
go_gc_duration_seconds{quantile="0"} 1.0299e-05
go_gc_duration_seconds{quantile="0.25"} 6.6997e-05
go_gc_duration_seconds{quantile="0.5"} 0.000140797
go_gc_duration_seconds{quantile="0.75"} 0.00018989
go_gc_duration_seconds{quantile="1"} 0.002625659
go_gc_duration_seconds_sum 0.006574687
go_gc_duration_seconds_count 14
# HELP go_gc_gogc_percent Heap size target percentage configured by the user, otherwise 100. This value is set by the GOGC environment variable, and the runtime/debug.SetGCPercent function.
# TYPE go_gc_gogc_percent gauge
go_gc_gogc_percent 100
# HELP go_gc_gomemlimit_bytes Go runtime memory limit configured by the user, otherwise math.MaxInt64. This value is set by the GOMEMLIMIT environment variable, and the runtime/debug.SetMemoryLimit function.
# TYPE go_gc_gomemlimit_bytes gauge
go_gc_gomemlimit_bytes 9.223372036854776e+18
# HELP go_gc_heap_allocs_by_size_bytes Distribution of heap allocations by approximate size. Bucket counts increase monotonically. Note that this does not include tiny objects as defined by /gc/heap/tiny/allocs:objects, only tiny blocks.
# TYPE go_gc_heap_allocs_by_size_bytes histogram
go_gc_heap_allocs_by_size_bytes_bucket{le="8.999999999999998"} 54900
go_gc_heap_allocs_by_size_bytes_bucket{le="24.999999999999996"} 537313
go_gc_heap_allocs_by_size_bytes_bucket{le="64.99999999999999"} 2.179105e+06
go_gc_heap_allocs_by_size_bytes_bucket{le="144.99999999999997"} 2.463555e+06
go_gc_heap_allocs_by_size_bytes_bucket{le="320.99999999999994"} 2.527157e+06
go_gc_heap_allocs_by_size_bytes_bucket{le="704.9999999999999"} 2.545312e+06
go_gc_heap_allocs_by_size_bytes_bucket{le="1536.9999999999998"} 2.549634e+06
go_gc_heap_allocs_by_size_bytes_bucket{le="3200.9999999999995"} 2.55129e+06
go_gc_heap_allocs_by_size_bytes_bucket{le="6528.999999999999"} 2.55243e+06
go_gc_heap_allocs_by_size_bytes_bucket{le="13568.999999999998"} 2.552816e+06
go_gc_heap_allocs_by_size_bytes_bucket{le="27264.999999999996"} 2.553136e+06
go_gc_heap_allocs_by_size_bytes_bucket{le="+Inf"} 2.554506e+06
go_gc_heap_allocs_by_size_bytes_sum 2.68948424e+08
go_gc_heap_allocs_by_size_bytes_count 2.554506e+06
# HELP go_gc_heap_allocs_bytes_total Cumulative sum of memory allocated to the heap by the application.
# TYPE go_gc_heap_allocs_bytes_total counter
go_gc_heap_allocs_bytes_total 2.68948424e+08
# HELP go_gc_heap_allocs_objects_total Cumulative count of heap allocations triggered by the application. Note that this does not include tiny objects as defined by /gc/heap/tiny/allocs:objects, only tiny blocks.
# TYPE go_gc_heap_allocs_objects_total counter
go_gc_heap_allocs_objects_total 2.554506e+06
# HELP go_gc_heap_frees_by_size_bytes Distribution of freed heap allocations by approximate size. Bucket counts increase monotonically. Note that this does not include tiny objects as defined by /gc/heap/tiny/allocs:objects, only tiny blocks.
# TYPE go_gc_heap_frees_by_size_bytes histogram
go_gc_heap_frees_by_size_bytes_bucket{le="8.999999999999998"} 48643
go_gc_heap_frees_by_size_bytes_bucket{le="24.999999999999996"} 469568
go_gc_heap_frees_by_size_bytes_bucket{le="64.99999999999999"} 1.949534e+06
go_gc_heap_frees_by_size_bytes_bucket{le="144.99999999999997"} 2.188377e+06
go_gc_heap_frees_by_size_bytes_bucket{le="320.99999999999994"} 2.242749e+06
go_gc_heap_frees_by_size_bytes_bucket{le="704.9999999999999"} 2.25774e+06
go_gc_heap_frees_by_size_bytes_bucket{le="1536.9999999999998"} 2.261186e+06
go_gc_heap_frees_by_size_bytes_bucket{le="3200.9999999999995"} 2.262362e+06
go_gc_heap_frees_by_size_bytes_bucket{le="6528.999999999999"} 2.263219e+06
go_gc_heap_frees_by_size_bytes_bucket{le="13568.999999999998"} 2.263502e+06
go_gc_heap_frees_by_size_bytes_bucket{le="27264.999999999996"} 2.263767e+06
go_gc_heap_frees_by_size_bytes_bucket{le="+Inf"} 2.264923e+06
go_gc_heap_frees_by_size_bytes_sum 2.11183696e+08
go_gc_heap_frees_by_size_bytes_count 2.264923e+06
# HELP go_gc_heap_frees_bytes_total Cumulative sum of heap memory freed by the garbage collector.
# TYPE go_gc_heap_frees_bytes_total counter
go_gc_heap_frees_bytes_total 2.11183696e+08
# HELP go_gc_heap_frees_objects_total Cumulative count of heap allocations whose storage was freed by the garbage collector. Note that this does not include tiny objects as defined by /gc/heap/tiny/allocs:objects, only tiny blocks.
# TYPE go_gc_heap_frees_objects_total counter
go_gc_heap_frees_objects_total 2.264923e+06
# HELP go_gc_heap_goal_bytes Heap size target for the end of the GC cycle.
# TYPE go_gc_heap_goal_bytes gauge
go_gc_heap_goal_bytes 7.2860928e+07
# HELP go_gc_heap_live_bytes Heap memory occupied by live objects that were marked by the previous GC.
# TYPE go_gc_heap_live_bytes gauge
go_gc_heap_live_bytes 3.6086472e+07
# HELP go_gc_heap_objects_objects Number of objects, live or unswept, occupying heap memory.
# TYPE go_gc_heap_objects_objects gauge
go_gc_heap_objects_objects 289583
# HELP go_gc_heap_tiny_allocs_objects_total Count of small allocations that are packed together into blocks. These allocations are counted separately from other allocations because each individual allocation is not tracked by the runtime, only their block. Each block is already accounted for in allocs-by-size and frees-by-size.
# TYPE go_gc_heap_tiny_allocs_objects_total counter
go_gc_heap_tiny_allocs_objects_total 136623
# HELP go_gc_limiter_last_enabled_gc_cycle GC cycle the last time the GC CPU limiter was enabled. This metric is useful for diagnosing the root cause of an out-of-memory error, because the limiter trades memory for CPU time when the GC's CPU time gets too high. This is most likely to occur with use of SetMemoryLimit. The first GC cycle is cycle 1, so a value of 0 indicates that it was never enabled.
# TYPE go_gc_limiter_last_enabled_gc_cycle gauge
go_gc_limiter_last_enabled_gc_cycle 0
# HELP go_gc_pauses_seconds Distribution of individual GC-related stop-the-world pause latencies. Bucket counts increase monotonically.
# TYPE go_gc_pauses_seconds histogram
go_gc_pauses_seconds_bucket{le="6.399999999999999e-08"} 0
go_gc_pauses_seconds_bucket{le="6.399999999999999e-07"} 0
go_gc_pauses_seconds_bucket{le="7.167999999999999e-06"} 12
go_gc_pauses_seconds_bucket{le="8.191999999999999e-05"} 19
go_gc_pauses_seconds_bucket{le="0.0009175039999999999"} 25
go_gc_pauses_seconds_bucket{le="0.010485759999999998"} 28
go_gc_pauses_seconds_bucket{le="0.11744051199999998"} 28
go_gc_pauses_seconds_bucket{le="+Inf"} 28
go_gc_pauses_seconds_sum 0.0033018880000000002
go_gc_pauses_seconds_count 28
# HELP go_gc_scan_globals_bytes The total amount of global variable space that is scannable.
# TYPE go_gc_scan_globals_bytes gauge
go_gc_scan_globals_bytes 464776
# HELP go_gc_scan_heap_bytes The total amount of heap space that is scannable.
# TYPE go_gc_scan_heap_bytes gauge
go_gc_scan_heap_bytes 2.7136208e+07
# HELP go_gc_scan_stack_bytes The number of bytes of stack that were scanned last GC cycle.
# TYPE go_gc_scan_stack_bytes gauge
go_gc_scan_stack_bytes 223208
# HELP go_gc_scan_total_bytes The total amount space that is scannable. Sum of all metrics in /gc/scan.
# TYPE go_gc_scan_total_bytes gauge
go_gc_scan_total_bytes 2.7824192e+07
# HELP go_gc_stack_starting_size_bytes The stack size of new goroutines.
# TYPE go_gc_stack_starting_size_bytes gauge
go_gc_stack_starting_size_bytes 2048
# HELP go_godebug_non_default_behavior_execerrdot_events_total The number of non-default behaviors executed by the os/exec package due to a non-default GODEBUG=execerrdot=... setting.
# TYPE go_godebug_non_default_behavior_execerrdot_events_total counter
go_godebug_non_default_behavior_execerrdot_events_total 0
# HELP go_godebug_non_default_behavior_gocachehash_events_total The number of non-default behaviors executed by the cmd/go package due to a non-default GODEBUG=gocachehash=... setting.
# TYPE go_godebug_non_default_behavior_gocachehash_events_total counter
go_godebug_non_default_behavior_gocachehash_events_total 0
# HELP go_godebug_non_default_behavior_gocachetest_events_total The number of non-default behaviors executed by the cmd/go package due to a non-default GODEBUG=gocachetest=... setting.
# TYPE go_godebug_non_default_behavior_gocachetest_events_total counter
go_godebug_non_default_behavior_gocachetest_events_total 0
# HELP go_godebug_non_default_behavior_gocacheverify_events_total The number of non-default behaviors executed by the cmd/go package due to a non-default GODEBUG=gocacheverify=... setting.
# TYPE go_godebug_non_default_behavior_gocacheverify_events_total counter
go_godebug_non_default_behavior_gocacheverify_events_total 0
# HELP go_godebug_non_default_behavior_http2client_events_total The number of non-default behaviors executed by the net/http package due to a non-default GODEBUG=http2client=... setting.
# TYPE go_godebug_non_default_behavior_http2client_events_total counter
go_godebug_non_default_behavior_http2client_events_total 0
# HELP go_godebug_non_default_behavior_http2server_events_total The number of non-default behaviors executed by the net/http package due to a non-default GODEBUG=http2server=... setting.
# TYPE go_godebug_non_default_behavior_http2server_events_total counter
go_godebug_non_default_behavior_http2server_events_total 0
# HELP go_godebug_non_default_behavior_installgoroot_events_total The number of non-default behaviors executed by the go/build package due to a non-default GODEBUG=installgoroot=... setting.
# TYPE go_godebug_non_default_behavior_installgoroot_events_total counter
go_godebug_non_default_behavior_installgoroot_events_total 0
# HELP go_godebug_non_default_behavior_jstmpllitinterp_events_total The number of non-default behaviors executed by the html/template package due to a non-default GODEBUG=jstmpllitinterp=... setting.
# TYPE go_godebug_non_default_behavior_jstmpllitinterp_events_total counter
go_godebug_non_default_behavior_jstmpllitinterp_events_total 0
# HELP go_godebug_non_default_behavior_multipartmaxheaders_events_total The number of non-default behaviors executed by the mime/multipart package due to a non-default GODEBUG=multipartmaxheaders=... setting.
# TYPE go_godebug_non_default_behavior_multipartmaxheaders_events_total counter
go_godebug_non_default_behavior_multipartmaxheaders_events_total 0
# HELP go_godebug_non_default_behavior_multipartmaxparts_events_total The number of non-default behaviors executed by the mime/multipart package due to a non-default GODEBUG=multipartmaxparts=... setting.
# TYPE go_godebug_non_default_behavior_multipartmaxparts_events_total counter
go_godebug_non_default_behavior_multipartmaxparts_events_total 0
# HELP go_godebug_non_default_behavior_multipathtcp_events_total The number of non-default behaviors executed by the net package due to a non-default GODEBUG=multipathtcp=... setting.
# TYPE go_godebug_non_default_behavior_multipathtcp_events_total counter
go_godebug_non_default_behavior_multipathtcp_events_total 0
# HELP go_godebug_non_default_behavior_panicnil_events_total The number of non-default behaviors executed by the runtime package due to a non-default GODEBUG=panicnil=... setting.
# TYPE go_godebug_non_default_behavior_panicnil_events_total counter
go_godebug_non_default_behavior_panicnil_events_total 0
# HELP go_godebug_non_default_behavior_randautoseed_events_total The number of non-default behaviors executed by the math/rand package due to a non-default GODEBUG=randautoseed=... setting.
# TYPE go_godebug_non_default_behavior_randautoseed_events_total counter
go_godebug_non_default_behavior_randautoseed_events_total 0
# HELP go_godebug_non_default_behavior_tarinsecurepath_events_total The number of non-default behaviors executed by the archive/tar package due to a non-default GODEBUG=tarinsecurepath=... setting.
# TYPE go_godebug_non_default_behavior_tarinsecurepath_events_total counter
go_godebug_non_default_behavior_tarinsecurepath_events_total 0
# HELP go_godebug_non_default_behavior_tlsmaxrsasize_events_total The number of non-default behaviors executed by the crypto/tls package due to a non-default GODEBUG=tlsmaxrsasize=... setting.
# TYPE go_godebug_non_default_behavior_tlsmaxrsasize_events_total counter
go_godebug_non_default_behavior_tlsmaxrsasize_events_total 0
# HELP go_godebug_non_default_behavior_x509sha1_events_total The number of non-default behaviors executed by the crypto/x509 package due to a non-default GODEBUG=x509sha1=... setting.
# TYPE go_godebug_non_default_behavior_x509sha1_events_total counter
go_godebug_non_default_behavior_x509sha1_events_total 0
# HELP go_godebug_non_default_behavior_x509usefallbackroots_events_total The number of non-default behaviors executed by the crypto/x509 package due to a non-default GODEBUG=x509usefallbackroots=... setting.
# TYPE go_godebug_non_default_behavior_x509usefallbackroots_events_total counter
go_godebug_non_default_behavior_x509usefallbackroots_events_total 0
# HELP go_godebug_non_default_behavior_zipinsecurepath_events_total The number of non-default behaviors executed by the archive/zip package due to a non-default GODEBUG=zipinsecurepath=... setting.
# TYPE go_godebug_non_default_behavior_zipinsecurepath_events_total counter
go_godebug_non_default_behavior_zipinsecurepath_events_total 0
# HELP go_goroutines Number of goroutines that currently exist.
# TYPE go_goroutines gauge
go_goroutines 246
# HELP go_info Information about the Go environment.
# TYPE go_info gauge
go_info{version="go1.21.9"} 1
# HELP go_memory_classes_heap_free_bytes Memory that is completely free and eligible to be returned to the underlying system, but has not been. This metric is the runtime's estimate of free address space that is backed by physical memory.
# TYPE go_memory_classes_heap_free_bytes gauge
go_memory_classes_heap_free_bytes 4.87424e+06
# HELP go_memory_classes_heap_objects_bytes Memory occupied by live objects and dead objects that have not yet been marked free by the garbage collector.
# TYPE go_memory_classes_heap_objects_bytes gauge
go_memory_classes_heap_objects_bytes 5.7764728e+07
# HELP go_memory_classes_heap_released_bytes Memory that is completely free and has been returned to the underlying system. This metric is the runtime's estimate of free address space that is still mapped into the process, but is not backed by physical memory.
# TYPE go_memory_classes_heap_released_bytes gauge
go_memory_classes_heap_released_bytes 5.77536e+06
# HELP go_memory_classes_heap_stacks_bytes Memory allocated from the heap that is reserved for stack space, whether or not it is currently in-use. Currently, this represents all stack memory for goroutines. It also includes all OS thread stacks in non-cgo programs. Note that stacks may be allocated differently in the future, and this may change.
# TYPE go_memory_classes_heap_stacks_bytes gauge
go_memory_classes_heap_stacks_bytes 3.76832e+06
# HELP go_memory_classes_heap_unused_bytes Memory that is reserved for heap objects but is not currently used to hold heap objects.
# TYPE go_memory_classes_heap_unused_bytes gauge
go_memory_classes_heap_unused_bytes 3.314824e+06
# HELP go_memory_classes_metadata_mcache_free_bytes Memory that is reserved for runtime mcache structures, but not in-use.
# TYPE go_memory_classes_metadata_mcache_free_bytes gauge
go_memory_classes_metadata_mcache_free_bytes 13200
# HELP go_memory_classes_metadata_mcache_inuse_bytes Memory that is occupied by runtime mcache structures that are currently being used.
# TYPE go_memory_classes_metadata_mcache_inuse_bytes gauge
go_memory_classes_metadata_mcache_inuse_bytes 2400
# HELP go_memory_classes_metadata_mspan_free_bytes Memory that is reserved for runtime mspan structures, but not in-use.
# TYPE go_memory_classes_metadata_mspan_free_bytes gauge
go_memory_classes_metadata_mspan_free_bytes 110712
# HELP go_memory_classes_metadata_mspan_inuse_bytes Memory that is occupied by runtime mspan structures that are currently being used.
# TYPE go_memory_classes_metadata_mspan_inuse_bytes gauge
go_memory_classes_metadata_mspan_inuse_bytes 541128
# HELP go_memory_classes_metadata_other_bytes Memory that is reserved for or used to hold runtime metadata.
# TYPE go_memory_classes_metadata_other_bytes gauge
go_memory_classes_metadata_other_bytes 6.41808e+06
# HELP go_memory_classes_os_stacks_bytes Stack memory allocated by the underlying operating system. In non-cgo programs this metric is currently zero. This may change in the future.In cgo programs this metric includes OS thread stacks allocated directly from the OS. Currently, this only accounts for one stack in c-shared and c-archive build modes, and other sources of stacks from the OS are not measured. This too may change in the future.
# TYPE go_memory_classes_os_stacks_bytes gauge
go_memory_classes_os_stacks_bytes 0
# HELP go_memory_classes_other_bytes Memory used by execution trace buffers, structures for debugging the runtime, finalizer and profiler specials, and more.
# TYPE go_memory_classes_other_bytes gauge
go_memory_classes_other_bytes 699759
# HELP go_memory_classes_profiling_buckets_bytes Memory that is used by the stack trace hash map used for profiling.
# TYPE go_memory_classes_profiling_buckets_bytes gauge
go_memory_classes_profiling_buckets_bytes 1.512921e+06
# HELP go_memory_classes_total_bytes All memory mapped by the Go runtime into the current process as read-write. Note that this does not include memory mapped by code called via cgo or via the syscall package. Sum of all metrics in /memory/classes.
# TYPE go_memory_classes_total_bytes gauge
go_memory_classes_total_bytes 8.4795672e+07
# HELP go_memstats_alloc_bytes Number of bytes allocated and still in use.
# TYPE go_memstats_alloc_bytes gauge
go_memstats_alloc_bytes 5.7764728e+07
# HELP go_memstats_alloc_bytes_total Total number of bytes allocated, even if freed.
# TYPE go_memstats_alloc_bytes_total counter
go_memstats_alloc_bytes_total 2.68948424e+08
# HELP go_memstats_buck_hash_sys_bytes Number of bytes used by the profiling bucket hash table.
# TYPE go_memstats_buck_hash_sys_bytes gauge
go_memstats_buck_hash_sys_bytes 1.512921e+06
# HELP go_memstats_frees_total Total number of frees.
# TYPE go_memstats_frees_total counter
go_memstats_frees_total 2.401546e+06
# HELP go_memstats_gc_sys_bytes Number of bytes used for garbage collection system metadata.
# TYPE go_memstats_gc_sys_bytes gauge
go_memstats_gc_sys_bytes 6.41808e+06
# HELP go_memstats_heap_alloc_bytes Number of heap bytes allocated and still in use.
# TYPE go_memstats_heap_alloc_bytes gauge
go_memstats_heap_alloc_bytes 5.7764728e+07
# HELP go_memstats_heap_idle_bytes Number of heap bytes waiting to be used.
# TYPE go_memstats_heap_idle_bytes gauge
go_memstats_heap_idle_bytes 1.06496e+07
# HELP go_memstats_heap_inuse_bytes Number of heap bytes that are in use.
# TYPE go_memstats_heap_inuse_bytes gauge
go_memstats_heap_inuse_bytes 6.1079552e+07
# HELP go_memstats_heap_objects Number of allocated objects.
# TYPE go_memstats_heap_objects gauge
go_memstats_heap_objects 289583
# HELP go_memstats_heap_released_bytes Number of heap bytes released to OS.
# TYPE go_memstats_heap_released_bytes gauge
go_memstats_heap_released_bytes 5.77536e+06
# HELP go_memstats_heap_sys_bytes Number of heap bytes obtained from system.
# TYPE go_memstats_heap_sys_bytes gauge
go_memstats_heap_sys_bytes 7.1729152e+07
# HELP go_memstats_last_gc_time_seconds Number of seconds since 1970 of last garbage collection.
# TYPE go_memstats_last_gc_time_seconds gauge
go_memstats_last_gc_time_seconds 1.764205908054802e+09
# HELP go_memstats_lookups_total Total number of pointer lookups.
# TYPE go_memstats_lookups_total counter
go_memstats_lookups_total 0
# HELP go_memstats_mallocs_total Total number of mallocs.
# TYPE go_memstats_mallocs_total counter
go_memstats_mallocs_total 2.691129e+06
# HELP go_memstats_mcache_inuse_bytes Number of bytes in use by mcache structures.
# TYPE go_memstats_mcache_inuse_bytes gauge
go_memstats_mcache_inuse_bytes 2400
# HELP go_memstats_mcache_sys_bytes Number of bytes used for mcache structures obtained from system.
# TYPE go_memstats_mcache_sys_bytes gauge
go_memstats_mcache_sys_bytes 15600
# HELP go_memstats_mspan_inuse_bytes Number of bytes in use by mspan structures.
# TYPE go_memstats_mspan_inuse_bytes gauge
go_memstats_mspan_inuse_bytes 541128
# HELP go_memstats_mspan_sys_bytes Number of bytes used for mspan structures obtained from system.
# TYPE go_memstats_mspan_sys_bytes gauge
go_memstats_mspan_sys_bytes 651840
# HELP go_memstats_next_gc_bytes Number of heap bytes when next garbage collection will take place.
# TYPE go_memstats_next_gc_bytes gauge
go_memstats_next_gc_bytes 7.2860928e+07
# HELP go_memstats_other_sys_bytes Number of bytes used for other system allocations.
# TYPE go_memstats_other_sys_bytes gauge
go_memstats_other_sys_bytes 699759
# HELP go_memstats_stack_inuse_bytes Number of bytes in use by the stack allocator.
# TYPE go_memstats_stack_inuse_bytes gauge
go_memstats_stack_inuse_bytes 3.76832e+06
# HELP go_memstats_stack_sys_bytes Number of bytes obtained from system for stack allocator.
# TYPE go_memstats_stack_sys_bytes gauge
go_memstats_stack_sys_bytes 3.76832e+06
# HELP go_memstats_sys_bytes Number of bytes obtained from system.
# TYPE go_memstats_sys_bytes gauge
go_memstats_sys_bytes 8.4795672e+07
# HELP go_sched_gomaxprocs_threads The current runtime.GOMAXPROCS setting, or the number of operating system threads that can execute user-level Go code simultaneously.
# TYPE go_sched_gomaxprocs_threads gauge
go_sched_gomaxprocs_threads 2
# HELP go_sched_goroutines_goroutines Count of live goroutines.
# TYPE go_sched_goroutines_goroutines gauge
go_sched_goroutines_goroutines 246
# HELP go_sched_latencies_seconds Distribution of the time goroutines have spent in the scheduler in a runnable state before actually running. Bucket counts increase monotonically.
# TYPE go_sched_latencies_seconds histogram
go_sched_latencies_seconds_bucket{le="6.399999999999999e-08"} 3967
go_sched_latencies_seconds_bucket{le="6.399999999999999e-07"} 6674
go_sched_latencies_seconds_bucket{le="7.167999999999999e-06"} 11540
go_sched_latencies_seconds_bucket{le="8.191999999999999e-05"} 41293
go_sched_latencies_seconds_bucket{le="0.0009175039999999999"} 63655
go_sched_latencies_seconds_bucket{le="0.010485759999999998"} 63679
go_sched_latencies_seconds_bucket{le="0.11744051199999998"} 63685
go_sched_latencies_seconds_bucket{le="+Inf"} 63685
go_sched_latencies_seconds_sum 2.133386688
go_sched_latencies_seconds_count 63685
# HELP go_sync_mutex_wait_total_seconds_total Approximate cumulative time goroutines have spent blocked on a sync.Mutex or sync.RWMutex. This metric is useful for identifying global changes in lock contention. Collect a mutex or block profile using the runtime/pprof package for more detailed contention data.
# TYPE go_sync_mutex_wait_total_seconds_total counter
go_sync_mutex_wait_total_seconds_total 0.333442296
# HELP go_threads Number of OS threads created.
# TYPE go_threads gauge
go_threads 25
# HELP jaeger_tracer_baggage_restrictions_updates_total Number of times baggage restrictions were successfully updated
# TYPE jaeger_tracer_baggage_restrictions_updates_total counter
jaeger_tracer_baggage_restrictions_updates_total{result="err"} 0
jaeger_tracer_baggage_restrictions_updates_total{result="ok"} 0
# HELP jaeger_tracer_baggage_truncations_total Number of times baggage was truncated as per baggage restrictions
# TYPE jaeger_tracer_baggage_truncations_total counter
jaeger_tracer_baggage_truncations_total 0
# HELP jaeger_tracer_baggage_updates_total Number of times baggage was successfully written or updated on spans
# TYPE jaeger_tracer_baggage_updates_total counter
jaeger_tracer_baggage_updates_total{result="err"} 0
jaeger_tracer_baggage_updates_total{result="ok"} 0
# HELP jaeger_tracer_finished_spans_total Number of sampled spans finished by this tracer
# TYPE jaeger_tracer_finished_spans_total counter
jaeger_tracer_finished_spans_total{sampled="delayed"} 0
jaeger_tracer_finished_spans_total{sampled="n"} 4983
jaeger_tracer_finished_spans_total{sampled="y"} 0
# HELP jaeger_tracer_reporter_queue_length Current number of spans in the reporter queue
# TYPE jaeger_tracer_reporter_queue_length gauge
jaeger_tracer_reporter_queue_length 0
# HELP jaeger_tracer_reporter_spans_total Number of spans successfully reported
# TYPE jaeger_tracer_reporter_spans_total counter
jaeger_tracer_reporter_spans_total{result="dropped"} 0
jaeger_tracer_reporter_spans_total{result="err"} 0
jaeger_tracer_reporter_spans_total{result="ok"} 0
# HELP jaeger_tracer_sampler_queries_total Number of times the Sampler succeeded to retrieve sampling strategy
# TYPE jaeger_tracer_sampler_queries_total counter
jaeger_tracer_sampler_queries_total{result="err"} 17
jaeger_tracer_sampler_queries_total{result="ok"} 0
# HELP jaeger_tracer_sampler_updates_total Number of times the Sampler succeeded to retrieve and update sampling strategy
# TYPE jaeger_tracer_sampler_updates_total counter
jaeger_tracer_sampler_updates_total{result="err"} 0
jaeger_tracer_sampler_updates_total{result="ok"} 0
# HELP jaeger_tracer_span_context_decoding_errors_total Number of errors decoding tracing context
# TYPE jaeger_tracer_span_context_decoding_errors_total counter
jaeger_tracer_span_context_decoding_errors_total 0
# HELP jaeger_tracer_started_spans_total Number of spans started by this tracer as sampled
# TYPE jaeger_tracer_started_spans_total counter
jaeger_tracer_started_spans_total{sampled="delayed"} 0
jaeger_tracer_started_spans_total{sampled="n"} 4927
jaeger_tracer_started_spans_total{sampled="y"} 0
# HELP jaeger_tracer_throttled_debug_spans_total Number of times debug spans were throttled
# TYPE jaeger_tracer_throttled_debug_spans_total counter
jaeger_tracer_throttled_debug_spans_total 0
# HELP jaeger_tracer_throttler_updates_total Number of times throttler successfully updated
# TYPE jaeger_tracer_throttler_updates_total counter
jaeger_tracer_throttler_updates_total{result="err"} 0
jaeger_tracer_throttler_updates_total{result="ok"} 0
# HELP jaeger_tracer_traces_total Number of traces started by this tracer as sampled
# TYPE jaeger_tracer_traces_total counter
jaeger_tracer_traces_total{sampled="n",state="joined"} 1077
jaeger_tracer_traces_total{sampled="n",state="started"} 1852
jaeger_tracer_traces_total{sampled="y",state="joined"} 0
jaeger_tracer_traces_total{sampled="y",state="started"} 0
# HELP kv_request_duration_seconds Time spent on kv store requests.
# TYPE kv_request_duration_seconds histogram
kv_request_duration_seconds_bucket{kv_name="distributor-lifecycler",operation="CAS",role="primary",status_code="200",type="inmemory",le="0.005"} 211
kv_request_duration_seconds_bucket{kv_name="distributor-lifecycler",operation="CAS",role="primary",status_code="200",type="inmemory",le="0.01"} 211
kv_request_duration_seconds_bucket{kv_name="distributor-lifecycler",operation="CAS",role="primary",status_code="200",type="inmemory",le="0.025"} 211
kv_request_duration_seconds_bucket{kv_name="distributor-lifecycler",operation="CAS",role="primary",status_code="200",type="inmemory",le="0.05"} 211
kv_request_duration_seconds_bucket{kv_name="distributor-lifecycler",operation="CAS",role="primary",status_code="200",type="inmemory",le="0.1"} 211
kv_request_duration_seconds_bucket{kv_name="distributor-lifecycler",operation="CAS",role="primary",status_code="200",type="inmemory",le="0.25"} 211
kv_request_duration_seconds_bucket{kv_name="distributor-lifecycler",operation="CAS",role="primary",status_code="200",type="inmemory",le="0.5"} 211
kv_request_duration_seconds_bucket{kv_name="distributor-lifecycler",operation="CAS",role="primary",status_code="200",type="inmemory",le="1"} 211
kv_request_duration_seconds_bucket{kv_name="distributor-lifecycler",operation="CAS",role="primary",status_code="200",type="inmemory",le="2.5"} 211
kv_request_duration_seconds_bucket{kv_name="distributor-lifecycler",operation="CAS",role="primary",status_code="200",type="inmemory",le="5"} 211
kv_request_duration_seconds_bucket{kv_name="distributor-lifecycler",operation="CAS",role="primary",status_code="200",type="inmemory",le="10"} 211
kv_request_duration_seconds_bucket{kv_name="distributor-lifecycler",operation="CAS",role="primary",status_code="200",type="inmemory",le="+Inf"} 211
kv_request_duration_seconds_sum{kv_name="distributor-lifecycler",operation="CAS",role="primary",status_code="200",type="inmemory"} 0.013163724000000005
kv_request_duration_seconds_count{kv_name="distributor-lifecycler",operation="CAS",role="primary",status_code="200",type="inmemory"} 211
# HELP logql_query_duration_seconds LogQL query timings
# TYPE logql_query_duration_seconds histogram
logql_query_duration_seconds_bucket{query_type="labels",le="0.005"} 2
logql_query_duration_seconds_bucket{query_type="labels",le="0.01"} 2
logql_query_duration_seconds_bucket{query_type="labels",le="0.025"} 2
logql_query_duration_seconds_bucket{query_type="labels",le="0.05"} 2
logql_query_duration_seconds_bucket{query_type="labels",le="0.1"} 2
logql_query_duration_seconds_bucket{query_type="labels",le="0.25"} 2
logql_query_duration_seconds_bucket{query_type="labels",le="0.5"} 2
logql_query_duration_seconds_bucket{query_type="labels",le="1"} 2
logql_query_duration_seconds_bucket{query_type="labels",le="2.5"} 2
logql_query_duration_seconds_bucket{query_type="labels",le="5"} 2
logql_query_duration_seconds_bucket{query_type="labels",le="10"} 2
logql_query_duration_seconds_bucket{query_type="labels",le="+Inf"} 2
logql_query_duration_seconds_sum{query_type="labels"} 0.001582685
logql_query_duration_seconds_count{query_type="labels"} 2
logql_query_duration_seconds_bucket{query_type="range",le="0.005"} 2
logql_query_duration_seconds_bucket{query_type="range",le="0.01"} 2
logql_query_duration_seconds_bucket{query_type="range",le="0.025"} 2
logql_query_duration_seconds_bucket{query_type="range",le="0.05"} 2
logql_query_duration_seconds_bucket{query_type="range",le="0.1"} 2
logql_query_duration_seconds_bucket{query_type="range",le="0.25"} 2
logql_query_duration_seconds_bucket{query_type="range",le="0.5"} 2
logql_query_duration_seconds_bucket{query_type="range",le="1"} 2
logql_query_duration_seconds_bucket{query_type="range",le="2.5"} 2
logql_query_duration_seconds_bucket{query_type="range",le="5"} 2
logql_query_duration_seconds_bucket{query_type="range",le="10"} 2
logql_query_duration_seconds_bucket{query_type="range",le="+Inf"} 2
logql_query_duration_seconds_sum{query_type="range"} 0.004294455
logql_query_duration_seconds_count{query_type="range"} 2
# HELP loki_azure_blob_egress_bytes_total Total bytes downloaded from Azure Blob Storage.
# TYPE loki_azure_blob_egress_bytes_total counter
loki_azure_blob_egress_bytes_total 0
# HELP loki_build_info A metric with a constant '1' value labeled by version, revision, branch, goversion from which loki was built, and the goos and goarch for the build.
# TYPE loki_build_info gauge
loki_build_info{branch="release-3.0.x",goarch="amd64",goos="linux",goversion="go1.21.9",revision="b4f7181",tags="netgo",version="3.0.0"} 1
# HELP loki_bytes_per_line The total number of bytes per line.
# TYPE loki_bytes_per_line histogram
loki_bytes_per_line_bucket{le="1"} 97
loki_bytes_per_line_bucket{le="8"} 107
loki_bytes_per_line_bucket{le="64"} 2469
loki_bytes_per_line_bucket{le="512"} 10407
loki_bytes_per_line_bucket{le="4096"} 10413
loki_bytes_per_line_bucket{le="32768"} 10413
loki_bytes_per_line_bucket{le="262144"} 10413
loki_bytes_per_line_bucket{le="2.097152e+06"} 10413
loki_bytes_per_line_bucket{le="+Inf"} 10413
loki_bytes_per_line_sum 1.044632e+06
loki_bytes_per_line_count 10413
# HELP loki_cache_corrupt_chunks_total Total count of corrupt chunks found in cache.
# TYPE loki_cache_corrupt_chunks_total counter
loki_cache_corrupt_chunks_total 0
# HELP loki_cache_fetched_keys Total count of keys requested from cache.
# TYPE loki_cache_fetched_keys counter
loki_cache_fetched_keys{name="chunksembedded-cache"} 60
loki_cache_fetched_keys{name="frontend.index-stats-results-cache.embedded-cache"} 0
loki_cache_fetched_keys{name="frontend.label-results-cache.embedded-cache"} 0
loki_cache_fetched_keys{name="frontend.series-results-cache.embedded-cache"} 0
loki_cache_fetched_keys{name="frontend.volume-results-cache.embedded-cache"} 0
# HELP loki_cache_hits Total count of keys found in cache.
# TYPE loki_cache_hits counter
loki_cache_hits{name="chunksembedded-cache"} 5
loki_cache_hits{name="frontend.index-stats-results-cache.embedded-cache"} 0
loki_cache_hits{name="frontend.label-results-cache.embedded-cache"} 0
loki_cache_hits{name="frontend.series-results-cache.embedded-cache"} 0
loki_cache_hits{name="frontend.volume-results-cache.embedded-cache"} 0
# HELP loki_cache_request_duration_seconds Total time spent in seconds doing cache requests.
# TYPE loki_cache_request_duration_seconds histogram
loki_cache_request_duration_seconds_bucket{method="chunksembedded-cache.fetch",name="chunksembedded-cache",status_code="200",le="1.6e-05"} 55
loki_cache_request_duration_seconds_bucket{method="chunksembedded-cache.fetch",name="chunksembedded-cache",status_code="200",le="6.4e-05"} 56
loki_cache_request_duration_seconds_bucket{method="chunksembedded-cache.fetch",name="chunksembedded-cache",status_code="200",le="0.000256"} 56
loki_cache_request_duration_seconds_bucket{method="chunksembedded-cache.fetch",name="chunksembedded-cache",status_code="200",le="0.001024"} 56
loki_cache_request_duration_seconds_bucket{method="chunksembedded-cache.fetch",name="chunksembedded-cache",status_code="200",le="0.004096"} 56
loki_cache_request_duration_seconds_bucket{method="chunksembedded-cache.fetch",name="chunksembedded-cache",status_code="200",le="0.016384"} 56
loki_cache_request_duration_seconds_bucket{method="chunksembedded-cache.fetch",name="chunksembedded-cache",status_code="200",le="0.065536"} 56
loki_cache_request_duration_seconds_bucket{method="chunksembedded-cache.fetch",name="chunksembedded-cache",status_code="200",le="0.262144"} 56
loki_cache_request_duration_seconds_bucket{method="chunksembedded-cache.fetch",name="chunksembedded-cache",status_code="200",le="+Inf"} 56
loki_cache_request_duration_seconds_sum{method="chunksembedded-cache.fetch",name="chunksembedded-cache",status_code="200"} 0.00011773100000000003
loki_cache_request_duration_seconds_count{method="chunksembedded-cache.fetch",name="chunksembedded-cache",status_code="200"} 56
loki_cache_request_duration_seconds_bucket{method="chunksembedded-cache.store",name="chunksembedded-cache",status_code="200",le="1.6e-05"} 56
loki_cache_request_duration_seconds_bucket{method="chunksembedded-cache.store",name="chunksembedded-cache",status_code="200",le="6.4e-05"} 56
loki_cache_request_duration_seconds_bucket{method="chunksembedded-cache.store",name="chunksembedded-cache",status_code="200",le="0.000256"} 56
loki_cache_request_duration_seconds_bucket{method="chunksembedded-cache.store",name="chunksembedded-cache",status_code="200",le="0.001024"} 56
loki_cache_request_duration_seconds_bucket{method="chunksembedded-cache.store",name="chunksembedded-cache",status_code="200",le="0.004096"} 56
loki_cache_request_duration_seconds_bucket{method="chunksembedded-cache.store",name="chunksembedded-cache",status_code="200",le="0.016384"} 56
loki_cache_request_duration_seconds_bucket{method="chunksembedded-cache.store",name="chunksembedded-cache",status_code="200",le="0.065536"} 56
loki_cache_request_duration_seconds_bucket{method="chunksembedded-cache.store",name="chunksembedded-cache",status_code="200",le="0.262144"} 56
loki_cache_request_duration_seconds_bucket{method="chunksembedded-cache.store",name="chunksembedded-cache",status_code="200",le="+Inf"} 56
loki_cache_request_duration_seconds_sum{method="chunksembedded-cache.store",name="chunksembedded-cache",status_code="200"} 0.000106838
loki_cache_request_duration_seconds_count{method="chunksembedded-cache.store",name="chunksembedded-cache",status_code="200"} 56
# HELP loki_cache_value_size_bytes Size of values in the cache.
# TYPE loki_cache_value_size_bytes histogram
loki_cache_value_size_bytes_bucket{method="fetch",name="chunksembedded-cache",le="1024"} 5
loki_cache_value_size_bytes_bucket{method="fetch",name="chunksembedded-cache",le="4096"} 5
loki_cache_value_size_bytes_bucket{method="fetch",name="chunksembedded-cache",le="16384"} 5
loki_cache_value_size_bytes_bucket{method="fetch",name="chunksembedded-cache",le="65536"} 5
loki_cache_value_size_bytes_bucket{method="fetch",name="chunksembedded-cache",le="262144"} 5
loki_cache_value_size_bytes_bucket{method="fetch",name="chunksembedded-cache",le="1.048576e+06"} 5
loki_cache_value_size_bytes_bucket{method="fetch",name="chunksembedded-cache",le="4.194304e+06"} 5
loki_cache_value_size_bytes_bucket{method="fetch",name="chunksembedded-cache",le="+Inf"} 5
loki_cache_value_size_bytes_sum{method="fetch",name="chunksembedded-cache"} 2303
loki_cache_value_size_bytes_count{method="fetch",name="chunksembedded-cache"} 5
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.index-stats-results-cache.embedded-cache",le="1024"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.index-stats-results-cache.embedded-cache",le="4096"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.index-stats-results-cache.embedded-cache",le="16384"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.index-stats-results-cache.embedded-cache",le="65536"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.index-stats-results-cache.embedded-cache",le="262144"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.index-stats-results-cache.embedded-cache",le="1.048576e+06"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.index-stats-results-cache.embedded-cache",le="4.194304e+06"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.index-stats-results-cache.embedded-cache",le="+Inf"} 0
loki_cache_value_size_bytes_sum{method="fetch",name="frontend.index-stats-results-cache.embedded-cache"} 0
loki_cache_value_size_bytes_count{method="fetch",name="frontend.index-stats-results-cache.embedded-cache"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.label-results-cache.embedded-cache",le="1024"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.label-results-cache.embedded-cache",le="4096"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.label-results-cache.embedded-cache",le="16384"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.label-results-cache.embedded-cache",le="65536"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.label-results-cache.embedded-cache",le="262144"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.label-results-cache.embedded-cache",le="1.048576e+06"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.label-results-cache.embedded-cache",le="4.194304e+06"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.label-results-cache.embedded-cache",le="+Inf"} 0
loki_cache_value_size_bytes_sum{method="fetch",name="frontend.label-results-cache.embedded-cache"} 0
loki_cache_value_size_bytes_count{method="fetch",name="frontend.label-results-cache.embedded-cache"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.series-results-cache.embedded-cache",le="1024"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.series-results-cache.embedded-cache",le="4096"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.series-results-cache.embedded-cache",le="16384"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.series-results-cache.embedded-cache",le="65536"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.series-results-cache.embedded-cache",le="262144"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.series-results-cache.embedded-cache",le="1.048576e+06"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.series-results-cache.embedded-cache",le="4.194304e+06"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.series-results-cache.embedded-cache",le="+Inf"} 0
loki_cache_value_size_bytes_sum{method="fetch",name="frontend.series-results-cache.embedded-cache"} 0
loki_cache_value_size_bytes_count{method="fetch",name="frontend.series-results-cache.embedded-cache"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.volume-results-cache.embedded-cache",le="1024"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.volume-results-cache.embedded-cache",le="4096"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.volume-results-cache.embedded-cache",le="16384"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.volume-results-cache.embedded-cache",le="65536"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.volume-results-cache.embedded-cache",le="262144"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.volume-results-cache.embedded-cache",le="1.048576e+06"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.volume-results-cache.embedded-cache",le="4.194304e+06"} 0
loki_cache_value_size_bytes_bucket{method="fetch",name="frontend.volume-results-cache.embedded-cache",le="+Inf"} 0
loki_cache_value_size_bytes_sum{method="fetch",name="frontend.volume-results-cache.embedded-cache"} 0
loki_cache_value_size_bytes_count{method="fetch",name="frontend.volume-results-cache.embedded-cache"} 0
loki_cache_value_size_bytes_bucket{method="store",name="chunksembedded-cache",le="1024"} 35
loki_cache_value_size_bytes_bucket{method="store",name="chunksembedded-cache",le="4096"} 48
loki_cache_value_size_bytes_bucket{method="store",name="chunksembedded-cache",le="16384"} 49
loki_cache_value_size_bytes_bucket{method="store",name="chunksembedded-cache",le="65536"} 55
loki_cache_value_size_bytes_bucket{method="store",name="chunksembedded-cache",le="262144"} 55
loki_cache_value_size_bytes_bucket{method="store",name="chunksembedded-cache",le="1.048576e+06"} 55
loki_cache_value_size_bytes_bucket{method="store",name="chunksembedded-cache",le="4.194304e+06"} 55
loki_cache_value_size_bytes_bucket{method="store",name="chunksembedded-cache",le="+Inf"} 55
loki_cache_value_size_bytes_sum{method="store",name="chunksembedded-cache"} 227025
loki_cache_value_size_bytes_count{method="store",name="chunksembedded-cache"} 55
loki_cache_value_size_bytes_bucket{method="store",name="frontend.index-stats-results-cache.embedded-cache",le="1024"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.index-stats-results-cache.embedded-cache",le="4096"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.index-stats-results-cache.embedded-cache",le="16384"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.index-stats-results-cache.embedded-cache",le="65536"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.index-stats-results-cache.embedded-cache",le="262144"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.index-stats-results-cache.embedded-cache",le="1.048576e+06"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.index-stats-results-cache.embedded-cache",le="4.194304e+06"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.index-stats-results-cache.embedded-cache",le="+Inf"} 0
loki_cache_value_size_bytes_sum{method="store",name="frontend.index-stats-results-cache.embedded-cache"} 0
loki_cache_value_size_bytes_count{method="store",name="frontend.index-stats-results-cache.embedded-cache"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.label-results-cache.embedded-cache",le="1024"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.label-results-cache.embedded-cache",le="4096"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.label-results-cache.embedded-cache",le="16384"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.label-results-cache.embedded-cache",le="65536"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.label-results-cache.embedded-cache",le="262144"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.label-results-cache.embedded-cache",le="1.048576e+06"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.label-results-cache.embedded-cache",le="4.194304e+06"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.label-results-cache.embedded-cache",le="+Inf"} 0
loki_cache_value_size_bytes_sum{method="store",name="frontend.label-results-cache.embedded-cache"} 0
loki_cache_value_size_bytes_count{method="store",name="frontend.label-results-cache.embedded-cache"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.series-results-cache.embedded-cache",le="1024"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.series-results-cache.embedded-cache",le="4096"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.series-results-cache.embedded-cache",le="16384"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.series-results-cache.embedded-cache",le="65536"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.series-results-cache.embedded-cache",le="262144"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.series-results-cache.embedded-cache",le="1.048576e+06"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.series-results-cache.embedded-cache",le="4.194304e+06"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.series-results-cache.embedded-cache",le="+Inf"} 0
loki_cache_value_size_bytes_sum{method="store",name="frontend.series-results-cache.embedded-cache"} 0
loki_cache_value_size_bytes_count{method="store",name="frontend.series-results-cache.embedded-cache"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.volume-results-cache.embedded-cache",le="1024"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.volume-results-cache.embedded-cache",le="4096"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.volume-results-cache.embedded-cache",le="16384"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.volume-results-cache.embedded-cache",le="65536"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.volume-results-cache.embedded-cache",le="262144"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.volume-results-cache.embedded-cache",le="1.048576e+06"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.volume-results-cache.embedded-cache",le="4.194304e+06"} 0
loki_cache_value_size_bytes_bucket{method="store",name="frontend.volume-results-cache.embedded-cache",le="+Inf"} 0
loki_cache_value_size_bytes_sum{method="store",name="frontend.volume-results-cache.embedded-cache"} 0
loki_cache_value_size_bytes_count{method="store",name="frontend.volume-results-cache.embedded-cache"} 0
# HELP loki_chunk_fetcher_fetched_size_bytes Compressed chunk size distribution fetched from storage.
# TYPE loki_chunk_fetcher_fetched_size_bytes histogram
loki_chunk_fetcher_fetched_size_bytes_bucket{source="cache",le="128"} 0
loki_chunk_fetcher_fetched_size_bytes_bucket{source="cache",le="1024"} 5
loki_chunk_fetcher_fetched_size_bytes_bucket{source="cache",le="16384"} 5
loki_chunk_fetcher_fetched_size_bytes_bucket{source="cache",le="65536"} 5
loki_chunk_fetcher_fetched_size_bytes_bucket{source="cache",le="131072"} 5
loki_chunk_fetcher_fetched_size_bytes_bucket{source="cache",le="262144"} 5
loki_chunk_fetcher_fetched_size_bytes_bucket{source="cache",le="524288"} 5
loki_chunk_fetcher_fetched_size_bytes_bucket{source="cache",le="1.048576e+06"} 5
loki_chunk_fetcher_fetched_size_bytes_bucket{source="cache",le="1.572864e+06"} 5
loki_chunk_fetcher_fetched_size_bytes_bucket{source="cache",le="2.097152e+06"} 5
loki_chunk_fetcher_fetched_size_bytes_bucket{source="cache",le="4.194304e+06"} 5
loki_chunk_fetcher_fetched_size_bytes_bucket{source="cache",le="+Inf"} 5
loki_chunk_fetcher_fetched_size_bytes_sum{source="cache"} 2303
loki_chunk_fetcher_fetched_size_bytes_count{source="cache"} 5
# HELP loki_chunk_store_chunks_per_query Distribution of #chunks per query.
# TYPE loki_chunk_store_chunks_per_query histogram
loki_chunk_store_chunks_per_query_bucket{le="10"} 1
loki_chunk_store_chunks_per_query_bucket{le="80"} 2
loki_chunk_store_chunks_per_query_bucket{le="640"} 2
loki_chunk_store_chunks_per_query_bucket{le="5120"} 2
loki_chunk_store_chunks_per_query_bucket{le="40960"} 2
loki_chunk_store_chunks_per_query_bucket{le="327680"} 2
loki_chunk_store_chunks_per_query_bucket{le="2.62144e+06"} 2
loki_chunk_store_chunks_per_query_bucket{le="+Inf"} 2
loki_chunk_store_chunks_per_query_sum 55
loki_chunk_store_chunks_per_query_count 2
# HELP loki_chunk_store_deduped_bytes_total Count of bytes from chunks which were not stored because they have already been stored by another replica.
# TYPE loki_chunk_store_deduped_bytes_total counter
loki_chunk_store_deduped_bytes_total 0
# HELP loki_chunk_store_deduped_chunks_total Count of chunks which were not stored because they have already been stored by another replica.
# TYPE loki_chunk_store_deduped_chunks_total counter
loki_chunk_store_deduped_chunks_total 0
# HELP loki_chunk_store_index_entries_per_chunk Number of entries written to storage per chunk.
# TYPE loki_chunk_store_index_entries_per_chunk histogram
loki_chunk_store_index_entries_per_chunk_bucket{le="1"} 0
loki_chunk_store_index_entries_per_chunk_bucket{le="2"} 0
loki_chunk_store_index_entries_per_chunk_bucket{le="4"} 0
loki_chunk_store_index_entries_per_chunk_bucket{le="8"} 55
loki_chunk_store_index_entries_per_chunk_bucket{le="16"} 55
loki_chunk_store_index_entries_per_chunk_bucket{le="+Inf"} 55
loki_chunk_store_index_entries_per_chunk_sum 374
loki_chunk_store_index_entries_per_chunk_count 55
# HELP loki_chunk_store_index_lookups_per_query Distribution of #index lookups per query.
# TYPE loki_chunk_store_index_lookups_per_query histogram
loki_chunk_store_index_lookups_per_query_bucket{le="1"} 3
loki_chunk_store_index_lookups_per_query_bucket{le="2"} 3
loki_chunk_store_index_lookups_per_query_bucket{le="4"} 3
loki_chunk_store_index_lookups_per_query_bucket{le="8"} 3
loki_chunk_store_index_lookups_per_query_bucket{le="16"} 3
loki_chunk_store_index_lookups_per_query_bucket{le="+Inf"} 3
loki_chunk_store_index_lookups_per_query_sum 3
loki_chunk_store_index_lookups_per_query_count 3
# HELP loki_chunk_store_series_post_intersection_per_query Distribution of #series (post intersection) per query.
# TYPE loki_chunk_store_series_post_intersection_per_query histogram
loki_chunk_store_series_post_intersection_per_query_bucket{le="10"} 0
loki_chunk_store_series_post_intersection_per_query_bucket{le="80"} 2
loki_chunk_store_series_post_intersection_per_query_bucket{le="640"} 2
loki_chunk_store_series_post_intersection_per_query_bucket{le="5120"} 2
loki_chunk_store_series_post_intersection_per_query_bucket{le="40960"} 2
loki_chunk_store_series_post_intersection_per_query_bucket{le="327680"} 2
loki_chunk_store_series_post_intersection_per_query_bucket{le="+Inf"} 2
loki_chunk_store_series_post_intersection_per_query_sum 100
loki_chunk_store_series_post_intersection_per_query_count 2
# HELP loki_chunk_store_series_pre_intersection_per_query Distribution of #series (pre intersection) per query.
# TYPE loki_chunk_store_series_pre_intersection_per_query histogram
loki_chunk_store_series_pre_intersection_per_query_bucket{le="10"} 0
loki_chunk_store_series_pre_intersection_per_query_bucket{le="80"} 2
loki_chunk_store_series_pre_intersection_per_query_bucket{le="640"} 2
loki_chunk_store_series_pre_intersection_per_query_bucket{le="5120"} 2
loki_chunk_store_series_pre_intersection_per_query_bucket{le="40960"} 2
loki_chunk_store_series_pre_intersection_per_query_bucket{le="327680"} 2
loki_chunk_store_series_pre_intersection_per_query_bucket{le="+Inf"} 2
loki_chunk_store_series_pre_intersection_per_query_sum 100
loki_chunk_store_series_pre_intersection_per_query_count 2
# HELP loki_chunk_store_stored_chunk_bytes_total Total bytes stored in chunks per user.
# TYPE loki_chunk_store_stored_chunk_bytes_total counter
loki_chunk_store_stored_chunk_bytes_total{user="fake"} 212756
# HELP loki_chunk_store_stored_chunks_total Total stored chunks per user.
# TYPE loki_chunk_store_stored_chunks_total counter
loki_chunk_store_stored_chunks_total{user="fake"} 55
# HELP loki_consul_request_duration_seconds Time spent on consul requests.
# TYPE loki_consul_request_duration_seconds histogram
loki_consul_request_duration_seconds_bucket{kv_name="ingester-ring",operation="CAS loop",status_code="200",le="0.005"} 636
loki_consul_request_duration_seconds_bucket{kv_name="ingester-ring",operation="CAS loop",status_code="200",le="0.01"} 636
loki_consul_request_duration_seconds_bucket{kv_name="ingester-ring",operation="CAS loop",status_code="200",le="0.025"} 636
loki_consul_request_duration_seconds_bucket{kv_name="ingester-ring",operation="CAS loop",status_code="200",le="0.05"} 636
loki_consul_request_duration_seconds_bucket{kv_name="ingester-ring",operation="CAS loop",status_code="200",le="0.1"} 636
loki_consul_request_duration_seconds_bucket{kv_name="ingester-ring",operation="CAS loop",status_code="200",le="0.25"} 636
loki_consul_request_duration_seconds_bucket{kv_name="ingester-ring",operation="CAS loop",status_code="200",le="0.5"} 636
loki_consul_request_duration_seconds_bucket{kv_name="ingester-ring",operation="CAS loop",status_code="200",le="1"} 636
loki_consul_request_duration_seconds_bucket{kv_name="ingester-ring",operation="CAS loop",status_code="200",le="2.5"} 636
loki_consul_request_duration_seconds_bucket{kv_name="ingester-ring",operation="CAS loop",status_code="200",le="5"} 636
loki_consul_request_duration_seconds_bucket{kv_name="ingester-ring",operation="CAS loop",status_code="200",le="10"} 636
loki_consul_request_duration_seconds_bucket{kv_name="ingester-ring",operation="CAS loop",status_code="200",le="+Inf"} 636
loki_consul_request_duration_seconds_sum{kv_name="ingester-ring",operation="CAS loop",status_code="200"} 0.038998843999999984
loki_consul_request_duration_seconds_count{kv_name="ingester-ring",operation="CAS loop",status_code="200"} 636
# HELP loki_delete_request_lookups_failed_total Number times the client has failed to look up delete requests
# TYPE loki_delete_request_lookups_failed_total counter
loki_delete_request_lookups_failed_total 0
# HELP loki_delete_request_lookups_total Number times the client has looked up delete requests
# TYPE loki_delete_request_lookups_total counter
loki_delete_request_lookups_total 0
# HELP loki_distributor_bytes_received_total The total number of uncompressed bytes received per tenant. Includes structured metadata bytes.
# TYPE loki_distributor_bytes_received_total counter
loki_distributor_bytes_received_total{retention_hours="24",tenant="fake"} 1.044632e+06
# HELP loki_distributor_ingester_appends_total The total number of batch appends sent to ingesters.
# TYPE loki_distributor_ingester_appends_total counter
loki_distributor_ingester_appends_total{ingester="192.168.0.20:9095"} 54
# HELP loki_distributor_ingester_clients The current number of ingester clients.
# TYPE loki_distributor_ingester_clients gauge
loki_distributor_ingester_clients 3
# HELP loki_distributor_lines_received_total The total number of lines received per tenant
# TYPE loki_distributor_lines_received_total counter
loki_distributor_lines_received_total{tenant="fake"} 10413
# HELP loki_distributor_replication_factor The configured replication factor.
# TYPE loki_distributor_replication_factor gauge
loki_distributor_replication_factor 1
# HELP loki_distributor_structured_metadata_bytes_received_total The total number of uncompressed bytes received per tenant for entries' structured metadata
# TYPE loki_distributor_structured_metadata_bytes_received_total counter
loki_distributor_structured_metadata_bytes_received_total{retention_hours="24",tenant="fake"} 0
# HELP loki_dns_failures_total The number of DNS lookup failures
# TYPE loki_dns_failures_total counter
loki_dns_failures_total{name="memberlist"} 0
# HELP loki_dns_lookups_total The number of DNS lookups resolutions attempts
# TYPE loki_dns_lookups_total counter
loki_dns_lookups_total{name="memberlist"} 0
# HELP loki_embeddedcache_added_new_total The total number of new entries added to the cache
# TYPE loki_embeddedcache_added_new_total counter
loki_embeddedcache_added_new_total{cache="chunksembedded-cache"} 55
loki_embeddedcache_added_new_total{cache="frontend.index-stats-results-cache.embedded-cache"} 0
loki_embeddedcache_added_new_total{cache="frontend.label-results-cache.embedded-cache"} 0
loki_embeddedcache_added_new_total{cache="frontend.series-results-cache.embedded-cache"} 0
loki_embeddedcache_added_new_total{cache="frontend.volume-results-cache.embedded-cache"} 0
# HELP loki_embeddedcache_entries Current number of entries in the cache
# TYPE loki_embeddedcache_entries gauge
loki_embeddedcache_entries{cache="chunksembedded-cache"} 55
loki_embeddedcache_entries{cache="frontend.index-stats-results-cache.embedded-cache"} 0
loki_embeddedcache_entries{cache="frontend.label-results-cache.embedded-cache"} 0
loki_embeddedcache_entries{cache="frontend.series-results-cache.embedded-cache"} 0
loki_embeddedcache_entries{cache="frontend.volume-results-cache.embedded-cache"} 0
# HELP loki_embeddedcache_memory_bytes The current cache size in bytes
# TYPE loki_embeddedcache_memory_bytes gauge
loki_embeddedcache_memory_bytes{cache="chunksembedded-cache"} 448275
loki_embeddedcache_memory_bytes{cache="frontend.index-stats-results-cache.embedded-cache"} 0
loki_embeddedcache_memory_bytes{cache="frontend.label-results-cache.embedded-cache"} 0
loki_embeddedcache_memory_bytes{cache="frontend.series-results-cache.embedded-cache"} 0
loki_embeddedcache_memory_bytes{cache="frontend.volume-results-cache.embedded-cache"} 0
# HELP loki_experimental_features_in_use_total The number of experimental features in use.
# TYPE loki_experimental_features_in_use_total counter
loki_experimental_features_in_use_total 0
# HELP loki_frontend_query_range_duration_seconds Total time spent in seconds doing query range requests.
# TYPE loki_frontend_query_range_duration_seconds histogram
loki_frontend_query_range_duration_seconds_bucket{method="label_results_cache",status_code="200",le="0.005"} 2
loki_frontend_query_range_duration_seconds_bucket{method="label_results_cache",status_code="200",le="0.01"} 2
loki_frontend_query_range_duration_seconds_bucket{method="label_results_cache",status_code="200",le="0.025"} 2
loki_frontend_query_range_duration_seconds_bucket{method="label_results_cache",status_code="200",le="0.05"} 2
loki_frontend_query_range_duration_seconds_bucket{method="label_results_cache",status_code="200",le="0.1"} 2
loki_frontend_query_range_duration_seconds_bucket{method="label_results_cache",status_code="200",le="0.25"} 2
loki_frontend_query_range_duration_seconds_bucket{method="label_results_cache",status_code="200",le="0.5"} 2
loki_frontend_query_range_duration_seconds_bucket{method="label_results_cache",status_code="200",le="1"} 2
loki_frontend_query_range_duration_seconds_bucket{method="label_results_cache",status_code="200",le="2.5"} 2
loki_frontend_query_range_duration_seconds_bucket{method="label_results_cache",status_code="200",le="5"} 2
loki_frontend_query_range_duration_seconds_bucket{method="label_results_cache",status_code="200",le="10"} 2
loki_frontend_query_range_duration_seconds_bucket{method="label_results_cache",status_code="200",le="+Inf"} 2
loki_frontend_query_range_duration_seconds_sum{method="label_results_cache",status_code="200"} 0.0032634450000000002
loki_frontend_query_range_duration_seconds_count{method="label_results_cache",status_code="200"} 2
loki_frontend_query_range_duration_seconds_bucket{method="retry",status_code="200",le="0.005"} 2
loki_frontend_query_range_duration_seconds_bucket{method="retry",status_code="200",le="0.01"} 2
loki_frontend_query_range_duration_seconds_bucket{method="retry",status_code="200",le="0.025"} 2
loki_frontend_query_range_duration_seconds_bucket{method="retry",status_code="200",le="0.05"} 2
loki_frontend_query_range_duration_seconds_bucket{method="retry",status_code="200",le="0.1"} 2
loki_frontend_query_range_duration_seconds_bucket{method="retry",status_code="200",le="0.25"} 2
loki_frontend_query_range_duration_seconds_bucket{method="retry",status_code="200",le="0.5"} 2
loki_frontend_query_range_duration_seconds_bucket{method="retry",status_code="200",le="1"} 2
loki_frontend_query_range_duration_seconds_bucket{method="retry",status_code="200",le="2.5"} 2
loki_frontend_query_range_duration_seconds_bucket{method="retry",status_code="200",le="5"} 2
loki_frontend_query_range_duration_seconds_bucket{method="retry",status_code="200",le="10"} 2
loki_frontend_query_range_duration_seconds_bucket{method="retry",status_code="200",le="+Inf"} 2
loki_frontend_query_range_duration_seconds_sum{method="retry",status_code="200"} 0.0032452519999999997
loki_frontend_query_range_duration_seconds_count{method="retry",status_code="200"} 2
loki_frontend_query_range_duration_seconds_bucket{method="split_by_interval",status_code="200",le="0.005"} 3
loki_frontend_query_range_duration_seconds_bucket{method="split_by_interval",status_code="200",le="0.01"} 3
loki_frontend_query_range_duration_seconds_bucket{method="split_by_interval",status_code="200",le="0.025"} 3
loki_frontend_query_range_duration_seconds_bucket{method="split_by_interval",status_code="200",le="0.05"} 3
loki_frontend_query_range_duration_seconds_bucket{method="split_by_interval",status_code="200",le="0.1"} 3
loki_frontend_query_range_duration_seconds_bucket{method="split_by_interval",status_code="200",le="0.25"} 3
loki_frontend_query_range_duration_seconds_bucket{method="split_by_interval",status_code="200",le="0.5"} 3
loki_frontend_query_range_duration_seconds_bucket{method="split_by_interval",status_code="200",le="1"} 3
loki_frontend_query_range_duration_seconds_bucket{method="split_by_interval",status_code="200",le="2.5"} 3
loki_frontend_query_range_duration_seconds_bucket{method="split_by_interval",status_code="200",le="5"} 3
loki_frontend_query_range_duration_seconds_bucket{method="split_by_interval",status_code="200",le="10"} 3
loki_frontend_query_range_duration_seconds_bucket{method="split_by_interval",status_code="200",le="+Inf"} 3
loki_frontend_query_range_duration_seconds_sum{method="split_by_interval",status_code="200"} 0.006594713
loki_frontend_query_range_duration_seconds_count{method="split_by_interval",status_code="200"} 3
# HELP loki_index_chunk_refs_total Number of chunks refs downloaded, partitioned by whether they intersect the query bounds.
# TYPE loki_index_chunk_refs_total counter
loki_index_chunk_refs_total{status="discarded"} 0
loki_index_chunk_refs_total{status="matched"} 55
# HELP loki_index_request_duration_seconds Time (in seconds) spent in serving index query requests
# TYPE loki_index_request_duration_seconds histogram
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="chunk_refs",status_code="200",le="0.005"} 2
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="chunk_refs",status_code="200",le="0.012301915262620913"} 2
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="chunk_refs",status_code="200",le="0.03026742382574107"} 2
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="chunk_refs",status_code="200",le="0.07446945662441999"} 2
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="chunk_refs",status_code="200",le="0.18322338900940766"} 2
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="chunk_refs",status_code="200",le="0.4507997211447921"} 2
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="chunk_refs",status_code="200",le="1.109139993987274"} 2
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="chunk_refs",status_code="200",le="2.7289092440830625"} 2
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="chunk_refs",status_code="200",le="6.7141620560185435"} 2
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="chunk_refs",status_code="200",le="16.519410534528944"} 2
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="chunk_refs",status_code="200",le="40.644077716844464"} 2
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="chunk_refs",status_code="200",le="99.99999999999989"} 2
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="chunk_refs",status_code="200",le="+Inf"} 2
loki_index_request_duration_seconds_sum{component="index-store-boltdb-2024-01-01",operation="chunk_refs",status_code="200"} 0.001736325
loki_index_request_duration_seconds_count{component="index-store-boltdb-2024-01-01",operation="chunk_refs",status_code="200"} 2
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="index_chunk",status_code="200",le="0.005"} 11
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="index_chunk",status_code="200",le="0.012301915262620913"} 15
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="index_chunk",status_code="200",le="0.03026742382574107"} 39
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="index_chunk",status_code="200",le="0.07446945662441999"} 55
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="index_chunk",status_code="200",le="0.18322338900940766"} 55
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="index_chunk",status_code="200",le="0.4507997211447921"} 55
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="index_chunk",status_code="200",le="1.109139993987274"} 55
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="index_chunk",status_code="200",le="2.7289092440830625"} 55
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="index_chunk",status_code="200",le="6.7141620560185435"} 55
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="index_chunk",status_code="200",le="16.519410534528944"} 55
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="index_chunk",status_code="200",le="40.644077716844464"} 55
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="index_chunk",status_code="200",le="99.99999999999989"} 55
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="index_chunk",status_code="200",le="+Inf"} 55
loki_index_request_duration_seconds_sum{component="index-store-boltdb-2024-01-01",operation="index_chunk",status_code="200"} 1.09007327
loki_index_request_duration_seconds_count{component="index-store-boltdb-2024-01-01",operation="index_chunk",status_code="200"} 55
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="label_names",status_code="200",le="0.005"} 1
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="label_names",status_code="200",le="0.012301915262620913"} 1
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="label_names",status_code="200",le="0.03026742382574107"} 1
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="label_names",status_code="200",le="0.07446945662441999"} 1
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="label_names",status_code="200",le="0.18322338900940766"} 1
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="label_names",status_code="200",le="0.4507997211447921"} 1
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="label_names",status_code="200",le="1.109139993987274"} 1
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="label_names",status_code="200",le="2.7289092440830625"} 1
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="label_names",status_code="200",le="6.7141620560185435"} 1
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="label_names",status_code="200",le="16.519410534528944"} 1
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="label_names",status_code="200",le="40.644077716844464"} 1
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="label_names",status_code="200",le="99.99999999999989"} 1
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="label_names",status_code="200",le="+Inf"} 1
loki_index_request_duration_seconds_sum{component="index-store-boltdb-2024-01-01",operation="label_names",status_code="200"} 0.000662417
loki_index_request_duration_seconds_count{component="index-store-boltdb-2024-01-01",operation="label_names",status_code="200"} 1
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="label_values",status_code="200",le="0.005"} 1
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="label_values",status_code="200",le="0.012301915262620913"} 1
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="label_values",status_code="200",le="0.03026742382574107"} 1
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="label_values",status_code="200",le="0.07446945662441999"} 1
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="label_values",status_code="200",le="0.18322338900940766"} 1
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="label_values",status_code="200",le="0.4507997211447921"} 1
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="label_values",status_code="200",le="1.109139993987274"} 1
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="label_values",status_code="200",le="2.7289092440830625"} 1
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="label_values",status_code="200",le="6.7141620560185435"} 1
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="label_values",status_code="200",le="16.519410534528944"} 1
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="label_values",status_code="200",le="40.644077716844464"} 1
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="label_values",status_code="200",le="99.99999999999989"} 1
loki_index_request_duration_seconds_bucket{component="index-store-boltdb-2024-01-01",operation="label_values",status_code="200",le="+Inf"} 1
loki_index_request_duration_seconds_sum{component="index-store-boltdb-2024-01-01",operation="label_values",status_code="200"} 0.000206512
loki_index_request_duration_seconds_count{component="index-store-boltdb-2024-01-01",operation="label_values",status_code="200"} 1
# HELP loki_inflight_requests Current number of inflight requests.
# TYPE loki_inflight_requests gauge
loki_inflight_requests{method="GET",route="loki_api_v1_label_name_values"} 0
loki_inflight_requests{method="GET",route="loki_api_v1_label_values"} 0
loki_inflight_requests{method="GET",route="loki_api_v1_labels"} 0
loki_inflight_requests{method="GET",route="loki_api_v1_query_range"} 0
loki_inflight_requests{method="GET",route="metrics"} 1
loki_inflight_requests{method="GET",route="ready"} 0
loki_inflight_requests{method="POST",route="loki_api_v1_push"} 0
loki_inflight_requests{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult"} 0
loki_inflight_requests{method="gRPC",route="/grpc.health.v1.Health/Check"} 0
loki_inflight_requests{method="gRPC",route="/logproto.Pusher/Push"} 0
loki_inflight_requests{method="gRPC",route="/logproto.Querier/Label"} 0
loki_inflight_requests{method="gRPC",route="/logproto.Querier/Query"} 0
loki_inflight_requests{method="gRPC",route="/logproto.StreamData/GetStreamRates"} 0
loki_inflight_requests{method="gRPC",route="/schedulerpb.SchedulerForFrontend/FrontendLoop"} 5
loki_inflight_requests{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop"} 4
# HELP loki_ingester_autoforget_unhealthy_ingesters_total Total number of ingesters automatically forgotten
# TYPE loki_ingester_autoforget_unhealthy_ingesters_total counter
loki_ingester_autoforget_unhealthy_ingesters_total 0
# HELP loki_ingester_blocks_per_chunk The number of blocks in a chunk.
# TYPE loki_ingester_blocks_per_chunk histogram
loki_ingester_blocks_per_chunk_bucket{le="5"} 4
loki_ingester_blocks_per_chunk_bucket{le="10"} 4
loki_ingester_blocks_per_chunk_bucket{le="20"} 4
loki_ingester_blocks_per_chunk_bucket{le="40"} 4
loki_ingester_blocks_per_chunk_bucket{le="80"} 4
loki_ingester_blocks_per_chunk_bucket{le="160"} 4
loki_ingester_blocks_per_chunk_bucket{le="+Inf"} 4
loki_ingester_blocks_per_chunk_sum 4
loki_ingester_blocks_per_chunk_count 4
# HELP loki_ingester_checkpoint_creations_failed_total Total number of checkpoint creations that failed.
# TYPE loki_ingester_checkpoint_creations_failed_total counter
loki_ingester_checkpoint_creations_failed_total 0
# HELP loki_ingester_checkpoint_creations_total Total number of checkpoint creations attempted.
# TYPE loki_ingester_checkpoint_creations_total counter
loki_ingester_checkpoint_creations_total 3
# HELP loki_ingester_checkpoint_deletions_failed_total Total number of checkpoint deletions that failed.
# TYPE loki_ingester_checkpoint_deletions_failed_total counter
loki_ingester_checkpoint_deletions_failed_total 0
# HELP loki_ingester_checkpoint_deletions_total Total number of checkpoint deletions attempted.
# TYPE loki_ingester_checkpoint_deletions_total counter
loki_ingester_checkpoint_deletions_total 2
# HELP loki_ingester_checkpoint_duration_seconds Time taken to create a checkpoint.
# TYPE loki_ingester_checkpoint_duration_seconds summary
loki_ingester_checkpoint_duration_seconds{quantile="0.5"} 180.003504772
loki_ingester_checkpoint_duration_seconds{quantile="0.9"} 180.003504772
loki_ingester_checkpoint_duration_seconds{quantile="0.99"} 180.003504772
loki_ingester_checkpoint_duration_seconds_sum 280.60403766800005
loki_ingester_checkpoint_duration_seconds_count 2
# HELP loki_ingester_checkpoint_logged_bytes_total Total number of bytes written to disk for checkpointing.
# TYPE loki_ingester_checkpoint_logged_bytes_total counter
loki_ingester_checkpoint_logged_bytes_total 295708
# HELP loki_ingester_chunk_age_seconds Distribution of chunk ages (when stored).
# TYPE loki_ingester_chunk_age_seconds histogram
loki_ingester_chunk_age_seconds_bucket{le="60"} 0
loki_ingester_chunk_age_seconds_bucket{le="300"} 0
loki_ingester_chunk_age_seconds_bucket{le="600"} 22
loki_ingester_chunk_age_seconds_bucket{le="1800"} 55
loki_ingester_chunk_age_seconds_bucket{le="3600"} 55
loki_ingester_chunk_age_seconds_bucket{le="7200"} 55
loki_ingester_chunk_age_seconds_bucket{le="14400"} 55
loki_ingester_chunk_age_seconds_bucket{le="36000"} 55
loki_ingester_chunk_age_seconds_bucket{le="43200"} 55
loki_ingester_chunk_age_seconds_bucket{le="57600"} 55
loki_ingester_chunk_age_seconds_bucket{le="+Inf"} 55
loki_ingester_chunk_age_seconds_sum 36932.114011804995
loki_ingester_chunk_age_seconds_count 55
# HELP loki_ingester_chunk_bounds_hours Distribution of chunk end-start durations.
# TYPE loki_ingester_chunk_bounds_hours histogram
loki_ingester_chunk_bounds_hours_bucket{le="1"} 55
loki_ingester_chunk_bounds_hours_bucket{le="2"} 55
loki_ingester_chunk_bounds_hours_bucket{le="3"} 55
loki_ingester_chunk_bounds_hours_bucket{le="4"} 55
loki_ingester_chunk_bounds_hours_bucket{le="5"} 55
loki_ingester_chunk_bounds_hours_bucket{le="6"} 55
loki_ingester_chunk_bounds_hours_bucket{le="7"} 55
loki_ingester_chunk_bounds_hours_bucket{le="8"} 55
loki_ingester_chunk_bounds_hours_bucket{le="+Inf"} 55
loki_ingester_chunk_bounds_hours_sum 1.8698896206102777
loki_ingester_chunk_bounds_hours_count 55
# HELP loki_ingester_chunk_compression_ratio Compression ratio of chunks (when stored).
# TYPE loki_ingester_chunk_compression_ratio histogram
loki_ingester_chunk_compression_ratio_bucket{le="0.75"} 29
loki_ingester_chunk_compression_ratio_bucket{le="2.75"} 44
loki_ingester_chunk_compression_ratio_bucket{le="4.75"} 51
loki_ingester_chunk_compression_ratio_bucket{le="6.75"} 54
loki_ingester_chunk_compression_ratio_bucket{le="8.75"} 55
loki_ingester_chunk_compression_ratio_bucket{le="10.75"} 55
loki_ingester_chunk_compression_ratio_bucket{le="12.75"} 55
loki_ingester_chunk_compression_ratio_bucket{le="14.75"} 55
loki_ingester_chunk_compression_ratio_bucket{le="16.75"} 55
loki_ingester_chunk_compression_ratio_bucket{le="18.75"} 55
loki_ingester_chunk_compression_ratio_bucket{le="+Inf"} 55
loki_ingester_chunk_compression_ratio_sum 86.58557657065921
loki_ingester_chunk_compression_ratio_count 55
# HELP loki_ingester_chunk_encode_time_seconds Distribution of chunk encode times.
# TYPE loki_ingester_chunk_encode_time_seconds histogram
loki_ingester_chunk_encode_time_seconds_bucket{le="0.01"} 55
loki_ingester_chunk_encode_time_seconds_bucket{le="0.04"} 55
loki_ingester_chunk_encode_time_seconds_bucket{le="0.16"} 55
loki_ingester_chunk_encode_time_seconds_bucket{le="0.64"} 55
loki_ingester_chunk_encode_time_seconds_bucket{le="2.56"} 55
loki_ingester_chunk_encode_time_seconds_bucket{le="10.24"} 55
loki_ingester_chunk_encode_time_seconds_bucket{le="+Inf"} 55
loki_ingester_chunk_encode_time_seconds_sum 0.001300975
loki_ingester_chunk_encode_time_seconds_count 55
# HELP loki_ingester_chunk_entries Distribution of stored lines per chunk (when stored).
# TYPE loki_ingester_chunk_entries histogram
loki_ingester_chunk_entries_bucket{le="200"} 48
loki_ingester_chunk_entries_bucket{le="400"} 49
loki_ingester_chunk_entries_bucket{le="800"} 49
loki_ingester_chunk_entries_bucket{le="1600"} 54
loki_ingester_chunk_entries_bucket{le="3200"} 55
loki_ingester_chunk_entries_bucket{le="6400"} 55
loki_ingester_chunk_entries_bucket{le="12800"} 55
loki_ingester_chunk_entries_bucket{le="25600"} 55
loki_ingester_chunk_entries_bucket{le="51200"} 55
loki_ingester_chunk_entries_bucket{le="+Inf"} 55
loki_ingester_chunk_entries_sum 9784
loki_ingester_chunk_entries_count 55
# HELP loki_ingester_chunk_size_bytes Distribution of stored chunk sizes (when stored).
# TYPE loki_ingester_chunk_size_bytes histogram
loki_ingester_chunk_size_bytes_bucket{le="20000"} 50
loki_ingester_chunk_size_bytes_bucket{le="40000"} 54
loki_ingester_chunk_size_bytes_bucket{le="80000"} 55
loki_ingester_chunk_size_bytes_bucket{le="160000"} 55
loki_ingester_chunk_size_bytes_bucket{le="320000"} 55
loki_ingester_chunk_size_bytes_bucket{le="640000"} 55
loki_ingester_chunk_size_bytes_bucket{le="1.28e+06"} 55
loki_ingester_chunk_size_bytes_bucket{le="2.56e+06"} 55
loki_ingester_chunk_size_bytes_bucket{le="5.12e+06"} 55
loki_ingester_chunk_size_bytes_bucket{le="1.024e+07"} 55
loki_ingester_chunk_size_bytes_bucket{le="+Inf"} 55
loki_ingester_chunk_size_bytes_sum 227025
loki_ingester_chunk_size_bytes_count 55
# HELP loki_ingester_chunk_stored_bytes_total Total bytes stored in chunks per tenant.
# TYPE loki_ingester_chunk_stored_bytes_total counter
loki_ingester_chunk_stored_bytes_total{tenant="fake"} 227025
# HELP loki_ingester_chunk_utilization Distribution of stored chunk utilization (when stored).
# TYPE loki_ingester_chunk_utilization histogram
loki_ingester_chunk_utilization_bucket{le="0"} 0
loki_ingester_chunk_utilization_bucket{le="0.2"} 55
loki_ingester_chunk_utilization_bucket{le="0.4"} 55
loki_ingester_chunk_utilization_bucket{le="0.6000000000000001"} 55
loki_ingester_chunk_utilization_bucket{le="0.8"} 55
loki_ingester_chunk_utilization_bucket{le="1"} 55
loki_ingester_chunk_utilization_bucket{le="+Inf"} 55
loki_ingester_chunk_utilization_sum 0.13526662190755206
loki_ingester_chunk_utilization_count 55
# HELP loki_ingester_chunks_created_total The total number of chunks created in the ingester.
# TYPE loki_ingester_chunks_created_total counter
loki_ingester_chunks_created_total 59
# HELP loki_ingester_chunks_flushed_total Total flushed chunks per reason.
# TYPE loki_ingester_chunks_flushed_total counter
loki_ingester_chunks_flushed_total{reason="idle"} 55
# HELP loki_ingester_chunks_stored_total Total stored chunks per tenant.
# TYPE loki_ingester_chunks_stored_total counter
loki_ingester_chunks_stored_total{tenant="fake"} 55
# HELP loki_ingester_client_request_duration_seconds Time spent doing Ingester requests.
# TYPE loki_ingester_client_request_duration_seconds histogram
loki_ingester_client_request_duration_seconds_bucket{operation="/grpc.health.v1.Health/Check",status_code="2xx",le="0.001"} 75
loki_ingester_client_request_duration_seconds_bucket{operation="/grpc.health.v1.Health/Check",status_code="2xx",le="0.004"} 75
loki_ingester_client_request_duration_seconds_bucket{operation="/grpc.health.v1.Health/Check",status_code="2xx",le="0.016"} 75
loki_ingester_client_request_duration_seconds_bucket{operation="/grpc.health.v1.Health/Check",status_code="2xx",le="0.064"} 75
loki_ingester_client_request_duration_seconds_bucket{operation="/grpc.health.v1.Health/Check",status_code="2xx",le="0.256"} 75
loki_ingester_client_request_duration_seconds_bucket{operation="/grpc.health.v1.Health/Check",status_code="2xx",le="1.024"} 75
loki_ingester_client_request_duration_seconds_bucket{operation="/grpc.health.v1.Health/Check",status_code="2xx",le="+Inf"} 75
loki_ingester_client_request_duration_seconds_sum{operation="/grpc.health.v1.Health/Check",status_code="2xx"} 0.030957223000000013
loki_ingester_client_request_duration_seconds_count{operation="/grpc.health.v1.Health/Check",status_code="2xx"} 75
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.Pusher/Push",status_code="2xx",le="0.001"} 50
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.Pusher/Push",status_code="2xx",le="0.004"} 52
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.Pusher/Push",status_code="2xx",le="0.016"} 52
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.Pusher/Push",status_code="2xx",le="0.064"} 54
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.Pusher/Push",status_code="2xx",le="0.256"} 54
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.Pusher/Push",status_code="2xx",le="1.024"} 54
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.Pusher/Push",status_code="2xx",le="+Inf"} 54
loki_ingester_client_request_duration_seconds_sum{operation="/logproto.Pusher/Push",status_code="2xx"} 0.073521824
loki_ingester_client_request_duration_seconds_count{operation="/logproto.Pusher/Push",status_code="2xx"} 54
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.Querier/Label",status_code="2xx",le="0.001"} 2
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.Querier/Label",status_code="2xx",le="0.004"} 2
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.Querier/Label",status_code="2xx",le="0.016"} 2
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.Querier/Label",status_code="2xx",le="0.064"} 2
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.Querier/Label",status_code="2xx",le="0.256"} 2
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.Querier/Label",status_code="2xx",le="1.024"} 2
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.Querier/Label",status_code="2xx",le="+Inf"} 2
loki_ingester_client_request_duration_seconds_sum{operation="/logproto.Querier/Label",status_code="2xx"} 0.000902253
loki_ingester_client_request_duration_seconds_count{operation="/logproto.Querier/Label",status_code="2xx"} 2
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.Querier/Query",status_code="2xx",le="0.001"} 0
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.Querier/Query",status_code="2xx",le="0.004"} 1
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.Querier/Query",status_code="2xx",le="0.016"} 1
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.Querier/Query",status_code="2xx",le="0.064"} 1
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.Querier/Query",status_code="2xx",le="0.256"} 1
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.Querier/Query",status_code="2xx",le="1.024"} 1
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.Querier/Query",status_code="2xx",le="+Inf"} 1
loki_ingester_client_request_duration_seconds_sum{operation="/logproto.Querier/Query",status_code="2xx"} 0.001370823
loki_ingester_client_request_duration_seconds_count{operation="/logproto.Querier/Query",status_code="2xx"} 1
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.Querier/Query",status_code="cancel",le="0.001"} 1
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.Querier/Query",status_code="cancel",le="0.004"} 1
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.Querier/Query",status_code="cancel",le="0.016"} 1
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.Querier/Query",status_code="cancel",le="0.064"} 1
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.Querier/Query",status_code="cancel",le="0.256"} 1
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.Querier/Query",status_code="cancel",le="1.024"} 1
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.Querier/Query",status_code="cancel",le="+Inf"} 1
loki_ingester_client_request_duration_seconds_sum{operation="/logproto.Querier/Query",status_code="cancel"} 0.000802554
loki_ingester_client_request_duration_seconds_count{operation="/logproto.Querier/Query",status_code="cancel"} 1
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.StreamData/GetStreamRates",status_code="2xx",le="0.001"} 922
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.StreamData/GetStreamRates",status_code="2xx",le="0.004"} 928
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.StreamData/GetStreamRates",status_code="2xx",le="0.016"} 928
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.StreamData/GetStreamRates",status_code="2xx",le="0.064"} 928
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.StreamData/GetStreamRates",status_code="2xx",le="0.256"} 928
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.StreamData/GetStreamRates",status_code="2xx",le="1.024"} 928
loki_ingester_client_request_duration_seconds_bucket{operation="/logproto.StreamData/GetStreamRates",status_code="2xx",le="+Inf"} 928
loki_ingester_client_request_duration_seconds_sum{operation="/logproto.StreamData/GetStreamRates",status_code="2xx"} 0.45206503999999964
loki_ingester_client_request_duration_seconds_count{operation="/logproto.StreamData/GetStreamRates",status_code="2xx"} 928
# HELP loki_ingester_flush_queue_length The total number of series pending in the flush queue.
# TYPE loki_ingester_flush_queue_length gauge
loki_ingester_flush_queue_length 0
# HELP loki_ingester_limiter_enabled Whether the ingester's limiter is enabled
# TYPE loki_ingester_limiter_enabled gauge
loki_ingester_limiter_enabled 1
# HELP loki_ingester_memory_chunks The total number of chunks in memory.
# TYPE loki_ingester_memory_chunks gauge
loki_ingester_memory_chunks 4
# HELP loki_ingester_memory_streams The total number of streams in memory per tenant.
# TYPE loki_ingester_memory_streams gauge
loki_ingester_memory_streams{tenant="fake"} 4
# HELP loki_ingester_memory_streams_labels_bytes Total bytes of labels of the streams in memory.
# TYPE loki_ingester_memory_streams_labels_bytes gauge
loki_ingester_memory_streams_labels_bytes 351
# HELP loki_ingester_samples_per_chunk The number of samples in a chunk.
# TYPE loki_ingester_samples_per_chunk histogram
loki_ingester_samples_per_chunk_bucket{le="4096"} 4
loki_ingester_samples_per_chunk_bucket{le="6144"} 4
loki_ingester_samples_per_chunk_bucket{le="8192"} 4
loki_ingester_samples_per_chunk_bucket{le="10240"} 4
loki_ingester_samples_per_chunk_bucket{le="12288"} 4
loki_ingester_samples_per_chunk_bucket{le="14336"} 4
loki_ingester_samples_per_chunk_bucket{le="+Inf"} 4
loki_ingester_samples_per_chunk_sum 380
loki_ingester_samples_per_chunk_count 4
# HELP loki_ingester_shutdown_marker 1 if prepare shutdown has been called, 0 otherwise
# TYPE loki_ingester_shutdown_marker gauge
loki_ingester_shutdown_marker 0
# HELP loki_ingester_streams_created_total The total number of streams created per tenant.
# TYPE loki_ingester_streams_created_total counter
loki_ingester_streams_created_total{tenant="fake"} 55
# HELP loki_ingester_streams_removed_total The total number of streams removed per tenant.
# TYPE loki_ingester_streams_removed_total counter
loki_ingester_streams_removed_total{tenant="fake"} 51
# HELP loki_ingester_wal_bytes_in_use Total number of bytes in use by the WAL recovery process.
# TYPE loki_ingester_wal_bytes_in_use gauge
loki_ingester_wal_bytes_in_use 0
# HELP loki_ingester_wal_disk_full_failures_total Total number of wal write failures due to full disk.
# TYPE loki_ingester_wal_disk_full_failures_total counter
loki_ingester_wal_disk_full_failures_total 0
# HELP loki_ingester_wal_duplicate_entries_total Entries discarded during WAL replay due to existing in checkpoints.
# TYPE loki_ingester_wal_duplicate_entries_total counter
loki_ingester_wal_duplicate_entries_total 0
# HELP loki_ingester_wal_logged_bytes_total Total number of bytes written to disk for WAL records.
# TYPE loki_ingester_wal_logged_bytes_total counter
loki_ingester_wal_logged_bytes_total 1.122768e+06
# HELP loki_ingester_wal_records_logged_total Total number of WAL records logged.
# TYPE loki_ingester_wal_records_logged_total counter
loki_ingester_wal_records_logged_total 63
# HELP loki_ingester_wal_recovered_bytes_total Total number of bytes recovered from the WAL.
# TYPE loki_ingester_wal_recovered_bytes_total counter
loki_ingester_wal_recovered_bytes_total 0
# HELP loki_ingester_wal_recovered_chunks_total Total number of chunks recovered from the WAL checkpoints.
# TYPE loki_ingester_wal_recovered_chunks_total counter
loki_ingester_wal_recovered_chunks_total 0
# HELP loki_ingester_wal_recovered_entries_total Total number of entries recovered from the WAL.
# TYPE loki_ingester_wal_recovered_entries_total counter
loki_ingester_wal_recovered_entries_total 0
# HELP loki_ingester_wal_recovered_streams_total Total number of streams recovered from the WAL.
# TYPE loki_ingester_wal_recovered_streams_total counter
loki_ingester_wal_recovered_streams_total 0
# HELP loki_ingester_wal_replay_active Whether the WAL is replaying
# TYPE loki_ingester_wal_replay_active gauge
loki_ingester_wal_replay_active 0
# HELP loki_ingester_wal_replay_duration_seconds Time taken to replay the checkpoint and the WAL.
# TYPE loki_ingester_wal_replay_duration_seconds gauge
loki_ingester_wal_replay_duration_seconds 0.000364461
# HELP loki_ingester_wal_replay_flushing Whether the wal replay is in a flushing phase due to backpressure
# TYPE loki_ingester_wal_replay_flushing gauge
loki_ingester_wal_replay_flushing 0
# HELP loki_internal_log_messages_total Total number of log messages created by Loki itself.
# TYPE loki_internal_log_messages_total counter
loki_internal_log_messages_total{level="debug"} 8382
loki_internal_log_messages_total{level="error"} 4
loki_internal_log_messages_total{level="info"} 121
loki_internal_log_messages_total{level="warn"} 3
# HELP loki_kv_request_duration_seconds Time spent on kv store requests.
# TYPE loki_kv_request_duration_seconds histogram
loki_kv_request_duration_seconds_bucket{kv_name="distributor-ring",operation="GET",role="primary",status_code="200",type="inmemory",le="0.005"} 1
loki_kv_request_duration_seconds_bucket{kv_name="distributor-ring",operation="GET",role="primary",status_code="200",type="inmemory",le="0.01"} 1
loki_kv_request_duration_seconds_bucket{kv_name="distributor-ring",operation="GET",role="primary",status_code="200",type="inmemory",le="0.025"} 1
loki_kv_request_duration_seconds_bucket{kv_name="distributor-ring",operation="GET",role="primary",status_code="200",type="inmemory",le="0.05"} 1
loki_kv_request_duration_seconds_bucket{kv_name="distributor-ring",operation="GET",role="primary",status_code="200",type="inmemory",le="0.1"} 1
loki_kv_request_duration_seconds_bucket{kv_name="distributor-ring",operation="GET",role="primary",status_code="200",type="inmemory",le="0.25"} 1
loki_kv_request_duration_seconds_bucket{kv_name="distributor-ring",operation="GET",role="primary",status_code="200",type="inmemory",le="0.5"} 1
loki_kv_request_duration_seconds_bucket{kv_name="distributor-ring",operation="GET",role="primary",status_code="200",type="inmemory",le="1"} 1
loki_kv_request_duration_seconds_bucket{kv_name="distributor-ring",operation="GET",role="primary",status_code="200",type="inmemory",le="2.5"} 1
loki_kv_request_duration_seconds_bucket{kv_name="distributor-ring",operation="GET",role="primary",status_code="200",type="inmemory",le="5"} 1
loki_kv_request_duration_seconds_bucket{kv_name="distributor-ring",operation="GET",role="primary",status_code="200",type="inmemory",le="10"} 1
loki_kv_request_duration_seconds_bucket{kv_name="distributor-ring",operation="GET",role="primary",status_code="200",type="inmemory",le="+Inf"} 1
loki_kv_request_duration_seconds_sum{kv_name="distributor-ring",operation="GET",role="primary",status_code="200",type="inmemory"} 8.235e-06
loki_kv_request_duration_seconds_count{kv_name="distributor-ring",operation="GET",role="primary",status_code="200",type="inmemory"} 1
loki_kv_request_duration_seconds_bucket{kv_name="ingester-lifecycler",operation="CAS",role="primary",status_code="200",type="inmemory",le="0.005"} 212
loki_kv_request_duration_seconds_bucket{kv_name="ingester-lifecycler",operation="CAS",role="primary",status_code="200",type="inmemory",le="0.01"} 212
loki_kv_request_duration_seconds_bucket{kv_name="ingester-lifecycler",operation="CAS",role="primary",status_code="200",type="inmemory",le="0.025"} 212
loki_kv_request_duration_seconds_bucket{kv_name="ingester-lifecycler",operation="CAS",role="primary",status_code="200",type="inmemory",le="0.05"} 212
loki_kv_request_duration_seconds_bucket{kv_name="ingester-lifecycler",operation="CAS",role="primary",status_code="200",type="inmemory",le="0.1"} 212
loki_kv_request_duration_seconds_bucket{kv_name="ingester-lifecycler",operation="CAS",role="primary",status_code="200",type="inmemory",le="0.25"} 212
loki_kv_request_duration_seconds_bucket{kv_name="ingester-lifecycler",operation="CAS",role="primary",status_code="200",type="inmemory",le="0.5"} 212
loki_kv_request_duration_seconds_bucket{kv_name="ingester-lifecycler",operation="CAS",role="primary",status_code="200",type="inmemory",le="1"} 212
loki_kv_request_duration_seconds_bucket{kv_name="ingester-lifecycler",operation="CAS",role="primary",status_code="200",type="inmemory",le="2.5"} 212
loki_kv_request_duration_seconds_bucket{kv_name="ingester-lifecycler",operation="CAS",role="primary",status_code="200",type="inmemory",le="5"} 212
loki_kv_request_duration_seconds_bucket{kv_name="ingester-lifecycler",operation="CAS",role="primary",status_code="200",type="inmemory",le="10"} 212
loki_kv_request_duration_seconds_bucket{kv_name="ingester-lifecycler",operation="CAS",role="primary",status_code="200",type="inmemory",le="+Inf"} 212
loki_kv_request_duration_seconds_sum{kv_name="ingester-lifecycler",operation="CAS",role="primary",status_code="200",type="inmemory"} 0.014483015999999998
loki_kv_request_duration_seconds_count{kv_name="ingester-lifecycler",operation="CAS",role="primary",status_code="200",type="inmemory"} 212
loki_kv_request_duration_seconds_bucket{kv_name="ingester-lifecycler",operation="GET",role="primary",status_code="200",type="inmemory",le="0.005"} 1
loki_kv_request_duration_seconds_bucket{kv_name="ingester-lifecycler",operation="GET",role="primary",status_code="200",type="inmemory",le="0.01"} 1
loki_kv_request_duration_seconds_bucket{kv_name="ingester-lifecycler",operation="GET",role="primary",status_code="200",type="inmemory",le="0.025"} 1
loki_kv_request_duration_seconds_bucket{kv_name="ingester-lifecycler",operation="GET",role="primary",status_code="200",type="inmemory",le="0.05"} 1
loki_kv_request_duration_seconds_bucket{kv_name="ingester-lifecycler",operation="GET",role="primary",status_code="200",type="inmemory",le="0.1"} 1
loki_kv_request_duration_seconds_bucket{kv_name="ingester-lifecycler",operation="GET",role="primary",status_code="200",type="inmemory",le="0.25"} 1
loki_kv_request_duration_seconds_bucket{kv_name="ingester-lifecycler",operation="GET",role="primary",status_code="200",type="inmemory",le="0.5"} 1
loki_kv_request_duration_seconds_bucket{kv_name="ingester-lifecycler",operation="GET",role="primary",status_code="200",type="inmemory",le="1"} 1
loki_kv_request_duration_seconds_bucket{kv_name="ingester-lifecycler",operation="GET",role="primary",status_code="200",type="inmemory",le="2.5"} 1
loki_kv_request_duration_seconds_bucket{kv_name="ingester-lifecycler",operation="GET",role="primary",status_code="200",type="inmemory",le="5"} 1
loki_kv_request_duration_seconds_bucket{kv_name="ingester-lifecycler",operation="GET",role="primary",status_code="200",type="inmemory",le="10"} 1
loki_kv_request_duration_seconds_bucket{kv_name="ingester-lifecycler",operation="GET",role="primary",status_code="200",type="inmemory",le="+Inf"} 1
loki_kv_request_duration_seconds_sum{kv_name="ingester-lifecycler",operation="GET",role="primary",status_code="200",type="inmemory"} 3.235e-05
loki_kv_request_duration_seconds_count{kv_name="ingester-lifecycler",operation="GET",role="primary",status_code="200",type="inmemory"} 1
loki_kv_request_duration_seconds_bucket{kv_name="ingester-ring",operation="GET",role="primary",status_code="200",type="inmemory",le="0.005"} 1
loki_kv_request_duration_seconds_bucket{kv_name="ingester-ring",operation="GET",role="primary",status_code="200",type="inmemory",le="0.01"} 1
loki_kv_request_duration_seconds_bucket{kv_name="ingester-ring",operation="GET",role="primary",status_code="200",type="inmemory",le="0.025"} 1
loki_kv_request_duration_seconds_bucket{kv_name="ingester-ring",operation="GET",role="primary",status_code="200",type="inmemory",le="0.05"} 1
loki_kv_request_duration_seconds_bucket{kv_name="ingester-ring",operation="GET",role="primary",status_code="200",type="inmemory",le="0.1"} 1
loki_kv_request_duration_seconds_bucket{kv_name="ingester-ring",operation="GET",role="primary",status_code="200",type="inmemory",le="0.25"} 1
loki_kv_request_duration_seconds_bucket{kv_name="ingester-ring",operation="GET",role="primary",status_code="200",type="inmemory",le="0.5"} 1
loki_kv_request_duration_seconds_bucket{kv_name="ingester-ring",operation="GET",role="primary",status_code="200",type="inmemory",le="1"} 1
loki_kv_request_duration_seconds_bucket{kv_name="ingester-ring",operation="GET",role="primary",status_code="200",type="inmemory",le="2.5"} 1
loki_kv_request_duration_seconds_bucket{kv_name="ingester-ring",operation="GET",role="primary",status_code="200",type="inmemory",le="5"} 1
loki_kv_request_duration_seconds_bucket{kv_name="ingester-ring",operation="GET",role="primary",status_code="200",type="inmemory",le="10"} 1
loki_kv_request_duration_seconds_bucket{kv_name="ingester-ring",operation="GET",role="primary",status_code="200",type="inmemory",le="+Inf"} 1
loki_kv_request_duration_seconds_sum{kv_name="ingester-ring",operation="GET",role="primary",status_code="200",type="inmemory"} 1.2274e-05
loki_kv_request_duration_seconds_count{kv_name="ingester-ring",operation="GET",role="primary",status_code="200",type="inmemory"} 1
loki_kv_request_duration_seconds_bucket{kv_name="scheduler-ring-manager",operation="CAS",role="primary",status_code="200",type="inmemory",le="0.005"} 212
loki_kv_request_duration_seconds_bucket{kv_name="scheduler-ring-manager",operation="CAS",role="primary",status_code="200",type="inmemory",le="0.01"} 212
loki_kv_request_duration_seconds_bucket{kv_name="scheduler-ring-manager",operation="CAS",role="primary",status_code="200",type="inmemory",le="0.025"} 212
loki_kv_request_duration_seconds_bucket{kv_name="scheduler-ring-manager",operation="CAS",role="primary",status_code="200",type="inmemory",le="0.05"} 212
loki_kv_request_duration_seconds_bucket{kv_name="scheduler-ring-manager",operation="CAS",role="primary",status_code="200",type="inmemory",le="0.1"} 212
loki_kv_request_duration_seconds_bucket{kv_name="scheduler-ring-manager",operation="CAS",role="primary",status_code="200",type="inmemory",le="0.25"} 212
loki_kv_request_duration_seconds_bucket{kv_name="scheduler-ring-manager",operation="CAS",role="primary",status_code="200",type="inmemory",le="0.5"} 212
loki_kv_request_duration_seconds_bucket{kv_name="scheduler-ring-manager",operation="CAS",role="primary",status_code="200",type="inmemory",le="1"} 212
loki_kv_request_duration_seconds_bucket{kv_name="scheduler-ring-manager",operation="CAS",role="primary",status_code="200",type="inmemory",le="2.5"} 212
loki_kv_request_duration_seconds_bucket{kv_name="scheduler-ring-manager",operation="CAS",role="primary",status_code="200",type="inmemory",le="5"} 212
loki_kv_request_duration_seconds_bucket{kv_name="scheduler-ring-manager",operation="CAS",role="primary",status_code="200",type="inmemory",le="10"} 212
loki_kv_request_duration_seconds_bucket{kv_name="scheduler-ring-manager",operation="CAS",role="primary",status_code="200",type="inmemory",le="+Inf"} 212
loki_kv_request_duration_seconds_sum{kv_name="scheduler-ring-manager",operation="CAS",role="primary",status_code="200",type="inmemory"} 0.017504968000000003
loki_kv_request_duration_seconds_count{kv_name="scheduler-ring-manager",operation="CAS",role="primary",status_code="200",type="inmemory"} 212
loki_kv_request_duration_seconds_bucket{kv_name="scheduler-ring-manager",operation="GET",role="primary",status_code="200",type="inmemory",le="0.005"} 1
loki_kv_request_duration_seconds_bucket{kv_name="scheduler-ring-manager",operation="GET",role="primary",status_code="200",type="inmemory",le="0.01"} 1
loki_kv_request_duration_seconds_bucket{kv_name="scheduler-ring-manager",operation="GET",role="primary",status_code="200",type="inmemory",le="0.025"} 1
loki_kv_request_duration_seconds_bucket{kv_name="scheduler-ring-manager",operation="GET",role="primary",status_code="200",type="inmemory",le="0.05"} 1
loki_kv_request_duration_seconds_bucket{kv_name="scheduler-ring-manager",operation="GET",role="primary",status_code="200",type="inmemory",le="0.1"} 1
loki_kv_request_duration_seconds_bucket{kv_name="scheduler-ring-manager",operation="GET",role="primary",status_code="200",type="inmemory",le="0.25"} 1
loki_kv_request_duration_seconds_bucket{kv_name="scheduler-ring-manager",operation="GET",role="primary",status_code="200",type="inmemory",le="0.5"} 1
loki_kv_request_duration_seconds_bucket{kv_name="scheduler-ring-manager",operation="GET",role="primary",status_code="200",type="inmemory",le="1"} 1
loki_kv_request_duration_seconds_bucket{kv_name="scheduler-ring-manager",operation="GET",role="primary",status_code="200",type="inmemory",le="2.5"} 1
loki_kv_request_duration_seconds_bucket{kv_name="scheduler-ring-manager",operation="GET",role="primary",status_code="200",type="inmemory",le="5"} 1
loki_kv_request_duration_seconds_bucket{kv_name="scheduler-ring-manager",operation="GET",role="primary",status_code="200",type="inmemory",le="10"} 1
loki_kv_request_duration_seconds_bucket{kv_name="scheduler-ring-manager",operation="GET",role="primary",status_code="200",type="inmemory",le="+Inf"} 1
loki_kv_request_duration_seconds_sum{kv_name="scheduler-ring-manager",operation="GET",role="primary",status_code="200",type="inmemory"} 5.31e-06
loki_kv_request_duration_seconds_count{kv_name="scheduler-ring-manager",operation="GET",role="primary",status_code="200",type="inmemory"} 1
# HELP loki_log_flushes Histogram of log flushes using the line-buffered logger.
# TYPE loki_log_flushes histogram
loki_log_flushes_bucket{le="1"} 1
loki_log_flushes_bucket{le="2"} 1
loki_log_flushes_bucket{le="4"} 2
loki_log_flushes_bucket{le="8"} 2
loki_log_flushes_bucket{le="16"} 2
loki_log_flushes_bucket{le="32"} 2
loki_log_flushes_bucket{le="64"} 2
loki_log_flushes_bucket{le="128"} 2
loki_log_flushes_bucket{le="256"} 2
loki_log_flushes_bucket{le="+Inf"} 2
loki_log_flushes_sum 4
loki_log_flushes_count 2
# HELP loki_log_messages_total DEPRECATED. Use internal_log_messages_total for the same functionality. Total number of log messages created by Loki itself.
# TYPE loki_log_messages_total counter
loki_log_messages_total{level="debug"} 8382
loki_log_messages_total{level="error"} 4
loki_log_messages_total{level="info"} 121
loki_log_messages_total{level="warn"} 3
# HELP loki_logql_querystats_bytes_processed_per_seconds Distribution of bytes processed per second for LogQL queries.
# TYPE loki_logql_querystats_bytes_processed_per_seconds histogram
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="200",type="limited",le="5e+07"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="200",type="limited",le="1e+08"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="200",type="limited",le="4e+08"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="200",type="limited",le="6e+08"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="200",type="limited",le="8e+08"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="200",type="limited",le="1e+09"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="200",type="limited",le="2e+09"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="200",type="limited",le="3e+09"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="200",type="limited",le="4e+09"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="200",type="limited",le="5e+09"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="200",type="limited",le="6e+09"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="200",type="limited",le="7e+09"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="200",type="limited",le="8e+09"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="200",type="limited",le="9e+09"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="200",type="limited",le="1e+10"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="200",type="limited",le="1.5e+10"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="200",type="limited",le="2e+10"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="200",type="limited",le="3e+10"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="200",type="limited",le="4e+10"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="200",type="limited",le="5e+10"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="200",type="limited",le="6e+10"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="200",type="limited",le="+Inf"} 1
loki_logql_querystats_bytes_processed_per_seconds_sum{latency_type="fast",range="range",sharded="false",status_code="200",type="limited"} 7.510119e+06
loki_logql_querystats_bytes_processed_per_seconds_count{latency_type="fast",range="range",sharded="false",status_code="200",type="limited"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="499",type="limited",le="5e+07"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="499",type="limited",le="1e+08"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="499",type="limited",le="4e+08"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="499",type="limited",le="6e+08"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="499",type="limited",le="8e+08"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="499",type="limited",le="1e+09"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="499",type="limited",le="2e+09"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="499",type="limited",le="3e+09"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="499",type="limited",le="4e+09"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="499",type="limited",le="5e+09"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="499",type="limited",le="6e+09"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="499",type="limited",le="7e+09"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="499",type="limited",le="8e+09"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="499",type="limited",le="9e+09"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="499",type="limited",le="1e+10"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="499",type="limited",le="1.5e+10"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="499",type="limited",le="2e+10"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="499",type="limited",le="3e+10"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="499",type="limited",le="4e+10"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="499",type="limited",le="5e+10"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="499",type="limited",le="6e+10"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="499",type="limited",le="+Inf"} 1
loki_logql_querystats_bytes_processed_per_seconds_sum{latency_type="fast",range="range",sharded="false",status_code="499",type="limited"} 1.0049968e+07
loki_logql_querystats_bytes_processed_per_seconds_count{latency_type="fast",range="range",sharded="false",status_code="499",type="limited"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="500",type="limited",le="5e+07"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="500",type="limited",le="1e+08"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="500",type="limited",le="4e+08"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="500",type="limited",le="6e+08"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="500",type="limited",le="8e+08"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="500",type="limited",le="1e+09"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="500",type="limited",le="2e+09"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="500",type="limited",le="3e+09"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="500",type="limited",le="4e+09"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="500",type="limited",le="5e+09"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="500",type="limited",le="6e+09"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="500",type="limited",le="7e+09"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="500",type="limited",le="8e+09"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="500",type="limited",le="9e+09"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="500",type="limited",le="1e+10"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="500",type="limited",le="1.5e+10"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="500",type="limited",le="2e+10"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="500",type="limited",le="3e+10"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="500",type="limited",le="4e+10"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="500",type="limited",le="5e+10"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="500",type="limited",le="6e+10"} 1
loki_logql_querystats_bytes_processed_per_seconds_bucket{latency_type="fast",range="range",sharded="false",status_code="500",type="limited",le="+Inf"} 1
loki_logql_querystats_bytes_processed_per_seconds_sum{latency_type="fast",range="range",sharded="false",status_code="500",type="limited"} 1.7200005e+07
loki_logql_querystats_bytes_processed_per_seconds_count{latency_type="fast",range="range",sharded="false",status_code="500",type="limited"} 1
# HELP loki_logql_querystats_chunk_download_latency_seconds Distribution of chunk downloads latency for LogQL queries.
# TYPE loki_logql_querystats_chunk_download_latency_seconds histogram
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="200",type="limited",le="0.25"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="200",type="limited",le="0.5"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="200",type="limited",le="1"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="200",type="limited",le="2"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="200",type="limited",le="4"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="200",type="limited",le="8"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="200",type="limited",le="16"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="200",type="limited",le="32"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="200",type="limited",le="64"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="200",type="limited",le="128"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="200",type="limited",le="+Inf"} 1
loki_logql_querystats_chunk_download_latency_seconds_sum{range="range",status_code="200",type="limited"} 0.000210739
loki_logql_querystats_chunk_download_latency_seconds_count{range="range",status_code="200",type="limited"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="499",type="limited",le="0.25"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="499",type="limited",le="0.5"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="499",type="limited",le="1"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="499",type="limited",le="2"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="499",type="limited",le="4"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="499",type="limited",le="8"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="499",type="limited",le="16"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="499",type="limited",le="32"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="499",type="limited",le="64"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="499",type="limited",le="128"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="499",type="limited",le="+Inf"} 1
loki_logql_querystats_chunk_download_latency_seconds_sum{range="range",status_code="499",type="limited"} 0.000350235
loki_logql_querystats_chunk_download_latency_seconds_count{range="range",status_code="499",type="limited"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="500",type="limited",le="0.25"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="500",type="limited",le="0.5"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="500",type="limited",le="1"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="500",type="limited",le="2"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="500",type="limited",le="4"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="500",type="limited",le="8"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="500",type="limited",le="16"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="500",type="limited",le="32"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="500",type="limited",le="64"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="500",type="limited",le="128"} 1
loki_logql_querystats_chunk_download_latency_seconds_bucket{range="range",status_code="500",type="limited",le="+Inf"} 1
loki_logql_querystats_chunk_download_latency_seconds_sum{range="range",status_code="500",type="limited"} 0.000210739
loki_logql_querystats_chunk_download_latency_seconds_count{range="range",status_code="500",type="limited"} 1
# HELP loki_logql_querystats_downloaded_chunk_total Total count of chunks downloaded found while executing LogQL queries.
# TYPE loki_logql_querystats_downloaded_chunk_total counter
loki_logql_querystats_downloaded_chunk_total{range="range",status_code="200",type="limited"} 5
loki_logql_querystats_downloaded_chunk_total{range="range",status_code="499",type="limited"} 50
loki_logql_querystats_downloaded_chunk_total{range="range",status_code="500",type="limited"} 5
# HELP loki_logql_querystats_duplicates_total Total count of duplicates found while executing LogQL queries.
# TYPE loki_logql_querystats_duplicates_total counter
loki_logql_querystats_duplicates_total 0
# HELP loki_logql_querystats_ingester_sent_lines_total Total count of lines sent from ingesters while executing LogQL queries.
# TYPE loki_logql_querystats_ingester_sent_lines_total counter
loki_logql_querystats_ingester_sent_lines_total 30
# HELP loki_logql_querystats_latency_seconds Distribution of latency for LogQL queries.
# TYPE loki_logql_querystats_latency_seconds histogram
loki_logql_querystats_latency_seconds_bucket{range="",status_code="200",type="labels",le="0.25"} 4
loki_logql_querystats_latency_seconds_bucket{range="",status_code="200",type="labels",le="0.5"} 4
loki_logql_querystats_latency_seconds_bucket{range="",status_code="200",type="labels",le="1"} 4
loki_logql_querystats_latency_seconds_bucket{range="",status_code="200",type="labels",le="2"} 4
loki_logql_querystats_latency_seconds_bucket{range="",status_code="200",type="labels",le="4"} 4
loki_logql_querystats_latency_seconds_bucket{range="",status_code="200",type="labels",le="8"} 4
loki_logql_querystats_latency_seconds_bucket{range="",status_code="200",type="labels",le="16"} 4
loki_logql_querystats_latency_seconds_bucket{range="",status_code="200",type="labels",le="32"} 4
loki_logql_querystats_latency_seconds_bucket{range="",status_code="200",type="labels",le="64"} 4
loki_logql_querystats_latency_seconds_bucket{range="",status_code="200",type="labels",le="128"} 4
loki_logql_querystats_latency_seconds_bucket{range="",status_code="200",type="labels",le="+Inf"} 4
loki_logql_querystats_latency_seconds_sum{range="",status_code="200",type="labels"} 0.004842946
loki_logql_querystats_latency_seconds_count{range="",status_code="200",type="labels"} 4
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="200",type="limited",le="0.25"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="200",type="limited",le="0.5"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="200",type="limited",le="1"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="200",type="limited",le="2"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="200",type="limited",le="4"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="200",type="limited",le="8"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="200",type="limited",le="16"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="200",type="limited",le="32"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="200",type="limited",le="64"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="200",type="limited",le="128"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="200",type="limited",le="+Inf"} 1
loki_logql_querystats_latency_seconds_sum{range="range",status_code="200",type="limited"} 0.003337497
loki_logql_querystats_latency_seconds_count{range="range",status_code="200",type="limited"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="499",type="limited",le="0.25"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="499",type="limited",le="0.5"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="499",type="limited",le="1"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="499",type="limited",le="2"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="499",type="limited",le="4"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="499",type="limited",le="8"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="499",type="limited",le="16"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="499",type="limited",le="32"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="499",type="limited",le="64"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="499",type="limited",le="128"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="499",type="limited",le="+Inf"} 1
loki_logql_querystats_latency_seconds_sum{range="range",status_code="499",type="limited"} 0.001828563
loki_logql_querystats_latency_seconds_count{range="range",status_code="499",type="limited"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="500",type="limited",le="0.25"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="500",type="limited",le="0.5"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="500",type="limited",le="1"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="500",type="limited",le="2"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="500",type="limited",le="4"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="500",type="limited",le="8"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="500",type="limited",le="16"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="500",type="limited",le="32"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="500",type="limited",le="64"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="500",type="limited",le="128"} 1
loki_logql_querystats_latency_seconds_bucket{range="range",status_code="500",type="limited",le="+Inf"} 1
loki_logql_querystats_latency_seconds_sum{range="range",status_code="500",type="limited"} 0.001457267
loki_logql_querystats_latency_seconds_count{range="range",status_code="500",type="limited"} 1
# HELP loki_member_consul_heartbeats_total The total number of heartbeats sent to consul.
# TYPE loki_member_consul_heartbeats_total counter
loki_member_consul_heartbeats_total{name="ingester"} 210
# HELP loki_panic_total The total number of panic triggered
# TYPE loki_panic_total counter
loki_panic_total 0
# HELP loki_querier_index_cache_corruptions_total The number of cache corruptions for the index cache.
# TYPE loki_querier_index_cache_corruptions_total counter
loki_querier_index_cache_corruptions_total 0
# HELP loki_querier_index_cache_encode_errors_total The number of errors for the index cache while encoding the body.
# TYPE loki_querier_index_cache_encode_errors_total counter
loki_querier_index_cache_encode_errors_total 0
# HELP loki_querier_index_cache_gets_total The number of gets for the index cache.
# TYPE loki_querier_index_cache_gets_total counter
loki_querier_index_cache_gets_total 214
# HELP loki_querier_index_cache_hits_total The number of cache hits for the index cache.
# TYPE loki_querier_index_cache_hits_total counter
loki_querier_index_cache_hits_total 0
# HELP loki_querier_index_cache_puts_total The number of puts for the index cache.
# TYPE loki_querier_index_cache_puts_total counter
loki_querier_index_cache_puts_total 214
# HELP loki_querier_query_frontend_clients The current number of clients connected to query-frontend.
# TYPE loki_querier_query_frontend_clients gauge
loki_querier_query_frontend_clients 1
# HELP loki_querier_query_frontend_request_duration_seconds Time spend doing requests to frontend.
# TYPE loki_querier_query_frontend_request_duration_seconds histogram
loki_querier_query_frontend_request_duration_seconds_bucket{operation="/frontendv2pb.FrontendForQuerier/QueryResult",status_code="2xx",le="0.001"} 3
loki_querier_query_frontend_request_duration_seconds_bucket{operation="/frontendv2pb.FrontendForQuerier/QueryResult",status_code="2xx",le="0.004"} 3
loki_querier_query_frontend_request_duration_seconds_bucket{operation="/frontendv2pb.FrontendForQuerier/QueryResult",status_code="2xx",le="0.016"} 3
loki_querier_query_frontend_request_duration_seconds_bucket{operation="/frontendv2pb.FrontendForQuerier/QueryResult",status_code="2xx",le="0.064"} 3
loki_querier_query_frontend_request_duration_seconds_bucket{operation="/frontendv2pb.FrontendForQuerier/QueryResult",status_code="2xx",le="0.256"} 3
loki_querier_query_frontend_request_duration_seconds_bucket{operation="/frontendv2pb.FrontendForQuerier/QueryResult",status_code="2xx",le="1.024"} 3
loki_querier_query_frontend_request_duration_seconds_bucket{operation="/frontendv2pb.FrontendForQuerier/QueryResult",status_code="2xx",le="+Inf"} 3
loki_querier_query_frontend_request_duration_seconds_sum{operation="/frontendv2pb.FrontendForQuerier/QueryResult",status_code="2xx"} 0.0010109790000000002
loki_querier_query_frontend_request_duration_seconds_count{operation="/frontendv2pb.FrontendForQuerier/QueryResult",status_code="2xx"} 3
loki_querier_query_frontend_request_duration_seconds_bucket{operation="/grpc.health.v1.Health/Check",status_code="2xx",le="0.001"} 13
loki_querier_query_frontend_request_duration_seconds_bucket{operation="/grpc.health.v1.Health/Check",status_code="2xx",le="0.004"} 13
loki_querier_query_frontend_request_duration_seconds_bucket{operation="/grpc.health.v1.Health/Check",status_code="2xx",le="0.016"} 13
loki_querier_query_frontend_request_duration_seconds_bucket{operation="/grpc.health.v1.Health/Check",status_code="2xx",le="0.064"} 13
loki_querier_query_frontend_request_duration_seconds_bucket{operation="/grpc.health.v1.Health/Check",status_code="2xx",le="0.256"} 13
loki_querier_query_frontend_request_duration_seconds_bucket{operation="/grpc.health.v1.Health/Check",status_code="2xx",le="1.024"} 13
loki_querier_query_frontend_request_duration_seconds_bucket{operation="/grpc.health.v1.Health/Check",status_code="2xx",le="+Inf"} 13
loki_querier_query_frontend_request_duration_seconds_sum{operation="/grpc.health.v1.Health/Check",status_code="2xx"} 0.005929015
loki_querier_query_frontend_request_duration_seconds_count{operation="/grpc.health.v1.Health/Check",status_code="2xx"} 13
# HELP loki_querier_tail_active Number of active tailers
# TYPE loki_querier_tail_active gauge
loki_querier_tail_active 0
# HELP loki_querier_tail_active_streams Number of active streams being tailed
# TYPE loki_querier_tail_active_streams gauge
loki_querier_tail_active_streams 0
# HELP loki_querier_tail_bytes_total total bytes tailed
# TYPE loki_querier_tail_bytes_total counter
loki_querier_tail_bytes_total 0
# HELP loki_querier_worker_concurrency Number of concurrent querier workers
# TYPE loki_querier_worker_concurrency gauge
loki_querier_worker_concurrency 4
# HELP loki_querier_worker_inflight_queries Number of queries being processed by the querier workers
# TYPE loki_querier_worker_inflight_queries gauge
loki_querier_worker_inflight_queries 0
# HELP loki_query_frontend_connected_schedulers Number of schedulers this frontend is connected to.
# TYPE loki_query_frontend_connected_schedulers gauge
loki_query_frontend_connected_schedulers 1
# HELP loki_query_frontend_log_result_cache_hit_total
# TYPE loki_query_frontend_log_result_cache_hit_total counter
loki_query_frontend_log_result_cache_hit_total 0
# HELP loki_query_frontend_log_result_cache_miss_total
# TYPE loki_query_frontend_log_result_cache_miss_total counter
loki_query_frontend_log_result_cache_miss_total 0
# HELP loki_query_frontend_partitions Number of time-based partitions (sub-requests) per request
# TYPE loki_query_frontend_partitions histogram
loki_query_frontend_partitions_bucket{le="1"} 2
loki_query_frontend_partitions_bucket{le="4"} 3
loki_query_frontend_partitions_bucket{le="16"} 3
loki_query_frontend_partitions_bucket{le="64"} 3
loki_query_frontend_partitions_bucket{le="256"} 3
loki_query_frontend_partitions_bucket{le="+Inf"} 3
loki_query_frontend_partitions_sum 4
loki_query_frontend_partitions_count 3
# HELP loki_query_frontend_queries_in_progress Number of queries in progress handled by this frontend.
# TYPE loki_query_frontend_queries_in_progress gauge
loki_query_frontend_queries_in_progress 0
# HELP loki_query_frontend_query_filters Number of filters per query.
# TYPE loki_query_frontend_query_filters histogram
loki_query_frontend_query_filters_bucket{le="1"} 0
loki_query_frontend_query_filters_bucket{le="2"} 0
loki_query_frontend_query_filters_bucket{le="4"} 0
loki_query_frontend_query_filters_bucket{le="8"} 0
loki_query_frontend_query_filters_bucket{le="16"} 0
loki_query_frontend_query_filters_bucket{le="32"} 0
loki_query_frontend_query_filters_bucket{le="64"} 0
loki_query_frontend_query_filters_bucket{le="128"} 0
loki_query_frontend_query_filters_bucket{le="256"} 0
loki_query_frontend_query_filters_bucket{le="+Inf"} 0
loki_query_frontend_query_filters_sum 0
loki_query_frontend_query_filters_count 0
# HELP loki_query_frontend_retries Number of times a request is retried.
# TYPE loki_query_frontend_retries histogram
loki_query_frontend_retries_bucket{le="0"} 2
loki_query_frontend_retries_bucket{le="1"} 2
loki_query_frontend_retries_bucket{le="2"} 2
loki_query_frontend_retries_bucket{le="3"} 2
loki_query_frontend_retries_bucket{le="4"} 2
loki_query_frontend_retries_bucket{le="5"} 2
loki_query_frontend_retries_bucket{le="+Inf"} 2
loki_query_frontend_retries_sum 0
loki_query_frontend_retries_count 2
# HELP loki_query_frontend_shard_factor Number of downstream queries per request
# TYPE loki_query_frontend_shard_factor histogram
loki_query_frontend_shard_factor_bucket{mapper="range",le="1"} 0
loki_query_frontend_shard_factor_bucket{mapper="range",le="4"} 0
loki_query_frontend_shard_factor_bucket{mapper="range",le="16"} 0
loki_query_frontend_shard_factor_bucket{mapper="range",le="64"} 0
loki_query_frontend_shard_factor_bucket{mapper="range",le="256"} 0
loki_query_frontend_shard_factor_bucket{mapper="range",le="1024"} 0
loki_query_frontend_shard_factor_bucket{mapper="range",le="4096"} 0
loki_query_frontend_shard_factor_bucket{mapper="range",le="16384"} 0
loki_query_frontend_shard_factor_bucket{mapper="range",le="+Inf"} 0
loki_query_frontend_shard_factor_sum{mapper="range"} 0
loki_query_frontend_shard_factor_count{mapper="range"} 0
loki_query_frontend_shard_factor_bucket{mapper="shard",le="1"} 0
loki_query_frontend_shard_factor_bucket{mapper="shard",le="4"} 0
loki_query_frontend_shard_factor_bucket{mapper="shard",le="16"} 0
loki_query_frontend_shard_factor_bucket{mapper="shard",le="64"} 0
loki_query_frontend_shard_factor_bucket{mapper="shard",le="256"} 0
loki_query_frontend_shard_factor_bucket{mapper="shard",le="1024"} 0
loki_query_frontend_shard_factor_bucket{mapper="shard",le="4096"} 0
loki_query_frontend_shard_factor_bucket{mapper="shard",le="16384"} 0
loki_query_frontend_shard_factor_bucket{mapper="shard",le="+Inf"} 0
loki_query_frontend_shard_factor_sum{mapper="shard"} 0
loki_query_frontend_shard_factor_count{mapper="shard"} 0
# HELP loki_query_scheduler_connected_frontend_clients Number of query-frontend worker clients currently connected to the query-scheduler.
# TYPE loki_query_scheduler_connected_frontend_clients gauge
loki_query_scheduler_connected_frontend_clients 5
# HELP loki_query_scheduler_connected_querier_clients Number of querier worker clients currently connected to the query-scheduler.
# TYPE loki_query_scheduler_connected_querier_clients gauge
loki_query_scheduler_connected_querier_clients 4
# HELP loki_query_scheduler_enqueue_count Total number of enqueued (sub-)queries.
# TYPE loki_query_scheduler_enqueue_count counter
loki_query_scheduler_enqueue_count{level="0",user="fake"} 4
# HELP loki_query_scheduler_inflight_requests Number of inflight requests (either queued or processing) sampled at a regular interval. Quantile buckets keep track of inflight requests over the last 60s.
# TYPE loki_query_scheduler_inflight_requests summary
loki_query_scheduler_inflight_requests{quantile="0.5"} 0
loki_query_scheduler_inflight_requests{quantile="0.75"} 0
loki_query_scheduler_inflight_requests{quantile="0.8"} 0
loki_query_scheduler_inflight_requests{quantile="0.9"} 0
loki_query_scheduler_inflight_requests{quantile="0.95"} 0
loki_query_scheduler_inflight_requests{quantile="0.99"} 0
loki_query_scheduler_inflight_requests_sum 0
loki_query_scheduler_inflight_requests_count 4204
# HELP loki_query_scheduler_queue_duration_seconds Time spend by requests in queue before getting picked up by a querier.
# TYPE loki_query_scheduler_queue_duration_seconds histogram
loki_query_scheduler_queue_duration_seconds_bucket{le="0.005"} 4
loki_query_scheduler_queue_duration_seconds_bucket{le="0.01"} 4
loki_query_scheduler_queue_duration_seconds_bucket{le="0.025"} 4
loki_query_scheduler_queue_duration_seconds_bucket{le="0.05"} 4
loki_query_scheduler_queue_duration_seconds_bucket{le="0.1"} 4
loki_query_scheduler_queue_duration_seconds_bucket{le="0.25"} 4
loki_query_scheduler_queue_duration_seconds_bucket{le="0.5"} 4
loki_query_scheduler_queue_duration_seconds_bucket{le="1"} 4
loki_query_scheduler_queue_duration_seconds_bucket{le="2.5"} 4
loki_query_scheduler_queue_duration_seconds_bucket{le="5"} 4
loki_query_scheduler_queue_duration_seconds_bucket{le="10"} 4
loki_query_scheduler_queue_duration_seconds_bucket{le="+Inf"} 4
loki_query_scheduler_queue_duration_seconds_sum 0.0008147370000000001
loki_query_scheduler_queue_duration_seconds_count 4
# HELP loki_query_scheduler_queue_length Number of queries in the queue.
# TYPE loki_query_scheduler_queue_length gauge
loki_query_scheduler_queue_length{user="fake"} 0
# HELP loki_query_scheduler_running Value will be 1 if the scheduler is in the ReplicationSet and actively receiving/processing requests
# TYPE loki_query_scheduler_running gauge
loki_query_scheduler_running 1
# HELP loki_rate_store_expired_streams_total The number of streams that have been expired by the ratestore
# TYPE loki_rate_store_expired_streams_total counter
loki_rate_store_expired_streams_total 48
# HELP loki_rate_store_max_stream_rate_bytes The maximum stream rate for any stream reported by ingesters during a sync operation. Sharded Streams are combined.
# TYPE loki_rate_store_max_stream_rate_bytes gauge
loki_rate_store_max_stream_rate_bytes 0
# HELP loki_rate_store_max_stream_shards The number of shards for a single stream reported by ingesters during a sync operation.
# TYPE loki_rate_store_max_stream_shards gauge
loki_rate_store_max_stream_shards 1
# HELP loki_rate_store_max_unique_stream_rate_bytes The maximum stream rate for any stream reported by ingesters during a sync operation. Sharded Streams are considered separate.
# TYPE loki_rate_store_max_unique_stream_rate_bytes gauge
loki_rate_store_max_unique_stream_rate_bytes 0
# HELP loki_rate_store_refresh_duration_seconds Time spent refreshing the rate store
# TYPE loki_rate_store_refresh_duration_seconds histogram
loki_rate_store_refresh_duration_seconds_bucket{operation="GetAllStreamRates",status_code="200",le="0.005"} 929
loki_rate_store_refresh_duration_seconds_bucket{operation="GetAllStreamRates",status_code="200",le="0.01"} 929
loki_rate_store_refresh_duration_seconds_bucket{operation="GetAllStreamRates",status_code="200",le="0.025"} 929
loki_rate_store_refresh_duration_seconds_bucket{operation="GetAllStreamRates",status_code="200",le="0.05"} 929
loki_rate_store_refresh_duration_seconds_bucket{operation="GetAllStreamRates",status_code="200",le="0.1"} 929
loki_rate_store_refresh_duration_seconds_bucket{operation="GetAllStreamRates",status_code="200",le="0.25"} 929
loki_rate_store_refresh_duration_seconds_bucket{operation="GetAllStreamRates",status_code="200",le="0.5"} 929
loki_rate_store_refresh_duration_seconds_bucket{operation="GetAllStreamRates",status_code="200",le="1"} 929
loki_rate_store_refresh_duration_seconds_bucket{operation="GetAllStreamRates",status_code="200",le="2.5"} 929
loki_rate_store_refresh_duration_seconds_bucket{operation="GetAllStreamRates",status_code="200",le="5"} 929
loki_rate_store_refresh_duration_seconds_bucket{operation="GetAllStreamRates",status_code="200",le="10"} 929
loki_rate_store_refresh_duration_seconds_bucket{operation="GetAllStreamRates",status_code="200",le="+Inf"} 929
loki_rate_store_refresh_duration_seconds_sum{operation="GetAllStreamRates",status_code="200"} 0.675698362999998
loki_rate_store_refresh_duration_seconds_count{operation="GetAllStreamRates",status_code="200"} 929
# HELP loki_rate_store_refresh_failures_total The total number of failed attempts to refresh the distributor's view of stream rates
# TYPE loki_rate_store_refresh_failures_total counter
loki_rate_store_refresh_failures_total{source="ring"} 1
# HELP loki_rate_store_stream_rate_bytes The distribution of stream rates for any stream reported by ingesters during a sync operation. Sharded Streams are combined.
# TYPE loki_rate_store_stream_rate_bytes histogram
loki_rate_store_stream_rate_bytes_bucket{le="20000"} 28940
loki_rate_store_stream_rate_bytes_bucket{le="40000"} 28949
loki_rate_store_stream_rate_bytes_bucket{le="80000"} 28957
loki_rate_store_stream_rate_bytes_bucket{le="160000"} 28963
loki_rate_store_stream_rate_bytes_bucket{le="320000"} 28965
loki_rate_store_stream_rate_bytes_bucket{le="640000"} 28965
loki_rate_store_stream_rate_bytes_bucket{le="1.28e+06"} 28965
loki_rate_store_stream_rate_bytes_bucket{le="2.56e+06"} 28965
loki_rate_store_stream_rate_bytes_bucket{le="5.12e+06"} 28965
loki_rate_store_stream_rate_bytes_bucket{le="1.024e+07"} 28965
loki_rate_store_stream_rate_bytes_bucket{le="2.048e+07"} 28965
loki_rate_store_stream_rate_bytes_bucket{le="4.096e+07"} 28965
loki_rate_store_stream_rate_bytes_bucket{le="8.192e+07"} 28965
loki_rate_store_stream_rate_bytes_bucket{le="1.6384e+08"} 28965
loki_rate_store_stream_rate_bytes_bucket{le="+Inf"} 28965
loki_rate_store_stream_rate_bytes_sum 2.238202e+06
loki_rate_store_stream_rate_bytes_count 28965
# HELP loki_rate_store_stream_shards The distribution of number of shards for a single stream reported by ingesters during a sync operation.
# TYPE loki_rate_store_stream_shards histogram
loki_rate_store_stream_shards_bucket{le="0"} 0
loki_rate_store_stream_shards_bucket{le="1"} 28965
loki_rate_store_stream_shards_bucket{le="2"} 28965
loki_rate_store_stream_shards_bucket{le="4"} 28965
loki_rate_store_stream_shards_bucket{le="8"} 28965
loki_rate_store_stream_shards_bucket{le="16"} 28965
loki_rate_store_stream_shards_bucket{le="32"} 28965
loki_rate_store_stream_shards_bucket{le="64"} 28965
loki_rate_store_stream_shards_bucket{le="128"} 28965
loki_rate_store_stream_shards_bucket{le="+Inf"} 28965
loki_rate_store_stream_shards_sum 28965
loki_rate_store_stream_shards_count 28965
# HELP loki_rate_store_streams The number of unique streams reported by all ingesters. Sharded streams are combined
# TYPE loki_rate_store_streams gauge
loki_rate_store_streams 4
# HELP loki_request_duration_seconds Time (in seconds) spent serving HTTP requests.
# TYPE loki_request_duration_seconds histogram
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_label_name_values",status_code="200",ws="false",le="0.005"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_label_name_values",status_code="200",ws="false",le="0.01"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_label_name_values",status_code="200",ws="false",le="0.025"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_label_name_values",status_code="200",ws="false",le="0.05"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_label_name_values",status_code="200",ws="false",le="0.1"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_label_name_values",status_code="200",ws="false",le="0.25"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_label_name_values",status_code="200",ws="false",le="0.5"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_label_name_values",status_code="200",ws="false",le="1"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_label_name_values",status_code="200",ws="false",le="2.5"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_label_name_values",status_code="200",ws="false",le="5"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_label_name_values",status_code="200",ws="false",le="10"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_label_name_values",status_code="200",ws="false",le="25"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_label_name_values",status_code="200",ws="false",le="50"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_label_name_values",status_code="200",ws="false",le="100"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_label_name_values",status_code="200",ws="false",le="+Inf"} 1
loki_request_duration_seconds_sum{method="GET",route="loki_api_v1_label_name_values",status_code="200",ws="false"} 0.002142188
loki_request_duration_seconds_count{method="GET",route="loki_api_v1_label_name_values",status_code="200",ws="false"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_label_values",status_code="200",ws="false",le="0.005"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_label_values",status_code="200",ws="false",le="0.01"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_label_values",status_code="200",ws="false",le="0.025"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_label_values",status_code="200",ws="false",le="0.05"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_label_values",status_code="200",ws="false",le="0.1"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_label_values",status_code="200",ws="false",le="0.25"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_label_values",status_code="200",ws="false",le="0.5"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_label_values",status_code="200",ws="false",le="1"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_label_values",status_code="200",ws="false",le="2.5"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_label_values",status_code="200",ws="false",le="5"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_label_values",status_code="200",ws="false",le="10"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_label_values",status_code="200",ws="false",le="25"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_label_values",status_code="200",ws="false",le="50"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_label_values",status_code="200",ws="false",le="100"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_label_values",status_code="200",ws="false",le="+Inf"} 1
loki_request_duration_seconds_sum{method="GET",route="loki_api_v1_label_values",status_code="200",ws="false"} 0.00086406
loki_request_duration_seconds_count{method="GET",route="loki_api_v1_label_values",status_code="200",ws="false"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_labels",status_code="200",ws="false",le="0.005"} 2
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_labels",status_code="200",ws="false",le="0.01"} 2
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_labels",status_code="200",ws="false",le="0.025"} 2
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_labels",status_code="200",ws="false",le="0.05"} 2
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_labels",status_code="200",ws="false",le="0.1"} 2
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_labels",status_code="200",ws="false",le="0.25"} 2
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_labels",status_code="200",ws="false",le="0.5"} 2
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_labels",status_code="200",ws="false",le="1"} 2
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_labels",status_code="200",ws="false",le="2.5"} 2
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_labels",status_code="200",ws="false",le="5"} 2
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_labels",status_code="200",ws="false",le="10"} 2
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_labels",status_code="200",ws="false",le="25"} 2
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_labels",status_code="200",ws="false",le="50"} 2
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_labels",status_code="200",ws="false",le="100"} 2
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_labels",status_code="200",ws="false",le="+Inf"} 2
loki_request_duration_seconds_sum{method="GET",route="loki_api_v1_labels",status_code="200",ws="false"} 0.002164671
loki_request_duration_seconds_count{method="GET",route="loki_api_v1_labels",status_code="200",ws="false"} 2
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_query_range",status_code="200",ws="false",le="0.005"} 2
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_query_range",status_code="200",ws="false",le="0.01"} 2
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_query_range",status_code="200",ws="false",le="0.025"} 2
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_query_range",status_code="200",ws="false",le="0.05"} 2
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_query_range",status_code="200",ws="false",le="0.1"} 2
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_query_range",status_code="200",ws="false",le="0.25"} 2
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_query_range",status_code="200",ws="false",le="0.5"} 2
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_query_range",status_code="200",ws="false",le="1"} 2
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_query_range",status_code="200",ws="false",le="2.5"} 2
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_query_range",status_code="200",ws="false",le="5"} 2
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_query_range",status_code="200",ws="false",le="10"} 2
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_query_range",status_code="200",ws="false",le="25"} 2
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_query_range",status_code="200",ws="false",le="50"} 2
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_query_range",status_code="200",ws="false",le="100"} 2
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_query_range",status_code="200",ws="false",le="+Inf"} 2
loki_request_duration_seconds_sum{method="GET",route="loki_api_v1_query_range",status_code="200",ws="false"} 0.005214651
loki_request_duration_seconds_count{method="GET",route="loki_api_v1_query_range",status_code="200",ws="false"} 2
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_query_range",status_code="500",ws="false",le="0.005"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_query_range",status_code="500",ws="false",le="0.01"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_query_range",status_code="500",ws="false",le="0.025"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_query_range",status_code="500",ws="false",le="0.05"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_query_range",status_code="500",ws="false",le="0.1"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_query_range",status_code="500",ws="false",le="0.25"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_query_range",status_code="500",ws="false",le="0.5"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_query_range",status_code="500",ws="false",le="1"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_query_range",status_code="500",ws="false",le="2.5"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_query_range",status_code="500",ws="false",le="5"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_query_range",status_code="500",ws="false",le="10"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_query_range",status_code="500",ws="false",le="25"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_query_range",status_code="500",ws="false",le="50"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_query_range",status_code="500",ws="false",le="100"} 1
loki_request_duration_seconds_bucket{method="GET",route="loki_api_v1_query_range",status_code="500",ws="false",le="+Inf"} 1
loki_request_duration_seconds_sum{method="GET",route="loki_api_v1_query_range",status_code="500",ws="false"} 0.002823982
loki_request_duration_seconds_count{method="GET",route="loki_api_v1_query_range",status_code="500",ws="false"} 1
loki_request_duration_seconds_bucket{method="GET",route="metrics",status_code="200",ws="false",le="0.005"} 68
loki_request_duration_seconds_bucket{method="GET",route="metrics",status_code="200",ws="false",le="0.01"} 69
loki_request_duration_seconds_bucket{method="GET",route="metrics",status_code="200",ws="false",le="0.025"} 69
loki_request_duration_seconds_bucket{method="GET",route="metrics",status_code="200",ws="false",le="0.05"} 69
loki_request_duration_seconds_bucket{method="GET",route="metrics",status_code="200",ws="false",le="0.1"} 69
loki_request_duration_seconds_bucket{method="GET",route="metrics",status_code="200",ws="false",le="0.25"} 69
loki_request_duration_seconds_bucket{method="GET",route="metrics",status_code="200",ws="false",le="0.5"} 69
loki_request_duration_seconds_bucket{method="GET",route="metrics",status_code="200",ws="false",le="1"} 69
loki_request_duration_seconds_bucket{method="GET",route="metrics",status_code="200",ws="false",le="2.5"} 69
loki_request_duration_seconds_bucket{method="GET",route="metrics",status_code="200",ws="false",le="5"} 69
loki_request_duration_seconds_bucket{method="GET",route="metrics",status_code="200",ws="false",le="10"} 69
loki_request_duration_seconds_bucket{method="GET",route="metrics",status_code="200",ws="false",le="25"} 69
loki_request_duration_seconds_bucket{method="GET",route="metrics",status_code="200",ws="false",le="50"} 69
loki_request_duration_seconds_bucket{method="GET",route="metrics",status_code="200",ws="false",le="100"} 69
loki_request_duration_seconds_bucket{method="GET",route="metrics",status_code="200",ws="false",le="+Inf"} 69
loki_request_duration_seconds_sum{method="GET",route="metrics",status_code="200",ws="false"} 0.21750384300000003
loki_request_duration_seconds_count{method="GET",route="metrics",status_code="200",ws="false"} 69
loki_request_duration_seconds_bucket{method="GET",route="ready",status_code="503",ws="false",le="0.005"} 1
loki_request_duration_seconds_bucket{method="GET",route="ready",status_code="503",ws="false",le="0.01"} 1
loki_request_duration_seconds_bucket{method="GET",route="ready",status_code="503",ws="false",le="0.025"} 1
loki_request_duration_seconds_bucket{method="GET",route="ready",status_code="503",ws="false",le="0.05"} 1
loki_request_duration_seconds_bucket{method="GET",route="ready",status_code="503",ws="false",le="0.1"} 1
loki_request_duration_seconds_bucket{method="GET",route="ready",status_code="503",ws="false",le="0.25"} 1
loki_request_duration_seconds_bucket{method="GET",route="ready",status_code="503",ws="false",le="0.5"} 1
loki_request_duration_seconds_bucket{method="GET",route="ready",status_code="503",ws="false",le="1"} 1
loki_request_duration_seconds_bucket{method="GET",route="ready",status_code="503",ws="false",le="2.5"} 1
loki_request_duration_seconds_bucket{method="GET",route="ready",status_code="503",ws="false",le="5"} 1
loki_request_duration_seconds_bucket{method="GET",route="ready",status_code="503",ws="false",le="10"} 1
loki_request_duration_seconds_bucket{method="GET",route="ready",status_code="503",ws="false",le="25"} 1
loki_request_duration_seconds_bucket{method="GET",route="ready",status_code="503",ws="false",le="50"} 1
loki_request_duration_seconds_bucket{method="GET",route="ready",status_code="503",ws="false",le="100"} 1
loki_request_duration_seconds_bucket{method="GET",route="ready",status_code="503",ws="false",le="+Inf"} 1
loki_request_duration_seconds_sum{method="GET",route="ready",status_code="503",ws="false"} 5.4784e-05
loki_request_duration_seconds_count{method="GET",route="ready",status_code="503",ws="false"} 1
loki_request_duration_seconds_bucket{method="POST",route="loki_api_v1_push",status_code="204",ws="false",le="0.005"} 52
loki_request_duration_seconds_bucket{method="POST",route="loki_api_v1_push",status_code="204",ws="false",le="0.01"} 52
loki_request_duration_seconds_bucket{method="POST",route="loki_api_v1_push",status_code="204",ws="false",le="0.025"} 53
loki_request_duration_seconds_bucket{method="POST",route="loki_api_v1_push",status_code="204",ws="false",le="0.05"} 54
loki_request_duration_seconds_bucket{method="POST",route="loki_api_v1_push",status_code="204",ws="false",le="0.1"} 54
loki_request_duration_seconds_bucket{method="POST",route="loki_api_v1_push",status_code="204",ws="false",le="0.25"} 54
loki_request_duration_seconds_bucket{method="POST",route="loki_api_v1_push",status_code="204",ws="false",le="0.5"} 54
loki_request_duration_seconds_bucket{method="POST",route="loki_api_v1_push",status_code="204",ws="false",le="1"} 54
loki_request_duration_seconds_bucket{method="POST",route="loki_api_v1_push",status_code="204",ws="false",le="2.5"} 54
loki_request_duration_seconds_bucket{method="POST",route="loki_api_v1_push",status_code="204",ws="false",le="5"} 54
loki_request_duration_seconds_bucket{method="POST",route="loki_api_v1_push",status_code="204",ws="false",le="10"} 54
loki_request_duration_seconds_bucket{method="POST",route="loki_api_v1_push",status_code="204",ws="false",le="25"} 54
loki_request_duration_seconds_bucket{method="POST",route="loki_api_v1_push",status_code="204",ws="false",le="50"} 54
loki_request_duration_seconds_bucket{method="POST",route="loki_api_v1_push",status_code="204",ws="false",le="100"} 54
loki_request_duration_seconds_bucket{method="POST",route="loki_api_v1_push",status_code="204",ws="false",le="+Inf"} 54
loki_request_duration_seconds_sum{method="POST",route="loki_api_v1_push",status_code="204",ws="false"} 0.08988079199999999
loki_request_duration_seconds_count{method="POST",route="loki_api_v1_push",status_code="204",ws="false"} 54
loki_request_duration_seconds_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",status_code="success",ws="false",le="0.005"} 3
loki_request_duration_seconds_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",status_code="success",ws="false",le="0.01"} 3
loki_request_duration_seconds_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",status_code="success",ws="false",le="0.025"} 3
loki_request_duration_seconds_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",status_code="success",ws="false",le="0.05"} 3
loki_request_duration_seconds_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",status_code="success",ws="false",le="0.1"} 3
loki_request_duration_seconds_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",status_code="success",ws="false",le="0.25"} 3
loki_request_duration_seconds_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",status_code="success",ws="false",le="0.5"} 3
loki_request_duration_seconds_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",status_code="success",ws="false",le="1"} 3
loki_request_duration_seconds_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",status_code="success",ws="false",le="2.5"} 3
loki_request_duration_seconds_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",status_code="success",ws="false",le="5"} 3
loki_request_duration_seconds_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",status_code="success",ws="false",le="10"} 3
loki_request_duration_seconds_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",status_code="success",ws="false",le="25"} 3
loki_request_duration_seconds_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",status_code="success",ws="false",le="50"} 3
loki_request_duration_seconds_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",status_code="success",ws="false",le="100"} 3
loki_request_duration_seconds_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",status_code="success",ws="false",le="+Inf"} 3
loki_request_duration_seconds_sum{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",status_code="success",ws="false"} 1.3476000000000001e-05
loki_request_duration_seconds_count{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",status_code="success",ws="false"} 3
loki_request_duration_seconds_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",status_code="success",ws="false",le="0.005"} 88
loki_request_duration_seconds_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",status_code="success",ws="false",le="0.01"} 88
loki_request_duration_seconds_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",status_code="success",ws="false",le="0.025"} 88
loki_request_duration_seconds_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",status_code="success",ws="false",le="0.05"} 88
loki_request_duration_seconds_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",status_code="success",ws="false",le="0.1"} 88
loki_request_duration_seconds_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",status_code="success",ws="false",le="0.25"} 88
loki_request_duration_seconds_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",status_code="success",ws="false",le="0.5"} 88
loki_request_duration_seconds_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",status_code="success",ws="false",le="1"} 88
loki_request_duration_seconds_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",status_code="success",ws="false",le="2.5"} 88
loki_request_duration_seconds_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",status_code="success",ws="false",le="5"} 88
loki_request_duration_seconds_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",status_code="success",ws="false",le="10"} 88
loki_request_duration_seconds_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",status_code="success",ws="false",le="25"} 88
loki_request_duration_seconds_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",status_code="success",ws="false",le="50"} 88
loki_request_duration_seconds_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",status_code="success",ws="false",le="100"} 88
loki_request_duration_seconds_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",status_code="success",ws="false",le="+Inf"} 88
loki_request_duration_seconds_sum{method="gRPC",route="/grpc.health.v1.Health/Check",status_code="success",ws="false"} 0.0009134700000000003
loki_request_duration_seconds_count{method="gRPC",route="/grpc.health.v1.Health/Check",status_code="success",ws="false"} 88
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Pusher/Push",status_code="success",ws="false",le="0.005"} 52
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Pusher/Push",status_code="success",ws="false",le="0.01"} 52
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Pusher/Push",status_code="success",ws="false",le="0.025"} 54
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Pusher/Push",status_code="success",ws="false",le="0.05"} 54
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Pusher/Push",status_code="success",ws="false",le="0.1"} 54
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Pusher/Push",status_code="success",ws="false",le="0.25"} 54
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Pusher/Push",status_code="success",ws="false",le="0.5"} 54
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Pusher/Push",status_code="success",ws="false",le="1"} 54
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Pusher/Push",status_code="success",ws="false",le="2.5"} 54
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Pusher/Push",status_code="success",ws="false",le="5"} 54
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Pusher/Push",status_code="success",ws="false",le="10"} 54
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Pusher/Push",status_code="success",ws="false",le="25"} 54
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Pusher/Push",status_code="success",ws="false",le="50"} 54
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Pusher/Push",status_code="success",ws="false",le="100"} 54
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Pusher/Push",status_code="success",ws="false",le="+Inf"} 54
loki_request_duration_seconds_sum{method="gRPC",route="/logproto.Pusher/Push",status_code="success",ws="false"} 0.04247786400000001
loki_request_duration_seconds_count{method="gRPC",route="/logproto.Pusher/Push",status_code="success",ws="false"} 54
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Querier/Label",status_code="success",ws="false",le="0.005"} 2
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Querier/Label",status_code="success",ws="false",le="0.01"} 2
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Querier/Label",status_code="success",ws="false",le="0.025"} 2
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Querier/Label",status_code="success",ws="false",le="0.05"} 2
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Querier/Label",status_code="success",ws="false",le="0.1"} 2
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Querier/Label",status_code="success",ws="false",le="0.25"} 2
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Querier/Label",status_code="success",ws="false",le="0.5"} 2
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Querier/Label",status_code="success",ws="false",le="1"} 2
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Querier/Label",status_code="success",ws="false",le="2.5"} 2
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Querier/Label",status_code="success",ws="false",le="5"} 2
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Querier/Label",status_code="success",ws="false",le="10"} 2
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Querier/Label",status_code="success",ws="false",le="25"} 2
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Querier/Label",status_code="success",ws="false",le="50"} 2
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Querier/Label",status_code="success",ws="false",le="100"} 2
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Querier/Label",status_code="success",ws="false",le="+Inf"} 2
loki_request_duration_seconds_sum{method="gRPC",route="/logproto.Querier/Label",status_code="success",ws="false"} 2.1260000000000003e-05
loki_request_duration_seconds_count{method="gRPC",route="/logproto.Querier/Label",status_code="success",ws="false"} 2
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Querier/Query",status_code="success",ws="false",le="0.005"} 2
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Querier/Query",status_code="success",ws="false",le="0.01"} 2
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Querier/Query",status_code="success",ws="false",le="0.025"} 2
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Querier/Query",status_code="success",ws="false",le="0.05"} 2
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Querier/Query",status_code="success",ws="false",le="0.1"} 2
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Querier/Query",status_code="success",ws="false",le="0.25"} 2
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Querier/Query",status_code="success",ws="false",le="0.5"} 2
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Querier/Query",status_code="success",ws="false",le="1"} 2
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Querier/Query",status_code="success",ws="false",le="2.5"} 2
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Querier/Query",status_code="success",ws="false",le="5"} 2
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Querier/Query",status_code="success",ws="false",le="10"} 2
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Querier/Query",status_code="success",ws="false",le="25"} 2
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Querier/Query",status_code="success",ws="false",le="50"} 2
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Querier/Query",status_code="success",ws="false",le="100"} 2
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.Querier/Query",status_code="success",ws="false",le="+Inf"} 2
loki_request_duration_seconds_sum{method="gRPC",route="/logproto.Querier/Query",status_code="success",ws="false"} 0.00046878999999999996
loki_request_duration_seconds_count{method="gRPC",route="/logproto.Querier/Query",status_code="success",ws="false"} 2
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",status_code="success",ws="false",le="0.005"} 928
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",status_code="success",ws="false",le="0.01"} 928
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",status_code="success",ws="false",le="0.025"} 928
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",status_code="success",ws="false",le="0.05"} 928
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",status_code="success",ws="false",le="0.1"} 928
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",status_code="success",ws="false",le="0.25"} 928
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",status_code="success",ws="false",le="0.5"} 928
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",status_code="success",ws="false",le="1"} 928
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",status_code="success",ws="false",le="2.5"} 928
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",status_code="success",ws="false",le="5"} 928
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",status_code="success",ws="false",le="10"} 928
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",status_code="success",ws="false",le="25"} 928
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",status_code="success",ws="false",le="50"} 928
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",status_code="success",ws="false",le="100"} 928
loki_request_duration_seconds_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",status_code="success",ws="false",le="+Inf"} 928
loki_request_duration_seconds_sum{method="gRPC",route="/logproto.StreamData/GetStreamRates",status_code="success",ws="false"} 0.008711615000000002
loki_request_duration_seconds_count{method="gRPC",route="/logproto.StreamData/GetStreamRates",status_code="success",ws="false"} 928
loki_request_duration_seconds_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",status_code="cancel",ws="false",le="0.005"} 0
loki_request_duration_seconds_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",status_code="cancel",ws="false",le="0.01"} 0
loki_request_duration_seconds_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",status_code="cancel",ws="false",le="0.025"} 0
loki_request_duration_seconds_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",status_code="cancel",ws="false",le="0.05"} 0
loki_request_duration_seconds_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",status_code="cancel",ws="false",le="0.1"} 0
loki_request_duration_seconds_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",status_code="cancel",ws="false",le="0.25"} 0
loki_request_duration_seconds_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",status_code="cancel",ws="false",le="0.5"} 0
loki_request_duration_seconds_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",status_code="cancel",ws="false",le="1"} 0
loki_request_duration_seconds_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",status_code="cancel",ws="false",le="2.5"} 0
loki_request_duration_seconds_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",status_code="cancel",ws="false",le="5"} 0
loki_request_duration_seconds_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",status_code="cancel",ws="false",le="10"} 0
loki_request_duration_seconds_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",status_code="cancel",ws="false",le="25"} 0
loki_request_duration_seconds_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",status_code="cancel",ws="false",le="50"} 0
loki_request_duration_seconds_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",status_code="cancel",ws="false",le="100"} 0
loki_request_duration_seconds_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",status_code="cancel",ws="false",le="+Inf"} 1
loki_request_duration_seconds_sum{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",status_code="cancel",ws="false"} 999.207420785
loki_request_duration_seconds_count{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",status_code="cancel",ws="false"} 1
# HELP loki_request_message_bytes Size (in bytes) of messages received in the request.
# TYPE loki_request_message_bytes histogram
loki_request_message_bytes_bucket{method="GET",route="loki_api_v1_label_name_values",le="1.048576e+06"} 1
loki_request_message_bytes_bucket{method="GET",route="loki_api_v1_label_name_values",le="2.62144e+06"} 1
loki_request_message_bytes_bucket{method="GET",route="loki_api_v1_label_name_values",le="5.24288e+06"} 1
loki_request_message_bytes_bucket{method="GET",route="loki_api_v1_label_name_values",le="1.048576e+07"} 1
loki_request_message_bytes_bucket{method="GET",route="loki_api_v1_label_name_values",le="2.62144e+07"} 1
loki_request_message_bytes_bucket{method="GET",route="loki_api_v1_label_name_values",le="5.24288e+07"} 1
loki_request_message_bytes_bucket{method="GET",route="loki_api_v1_label_name_values",le="1.048576e+08"} 1
loki_request_message_bytes_bucket{method="GET",route="loki_api_v1_label_name_values",le="2.62144e+08"} 1
loki_request_message_bytes_bucket{method="GET",route="loki_api_v1_label_name_values",le="+Inf"} 1
loki_request_message_bytes_sum{method="GET",route="loki_api_v1_label_name_values"} 0
loki_request_message_bytes_count{method="GET",route="loki_api_v1_label_name_values"} 1
loki_request_message_bytes_bucket{method="GET",route="loki_api_v1_labels",le="1.048576e+06"} 1
loki_request_message_bytes_bucket{method="GET",route="loki_api_v1_labels",le="2.62144e+06"} 1
loki_request_message_bytes_bucket{method="GET",route="loki_api_v1_labels",le="5.24288e+06"} 1
loki_request_message_bytes_bucket{method="GET",route="loki_api_v1_labels",le="1.048576e+07"} 1
loki_request_message_bytes_bucket{method="GET",route="loki_api_v1_labels",le="2.62144e+07"} 1
loki_request_message_bytes_bucket{method="GET",route="loki_api_v1_labels",le="5.24288e+07"} 1
loki_request_message_bytes_bucket{method="GET",route="loki_api_v1_labels",le="1.048576e+08"} 1
loki_request_message_bytes_bucket{method="GET",route="loki_api_v1_labels",le="2.62144e+08"} 1
loki_request_message_bytes_bucket{method="GET",route="loki_api_v1_labels",le="+Inf"} 1
loki_request_message_bytes_sum{method="GET",route="loki_api_v1_labels"} 0
loki_request_message_bytes_count{method="GET",route="loki_api_v1_labels"} 1
loki_request_message_bytes_bucket{method="GET",route="loki_api_v1_query_range",le="1.048576e+06"} 1
loki_request_message_bytes_bucket{method="GET",route="loki_api_v1_query_range",le="2.62144e+06"} 1
loki_request_message_bytes_bucket{method="GET",route="loki_api_v1_query_range",le="5.24288e+06"} 1
loki_request_message_bytes_bucket{method="GET",route="loki_api_v1_query_range",le="1.048576e+07"} 1
loki_request_message_bytes_bucket{method="GET",route="loki_api_v1_query_range",le="2.62144e+07"} 1
loki_request_message_bytes_bucket{method="GET",route="loki_api_v1_query_range",le="5.24288e+07"} 1
loki_request_message_bytes_bucket{method="GET",route="loki_api_v1_query_range",le="1.048576e+08"} 1
loki_request_message_bytes_bucket{method="GET",route="loki_api_v1_query_range",le="2.62144e+08"} 1
loki_request_message_bytes_bucket{method="GET",route="loki_api_v1_query_range",le="+Inf"} 1
loki_request_message_bytes_sum{method="GET",route="loki_api_v1_query_range"} 0
loki_request_message_bytes_count{method="GET",route="loki_api_v1_query_range"} 1
loki_request_message_bytes_bucket{method="GET",route="metrics",le="1.048576e+06"} 69
loki_request_message_bytes_bucket{method="GET",route="metrics",le="2.62144e+06"} 69
loki_request_message_bytes_bucket{method="GET",route="metrics",le="5.24288e+06"} 69
loki_request_message_bytes_bucket{method="GET",route="metrics",le="1.048576e+07"} 69
loki_request_message_bytes_bucket{method="GET",route="metrics",le="2.62144e+07"} 69
loki_request_message_bytes_bucket{method="GET",route="metrics",le="5.24288e+07"} 69
loki_request_message_bytes_bucket{method="GET",route="metrics",le="1.048576e+08"} 69
loki_request_message_bytes_bucket{method="GET",route="metrics",le="2.62144e+08"} 69
loki_request_message_bytes_bucket{method="GET",route="metrics",le="+Inf"} 69
loki_request_message_bytes_sum{method="GET",route="metrics"} 0
loki_request_message_bytes_count{method="GET",route="metrics"} 69
loki_request_message_bytes_bucket{method="GET",route="ready",le="1.048576e+06"} 1
loki_request_message_bytes_bucket{method="GET",route="ready",le="2.62144e+06"} 1
loki_request_message_bytes_bucket{method="GET",route="ready",le="5.24288e+06"} 1
loki_request_message_bytes_bucket{method="GET",route="ready",le="1.048576e+07"} 1
loki_request_message_bytes_bucket{method="GET",route="ready",le="2.62144e+07"} 1
loki_request_message_bytes_bucket{method="GET",route="ready",le="5.24288e+07"} 1
loki_request_message_bytes_bucket{method="GET",route="ready",le="1.048576e+08"} 1
loki_request_message_bytes_bucket{method="GET",route="ready",le="2.62144e+08"} 1
loki_request_message_bytes_bucket{method="GET",route="ready",le="+Inf"} 1
loki_request_message_bytes_sum{method="GET",route="ready"} 0
loki_request_message_bytes_count{method="GET",route="ready"} 1
loki_request_message_bytes_bucket{method="POST",route="loki_api_v1_push",le="1.048576e+06"} 54
loki_request_message_bytes_bucket{method="POST",route="loki_api_v1_push",le="2.62144e+06"} 54
loki_request_message_bytes_bucket{method="POST",route="loki_api_v1_push",le="5.24288e+06"} 54
loki_request_message_bytes_bucket{method="POST",route="loki_api_v1_push",le="1.048576e+07"} 54
loki_request_message_bytes_bucket{method="POST",route="loki_api_v1_push",le="2.62144e+07"} 54
loki_request_message_bytes_bucket{method="POST",route="loki_api_v1_push",le="5.24288e+07"} 54
loki_request_message_bytes_bucket{method="POST",route="loki_api_v1_push",le="1.048576e+08"} 54
loki_request_message_bytes_bucket{method="POST",route="loki_api_v1_push",le="2.62144e+08"} 54
loki_request_message_bytes_bucket{method="POST",route="loki_api_v1_push",le="+Inf"} 54
loki_request_message_bytes_sum{method="POST",route="loki_api_v1_push"} 340554
loki_request_message_bytes_count{method="POST",route="loki_api_v1_push"} 54
loki_request_message_bytes_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",le="1.048576e+06"} 3
loki_request_message_bytes_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",le="2.62144e+06"} 3
loki_request_message_bytes_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",le="5.24288e+06"} 3
loki_request_message_bytes_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",le="1.048576e+07"} 3
loki_request_message_bytes_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",le="2.62144e+07"} 3
loki_request_message_bytes_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",le="5.24288e+07"} 3
loki_request_message_bytes_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",le="1.048576e+08"} 3
loki_request_message_bytes_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",le="2.62144e+08"} 3
loki_request_message_bytes_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",le="+Inf"} 3
loki_request_message_bytes_sum{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult"} 4251
loki_request_message_bytes_count{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult"} 3
loki_request_message_bytes_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",le="1.048576e+06"} 88
loki_request_message_bytes_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",le="2.62144e+06"} 88
loki_request_message_bytes_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",le="5.24288e+06"} 88
loki_request_message_bytes_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",le="1.048576e+07"} 88
loki_request_message_bytes_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",le="2.62144e+07"} 88
loki_request_message_bytes_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",le="5.24288e+07"} 88
loki_request_message_bytes_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",le="1.048576e+08"} 88
loki_request_message_bytes_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",le="2.62144e+08"} 88
loki_request_message_bytes_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",le="+Inf"} 88
loki_request_message_bytes_sum{method="gRPC",route="/grpc.health.v1.Health/Check"} 440
loki_request_message_bytes_count{method="gRPC",route="/grpc.health.v1.Health/Check"} 88
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.Pusher/Push",le="1.048576e+06"} 54
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.Pusher/Push",le="2.62144e+06"} 54
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.Pusher/Push",le="5.24288e+06"} 54
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.Pusher/Push",le="1.048576e+07"} 54
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.Pusher/Push",le="2.62144e+07"} 54
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.Pusher/Push",le="5.24288e+07"} 54
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.Pusher/Push",le="1.048576e+08"} 54
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.Pusher/Push",le="2.62144e+08"} 54
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.Pusher/Push",le="+Inf"} 54
loki_request_message_bytes_sum{method="gRPC",route="/logproto.Pusher/Push"} 1.250505e+06
loki_request_message_bytes_count{method="gRPC",route="/logproto.Pusher/Push"} 54
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Label",le="1.048576e+06"} 2
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Label",le="2.62144e+06"} 2
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Label",le="5.24288e+06"} 2
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Label",le="1.048576e+07"} 2
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Label",le="2.62144e+07"} 2
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Label",le="5.24288e+07"} 2
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Label",le="1.048576e+08"} 2
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Label",le="2.62144e+08"} 2
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Label",le="+Inf"} 2
loki_request_message_bytes_sum{method="gRPC",route="/logproto.Querier/Label"} 76
loki_request_message_bytes_count{method="gRPC",route="/logproto.Querier/Label"} 2
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Query",le="1.048576e+06"} 2
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Query",le="2.62144e+06"} 2
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Query",le="5.24288e+06"} 2
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Query",le="1.048576e+07"} 2
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Query",le="2.62144e+07"} 2
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Query",le="5.24288e+07"} 2
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Query",le="1.048576e+08"} 2
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Query",le="2.62144e+08"} 2
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Query",le="+Inf"} 2
loki_request_message_bytes_sum{method="gRPC",route="/logproto.Querier/Query"} 236
loki_request_message_bytes_count{method="gRPC",route="/logproto.Querier/Query"} 2
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",le="1.048576e+06"} 928
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",le="2.62144e+06"} 928
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",le="5.24288e+06"} 928
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",le="1.048576e+07"} 928
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",le="2.62144e+07"} 928
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",le="5.24288e+07"} 928
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",le="1.048576e+08"} 928
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",le="2.62144e+08"} 928
loki_request_message_bytes_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",le="+Inf"} 928
loki_request_message_bytes_sum{method="gRPC",route="/logproto.StreamData/GetStreamRates"} 4640
loki_request_message_bytes_count{method="gRPC",route="/logproto.StreamData/GetStreamRates"} 928
loki_request_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForFrontend/FrontendLoop",le="1.048576e+06"} 10
loki_request_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForFrontend/FrontendLoop",le="2.62144e+06"} 10
loki_request_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForFrontend/FrontendLoop",le="5.24288e+06"} 10
loki_request_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForFrontend/FrontendLoop",le="1.048576e+07"} 10
loki_request_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForFrontend/FrontendLoop",le="2.62144e+07"} 10
loki_request_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForFrontend/FrontendLoop",le="5.24288e+07"} 10
loki_request_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForFrontend/FrontendLoop",le="1.048576e+08"} 10
loki_request_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForFrontend/FrontendLoop",le="2.62144e+08"} 10
loki_request_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForFrontend/FrontendLoop",le="+Inf"} 10
loki_request_message_bytes_sum{method="gRPC",route="/schedulerpb.SchedulerForFrontend/FrontendLoop"} 1226
loki_request_message_bytes_count{method="gRPC",route="/schedulerpb.SchedulerForFrontend/FrontendLoop"} 10
loki_request_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",le="1.048576e+06"} 8
loki_request_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",le="2.62144e+06"} 8
loki_request_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",le="5.24288e+06"} 8
loki_request_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",le="1.048576e+07"} 8
loki_request_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",le="2.62144e+07"} 8
loki_request_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",le="5.24288e+07"} 8
loki_request_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",le="1.048576e+08"} 8
loki_request_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",le="2.62144e+08"} 8
loki_request_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",le="+Inf"} 8
loki_request_message_bytes_sum{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop"} 95
loki_request_message_bytes_count{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop"} 8
# HELP loki_response_message_bytes Size (in bytes) of messages sent in response.
# TYPE loki_response_message_bytes histogram
loki_response_message_bytes_bucket{method="GET",route="loki_api_v1_label_name_values",le="1.048576e+06"} 1
loki_response_message_bytes_bucket{method="GET",route="loki_api_v1_label_name_values",le="2.62144e+06"} 1
loki_response_message_bytes_bucket{method="GET",route="loki_api_v1_label_name_values",le="5.24288e+06"} 1
loki_response_message_bytes_bucket{method="GET",route="loki_api_v1_label_name_values",le="1.048576e+07"} 1
loki_response_message_bytes_bucket{method="GET",route="loki_api_v1_label_name_values",le="2.62144e+07"} 1
loki_response_message_bytes_bucket{method="GET",route="loki_api_v1_label_name_values",le="5.24288e+07"} 1
loki_response_message_bytes_bucket{method="GET",route="loki_api_v1_label_name_values",le="1.048576e+08"} 1
loki_response_message_bytes_bucket{method="GET",route="loki_api_v1_label_name_values",le="2.62144e+08"} 1
loki_response_message_bytes_bucket{method="GET",route="loki_api_v1_label_name_values",le="+Inf"} 1
loki_response_message_bytes_sum{method="GET",route="loki_api_v1_label_name_values"} 21
loki_response_message_bytes_count{method="GET",route="loki_api_v1_label_name_values"} 1
loki_response_message_bytes_bucket{method="GET",route="loki_api_v1_labels",le="1.048576e+06"} 1
loki_response_message_bytes_bucket{method="GET",route="loki_api_v1_labels",le="2.62144e+06"} 1
loki_response_message_bytes_bucket{method="GET",route="loki_api_v1_labels",le="5.24288e+06"} 1
loki_response_message_bytes_bucket{method="GET",route="loki_api_v1_labels",le="1.048576e+07"} 1
loki_response_message_bytes_bucket{method="GET",route="loki_api_v1_labels",le="2.62144e+07"} 1
loki_response_message_bytes_bucket{method="GET",route="loki_api_v1_labels",le="5.24288e+07"} 1
loki_response_message_bytes_bucket{method="GET",route="loki_api_v1_labels",le="1.048576e+08"} 1
loki_response_message_bytes_bucket{method="GET",route="loki_api_v1_labels",le="2.62144e+08"} 1
loki_response_message_bytes_bucket{method="GET",route="loki_api_v1_labels",le="+Inf"} 1
loki_response_message_bytes_sum{method="GET",route="loki_api_v1_labels"} 80
loki_response_message_bytes_count{method="GET",route="loki_api_v1_labels"} 1
loki_response_message_bytes_bucket{method="GET",route="loki_api_v1_query_range",le="1.048576e+06"} 1
loki_response_message_bytes_bucket{method="GET",route="loki_api_v1_query_range",le="2.62144e+06"} 1
loki_response_message_bytes_bucket{method="GET",route="loki_api_v1_query_range",le="5.24288e+06"} 1
loki_response_message_bytes_bucket{method="GET",route="loki_api_v1_query_range",le="1.048576e+07"} 1
loki_response_message_bytes_bucket{method="GET",route="loki_api_v1_query_range",le="2.62144e+07"} 1
loki_response_message_bytes_bucket{method="GET",route="loki_api_v1_query_range",le="5.24288e+07"} 1
loki_response_message_bytes_bucket{method="GET",route="loki_api_v1_query_range",le="1.048576e+08"} 1
loki_response_message_bytes_bucket{method="GET",route="loki_api_v1_query_range",le="2.62144e+08"} 1
loki_response_message_bytes_bucket{method="GET",route="loki_api_v1_query_range",le="+Inf"} 1
loki_response_message_bytes_sum{method="GET",route="loki_api_v1_query_range"} 3933
loki_response_message_bytes_count{method="GET",route="loki_api_v1_query_range"} 1
loki_response_message_bytes_bucket{method="GET",route="metrics",le="1.048576e+06"} 69
loki_response_message_bytes_bucket{method="GET",route="metrics",le="2.62144e+06"} 69
loki_response_message_bytes_bucket{method="GET",route="metrics",le="5.24288e+06"} 69
loki_response_message_bytes_bucket{method="GET",route="metrics",le="1.048576e+07"} 69
loki_response_message_bytes_bucket{method="GET",route="metrics",le="2.62144e+07"} 69
loki_response_message_bytes_bucket{method="GET",route="metrics",le="5.24288e+07"} 69
loki_response_message_bytes_bucket{method="GET",route="metrics",le="1.048576e+08"} 69
loki_response_message_bytes_bucket{method="GET",route="metrics",le="2.62144e+08"} 69
loki_response_message_bytes_bucket{method="GET",route="metrics",le="+Inf"} 69
loki_response_message_bytes_sum{method="GET",route="metrics"} 1.148365e+06
loki_response_message_bytes_count{method="GET",route="metrics"} 69
loki_response_message_bytes_bucket{method="GET",route="ready",le="1.048576e+06"} 1
loki_response_message_bytes_bucket{method="GET",route="ready",le="2.62144e+06"} 1
loki_response_message_bytes_bucket{method="GET",route="ready",le="5.24288e+06"} 1
loki_response_message_bytes_bucket{method="GET",route="ready",le="1.048576e+07"} 1
loki_response_message_bytes_bucket{method="GET",route="ready",le="2.62144e+07"} 1
loki_response_message_bytes_bucket{method="GET",route="ready",le="5.24288e+07"} 1
loki_response_message_bytes_bucket{method="GET",route="ready",le="1.048576e+08"} 1
loki_response_message_bytes_bucket{method="GET",route="ready",le="2.62144e+08"} 1
loki_response_message_bytes_bucket{method="GET",route="ready",le="+Inf"} 1
loki_response_message_bytes_sum{method="GET",route="ready"} 54
loki_response_message_bytes_count{method="GET",route="ready"} 1
loki_response_message_bytes_bucket{method="POST",route="loki_api_v1_push",le="1.048576e+06"} 54
loki_response_message_bytes_bucket{method="POST",route="loki_api_v1_push",le="2.62144e+06"} 54
loki_response_message_bytes_bucket{method="POST",route="loki_api_v1_push",le="5.24288e+06"} 54
loki_response_message_bytes_bucket{method="POST",route="loki_api_v1_push",le="1.048576e+07"} 54
loki_response_message_bytes_bucket{method="POST",route="loki_api_v1_push",le="2.62144e+07"} 54
loki_response_message_bytes_bucket{method="POST",route="loki_api_v1_push",le="5.24288e+07"} 54
loki_response_message_bytes_bucket{method="POST",route="loki_api_v1_push",le="1.048576e+08"} 54
loki_response_message_bytes_bucket{method="POST",route="loki_api_v1_push",le="2.62144e+08"} 54
loki_response_message_bytes_bucket{method="POST",route="loki_api_v1_push",le="+Inf"} 54
loki_response_message_bytes_sum{method="POST",route="loki_api_v1_push"} 0
loki_response_message_bytes_count{method="POST",route="loki_api_v1_push"} 54
loki_response_message_bytes_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",le="1.048576e+06"} 3
loki_response_message_bytes_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",le="2.62144e+06"} 3
loki_response_message_bytes_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",le="5.24288e+06"} 3
loki_response_message_bytes_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",le="1.048576e+07"} 3
loki_response_message_bytes_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",le="2.62144e+07"} 3
loki_response_message_bytes_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",le="5.24288e+07"} 3
loki_response_message_bytes_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",le="1.048576e+08"} 3
loki_response_message_bytes_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",le="2.62144e+08"} 3
loki_response_message_bytes_bucket{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult",le="+Inf"} 3
loki_response_message_bytes_sum{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult"} 15
loki_response_message_bytes_count{method="gRPC",route="/frontendv2pb.FrontendForQuerier/QueryResult"} 3
loki_response_message_bytes_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",le="1.048576e+06"} 88
loki_response_message_bytes_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",le="2.62144e+06"} 88
loki_response_message_bytes_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",le="5.24288e+06"} 88
loki_response_message_bytes_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",le="1.048576e+07"} 88
loki_response_message_bytes_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",le="2.62144e+07"} 88
loki_response_message_bytes_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",le="5.24288e+07"} 88
loki_response_message_bytes_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",le="1.048576e+08"} 88
loki_response_message_bytes_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",le="2.62144e+08"} 88
loki_response_message_bytes_bucket{method="gRPC",route="/grpc.health.v1.Health/Check",le="+Inf"} 88
loki_response_message_bytes_sum{method="gRPC",route="/grpc.health.v1.Health/Check"} 616
loki_response_message_bytes_count{method="gRPC",route="/grpc.health.v1.Health/Check"} 88
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.Pusher/Push",le="1.048576e+06"} 54
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.Pusher/Push",le="2.62144e+06"} 54
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.Pusher/Push",le="5.24288e+06"} 54
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.Pusher/Push",le="1.048576e+07"} 54
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.Pusher/Push",le="2.62144e+07"} 54
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.Pusher/Push",le="5.24288e+07"} 54
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.Pusher/Push",le="1.048576e+08"} 54
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.Pusher/Push",le="2.62144e+08"} 54
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.Pusher/Push",le="+Inf"} 54
loki_response_message_bytes_sum{method="gRPC",route="/logproto.Pusher/Push"} 270
loki_response_message_bytes_count{method="gRPC",route="/logproto.Pusher/Push"} 54
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Label",le="1.048576e+06"} 2
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Label",le="2.62144e+06"} 2
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Label",le="5.24288e+06"} 2
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Label",le="1.048576e+07"} 2
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Label",le="2.62144e+07"} 2
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Label",le="5.24288e+07"} 2
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Label",le="1.048576e+08"} 2
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Label",le="2.62144e+08"} 2
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Label",le="+Inf"} 2
loki_response_message_bytes_sum{method="gRPC",route="/logproto.Querier/Label"} 45
loki_response_message_bytes_count{method="gRPC",route="/logproto.Querier/Label"} 2
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Query",le="1.048576e+06"} 2
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Query",le="2.62144e+06"} 2
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Query",le="5.24288e+06"} 2
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Query",le="1.048576e+07"} 2
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Query",le="2.62144e+07"} 2
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Query",le="5.24288e+07"} 2
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Query",le="1.048576e+08"} 2
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Query",le="2.62144e+08"} 2
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.Querier/Query",le="+Inf"} 2
loki_response_message_bytes_sum{method="gRPC",route="/logproto.Querier/Query"} 2122
loki_response_message_bytes_count{method="gRPC",route="/logproto.Querier/Query"} 2
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",le="1.048576e+06"} 928
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",le="2.62144e+06"} 928
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",le="5.24288e+06"} 928
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",le="1.048576e+07"} 928
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",le="2.62144e+07"} 928
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",le="5.24288e+07"} 928
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",le="1.048576e+08"} 928
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",le="2.62144e+08"} 928
loki_response_message_bytes_bucket{method="gRPC",route="/logproto.StreamData/GetStreamRates",le="+Inf"} 928
loki_response_message_bytes_sum{method="gRPC",route="/logproto.StreamData/GetStreamRates"} 8387
loki_response_message_bytes_count{method="gRPC",route="/logproto.StreamData/GetStreamRates"} 928
loki_response_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForFrontend/FrontendLoop",le="1.048576e+06"} 10
loki_response_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForFrontend/FrontendLoop",le="2.62144e+06"} 10
loki_response_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForFrontend/FrontendLoop",le="5.24288e+06"} 10
loki_response_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForFrontend/FrontendLoop",le="1.048576e+07"} 10
loki_response_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForFrontend/FrontendLoop",le="2.62144e+07"} 10
loki_response_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForFrontend/FrontendLoop",le="5.24288e+07"} 10
loki_response_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForFrontend/FrontendLoop",le="1.048576e+08"} 10
loki_response_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForFrontend/FrontendLoop",le="2.62144e+08"} 10
loki_response_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForFrontend/FrontendLoop",le="+Inf"} 10
loki_response_message_bytes_sum{method="gRPC",route="/schedulerpb.SchedulerForFrontend/FrontendLoop"} 50
loki_response_message_bytes_count{method="gRPC",route="/schedulerpb.SchedulerForFrontend/FrontendLoop"} 10
loki_response_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",le="1.048576e+06"} 4
loki_response_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",le="2.62144e+06"} 4
loki_response_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",le="5.24288e+06"} 4
loki_response_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",le="1.048576e+07"} 4
loki_response_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",le="2.62144e+07"} 4
loki_response_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",le="5.24288e+07"} 4
loki_response_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",le="1.048576e+08"} 4
loki_response_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",le="2.62144e+08"} 4
loki_response_message_bytes_bucket{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop",le="+Inf"} 4
loki_response_message_bytes_sum{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop"} 1214
loki_response_message_bytes_count{method="gRPC",route="/schedulerpb.SchedulerForQuerier/QuerierLoop"} 4
# HELP loki_results_cache_version_comparisons_total Comparisons of cache key versions in the results cache between query-frontends & queriers
# TYPE loki_results_cache_version_comparisons_total counter
loki_results_cache_version_comparisons_total 0
# HELP loki_ring_member_heartbeats_total The total number of heartbeats sent.
# TYPE loki_ring_member_heartbeats_total counter
loki_ring_member_heartbeats_total{name="distributor"} 210
# HELP loki_ring_member_tokens_owned The number of tokens owned in the ring.
# TYPE loki_ring_member_tokens_owned gauge
loki_ring_member_tokens_owned{name="distributor"} 1
# HELP loki_ring_member_tokens_to_own The number of tokens to own in the ring.
# TYPE loki_ring_member_tokens_to_own gauge
loki_ring_member_tokens_to_own{name="distributor"} 1
# HELP loki_ring_members Number of members in the ring
# TYPE loki_ring_members gauge
loki_ring_members{name="distributor",state="ACTIVE"} 1
loki_ring_members{name="distributor",state="JOINING"} 0
loki_ring_members{name="distributor",state="LEAVING"} 0
loki_ring_members{name="distributor",state="PENDING"} 0
loki_ring_members{name="distributor",state="Unhealthy"} 0
loki_ring_members{name="ingester",state="ACTIVE"} 1
loki_ring_members{name="ingester",state="JOINING"} 0
loki_ring_members{name="ingester",state="LEAVING"} 0
loki_ring_members{name="ingester",state="PENDING"} 0
loki_ring_members{name="ingester",state="Unhealthy"} 0
loki_ring_members{name="scheduler",state="ACTIVE"} 1
loki_ring_members{name="scheduler",state="JOINING"} 0
loki_ring_members{name="scheduler",state="LEAVING"} 0
loki_ring_members{name="scheduler",state="PENDING"} 0
loki_ring_members{name="scheduler",state="Unhealthy"} 0
# HELP loki_ring_oldest_member_timestamp Timestamp of the oldest member in the ring.
# TYPE loki_ring_oldest_member_timestamp gauge
loki_ring_oldest_member_timestamp{name="distributor",state="ACTIVE"} 1.764205995e+09
loki_ring_oldest_member_timestamp{name="distributor",state="JOINING"} 0
loki_ring_oldest_member_timestamp{name="distributor",state="LEAVING"} 0
loki_ring_oldest_member_timestamp{name="distributor",state="PENDING"} 0
loki_ring_oldest_member_timestamp{name="distributor",state="Unhealthy"} 0
loki_ring_oldest_member_timestamp{name="ingester",state="ACTIVE"} 1.764205995e+09
loki_ring_oldest_member_timestamp{name="ingester",state="JOINING"} 0
loki_ring_oldest_member_timestamp{name="ingester",state="LEAVING"} 0
loki_ring_oldest_member_timestamp{name="ingester",state="PENDING"} 0
loki_ring_oldest_member_timestamp{name="ingester",state="Unhealthy"} 0
loki_ring_oldest_member_timestamp{name="scheduler",state="ACTIVE"} 1.764205995e+09
loki_ring_oldest_member_timestamp{name="scheduler",state="JOINING"} 0
loki_ring_oldest_member_timestamp{name="scheduler",state="LEAVING"} 0
loki_ring_oldest_member_timestamp{name="scheduler",state="PENDING"} 0
loki_ring_oldest_member_timestamp{name="scheduler",state="Unhealthy"} 0
# HELP loki_ring_tokens_total Number of tokens in the ring
# TYPE loki_ring_tokens_total gauge
loki_ring_tokens_total{name="distributor"} 1
loki_ring_tokens_total{name="ingester"} 128
loki_ring_tokens_total{name="scheduler"} 1
# HELP loki_store_chunks_downloaded_total Number of chunks referenced or downloaded, partitioned by if they satisfy matchers.
# TYPE loki_store_chunks_downloaded_total counter
loki_store_chunks_downloaded_total{status="discarded"} 50
loki_store_chunks_downloaded_total{status="matched"} 5
# HELP loki_store_chunks_per_batch The chunk batch size, partitioned by if they satisfy matchers.
# TYPE loki_store_chunks_per_batch histogram
loki_store_chunks_per_batch_bucket{status="discarded",le="0"} 1
loki_store_chunks_per_batch_bucket{status="discarded",le="10"} 1
loki_store_chunks_per_batch_bucket{status="discarded",le="20"} 1
loki_store_chunks_per_batch_bucket{status="discarded",le="30"} 1
loki_store_chunks_per_batch_bucket{status="discarded",le="40"} 1
loki_store_chunks_per_batch_bucket{status="discarded",le="50"} 2
loki_store_chunks_per_batch_bucket{status="discarded",le="+Inf"} 2
loki_store_chunks_per_batch_sum{status="discarded"} 50
loki_store_chunks_per_batch_count{status="discarded"} 2
loki_store_chunks_per_batch_bucket{status="matched",le="0"} 1
loki_store_chunks_per_batch_bucket{status="matched",le="10"} 2
loki_store_chunks_per_batch_bucket{status="matched",le="20"} 2
loki_store_chunks_per_batch_bucket{status="matched",le="30"} 2
loki_store_chunks_per_batch_bucket{status="matched",le="40"} 2
loki_store_chunks_per_batch_bucket{status="matched",le="50"} 2
loki_store_chunks_per_batch_bucket{status="matched",le="+Inf"} 2
loki_store_chunks_per_batch_sum{status="matched"} 5
loki_store_chunks_per_batch_count{status="matched"} 2
# HELP loki_store_series_total Number of series referenced by a query, partitioned by whether they satisfy matchers.
# TYPE loki_store_series_total counter
loki_store_series_total{status="discarded"} 50
loki_store_series_total{status="matched"} 5
# HELP loki_stream_sharding_count Total number of times the distributor has sharded streams
# TYPE loki_stream_sharding_count counter
loki_stream_sharding_count 0
# HELP loki_tcp_connections Current number of accepted TCP connections.
# TYPE loki_tcp_connections gauge
loki_tcp_connections{protocol="grpc"} 6
loki_tcp_connections{protocol="http"} 3
# HELP loki_tcp_connections_limit The max number of TCP connections that can be accepted (0 means no limit).
# TYPE loki_tcp_connections_limit gauge
loki_tcp_connections_limit{protocol="grpc"} 0
loki_tcp_connections_limit{protocol="http"} 0
# HELP process_cpu_seconds_total Total user and system CPU time spent in seconds.
# TYPE process_cpu_seconds_total counter
process_cpu_seconds_total 5.5
# HELP process_max_fds Maximum number of open file descriptors.
# TYPE process_max_fds gauge
process_max_fds 1.048576e+06
# HELP process_open_fds Number of open file descriptors.
# TYPE process_open_fds gauge
process_open_fds 28
# HELP process_resident_memory_bytes Resident memory size in bytes.
# TYPE process_resident_memory_bytes gauge
process_resident_memory_bytes 1.15597312e+08
# HELP process_start_time_seconds Start time of the process since unix epoch in seconds.
# TYPE process_start_time_seconds gauge
process_start_time_seconds 1.76420494532e+09
# HELP process_virtual_memory_bytes Virtual memory size in bytes.
# TYPE process_virtual_memory_bytes gauge
process_virtual_memory_bytes 1.400348672e+09
# HELP process_virtual_memory_max_bytes Maximum amount of virtual memory available in bytes.
# TYPE process_virtual_memory_max_bytes gauge
process_virtual_memory_max_bytes 1.8446744073709552e+19
# HELP prometheus_remote_storage_exemplars_in_total Exemplars in to remote storage, compare to exemplars out for queue managers.
# TYPE prometheus_remote_storage_exemplars_in_total counter
prometheus_remote_storage_exemplars_in_total 0
# HELP prometheus_remote_storage_histograms_in_total HistogramSamples in to remote storage, compare to histograms out for queue managers.
# TYPE prometheus_remote_storage_histograms_in_total counter
prometheus_remote_storage_histograms_in_total 0
# HELP prometheus_remote_storage_samples_in_total Samples in to remote storage, compare to samples out for queue managers.
# TYPE prometheus_remote_storage_samples_in_total counter
prometheus_remote_storage_samples_in_total 0
# HELP prometheus_remote_storage_string_interner_zero_reference_releases_total The number of times release has been called for strings that are not interned.
# TYPE prometheus_remote_storage_string_interner_zero_reference_releases_total counter
prometheus_remote_storage_string_interner_zero_reference_releases_total 0
# HELP prometheus_sd_dns_lookup_failures_total The number of DNS-SD lookup failures.
# TYPE prometheus_sd_dns_lookup_failures_total counter
prometheus_sd_dns_lookup_failures_total 0
# HELP prometheus_sd_dns_lookups_total The number of DNS-SD lookups.
# TYPE prometheus_sd_dns_lookups_total counter
prometheus_sd_dns_lookups_total 0
# HELP prometheus_template_text_expansion_failures_total The total number of template text expansion failures.
# TYPE prometheus_template_text_expansion_failures_total counter
prometheus_template_text_expansion_failures_total 0
# HELP prometheus_template_text_expansions_total The total number of template text expansions.
# TYPE prometheus_template_text_expansions_total counter
prometheus_template_text_expansions_total 0
# HELP prometheus_tsdb_wal_completed_pages_total Total number of completed pages.
# TYPE prometheus_tsdb_wal_completed_pages_total counter
prometheus_tsdb_wal_completed_pages_total 36
# HELP prometheus_tsdb_wal_fsync_duration_seconds Duration of write log fsync.
# TYPE prometheus_tsdb_wal_fsync_duration_seconds summary
prometheus_tsdb_wal_fsync_duration_seconds{quantile="0.5"} 0.001487715
prometheus_tsdb_wal_fsync_duration_seconds{quantile="0.9"} 0.001523503
prometheus_tsdb_wal_fsync_duration_seconds{quantile="0.99"} 0.001523503
prometheus_tsdb_wal_fsync_duration_seconds_sum 0.005083279
prometheus_tsdb_wal_fsync_duration_seconds_count 3
# HELP prometheus_tsdb_wal_page_flushes_total Total number of page flushes.
# TYPE prometheus_tsdb_wal_page_flushes_total counter
prometheus_tsdb_wal_page_flushes_total 99
# HELP prometheus_tsdb_wal_segment_current Write log segment index that TSDB is currently writing to.
# TYPE prometheus_tsdb_wal_segment_current gauge
prometheus_tsdb_wal_segment_current 3
# HELP prometheus_tsdb_wal_storage_size_bytes Size of the write log directory.
# TYPE prometheus_tsdb_wal_storage_size_bytes gauge
prometheus_tsdb_wal_storage_size_bytes 103616
# HELP prometheus_tsdb_wal_truncations_failed_total Total number of write log truncations that failed.
# TYPE prometheus_tsdb_wal_truncations_failed_total counter
prometheus_tsdb_wal_truncations_failed_total 0
# HELP prometheus_tsdb_wal_truncations_total Total number of write log truncations attempted.
# TYPE prometheus_tsdb_wal_truncations_total counter
prometheus_tsdb_wal_truncations_total 2
# HELP prometheus_tsdb_wal_writes_failed_total Total number of write log writes that failed.
# TYPE prometheus_tsdb_wal_writes_failed_total counter
prometheus_tsdb_wal_writes_failed_total 0
# HELP ring_member_heartbeats_total The total number of heartbeats sent.
# TYPE ring_member_heartbeats_total counter
ring_member_heartbeats_total{name="scheduler"} 210
# HELP ring_member_tokens_owned The number of tokens owned in the ring.
# TYPE ring_member_tokens_owned gauge
ring_member_tokens_owned{name="scheduler"} 1
# HELP ring_member_tokens_to_own The number of tokens to own in the ring.
# TYPE ring_member_tokens_to_own gauge
ring_member_tokens_to_own{name="scheduler"} 1
* Connection #0 to host 127.0.0.1 left intact
[root@rocky9-vm minn0701]# curl -s http://localhost:9080/metrics | grep promtail
net_conntrack_dialer_conn_attempted_total{dialer_name="promtail"} 1
net_conntrack_dialer_conn_closed_total{dialer_name="promtail"} 0
net_conntrack_dialer_conn_established_total{dialer_name="promtail"} 1
net_conntrack_dialer_conn_failed_total{dialer_name="promtail",reason="refused"} 0
net_conntrack_dialer_conn_failed_total{dialer_name="promtail",reason="resolution"} 0
net_conntrack_dialer_conn_failed_total{dialer_name="promtail",reason="timeout"} 0
net_conntrack_dialer_conn_failed_total{dialer_name="promtail",reason="unknown"} 0
# HELP promtail_batch_retries_total Number of times batches has had to be retried.
# TYPE promtail_batch_retries_total counter
promtail_batch_retries_total{host="127.0.0.1:3100",tenant=""} 0
# HELP promtail_build_info A metric with a constant '1' value labeled by version, revision, branch, goversion from which promtail was built, and the goos and goarch for the build.
# TYPE promtail_build_info gauge
promtail_build_info{branch="release-3.0.x",goarch="amd64",goos="linux",goversion="go1.21.9",revision="b4f7181",tags="promtail_journal_enabled",version="3.0.0"} 1
# HELP promtail_config_reload_fail_total Number of reload fail times.
# TYPE promtail_config_reload_fail_total counter
promtail_config_reload_fail_total 0
# HELP promtail_config_reload_success_total Number of reload success times.
# TYPE promtail_config_reload_success_total counter
promtail_config_reload_success_total 0
# HELP promtail_dropped_bytes_total Number of bytes dropped because failed to be sent to the ingester after all retries.
# TYPE promtail_dropped_bytes_total counter
promtail_dropped_bytes_total{host="127.0.0.1:3100",reason="ingester_error",tenant=""} 0
promtail_dropped_bytes_total{host="127.0.0.1:3100",reason="line_too_long",tenant=""} 0
promtail_dropped_bytes_total{host="127.0.0.1:3100",reason="rate_limited",tenant=""} 0
promtail_dropped_bytes_total{host="127.0.0.1:3100",reason="stream_limited",tenant=""} 0
# HELP promtail_dropped_entries_total Number of log entries dropped because failed to be sent to the ingester after all retries.
# TYPE promtail_dropped_entries_total counter
promtail_dropped_entries_total{host="127.0.0.1:3100",reason="ingester_error",tenant=""} 0
promtail_dropped_entries_total{host="127.0.0.1:3100",reason="line_too_long",tenant=""} 0
promtail_dropped_entries_total{host="127.0.0.1:3100",reason="rate_limited",tenant=""} 0
promtail_dropped_entries_total{host="127.0.0.1:3100",reason="stream_limited",tenant=""} 0
# HELP promtail_encoded_bytes_total Number of bytes encoded and ready to send.
# TYPE promtail_encoded_bytes_total counter
promtail_encoded_bytes_total{host="127.0.0.1:3100"} 341220
# HELP promtail_file_bytes_total Number of bytes total.
# TYPE promtail_file_bytes_total gauge
promtail_file_bytes_total{path="/var/log/boot.log"} 0
promtail_file_bytes_total{path="/var/log/cloud-init-output.log"} 6947
promtail_file_bytes_total{path="/var/log/cloud-init.log"} 175539
promtail_file_bytes_total{path="/var/log/dnf.librepo.log"} 156389
promtail_file_bytes_total{path="/var/log/dnf.log"} 267585
promtail_file_bytes_total{path="/var/log/dnf.rpm.log"} 85186
promtail_file_bytes_total{path="/var/log/ensm/auth/auth-app.log"} 17225
promtail_file_bytes_total{path="/var/log/ensm/main/main-app.log"} 3931
promtail_file_bytes_total{path="/var/log/hawkey.log"} 180
# HELP promtail_files_active_total Number of active files.
# TYPE promtail_files_active_total gauge
promtail_files_active_total 9
# HELP promtail_journal_target_lines_total Total number of successful journal lines read
# TYPE promtail_journal_target_lines_total counter
promtail_journal_target_lines_total 3777
# HELP promtail_mutated_bytes_total The total number of bytes that have been mutated.
# TYPE promtail_mutated_bytes_total counter
promtail_mutated_bytes_total{host="127.0.0.1:3100",reason="ingester_error",tenant=""} 0
promtail_mutated_bytes_total{host="127.0.0.1:3100",reason="line_too_long",tenant=""} 0
promtail_mutated_bytes_total{host="127.0.0.1:3100",reason="rate_limited",tenant=""} 0
promtail_mutated_bytes_total{host="127.0.0.1:3100",reason="stream_limited",tenant=""} 0
# HELP promtail_mutated_entries_total The total number of log entries that have been mutated.
# TYPE promtail_mutated_entries_total counter
promtail_mutated_entries_total{host="127.0.0.1:3100",reason="ingester_error",tenant=""} 0
promtail_mutated_entries_total{host="127.0.0.1:3100",reason="line_too_long",tenant=""} 0
promtail_mutated_entries_total{host="127.0.0.1:3100",reason="rate_limited",tenant=""} 0
promtail_mutated_entries_total{host="127.0.0.1:3100",reason="stream_limited",tenant=""} 0
# HELP promtail_read_bytes_total Number of bytes read.
# TYPE promtail_read_bytes_total gauge
promtail_read_bytes_total{path="/var/log/boot.log"} 0
promtail_read_bytes_total{path="/var/log/cloud-init-output.log"} 6947
promtail_read_bytes_total{path="/var/log/cloud-init.log"} 175539
promtail_read_bytes_total{path="/var/log/dnf.librepo.log"} 156389
promtail_read_bytes_total{path="/var/log/dnf.log"} 267585
promtail_read_bytes_total{path="/var/log/dnf.rpm.log"} 85186
promtail_read_bytes_total{path="/var/log/ensm/auth/auth-app.log"} 17225
promtail_read_bytes_total{path="/var/log/ensm/main/main-app.log"} 3931
promtail_read_bytes_total{path="/var/log/hawkey.log"} 180
# HELP promtail_read_lines_total Number of lines read.
# TYPE promtail_read_lines_total counter
promtail_read_lines_total{path="/var/log/cloud-init-output.log"} 110
promtail_read_lines_total{path="/var/log/cloud-init.log"} 1398
promtail_read_lines_total{path="/var/log/dnf.librepo.log"} 1005
promtail_read_lines_total{path="/var/log/dnf.log"} 2894
promtail_read_lines_total{path="/var/log/dnf.rpm.log"} 1106
promtail_read_lines_total{path="/var/log/ensm/auth/auth-app.log"} 117
promtail_read_lines_total{path="/var/log/ensm/main/main-app.log"} 21
promtail_read_lines_total{path="/var/log/hawkey.log"} 3
# HELP promtail_request_duration_seconds Duration of send requests.
# TYPE promtail_request_duration_seconds histogram
promtail_request_duration_seconds_bucket{host="127.0.0.1:3100",status_code="204",le="0.005"} 53
promtail_request_duration_seconds_bucket{host="127.0.0.1:3100",status_code="204",le="0.01"} 53
promtail_request_duration_seconds_bucket{host="127.0.0.1:3100",status_code="204",le="0.025"} 54
promtail_request_duration_seconds_bucket{host="127.0.0.1:3100",status_code="204",le="0.05"} 55
promtail_request_duration_seconds_bucket{host="127.0.0.1:3100",status_code="204",le="0.1"} 55
promtail_request_duration_seconds_bucket{host="127.0.0.1:3100",status_code="204",le="0.25"} 55
promtail_request_duration_seconds_bucket{host="127.0.0.1:3100",status_code="204",le="0.5"} 55
promtail_request_duration_seconds_bucket{host="127.0.0.1:3100",status_code="204",le="1"} 55
promtail_request_duration_seconds_bucket{host="127.0.0.1:3100",status_code="204",le="2.5"} 55
promtail_request_duration_seconds_bucket{host="127.0.0.1:3100",status_code="204",le="5"} 55
promtail_request_duration_seconds_bucket{host="127.0.0.1:3100",status_code="204",le="10"} 55
promtail_request_duration_seconds_bucket{host="127.0.0.1:3100",status_code="204",le="+Inf"} 55
promtail_request_duration_seconds_sum{host="127.0.0.1:3100",status_code="204"} 0.11550551599999999
promtail_request_duration_seconds_count{host="127.0.0.1:3100",status_code="204"} 55
# HELP promtail_sent_bytes_total Number of bytes sent.
# TYPE promtail_sent_bytes_total counter
promtail_sent_bytes_total{host="127.0.0.1:3100"} 341220
# HELP promtail_sent_entries_total Number of log entries sent to the ingester.
# TYPE promtail_sent_entries_total counter
promtail_sent_entries_total{host="127.0.0.1:3100"} 10431
# HELP promtail_targets_active_total Number of active total.
# TYPE promtail_targets_active_total gauge
promtail_targets_active_total 2
[root@rocky9-vm minn0701]# curl -v http://127.0.0.1:3100/loki/api/v1/labels
*   Trying 127.0.0.1:3100...
* Connected to 127.0.0.1 (127.0.0.1) port 3100 (#0)
> GET /loki/api/v1/labels HTTP/1.1
> Host: 127.0.0.1:3100
> User-Agent: curl/7.76.1
> Accept: */*
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< Content-Type: application/json; charset=UTF-8
< Vary: Accept-Encoding
< Date: Thu, 27 Nov 2025 01:13:26 GMT
< Content-Length: 80
<
{"status":"success","data":["filename","hostname","job","service_name","unit"]}
* Connection #0 to host 127.0.0.1 left intact
[root@rocky9-vm minn0701]#