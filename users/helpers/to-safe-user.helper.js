const toSafeUser = (userDoc) => {
  const user = userDoc.toObject();

  delete user.password;
  delete user.__v;
  delete user.createdAt;
  delete user.updatedAt;

  return user;
};

module.exports = { toSafeUser };
