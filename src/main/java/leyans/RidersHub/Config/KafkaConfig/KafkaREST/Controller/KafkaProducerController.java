package leyans.RidersHub.Config.KafkaConfig.KafkaREST.Controller;


import leyans.RidersHub.Config.KafkaConfig.KafkaREST.Service.KafkaProducerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class KafkaProducerController {

    @Autowired
    private KafkaProducerService kafkaProducerService;

    @GetMapping("/sendCar")
    public void sendMessage(
            @RequestParam("riderType") String riderType,
            @RequestParam("message") String message) {

        kafkaProducerService.sendMessage(riderType, message);

    }

    @GetMapping("/sendMotor")
    public void sendMotor(
            @RequestParam("riderType") String riderType,
            @RequestParam("message") String message) {

        kafkaProducerService.sendMotor(riderType, message);

    }

    @GetMapping("/sendBike")
    public void sendBike(
            @RequestParam("riderType") String riderType,
            @RequestParam("message") String message) {

        kafkaProducerService.sendBike(riderType, message);

    }




}
