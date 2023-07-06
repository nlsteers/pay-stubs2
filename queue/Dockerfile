FROM softwaremill/elasticmq-native:1.4.2

COPY elasticmq.conf /opt/elasticmq.conf

EXPOSE 9324 9325

ENTRYPOINT ["/sbin/tini", "--", "/opt/docker/bin/elasticmq-native-server", "-Dconfig.file=/opt/elasticmq.conf"]

