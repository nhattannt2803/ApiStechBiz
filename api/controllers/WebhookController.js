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
            const content = JSON.stringify(data);
            const telegramApiUrl = 'https://api.telegram.org/bot6022640946:AAH5PMaNZJXMKg2wJDhuG71oPZHkm8Kmn-4/sendMessage';
            const chatId = '-542594881';

            // Gửi yêu cầu POST đến API của Telegram
            const response = await fetch(telegramApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: content
                })
            });

            // Trả về mã trạng thái HTTP 200
            return res.ok();
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error('Error handling webhook:', error);
            return res.serverError(error);
        }
    }

};

