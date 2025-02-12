package leyans.RidersHub.Config.KafkaConfig.Controller;


import leyans.RidersHub.Config.KafkaConfig.Service.KafkaProducerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/kafka")
public class KafkaProducerController {

    @Autowired
    private KafkaProducerService kafkaProducerService;

    @GetMapping("/send")
    public void sendMessage(@RequestParam("message") String message) {
        kafkaProducerService.sendMessage(message);
    }



}
