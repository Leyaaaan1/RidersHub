package leyans.RidersHub.Utility;

import org.apache.hc.client5.http.classic.HttpClient;
import org.apache.hc.client5.http.config.RequestConfig;
import org.apache.hc.client5.http.impl.classic.HttpClientBuilder;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManager;
import org.apache.hc.core5.util.Timeout;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {
        @Bean
        public RestTemplate restTemplate() {
                RequestConfig requestConfig = RequestConfig.custom()
                                .setConnectTimeout(Timeout.ofSeconds(10))
                                .setResponseTimeout(Timeout.ofSeconds(45))
                                .build();

                PoolingHttpClientConnectionManager connectionManager = new PoolingHttpClientConnectionManager();
                // Re-validate a pooled connection if it's been idle for >1s before reuse
                connectionManager.setValidateAfterInactivity(org.apache.hc.core5.util.TimeValue.ofSeconds(1));

                HttpClient httpClient = HttpClientBuilder.create()
                                .setConnectionManager(connectionManager)
                                .setDefaultRequestConfig(requestConfig)
                                .evictIdleConnections(org.apache.hc.core5.util.TimeValue.ofSeconds(30))
                                .evictExpiredConnections()
                                .build();

                HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory(httpClient);

                return new RestTemplate(factory);
        }
}