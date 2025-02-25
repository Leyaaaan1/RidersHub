package leyans.RidersHub.Config.KafkaConfig.KafkaREST.Controller;


import leyans.RidersHub.Config.KafkaConfig.KafkaREST.Producer.RiderProducer;
import leyans.RidersHub.Config.KafkaConfig.KafkaREST.Service.RiderProducerService;
import leyans.RidersHub.DTO.RiderTypeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/kafka")
public class KafkaRiderController {

    @Autowired
    private final RiderProducerService riderProducerService;

    public KafkaRiderController(RiderProducerService riderProducerService) {
        this.riderProducerService = riderProducerService;
    }


    @PostMapping("/send")
    public String sendMessage(@RequestBody RiderTypeDTO riderMessageDTO) {
        riderProducerService.sendMessage(riderMessageDTO);
        return "Message sent for RiderType: " + riderMessageDTO.getRiderType();
    }
}
