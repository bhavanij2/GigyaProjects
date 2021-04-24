package com.monsanto.acs2.user.registration.service;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;

import com.amazonaws.services.sqs.AmazonSQS;
import com.amazonaws.services.sqs.AmazonSQSClientBuilder;

import com.amazonaws.services.sqs.model.SendMessageRequest;
import com.amazonaws.ClientConfiguration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.vault.core.VaultOperations;
import org.springframework.vault.support.VaultResponse;

import javax.jms.Session;
import javax.jms.MessageProducer;
import javax.jms.TextMessage;
import java.util.Map;
import java.util.UUID;

@Component
public class SQSService {
  private final VaultOperations vaultOperations;

  @Value("${aws.user.vault.path}")
  private String vaultAwsUserPath;

  public SQSService(VaultOperations vaultOperations) {
    this.vaultOperations = vaultOperations;
  }

  public void sendSQS(String inputMessage) {
      VaultResponse vaultResponse = vaultOperations.read(vaultAwsUserPath);
      Map<String, Object> awsProps = vaultResponse.getData();
      BasicAWSCredentials awsCreds = new BasicAWSCredentials((String) awsProps.get("aws_access_key_id"),
              (String) awsProps.get("aws_secret_access_key"));

      final AmazonSQS sqs = AmazonSQSClientBuilder.standard().withRegion(Regions.US_EAST_1)
        .withClientConfiguration(new ClientConfiguration()).withCredentials(new AWSStaticCredentialsProvider(awsCreds)).build();

      String queueUrl = sqs.getQueueUrl("acs2-c7-entitlement-audit").getQueueUrl();
      SendMessageRequest send_msg_request = new SendMessageRequest()
              .withQueueUrl(queueUrl)
              .withMessageBody(inputMessage);

      sqs.sendMessage(send_msg_request);
  }
}
