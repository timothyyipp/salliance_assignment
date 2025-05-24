const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
  linkedinId: {type: String, required: true},
  name: {type: String, required: true},
  email: {type: String, required: true}
});

module.exports = mongoose.model('User', userSchema);