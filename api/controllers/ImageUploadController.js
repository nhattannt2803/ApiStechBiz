const axios = require('axios');
const FormData = require('form-data');
const fetch = require('node-fetch');

module.exports = {
  uploadFromUrlSmaxApp: async function (req, res) {
    try {
      // Lấy URL ảnh từ body của request
      const { imageUrl,folder_id,tokenSmax,alias } = req.body;

      // Tải xuống hình ảnh từ URL
      const response = await fetch(imageUrl);
      const buffer = await response.buffer();

      // Tạo form-data để gửi lên API đích
      const form = new FormData();
      form.append('folder_id', `${folder_id}`); // Thay thế bằng folder_id của bạn
      form.append('files', buffer, {
        filename: 'uploaded_image.png',
        contentType: 'image/png',
      });

      // Tạo header với các tùy chọn cần thiết
      const headers = {
        ...form.getHeaders(),
        'Accept': 'application/json, text/plain, */*',
        'Authorization': `${tokenSmax}`,
        'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryOiYhQAvob2Kt4Ehn'
      };

      // Gửi request đến API
      const uploadResponse = await axios.post(
        `https://smax.app/api/bizs/${alias}/storage/files`,
        form,
        { headers }
      );

      // Trả về kết quả upload thành công
      return res.json({
        message: 'Upload successful',
        data: uploadResponse.data
      });

    } catch (error) {
      // Xử lý lỗi và trả về thông báo lỗi
      sails.log.error('Upload failed:', error);
      return res.status(500).json({
        message: 'Upload failed',
        error: error.message,
      });
    }
  },
};
