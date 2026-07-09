package leyans.RidersHub.Utility.Finished;

import jakarta.persistence.EntityNotFoundException;
import leyans.RidersHub.DTO.Response.Rides.CheckpointArrivalResponse;
import leyans.RidersHub.DTO.Response.Finished.FinishedRideResponseDTO;
import leyans.RidersHub.DTO.Response.Finished.ParticipantProgressDTO;
import leyans.RidersHub.Repository.Finished.FinishedRideRepository;
import leyans.RidersHub.Repository.Rides.RideCheckpointArrivalRepository;
import leyans.RidersHub.Repository.Rides.RidesRepository;
import leyans.RidersHub.Repository.Rides.StartedRideRepository;
import leyans.RidersHub.Service.Location.RideLocationEmitterRegistry;
import leyans.RidersHub.Service.Rides.RideStatusService;
import leyans.RidersHub.Utility.Logger.AppLogger;
import leyans.RidersHub.Utility.Location.RideCalculationUtils;
import leyans.RidersHub.model.Auth.Rider;
import leyans.RidersHub.model.FinishedRide.FinishedRide;
import leyans.RidersHub.model.Rides.Rides;
import leyans.RidersHub.model.Rides.StartedRide;
import leyans.RidersHub.model.participant.RideCheckpointArrival;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;

@Service
public class FinishedRideUtility {

        private final RideCheckpointArrivalRepository rideCheckpointArrivalRepository;
        private final FinishedRideRepository finishedRideRepository;
        private final RidesRepository ridesRepository;
        private final StartedRideRepository startedRideRepository;
        private final RideStatusService rideStatusService;
        private final RideLocationEmitterRegistry rideLocationEmitterRegistry;

        public FinishedRideUtility(RideCheckpointArrivalRepository rideCheckpointArrivalRepository,
                                   FinishedRideRepository finishedRideRepository,
                                   RidesRepository ridesRepository,
                                   StartedRideRepository startedRideRepository,
                                   RideStatusService rideStatusService,
                                   RideLocationEmitterRegistry rideLocationEmitterRegistry) {
                this.rideCheckpointArrivalRepository = rideCheckpointArrivalRepository;
                this.finishedRideRepository = finishedRideRepository;
                this.ridesRepository = ridesRepository;
                this.startedRideRepository = startedRideRepository;
                this.rideStatusService = rideStatusService;
                this.rideLocationEmitterRegistry = rideLocationEmitterRegistry;
        }

        public FinishedRideResponseDTO buildAndSaveFinishedRide(
                StartedRide startedRide,
                Rides ride,
                Rider finishedBy,
                String generatedRidesId) {

                java.util.Set<Rider> participants = new java.util.HashSet<>(startedRide.getParticipants());
                LocalDateTime startTime = startedRide.getStartTime();

                List<RideCheckpointArrival> allArrivals = rideCheckpointArrivalRepository
                        .findByRideGeneratedRidesId(generatedRidesId);

                LocalDateTime endTime = allArrivals.stream()
                        .filter(a -> a.getCheckpointType() == RideCheckpointArrival.CheckpointType.ENDING)
                        .map(RideCheckpointArrival::getArrivedAt)
                        .max(Comparator.naturalOrder())
                        .orElse(LocalDateTime.now());

                int durationMinutes = (int) ChronoUnit.MINUTES.between(startTime, endTime);

                Double averageSpeedKph = RideCalculationUtils.computeAverageSpeedKph(
                        ride.getDistance(), durationMinutes);

                FinishedRide finishedRide = new FinishedRide(
                        ride,
                        finishedBy,
                        startTime,
                        endTime,
                        durationMinutes,
                        participants,
                        null,
                        averageSpeedKph,  ride.getRidesName(), ride.getLocationName());

                FinishedRide saved = finishedRideRepository.save(finishedRide);

                ride.setActive(false);
                ridesRepository.save(ride);
                rideStatusService.markFinished(generatedRidesId, "Ride finished");

                startedRideRepository.deleteRiderLocationsByStartedRideId(generatedRidesId);
                startedRideRepository.deleteParticipantLocationsByStartedRideId(generatedRidesId);
                startedRideRepository.deleteParticipantsByStartedRideId(generatedRidesId);
                startedRideRepository.delete(startedRide);
                startedRideRepository.flush();

                AppLogger.info(this.getClass(), "Ride finished and StartedRide cleaned up",
                        "generatedRidesId", generatedRidesId,
                        "durationMinutes", durationMinutes);

                FinishedRideResponseDTO response = new FinishedRideResponseDTO(saved);

                response.setParticipantProgress(buildParticipantProgress(allArrivals, participants, ride));

                List<CheckpointArrivalResponse> arrivals = allArrivals.stream()
                        .map(CheckpointArrivalResponse::new)
                        .toList();
                response.setCheckpointArrivals(arrivals);

                return response;
        }

