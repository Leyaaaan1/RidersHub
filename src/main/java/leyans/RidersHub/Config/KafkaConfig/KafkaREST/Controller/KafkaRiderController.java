package leyans.RidersHub.Config.KafkaConfig.KafkaREST.Controller;


import leyans.RidersHub.Config.KafkaConfig.KafkaREST.Producer.RiderProducer;
import leyans.RidersHub.DTO.RiderTypeDTO;
import leyans.RidersHub.Service.RiderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/kafka")
public class KafkaRiderController {

    @Autowired
    private final RiderService riderService;

    @Autowired
    private final RiderProducer riderProducer;

    public KafkaRiderController(RiderService riderService, RiderProducer riderProducer) {
        this.riderService = riderService;
        this.riderProducer = riderProducer;
    }


    @PostMapping("/send")
    public String sendMessage(@RequestParam String riderType, @RequestParam String message) {
        riderService.sendMessageFromService(riderType, message);
        return "Message sent for RiderType: " + riderType  + " " + message + "!";
    }
}
