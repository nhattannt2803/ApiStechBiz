const fetch = require('node-fetch');
require('dotenv').config(); // Tải biến môi trường
const sharp = require('sharp');

const apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY; // Sử dụng biến môi trường; // Sử dụng biến môi trường
const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;


module.exports = {

    recognize: async function (req, res) {
        try {
            const imageUrl = req.body.imageUrl;

            // Tải xuống hình ảnh từ URL
            const response = await fetch(imageUrl);
            const buffer = await response.buffer();

            // Kiểm tra kích thước ảnh ban đầu
            const metadata = await sharp(buffer).metadata();
            const maxWidth = 1000;

            let resizedImageBuffer = buffer;

            if (metadata.width > maxWidth) {
                // Tính toán phần trăm cần giảm
                const reductionPercentage = maxWidth / metadata.width;

                // Giảm kích thước ảnh dựa trên phần trăm
                resizedImageBuffer = await sharp(buffer)
                    .resize({ width: Math.round(metadata.width * reductionPercentage) })
                    .toBuffer();
            }

            const encodedImage = resizedImageBuffer.toString('base64');

            const requestPayload = {
                "requests": [
                    {
                        "image": {
                            "content": encodedImage
                        },
                        "features": [
                            {
                                "type": "TEXT_DETECTION",
                                "maxResults": 1
                            }
                        ]
                    }
                ]
            };

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestPayload)
            };

            const visionResponse = await fetch(visionApiUrl, options);
            const visionResult = await visionResponse.json();

            // Lọc và lấy nội dung văn bản chính từ kết quả trả về
            const fullTextAnnotation = visionResult.responses[0].fullTextAnnotation;
            const text = fullTextAnnotation ? fullTextAnnotation.text : '';

            // Trả về kết quả
            return res.json({ text: text });
        } catch (error) {
            return res.serverError(error);
        }
    }
};