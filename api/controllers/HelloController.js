// api/controllers/HelloController.js

module.exports = {
    hello: async function (req, res) {
        // Đặt breakpoint tại đây
        const message = "Hello, welcome to Sails.js!";

        // Log thông điệp vào console
        console.log(message);

        // Trả về thông điệp dưới dạng JSON
        return res.json({ message });
    }
};