        // =========================================================================
        // GET FINISHED RIDE SUMMARY
        // =========================================================================
        @Transactional(readOnly = true)
        public FinishedRideResponseDTO getFinishedRideSummary(String generatedRidesId) {
                FinishedRide finishedRide = finishedRideRepository
                        .findByRideGeneratedRidesId(generatedRidesId)
                        .orElseThrow(() -> new EntityNotFoundException(
                                "Finished ride not found: " + generatedRidesId));

                Rides ride = finishedRide.getRide();

                java.util.Set<Rider> participants = finishedRide.getCompletedParticipants();
                Hibernate.initialize(participants);

                List<RideCheckpointArrival> allArrivals = rideCheckpointArrivalRepository
                        .findByRideGeneratedRidesId(generatedRidesId);

                FinishedRideResponseDTO response = new FinishedRideResponseDTO(finishedRide);

                response.setParticipantProgress(buildParticipantProgress(allArrivals, participants, ride));

                List<CheckpointArrivalResponse> arrivals = allArrivals.stream()
                        .map(CheckpointArrivalResponse::new)
                        .toList();
                response.setCheckpointArrivals(arrivals);

                return response;
        }

        private List<ParticipantProgressDTO> buildParticipantProgress(
                List<RideCheckpointArrival> allArrivals,
                java.util.Set<Rider> participants,
                Rides ride) {

                int totalCheckpoints = 2 + (ride.getStopPoints() != null ? ride.getStopPoints().size() : 0);

                return participants.stream()
                        .map(rider -> {
                                List<RideCheckpointArrival> riderArrivals = allArrivals.stream()
                                        .filter(a -> a.getRider().getUsername()
                                                .equals(rider.getUsername()))
                                        .toList();

                                LocalDateTime arrivalTime = riderArrivals.stream()
                                        .filter(a -> a.getCheckpointType() == RideCheckpointArrival.CheckpointType.ENDING)
                                        .map(RideCheckpointArrival::getArrivedAt)
                                        .findFirst()
                                        .orElse(null);

                                // riderArrivals already excludes the starting point (it's auto-marked
                                // but not re-counted here), so add 1 to match totalCheckpoints math.
                                int checkpointsReached = riderArrivals.size();

                                String status = checkpointsReached == totalCheckpoints ? "COMPLETED"
                                        : checkpointsReached > 0 ? "PARTIALLY_COMPLETED"
                                          : "STARTED";

                                return new ParticipantProgressDTO(
                                        rider.getUsername(),
                                        checkpointsReached,
                                        totalCheckpoints,
                                        arrivalTime,
                                        status);
                        })
                        .toList();
        }

        @Transactional(readOnly = true)
        public FinishedRideResponseDTO buildPersonalFinishResponse(String generatedRidesId, Rider rider) {
                List<RideCheckpointArrival> arrivals = rideCheckpointArrivalRepository
                        .findByRideGeneratedRidesId(generatedRidesId);

                FinishedRideResponseDTO response = new FinishedRideResponseDTO();
                response.setGeneratedRidesId(generatedRidesId);
                response.setCheckpointArrivals(arrivals.stream()
                        .map(CheckpointArrivalResponse::new)
                        .toList());
                return response;
        }
}