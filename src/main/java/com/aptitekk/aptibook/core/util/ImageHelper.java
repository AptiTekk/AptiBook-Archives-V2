/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.util;

import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.geometry.Positions;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class ImageHelper {

    /**
     * Removes the alpha from the provided image, replacing it with white.
     *
     * @param image The image to remove alpha from.
     * @return A buffered image without an alpha channel.
     */
    public static BufferedImage removeAlpha(BufferedImage image) {
        BufferedImage tempRgbImage = new BufferedImage(image.getWidth(), image.getHeight(), BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = tempRgbImage.createGraphics();
        g2d.setColor(Color.WHITE); // Or what ever fill color you want...
        g2d.fillRect(0, 0, tempRgbImage.getWidth(), tempRgbImage.getHeight());
        g2d.drawImage(image, 0, 0, null);
        g2d.dispose();
        return tempRgbImage;
    }

    /**
     * Scales the image to (at maximum) the specified size in pixels. (Width or height).
     *
     * @param image  The image to scale.
     * @param sizePx The maximum height or width of the image. (Whichever is greater.)
     * @return A scaled image.
     * @throws IOException If scaling did not succeed.
     */
    public static BufferedImage scaleDownImageToBounds(BufferedImage image, int sizePx) throws IOException {

        //Only scale if the image is bigger than the bounds.
        if (image.getWidth() > sizePx || image.getHeight() > sizePx)
            return Thumbnails.of(image)
                    .size(sizePx, sizePx)
                    .outputQuality(1.0)
                    .asBufferedImage();

        //Otherwise just return the image.
        return image;
    }

    /**
     * Crops the image to 1:1 proportion (square).
     *
     * @param image    The image to crop.
     * @param position The position of the crop.
     * @return The cropped image.
     */
    public static BufferedImage cropToSquare(BufferedImage image, Positions position) throws IOException {
        int maxSize = image.getWidth() > image.getHeight() ? image.getHeight() : image.getWidth();

        return Thumbnails.of(image)
                .size(maxSize, maxSize)
                .crop(position)
                .outputQuality(1.0)
                .asBufferedImage();
    }

    /**
     * Parses the image as a JPEG into a byte array.
     *
     * @param bufferedImage The image to parse.
     * @return The parsed image as a byte array.
     * @throws IOException If parsing failed.
     */
    public static byte[] parseImageAsJPEG(BufferedImage bufferedImage) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage, "JPG", outputStream);
        return outputStream.toByteArray();
    }

}
