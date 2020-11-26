module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        userId: String,
        authToken: String
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const UserLog = mongoose.model("UserLog", schema);
    return UserLog;
  };
  