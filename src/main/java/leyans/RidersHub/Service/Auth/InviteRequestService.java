package leyans.RidersHub.Service.Auth;


import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import leyans.RidersHub.Repository.Auth.InviteRequestRepository;
import leyans.RidersHub.Service.MapService.MapBox.UploadImageService;
import leyans.RidersHub.Utility.InviteUtil;
import leyans.RidersHub.Utility.RiderUtil;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.Rides;
import leyans.RidersHub.model.Invite.InviteRequest;
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
    private final UploadImageService uploadImageService;

    private final InviteUtil inviteUtil;


    private final RiderUtil riderUtil;

    @Value("${baseurl}")
    private String baseUrl;


    public InviteRequestService(InviteRequestRepository inviteRequestRepository, UploadImageService uploadImageService, InviteUtil inviteUtil, RiderUtil riderUtil) {
        this.inviteRequestRepository = inviteRequestRepository;
        this.uploadImageService = uploadImageService;
        this.inviteUtil = inviteUtil;
        this.riderUtil = riderUtil;
    }

    @Transactional
    public InviteRequest generateInviteForNewRide(Integer generatedRidesId,
                                                  Rider creator,
                                                  InviteRequest.InviteStatus inviteStatus,
                                                  LocalDateTime createdAt,
                                                  LocalDateTime expiresAt) {
        Rides ride = riderUtil.findRideById(generatedRidesId);

        // Use the constructor that accepts inviteStatus so fields are initialized (it calls this())
        InviteRequest inviteLink = new InviteRequest(ride, creator, inviteStatus, createdAt, expiresAt);

        String inviteUrl = baseUrl + "/invite/link/" + inviteLink.getInviteToken();
        inviteLink.setInviteLink(inviteUrl);

        String qrCodeBase64 = generateQRCodeBase64(inviteUrl);
        inviteLink.setQrCodeBase64(qrCodeBase64);

        String cloudinaryUrl = uploadImageService.uploadQrCodeBase64(qrCodeBase64, "ride_invites");
        inviteLink.setQr(cloudinaryUrl);

        return inviteRequestRepository.save(inviteLink);
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

    @Transactional(readOnly = true)
    public String getInviteUrlByRideId(Integer generatedRidesId) {
        InviteRequest invite = inviteUtil.findInviteByRideId(generatedRidesId);
        inviteUtil.validateInviteNotExpired(invite);
        return invite.getInviteLink();
    }


    @Transactional(readOnly = true)
    public String getQrCodeUrlByRideId(Integer generatedRidesId) {
        InviteRequest invite = inviteUtil.findInviteByRideId(generatedRidesId);
        inviteUtil.validateInviteNotExpired(invite);
        return invite.getQr();
    }


    @Transactional(readOnly = true)
    public String getQrCodeBase64ByRideId(Integer rideId) {
        InviteRequest invite = inviteUtil.findInviteByRideId(rideId);
        inviteUtil.validateInviteNotExpired(invite);
        return invite.getQrCodeBase64();
    }
}