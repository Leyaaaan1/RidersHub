package leyans.RidersHub.Service;

import leyans.RidersHub.DTO.JoinRequestCreateDto;
import leyans.RidersHub.DTO.Response.JoinResponseDTO;
import leyans.RidersHub.Repository.RideJoinRequestRepository;
import leyans.RidersHub.Repository.RidesRepository;
import leyans.RidersHub.model.RideJoinRequest;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.Rides;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class RideJoinRequestService {

    private final RideJoinRequestRepository rideJoinRequestRepository;
    private final RidesRepository ridesRepository;

    private final RideParticipantService rideParticipantService;

    @Autowired
    public RideJoinRequestService(
            RideJoinRequestRepository rideJoinRequestRepository,
            RidesRepository ridesRepository, RideParticipantService rideParticipantService) {
        this.rideJoinRequestRepository = rideJoinRequestRepository;
        this.ridesRepository = ridesRepository;
        this.rideParticipantService = rideParticipantService;
    }

//    public List<RideJoinRequest> getAllJoinRequests() {
//        return rideJoinRequestRepository.findAll();
//    }
//
//    public List<RideJoinRequest> getJoinRequestsByRideId(Integer rideId) {
//        return rideJoinRequestRepository.findByRide_RidesId(rideId);
//    }
//
//    public List<RideJoinRequest> getJoinRequestsByUsername(String username) {
//
//        return rideJoinRequestRepository.findByRider_Username(username);
//    }
//
//    public Optional<RideJoinRequest> getJoinRequest(Integer rideId, String username) {
//        return rideJoinRequestRepository.findByRide_RidesIdAndRider_Username(rideId, username);
//    }

    @Transactional
    public JoinResponseDTO createJoinRequest(JoinRequestCreateDto createDto) {

        Integer rideId = createDto.getRideId();
        String username = createDto.getUsername();

        Optional<RideJoinRequest> existingRequest =
                rideJoinRequestRepository.findByRide_RidesIdAndRider_Username(rideId, username);

        if (existingRequest.isPresent()) {
            RideJoinRequest request = existingRequest.get();
            return convertToDTO(request);
        }

        Rides ride = rideParticipantService.findRideById(rideId);
        Rider rider = rideParticipantService.findRiderByUsername(username);

        RideJoinRequest request = new RideJoinRequest();
        request.setRide(ride);
        request.setRider(rider);

        RideJoinRequest savedRequest = rideJoinRequestRepository.save(request);
        return convertToDTO(savedRequest);
    }

    private JoinResponseDTO convertToDTO(RideJoinRequest request) {
        return new JoinResponseDTO(
                request.getId(),
                request.getRide().getRidesId(),
                request.getRider().getUsername()
        );
    }

    @Transactional
    public JoinResponseDTO acceptJoinRequest(Integer rideId, String username, String ridesOwner) {

        RideJoinRequest request = rideJoinRequestRepository
                .findByRide_RidesIdAndRider_Username(rideId, username)
                .orElseThrow(() -> new RuntimeException("Join request not found"));

        Rides ride = request.getRide();

        if (!ride.getUsername().getUsername().equals(ridesOwner)) {
            throw new RuntimeException("Only the ride owner can accept join requests");
        }

        Rider rider = request.getRider();
        ride.addParticipant(rider);
        ridesRepository.save(ride);

        JoinResponseDTO responseDTO = convertToDTO(request);
        rideJoinRequestRepository.delete(request);
        return responseDTO;
    }




}