package leyans.RidersHub.Config.KafkaConfig.KafkaREST.Controller;


import leyans.RidersHub.Config.KafkaConfig.KafkaREST.Service.RiderProducerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/kafka")
public class KafkaRiderController {



    @Autowired
    private final RiderProducerService riderProducerService;


    public KafkaRiderController(RiderProducerService riderProducerService) {
        this.riderProducerService = riderProducerService;
    }

    @PostMapping("/send")
    public String sendMessage(@RequestParam String riderType, @RequestParam String message) {
        riderProducerService.sendMessage(riderType, message);
        return "Message sent to RiderType: " + riderType;
    }
}
