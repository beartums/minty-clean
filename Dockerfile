FROM ruby:2.5.7
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
      echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
      apt-get update && apt-get install -y --no-install-recommends \
      nodejs \
      postgresql-client \
      yarn \
      npm \
      chromium && \
      apt-get autoremove -y && \
      apt-get clean && \
      rm -rf /var/lib/apt/lists/*

ENV CHROME_BIN=chromium  
ENV OPENSSL_CONF=/etc/ssl

RUN mkdir /myapp
WORKDIR /myapp
COPY . /myapp
RUN bundle install && yarn install --check-files
RUN gem install mailcatcher
