const bcrypt = require('bcrypt');
const User = require('./userModel');


const save = async (body) => {
    const hash = await bcrypt.hash(body.password, 10);
    const user = { ...body, password: hash };
    await User.create(user);
}

const findByEmail = async () => {
    return await User.findOne({ email})
}

module.exports = {save, findByEmail}; 