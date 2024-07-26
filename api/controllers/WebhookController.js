/**
 * WebhookController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    handleWebhook: async function (req, res) {
        try {
            // Lấy dữ liệu từ body của yêu cầu
            const data = req.body;

            // In dữ liệu ra console để kiểm tra
            console.log('Webhook received:', data);

            // Xử lý dữ liệu (nếu cần)

            // Trả về mã trạng thái HTTP 200
            return res.ok();
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error('Error handling webhook:', error);
            return res.serverError(error);
        }
    }

};

