FROM mongo:3.4

# Install utilities
RUN apt-get update -y && apt-get install -y curl unzip

# Install consul
RUN export CONSUL_VERSION=0.7.2 \
    && export CONSUL_CHECKSUM=aa97f4e5a552d986b2a36d48fdc3a4a909463e7de5f726f3c5a89b8a1be74a58 \
    && curl --retry 7 --fail -vo /tmp/consul.zip "https://releases.hashicorp.com/consul/${CONSUL_VERSION}/consul_${CONSUL_VERSION}_linux_amd64.zip" \
    && echo "${CONSUL_CHECKSUM}  /tmp/consul.zip" | sha256sum -c \
    && unzip /tmp/consul -d /usr/local/bin \
    && rm /tmp/consul.zip \
    && mkdir /config

# Install ContainerPilot
ENV CONTAINERPILOT_VERSION 2.6.0
RUN export CP_SHA1=c1bcd137fadd26ca2998eec192d04c08f62beb1f \
    && curl -Lso /tmp/containerpilot.tar.gz \
         "https://github.com/joyent/containerpilot/releases/download/${CONTAINERPILOT_VERSION}/containerpilot-${CONTAINERPILOT_VERSION}.tar.gz" \
    && echo "${CP_SHA1}  /tmp/containerpilot.tar.gz" | sha1sum -c \
    && tar zxf /tmp/containerpilot.tar.gz -C /bin \
    && rm /tmp/containerpilot.tar.gz

# COPY ContainerPilot configuration
ENV CONTAINERPILOT_PATH=/etc/containerpilot.json
COPY containerpilot.json ${CONTAINERPILOT_PATH}
ENV CONTAINERPILOT=file://${CONTAINERPILOT_PATH}

ENTRYPOINT ["/bin/containerpilot", "mongod"]
