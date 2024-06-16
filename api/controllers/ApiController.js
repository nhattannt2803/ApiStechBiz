/**
 * ApiControllerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

// Import node-fetch module
const fetch = require('node-fetch');

module.exports = {
    // Hàm gọi API
    callAPI: async function (req, res) {
        try {
            // Gọi API để lấy danh sách các bài viết
            const response = await fetch('https://jsonplaceholder.typicode.com/posts');

            // Chuyển đổi kết quả trả về thành đối tượng JSON
            const posts = await response.json();

            // In ra màn hình console để kiểm tra kết quả
            console.log('Danh sách bài viết:', posts);

            // Trả về kết quả cho người dùng (ở đây mình chỉ log kết quả ra console)
            return res.json(posts);
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error('Lỗi khi gọi API:', error);
            return res.serverError(error);
        }
    },

    createPost: async function (req, res) {
        try {
            // Dữ liệu cần gửi đi
            const postData = {
                title: 'New post',
                body: 'Lorem ipsum dolor sit amet.',
                userId: 1 // ID của người dùng tạo bài viết
            };

            // Gửi yêu cầu POST đến API để tạo bài viết mới
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            // Chuyển đổi kết quả trả về thành đối tượng JSON
            const newPost = await response.json();

            // In ra màn hình console để kiểm tra kết quả
            console.log('Bài viết mới được tạo:', newPost);

            // Trả về kết quả cho người dùng (ở đây mình chỉ log kết quả ra console)
            return res.json(newPost);
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error('Lỗi khi gọi API:', error);
            return res.serverError(error);
        }
    },
    getInfoAndSendToAbc: async function (req, res) {
        try {
            // Bước 1: Nhận các giá trị từ phần body
            const { url, method, body } = req.body;

            // Bước 2: Gọi tới API Zalo để lấy thông tin profile
            const responseZalo = await fetch('https://openapi.zalo.me/v2.0/oa/getprofile?data={"user_id":"301295182794766761"}', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'access_token': 'YOUR_ACCESS_TOKEN' // Thay YOUR_ACCESS_TOKEN bằng token thực tế của bạn
                }
            });

            // Kiểm tra nếu kết quả gọi API Zalo không thành công
            if (!responseZalo.ok) {
                throw new Error('Không thể lấy thông tin profile từ Zalo');
            }

            // Chuyển đổi kết quả trả về từ Zalo thành đối tượng JSON
            const profileData = await responseZalo.json();

            // Bước 3: Truyền kết quả từ Zalo cho hàm truyenGiaTri
            await truyenGiaTri(profileData);

            // Trả về kết quả thành công
            return res.ok('Thông tin đã được gửi thành công cho API abc.com');
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error('Lỗi khi gọi API:', error);
            return res.serverError(error);
        }
    }
};

// Hàm truyenGiaTri nhận kết quả từ Zalo và gửi cho API abc.com
async function truyenGiaTri(profileData) {
    try {
        // Bước 4: Gửi kết quả từ Zalo cho API abc.com
        const responseAbc = await fetch('https://abc.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData)
        });

        // Kiểm tra nếu gửi kết quả cho API abc.com không thành công
        if (!responseAbc.ok) {
            throw new Error('Không thể gửi thông tin cho API abc.com');
        }

        // In ra màn hình console để kiểm tra kết quả
        console.log('Thông tin đã được gửi thành công cho API abc.com');
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Lỗi khi gửi thông tin cho API abc.com:', error);
        throw error; // Ném lỗi để xử lý ở bước gọi hàm này
    }
};





