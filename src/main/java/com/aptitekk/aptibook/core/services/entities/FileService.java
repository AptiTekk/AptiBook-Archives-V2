/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.entities;

import com.aptitekk.aptibook.core.domain.entities.File;
import com.aptitekk.aptibook.core.logging.LogService;
import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.geometry.Positions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import javax.servlet.http.Part;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class FileService extends MultiTenantRepositoryAbstract<File> {

    private static final int MAX_IMAGE_SIZE_PX = 1000;

    @Autowired
    private LogService logService;

    /**
     * Uploads the image, scales it, and crops it.
     *
     * @param part The image part file.
     * @return A File entity containing the data of the image.
     * @throws IOException If the image is not a true image, or otherwise cannot be parsed.
     */
    public File createFileFromImagePart(Part part) throws IOException {
        if (part == null) {
            logService.logError(getClass(), "Attempt to upload image failed due to a null Part");
            return null;
        }

        BufferedImage bufferedImage = ImageIO.read(part.getInputStream());

        // Convert the image to remove the Alpha channel if it exists.
        BufferedImage tempRgbImage = new BufferedImage(bufferedImage.getWidth(), bufferedImage.getHeight(), BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = tempRgbImage.createGraphics();
        g2d.setColor(Color.WHITE); // Or what ever fill color you want...
        g2d.fillRect(0, 0, tempRgbImage.getWidth(), tempRgbImage.getHeight());
        g2d.drawImage(bufferedImage, 0, 0, null);
        g2d.dispose();
        bufferedImage = tempRgbImage;

        // Scale the image up or down first
        int requiredWidthHeight;

        if (bufferedImage.getWidth() > MAX_IMAGE_SIZE_PX || bufferedImage.getHeight() > MAX_IMAGE_SIZE_PX)
            requiredWidthHeight = MAX_IMAGE_SIZE_PX;
        else if (bufferedImage.getWidth() > bufferedImage.getHeight())
            requiredWidthHeight = bufferedImage.getWidth();
        else
            requiredWidthHeight = bufferedImage.getHeight();

        bufferedImage = Thumbnails.of(bufferedImage)
                .size(requiredWidthHeight, requiredWidthHeight)
                .crop(Positions.CENTER)
                .outputQuality(1.0)
                .asBufferedImage();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage, "JPG", outputStream);
        byte[] output = outputStream.toByteArray();
        if (output != null) {
            File file = new File();
            file.setData(output);

            return save(file);
        } else {
            logService.logError(getClass(), "Attempt to upload image failed due to a null byte array output.");
            return null;
        }
    }

}
