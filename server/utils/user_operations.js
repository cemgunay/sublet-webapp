const User = require("../models/User");
const socket = require("../socket");

//function to use elsewhere
async function updateUser(id, updateData) {
  try {
    console.log('updatinggggggg here')
    const io = socket.getIO();
    const updatedUser = await User.findOneAndUpdate({ _id: id }, updateData, {
      new: true,
    });
    console.log(updatedUser)
     // Emit user updated event
     io.emit("userUpdated", updatedUser);
    return updatedUser;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  updateUser,
};
