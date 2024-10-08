/**
 * ApiControllerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

// Import node-fetch module
const fetch = require('node-fetch');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');

module.exports = {

    // Hàm lưu cache
    saveCache: async function (req, res) {
        try {
            const { key, value } = req.body;

            if (!key || !value) {
                return res.badRequest({ error: 'Missing key or value in request body' });
            }

            redisClient.set(key, JSON.stringify(value), function (err, reply) {
                if (err) {
                    console.error('Lỗi khi lưu cache:', err);
                    return res.serverError(err);
                }
                console.log('Đã lưu cache thành công: ' + key + ' value = ' + value);
                return res.json({ message: 'Cache saved successfully', reply });
            });
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
            return res.serverError(error);
        }
    },

    // Hàm lấy cache
    getCache: async function (req, res) {
        try {
            const { key } = req.params;

            if (!key) {
                return res.badRequest({ error: 'Missing key in request parameters' });
            }

            redisClient.get(key, function (err, reply) {
                if (err) {
                    console.error('Lỗi khi lấy cache:', err);
                    return res.serverError(err);
                }
                if (!reply) {
                    return res.notFound({ message: 'Cache not found' });
                }
                console.log('Đã lấy cache thành công: ' + key);
                return res.json(JSON.parse(reply));
            });
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
            return res.serverError(error);
        }
    },
    // Lấy thông tin hội thoại cụ thể
    getInforThreadUser: async function (req, res) {
        try {
            const { user_id, offset, count, bizId } = req.body;

            const accessToken = await getAcessTokenZalo({ bizId: bizId })
            // Kiểm tra xem user_id có tồn tại hay không

            if (!user_id) {
                return res.badRequest({ error: 'user_id is required' });
            }
            // URL của API
            const url = `https://openapi.zalo.me/v2.0/oa/conversation?data={"user_id":${user_id},"offset":${offset || 0},"count":${count || 5}}`;

            // Tạo options cho fetch bao gồm phương thức và header
            const options = {
                method: 'GET',
                headers: {
                    'access_token': `${accessToken}`, // Thay thế <your_access_token> bằng access token thực tế của bạn
                    'Content-Type': 'application/json'
                }
            };

            // Gọi API
            const response = await fetch(url, options);

            // Chuyển đổi kết quả trả về thành đối tượng JSON
            const data = await response.json();

            // Trả về kết quả cho người dùng
            return res.json(data);
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error('Lỗi khi gọi API:', error);
            return res.serverError(error);
        }
    },
    // Lấy thông tin chi tiết người dùng
    getInforUser: async function (req, res) {
        try {
            const { user_id, bizId } = req.body;

            const accessToken = await getAcessTokenZalo({ bizId: bizId })
            // Kiểm tra xem user_id có tồn tại hay không

            if (!user_id) {
                return res.badRequest({ error: 'user_id is required' });
            }
            // URL của API
            const url = `https://openapi.zalo.me/v3.0/oa/user/detail?data={"user_id":${user_id}}`;

            // Tạo options cho fetch bao gồm phương thức và header
            const options = {
                method: 'GET',
                headers: {
                    'access_token': `${accessToken}`, // Thay thế <your_access_token> bằng access token thực tế của bạn
                    'Content-Type': 'application/json'
                }
            };

            // Gọi API
            const response = await fetch(url, options);

            // Chuyển đổi kết quả trả về thành đối tượng JSON
            const data = await response.json();

            // Trả về kết quả cho người dùng
            return res.json(data);
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error('Lỗi khi gọi API:', error);
            return res.serverError(error);
        }
    },
    recognize: async function (req, res) {
        try {
            const image = req.file('image')._files[0].stream;
            const result = await Tesseract.recognize(image, 'eng', {
                logger: m => console.log(m)
            });
            return res.json({ text: result.data.text });
        } catch (error) {
            return res.serverError(error);
        }
    },
    recognizeUrl: async function (req, res) {

        try {
            const imageUrl = req.body.imageUrl;
            const imagePath = path.join(__dirname, 'temp-image.jpg');
            console.log('====================================');
            console.log(imageUrl);
            console.log('====================================');
            // Tải xuống hình ảnh từ URL
            const response = await fetch(imageUrl);
            const buffer = await response.buffer();

            // Lưu hình ảnh tạm thời
            fs.writeFileSync(imagePath, buffer);

            // Sử dụng Tesseract.js để nhận dạng văn bản
            const result = await Tesseract.recognize(imagePath, 'eng', {
                // logger: m => console.log(m)
            });

            // Xóa hình ảnh tạm thời sau khi xử lý xong
            fs.unlinkSync(imagePath);

            // Trả về kết quả
            console.log('====================================');
            console.log(result.data.text);
            console.log('====================================');
            return res.json({ text: result.data.text });
        } catch (error) {
            return res.serverError(error);
        }
    }
};

async function getAcessTokenZalo(e) {
    try {
        const resData = await fetch('https://script.google.com/macros/s/AKfycbzhj_L7FnTPRlUfYgOH8NOZCswatLLReiSkQzj0nQqIgy8PjGcH5Jd7SMM0-hLRF6e-/exec?idChucNang=8', {
            method: "POST",
            headers: {},
            body: JSON.stringify({
                bizId: e.bizId
            })
        })

        const acessTokenZalo = await resData.json();
        if (acessTokenZalo.giaTriTraVe) {

            return acessTokenZalo.giaTriTraVe
        }
    } catch (error) {
        console.error('Lỗi khi gửi thông tin cho API abc.com:', error);
        throw error; // Ném lỗi để xử lý ở bước gọi hàm này
    }
}







