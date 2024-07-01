/**
 * HashController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const crypto = require('crypto');
const fetch = require('node-fetch');  // Đảm bảo đã cài đặt thư viện này: npm install node-fetch

module.exports = {
    generateAndPostHash: async function (req, res) {
        try {
            // Lấy nội dung và khóa từ yêu cầu
            const { content, key } = req.body;

            if (!content || !key) {
                return res.badRequest({ error: 'Content and key are required.' });
            }

            // Tạo mã băm SHA256
            const hash = crypto.createHmac('sha256', key)
                .update(content)
                .digest('hex');

            return res.json({ hash: hash })
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error('Lỗi khi gọi API:', error);
            return res.serverError(error);
        }
    }
};


