package leyans.RidersHub.Service.Auth;


import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import leyans.RidersHub.Repository.Auth.InviteRequestRepository;
import leyans.RidersHub.Repository.RiderRepository;
import leyans.RidersHub.Service.RidesService;
import leyans.RidersHub.Utility.RiderUtil;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.Rides;
import leyans.RidersHub.model.auth.InviteRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
public class InviteRequestService {

    private final InviteRequestRepository inviteRequestRepository;
    private final RidesService ridesService;

    private final RiderRepository riderRepository;

    private final RiderUtil riderUtil;

    @Value("${baseurl}")
    private String baseUrl;


    public InviteRequestService(InviteRequestRepository inviteRequestRepository, RidesService ridesService, RiderRepository riderRepository, RiderUtil riderUtil) {
        this.inviteRequestRepository = inviteRequestRepository;
        this.ridesService = ridesService;
        this.riderRepository = riderRepository;
        this.riderUtil = riderUtil;
    }


    @Transactional
    public InviteRequest generateInviteRequestsForRide(Integer generatedRideId, String username, InviteRequest.InviteType inviteType) {

        Rides ride = riderUtil.findRideById(generatedRideId);

        Rider creator = riderUtil.findRiderByUsername(username);

        LocalDateTime createdAt = LocalDateTime.now();
        LocalDateTime expiresAt = createdAt.plusDays(10);

        InviteRequest inviteRequest = new InviteRequest(ride, creator, InviteRequest.InviteStatus.PENDING, createdAt, expiresAt);

        if (inviteType == InviteRequest.InviteType.qr) {
            String urlToken = baseUrl + "/sample/sample" + inviteRequest.getInviteToken();
            String qrCodeBase64 = generateQRCodeBase64(urlToken);
            inviteRequest.setQrCodeBase64(qrCodeBase64);

        }
        return inviteRequestRepository.save(inviteRequest);


    }

    private String generateQRCodeBase64(String urlToken) {

        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(urlToken, BarcodeFormat.QR_CODE, 300, 300);

            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
            byte[] qrCodeBytes = pngOutputStream.toByteArray();

            return Base64.getEncoder().encodeToString(qrCodeBytes);

        } catch (WriterException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }


    }
}
