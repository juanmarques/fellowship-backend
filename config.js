module.exports = {
    PORT: process.env.PORT || 4001,
    MONGODB_URI: process.env.MONGODB_URI || "mongodb+srv://fellowship:XlU5N87iyxVmXPXt@jm-cluster.8117u.mongodb.net/fellowship?retryWrites=true&w=majority",
    JWT_SECRET: process.env.JWT_SECRET || "FELLOWSECRET",
    JWT_EXP: process.env.JWT_EXPIRE || '10h',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@gmail.com",
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "admin@123",
}